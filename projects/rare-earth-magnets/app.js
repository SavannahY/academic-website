'use strict';
const stages = [
  {id:1,title:'Mining',group:'mining',description:'Extract rare-earth-bearing ore or other mineral feed. Geological diversity creates options, but the feed still needs a compatible processing route.',input:'Rare-earth mineral deposit',output:'Ore or extracted mineral feed',constraint:'Ore grade, recovery, permitting and feed compatibility'},
  {id:2,title:'Upgrading',group:'mining',description:'Concentrate a mineral feed before chemical separation. A tonne of ore is not a tonne of neodymium, and neither is a tonne of qualified magnet.',input:'Ore or mineral feed',output:'Rare-earth-bearing concentrate',constraint:'Beneficiation yield, mineralogy and impurities'},
  {id:3,title:'Separation',group:'refining',description:'Separate chemically similar rare-earth elements into usable compounds. Neodymium and dysprosium remain separate material accounts in the experiment.',input:'Mixed rare-earth feed',output:'Separated rare-earth compounds',constraint:'Separation capacity, purity and compatible feed'},
  {id:4,title:'Metal reduction',group:'refining',description:'Convert separated compounds into metals suitable for alloy production. In the first model this and separation share one aggregate refining capacity.',input:'Separated oxides or compounds',output:'Rare-earth metal feed',constraint:'Reduction capacity, purity, energy and reagents'},
  {id:5,title:'Alloying',group:'manufacturing',description:'Combine rare-earth metals with iron, boron and other alloying inputs. Different magnet grades have different compositions; this prototype uses a fixed Nd/Dy technology basket.',input:'Rare-earth metals + alloying inputs',output:'Magnet alloy',constraint:'Chemistry control, alloy grade and production yield'},
  {id:6,title:'Powder forming',group:'manufacturing',description:'Prepare fine powder and align or compact it before sintering. These are explanatory operations within the manufacturing group, not independently calibrated capacities.',input:'Magnet alloy',output:'Aligned or compacted powder',constraint:'Powder preparation, oxidation control and forming capacity'},
  {id:7,title:'Sintering',group:'manufacturing',description:'Densify the powder and complete finishing steps to produce a magnet with the required properties. Finishing and coating are included conceptually in this passage.',input:'Compacted magnet powder',output:'Finished magnet',constraint:'Furnace throughput, process yield and quality control'},
  {id:8,title:'Qualification',group:'manufacturing',description:'A new supply source must meet the customer’s requirements before it can contribute deliveries. Added capacity in this model becomes available after an explicit qualification delay.',input:'Finished magnet + test evidence',output:'Qualified usable supply',constraint:'Qualification time, consistency and customer acceptance'},
  {id:9,title:'Deployment',group:'delivery',description:'Usable magnets enable the chosen wind and permanent-magnet vehicle portfolio. Deliveries require both contained neodymium and dysprosium; a missing input delays the fixed basket.',input:'Qualified usable supply',output:'Completed deployment portfolio',constraint:'Both elements, physical availability and delivery time'},
];
const boardOrder = [1,2,3,6,5,4,7,8,9];
const policyLabels = {'none':'No new investment','mining':'Mining capacity','refining':'Refining capacity','manufacturing':'Manufacturing capacity','finished-inventory':'Finished inventory'};
const policyColors = {'none':'#7e9081','mining':'#8aab95','refining':'#c5a46b','manufacturing':'#bb785d','finished-inventory':'#b6cabb'};
const numericFields = ['wind_mw_per_year','ev_per_year','shock_duration_months','shock_retention','inventory_months','budget','qualification_months','capacity_headroom','horizon_months','shock_start_month'];
const $ = id => document.getElementById(id);
let defaults = {}, latestRun = null, selectedStage = 3, requestId = 0, modelReady = false;
const format = (number, digits=1) => Number(number).toLocaleString('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits});
const safe = str => String(str ?? '').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function drawBoard(){
  const shockGroup = $('shock_stage').value;
  $('palace-board').innerHTML=boardOrder.map(id=>{
    const stage=stages.find(s=>s.id===id);
    return `<button class="palace ${selectedStage===id?'selected':''} ${stage.group===shockGroup?'shocked':''}" data-stage="${id}" aria-pressed="${selectedStage===id}" aria-label="${safe(stage.title)}, ${safe(stage.group)}"><span class="palace-number">${String(id).padStart(2,'0')}<i aria-hidden="true">${selectedStage===id?'●':'·'}</i></span><span class="palace-glyph" aria-hidden="true"><i></i><i></i><i></i></span><span><span class="palace-title">${safe(stage.title)}</span><span class="palace-group">${safe(stage.group==='delivery'?'Delivery outcome':stage.group+' group')}</span></span></button>`;
  }).join('');
  $('palace-board').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>selectStage(Number(button.dataset.stage))));
}
function selectStage(id){
  selectedStage=id;drawBoard();const stage=stages.find(s=>s.id===id);
  $('stage-detail').innerHTML=`<p class="micro-label">PASSAGE ${String(id).padStart(2,'0')} / ${safe(stage.group)}</p><h3>${safe(stage.title)}</h3><p class="stage-description">${safe(stage.description)}</p><dl><dt>IN → OUT</dt><dd>${safe(stage.input)}<br><span style="color:var(--brass)">↓</span><br>${safe(stage.output)}</dd><dt>WHAT CAN CONSTRAIN IT</dt><dd>${safe(stage.constraint)}</dd></dl>${stage.group!=='delivery'?`<button class="stage-stress" id="stress-stage">Stress this model group</button>`:`<a class="stage-stress" href="#experiment">Inspect deployment delays</a>`}<p class="stage-status">${stage.group==='delivery'?'A modeled outcome, not a separate production capacity.':'Aggregated in the '+safe(stage.group)+' group; no separate passage-level calibration.'}</p>`;
  const stress=$('stress-stage');if(stress)stress.addEventListener('click',()=>{$('shock_stage').value=stage.group;drawBoard();clearPreset();$('experiment').scrollIntoView({behavior:'smooth'});$('run-status').textContent='Settings changed. Run to update results.';});
}
function updateSliderLabels(){
  $('duration-value').textContent=$('shock_duration_months').value+' months';
  $('retention-value').textContent=format(Number($('shock_retention').value)*100,0)+'%';
  $('inventory-value').textContent=format($('inventory_months').value)+' months';
  $('headroom-value').textContent=format(Number($('capacity_headroom').value)*100,0)+'%';
}
function clearPreset(){document.querySelectorAll('[data-preset]').forEach(button=>button.classList.remove('active'));}
function setFields(cfg){for(const [key,value] of Object.entries(cfg)){const field=$(key);if(field && ['INPUT','SELECT'].includes(field.tagName))field.value=value;}updateSliderLabels();drawBoard();}
function getConfig(){const cfg={...defaults};new FormData($('config-form')).forEach((value,key)=>{cfg[key]=numericFields.includes(key)?Number(value):value;});return cfg;}

