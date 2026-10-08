'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=(value,digits=2)=>Number.isFinite(value)?value.toLocaleString('en-US',{maximumFractionDigits:digits}):'Unknown';
  const finite=value=>Number.isFinite(value)&&value>=0;
  const sum=values=>values.reduce((total,value)=>total+(finite(value)?value:0),0);
  const palette=['#8aab95','#c5a46b','#77a8b8','#d29672','#aaa4ce','#b7bf82','#a0afb1'];
  const params=new URLSearchParams(location.search);
  let packet=null,view=['demand','prototype','balance'].includes(params.get('view'))?params.get('view'):'demand';
  let regionId=params.get('region')||'global',demandUnit=params.get('unit')==='share'?'share':'tonnes',prototypeUnit='units',lotUnit='kg',presentation=window.innerWidth<760?'table':'chart',model=null,selectedId=null;
  let balanceExample='lot',ledgerElement='mixture',ledgerUnit='tonnes';
  let plotRevision=0;
  const balanceDrawerState=new Map();
  const sourceIds=(...lists)=>[...new Set(lists.flat().filter(Boolean))];
  const fact=(label,value)=>`<div><dt>${esc(label)}</dt><dd>${esc(value??'Unknown')}</dd></div>`;
  const sourceLinks=ids=>{
    const sources=(ids||[]).map(id=>(packet?.sources||[]).find(s=>s.id===id)).filter(Boolean);
    return sources.length?`<div class="flow-source-links">${sources.map(s=>`<a href="${esc(s.url)}"${/^https?:/.test(s.url||'')?' target="_blank" rel="noopener"':''}>${esc(s.label||s.title||s.id)}<small>${esc([s.publication_date&&`Published ${s.publication_date}`,s.locator,s.checked_at&&`Checked ${s.checked_at}`].filter(Boolean).join(' · '))}</small></a>`).join('')}</div>`:'<p class="flow-table-note">No source record is attached to this quantity.</p>';
  };
  const boundariesHTML=items=>(items||[]).length?`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:'';
  const valueLabel=record=>`${number(record.quantity,record.precision??2)}${record.unit==='%'?'%':` ${record.unit||''}`}`;
  function setButtonState(attribute,value){document.querySelectorAll(`button[${attribute}]`).forEach(button=>button.setAttribute('aria-pressed',String(button.getAttribute(attribute)===value)));}
  function updateURL(){const next=new URL(location.href);next.searchParams.set('view',view);if(view==='demand'){next.searchParams.set('region',regionId);next.searchParams.set('unit',demandUnit);}else{next.searchParams.delete('region');next.searchParams.delete('unit');}history.replaceState(null,'',next);}
  function demandModel() {
    const demand=packet?.demand_2020,regions=demand?.regions||[],region=regions.find(r=>r.id===regionId)||regions[0];
    if(!region)return null;regionId=region.id;
    const denominator=region.total_tonnes,unit=demandUnit==='share'?'%':demand.unit||'tonnes/year';
    const measure=tonnes=>demandUnit==='share'?finite(tonnes)&&denominator>0?tonnes/denominator*100:null:tonnes;
    const common={year:demand.year,geography:region.label,form:demand.form,denominator:`${number(denominator)} tonnes/year · ${demand.denominator_label}`,basis:region.scope,status:'Historical modeled demand · published source estimate',source_ids:sourceIds(demand.source_ids,region.source_ids),locator:region.locator};
    const total={...common,id:'demand-total',label:`${region.label} demand`,chart_label:`${region.label} total`,quantity:measure(denominator),tonnes:denominator,unit,type:'Finished-magnet demand total',color:'#c5a46b',x:.02,y:.45};
    const sectors=(region.sectors||[]).map((sector,i)=>({...common,...sector,id:sector.id,label:sector.label,chart_label:sector.label,quantity:measure(sector.tonnes),unit,type:'Source demand category',source_ids:sourceIds(common.source_ids,sector.source_ids),color:palette[i%palette.length],x:.98,y:(i+.5)/Math.max(1,region.sectors.length)}));
    return {kind:'demand',nodes:[total,...sectors],links:sectors.filter(sector=>finite(sector.quantity)).map(sector=>({...sector,id:`demand-band-${sector.id}`,from:total.label,to:sector.label,source:0,target:sectors.indexOf(sector)+1,type:'Allocation of one source demand total',color:sector.color})),records:sectors,common,demand,region,denominator};
  }
  function prototypeModel() {
    const reference=packet?.prototype_100;if(!reference)return null;
    const denominator=reference.denominator,unit=prototypeUnit==='share'?'%':reference.unit||'normalized units';
    const measure=value=>prototypeUnit==='share'?finite(value)&&denominator>0?value/denominator*100:null:value;
    const common={year:reference.year,geography:'China / other countries; end-use geography unspecified',form:reference.form,denominator:`${number(denominator)} normalized units`,basis:reference.scope,status:'Original exploratory allocation · illustrative assumed bands',source_ids:reference.source_ids||[]};
    const columns=reference.columns||[],nodes=[];
    columns.forEach((column,columnIndex)=>{
      const columnTotal=sum((column.nodes||[]).map(node=>node.value));let cumulative=0;
      for(const node of column.nodes||[]){const height=columnTotal>0?node.value/columnTotal:0;nodes.push({...common,...node,label:`${node.label} · ${column.label}`,chart_label:node.label,stage:column.label,column_index:columnIndex,quantity:measure(node.value),unit,type:node.kind==='Assumed application'?'Hypothetical end-use weight':'Independent stage margin on an assumed common basis',color:node.kind==='China'?'#c5a46b':node.kind==='Other'?'#8aab95':palette[nodes.length%palette.length],x:.02+columnIndex/Math.max(1,columns.length-1)*.96,y:Math.min(.98,Math.max(.02,cumulative+height/2))});cumulative+=height;}
    });
    const lookup=new Map(nodes.map((node,i)=>[node.id,i]));
    const links=(reference.links||[]).filter(link=>lookup.has(link.source)&&lookup.has(link.target)&&finite(link.value)).map((link,i)=>({...common,...link,id:`prototype-band-${i}`,from:nodes[lookup.get(link.source)].label,to:nodes[lookup.get(link.target)].label,quantity:measure(link.value),unit,type:'Assumed allocation · not measured trade',source:lookup.get(link.source),target:lookup.get(link.target),color:nodes[lookup.get(link.source)].color}));
    return {kind:'prototype',nodes,links,records:nodes,common,reference,denominator,columns};
  }
  function lotModel() {
    const lot=packet?.material_balance?.lot_example;if(!lot)return null;
    const denominator=lot.batch_kg,unit=lotUnit==='share'?'%':'kg of declared charge';
    const measure=kg=>lotUnit==='share'?finite(kg)&&denominator>0?kg/denominator*100:null:kg;
    const common={year:'Illustrative charge · no production year',geography:'Specified lot · no national allocation',form:lot.form,denominator:`${number(denominator)} kg · ${lot.denominator_label}`,basis:lot.status,status:'Ideal scenario assay · before processing',source_ids:lot.source_ids||[]};
    const inputs=(lot.inputs||[]).map((input,i)=>({...common,...input,id:`input-${input.id}`,label:input.label,chart_label:input.label,quantity:measure(input.kg),kg:input.kg,unit,type:'Assumed purchased-material input',color:palette[i%palette.length],x:.02,y:(i+.5)/Math.max(1,lot.inputs.length),assay:Object.entries(input.elements||{}).map(([element,fraction])=>`${element} ${number(fraction*100)}%`).join(' + ')}));
    const elements=Object.entries(lot.elements_kg||{}).map(([element,kg],i)=>({...common,id:`element-${element}`,label:`Contained ${element}`,chart_label:element,quantity:measure(kg),kg,unit,type:'Contained element · arithmetic within declared charge',color:palette[i%palette.length],x:.98,y:(i+.5)/Math.max(1,Object.keys(lot.elements_kg).length)}));
    const lookup=new Map(elements.map((element,i)=>[element.chart_label,i+inputs.length]));
    const links=inputs.flatMap((input,source)=>Object.entries(input.elements||{}).filter(([element,fraction])=>lookup.has(element)&&finite(fraction)).map(([element,fraction])=>({...common,id:`lot-band-${input.id}-${element}`,from:input.label,to:element,quantity:measure(input.kg*fraction),kg:input.kg*fraction,unit,type:'Assumed assay allocation · not a process yield',assay:`${number(fraction*100)}% ${element} in ${input.label}`,source,target:lookup.get(element),color:input.color})));
    return {kind:'lot',nodes:[...inputs,...elements],links,records:[...inputs,...elements],common,lot,denominator};
  }
  function ledgerModel() {
    const ledger=packet?.material_balance?.ledger_example;if(!ledger)return null;
    const raw=ledgerElement==='mixture'?ledger.flows_tonnes:ledger.element_ledgers?.[ledgerElement];if(!raw)return null;
    const inflowIds=['opening_stock','primary_external_virgin_feed','recycled_external_feed','imports'],outflowIds=['exports','delivered_use','unrecoverable_loss','closing_stock'];
    const denominator=inflowIds.every(id=>finite(raw[id]))?sum(inflowIds.map(id=>raw[id])):null;
    const unit=ledgerUnit==='share'?'%':ledgerElement==='mixture'?'tonnes of declared mixture':`tonnes of contained ${ledgerElement}`;
    const measure=tonnes=>ledgerUnit==='share'?finite(tonnes)&&denominator>0?tonnes/denominator*100:null:tonnes;
    const common={year:ledger.boundary?.period,geography:ledger.boundary?.geography,form:ledgerElement==='mixture'?ledger.boundary?.mass_basis:`Contained ${ledgerElement} within the declared metal / alloy mixture`,denominator:`${number(denominator,4)} tonnes ${ledgerElement==='mixture'?'of declared mixture':`of contained ${ledgerElement}`} · opening stock + external primary + external recycled + imports`,basis:ledger.boundary?.stage,status:'Illustrative inventory scenario · no actual plant or country',source_ids:ledger.source_ids||[],precision:ledgerUnit==='share'?2:4};
    const labels={opening_stock:'Opening stock',primary_external_virgin_feed:'External primary feed',recycled_external_feed:'External recycled feed',imports:'Imports',exports:'Exports',delivered_use:'Delivered use',unrecoverable_loss:'Unrecoverable loss',closing_stock:'Closing stock'};
    const makeRecord=(id,x,y,i)=>({...common,id:`ledger-${id}`,ledger_id:id,label:labels[id],chart_label:labels[id],tonnes:raw[id],quantity:measure(raw[id]),unit,type:id.includes('stock')?'Scenario stock snapshot':'Scenario boundary flow',color:palette[i%palette.length],x,y});
    const inputs=inflowIds.map((id,i)=>makeRecord(id,.02,(i+.5)/inflowIds.length,i));
    const pool={...common,id:'ledger-available',label:'Available within declared boundary',chart_label:'Available mass',tonnes:denominator,quantity:measure(denominator),unit,type:'Scenario available pool · opening stock plus external arrivals',color:'#c5a46b',x:.5,y:.5};
    const outputs=outflowIds.map((id,i)=>makeRecord(id,.98,(i+.5)/outflowIds.length,i+2));
    const nodes=[...inputs,pool,...outputs],links=[...inputs.map((input,i)=>({...input,id:`ledger-band-in-${input.ledger_id}`,from:input.label,to:pool.label,source:i,target:inputs.length})),...outputs.map((output,i)=>({...output,id:`ledger-band-out-${output.ledger_id}`,from:pool.label,to:output.label,source:inputs.length,target:inputs.length+i+1}))].filter(link=>finite(link.quantity));
    return {kind:'ledger',nodes,links,records:[...inputs,...outputs],common,ledger,denominator,raw};
  }
  function renderSelected(record) {
    if(!record)return;selectedId=record.id;
    const evidence=model?.kind==='ledger'?'<p class="flow-table-note">Provenance: declared illustrative scenario. These are not observed national or factory quantities.</p><div class="flow-source-links"><a href="data/flow-evidence.json">Inspect the declared inventory ledger</a></div>':sourceLinks(record.source_ids);
    $('flow-click-detail').innerHTML=`<p class="micro-label">${esc(record.type||'Quantity evidence')}</p><h3>${esc(record.from?`${record.from} → ${record.to}`:record.label)}</h3><strong class="flow-detail-quantity">${esc(valueLabel(record))}</strong><p>${esc(record.status||record.basis||'See the stated scope.')}</p><dl class="flow-detail-facts">${fact('Year / period',record.year)}${fact('Geography',record.geography)}${fact('Material form',record.form)}${fact('Denominator',record.denominator)}${record.assay?fact('Assumed assay',record.assay):''}${fact('Basis',record.basis)}${record.locator?fact('Source locator',record.locator):''}</dl>${evidence}`;
  }
  function renderTable() {
    if(!model){$('flow-data-table').innerHTML='';return;}
    let rows='',head='',note='';
    if(model.kind==='demand'){
      head='<th scope="col">Source category</th><th scope="col">Tonnes/year</th><th scope="col">Share of selected total</th>';
      rows=model.records.map(record=>`<tr><td><button type="button" data-flow-record="${esc(record.id)}">${esc(record.label)}</button></td><td class="flow-number">${number(record.tonnes)}</td><td class="flow-number">${model.denominator>0?number(record.tonnes/model.denominator*100)+'%':'Unknown'}</td></tr>`).join('');
      note=`Denominator: ${number(model.denominator)} tonnes/year, ${model.region.label}, ${model.demand.year}. Categories remain exactly as published, including bonded magnets. Category sum: ${number(sum(model.records.map(r=>r.tonnes)))} tonnes/year. No additional recycling, stock or loss quantity has been inserted.`;
    }else if(model.kind==='prototype'){
      head='<th scope="col">Stage</th><th scope="col">Margin / end-use assumption</th><th scope="col">Normalized units</th><th scope="col">Share of declared basis</th>';
      rows=model.records.map(record=>`<tr><td>${esc(record.stage)}</td><td><button type="button" data-flow-record="${esc(record.id)}">${esc(record.chart_label)}</button></td><td class="flow-number">${number(record.value)}</td><td class="flow-number">${model.denominator>0?number(record.value/model.denominator*100)+'%':'Unknown'}</td></tr>`).join('');
      note='These are stage margins and hypothetical end-use weights on one normalized reference. They are neither ore tonnes nor observed imports, exports or factory receipts. The table does not create an absolute-tonne denominator.';
    }else if(model.kind==='lot'){
      head='<th scope="col">Declared purchased input / contained element</th><th scope="col">Kilograms</th><th scope="col">Share of declared charge</th>';
      rows=model.records.map(record=>`<tr><td><button type="button" data-flow-record="${esc(record.id)}">${esc(record.label)}</button></td><td class="flow-number">${number(record.kg)}</td><td class="flow-number">${model.denominator>0?number(record.kg/model.denominator*100)+'%':'Unknown'}</td></tr>`).join('');
      note='Inputs and contained elements are two views of the same declared charge; do not add them together. Carrier iron from Dy–Fe and ferroboron is included once. Ideal assays, process losses and minor additions remain explicit assumptions or gaps.';
    }else{
      head='<th scope="col">Scenario boundary term</th><th scope="col">Tonnes of selected basis</th><th scope="col">Share of available mass</th>';
      rows=model.records.map(record=>`<tr><td><button type="button" data-flow-record="${esc(record.id)}">${esc(record.label)}</button></td><td class="flow-number">${number(record.tonnes,4)}</td><td class="flow-number">${model.denominator>0?number(record.tonnes/model.denominator*100)+'%':'Unknown'}</td></tr>`).join('');
      note=`Illustrative scenario, ${model.common.geography}, ${model.common.year}. Denominator: ${number(model.denominator,4)} tonnes of ${ledgerElement==='mixture'?'declared mixture':`contained ${ledgerElement}`}. Opening and closing stock are different snapshots. Internal processing is excluded; external recycled arrivals and imports are counted once.`;
    }
    $('flow-data-table').innerHTML=`<div class="flow-table-caption"><strong>Exact quantities & accessible selection</strong><span>Select a row to inspect its evidence</span></div><div class="flow-table-scroll"><table><caption class="flow-visually-hidden">${esc(model.common.basis)} · ${esc(model.common.denominator)}</caption><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div><p class="flow-table-note">${esc(note)}</p>`;
  }
  async function renderChart() {
    const revision=++plotRevision,layout=$('flow-network-layout'),shell=layout.querySelector('.flow-chart-shell');
    layout.classList.toggle('table-mode',presentation==='table');shell.classList.toggle('table-mode',presentation==='table');
    if(!model||!model.links.length){$('flow-chart').innerHTML='<div class="flow-empty">The declared nodes are available in the table. No supported bands are present in this packet.</div>';$('flow-chart-status').textContent='No bands have been invented to complete the diagram.';return;}
    if(presentation==='table')return;
    if(!window.Plotly){shell.classList.add('table-mode');layout.classList.add('table-mode');$('flow-chart-status').textContent='Chart unavailable. The exact-value table and quantity inspector remain available.';return;}
    const narrow=window.innerWidth<760,compact=label=>narrow&&label.length>25?`${label.slice(0,24)}…`:label;
    const middlePrototype=record=>model.kind==='prototype'&&record.column_index>0&&record.column_index<model.columns.length-1;
    const nodeLabels=model.nodes.map(record=>middlePrototype(record)?'':`${compact(record.chart_label||record.label)}${narrow?'<br>':' · '}${number(record.quantity,record.precision??2)}${record.unit==='%'?'%':model.kind==='demand'?' t/yr':model.kind==='lot'?' kg':model.kind==='ledger'?' t':' units'}`);
    const annotations=model.kind==='prototype'?[...(model.columns||[]).map((column,i)=>({x:i/Math.max(1,model.columns.length-1),y:1.07,xref:'paper',yref:'paper',text:compact(column.label),showarrow:false,xanchor:i===0?'left':i===model.columns.length-1?'right':'center',font:{size:narrow?8:10,color:'#a3afa4'}})),...model.nodes.filter(middlePrototype).map(record=>({x:record.x-.012,y:1-record.y,xref:'paper',yref:'paper',text:`${record.kind==='Other'?'Other':record.chart_label} · ${number(record.quantity)}${record.unit==='%'?'%':' units'}`,showarrow:false,xanchor:'right',yanchor:'middle',font:{size:11,color:'#ede9dd'}}))]:[];
    const transparent=color=>`rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.3)`;
    // Fixed node centers must allow for the actual band heights. Uniform
    // spacing otherwise places small Tb/B nodes inside the much larger Fe node.
    const graphHeight=(narrow?470:480)-(model.kind==='prototype'?38:15)-15,nodePad=narrow?16:20;
    const groups=new Map();model.nodes.forEach((record,index)=>{const key=record.x;if(!groups.has(key))groups.set(key,[]);if(record.quantity>0)groups.get(key).push({record,index});});
    const scale=Math.min(...[...groups.values()].filter(group=>group.length).map(group=>(graphHeight-nodePad*(group.length-1))/sum(group.map(({record})=>record.quantity))));
    const nodeY=model.nodes.map(record=>record.y);
    for(const group of groups.values()){
      if(!group.length)continue;
      const occupied=sum(group.map(({record})=>record.quantity))*scale+nodePad*(group.length-1);let cursor=(graphHeight-occupied)/2;
      for(const {record,index} of group){const height=record.quantity*scale;nodeY[index]=Math.max(.01,Math.min(.99,(cursor+height/2)/graphHeight));cursor+=height+nodePad;}
    }
    if(model.kind==='prototype')model.nodes.filter(middlePrototype).forEach((record,i)=>{annotations[model.columns.length+i].y=1-nodeY[model.nodes.indexOf(record)];});
    const trace={type:'sankey',orientation:'h',arrangement:'fixed',valueformat:'.2f',node:{label:nodeLabels,color:model.nodes.map(record=>record.color),pad:nodePad,thickness:12,line:{color:'rgba(237,233,221,0.33)',width:.5},x:model.nodes.map(record=>record.x),y:nodeY,customdata:model.nodes.map(record=>`${record.label}<br>${valueLabel(record)}<br>${record.status}`),hovertemplate:'%{customdata}<extra></extra>'},link:{source:model.links.map(record=>record.source),target:model.links.map(record=>record.target),value:model.links.map(record=>record.quantity),color:model.links.map(record=>transparent(record.color)),customdata:model.links.map(record=>`${record.from} → ${record.to}<br>${valueLabel(record)}<br>${record.type}`),hovertemplate:'%{customdata}<extra></extra>'}};
    try{
      // Recreate the Sankey when its topology changes; reused node positions can
      // survive between differently shaped charts in the bundled renderer.
      Plotly.purge('flow-chart');
      await Plotly.newPlot('flow-chart',[trace],{paper_bgcolor:'transparent',plot_bgcolor:'transparent',font:{family:'Arial, sans-serif',size:narrow?10:11,color:'#ede9dd'},margin:{l:12,r:12,t:model.kind==='prototype'?38:15,b:15},height:narrow?470:480,annotations,hoverlabel:{bgcolor:'#18221e',font:{color:'#ede9dd',size:12}},transition:{duration:0}}, {responsive:true,displayModeBar:false,staticPlot:false});
      if(revision!==plotRevision)return;
      const zeroCategories=model.kind==='demand'?model.records.filter(record=>record.tonnes===0).map(record=>record.label):[];
      $('flow-chart-status').textContent=model.kind==='demand'?`Band width is the source category’s modeled finished-magnet demand; no supplier origin is assigned.${zeroCategories.length?` ${zeroCategories.join('; ')} is reported as zero in this source and stays in the table without a visible band.`:''}`:model.kind==='prototype'?'Every band is an assumed allocation. Stage margins do not establish trade routes.':model.kind==='ledger'?'Every quantity is a declared inventory scenario. Opening stock and current inflow remain separate; closing stock includes work in process.':'Band width is arithmetic from the declared input mass and ideal assay; no finished-magnet yield is inferred.';
      const chart=$('flow-chart');if(typeof chart.removeAllListeners==='function')chart.removeAllListeners('plotly_click');
      if(typeof chart.on==='function')chart.on('plotly_click',event=>{const point=event.points?.[0];if(!point)return;const record=Number.isFinite(point.source)&&Number.isFinite(point.target)?model.links[point.pointNumber]:model.nodes[point.pointNumber];renderSelected(record);});
    }catch(_){shell.classList.add('table-mode');layout.classList.add('table-mode');$('flow-chart-status').textContent='The chart could not render. Use the exact-value table below; no quantity evidence is lost.';}
  }
  function renderBalanceContent() {
    const drawerKey=detail=>`${detail.closest('.flow-balance-card')?.querySelector('h3')?.textContent||''}::${detail.querySelector('summary')?.textContent||''}`;
    $('flow-balance-content').querySelectorAll('details.flow-evidence-drawer,details.flow-measure-notes').forEach(detail=>balanceDrawerState.set(drawerKey(detail),detail.open));
    const balance=packet?.material_balance;if(!balance){$('flow-balance-content').innerHTML='<p class="flow-empty">Material-balance evidence is unavailable. Unknown inputs remain unknown.</p>';return;}
    const cardHTML=card=>`<article class="flow-balance-card"><p class="micro-label">${esc(card.stage||card.metric_type||'Source quantity')}</p><h3>${esc(card.label||card.id)}</h3><strong>${number(card.value)}${finite(card.value)?` <small>${esc(card.unit||'')}</small>`:''}</strong><p>${esc(card.status||'See source status')}</p><dl>${fact('Year / period',card.period??card.year)}${fact('Geography',card.geography)}${fact('Material form',card.form)}${fact('Scope / boundary',card.scope||card.boundary)}</dl>${(card.notes||[]).length?`<details class="flow-measure-notes"><summary>Measure notes</summary>${card.notes.map(note=>`<p>${esc(note)}</p>`).join('')}</details>`:''}${sourceLinks(card.source_ids)}</article>`;
    const cards=(balance.cards||[]).map(cardHTML).join('');
    const lot=balance.lot_example;
    const ledger=balance.ledger_example;
    let scenario='';
    if(balanceExample==='lot'&&lot)scenario=`<section class="flow-lot-example"><p class="micro-label">A separate calculation / declared scenario inputs</p><h3>${esc(lot.label)}</h3><p>${esc(lot.status)}</p><dl class="flow-basis">${fact('Year / geography','Specified charge · no national allocation')}${fact('Material form',lot.form)}${fact('Display unit',lotUnit==='share'?'% of the declared charge':'kg of declared charge')}${fact('Denominator',`${number(lot.batch_kg)} kg · ${lot.denominator_label}`)}${fact('Assays','Ideal input fractions · see each selected band')}${fact('Output boundary','Contained elements before processing')}</dl><p>No finished grade, processing yield or national element demand follows from this example. The input masses and ideal assays are explicit scenario assumptions.</p></section>`;
    if(balanceExample==='ledger'&&ledger&&model){
      const raw=model.raw,known=['opening_stock','primary_external_virgin_feed','recycled_external_feed','imports','exports','delivered_use','unrecoverable_loss','closing_stock'].every(key=>finite(raw[key]));
      const metrics=known?[['Gross current inflow',raw.primary_external_virgin_feed+raw.recycled_external_feed+raw.imports,'External primary + external recycled + imports; opening stock excluded'],['Defined net inflow',raw.primary_external_virgin_feed+raw.recycled_external_feed+raw.imports-raw.exports,'External primary + external recycled + imports − exports'],['Net imports',raw.imports-raw.exports,'Imports − exports'],['Outflow',raw.exports+raw.delivered_use+raw.unrecoverable_loss,'Exports + delivered use + unrecoverable loss'],['Stock change',raw.closing_stock-raw.opening_stock,'Closing stock − opening stock']]:[];
      const metricHTML=metrics.map(([label,value,basis])=>`<article class="flow-ledger-metric"><span>${esc(label)} · scenario arithmetic</span><strong>${number(ledgerUnit==='share'&&model.denominator>0?value/model.denominator*100:value,ledgerUnit==='share'?2:4)} <small>${ledgerUnit==='share'?'% of available mass':'tonnes'}</small></strong><p>${esc(basis)}</p></article>`).join('');
      const stocks=[['Opening stock',ledger.opening_stock_components_tonnes],['Closing stock',ledger.closing_stock_components_tonnes]].map(([label,parts])=>`<article><h4>${esc(label)} · whole-mixture tonnes</h4>${Object.entries(parts||{}).map(([key,value])=>`<p><span>${esc(key.replaceAll('_',' '))}</span><strong>${number(value,4)} t</strong></p>`).join('')}</article>`).join('');
      scenario=`<section class="flow-lot-example flow-ledger-example"><p class="micro-label">A separate inventory scenario / no actual plant or country</p><h3>Opening stock to closing stock.</h3><p>${esc(ledger.disclaimer_en)}</p><dl class="flow-basis">${fact('Year / period',model.common.year)}${fact('Geography',model.common.geography)}${fact('Material form',model.common.form)}${fact('Display unit',model.nodes[0]?.unit)}${fact('Denominator',model.common.denominator)}${fact('Boundary',ledger.boundary?.stage)}</dl><p>${esc(ledger.composition_note)}</p><p class="flow-ledger-composition"><strong>Declared scenario fractions:</strong> ${esc(Object.entries(ledger.composition_assumption||{}).map(([element,fraction])=>`${element} ${number(fraction*100)}%`).join(' · '))}</p><div class="flow-ledger-metrics">${metricHTML}</div><div class="flow-ledger-stocks">${stocks}</div><p>Stock components above retain the declared whole-mixture basis. No separate in-transit quantity is specified. The control boundary includes in-transit material; it does not create an additional stock amount.</p></section>`;
    }
    $('flow-balance-content').innerHTML=`${cards?`<div class="flow-balance-cards">${cards}</div>`:`<p class="flow-empty">National quantity cards are pending their source packet. No production, imports, recycling, stocks or losses have been filled in to close a balance.</p>`}<div id="production-quantities"></div>${(balance.trade_cards||[]).length?`<details class="flow-evidence-drawer flow-trade-drawer"><summary>Additional reported trade quantities · distinct product boundaries</summary><div class="flow-balance-cards">${balance.trade_cards.map(cardHTML).join('')}</div></details>`:''}<details class="flow-evidence-drawer"><summary>What prevents a comparable national balance?</summary>${boundariesHTML(balance.missing_inputs)}${boundariesHTML(balance.accounting_rules)}</details><p class="flow-accounting-identity">Within one declared period, geography and conserved mass basis:<br>Opening stock + external primary + external recycled + imports = exports + delivered use + unrecoverable loss + closing stock.</p>${scenario}`;
    $('flow-balance-content').querySelectorAll('details.flow-evidence-drawer,details.flow-measure-notes').forEach(detail=>{detail.open=balanceDrawerState.get(drawerKey(detail))===true;});
  }
  function render() {
    document.body.dataset.flowView=view;
    setButtonState('data-flow-view',view);setButtonState('data-demand-unit',demandUnit);setButtonState('data-prototype-unit',prototypeUnit);setButtonState('data-lot-unit',lotUnit);setButtonState('data-ledger-unit',ledgerUnit);setButtonState('data-flow-presentation',presentation);
    $('flow-demand-controls').hidden=view!=='demand';$('flow-prototype-controls').hidden=view!=='prototype';$('flow-balance-controls').hidden=view!=='balance';$('flow-balance-content').hidden=view!=='balance';
    $('flow-lot-unit-controls').hidden=balanceExample!=='lot';$('flow-ledger-controls').hidden=balanceExample!=='ledger';
    $('flow-balance-example').value=balanceExample;
    const elementIds=Object.keys(packet?.material_balance?.ledger_example?.element_ledgers||{});$('flow-ledger-element').innerHTML='<option value="mixture">Whole assayed mixture</option>'+elementIds.map(element=>`<option value="${esc(element)}">Contained ${esc(element)}</option>`).join('');$('flow-ledger-element').value=ledgerElement;
    const copy={demand:['01 / Sourced finished-magnet demand','Demand by application.','One historical finished-magnet demand total is divided into the source’s seven categories. Supplier origins and factory-to-customer shipments are not assigned.'],prototype:['02 / Original illustrative prototype','The 100-unit reference.','The original four-column illustration keeps its independent stage margins and hypothetical end-use weights. Its bands are assumed allocations.'],balance:['03 / Separate evidence boundaries','Forms before elements.','National quantities retain their own product boundaries. The separate purchased-material charge shows how a declared alloy mass contains more than one element.']}[view];
    $('flow-panel-eyebrow').textContent=copy[0];$('flow-panel-title').textContent=copy[1];$('flow-panel-description').textContent=copy[2];
    model=view==='demand'?demandModel():view==='prototype'?prototypeModel():balanceExample==='ledger'?ledgerModel():lotModel();
    const balance=packet?.material_balance;
    if(view==='balance')renderBalanceContent();
    if(!model){$('flow-basis').innerHTML=fact('Evidence status','Source packet unavailable · no quantitative result');$('flow-boundary').textContent='Missing source quantities remain unknown. No bands or inferred totals have been created.';$('flow-totals').innerHTML='';$('flow-network-layout').hidden=true;$('flow-data-table').innerHTML='';$('flow-evidence').innerHTML='<p>The declared evidence packet could not be loaded. Reload to retry.</p>';return;}
    $('flow-network-layout').hidden=false;
    const common=model.common;
    $('flow-basis').innerHTML=view==='balance'?fact('National source year',balance.year??'See each record')+fact('Geography',balance.geography)+fact('Material form','Separate source-specific product boundaries')+fact('Unit','See each card; no cross-form sum')+fact('Denominator','No complete national balance established')+fact('Status',balance.status):fact('Year',common.year)+fact('Geography',common.geography)+fact('Material form',common.form)+fact('Display unit',model.nodes[0]?.unit)+fact('Denominator',common.denominator)+fact('Status',common.status);
    $('flow-boundary').textContent=view==='demand'?model.region.scope:view==='prototype'?'Normalized reference only. All end-use weights and linking bands are hypothetical; there is no supported tonne conversion, observed ore loss or measured country trade.':'The cards are separate source quantities, not additive stages. Recycling, inventories, assay changes and processing losses cannot be invented to close a balance.';
    if(view==='demand'){
      const regions=model.demand.regions||[];$('flow-region').innerHTML=regions.map(region=>`<option value="${esc(region.id)}">${esc(region.label)}</option>`).join('');$('flow-region').value=regionId;
      $('flow-totals').innerHTML=regions.map(region=>`<article class="flow-total"><span>${esc(region.label)} · ${esc(model.demand.year)} modeled demand</span><strong>${number(region.total_tonnes,0)} <small>tonnes/year</small></strong><p>${esc(region.scope)}</p></article>`).join('');
      $('flow-chart-caption').textContent='One finished-magnet demand total → seven source categories';
      $('flow-evidence').innerHTML=sourceLinks(sourceIds(model.demand.source_ids,model.region.source_ids))+boundariesHTML(model.demand.boundaries);
    }else if(view==='prototype'){
      $('flow-totals').innerHTML=`<article class="flow-total"><span>Declared common basis · not an absolute mass</span><strong>${number(model.denominator,0)} <small>normalized units</small></strong><p>Stage shares and assumed end-use weights use the same declared reference; no conversion into tonnes is supported.</p></article>`;
      $('flow-chart-caption').textContent='Illustrative four-column allocation · every band is assumed';
      $('flow-evidence').innerHTML=sourceLinks(model.reference.source_ids)+boundariesHTML(model.reference.boundaries);
    }else{
      $('flow-totals').innerHTML='';$('flow-chart-caption').textContent=model.kind==='ledger'?'Opening stock & external arrivals → available pool → exits & closing stock':'Declared purchased forms → contained elements · ideal assay arithmetic';
      $('flow-evidence').innerHTML=model.kind==='ledger'?`<p>${esc(model.ledger.disclaimer_en)}</p><p>${esc(model.ledger.composition_note)}</p><p>Every flow and stock is declared in the illustrative ledger. This scenario does not replace the separate reported U.S. statistics above.</p><a href="data/flow-evidence.json">Inspect the declared scenario values ↗</a>`:sourceLinks(model.lot.source_ids)+boundariesHTML(model.lot.boundaries);
    }
    renderTable();renderSelected(model.records.find(record=>record.id===selectedId)||model.records[0]);renderChart();
  }
  async function init() {
    try{const response=await fetch('data/flow-evidence.json',{cache:'no-store'});if(!response.ok)throw Error('evidence packet unavailable');packet=await response.json();$('flow-load-status').textContent=`Evidence checked ${packet.as_of||'see source dates'} · historical estimates and scenario assumptions retain separate bases.`;}catch(_){$('flow-load-status').textContent='Evidence packet unavailable. Missing quantities remain unknown.';}
    render();
    document.querySelectorAll('button[data-flow-view]').forEach(button=>button.onclick=()=>{view=button.dataset.flowView;selectedId=null;render();updateURL();});
    document.querySelectorAll('[data-demand-unit]').forEach(button=>button.onclick=()=>{demandUnit=button.dataset.demandUnit;render();updateURL();});
    document.querySelectorAll('[data-prototype-unit]').forEach(button=>button.onclick=()=>{prototypeUnit=button.dataset.prototypeUnit;render();});
    document.querySelectorAll('[data-lot-unit]').forEach(button=>button.onclick=()=>{lotUnit=button.dataset.lotUnit;render();});
    document.querySelectorAll('[data-ledger-unit]').forEach(button=>button.onclick=()=>{ledgerUnit=button.dataset.ledgerUnit;render();});
    $('flow-balance-example').onchange=event=>{balanceExample=event.target.value;selectedId=null;render();};
    $('flow-ledger-element').onchange=event=>{ledgerElement=event.target.value;selectedId=null;render();};
    document.querySelectorAll('[data-flow-presentation]').forEach(button=>button.onclick=()=>{presentation=button.dataset.flowPresentation;render();});
    $('flow-region').onchange=event=>{regionId=event.target.value;selectedId=null;render();updateURL();};
    $('flow-data-table').onclick=event=>{const button=event.target.closest('button[data-flow-record]');if(button)renderSelected(model.records.find(record=>String(record.id)===button.getAttribute('data-flow-record')));};
    let narrow=window.innerWidth<760;
    window.addEventListener('resize',()=>{const nextNarrow=window.innerWidth<760;if(nextNarrow!==narrow){narrow=nextNarrow;presentation=narrow?'table':'chart';render();}});
  }
  init();
})();
