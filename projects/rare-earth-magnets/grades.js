'use strict';
const $ = id => document.getElementById(id);
const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, label) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(label)}</a>`;
const fmt = n => Number(n).toLocaleString('en-US', {maximumFractionDigits:2});
const colors = {Nd:'#c5a46b',Pr:'#e1c393',Dy:'#bb785d',Tb:'#a6a6cf',Fe:'#8aab95',B:'#73a8b8',Co:'#bcb7a9',Cu:'#ce9574',Al:'#d1d6c6'};
const sources = {
  ndpr:'https://www.ottokemi.com/specsheet/Neodymium-praseodymium-alloy.aspx',
  dyfe:'https://www.epomaterial.com/dysprosium-iron-alloy-dyfe-ingots-manufacturer-product/',
  feb:'https://www.nippondenko.co.jp/ourbusiness/functionalmaterials/boron/',
  patent:'https://patents.google.com/patent/CN104143403A/en',
  diffusion:'https://www.shinetsu-rare-earth-magnet.jp/e/notice/',
  csc:'https://www.csc.com.tw/csc_e/ts/ena/pdf/no35/pages/9-Effect%20of%20Adding%20Pr-Co%20Powder%20in%20Recycled%20NdFeB%20Material.pdf',
  prokofev:'https://pmc.ncbi.nlm.nih.gov/articles/PMC7411784/',
  catalog:'https://www.arnoldmagnetics.com/wp-content/uploads/2017/10/Catalog-151021.pdf'
};
const ingredients = {
  NdPr:{name:'Neodymium + praseodymium',short:'NdPr',chinese:'钕 · 镨 / 镨钕',say:'nee-oh-DIM-ee-um · pray-zee-oh-DIM-ee-um',spoken:'neodymium, praseodymium',role:'The rare-earth foundation of the hard magnetic phase.',feed:'NdPr metal alloy · one combined purchased input',note:'A published supplier blend is nominally Nd 75% / Pr 25%. Ratios and purity vary by product. Combined NdPr oxide and NdPr metal are different price bases.',url:sources.ndpr,source:'NdPr supplier specification'},
  Dy:{name:'Dysprosium',short:'Dy',chinese:'镝 / 镝铁',say:'dis-PROH-zee-um',spoken:'dysprosium',role:'Helps resist demagnetization, especially under heat and opposing fields.',feed:'Dy–Fe master alloy / ferro-dysprosium',note:'DyFe80 is a nominal alloy designation. The supplier assay separates total rare-earth content from Dy purity within that content. It supplies carrier iron too.',url:sources.dyfe,source:'DyFe manufacturer specification'},
  Tb:{name:'Terbium',short:'Tb',chinese:'铽',say:'TER-bee-um',spoken:'terbium',role:'A heavy rare earth used to improve coercivity; application and processing matter.',feed:'Tb metal or a specified diffusion source',note:'A bulk alloy addition and a surface diffusion treatment are different manufacturing routes. More Tb does not automatically mean greater energy product.',url:sources.diffusion,source:'Shin-Etsu process explanation'},
  Fe:{name:'Iron',short:'Fe',chinese:'铁',say:'EYE-ern',spoken:'iron',role:'Not a rare earth. Iron is the largest mass fraction in these reported NdFeB specimens.',feed:'Iron plus iron carried in master alloys',note:'DyFe and ferroboron already contribute iron. Counting them and a full iron requirement separately would overcharge the batch. Ore prices are upstream proxies, not high-purity iron quotes.',url:sources.patent,source:'Public manufacturing example'},
  B:{name:'Boron',short:'B',chinese:'硼 / 硼铁',say:'BOR-on',spoken:'boron',role:'Not a rare earth. Boron is a small but essential ingredient in the Nd₂Fe₁₄B magnetic phase.',feed:'Ferroboron / FeB master alloy · 硼铁',note:'Ferroboron means iron plus boron, not terbium plus boron. A published patent uses FeB20: nominally 20% boron and 80% iron. This is an example feed specification, not a universal ferroboron composition.',url:sources.feb,source:'Nippon Denko product explanation'}
};
const steps = [
  ['Mined resource','Extraction produces ore or mineral-bearing material. Nd/Pr and Dy/Tb deposits differ; a mine pin is not evidence that every rare earth is commercially recovered there.'],
  ['Separate & reduce','Beneficiation and chemical separation produce specified intermediates. Metalmaking converts suitable rare-earth compounds into metals or alloys. NdPr may remain combined as a commercial product.'],
  ['Purchased feedstock','Read the actual product assay: NdPr alloy, DyFe, ferroboron and pure metals contribute different combinations of elements. Ore, oxide, metal and alloy prices are not interchangeable.'],
  ['Make & qualify','Alloying, strip casting, hydrogen decrepitation, milling, magnetic alignment, sintering, annealing, machining and coating shape performance. Customer qualification makes the part usable.'],
  ['Useful motion','Permanent magnets serve selected motor and generator designs, actuators, speakers and HDDs. Application geometry, temperature and demagnetizing fields determine the suitable grade.']
];
const specimens = {
  csc:{title:'Magnet made from fresh strip-cast alloy · CSC 2022',elements:{Nd:29.6,Tb:1.2,Co:.6,Cu:.2,Al:.2,B:1,Fe:67.2},performance:'Reported sintered magnet: Br 1.396 T · Hci 16.05 kOe · (BH)max 47.76 MGOe.',source:sources.csc,locator:'Experimental composition and Table 2, pp. 53–56'},
  prokofev:{title:'High-coercivity starting magnet · Prokofev et al. 2020',elements:{Nd:20.7,Pr:5.6,Dy:6.6,B:1,Cu:.22,Al:.53,Co:.3,Fe:65.05},performance:'Reported starting specimen: Br 1.13 T · Hcj 2,150 kA/m · (BH)max 250 kJ/m³.',source:sources.prokofev,locator:'Materials and Methods, starting specimen (not the separate N42 material)'}
};
const feedSpecs = {NdPr:{label:'NdPr75/25',fractions:{Nd:.75,Pr:.25}},Nd:{label:'Nd metal',fractions:{Nd:1}},DyFe:{label:'DyFe80',fractions:{Dy:.8,Fe:.2}},Tb:{label:'Tb metal',fractions:{Tb:1}},FeB:{label:'FeB20',fractions:{B:.2,Fe:.8}},Fe:{label:'Iron',fractions:{Fe:1}},Co:{label:'Cobalt',fractions:{Co:1}},Cu:{label:'Copper',fractions:{Cu:1}},Al:{label:'Aluminum',fractions:{Al:1}}};
let selectedIngredient='NdPr',selectedPrice='NdPr',selectedSpecimen='prokofev',selectedStep=2,mapMode='all',selectedMine='mountain-pass';
let datasets={},quotes={},batchFeeds=[],projection,geoPath,mapData,mapZoom;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function mountJourneyArtwork() {
  // Nested viewports crop the original 3-by-2 ImageGen sheets without editing pixels.
  // Machine artwork is representative; paths, ingredient tiles and arrows are diagrams.
  const sprite = (sheet, cell, x, y) => `<svg class="journey-machine" x="${x}" y="${y}" width="160" height="160" viewBox="${(cell%3)*512} ${Math.floor(cell/3)*512} 512 512" overflow="hidden" aria-hidden="true"><image href="assets/machines-${sheet}.png" x="0" y="0" width="1536" height="1024"/></svg>`;
  $('journey-scene').innerHTML=`<title id="scene-title">From mined resource to finished magnet</title><desc id="scene-desc">Representative generated illustrations show a mine, separation equipment and a sintering furnace. Ingredient tiles and aligned arrows are functional diagrams. Animation explains sequence, not measured flow or processing time. The furnace is shown as a loading cutaway; processing uses a sealed chamber.</desc>
    <path d="M72 269H825" stroke="#c5a46b" stroke-opacity=".18"/>
    <g class="scene-object" data-scene="0" tabindex="0" role="button" aria-label="Learn about mining">${sprite('upstream',0,16,90)}<text x="96" y="301" text-anchor="middle">Mined resource</text></g>
    <g class="scene-object" data-scene="1" tabindex="0" role="button" aria-label="Learn about separation">${sprite('upstream',2,183,90)}<text x="263" y="301" text-anchor="middle">Separate &amp; reduce</text></g>
    <g class="scene-object" data-scene="2" tabindex="0" role="button" aria-label="Learn about purchased feedstocks">
      <rect x="355" y="146" width="118" height="90" rx="4" fill="#1b2c23" stroke="#8aab95"/>
      <path d="M367 190H460" stroke="#8aab95" stroke-opacity=".35"/>
      <text class="feed-diagram-label" x="414" y="178" text-anchor="middle" id="scene-feed-elements">Nd + Pr</text>
      <text x="414" y="215" text-anchor="middle">one bought input</text>
      <text x="414" y="301" text-anchor="middle" id="scene-feed-label">NdPr alloy</text>
    </g>
    <g class="scene-object" data-scene="3" tabindex="0" role="button" aria-label="Learn about making a magnet">${sprite('factory',2,502,90)}<text x="582" y="301" text-anchor="middle">Make &amp; qualify</text></g>
    <g class="scene-object" data-scene="4" tabindex="0" role="button" aria-label="Learn about magnet applications">
      <rect x="703" y="137" width="114" height="106" rx="4" fill="#1b2c23" stroke="#c5a46b"/>
      <g class="journey-domains" fill="#e1c393"><text x="726" y="185" text-anchor="middle">↑</text><text x="760" y="185" text-anchor="middle">↑</text><text x="794" y="185" text-anchor="middle">↑</text><text x="726" y="219" text-anchor="middle">↑</text><text x="760" y="219" text-anchor="middle">↑</text><text x="794" y="219" text-anchor="middle">↑</text></g>
      <text x="760" y="123" text-anchor="middle">Magnetized part</text><text x="760" y="301" text-anchor="middle">Useful motion</text>
    </g>
    <g class="flow-dots" fill="#c5a46b"><circle cx="176" cy="257" r="3"/><circle cx="337" cy="257" r="3"/><circle cx="488" cy="257" r="3"/><circle cx="660" cy="257" r="3"/></g>
    <text x="440" y="342" text-anchor="middle">Select a stage. Artwork is representative; movement does not measure flow.</text>`;
}

function setIngredient(id) {
  selectedIngredient=id;
  document.querySelectorAll('[data-ingredient]').forEach(b=>{const a=b.dataset.ingredient===id;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a));});
  const x=ingredients[id];
  $('ingredient-detail').innerHTML=`<p class="micro-label">${escapeHTML(x.chinese)}</p><h2>${escapeHTML(x.name)}</h2><div class="pronunciation">${escapeHTML(x.say)}</div><button class="listen" id="listen-name" type="button">Hear the name</button><p class="ingredient-role">${escapeHTML(x.role)}</p><div class="feed-tag"><strong>${escapeHTML(x.feed)}</strong></div><p style="margin:16px 0">${escapeHTML(x.note)}</p>${link(x.url,x.source)}`;
  $('listen-name').disabled=!('speechSynthesis' in window);
  $('listen-name').onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(x.spoken);u.lang='en-US';u.rate=.75;speechSynthesis.speak(u);};
  $('scene-feed-label').textContent=id==='NdPr'?'NdPr alloy':id==='Dy'?'DyFe alloy':id==='B'?'Ferroboron':'Specified feed';
  $('scene-feed-elements').textContent=({NdPr:'Nd + Pr',Dy:'Dy + Fe',Tb:'Tb source',Fe:'Fe',B:'B + Fe'})[id];
  if(mapData) renderMap();
}
function setStep(i) {
  selectedStep=i;
  document.querySelectorAll('[data-scene]').forEach(n=>n.classList.toggle('selected',Number(n.dataset.scene)===i));
  document.querySelectorAll('[data-step]').forEach(b=>{const active=Number(b.dataset.step)===i;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  $('step-explanation').innerHTML=`<strong>${escapeHTML(steps[i][0])}</strong><p>${escapeHTML(steps[i][1])}</p>`;
}
function calculateFeeds(elements) {
  const feeds=[];let carrierFe=0;
  const combined=Math.min((elements.Nd||0)/.75,(elements.Pr||0)/.25);
  if(combined>0) feeds.push({id:'NdPr',mass:combined});
  const nd=(elements.Nd||0)-.75*combined;
  if(nd>1e-8) feeds.push({id:'Nd',mass:nd});
  const remainingPr=(elements.Pr||0)-.25*combined;
  if(remainingPr>1e-8) throw new Error('Selected specimen needs an additional Pr feed specification.');
  if(elements.Dy){const mass=elements.Dy/.8;feeds.push({id:'DyFe',mass});carrierFe+=mass*.2;}
  if(elements.Tb) feeds.push({id:'Tb',mass:elements.Tb});
  const feb=(elements.B||0)/.2;if(feb){feeds.push({id:'FeB',mass:feb});carrierFe+=feb*.8;}
  if((elements.Fe||0)<carrierFe) throw new Error('Carrier iron exceeds target iron.');
  feeds.push({id:'Fe',mass:(elements.Fe||0)-carrierFe});
  for(const id of ['Co','Cu','Al']) if(elements[id]) feeds.push({id,mass:elements[id]});
  const reconstructed={};
  for(const f of feeds) for(const [el,frac] of Object.entries(feedSpecs[f.id].fractions)) reconstructed[el]=(reconstructed[el]||0)+frac*f.mass;
  for(const [el,mass] of Object.entries(elements)) if(Math.abs((reconstructed[el]||0)-mass)>1e-7) throw new Error('Charging balance failed.');
  return feeds;
}
function showSpecimen(id) {
  selectedSpecimen=id;
  document.querySelectorAll('[data-specimen]').forEach(b=>{const a=b.dataset.specimen===id;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a));});
  const s=specimens[id],els=Object.entries(s.elements).sort((a,b)=>b[1]-a[1]);
  $('composition-graphic').innerHTML=`<div class="alloy-ribbon" role="img" aria-label="${els.map(([el,v])=>`${el} ${v} weight percent`).join(', ')}">${els.map(([el,v])=>`<div style="width:${v}%;background:${colors[el]}">${v>8?`<b>${el}</b><small>${fmt(v)}%</small>`:''}</div>`).join('')}</div><div class="composition-key">${els.map(([el,v])=>`<span><i style="background:${colors[el]}"></i>${el} ${fmt(v)}%</span>`).join('')}</div>`;
  $('specimen-description').innerHTML=`<p class="specimen-caption"><strong>${escapeHTML(s.title)}</strong>${escapeHTML(s.performance)}<br>Weight percent of nominal alloy; Fe is calculated from “balance.” Unlisted elements are not proof of zero impurities.</p><div class="specimen-source">${link(s.source,s.locator)}</div>`;
  batchFeeds=calculateFeeds(s.elements);
  $('feed-graphic').innerHTML=`<h3 class="feed-heading">An illustrative 100 kg charging plan</h3><p class="small-note">Using ideal nominal NdPr75/25, DyFe80 and FeB20 feeds. Actual factory charges require supplier assays and loss allowances. These feed conversions are our calculation, not the paper’s reported purchasing plan.</p><div class="feed-list">${batchFeeds.map(f=>{const spec=feedSpecs[f.id];return `<article class="feed-piece"><div class="feed-piece-top"><span>${spec.label}</span><b>${fmt(f.mass)} kg</b></div><div class="feed-strip">${Object.entries(spec.fractions).map(([el,v])=>`<span style="width:${v*100}%;background:${colors[el]}"></span>`).join('')}</div><p>${Object.entries(spec.fractions).map(([el,v])=>`${fmt(f.mass*v)} kg ${el}`).join(' + ')}</p></article>`;}).join('')}</div><p class="small-note">Master-alloy examples: ${link(sources.patent,'published patent')} · ${link(sources.ndpr,'NdPr specification')} · ${link(sources.dyfe,'DyFe assay')}</p>`;
  $('quote-form').innerHTML=batchFeeds.map(f=>`<label for="quote-${f.id}"><span>${feedSpecs[f.id].label}<small>${fmt(f.mass)} kg purchased feed</small></span><input id="quote-${f.id}" data-quote="${f.id}" type="number" min="0" max="1000000" step="0.01" placeholder="USD/kg" value="${quotes[f.id]??''}" aria-label="${feedSpecs[f.id].label} purchase price in USD per kilogram"></label>`).join('');
  $('quote-form').oninput=e=>{const id=e.target.dataset.quote;if(!id)return;quotes[id]=e.target.value===''?null:Number(e.target.value);showCost();};
  showCost();
}
function showCost() {
  const known=batchFeeds.filter(f=>Number.isFinite(quotes[f.id])&&quotes[f.id]>=0&&quotes[f.id]<=1000000);
  const missing=batchFeeds.length-known.length,cost=known.reduce((a,f)=>a+f.mass*quotes[f.id],0);
  if(missing) $('batch-result').innerHTML=`<strong>${known.length?`$${fmt(cost)}`:'Quotes needed'}</strong><p>${known.length?'Known-input subtotal only. ':''}${missing} purchase ${missing===1?'quote remains':'quotes remain'} unknown. No complete batch cost yet.</p>`;
  else $('batch-result').innerHTML=`<strong>$${fmt(cost)}</strong><p>Ideal feed cost / 100 kg charge<br>$${fmt(cost/100)} / kg charged alloy</p>`;
}

// Map filters operate on actual products and cited relationships, never inferred shipments.
let mapIngredient='all',mapStage='all',mapEvidence='all',mapPathId='all',mapLanguage='en';
let mapVisibleNodes=[],mapVisibleRoutes=[],mapTransform;
let mapLayer='facilities',reserveDisplay='bubbles',selectedReserve='156',applicationSector='all',applicationCountry='all',selectedApplication;
let mapCountryFeatures=[];
const mapStages={
  origin:{en:'Extraction / resource',zh:'开采 / 资源',color:'#c5a46b',shape:'circle'},
  processing:{en:'Separation / refining',zh:'分离 / 精炼',color:'#8aab95',shape:'square'},
  conversion:{en:'Metal / master alloy',zh:'金属 / 中间合金',color:'#d29672',shape:'diamond'},
  manufacturing:{en:'Magnet / component',zh:'磁体 / 部件制造',color:'#aaa4ce',shape:'triangle'},
  entry:{en:'U.S. entry / logistics / market',zh:'美国入口 / 物流 / 市场',color:'#77a8b8',shape:'cross'}
};
const mapEvidenceTypes={
  reported:{en:'Reported operating relationship',zh:'已报告的运营关系'},
  agreement:{en:'Contract / proposed',zh:'合同 / 拟议关系'},
  capability:{en:'Capability / sales channel',zh:'能力 / 销售渠道'},
  pilot:{en:'Pilot / qualification',zh:'试验 / 客户认证'},
  development:{en:'Development',zh:'开发项目'},
  aggregate:{en:'Aggregate / regional context',zh:'汇总 / 区域背景'}
};
const mapCopy={
  en:{ingredient:'Ingredient',stage:'Stage',evidence:'Evidence status',path:'Evidence path',all:'All',follow:'Guide ingredient',allPaths:'All mapped paths',allEvidence:'All evidence',allStages:'All stages',allIngredients:'All ingredients',us:'U.S. connections',language:'Map language',help:'Drag to pan · scroll or pinch to zoom · arrow keys to pan',eastAsia:'China / East Asia',fit:'Fit results',world:'World',operator:'Operator',control:'Parent / control',product:'Product at this stage',location:'Location precision',connection:'U.S. connection',relations:'Incoming & outgoing evidence',noRelations:'No connecting relationship is established here. This is a capability or origin marker, not a complete supply chain.',sources:'Open primary evidence',empty:'No mapped place matches these filters.',disclaimer:'Equal-width lines show evidence relationships, not tonnes or transport itineraries. Hollow markers denote development or display-only regions. Approximate coordinates and missing links are explained for each place.',pathTitle:'Follow a documented relationship',pathPrompt:'Choose an evidence path above, or open a place. Missing mines, converters and customers remain visible as gaps rather than invented arrows.',gap:'Evidence gap',notMapped:'Location not mapped',hidden:'A mapped place outside the current stage, ingredient or status filter',noQuantity:'Map lines do not establish traded quantity, transport or a complete batch assay.',placeSources:'Place evidence',relatedSources:'Relationship evidence',overlap:'Several entries share an approximate regional anchor. Use the place list or stage filter to inspect each; no offset is presented as a physical location.'},
  zh:{ingredient:'原料',stage:'工序',evidence:'证据状态',path:'证据路径',all:'全部',follow:'指南所选原料',allPaths:'全部已定位路径',allEvidence:'全部证据',allStages:'全部工序',allIngredients:'全部原料',us:'美国关联',language:'地图语言',help:'拖动平移 · 滚轮或双指缩放 · 方向键平移',eastAsia:'中国 / 东亚',fit:'适配筛选结果',world:'全球',operator:'运营方',control:'母公司 / 控制关系',product:'该工序的产品',location:'位置精度',connection:'美国关联',relations:'上游与下游证据',noRelations:'此处未建立连接关系。这是能力或原产地标记，并非完整供应链。',sources:'打开原始证据',empty:'当前筛选条件没有已定位地点。',disclaimer:'等宽连线表示有证据的关系，不代表吨位或运输路线。空心标记表示开发项目或仅供展示的区域。每个地点均说明近似位置与缺失环节。',pathTitle:'沿证据探索路径',pathPrompt:'在上方选择证据路径，或打开地点。未披露的矿源、转换方和客户将保留为证据缺口，不补画假设连线。',gap:'证据缺口',notMapped:'未定位的环节',hidden:'已定位，但被当前工序、原料或状态筛选隐藏',noQuantity:'地图连线不证明交易吨位、运输方式或完整批次成分。',placeSources:'地点证据',relatedSources:'关系证据',overlap:'多个条目使用同一近似区域锚点。请用地点列表或工序筛选查看；不会把显示偏移当成实际位置。'}
};
const mapText=key=>mapCopy[mapLanguage][key]||key;
Object.assign(mapCopy.en,{layer:'Map layer',reserveDisplay:'Reserve display',reserveCountry:'Inspect a country / territory',applicationSector:'Application sector',applicationCountry:'Application geography',supplyMap:'Supply-chain map',applicationMap:'Applications & Demand',equipmentReadiness:'Equipment & readiness · Question B ↗',usApplications:'U.S. application sites ↗',demand:'Demand / Industry size · Question A ↗'});
Object.assign(mapCopy.zh,{layer:'地图图层',reserveDisplay:'储量显示',reserveCountry:'查看国家',applicationSector:'应用行业',applicationCountry:'应用地点范围',supplyMap:'供应链地图',applicationMap:'应用与需求',equipmentReadiness:'设备与就绪 · 问题 B ↗',usApplications:'美国应用地点 ↗',demand:'需求 / 行业规模 · 问题 A ↗'});
function materialMatch(materials,ingredient=selectedIngredient) {return ingredient==='all'||(ingredient==='NdPr'?(materials||[]).some(x=>['Nd','Pr','NdPr'].includes(x)):(materials||[]).includes(ingredient));}
const mapSelectedIngredient=()=>mapIngredient==='follow'?selectedIngredient:mapIngredient;
const allPlaceRecords=()=>[...(mapData.nodes||[]),...(mapData.route_nodes||[]),...(mapData.unlocated_nodes||[])];
const allMapNodes=()=>allPlaceRecords().filter(n=>Number.isFinite(n.lat)&&Number.isFinite(n.lon));
function nodeStage(n) {
  if(n.stage) return n.stage;
  if(/mine|resource|district|development_project/.test(n.kind)) return 'origin';
  if(/metal_alloy/.test(n.kind)) return 'conversion';
  if(/processing|separation|refin/.test(n.kind)) return 'processing';
  if(/steelworks|magnet/.test(n.kind)) return 'manufacturing';
  return 'entry';
}
const stageTags=n=>n.stage_tags||[nodeStage(n)];
const displayedStage=n=>mapStage!=='all'&&stageTags(n).includes(mapStage)?mapStage:nodeStage(n);
function evidenceClass(item) {
  if(item.element_evidence&&item.element_evidence[mapSelectedIngredient()])return item.element_evidence[mapSelectedIngredient()];
  if(item.evidence_class) return item.evidence_class;
  const status=String(item.status||'');
  if(/aggregate|market|region/.test(status))return 'aggregate';
  if(/development|announced_future/.test(status))return 'development';
  if(/pilot|demonstration|qualification|sample|commission/.test(status))return 'pilot';
  if(/offtake|contract|LOI|MoU|proposed|framework/.test(status))return 'agreement';
  if(/capability/.test(status))return 'capability';
  return item.physical_flow===false?'capability':'reported';
}
function mapScope() {
  const nodes=allMapNodes(),lookup=new Map(nodes.map(n=>[n.id,n])),ingredient=mapSelectedIngredient();
  const path=(mapData.map_paths||[]).find(p=>p.id===mapPathId);
  const pathNodes=path?new Set(path.steps.filter(s=>typeof s==='string')):null;
  const pathRelations=path?new Set(path.route_ids||[]):null;
  const usNodes=new Set(nodes.filter(n=>n.us_relevance||['direct_documented','indirect_documented','indirect_group_documented'].includes(n.us_connection?.status)).map(n=>n.id));
  const relevantRelations=mapData.routes.filter(r=>materialMatch(r.materials,ingredient)&&(mapEvidence==='all'||evidenceClass(r)===mapEvidence)&&(!pathRelations||pathRelations.has(r.id)));
  const evidenceEndpoints=new Set(relevantRelations.flatMap(r=>[r.source,r.target]));
  const visible=nodes.filter(n=>(materialMatch(n.materials,ingredient)||Boolean(n.material_roles?.[ingredient]))&&(mapStage==='all'||stageTags(n).includes(mapStage))&&(mapEvidence==='all'||evidenceClass(n)===mapEvidence||evidenceEndpoints.has(n.id))&&(!pathNodes||pathNodes.has(n.id))&&(mapMode!=='us'||usNodes.has(n.id)));
  const ids=new Set(visible.map(n=>n.id));
  const routes=mapData.routes.filter(r=>r.draw_on_map!==false&&ids.has(r.source)&&ids.has(r.target)&&materialMatch(r.materials,ingredient)&&(mapEvidence==='all'||evidenceClass(r)===mapEvidence)&&(!pathRelations||pathRelations.has(r.id))&&lookup.has(r.source)&&lookup.has(r.target));
  return {nodes:visible,routes,lookup,path};
}
const countryNames={'United States':'美国','China':'中国','Australia':'澳大利亚','Brazil':'巴西','Malaysia':'马来西亚','Turkey':'土耳其','United Kingdom':'英国','France':'法国','India':'印度','Japan':'日本','South Korea':'韩国','Korea':'韩国','Estonia':'爱沙尼亚','Myanmar':'缅甸','Vietnam':'越南','Canada':'加拿大'};
Object.assign(countryNames,{Austria:'奥地利',Germany:'德国',Switzerland:'瑞士',Poland:'波兰',Thailand:'泰国',Mexico:'墨西哥'});
const placeCountry=n=>`${n.country}${countryNames[n.country]?` · ${countryNames[n.country]}`:''}`;
function sourceLinks(ids) {return [...new Set(ids||[])].map(id=>{const s=mapData.sources.find(x=>x.id===id);return s?link(s.url,`${s.title}${s.publication_date||s.date?` · ${s.publication_date||s.date}`:''}`):'';}).join(' ');}
function mapStageIcon(stage) {const s=mapStages[stage]||mapStages.entry;return `<i class="stage-icon stage-${s.shape}" style="--stage-color:${s.color}" aria-hidden="true"></i>`;}
// Aliases join existing evidence records, never new coordinates or physical flows.
const equipmentMapAlias=id=>({mp_mine:'mountain-pass',mp_oxide:'mountain-pass',independence_fortworth:'independence'}[id]||id);
const equipmentStageLabel=id=>({separation_oxide:'Separation / oxide finishing',separation_hree:'Heavy-rare-earth separation',metallization:'Oxide → metal',melt_strip_cast:'Melting / strip casting',hydrogen_decrepitation:'Hydrogen decrepitation',jet_milling:'Jet milling',field_oriented_press:'Field-oriented pressing',vacuum_sinter_age:'Vacuum sintering / aging',grain_boundary_diffusion:'Grain-boundary diffusion',machine_coat:'Machining / coating',magnetize_test_qualify:'Magnetization / metrology / qualification'}[id]||id);
function equipmentMakerLabel(r) {
  return {equip_gbd_shinetsu:'Shin-Etsu Chemical · process developer/operator; actual machine maker undisclosed',equip_finish_arnold:'Arnold · evidence operator; actual machine/coating-line makers undisclosed',equip_mag_test:'MAGNET-PHYSIK; BROCKHAUS Measurements'}[r.id]||r.equipment_maker||'Specific equipment maker not established';
}
function equipmentRecordHTML(r,direct=false) {
  const data=datasets.equipment,geography=(r.geography||[]).map(g=>`<li><strong>${escapeHTML(g.place)}</strong><br>${escapeHTML(g.role)}</li>`).join('');
  const output=direct&&(r.capacity_or_output||[]).length?`<details class="equipment-product-basis"><summary>Reported product output / design basis</summary>${r.capacity_or_output.map(m=>`<p><strong>${Number.isFinite(m.value)?fmt(m.value):'Unknown'} ${escapeHTML(m.unit||'')}</strong>${m.period?` · ${escapeHTML(m.period)}`:''}<br><span class="small-note">${escapeHTML(m.basis||'Basis not established')}</span></p>`).join('')}<p class="small-note">Periods and products stay separate. Quarter output is not annualized; oxide or alloy output is not qualified magnet output.</p></details>`:'';
  return `<article class="equipment-map-record" data-equipment-record="${escapeHTML(r.id)}"><p class="micro-label">${escapeHTML(equipmentStageLabel(r.stage_id))}${direct?' · site-specific evidence':' · process capability example'}</p><h4>${escapeHTML(r.label_en||r.id)}</h4><p class="equipment-record-status">${escapeHTML(r.status||'Readiness not established')}</p><p>${escapeHTML(r.output_or_function||'')}</p><p><strong>Maker / operator role</strong><br>${escapeHTML(equipmentMakerLabel(r))}</p>${direct&&r.confirmed_installation?`<p class="small-note"><strong>Documented installation:</strong> ${escapeHTML(r.confirmed_installation.operator)} · ${escapeHTML(r.confirmed_installation.location)}. ${r.confirmed_installation.maker_order_public?'A named maker order is cited.':'Specific maker order not disclosed.'}</p>`:''}${geography?`<ul class="equipment-geography">${geography}</ul>`:'<p class="small-note">Manufacturing / service geography not established in this record.</p>'}${output}${(r.unknowns||[]).map(v=>`<p class="small-note equipment-evidence-gap">${escapeHTML(v)}</p>`).join('')}<div class="equipment-record-sources">${layerSourceLinks(data,r.source_ids||[])}</div></article>`;
}
function equipmentContextHTML(n) {
  const data=datasets.equipment;
  if(!data)return '';
  const anchors=data.stage_record_to_map_anchor||{},direct=(data.equipment_stage_records||[]).filter(r=>equipmentMapAlias(anchors[r.id])===n.id);
  const projects=(data.us_project_comparison||[]).filter(p=>equipmentMapAlias(p.node_id)===n.id),facilities=(data.proposed_facility_nodes||[]).filter(p=>equipmentMapAlias(p.id)===n.id);
  if(!direct.length&&!projects.length&&!facilities.length&&!(data.existing_node_references||[]).some(id=>equipmentMapAlias(id)===n.id))return '';
  const stage=displayedStage(n),capabilityStages=stage==='manufacturing'?['melt_strip_cast','hydrogen_decrepitation','jet_milling','field_oriented_press','vacuum_sinter_age','grain_boundary_diffusion','machine_coat','magnetize_test_qualify']:stage==='conversion'?['metallization','melt_strip_cast']:[];
  const examples=(data.equipment_stage_records||[]).filter(r=>capabilityStages.includes(r.stage_id)&&!direct.some(d=>d.id===r.id));
  const projectHTML=projects.map(p=>`<article class="equipment-map-project" data-equipment-project="${escapeHTML(p.id)}"><p class="micro-label">Documented project readiness</p><h4>${escapeHTML(p.scope||'Project')}</h4><p>${escapeHTML(p.readiness||'Readiness not established')}</p><p class="small-note"><strong>Customer-accepted annual output:</strong> ${Number.isFinite(p.usableannualoutput)?'See the source’s product and time basis.':'Unknown in this dossier. A shipment, financing, installed machine or nameplate does not establish routine qualified annual output.'}</p>${p.equipmentmakers?`<p class="small-note"><strong>Equipment makers:</strong> ${escapeHTML(p.equipmentmakers)}</p>`:''}<div class="equipment-record-sources">${layerSourceLinks(data,p.source_ids||[])}</div></article>`).join('');
  const facilityHTML=facilities.map(p=>`<p class="equipment-record-status">${escapeHTML(p.status)}</p><div class="equipment-record-sources">${layerSourceLinks(data,p.source_ids||[])}</div>`).join('');
  return `<details class="map-equipment-evidence" data-equipment-place="${escapeHTML(n.id)}"><summary>${mapLanguage==='zh'?'设备与生产能力证据':'Equipment & capability evidence'}</summary><p class="small-note">Dossier reviewed ${escapeHTML(data.as_of||'see source dates')}. Equipment purchases, material transactions and customer acceptance are separate evidence. Named manufacturers, service addresses and commissioning do not establish complete machine-component origin or qualified magnet tonnes.</p>${projectHTML}${facilityHTML}${direct.map(r=>equipmentRecordHTML(r,true)).join('')}${examples.length?`<details class="equipment-capability-examples"><summary>Equipment makers by process · ${examples.length} examples</summary><p class="equipment-evidence-gap">These are separately sourced process capabilities, not an equipment list for ${escapeHTML(n.name)}. No source establishes that this plant installed these machines or uses every process shown. Manufacturer, seller, dispatch, installation and service geographies are different roles.</p>${examples.map(r=>equipmentRecordHTML(r,false)).join('')}</details>`:''}<p class="small-note">Machine prices, project spending and financing are separate. No comparable installed equipment quote or total investment is calculated here. Maker records remain a documentary dossier; no equipment coordinates or supply arcs are added.</p><a class="equipment-future-link" href="future.html?question=readiness#future-questions">${mapLanguage==='zh'?'研究问题 B：设备、时间与可用供应 ↗':'Question B: equipment, time & usable supply ↗'}</a></details>`;
}
function showMine(id) {
  selectedMine=id;const n=allPlaceRecords().find(x=>x.id===id);if(!n)return;
  const stage=displayedStage(n),r=mapData.routes.filter(x=>x.source===id||x.target===id),lookup=new Map(allPlaceRecords().map(x=>[x.id,x]));
  const sameAnchor=allMapNodes().filter(x=>x.id!==id&&Math.abs(x.lat-n.lat)<.005&&Math.abs(x.lon-n.lon)<.005);
  const location=n.location?.accuracy?`${n.location.accuracy} · ${n.location.method}`:n.location_note||'Approximate location; see cited evidence.';
  const product=(mapStage!=='all'&&n.stage_details?.[mapStage])||n.material_form||n.product||n.summary||'Product form not disclosed';
  const relations=r.map(x=>{const incoming=x.target===id,other=lookup.get(incoming?x.source:x.target);return `<article class="map-relation evidence-${evidenceClass(x)}"><p><span>${incoming?'←':'→'}</span> ${other?`<button type="button" data-related-place="${escapeHTML(other.id)}">${escapeHTML(other.name)}</button>`:`<strong>${escapeHTML(x.target_label||'Location not mapped')}</strong>`}</p><strong>${escapeHTML(x.status_label||x.status)}</strong><p>${escapeHTML(x.product||x.relationship?.replaceAll('_',' ')||'')}</p><p>${escapeHTML(mapLanguage==='zh'&&x.summary_zh?x.summary_zh:x.summary||'')}</p>${(x.caveats||[]).map(c=>`<p class="small-note">${escapeHTML(c)}</p>`).join('')}${!x.physical_flow?`<p class="small-note">${mapLanguage==='zh'?'此关系不证明实际连续交货或完整批次追溯。':'This relationship does not establish continuous physical deliveries or an end-to-end batch trace.'}</p>`:''}<details><summary>${mapText('relatedSources')}</summary>${sourceLinks(x.sources)}</details></article>`;}).join('');
  const role=n.material_roles?.[mapSelectedIngredient()];
  const elementStates=Object.entries(n.element_status||{}).map(([el,status])=>`<li><strong>${escapeHTML(el)}</strong> ${escapeHTML(status)}</li>`).join('');
  const coStages=stageTags(n).length>1?`<div class="map-place-stages">${stageTags(n).map(s=>`<button type="button" data-place-stage="${s}">${mapStageIcon(s)}${mapStages[s][mapLanguage]}</button>`).join('')}</div>`:'';
  $('mine-detail').innerHTML=`<p class="micro-label">${escapeHTML(placeCountry(n))}${n.region?` · ${escapeHTML(n.region)}`:''}</p><h3>${escapeHTML(mapLanguage==='zh'&&n.name_zh?n.name_zh:n.name)}</h3><p class="place-subtitle">${mapStageIcon(stage)} ${escapeHTML(mapStages[stage][mapLanguage])}</p>${coStages}<p class="map-state evidence-${evidenceClass(n)}">${escapeHTML(n.status_label||n.status)}</p><h4>${mapText('product')}</h4><p>${escapeHTML(product)}</p>${role?`<p class="connection-note">${escapeHTML(role)}</p>`:''}${elementStates?`<ul class="map-element-status">${elementStates}</ul>`:''}${n.summary&&n.summary!==product?`<p class="small-note">${escapeHTML(n.summary)}</p>`:''}<h4>${mapText('operator')}</h4><p>${escapeHTML(n.operator||'Not assigned by the reviewed evidence')}</p>${n.parent_control?`<h4>${mapText('control')}</h4><p>${escapeHTML(n.parent_control)}</p>`:''}${n.ownership?`<p class="small-note">${escapeHTML(n.ownership)}</p>`:''}${n.us_connection?`<h4>${mapText('connection')}</h4><p class="connection-note"><strong>${escapeHTML(n.us_connection.label)}</strong><br>${escapeHTML(n.us_connection.summary)}</p>`:''}<h4>${mapText('location')}</h4><p class="small-note">${escapeHTML(location)}${n.location?.uncertainty_km?` · ~${fmt(n.location.uncertainty_km)} km stated display uncertainty`:''}</p>${sameAnchor.length?`<p class="small-note">${mapText('overlap')}</p>`:''}${n.magnet_feedstock_evidence?`<p class="small-note">${escapeHTML(n.magnet_feedstock_evidence)}</p>`:''}${(n.caveats||[]).map(x=>`<p class="small-note">${escapeHTML(x)}</p>`).join('')}<details class="evidence-drawer"><summary>${mapText('placeSources')}</summary>${sourceLinks(n.sources)}</details><h4>${mapText('relations')}</h4>${relations||`<p class="small-note">${mapText('noRelations')}</p>`}<p class="small-note">${mapText('noQuantity')}</p>`;
  if(n.related_record_ids?.length)$('mine-detail').insertAdjacentHTML('beforeend',`<div class="map-place-stages">${n.related_record_ids.map(id=>`<button type="button" data-related-place="${escapeHTML(id)}">${escapeHTML(lookup.get(id)?.name||id)}</button>`).join('')}</div>`);
  const equipmentHTML=equipmentContextHTML(n);if(equipmentHTML)$('mine-detail').querySelector('.map-state').insertAdjacentHTML('afterend',equipmentHTML);
  const volumeHTML=window.renderVolumeEvidenceForPlace?.(n,mapLanguage);if(volumeHTML)$('mine-detail').querySelector('.map-state').insertAdjacentHTML('afterend',volumeHTML);
  $('mine-detail').onclick=e=>{const b=e.target.closest('[data-related-place]');if(b&&b.dataset.relatedPlace)showMine(b.dataset.relatedPlace);const s=e.target.closest('[data-place-stage]');if(s){mapStage=s.dataset.placeStage;$('map-stage').value=mapStage;renderMap();}};
  document.querySelectorAll('[data-mine]').forEach(b=>b.classList.toggle('active',b.dataset.mine===id));
  d3.selectAll('.map-node').classed('selected',d=>d.id===id);
  d3.selectAll('.map-node').filter(d=>d.id===id).raise();
  d3.selectAll('.map-route').classed('selected',d=>d.source===id||d.target===id);
  updateMapGeometry();
  renderAnchorChoices(n);
  renderPathSummary();
}
function renderAnchorChoices(n) {
  const shared=Number.isFinite(n.lat)?mapVisibleNodes.filter(x=>Math.abs(x.lat-n.lat)<.005&&Math.abs(x.lon-n.lon)<.005):[],box=$('map-anchor-choices');
  box.hidden=shared.length<2;
  if(shared.length<2){box.innerHTML='';return;}
  box.innerHTML=`<p>${mapLanguage==='zh'?'同一近似位置的不同工序 — 选择查看，不代表批次流向':'Separate stages at the same approximate anchor — choose an entry; co-location is not a batch-flow claim'}</p><div>${shared.map(x=>`<button type="button" data-anchor-place="${escapeHTML(x.id)}" class="${x.id===selectedMine?'active':''}">${mapStageIcon(displayedStage(x))}${escapeHTML(x.name)}</button>`).join('')}</div>`;
  box.onclick=e=>{const b=e.target.closest('[data-anchor-place]');if(b)showMine(b.dataset.anchorPlace);};
}
function renderPathSummary() {
  const path=(mapData.map_paths||[]).find(p=>p.id===mapPathId),lookup=new Map(allMapNodes().map(n=>[n.id,n]));
  if(!path){const related=(mapData.map_paths||[]).filter(p=>p.steps.includes(selectedMine)&&materialMatch(p.materials,mapSelectedIngredient()));$('map-path-summary').innerHTML=`<div><p class="eyebrow">${mapText('pathTitle')}</p><p>${mapText('pathPrompt')}</p></div>${related.length?`<div class="map-path-suggestions">${related.map(p=>`<button type="button" data-map-path="${escapeHTML(p.id)}">${escapeHTML(p.title)}</button>`).join('')}</div>`:''}`;}
  else {
    const ids=new Set(mapVisibleNodes.map(n=>n.id));
    const steps=path.steps.map(s=>{if(typeof s!=='string')return `<li class="path-gap"><span>${s.unlocated_id?mapText('notMapped'):mapText('gap')}</span>${s.unlocated_id?`<button type="button" data-summary-place="${escapeHTML(s.unlocated_id)}">${escapeHTML(s.label)}</button>`:`<strong>${escapeHTML(s.label)}</strong>`}<p>${escapeHTML(s.note||'')}</p></li>`;const n=lookup.get(s);return n?`<li class="${ids.has(s)?'':'path-hidden'}">${mapStageIcon(nodeStage(n))}<button type="button" data-summary-place="${escapeHTML(s)}">${escapeHTML(n.name)}</button><p>${escapeHTML(n.material_form||n.product||'')}</p>${ids.has(s)?'':`<small>${mapText('hidden')}</small>`}</li>`:`<li class="path-gap"><span>${mapText('notMapped')}</span><strong>${escapeHTML(s)}</strong></li>`;}).join('');
    $('map-path-summary').innerHTML=`<div><p class="eyebrow">${mapText('pathTitle')}</p><h3>${escapeHTML(path.title)}</h3><p>${escapeHTML(path.note||'')}</p><p class="small-note">${escapeHTML(path.us_connection||'')} · ${mapText('noQuantity')}</p></div><ol class="map-path-sequence">${steps}</ol>`;
  }
  $('map-path-summary').onclick=e=>{const b=e.target.closest('[data-map-path]');if(b){mapPathId=b.dataset.mapPath;$('map-path').value=mapPathId;renderMap();fitMapResults();return;}const p=e.target.closest('[data-summary-place]');if(p)showMine(p.dataset.summaryPlace);};
  const experiment=$('map-open-experiment');if(experiment){const params=new URLSearchParams();if(mapPathId!=='all')params.set('path',mapPathId);if(selectedMine)params.set('place',selectedMine);if(mapStage!=='all')params.set('stage',mapStage);if(mapSelectedIngredient()!=='all')params.set('ingredient',mapSelectedIngredient());experiment.href=`chain.html${params.size?'?'+params:''}#chain-evidence`;}
}
function symbolPath(n) {
  const shape=mapStages[displayedStage(n)].shape,type={circle:d3.symbolCircle,square:d3.symbolSquare,diamond:d3.symbolDiamond,triangle:d3.symbolTriangle,cross:d3.symbolCross}[shape];
  return d3.symbol().type(type).size(120)();
}
const reserveData=()=>datasets.reserves;
const reserveCountryKey=x=>x===null||x===undefined?'other':Number.isFinite(Number(x))?String(Number(x)):String(x);
const reserveRow=id=>(reserveData()?.countries||[]).find(r=>reserveCountryKey(r.iso_numeric??r.id)===reserveCountryKey(id));
const reserveFeatureKey=f=>Number.isFinite(Number(f.id))&&Number(f.id)>0?reserveCountryKey(f.id):f.properties?.name?`geography:${f.properties.name}`:null;
const reserveFeatureRow=f=>reserveFeatureKey(f)?reserveRow(reserveFeatureKey(f)):undefined;
const hasReserveValue=r=>r&&Number.isFinite(r.reserve_tonnes_reo)&&r.reserve_tonnes_reo>=0;
const reserveSubtotal=()=>reserveData()?.listed_subtotal?.value_tonnes_reo;
const reservePercent=r=>hasReserveValue(r)&&reserveSubtotal()>0?r.reserve_tonnes_reo/reserveSubtotal()*100:null;
const reserveNumber=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:3});
const reserveShareNumber=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const reserveStockLabel=r=>r?.reported_display||(hasReserveValue(r)?`${r.qualifier==='>'?'> ':''}${fmt(r.reserve_tonnes_reo)} tonnes REO`:'Not available');
function layerSourceLinks(data,ids) {
  const sourceList=Array.isArray(data?.sources)?data.sources:Object.values(data?.sources||{});
  return [...new Set(ids||[])].map(id=>{const s=sourceList.find(x=>x.id===id);return s?link(s.url,`${s.title}${s.publication_date||s.date?` · ${s.publication_date||s.date}`:''}`):'';}).filter(Boolean).join(' ');
}
function updateMapIdentity() {
  // Mode identity is deliberately independent of country, sector and plant filters.
  const identity={
    facilities:{title:'From ore to magnet',primary:'From ore <em>to magnet.</em>',eyebrow:'The materials field guide',intro:'Choose an ingredient. Follow its physical forms, find its origins, and see what it contributes to a machine that moves.',atlas:'Follow the material<br><em>between places.</em>',atlasEyebrow:'01 / Upstream supply places & relationships',atlasIntro:'Explore extraction, separation, metal and master-alloy conversion, magnet making and U.S. connections. Select a place or an evidence path to see the product and the gaps. This is a documented sample, not a global facility census.'},
    applications:{title:'Applications & Demand',primary:'Applications <em>& Demand.</em>',eyebrow:'Downstream applications & use cases',intro:'Explore documented factories, product uses and customer relationships. The materials lesson, magnet grades and formulation tools are also available on this page.',atlas:'Applications <em>& Demand.</em>',atlasEyebrow:'01 / Application factories, products & use cases',atlasIntro:'Choose an application site to distinguish its country and factory role, company contracts, documented product uses and missing supplier or customer links. Compare industry activity with Question A; a pin alone does not establish magnet demand.'},
    reserves:{title:'Total Rare-Earth Reserves',primary:'Total rare-earth <em>reserves.</em>',eyebrow:'Country reserve stocks · total rare earths',intro:'Inspect reported country reserve stocks and their stated basis. The materials lesson, magnet grades and formulation tools are also available on this page.',atlas:'Country reserve<br><em>stocks.</em>',atlasEyebrow:'01 / Geological stock · total rare earths',atlasIntro:'Compare the share of numeric reported country reserves and inspect the source basis. These stocks do not measure annual output or separately establish NdPr, Dy or Tb availability.'}
  }[mapLayer];
  document.body.dataset.mapLayer=mapLayer;
  document.title=`${identity.title} — Rare Earth`;
  const targets=[['.material-intro h1',identity.primary,true],['.material-intro .eyebrow',identity.eyebrow],['.material-intro > p',identity.intro],['#origins .material-heading h2',identity.atlas,true],['#origins .material-heading .eyebrow',identity.atlasEyebrow],['#origins .material-heading > p',identity.atlasIntro]];
  for(const [selector,copy,html] of targets){const el=document.querySelector(selector);if(el){if(html)el.innerHTML=copy;else el.textContent=copy;}}
}
function publishMapNavigationMode() {
  document.dispatchEvent(new CustomEvent('rareearth:navigation-mode',{detail:{mode:mapLayer}}));
}
function updateMapLayerUI() {
  const facility=mapLayer==='facilities',reserves=mapLayer==='reserves';
  updateMapIdentity();
  $('map-layer').value=mapLayer;
  $('map-facility-filters').hidden=!facility;$('map-reserve-controls').hidden=!reserves;$('map-application-controls').hidden=mapLayer!=='applications';
  $('map-stage-key').hidden=!facility;$('map-evidence-key').hidden=!facility;$('map-reserve-key').hidden=!reserves;
  $('map-application-key').hidden=mapLayer!=='applications';
  $('map-path-summary').hidden=!facility;$('map-anchor-choices').hidden=true;
  for(const id of ['map-all','map-selected','map-us'])$(id).disabled=!facility;
  $('mine-picker').setAttribute('aria-label',reserves?'Choose a country reserve record':mapLayer==='applications'?'Choose a documented application plant':'Choose a supply location');
  const notes={facilities:'Select a place to inspect its product and documented relationships. Locations do not establish end-to-end shipments.',reserves:'Country totals describe a geological stock, not annual output or individual NdPr, Dy or Tb availability. Percentages show the share of reported country reserves total, using only numeric listed entries.',applications:'Application plants are downstream context. Their locations do not establish magnet sourcing, formulation, consumed tonnes or qualified capacity.'};
  $('map-layer-note').textContent=notes[mapLayer];
  let demandLink=$('map-demand-link');
  if(!demandLink){demandLink=document.createElement('a');demandLink.id='map-demand-link';demandLink.dataset.mapText='demand';demandLink.href='future.html?question=demand#future-questions';document.querySelector('.map-linked-navigation')?.append(demandLink);}
  demandLink.textContent=mapText('demand');demandLink.hidden=mapLayer!=='applications';
  let flowsLink=$('map-flows-link');
  if(!flowsLink){flowsLink=document.createElement('a');flowsLink.id='map-flows-link';flowsLink.href='flows.html';document.querySelector('.map-linked-navigation')?.append(flowsLink);}
  flowsLink.textContent='Supply Chain Flows / Material Balance ↗';flowsLink.hidden=mapLayer!=='applications';
  if($('map-open-experiment'))$('map-open-experiment').innerHTML='Explore the supply-chain laboratory <span aria-hidden="true">↗</span>';
  if(!facility&&$('map-open-experiment'))$('map-open-experiment').href='chain.html';
  $('origins-map').setAttribute('aria-label',reserves?'Interactive world map of total rare-earth reserves by country; unknown values are not zero':mapLayer==='applications'?'Interactive world map of selected documented application manufacturing plants':'Interactive world map of material origins, processing, conversion and U.S. connections');
  d3.selectAll('.map-country').classed('reserve-known',false).classed('reserve-selected',false).style('fill',null).on('click.reserve',null);
  d3.selectAll('.map-country title').remove();
  updateLinkedMapNavigation();
}
function updateLinkedMapNavigation() {
  const applicationParams=new URLSearchParams({layer:'applications'});
  if(applicationCountry!=='all')applicationParams.set('application_country',applicationCountry);
  if(applicationSector!=='all')applicationParams.set('sector',applicationSector);
  if(selectedApplication)applicationParams.set('plant',selectedApplication);
  $('map-application-link').href=`grades.html?${applicationParams}#origins`;
  // A downstream selection has no automatically established upstream route.
  $('map-supply-link').href='grades.html?layer=facilities#origins';
  $('map-supply-link').setAttribute('aria-current',mapLayer==='facilities'?'page':'false');
  $('map-application-link').setAttribute('aria-current',mapLayer==='applications'?'page':'false');
}
function showReserve(id) {
  selectedReserve=reserveCountryKey(id);const r=reserveRow(id),feature=mapCountryFeatures.find(f=>reserveFeatureKey(f)===selectedReserve),data=reserveData();
  const name=r?.name||feature?.properties?.name||'Country not mapped',share=reservePercent(r),world=data?.world_total;
  // A lower bound on the denominator only gives an upper bound for a numeric numerator.
  const upper=hasReserveValue(r)&&(r.qualifier||'=')==='='&&world?.qualifier==='>'&&world.value_tonnes_reo>0?Math.ceil(r.reserve_tonnes_reo/world.value_tonnes_reo*100*1000)/1000:null;
  const unknown=r?'The source reports this reserve value as unavailable. It is not zero.':'This country is not individually listed in the reviewed reserve table. Its reserve value is unknown here, not zero.';
  const sourceIds=r?.source_ids?.length?r.source_ids:data?.source_id?[data.source_id]:[];
  $('mine-detail').innerHTML=`<p class="micro-label">COUNTRY / TERRITORY RESERVE STOCK · TOTAL REE</p><h3>${escapeHTML(name)}</h3><div class="reserve-selected-value"><strong>${share===null?'Unknown':`${reserveShareNumber(share)}%`}</strong><span>${share===null?'No numeric reserve estimate in this layer':'Share of reported country reserves total · numeric entries only'}</span></div><p class="reserve-stock">${escapeHTML(reserveStockLabel(r))}</p><p>${hasReserveValue(r)?'Tonnes of rare-earth-oxide equivalent (REO). This is a reserve stock, not mined production or oxide already available for purchase.':unknown}</p>${upper!==null?`<p class="connection-note"><strong>Global share &lt; ${reserveNumber(upper)}%</strong><br>Bound calculated from the rounded country figure and the reported world total &gt; ${fmt(world.value_tonnes_reo)} tonnes REO. The bound is rounded upward; extra digits do not imply geological precision.</p>`:''}<h4>What is the percentage divided by?</h4><p>${fmt(reserveSubtotal())} tonnes REO: the sum of numeric listed-country entries. Unavailable entries and an unquantified “other countries” remainder are excluded. This is not an exact share of all global reserves.</p><h4>What this does not tell us</h4><p class="small-note">The table does not split reserves into Nd, Pr, Dy or Tb. A country reserve cannot be assigned to a particular purchased alloy, mine, processing plant or U.S. shipment. Reserves do not establish recoverability at a specific plant or annual delivery capacity.</p>${(r?.notes||[]).map(n=>`<p class="small-note">${escapeHTML(n)}</p>`).join('')}<p class="small-note">${escapeHTML(data?.reserve_basis||'Total rare-earth reserves, expressed as REO equivalent.')}</p><details class="evidence-drawer" open><summary>Primary reserve source & revision</summary>${layerSourceLinks(data,sourceIds)}<p class="small-note">${escapeHTML([data?.publication_date&&`Publication: ${data.publication_date}`,data?.revision_date&&`Revision: ${data.revision_date}`,data?.accessed_date&&`Accessed: ${data.accessed_date}`].filter(Boolean).join(' · '))}</p></details>`;
  $('mine-detail').onclick=null;$('map-reserve-country').value=selectedReserve;
  document.querySelectorAll('[data-reserve-country]').forEach(b=>{const selected=b.dataset.reserveCountry===selectedReserve;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  d3.selectAll('.map-reserve-node').classed('selected',d=>reserveCountryKey(d.iso_numeric)===selectedReserve).attr('aria-pressed',d=>String(reserveCountryKey(d.iso_numeric)===selectedReserve));
  d3.selectAll('.map-country').classed('reserve-selected',d=>reserveFeatureKey(d)===selectedReserve);
  updateMapGeometry();
}
function renderReserveMap() {
  const data=reserveData(),layer=d3.select('#map-world-layer');layer.selectAll('.map-dynamic').remove();mapVisibleRoutes=[];mapVisibleNodes=[];
  if(!data){$('mine-detail').innerHTML='<h3>Reserve evidence unavailable</h3><p>The verified country table could not load. Unknown values have not been replaced with zeros. Reload to retry.</p>';$('mine-picker').innerHTML='';$('map-status').textContent='Reserve evidence could not load.';return;}
  const numeric=(data.countries||[]).filter(hasReserveValue),max=d3.max(numeric,r=>r.reserve_tonnes_reo)||1;
  const countries=mapCountryFeatures.filter(f=>reserveFeatureKey(f)).map(f=>({id:reserveFeatureKey(f),name:reserveFeatureRow(f)?.name||f.properties?.name||String(f.id)})).sort((a,b)=>a.name.localeCompare(b.name));
  for(const r of data.countries||[])if(!countries.some(c=>c.id===reserveCountryKey(r.iso_numeric??r.id)))countries.push({id:reserveCountryKey(r.iso_numeric??r.id),name:`${r.name} · no country pin`});
  $('map-reserve-country').innerHTML=countries.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)}${hasReserveValue(reserveRow(c.id))?'':' · unknown'}</option>`).join('');
  const color=d3.scaleSqrt().domain([0,max]).range(['#284536','#c5a46b']);
  layer.selectAll('.map-country').classed('reserve-known',f=>hasReserveValue(reserveFeatureRow(f))).style('fill',f=>hasReserveValue(reserveFeatureRow(f))?reserveDisplay==='shading'?color(reserveFeatureRow(f).reserve_tonnes_reo):null:'#29322e').on('click.reserve',(e,f)=>{e.stopPropagation();const key=reserveFeatureKey(f);if(key)showReserve(key);});
  layer.selectAll('.map-country title').remove();layer.selectAll('.map-country').append('title').text(f=>{const r=reserveFeatureRow(f);return `${r?.name||f.properties?.name||'Unidentified geography'}: ${hasReserveValue(r)?`${reserveShareNumber(reservePercent(r))}% of numeric listed subtotal; ${reserveStockLabel(r)}`:'Reserve unknown here, not zero'}`;});
  mapVisibleNodes=numeric.map(r=>{const f=mapCountryFeatures.find(f=>reserveFeatureKey(f)===reserveCountryKey(r.iso_numeric));if(!f)return null;const [lon,lat]=d3.geoCentroid(f);return {...r,id:reserveCountryKey(r.iso_numeric),lon,lat};}).filter(Boolean);
  const dynamic=layer.append('g').attr('class','map-dynamic');
  if(reserveDisplay==='bubbles') {
    const radius=d3.scaleSqrt().domain([0,max]).range([0,28]);
    const groups=dynamic.selectAll('.map-reserve-node').data(mapVisibleNodes).join('g').attr('class','map-reserve-node').attr('transform',r=>`translate(${projection([r.lon,r.lat])})`).attr('tabindex',0).attr('role','button').attr('aria-label',r=>`${r.name}, ${reserveShareNumber(reservePercent(r))} percent of numeric listed reserve subtotal, ${reserveStockLabel(r)}`).on('click',(e,r)=>{e.stopPropagation();showReserve(r.iso_numeric);}).on('keydown',(e,r)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();showReserve(r.iso_numeric);}});
    groups.append('circle').attr('class','reserve-hit').attr('r',r=>Math.max(19,radius(r.reserve_tonnes_reo)+4));
    groups.append('circle').attr('class','reserve-bubble').attr('r',r=>radius(r.reserve_tonnes_reo));
    groups.append('title').text(r=>`${r.name} · ${reserveShareNumber(reservePercent(r))}% of numeric listed subtotal · ${reserveStockLabel(r)}. Country centroid, not a mine.`);
    groups.append('text').attr('class','reserve-map-label');
  }
  const subtotal=data.listed_subtotal,world=data.world_total;
  $('map-reserve-basis').textContent=`${data.unit||'Tonnes REO equivalent'} · Total rare-earth reserves. Not separate NdPr, Dy or Tb stocks. Country-centroid bubbles are display anchors, not mines.`;
  $('map-reserve-key').innerHTML=`<div class="reserve-legend-symbols"><span><i class="reserve-known-swatch"></i>${reserveDisplay==='bubbles'?'Bubble area':'Country shading'} = reported reserve stock</span><span><i class="reserve-unknown-swatch"></i>Unlisted / unavailable ≠ zero</span></div><p><strong>Share of reported country reserves total: numeric listed subtotal = ${fmt(subtotal?.value_tonnes_reo)} tonnes REO.</strong> The world is reported as ${escapeHTML(world?.qualifier||'')}${fmt(world?.value_tonnes_reo)} tonnes REO. ${escapeHTML(subtotal?.note||'Unavailable and unquantified entries are excluded; not an exact world denominator.')}</p><p class="small-note">${escapeHTML((data.caveats||[]).join(' '))}</p>${layerSourceLinks(data,data.source_id?[data.source_id]:[])}<p class="small-note">Revision: ${escapeHTML(data.revision_date||'See primary source')} · Country figures are rounded estimates; percentages are arithmetic context.</p>`;
  $('map-disclaimer').textContent='Reserves are geological stocks. They are not annual production, element-specific inventories, purchased alloy quantities or routes to the United States. No lines are inferred from country totals.';
  $('mine-picker').innerHTML=(data.countries||[]).map(r=>`<button type="button" data-reserve-country="${reserveCountryKey(r.iso_numeric)}" aria-pressed="false"><strong>${escapeHTML(r.name)}</strong><span>${hasReserveValue(r)?`${reserveShareNumber(reservePercent(r))}% of listed numeric subtotal`:'Unknown · not zero'}</span><small>${escapeHTML(reserveStockLabel(r))}</small></button>`).join('');
  $('mine-picker').onclick=e=>{const b=e.target.closest('[data-reserve-country]');if(b)showReserve(b.dataset.reserveCountry);};
  if(!countries.some(c=>c.id===selectedReserve))selectedReserve=countries[0]?.id;
  if(selectedReserve)showReserve(selectedReserve);else updateMapGeometry();
}
const applicationData=()=>datasets.applications;
const applicationPlantSectors=p=>p.sector_ids||p.sectors||[];
const applicationSectorName=s=>mapLanguage==='zh'&&s.label_zh?s.label_zh:s.label_en||s.label||s.name||s.title||s.id;
const applicationPlantName=p=>mapLanguage==='zh'&&p.label_zh?p.label_zh:p.name||p.label_en||p.id;
const applicationPlaceRecords=()=>(applicationData()?.plants||[]).filter(p=>p.plant_type!=='headquarters'&&p.site_kind!=='headquarters').map(p=>({...p,name:p.name||p.label_en||p.id,lat:p.lat??p.coordinates?.lat,lon:p.lon??p.coordinates?.lon}));
const applicationPlants=()=>applicationPlaceRecords().filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
const applicationFilteredRecords=()=>applicationPlaceRecords().filter(p=>(applicationSector==='all'||applicationPlantSectors(p).includes(applicationSector))&&(applicationCountry==='all'||p.country===applicationCountry));
function applicationSiteRole(p) {
  const roles={industrial_motor:'Industrial motor factory',robot_assembly:'Robot factory',robot_end_use:'Robot application site · logistics',ev_assembly:'Vehicle assembly factory',mixed_vehicle_assembly:'Vehicle assembly factory',nev_assembly:'Vehicle assembly factory',ev_and_drive_unit:'Vehicle & drive-unit factory',motor_drive_unit:'Motor & drive-unit factory',ev_motor:'Electric motor factory',motor_component:'Motor / actuator component factory',appliance_assembly:'Household appliance factory',compressor_motor:'Compressor / motor factory',wind_application:'Wind energy application project',wind_nacelle_assembly:'Wind nacelle assembly factory',wind_turbine_assembly:'Wind turbine assembly factory'};
  return roles[p.plant_type||p.stage]||(p.plant_type||p.stage||'Application site').replaceAll('_',' ').replaceAll('/',' / ');
}
function applicationRelationsForPlant(p,data) {
  const companyId=p.manufacturer_id||p.company_id,ids=new Set(p.relationship_ids||[]);
  return (data.routes||[]).filter(r=>(r.source_ids||r.sources||[]).length&&(r.from_site_id===p.id||r.to_site_id===p.id||ids.has(r.id)||companyId&&[r.from_company_id,r.to_company_id].includes(companyId))).sort((a,b)=>{
    const rank=r=>(r.from_site_id===p.id||r.to_site_id===p.id?4:0)+(ids.has(r.id)?2:0)+((r.sector_ids||[]).some(id=>applicationPlantSectors(p).includes(id))?1:0);
    return rank(b)-rank(a);
  });
}
function applicationRelationKind(r) {
  const kinds={internal_material_supply:'Operator-reported internal material supply',component_factory_to_application_project:'Documented product delivery',commercial_robot_service_and_deployment:'Product application · robot service & deployment',actual_company_customer_sales:'Documented finished-product sales',documented_customer_product_case:'Product / customer case context',product_adoption_end_user:'Historical product-use context',wind_customer_or_end_user_historical:'Historical wind-product context',component_customer_unnamed:'Reported component delivery · customer unnamed'};
  if(kinds[r.relationship_type])return kinds[r.relationship_type];
  const status=r.evidence_status||r.evidence_class||'';
  if(/contract|offtake|order/.test(status))return 'Company supply contract';
  if(/historical/.test(status))return 'Historical supplier relationship';
  if(/delivery|shipment/.test(status))return 'Reported product delivery';
  return 'Reported company relationship';
}
function applicationRelationshipHTML(r,p,data) {
  const siteLookup=new Map((data.plants||[]).map(site=>[site.id,site]));
  const receiver=siteLookup.get(r.to_site_id),sourceSite=siteLookup.get(r.from_site_id);
  const selectedIsEndpoint=r.from_site_id===p.id||r.to_site_id===p.id;
  const unrelatedSector=(r.sector_ids||[]).length&&!r.sector_ids.some(id=>applicationPlantSectors(p).includes(id));
  const status=r.status||r.evidence_status?.replaceAll('_',' ')||'See primary evidence';
  const endpointLabel=r.relationship_type==='internal_material_supply'?'Named material endpoint':'Named product / application endpoint';
  const scope=!r.to_site_id?`Receiving plant unknown${r.to_company_id===(p.manufacturer_id||p.company_id)?` · ${applicationPlantName(p)} is not a named receiver.`:'.'}`:receiver?`${endpointLabel}: ${applicationPlantName(receiver)} · ${receiver.country}`:'Receiving site is named in the source; see relationship evidence.';
  const scopeNote=unrelatedSector&&!selectedIsEndpoint?'Company context · different business scope; this relationship does not establish supply to this factory.':!selectedIsEndpoint?'Company-level relationship · no supply or product allocation to this selected factory is established.':'';
  const sources=layerSourceLinks(data,r.source_ids||r.sources||[]);
  return `<details class="application-relationship" data-application-relation="${escapeHTML(r.id)}"><summary><span class="application-relationship-kind">${escapeHTML(applicationRelationKind(r))}</span><strong>${escapeHTML(r.from||'Supplier / manufacturer')} → ${escapeHTML(r.to||'Undisclosed customer')}</strong><span class="application-relationship-status">${escapeHTML(status)}</span><span class="application-relationship-scope">${escapeHTML(scope)}</span>${scopeNote?`<span class="application-relationship-gap">${escapeHTML(scopeNote)}</span>`:''}</summary><div class="application-relationship-body"><p><strong>Product:</strong> ${escapeHTML(r.material_or_product||r.product||'See source')}</p>${sourceSite?`<p><strong>Reported source site:</strong> ${escapeHTML(applicationPlantName(sourceSite))} · ${escapeHTML(sourceSite.country||'')}</p>`:''}<p>${escapeHTML(r.summary||'')}</p>${(r.gaps||r.evidence_gaps||[]).map(g=>`<p class="small-note">${escapeHTML(g)}</p>`).join('')}<div class="application-relationship-sources">${sources}</div></div></details>`;
}
function applicationConnectionsHTML(p) {
  const data=applicationData(),relations=applicationRelationsForPlant(p,data);
  const incomingMaterial=relations.filter(r=>r.to_site_id===p.id&&['internal_material_supply','supplier_customer'].includes(r.relationship_type)&&/magnet|SmCo|NdFeB/i.test(r.material_or_product||r.product||''));
  const outgoing=relations.filter(r=>r.from_site_id===p.id),namedNext=outgoing.filter(r=>r.to_site_id),unnamedNext=outgoing.filter(r=>!r.to_site_id);
  const nextNamed=namedNext.map(r=>applicationPlantName((data.plants||[]).find(site=>site.id===r.to_site_id)||{name:r.to}));
  const direct=incomingMaterial.length?`Operator-reported material input: ${incomingMaterial.map(r=>r.from).join('; ')}. Grade, accepted batches and quantities remain separate evidence gaps.`:'Unknown for this site. A company contract or nearby factory does not identify its direct magnet supplier.';
  const next=nextNamed.length?`Source-backed product/application endpoint: ${[...new Set(nextNamed)].join('; ')}. See the typed relationship above.`:unnamedNext.length?'Company customer or delivery evidence exists; the receiving plant / next site remains unknown.':'Unknown for this site. Use-case and market context below do not name a next customer or receiving plant.';
  const context=(p.destinations||[]).map(d=>{
    const sources=d.source_ids||[],type=d.type||'application_context';
    const label=type==='actual_customer_sales'&&sources.length?'Finished-product customer evidence':type==='commercial_deployment'&&sources.length?'Product application evidence':type==='qualification_program'?'Planned / qualification product context':'Application / market context';
    return `<details class="application-use-context"><summary><span>${label}</span><strong>${escapeHTML(d.recipient||'See source context')}</strong><span>${escapeHTML(d.status||'Application classification · not a site delivery record')}</span></summary><p>${escapeHTML(d.geography||'Geographic allocation unknown')}</p>${sources.length?layerSourceLinks(data,sources):'<p class="small-note">Use-case classification only; no source-backed factory-to-customer delivery is established.</p>'}</details>`;
  }).join('');
  return `<section class="application-connections" aria-labelledby="application-connections-title" data-selected-application="${escapeHTML(p.id)}"><h4 id="application-connections-title">Relationships & next use</h4>${relations.length?relations.map(r=>applicationRelationshipHTML(r,p,data)).join(''):'<p class="application-relationship-empty">No source-backed supplier / customer relationship is recorded for this site.</p>'}<dl class="application-path-gaps"><div><dt>Direct magnet sourcing</dt><dd>${escapeHTML(direct)}</dd></div><div><dt>Next customer / receiving site</dt><dd>${escapeHTML(next)}</dd></div></dl>${context}<div class="application-role-flow"><p>Generic roles · explanatory only</p><ol aria-label="Explanatory application roles, not a route for this site"><li>Magnets</li><li>Motor / actuator</li><li>OEM / integrator</li><li>Household / industrial / infrastructure</li></ol><p>These roles do not assign a supplier, magnet chemistry, shipment route or market share to this site.</p></div><a class="application-demand-link" href="future.html?question=demand#future-questions">Demand / Industry size · Question A ↗</a></section>`;
}
function applicationQuantityStripHTML(p) {
  const data=applicationData(),metrics=Array.isArray(p.annual_metrics)?p.annual_metrics:[];
  const sourceList=Array.isArray(data?.sources)?data.sources:Object.values(data?.sources||{});
  const documented=metrics.filter(m=>Number.isFinite(m.value)&&m.unit&&m.product&&(m.period??m.year)!==undefined&&(m.period??m.year)!==null&&m.basis&&(m.source_ids||[]).some(id=>sourceList.some(s=>s.id===id&&s.url)));
  const cards=documented.map(m=>{
    const qualifier=['>','<','≥','≤','~'].includes(m.qualifier)?m.qualifier:'';
    const sources=[...new Set(m.source_ids||[])].map(id=>sourceList.find(s=>s.id===id&&s.url)).filter(Boolean);
    return `<article class="application-quantity-card"><span class="application-quantity-type">${escapeHTML(m.metric_type?.replaceAll('_',' ')||m.label||'Reported activity')} · ${escapeHTML(m.status||'reported')}</span><strong>${escapeHTML(qualifier)}${fmt(m.value)} ${escapeHTML(m.unit.replaceAll('_',' '))}</strong><span>${escapeHTML(m.period??m.year)} · ${escapeHTML(m.product)}</span><span><b>Scope:</b> ${escapeHTML(m.scope||m.geographic_scope||m.entity_scope||'See primary source')}</span><details><summary>Basis & source</summary><p>${escapeHTML(m.basis)}</p>${(m.notes||[]).map(n=>`<p>${escapeHTML(n)}</p>`).join('')}${sources.map(s=>link(s.url,`${s.title}${s.publication_date||s.date?` · ${s.publication_date||s.date}`:''}`)).join(' ')}</details></article>`;
  }).join('');
  const unknown=metrics.filter(m=>!Number.isFinite(m.value)).map(m=>m.metric_type?.replaceAll('_',' ')||m.label||'Site activity');
  const magnet=p.magnet_mass_evidence;
  const magnetSummary=Number.isFinite(magnet?.value)?'See separately sourced plant-specific magnet evidence below.':`Annual magnet consumption: Unknown for this site. ${magnet?.summary||'No verified magnet mass or bill of materials.'}`;
  return `<section class="application-quantity-strip" aria-label="Selected site reported quantities"><h4>Reported quantity · keep its basis</h4>${cards?`<div class="application-quantity-cards">${cards}</div>`:'<p class="application-quantity-unknown">No sourced quantity with a product, period and scope is established in this record.</p>'}${unknown.length?`<p class="application-quantity-unknown">Unknown: ${escapeHTML([...new Set(unknown)].join('; '))}.</p>`:''}<p class="application-magnet-volume-gap">${escapeHTML(magnetSummary)}</p></section>`;
}
function applicationEvidenceMetricHTML(m,data) {
  const sourceIds=m.source_ids||[],period=m.period??m.year,unit=m.unit||'';
  // A value without a product/time/basis/source record is not a usable public estimate.
  const documented=Number.isFinite(m.value)&&unit&&m.product&&period!==undefined&&period!==null&&m.basis&&sourceIds.length;
  const qualifier=['>','<','≥','≤','~'].includes(m.qualifier)?m.qualifier:'';
  return `<article class="application-evidence-metric"><p class="micro-label">${escapeHTML(m.label||m.metric_type?.replaceAll('_',' ')||'Reported metric')}</p><strong>${documented?`${escapeHTML(qualifier)}${fmt(m.value)} ${escapeHTML(unit)}`:'Unknown / not established'}</strong><p>${escapeHTML(m.product||'Product not specified')}${period!==undefined&&period!==null?` · ${escapeHTML(period)}`:''}</p><p class="small-note"><b>Scope:</b> ${escapeHTML(m.scope||m.geographic_scope||m.entity_scope||'See the stated basis; no allocation to this plant is inferred')}<br><b>Basis:</b> ${escapeHTML(m.basis||'Not established in this record')}<br><b>Status:</b> ${escapeHTML(m.status||'See primary source')}</p>${(m.notes||[]).map(n=>`<p class="small-note">${escapeHTML(n)}</p>`).join('')}${layerSourceLinks(data,sourceIds)}</article>`;
}
function applicationEvidenceHTML(p) {
  const data=applicationData(),metrics=Array.isArray(p.annual_metrics)?p.annual_metrics:[];
  const mass=p.magnet_mass_evidence,supplier=p.supplier_evidence,endpoints=Array.isArray(p.endpoint_evidence)?p.endpoint_evidence:[];
  return `<section class="application-activity-evidence" aria-label="Plant activity and material evidence">${metrics.length?`<h4>Reported activity · each product has its own basis</h4>${metrics.map(m=>applicationEvidenceMetricHTML(m,data)).join('')}<p class="small-note">Output, design capacity, demand and installed stock are different quantities. No vehicle, motor, turbine or component count is converted into magnet mass here.</p>`:''}<div class="application-material-unknowns"><p><strong>Plant-specific magnet consumption</strong><br>${mass?.summary?escapeHTML(mass.summary):'Not established in this record. Production or capacity of the finished application is not a measured magnet requirement.'}</p>${mass?applicationEvidenceMetricHTML({...mass,label:mass.label||'Magnet mass'},data):''}<p><strong>Plant-specific magnet supplier</strong><br>${escapeHTML(supplier?.summary||'Not established in this record. A company contract does not assign a supplier to every named factory.')}${supplier?.status?`<br><span class="small-note">Status: ${escapeHTML(supplier.status)}</span>`:''}</p>${layerSourceLinks(data,supplier?.source_ids||[])}</div>${endpoints.length?`<details><summary>Reported endpoint evidence</summary>${endpoints.map(e=>`<article class="application-endpoint-evidence"><p><strong>${escapeHTML(e.status||'See source status')}</strong></p><p>${escapeHTML(e.summary||'')}</p>${layerSourceLinks(data,e.source_ids||[])}</article>`).join('')}<p class="small-note">A reported endpoint is separate from a verified transport route, material assay, customer acceptance or annual magnet demand.</p></details>`:''}</section>`;
}
function applicationExperimentLink(p=null) {
  const sector=(applicationData()?.sectors||[]).find(s=>s.id===applicationSector),unsupported=Boolean(p?.model_compatibility&&p.model_compatibility!=='ndfeb_context'||sector?.model_compatibility&&sector.model_compatibility!=='ndfeb_context');
  const experiment=$('map-open-experiment');if(!experiment)return;
  if(unsupported){experiment.href='chain.html#chain-experiment';experiment.innerHTML='Explore a separate generic NdFeB experiment <span aria-hidden="true">↗</span>';return;}
  const contextParams=new URLSearchParams();if(p)contextParams.set('application_plant',p.id);if(sector)contextParams.set('sector',sector.id);
  experiment.href=`chain.html${contextParams.size?'?'+contextParams:''}#chain-experiment`;experiment.innerHTML='Explore the supply-chain laboratory <span aria-hidden="true">↗</span>';
}
function showApplication(id) {
  const data=applicationData(),p=applicationPlaceRecords().find(p=>p.id===id);if(!p)return;selectedApplication=id;
  const sectors=(data.sectors||[]).filter(s=>applicationPlantSectors(p).includes(s.id));
  const sourceIds=p.source_ids||p.sources||[];
  const companyId=p.manufacturer_id||p.company_id;
  const manufacturer=(data.manufacturers||[]).find(m=>m.id===companyId);
  const company=p.operator||manufacturer?.name||manufacturer?.label_en;
  const caveats=[...new Set([...(p.caveats||p.notes||[]),...(p.site_gaps||[])])];
  const boundarySectors=sectors.filter(s=>(applicationSector==='all'||s.id===applicationSector)&&s.model_compatibility&&s.model_compatibility!=='ndfeb_context');
  const sectorBoundaries=applicationSector==='all'&&boundarySectors.length?['Company/program tags include material scopes beyond the selected NdFeB specimens. They do not establish this plant’s magnet chemistry or assign a documented SmCo supply chain to it. A generic NdFeB experiment is a separate illustration.']:boundarySectors.map(s=>s.model_compatibility==='mixed_material_scope'?'This sector includes multiple magnet chemistries, including SmCo. That does not establish the chemistry used at this plant. The separate experiment only tracks selected NdFeB specimens; it does not model the sector’s full material scope.':s.model_boundary);
  const boundaries=[...new Set([p.model_boundary,...sectorBoundaries].filter(Boolean))];
  const params=new URLSearchParams({plant:p.id});
  const handoffSector=sectors.find(s=>s.id===applicationSector)||sectors[0];
  if(handoffSector)params.set('sector',handoffSector.id);
  $('mine-detail').innerHTML=`
    <p class="micro-label">${p.node_kind==='application_asset'?'APPLICATION SITE':'APPLICATION FACTORY'} · DOCUMENTED EXAMPLE</p>
    <h3>${escapeHTML(applicationPlantName(p))}</h3>
    <dl class="application-site-facts"><div><dt>Country</dt><dd>${escapeHTML(p.country||'Unknown')}</dd></div><div><dt>Site role</dt><dd>${escapeHTML(applicationSiteRole(p))}</dd></div><div><dt>Place</dt><dd>${escapeHTML(p.region||p.place||p.city_or_region||p.city||'Location not disclosed')}</dd></div></dl>
    <p class="map-state">${escapeHTML(p.status_label||p.status||'See cited site evidence')}</p>
    ${applicationQuantityStripHTML(p)}
    ${applicationConnectionsHTML(p)}
    ${boundaries.length?`<div class="application-model-boundary"><strong>Material-model boundary</strong>${boundaries.map(b=>`<p>${escapeHTML(b)}</p>`).join('')}</div>`:''}
    <details class="application-site-dossier"><summary>Reported site activity, location & sector context</summary>
      <h4>Reported site activity</h4><p>${escapeHTML(p.product||(p.products||[]).join('; ')||p.summary||p.plant_type||'Plant activity: see primary source.')}</p>
      ${p.architecture_context?`<p class="connection-note">${escapeHTML(p.architecture_context)}</p>`:''}
      ${company?`<h4>${p.operator?'Operator':'Manufacturer / company context'}</h4><p>${escapeHTML(company)}</p>`:''}
      <h4>Location precision</h4><p class="small-note"><strong>${escapeHTML(p.location_precision||p.geography?.precision||'Approximate display anchor')}</strong><br>${escapeHTML(p.location_note||p.location?.note||'Approximate plant display anchor; the source does not establish exact production-line coordinates.')}</p>
      ${sectors.length?`<h4>Company / program sector context</h4><div class="application-sector-tags">${sectors.map(s=>`<button type="button" data-application-context-sector="${escapeHTML(s.id)}">${escapeHTML(applicationSectorName(s))}</button>`).join('')}</div>${sectors.map(s=>`<p class="small-note">${escapeHTML(s.technology_boundary||s.description||s.summary||'')}</p>`).join('')}`:''}
      <p class="connection-note">A manufacturing location does not establish magnet consumption or a plant-to-plant supplier link. Sector tags describe company/program context; site product allocation, grade recipes and accepted suppliers are separate questions.</p>
      ${caveats.map(n=>`<p class="small-note">${escapeHTML(n)}</p>`).join('')}
    </details>
    <details class="application-site-dossier"><summary>Reported output & plant-specific magnet evidence</summary>${applicationEvidenceHTML(p)}</details>
    <details class="evidence-drawer"><summary>Primary plant evidence</summary>${layerSourceLinks(data,sourceIds)}${p.verified_at?`<p class="small-note">Evidence checked: ${escapeHTML(p.verified_at)}. Source publication dates are shown separately.</p>`:''}</details>
    <p><a href="applications.html?${escapeHTML(params.toString())}">Explore the application, alternatives & evidence gaps ↗</a></p>`;
  $('mine-detail').onclick=e=>{const b=e.target.closest('[data-application-context-sector]');if(b){applicationSector=b.dataset.applicationContextSector;renderMap();}};
  if(!Number.isFinite(p.lat)||!Number.isFinite(p.lon))$('mine-detail').insertAdjacentHTML('afterbegin','<p class="application-unlocated-note">Location not mapped · no single point has been invented.</p>');
  applicationExperimentLink(p);
  updateLinkedMapNavigation();
  document.querySelectorAll('[data-application-plant]').forEach(b=>{const selected=b.dataset.applicationPlant===id;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  d3.selectAll('.map-application-node').classed('selected',p=>p.id===id).attr('aria-pressed',p=>String(p.id===id));updateMapGeometry();
}
function renderApplicationMap() {
  const data=applicationData(),layer=d3.select('#map-world-layer');layer.selectAll('.map-dynamic').remove();mapVisibleRoutes=[];mapVisibleNodes=[];
  if(!data){$('mine-detail').innerHTML='<h3>Application evidence unavailable</h3><p>The documented application-plant file could not load. No plants, suppliers or consumed quantities have been invented. Reload to retry.</p>';$('mine-picker').innerHTML='';$('map-status').textContent='Application plant evidence could not load.';return;}
  const sectors=data.sectors||[];
  if(applicationSector!=='all'&&!sectors.some(s=>s.id===applicationSector))applicationSector='all';
  const countries=[...new Set(applicationPlaceRecords().map(p=>p.country).filter(Boolean))].sort((a,b)=>(b==='United States')-(a==='United States')||a.localeCompare(b));
  if(applicationCountry!=='all'&&!countries.includes(applicationCountry))applicationCountry='all';
  $('map-application-country').innerHTML=`<option value="all">${mapLanguage==='zh'?'全部国家':'All countries'}</option>`+countries.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(mapLanguage==='zh'?countryNames[c]||c:c)}</option>`).join('');$('map-application-country').value=applicationCountry;
  $('map-application-sector').innerHTML=`<option value="all">${mapLanguage==='zh'?'全部已记录行业':'All documented sectors'}</option>`+sectors.map(s=>`<option value="${escapeHTML(s.id)}">${escapeHTML(applicationSectorName(s))}</option>`).join('');$('map-application-sector').value=applicationSector;
  const records=applicationFilteredRecords();mapVisibleNodes=records.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
  if(!records.some(p=>p.id===selectedApplication))selectedApplication=records[0]?.id;
  const dynamic=layer.append('g').attr('class','map-dynamic');
  const groups=dynamic.selectAll('.map-application-node').data(mapVisibleNodes).join('g').attr('class','map-application-node').attr('transform',p=>`translate(${projection([p.lon,p.lat])})`).attr('tabindex',0).attr('role','button').attr('aria-label',p=>`${applicationPlantName(p)}, ${p.country}, ${p.location_precision||'approximate anchor'}, documented application context; consumed magnet quantity not established`).on('click',(e,p)=>{e.stopPropagation();showApplication(p.id);}).on('keydown',(e,p)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();showApplication(p.id);}});
  groups.append('circle').attr('class','map-hit').attr('r',19).attr('fill','transparent');
  groups.append('path').attr('class','map-marker').attr('d',d3.symbol().type(d3.symbolSquare).size(120)());
  groups.append('title').text(p=>`${applicationPlantName(p)} · ${p.product||p.plant_type||'application plant'} · ${p.status_label||p.status||'see source'}`);groups.append('text').attr('class','application-map-label');
  $('map-disclaimer').textContent='Uniform pins mark selected, source-backed application plants. They do not encode magnet tonnes, market shares, supplier contracts, grade requirements or operating capacity. Headquarters addresses alone are not treated as factories.';
  $('map-application-key').innerHTML=`<p><i class="application-pin-swatch" aria-hidden="true"></i><strong>Uniform pins = documented site examples.</strong> Approximate city/place references are not factory surveys. A headquarters campus is included only where the cited source identifies actual production.</p><p>${escapeHTML(data.scope||'Selected application context, not a global census.')} Sector filters use company/program tags, not proof of site-specific output. Named contracts remain in the inspector without shipment arcs.</p><p class="small-note">As of ${escapeHTML(data.as_of||'see source dates')}${data.preliminary?' · Selected preliminary atlas; additional sectors remain outside this sample.':''}</p>`;
  const selectedSector=sectors.find(s=>s.id===applicationSector);
  if(applicationCountry!=='all')$('map-application-key').insertAdjacentHTML('afterbegin',`<p><strong>${mapLanguage==='zh'?'地点范围':'Application geography'}: ${escapeHTML(mapLanguage==='zh'?countryNames[applicationCountry]||applicationCountry:applicationCountry)}</strong> · ${mapLanguage==='zh'?'按地点筛选，不代表产地认证或仅依赖美国供应。':'A location filter, not a domestic-content certification or U.S.-only supply claim.'}</p>`);
  if(selectedSector)$('map-application-key').insertAdjacentHTML('beforeend',`<div class="application-selected-sector"><strong>${escapeHTML(applicationSectorName(selectedSector))}</strong><p>${escapeHTML(selectedSector.technology_boundary||selectedSector.description||'')}</p>${selectedSector.model_boundary?`<p class="${selectedSector.model_compatibility!=='ndfeb_context'?'application-model-boundary':'small-note'}">${escapeHTML(selectedSector.model_boundary)}</p>`:''}<details><summary>Sector evidence</summary>${layerSourceLinks(data,selectedSector.source_ids||[])}</details></div>`);
  $('mine-picker').innerHTML=records.map(p=>`<button type="button" data-application-plant="${escapeHTML(p.id)}" aria-pressed="false"><strong>${escapeHTML(applicationPlantName(p))}</strong><span>${escapeHTML(p.country||'')}${!Number.isFinite(p.lat)||!Number.isFinite(p.lon)?' · Not mapped':''}</span><small>${escapeHTML(p.product||p.plant_type||'Application plant')}</small></button>`).join('');
  $('mine-picker').onclick=e=>{const b=e.target.closest('[data-application-plant]');if(b)showApplication(b.dataset.applicationPlant);};
  if(selectedApplication)showApplication(selectedApplication);else{$('mine-detail').innerHTML=`<h3>No documented site matches these filters</h3><p>Missing plant evidence is not zero consumption. ${escapeHTML(selectedSector?.technology_boundary||'Explore the application page for requirements and evidence gaps.')}</p>${selectedSector?.model_boundary?`<div class="application-model-boundary"><strong>Material-model boundary</strong><p>${escapeHTML(selectedSector.model_boundary)}</p></div>`:''}<p><a href="applications.html${selectedSector?'?sector='+encodeURIComponent(selectedSector.id):''}">Explore the sourced application context ↗</a></p>`;applicationExperimentLink();updateLinkedMapNavigation();updateMapGeometry();}
}
function updateMapGeometry() {
  if(!projection||!mapData)return;
  const t=mapTransform||d3.zoomIdentity,k=t.k,screenUnit=960/Math.max(240,$('origins-map').getBoundingClientRect().width);
  if(mapLayer!=='facilities') {
    if(mapLayer==='reserves'&&!reserveData()||mapLayer==='applications'&&!applicationData()){$('map-zoom-value').textContent=`${k.toFixed(1).replace('.0','')}×`;return;}
    d3.selectAll('.map-reserve-node .reserve-bubble,.map-reserve-node .reserve-hit,.map-application-node .map-marker,.map-application-node .map-hit').attr('transform',`scale(${screenUnit/k})`);
    const applicationLabels=new Map(),applicationBoxes=[];
    if(mapLayer==='applications')for(const n of [...mapVisibleNodes].sort((a,b)=>(b.id===selectedApplication)-(a.id===selectedApplication))){
      const p=t.apply(projection([n.lon,n.lat])),selected=n.id===selectedApplication;if(p[0]<0||p[0]>960||p[1]<0||p[1]>500||!selected&&k<2.7)continue;
      const full=applicationPlantName(n),limit=Math.max(16,Math.floor(Math.min(230,960/screenUnit*.66)/6.1)),label=full.length>limit?`${full.slice(0,limit-1)}…`:full,width=label.length*6.1*screenUnit,left=p[0]+width+11*screenUnit>950,box=left?[p[0]-11*screenUnit-width,p[1]-24*screenUnit,p[0]-11*screenUnit,p[1]-9*screenUnit]:[p[0]+11*screenUnit,p[1]-24*screenUnit,p[0]+11*screenUnit+width,p[1]-9*screenUnit];
      if(!selected&&applicationBoxes.some(b=>box[0]<b[2]+5*screenUnit&&box[2]>b[0]-5*screenUnit&&box[1]<b[3]+5*screenUnit&&box[3]>b[1]-5*screenUnit))continue;applicationBoxes.push(box);applicationLabels.set(n.id,{label,left});
    }
    d3.selectAll('.map-application-node text').attr('transform',`scale(${screenUnit/k})`).attr('x',p=>applicationLabels.get(p.id)?.left?-11:11).attr('text-anchor',p=>applicationLabels.get(p.id)?.left?'end':'start').attr('y',-11).text(p=>applicationLabels.get(p.id)?.label||'');
    const placed=[],reserveLabels=new Map();
    for(const n of [...mapVisibleNodes].sort((a,b)=>(b.id===selectedReserve)-(a.id===selectedReserve)||b.reserve_tonnes_reo-a.reserve_tonnes_reo)){
      if(mapLayer!=='reserves')break;const p=t.apply(projection([n.lon,n.lat])),label=`${n.name} · ${reserveShareNumber(reservePercent(n))}%`,width=label.length*6.1*screenUnit,left=p[0]+width+10*screenUnit>950,box=left?[p[0]-10*screenUnit-width,p[1]-40*screenUnit,p[0]-10*screenUnit,p[1]-25*screenUnit]:[p[0]+10*screenUnit,p[1]-40*screenUnit,p[0]+10*screenUnit+width,p[1]-25*screenUnit];
      if(p[0]<0||p[0]>960||p[1]<0||p[1]>500||n.id!==selectedReserve&&placed.some(b=>box[0]<b[2]+5*screenUnit&&box[2]>b[0]-5*screenUnit&&box[1]<b[3]+5*screenUnit&&box[3]>b[1]-5*screenUnit))continue;placed.push(box);reserveLabels.set(n.id,{label,left});
    }
    d3.selectAll('.map-reserve-node text').attr('transform',`scale(${screenUnit/k})`).attr('x',n=>reserveLabels.get(n.id)?.left?-10:10).attr('text-anchor',n=>reserveLabels.get(n.id)?.left?'end':'start').attr('y',-29).text(n=>reserveLabels.get(n.id)?.label||'');
    const inView=mapVisibleNodes.filter(n=>{const [x,y]=t.apply(projection([n.lon,n.lat]));return x>=0&&x<=960&&y>=0&&y<=500;}).length;
    const unlocated=mapLayer==='applications'?applicationFilteredRecords().length-mapVisibleNodes.length:0;
    $('map-status').textContent=mapLayer==='reserves'?`${(reserveData()?.countries||[]).filter(hasReserveValue).length} numeric country reserve entries · ${inView} country anchors in view · unavailable and unlisted countries remain unknown`:`${mapVisibleNodes.length} mapped site examples · ${inView} in view${unlocated?` · ${unlocated} unlocated record${unlocated===1?'':'s'} in the inspector list`:''} · no consumption or supplier volumes inferred`;
    $('map-zoom-value').textContent=`${k.toFixed(1).replace('.0','')}×`;return;
  }
  d3.selectAll('.map-node .map-marker,.map-node .map-hit').attr('transform',`scale(${screenUnit/k})`);
  // Labels are positioned in screen space and suppressed when they overlap.
  const placed=[],candidates=[...mapVisibleNodes].sort((a,b)=>(b.id===selectedMine)-(a.id===selectedMine));
  const labels=new Map();
  for(const n of candidates){const p=t.apply(projection([n.lon,n.lat])),selected=n.id===selectedMine;if(p[0]<-15||p[0]>975||p[1]<-15||p[1]>515||(!selected&&k<2.7))continue;const text=n.map_label||(mapLanguage==='zh'&&n.name_zh?n.name_zh:n.name),width=Math.min(260,text.length*6.6)*screenUnit,left=p[0]+width+16*screenUnit>950,box=left?[p[0]-11*screenUnit-width,p[1]-22*screenUnit,p[0]-11*screenUnit,p[1]-7*screenUnit]:[p[0]+11*screenUnit,p[1]-22*screenUnit,p[0]+11*screenUnit+width,p[1]-7*screenUnit];if(!selected&&placed.some(b=>box[0]<b[2]+7*screenUnit&&box[2]>b[0]-7*screenUnit&&box[1]<b[3]+5*screenUnit&&box[3]>b[1]-5*screenUnit))continue;placed.push(box);labels.set(n.id,{text,left});}
  d3.selectAll('.map-node text').attr('transform',`scale(${screenUnit/k})`).attr('x',n=>labels.get(n.id)?.left?-11:11).attr('text-anchor',n=>labels.get(n.id)?.left?'end':'start').attr('y',-11).text(n=>labels.get(n.id)?.text||'');
  const inView=mapVisibleNodes.filter(n=>{const [x,y]=t.apply(projection([n.lon,n.lat]));return x>=0&&x<=960&&y>=0&&y<=500;}).length;
  const path=(mapData.map_paths||[]).find(p=>p.id===mapPathId),placeLookup=new Map(allPlaceRecords().map(n=>[n.id,n]));
  const pathEvidence=path?[...path.steps.flatMap(s=>placeLookup.get(typeof s==='string'?s:s.unlocated_id)?.sources||[]),...mapData.routes.filter(r=>(path.route_ids||[]).includes(r.id)).flatMap(r=>r.sources||[])]:[];
  const entries=mapVisibleNodes.length,anchors=new Set(mapVisibleNodes.map(n=>`${n.lat},${n.lon}`)).size,relations=mapVisibleRoutes.length,regions=mapVisibleNodes.filter(n=>n.display_only).length,evidence=new Set([...mapVisibleNodes.flatMap(n=>n.sources||[]),...mapVisibleRoutes.flatMap(r=>r.sources||[]),...pathEvidence]).size;
  $('map-status').textContent=mapLanguage==='zh'?`${anchors} 个近似位置锚点 · ${entries} 个工序条目 / ${inView} 个在视野中 · ${relations} 条连线 · ${regions} 个展示区域 · ${evidence} 个来源`:`${anchors} approximate anchors · ${entries} stage entries / ${inView} in view · ${relations} drawn relationships · ${regions} display regions · ${evidence} sources`;
  $('map-zoom-value').textContent=`${k.toFixed(1).replace('.0','')}×`;
}
function renderMapLocale() {
  for(const [id,key] of [['map-all','allIngredients'],['map-selected','follow'],['map-us','us'],['map-help','help'],['map-east-asia','eastAsia'],['map-fit','fit'],['map-reset','world'],['map-disclaimer','disclaimer']])$(id).textContent=mapText(key);
  document.querySelectorAll('[data-map-text]').forEach(el=>el.textContent=mapText(el.dataset.mapText));
  const selectors=[['map-stage','allStages',mapStages],['map-evidence','allEvidence',mapEvidenceTypes]];
  for(const [id,key,types] of selectors) for(const opt of $(id).options)opt.textContent=opt.value==='all'?mapText(key):types[opt.value][mapLanguage];
  $('map-ingredient').options[0].textContent=mapText('allIngredients');$('map-ingredient').options[1].textContent=mapText('follow');
  $('map-stage-key').innerHTML=Object.entries(mapStages).map(([id,s])=>`<span>${mapStageIcon(id)}${s[mapLanguage]}</span>`).join('');
  $('map-evidence-key').innerHTML=['reported','agreement','capability','pilot','aggregate'].map(id=>`<span><i class="relation-swatch evidence-${id}"></i>${mapEvidenceTypes[id][mapLanguage]}</span>`).join('')+`<span><i class="hollow-swatch"></i>${mapLanguage==='zh'?'开发 / 展示区域':'Development / display region'}</span>`;
}
function renderMap() {
  renderMapLocale();
  updateMapLayerUI();
  if(mapLayer==='reserves'){renderReserveMap();return;}
  if(mapLayer==='applications'){renderApplicationMap();return;}
  const eligible=(mapData.map_paths||[]).filter(p=>materialMatch(p.materials,mapSelectedIngredient()));
  if(mapPathId!=='all'&&!eligible.some(p=>p.id===mapPathId))mapPathId='all';
  $('map-path').innerHTML=`<option value="all">${mapText('allPaths')}</option>`+eligible.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.title)}</option>`).join('');$('map-path').value=mapPathId;
  const {nodes:ns,routes,lookup}=mapScope();mapVisibleNodes=ns;mapVisibleRoutes=routes;
  if(!ns.some(n=>n.id===selectedMine))selectedMine=ns[0]?.id;
  const svg=d3.select('#map-world-layer');svg.selectAll('.map-dynamic').remove();const layer=svg.append('g').attr('class','map-dynamic');
  layer.selectAll('.map-route').data(routes).join('path').attr('class',r=>`map-route evidence-${evidenceClass(r)}`).attr('vector-effect','non-scaling-stroke').attr('d',r=>{const a=lookup.get(r.source),b=lookup.get(r.target);return geoPath({type:'LineString',coordinates:[[a.lon,a.lat],[b.lon,b.lat]]});}).on('click',(_,r)=>showMine(r.target)).append('title').text(r=>`${r.status_label||r.status}: ${r.summary}`);
  const groups=layer.selectAll('.map-node').data(ns).join('g').attr('class',n=>`map-node stage-${displayedStage(n)}${evidenceClass(n)==='development'||n.display_only?' hollow':''}${n.id===selectedMine?' selected':''}`).attr('transform',n=>`translate(${projection([n.lon,n.lat])})`).attr('tabindex',0).attr('role','button').attr('aria-label',n=>`${n.name}, ${n.country}, ${mapStages[displayedStage(n)][mapLanguage]}, ${n.status_label||n.status}`).on('click',(_,n)=>showMine(n.id)).on('keydown',(e,n)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();showMine(n.id);}});
  groups.append('circle').attr('class','map-hit').attr('r',18).attr('fill','transparent').attr('stroke','none');
  groups.append('path').attr('class','map-marker').attr('d',symbolPath).attr('fill',n=>evidenceClass(n)==='development'||n.display_only?'#17221d':mapStages[displayedStage(n)].color).attr('stroke',n=>mapStages[displayedStage(n)].color);
  groups.append('title').text(n=>`${n.name} · ${mapStages[displayedStage(n)][mapLanguage]} · ${n.status_label||n.status}`);groups.append('text');
  $('mine-picker').innerHTML=ns.map(n=>`<button data-mine="${escapeHTML(n.id)}" class="${n.id===selectedMine?'active':''}">${mapStageIcon(displayedStage(n))}<strong>${escapeHTML(n.name)}</strong><span>${escapeHTML(placeCountry(n))}</span><small>${escapeHTML(n.material_form||n.product||n.kind.replace(/_/g,' '))}</small></button>`).join('');
  $('mine-picker').onclick=e=>{const b=e.target.closest('[data-mine]');if(b)showMine(b.dataset.mine);};
  for(const [id,mode]of[['map-all','all'],['map-selected','selected'],['map-us','us']]){$(id).classList.toggle('active',mode===mapMode);$(id).setAttribute('aria-pressed',String(mode===mapMode));}
  updateMapGeometry();if(selectedMine)showMine(selectedMine);else{$('mine-detail').textContent=mapText('empty');$('map-anchor-choices').hidden=true;renderPathSummary();}
}
function fitMapBounds(points) {
  if(!points.length)return;const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),k=Math.min(24,Math.max(1,.83*Math.min(960/Math.max(38,x1-x0),500/Math.max(35,y1-y0))));
  const t=d3.zoomIdentity.translate(480-k*(x0+x1)/2,250-k*(y0+y1)/2).scale(k);d3.select('#origins-map').call(mapZoom.transform,t);
}
function fitMapResults(){fitMapBounds(mapVisibleNodes.map(n=>projection([n.lon,n.lat])));}
function drawWorld(world) {
  const country=topojson.feature(world,world.objects.countries);
  mapCountryFeatures=country.features;
  projection=d3.geoNaturalEarth1().fitExtent([[15,15],[945,485]],{type:'Sphere'});geoPath=d3.geoPath(projection);mapTransform=d3.zoomIdentity;
  const root=d3.select('#origins-map'),svg=root.append('g').attr('id','map-world-layer');
  svg.append('path').datum(d3.geoGraticule10()).attr('class','map-graticule').attr('d',geoPath);svg.selectAll('.map-country').data(country.features).join('path').attr('class','map-country').attr('d',geoPath);
  mapZoom=d3.zoom().scaleExtent([1,24]).extent([[0,0],[960,500]]).translateExtent([[-120,-60],[1080,560]]).on('zoom',e=>{mapTransform=e.transform;svg.attr('transform',e.transform);updateMapGeometry();});
  root.call(mapZoom);
  window.addEventListener('resize',updateMapGeometry);
  root.on('keydown.map',e=>{if(e.target!==$('origins-map'))return;const moves={ArrowLeft:[55,0],ArrowRight:[-55,0],ArrowUp:[0,55],ArrowDown:[0,-55]};if(moves[e.key]){e.preventDefault();root.call(mapZoom.translateBy,moves[e.key][0]/mapTransform.k,moves[e.key][1]/mapTransform.k);}else if(['+','='].includes(e.key)){e.preventDefault();root.call(mapZoom.scaleBy,1.6);}else if(e.key==='-'){e.preventDefault();root.call(mapZoom.scaleBy,1/1.6);}else if(e.key==='Home'){e.preventDefault();root.call(mapZoom.transform,d3.zoomIdentity);}});
  $('map-zoom-in').onclick=()=>root.call(mapZoom.scaleBy,1.6);$('map-zoom-out').onclick=()=>root.call(mapZoom.scaleBy,1/1.6);$('map-reset').onclick=()=>root.call(mapZoom.transform,d3.zoomIdentity);$('map-fit').onclick=fitMapResults;
  $('map-east-asia').onclick=()=>fitMapBounds([[90,15],[145,50],[90,50],[145,15]].map(p=>projection(p)));
  $('map-ingredient').onchange=e=>{mapIngredient=e.target.value;if(mapMode!=='us')mapMode=mapIngredient==='all'?'all':'selected';renderMap();};
  $('map-stage').onchange=e=>{mapStage=e.target.value;renderMap();};$('map-evidence').onchange=e=>{mapEvidence=e.target.value;renderMap();};$('map-path').onchange=e=>{mapPathId=e.target.value;renderMap();if(mapPathId!=='all')fitMapResults();};$('map-language').onchange=e=>{mapLanguage=e.target.value;renderMap();};
  $('map-layer').onchange=e=>{mapLayer=e.target.value;renderMap();publishMapNavigationMode();};
  $('map-reserve-display').onchange=e=>{reserveDisplay=e.target.value;renderMap();};
  $('map-reserve-country').onchange=e=>showReserve(e.target.value);
  $('map-application-sector').onchange=e=>{applicationSector=e.target.value;renderMap();};
  $('map-application-country').onchange=e=>{applicationCountry=e.target.value;renderMap();if(applicationCountry!=='all')fitMapResults();};
  $('map-caveats').innerHTML=(mapData.caveats||[]).map(x=>`<p>${escapeHTML(x)}</p>`).join('')+`<p>Geography: world-atlas 2 / Natural Earth, public domain. D3 and topojson-client ISC licenses are bundled. This is a representative evidence map, not a facility census or shipment database. Named-place references: <a href="https://www.geonames.org/" target="_blank" rel="noopener">GeoNames</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>; rounded city/place anchors are adapted for this visualization. Map filters count matching coordinate-bearing entries and drawn relationships; unlocated steps remain in path summaries. Neither line geometry nor common ownership establishes a transport route.</p>`;
  renderMap();
}
const palette=['#c5a46b','#8aab95','#bb785d','#a6a6cf','#73a8b8','#e1c393','#a7bd78'];
const plotLayout = () => ({paper_bgcolor:'transparent',plot_bgcolor:'transparent',font:{family:'Arial, sans-serif',size:13,color:'#aeb9ad'},margin:{l:75,r:20,t:20,b:75},xaxis:{gridcolor:'#c5a46b15',zeroline:false},yaxis:{gridcolor:'#c5a46b18',zeroline:false},legend:{orientation:'h',y:-.25,font:{size:12}},hoverlabel:{bgcolor:'#18221e',font:{color:'#ede9dd',size:13}},showlegend:true});
const plotConfig={responsive:true,displayModeBar:false};
function seriesFor(el) {return [...(datasets.ree?.series||[]),...(datasets.bulk?.series||[]),...(datasets.boron?.series||[])].filter(s=>s.element===el);}
function showPrice(el) {
  selectedPrice=el;document.querySelectorAll('[data-price]').forEach(b=>{const a=b.dataset.price===el;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a));});
  const series=seriesFor(el),traces=[],allPoints=[],segments=new Map();
  for(const s of series) for(const p of s.points||[]) {
    if(!Number.isFinite(p.value)) continue;
    allPoints.push({...p,series:s});const key=p.segmentId||s.id;
    if(!segments.has(key)) segments.set(key,{series:s,points:[]});segments.get(key).points.push(p);
  }
  let idx=0;
  for(const [key,{series:s,points}] of segments) {
    points.sort((a,b)=>a.year-b.year||(a.month||0)-(b.month||0));
    const x=[],y=[],hover=[];
    for(let i=0;i<points.length;i++) {
      const p=points[i];if(i&&!p.date&&p.year-points[i-1].year>1){x.push(p.year-.5);y.push(null);hover.push('');}
      x.push(el==='Fe'?p.date:p.year);y.push(p.value);
      const basis=(p.basis||s.basis||'').replaceAll('_',' '),purity=p.purityPercent?` · ${p.purityPercent}% purity`:'';
      hover.push(`${p.date||p.year}: ${fmt(p.value)} ${escapeHTML(p.unit||s.unit)}${p.estimated?' (estimated)':''}<br>${escapeHTML(p.form||s.form)}${purity}<br>${escapeHTML(basis)}<br>${escapeHTML(p.deliveryBasis||'')}<br>${escapeHTML(p.notes||'')}`);
    }
    const first=points[0],last=points.at(-1),years=first.year===last.year?String(first.year):`${first.year}–${last.year}`;
    const annual=(first.basis||s.basis||'').includes('annual_average');
    traces.push({type:'scatter',mode:el==='Fe'?'lines':'lines+markers',x,y,name:`${years} · ${el==='Fe'?s.label:annual?'annual average':(first.basis||s.basis||'reported quote').replaceAll('_',' ').replace('Annual average value of mineral imports at port of exportation, as reported by USGS MCS 2011 and 2016','export-port unit value').slice(0,38)}`,line:{color:palette[idx++%palette.length],width:2},marker:{size:6},connectgaps:false,text:hover,hovertemplate:'%{text}<extra></extra>'});
  }
  const name=el==='NdPr'?'Combined NdPr oxide':el==='Fe'?'Iron ore · upstream price':el==='B'?'Borates · import unit value':`${({Nd:'Neodymium',Pr:'Praseodymium',Dy:'Dysprosium',Tb:'Terbium'})[el]} oxide`;
  $('price-title').textContent=name;
  $('price-basis').textContent=el==='Fe'?'Monthly spot prices, CFR China. The ore grade changes in December 2008; the traces are separated. Not a magnet-grade iron purchase quote.':el==='B'?'Mixed borate imports. Export-port and CIF unit values are separate benchmarks. Not elemental boron or ferroboron prices.':el==='NdPr'?'Combined NdPr oxide, 99% minimum. Five verified annual averages, 2021–2025; earlier years remain unverified. This is not an NdPr metal-alloy purchase price.':'USD/kg oxide. Early supplier/package quotes, later reported prices and annual averages are separated at benchmark, timing or purity changes. These are not alloy-metal purchase prices.';
  const layout=plotLayout();layout.xaxis={...layout.xaxis,...(el==='Fe'?{type:'date',range:['2006-01-01','2025-12-31'],dtick:'M48'}:{range:[2005.5,2025.5],dtick:4})};layout.yaxis.title={text:el==='Fe'?'USD / dry tonne ore':el==='B'?'USD / tonne product':'USD / kg oxide',font:{size:13}};
  if(traces.length) Plotly.react('price-chart',traces,layout,plotConfig);
  else {$('price-chart').innerHTML='<div class="no-monthly-data"><strong>No series</strong><p>A verified price series is not available for this product.</p></div>';}
  const years=new Set(allPoints.filter(p=>p.value!==null).map(p=>p.year)),missing=Array.from({length:20},(_,i)=>i+2006).filter(y=>!years.has(y));
  const missingText=missing.length>1&&missing.at(-1)-missing[0]+1===missing.length?`${missing[0]}–${missing.at(-1)}`:missing.join(', ');
  $('price-coverage').innerHTML=`<p class="price-coverage">${allPoints.length} sourced observations · ${years.size} of 20 years${missing.length?` · No verified observations for ${missingText}`:''}. Separate traces do not imply comparable prices across benchmark changes. Hover a point to inspect its product and price basis.</p>`;
  const urls=new Map();for(const p of allPoints){const url=p.sourceUrl||p.series.sourceUrl;if(url&&!urls.has(url))urls.set(url,p.sourceTitle||`Source report · ${p.year}`);}
  $('price-sources').innerHTML=`<details><summary>Open source reports (${urls.size})</summary><div class="source-chips">${[...urls].map(([url,label])=>link(url,label)).join('')}</div></details>`;
  showSeasonality(el);
}
function showSeasonality(el) {
  if(el!=='Fe') {
    if($('seasonality-chart').classList.contains('js-plotly-plot')) Plotly.purge('seasonality-chart');
    $('seasonality-explanation').textContent='The verified public series here has annual observations. It cannot establish a monthly seasonal pattern. Switch to iron ore for the available monthly evidence.';
    $('seasonality-chart').innerHTML='<div class="no-monthly-data"><strong>12 months?</strong><p>Monthly observations are missing.<br>Annual prices cannot reveal month-of-year seasonality.</p></div>';return;
  }
  $('seasonality-chart').innerHTML='';const season=datasets.bulk.seasonality;
  $('seasonality-explanation').textContent='Iron ore, 2009–2025: each month is divided by that year’s mean (100). Thin lines show individual years; the thicker line is the median. This descriptive profile does not establish a stable or causal seasonal effect.';
  const years=[...new Set(season.points.map(p=>p.year))],traces=years.map(y=>({x:season.points.filter(p=>p.year===y).map(p=>p.month),y:season.points.filter(p=>p.year===y).map(p=>p.index),type:'scatter',mode:'lines',showlegend:false,line:{color:'#8aab9530',width:1},hoverinfo:'skip'}));
  traces.push({x:Array.from({length:12},(_,i)=>i+1),y:Array.from({length:12},(_,i)=>d3.median(season.points.filter(p=>p.month===i+1),p=>p.index)),mode:'lines+markers',name:'Median across 17 years',line:{color:'#c5a46b',width:3},hovertemplate:'Month %{x}: %{y:.1f}<extra>Within-year index</extra>'});
  const layout=plotLayout();layout.margin={l:50,r:15,t:10,b:40};layout.showlegend=false;layout.xaxis={...layout.xaxis,tickvals:[1,3,5,7,9,11],ticktext:['Jan','Mar','May','Jul','Sep','Nov']};layout.yaxis.title={text:'Year mean = 100',font:{size:12}};Plotly.react('seasonality-chart',traces,layout,plotConfig);
}
function downloadData() {
  const payload={selectedMaterial:selectedPrice,period:[2006,2025],series:seriesFor(selectedPrice),caveats:selectedPrice==='Fe'?datasets.bulk.caveats:selectedPrice==='B'?datasets.boron.caveats:datasets.ree.methodology};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`rare-earth-${selectedPrice}-price-evidence.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function init() {
  const initialLayer=new URLSearchParams(location.search).get('layer');
  if(['facilities','reserves','applications'].includes(initialLayer))mapLayer=initialLayer;
  $('map-layer').value=mapLayer;updateMapIdentity();publishMapNavigationMode();
  mountJourneyArtwork();
  $('material-picker').innerHTML=Object.entries(ingredients).map(([id,x])=>`<button data-ingredient="${id}" aria-pressed="false"><b>${x.short}</b><span>${id==='NdPr'?'Neodymium + Pr':x.name}<small>${x.chinese.split(' / ')[0]}</small></span></button>`).join('');
  $('material-picker').onclick=e=>{const b=e.target.closest('[data-ingredient]');if(b)setIngredient(b.dataset.ingredient);};
  document.querySelectorAll('[data-scene]').forEach(n=>{n.onclick=()=>setStep(Number(n.dataset.scene));n.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setStep(Number(n.dataset.scene));}};});
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>setStep(Number(b.dataset.step)));
  document.querySelectorAll('[data-specimen]').forEach(b=>b.onclick=()=>showSpecimen(b.dataset.specimen));
  $('motion-toggle').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion-toggle').textContent=paused?'Play motion':'Pause motion';$('motion-toggle').setAttribute('aria-pressed',String(!paused));};
  if(reducedMotion){document.body.classList.add('paused');$('motion-toggle').textContent='Motion reduced';$('motion-toggle').setAttribute('aria-pressed','false');}
  for(const [id,mode] of [['map-all','all'],['map-selected','selected'],['map-us','us']]) $(id).onclick=()=>{mapMode=mode;mapPathId='all';if(mode!=='us')mapIngredient=mode==='all'?'all':'follow';$('map-ingredient').value=mapIngredient;if(mapData)renderMap();};
  $('download-prices').onclick=downloadData;
  $('price-picker').innerHTML=[['NdPr','NdPr blend'],['Nd','Neodymium'],['Pr','Praseodymium'],['Dy','Dysprosium'],['Tb','Terbium'],['Fe','Iron ore'],['B','Borates']].map(([id,name])=>`<button data-price="${id}" aria-pressed="false"><b>${id}</b><span>${name}</span></button>`).join('');
  $('price-picker').onclick=e=>{const b=e.target.closest('[data-price]');if(b)showPrice(b.dataset.price);};
  setIngredient('NdPr');setStep(2);showSpecimen(selectedSpecimen);
  const tasks=[['ree','data/price-history-ree.json'],['bulk','data/price-history-bulk.json'],['boron','data/price-history-boron.json'],['mines','data/mine-routes.json'],['world','assets/world-countries.json'],['reserves','data/global-reserves.json'],['applications','data/application-supply.json'],['equipment','data/equipment-readiness.json']];
  const results=await Promise.allSettled(tasks.map(async([key,url])=>{const r=await fetch(url);if(!r.ok)throw new Error(`Missing ${key} evidence`);return {key,value:await r.json()};}));
  const errors=[];for(let i=0;i<results.length;i++){const r=results[i];if(r.status==='fulfilled')datasets[r.value.key]=r.value.value;else errors.push(tasks[i][0]);}
  if(window.loadVolumeEvidence)await window.loadVolumeEvidence();
  if(datasets.mines&&datasets.world){mapData=datasets.mines;const params=new URLSearchParams(location.search);if(['facilities','reserves','applications'].includes(params.get('layer')))mapLayer=params.get('layer');if(params.has('country')){const r=(datasets.reserves?.countries||[]).find(r=>r.id===params.get('country')||reserveCountryKey(r.iso_numeric)===params.get('country'));if(r)selectedReserve=reserveCountryKey(r.iso_numeric);}if(params.has('sector'))applicationSector=params.get('sector');if(params.has('application_country'))applicationCountry=params.get('application_country');if(params.has('plant'))selectedApplication=params.get('plant');if((mapData.map_paths||[]).some(p=>p.id===params.get('path')))mapPathId=params.get('path');if(allPlaceRecords().some(n=>n.id===params.get('place')))selectedMine=params.get('place');if(mapStages[params.get('stage')])mapStage=params.get('stage');if(['NdPr','Dy','Tb','Fe','B'].includes(params.get('ingredient'))){mapIngredient=params.get('ingredient');$('map-ingredient').value=mapIngredient;}drawWorld(datasets.world);if(mapLayer==='facilities'&&mapPathId!=='all')fitMapResults();else if(mapLayer==='facilities'&&params.has('place')){const place=allMapNodes().find(n=>n.id===selectedMine);if(place)fitMapBounds([projection([place.lon,place.lat])]);}else if(mapLayer==='applications'&&params.has('plant')){const place=applicationPlants().find(p=>p.id===selectedApplication);if(place)fitMapBounds([projection([place.lon,place.lat])]);}else if(mapLayer==='applications'&&applicationCountry!=='all')fitMapResults();}else $('map-status').textContent='Map evidence could not load. Reload to retry.';
  showPrice('NdPr');
  const priceErrors=errors.filter(key=>['ree','bulk','boron'].includes(key));
  if(priceErrors.length){$('price-coverage').insertAdjacentHTML('beforeend',`<p class="small-note">Some price evidence could not load: ${priceErrors.map(escapeHTML).join(', ')}. Reload to retry.</p>`);}
}
init().catch(e=>{console.error(e);$('map-status').textContent='The field guide could not initialize. Reload to retry.';});