const chartBase = () => ({paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{family:'DM Sans, Arial, sans-serif',color:'#a3afa4',size:10},margin:{l:48,r:40,t:26,b:40},autosize:true,xaxis:{gridcolor:'#b8c3ad12',zerolinecolor:'#b8c3ad22',tickfont:{size:9},title:{font:{size:9},standoff:12}},yaxis:{gridcolor:'#b8c3ad15',zerolinecolor:'#b8c3ad25',tickfont:{size:9},title:{font:{size:9},standoff:10}},legend:{orientation:'h',x:0,y:1.12,font:{size:9},bgcolor:'rgba(0,0,0,0)'},hoverlabel:{bgcolor:'#253328',bordercolor:'#c5a46b',font:{family:'Arial',size:11,color:'#ede9dd'}},hovermode:'x unified'});
const chartConfig={responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d','autoScale2d'],toImageButtonOptions:{format:'png',filename:'rare-earth-experiment',scale:2}};
function renderCharts(sim,comparison){
  const cfg=sim.config,rows=sim.monthly,months=rows.map(row=>row.month), layout=chartBase();
  layout.xaxis.title.text='Model month';layout.xaxis.dtick=cfg.horizon_months>36?6:3;layout.yaxis.title.text='Monthly delivery';layout.yaxis.rangemode='tozero';layout.yaxis2={title:{text:'Backlog',font:{size:9},standoff:9},overlaying:'y',side:'right',showgrid:false,zeroline:false,rangemode:'tozero',tickfont:{size:9},color:'#8aab95'};
  if(cfg.shock_duration_months>0){layout.shapes=[{type:'rect',xref:'x',yref:'paper',x0:cfg.shock_start_month-.5,x1:cfg.shock_start_month+cfg.shock_duration_months-.5,y0:0,y1:1,line:{width:0},fillcolor:'#bb785d19',layer:'below'}];layout.annotations=[{x:cfg.shock_start_month+(cfg.shock_duration_months-1)/2,y:1.04,xref:'x',yref:'paper',text:'PRODUCTION SHOCK',font:{size:7,color:'#bb785d'},showarrow:false}];}
  Plotly.react('delivery-chart',[
    {x:months,y:rows.map(r=>r.new_demand_baskets),type:'scatter',mode:'lines',name:'New monthly demand',line:{color:'#80947f',width:1,dash:'dot'},hovertemplate:'Demand: %{y:.2f}<extra></extra>'},
    {x:months,y:rows.map(r=>r.delivered_baskets),type:'scatter',mode:'lines+markers',name:'Delivered',line:{color:'#dfbc81',width:2},marker:{size:3,color:'#dfbc81'},hovertemplate:'Delivered: %{y:.2f}<extra></extra>'},
    {x:months,y:rows.map(r=>r.backlog_baskets),type:'scatter',mode:'lines',name:'Outstanding backlog',yaxis:'y2',line:{color:'#8aab95',width:1.7},fill:'tozeroy',fillcolor:'#8aab9510',hovertemplate:'Backlog: %{y:.2f}<extra></extra>'}
  ],layout,chartConfig);
  const entries=comparison.comparison,barLayout=chartBase();barLayout.margin={l:127,r:40,t:15,b:43};barLayout.hovermode='closest';barLayout.showlegend=false;barLayout.xaxis.title.text='Cumulative backlog (portfolio-months × months)';barLayout.xaxis.rangemode='tozero';barLayout.yaxis={...barLayout.yaxis,autorange:'reversed',showgrid:false};barLayout.xaxis.range=entries.every(r=>r.cumulative_backlog_basket_months<1e-8)?[0,1]:undefined;
  Plotly.react('comparison-chart',[{type:'bar',orientation:'h',x:entries.map(r=>r.cumulative_backlog_basket_months),y:entries.map(r=>policyLabels[r.intervention]),marker:{color:entries.map(r=>policyColors[r.intervention]),line:{color:entries.map(r=>r.intervention===cfg.intervention?'#ede9dd':'#00000000'),width:1}},text:entries.map(r=>format(r.cumulative_backlog_basket_months,2)),textposition:'outside',textfont:{size:10,color:'#cbd3c5'},cliponaxis:false,hovertemplate:'%{y}<br>Delay burden: %{x:.2f}<extra></extra>',customdata:entries.map(r=>r.intervention)}],barLayout,chartConfig);
  const policies=entries.map(r=>r.intervention),durations=[30,90,180],z=policies.map(policy=>durations.map(days=>comparison.sensitivity.find(r=>r.intervention===policy && r.shock_days===days)?.cumulative_backlog_basket_months??0));
  const heatLayout=chartBase();heatLayout.margin={l:127,r:25,t:10,b:35};heatLayout.hovermode='closest';heatLayout.yaxis={autorange:'reversed',tickfont:{size:9}};heatLayout.xaxis={tickfont:{size:10},side:'bottom'};
  Plotly.react('sensitivity-chart',[{type:'heatmap',z,x:['1 month','3 months','6 months'],y:policies.map(p=>policyLabels[p]),colorscale:[[0,'#263b2d'],[.35,'#788567'],[.68,'#baa16c'],[1,'#bd795b']],showscale:false,xgap:4,ygap:4,text:z.map(row=>row.map(n=>format(n,1))),texttemplate:'%{text}',textfont:{color:'#ede9dd',size:11},hovertemplate:'%{y}<br>Shock: %{x}<br>Delay burden: %{z:.2f}<extra></extra>'}],heatLayout,chartConfig);
}
function renderFinding(sim,comparison){
  const metric=sim.metrics,cfg=sim.config,reference=comparison.comparison.find(r=>r.intervention==='none'),all=comparison.comparison,bestValue=Math.min(...all.map(r=>r.cumulative_backlog_basket_months)),best=all.filter(r=>Math.abs(r.cumulative_backlog_basket_months-bestValue)<1e-7);
  let result='';
  if(Object.values(sim.demand.annual_tonnes).every(value=>value<1e-9))result='The selected portfolio has zero contained-Nd/Dy demand. No material deliveries or deployment delays are required in this experiment.';
  else if(metric.max_backlog_baskets<1e-7)result='No portfolio delivery backlog develops under the selected stocks, in-process material and capacity assumptions.';
  else{result=`The selected run reaches a peak backlog of ${format(metric.max_backlog_baskets,2)} portfolio-months.`;result+=metric.recovery_status==='recovered'?` Backlog clears in month ${metric.recovery_month} and stays clear through the horizon.`:` ${format(metric.unmet_fraction*100,1)}% of cumulative demand is still undelivered at month ${cfg.horizon_months}.`;}
  if(all.every(run=>run.cumulative_backlog_basket_months<1e-7))result+=' All compared responses have zero delay burden here; this scenario cannot establish an investment ranking.';
  else if(reference.cumulative_backlog_basket_months<1e-7)result+=' The no-investment reference already has zero delay burden; this case does not support spending to reduce modeled delays.';
  else if(best.length===1)result+=` Under these assumed costs and lead times, ${policyLabels[best[0].intervention].toLowerCase()} produces the lowest cumulative delay burden among the tested responses.`;
  else result+=' Multiple responses tie for the lowest delay burden under these assumptions.';
  $('finding-text').textContent=result;
}
function renderAudit(audit){
  $('audit-badge').textContent=audit.material_balance_pass && audit.nonnegative_stocks?'MATERIAL BALANCE VERIFIED':'MATERIAL BALANCE CHECK FAILED';
  const rows=[['Initial material','initial_material_tonnes'],['External feed','external_input_tonnes'],['Delivered','delivered_tonnes'],['Process losses','process_losses_tonnes'],['Ending stock + pipeline','final_material_tonnes']];
  $('audit-content').innerHTML=`<table class="audit-table"><caption class="micro-label" style="text-align:left;padding:5px 0 10px">CONTAINED ELEMENT TONNES</caption><thead><tr><th scope="col">Material ledger</th><th scope="col">Nd</th><th scope="col">Dy</th></tr></thead><tbody>${rows.map(([label,key])=>`<tr><th scope="row">${label}</th><td>${format(audit[key].Nd,3)}</td><td>${format(audit[key].Dy,3)}</td></tr>`).join('')}</tbody></table><div class="audit-residual">Maximum absolute residual: ${Number(audit.max_abs_balance_residual_tonnes).toExponential(2)} tonnes · Nonnegative stocks: ${audit.nonnegative_stocks?'passed':'failed'}</div>`;
}
function renderRun(payload){
  const sim=payload.simulation;const demand=sim.demand,metric=sim.metrics,cfg=sim.config;
  $('scenario-title').textContent=`${cfg.shock_region} · ${cfg.shock_stage} · ${cfg.shock_duration_months}-month shock`;
  $('nd-demand').textContent=format(demand.annual_tonnes.Nd);$('dy-demand').textContent=format(demand.annual_tonnes.Dy);
  $('nd-split').textContent=`${format(demand.wind_annual_tonnes.Nd)} wind + ${format(demand.ev_annual_tonnes.Nd)} vehicles`;
  $('dy-split').textContent=`${format(demand.wind_annual_tonnes.Dy)} wind + ${format(demand.ev_annual_tonnes.Dy)} vehicles`;
  $('service-metric').innerHTML=`${format(metric.service_fraction*100,1)}<small>%</small>`;
  $('backlog-metric').textContent=format(metric.max_backlog_baskets,2);
  $('burden-metric').textContent=format(metric.cumulative_backlog_basket_months,2);
  renderFinding(sim,payload.comparison);renderCharts(sim,payload.comparison);renderAudit(sim.audit);$('download-run').disabled=false;
}
async function fetchJSON(url,options){const response=await fetch(url,options);let payload;try{payload=await response.json();}catch{throw new Error('The model returned an unreadable response. Reload this page and try again.');}if(!response.ok)throw new Error(payload.error||'The research model is unavailable. Reload this page and try again.');return payload;}
async function runExperiment(event,options={}){
  if(event)event.preventDefault();
  if(!modelReady){if(options.throwOnError)throw new Error('The research model is still loading. Try again after it is ready.');return null;}
  if(!$('config-form').reportValidity()){if(options.throwOnError)throw new Error('The visible scenario contains invalid values.');return null;}
  if(options.signal?.aborted)throw new DOMException('The experiment was cancelled.','AbortError');
  const ownRequest=++requestId;const cfg=getConfig();$('run-button').disabled=true;$('run-button').textContent='Calculating…';$('run-status').className='';$('run-status').textContent='Balancing material stocks and comparing interventions…';$('results-panel').classList.add('loading');$('results-panel').setAttribute('aria-busy','true');
  try{
    if(!globalThis.RareEarthRuntime)throw new Error('The browser Python runtime is unavailable. Check your connection and reload the page.');
    const payload=await globalThis.RareEarthRuntime.run(cfg);
    if(options.signal?.aborted)throw new DOMException('The experiment was cancelled.','AbortError');
    if(ownRequest!==requestId)return null;latestRun=payload;renderRun(payload);$('run-status').textContent=`Run complete · ${cfg.horizon_months} months · finite-stock ledger checked`;return payload;
  }
  catch(error){$('run-status').textContent=error.name==='AbortError'?'The experiment was cancelled. You can run it again.':error.message;$('run-status').className='error';if(!latestRun)$('finding-text').textContent='The model could not complete this run. Check your connection and reload the page, then try again.';if(options.throwOnError)throw error;return null;}
  finally{if(ownRequest===requestId){$('run-button').disabled=false;$('run-button').textContent='Run the experiment';$('results-panel').classList.remove('loading');$('results-panel').setAttribute('aria-busy','false');}}
}
function renderSources(data){const sources=Array.isArray(data)?data:data.sources||[];$('source-list').innerHTML=sources.map((source,index)=>{const title=safe(source.title),url=String(source.url??''),valid=/^https:\/\//.test(url);return `<article class="source-row"><span class="source-number">${String(index+1).padStart(2,'0')}</span><div><h3>${title}</h3><p class="source-meta">${safe(source.type)} · ${safe(source.year)}${source.reference_year?' · data year '+safe(source.reference_year):''}</p><span class="source-locators">${safe((source.locators||[]).join(' · '))}</span></div><p class="source-use">${safe(source.scope||source.use||source.status)}</p>${valid?`<a class="source-link" href="${safe(url)}" target="_blank" rel="noopener">Source</a>`:''}</article>`;}).join('');}
function exportRun(){if(!latestRun)return;const blob=new Blob([JSON.stringify({...latestRun,export_note:'Exploratory simulation. Contained-element tonnes are not finished-magnet tonnes. All inputs and assumptions are included in simulation.config.'},null,2)],{type:'application/json'});const link=document.createElement('a'),url=URL.createObjectURL(blob);link.href=url;link.download='rare-earth-experiment.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function setupEvents(){
  $('config-form').addEventListener('submit',runExperiment);
  $('config-form').addEventListener('input',()=>{updateSliderLabels();clearPreset();$('run-status').textContent='Settings changed. Run to update results.';});
  $('shock_stage').addEventListener('change',drawBoard);
  document.querySelectorAll('.group-key').forEach(button=>button.addEventListener('click',()=>selectStage({mining:1,refining:3,manufacturing:5}[button.dataset.group])));
  document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{setFields(defaults);const preset=button.dataset.preset;if(preset==='severe')setFields({shock_duration_months:6,shock_retention:0});if(preset==='upstream')setFields({shock_duration_months:6,shock_retention:0,intervention:'mining'});clearPreset();button.classList.add('active');runExperiment();}));
  $('download-run').addEventListener('click',exportRun);
}
function scenarioSchema(){const properties={};for(const field of $('config-form').querySelectorAll('input[name],select[name]')){if(field.tagName==='SELECT')properties[field.name]={type:'string',enum:[...field.options].map(option=>option.value)};else{const step=Number(field.step||1);properties[field.name]={type:step>=1 && Number.isInteger(step)?'integer':'number',minimum:Number(field.min),maximum:Number(field.max)};}}return {type:'object',properties,additionalProperties:false};}
function validatedScenarioPatch(input){
  if(input===undefined)input={};
  if(!input || Array.isArray(input) || typeof input!=='object' || ![Object.prototype,null].includes(Object.getPrototypeOf(input)))throw new Error('Scenario input must be a plain object.');
  const schema=scenarioSchema(),result={};
  for(const [key,value] of Object.entries(input)){
    if(!Object.prototype.hasOwnProperty.call(schema.properties,key))throw new Error('Unknown scenario input: '+key);
    const rule=schema.properties[key],field=$(key);
    if(rule.type==='string'){if(typeof value!=='string' || !rule.enum.includes(value))throw new Error(key+' must be one of: '+rule.enum.join(', '));}
    else{if(typeof value!=='number' || !Number.isFinite(value) || value<rule.minimum || value>rule.maximum || (rule.type==='integer'&&!Number.isInteger(value)))throw new Error(key+' must be a valid '+rule.type+' between '+rule.minimum+' and '+rule.maximum+'.');const step=Number(field.step||1);if(Math.abs((value-rule.minimum)/step-Math.round((value-rule.minimum)/step))>1e-7)throw new Error(key+' must follow the visible control step of '+step+'.');}
    result[key]=value;
  }
  return result;
}
async function registerScenarioTool(){
  if(!document.modelContext || typeof document.modelContext.registerTool!=='function')return;
  const controller=new AbortController();
  try{await document.modelContext.registerTool({
    name:'run_rare_earth_scenario',
    description:'Configure and run the visible rare-earth supply-chain experiment. Optional inputs update only the displayed scenario controls; omitted inputs retain the current visible values. Returns actual contained-Nd/Dy demand, delivery and backlog metrics from a preliminary two-region, three-stage model. Results are conditional simulations, not national forecasts or calibrated investment returns.',
    inputSchema:scenarioSchema(),
    annotations:{readOnlyHint:false,consequentialHint:false,untrustedContentHint:false},
    execute:async(input,execution={})=>{
      if(!modelReady)throw new Error('The research model is still loading. Try again when it is ready.');
      if($('results-panel').getAttribute('aria-busy')==='true')throw new Error('An experiment is already running. Wait for its result before changing the scenario.');
      const patch=validatedScenarioPatch(input);setFields(patch);clearPreset();
      const result=await runExperiment(null,{throwOnError:true,signal:execution.signal});
      if(!result)throw new Error('The experiment did not return a result.');
      const sim=result.simulation;
      return {status:'complete',scope:'Conditional two-region, three-stage simulation. Nine board operations are explanatory, not nine separately modeled capacities. Contained element tonnes are not finished magnet tonnes.',scenario_used:Object.fromEntries(Object.keys(scenarioSchema().properties).map(key=>[key,sim.config[key]])),annual_contained_element_tonnes:sim.demand.annual_tonnes,metrics:{service_fraction:sim.metrics.service_fraction,max_backlog_portfolio_months:sim.metrics.max_backlog_baskets,cumulative_delay_burden:sim.metrics.cumulative_backlog_basket_months,unmet_fraction_at_horizon:sim.metrics.unmet_fraction,recovery_status:sim.metrics.recovery_status,recovery_month:sim.metrics.recovery_month},material_balance_pass:sim.audit.material_balance_pass,interpretation:$('finding-text').textContent};
    },
  },{signal:controller.signal});window.addEventListener('pagehide',()=>controller.abort(),{once:true});}
  catch(error){console.warn('Browser scenario tool could not be registered:',error.message);}
}
async function init(){
  setupEvents();selectStage(3);updateSliderLabels();document.querySelectorAll('[data-preset]').forEach(button=>button.disabled=true);
  $('run-status').textContent=globalThis.RareEarthRuntime?'Preparing the research model. The first load may take a few seconds.':'Connecting to the research model…';
  try{
    const runtime=globalThis.RareEarthRuntime;
    if(!runtime)throw new Error('The browser Python runtime is unavailable. Check your connection and reload the page.');
    const results=await Promise.allSettled([runtime.defaults(),runtime.sources()]);
    if(results[0].status==='rejected')throw results[0].reason;
    defaults=results[0].value;setFields(defaults);modelReady=true;
    if(results[1].status==='fulfilled')renderSources(results[1].value);else $('source-list').textContent='The source ledger could not load. Check your connection, then reload this page.';
    document.querySelectorAll('[data-preset]').forEach(button=>button.disabled=false);
    await runExperiment();await registerScenarioTool();
  }catch(error){$('run-status').textContent='The research model could not load. Check your connection, then reload this page.';$('run-status').className='error';$('run-button').textContent='Model unavailable';$('results-panel').setAttribute('aria-busy','false');$('finding-text').textContent='The experiment has not run. No model conclusions are available yet.';}
}
init();
