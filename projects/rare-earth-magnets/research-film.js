/* Cinematic research-history draft. Artwork is representative; it is not a Davis
 * likeness, reconstructed experiment or measured model output. One RAF clock
 * drives every image layer, actor pose, moving machine and shot transition. */
(function () {
  'use strict';
  const mount=document.getElementById('research-film');
  if(!mount)return;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const span=(t,a,b)=>clamp((t-a)/(b-a));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const lerp=(a,b,t)=>a+(b-a)*clamp(t);
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let lowMotion=preference.matches,data,index=0,card=-1,elapsed=0,duration=18000,playing=false,replayHold=false,proof=false,raf=0,last=0,beat=-1,language='en',generation=0;
  let canvas,world,layers={},family='water',director,activePrefix='',shotWorlds=[];
  const ASSETS={
    alpineWide:'assets/davis-anime/01-paleohydrology-mountains-drainage.png',
    alpine:'assets/davis-cinema/alpine-field-plate.png',
    fieldActor:'assets/davis-cinema/field-scientist-sediment-poses.png',
    fieldGesture:'assets/davis-cinema/field-scientist-sediment-8frames.png',
    port:'assets/davis-cinema/port-environment-v1.png',
    vessel:'assets/davis-cinema/port-cargo-vessel.png',
    container:'assets/davis-cinema/port-container.png',
    hook:'assets/davis-cinema/port-hoist-rig-v2.png',
    portTeam:'assets/davis-cinema/port-research-team-v2.png',
    energy:'assets/davis-cinema/energy-environment-v1.png',
    rotor:'assets/davis-cinema/energy-wind-rotor.png',
    handler:'assets/davis-cinema/energy-forklift-empty.png',
    pallet:'assets/davis-cinema/energy-metal-pallet.png',
    lab:'assets/davis-cinema/lab-archive-plate.png',
    hand:'assets/davis-cinema/lab-sample-hand-poses.png',
    farm:'assets/davis-cinema/farmland-trade-plate.png',
    cropTruck:'assets/davis-cinema/farmland-crop-truck.png',
    cement:'assets/davis-cinema/cement-community-plate.png',
    cementTruck:'assets/davis-cinema/cement-mixer-truck.png',
    worker:'assets/davis-cinema/cement-worker-poses.png',
    atmosphere:'assets/davis-cinema/atmospheric-cloudband.png',
    wake:'assets/davis-cinema/port-water-wake.png',
    aiRoom:'assets/davis-cinema/ai-powerroom-plate.png',
    aiSite:'assets/davis-cinema/ai-candidate-site-plate.png',
    engineer:'assets/davis-cinema/ai-engineering-poses.png',
    basinSeparate:'assets/davis-cinema/basin-separate-plate.png',
    basinIntegrated:'assets/davis-cinema/basin-integrated-plate.png',
    fuel:'assets/davis-cinema/coal-fuel-environment-v1.png',
    resource:'assets/davis-cinema/metal-resource-environment-v1.png',
    excavator:'assets/davis-cinema/quarry-excavator-poses-v2.png',
    haulEmpty:'assets/davis-cinema/quarry-haul-truck-empty.png',
    haulLoaded:'assets/davis-cinema/quarry-haul-truck.png',
    solar:'assets/davis-cinema/solar-land-comparison-plate.png',
    tracker:'assets/davis-cinema/solar-tracker-angle-poses-v2.png',
    records:'assets/davis-cinema/records-office-plate.png',
    recordsHands:'assets/davis-cinema/records-hand-prop-poses.png',
    recordsAlignment:'assets/davis-cinema/records-alignment-poses-v2.png',
    aiCooling:'assets/davis-cinema/ai-cooling-service-plate.png',
    coolingActor:'assets/davis-cinema/ai-cooling-inspection-poses.png',
    coolingGesture:'assets/davis-cinema/ai-cooling-inspection-8-poses-v1.png'
  };
  const PROOF_YEARS=[2008,2010,2023];
  const FILM_TEXT={
    water:{shots:['Read the landscape','Examine the evidence','Return to the drainage history'],zh:['观察地景','检查证据','回到水系历史'],method:'Ancient lake-sediment records are interpreted alongside drainage history. The river is a mechanism illustration; these anonymous field scenes do not reproduce the published sampling or laboratory work.',methodZh:'古湖沉积记录需要结合水系历史来解释。河流演示的是机制；匿名野外场景并非重演论文中的采样或实验。',next:'A local record belongs to a wider system. What changes when we follow that connection?',nextZh:'局部记录属于更大的系统。继续追踪这种联系，问题会怎样改变？'},
    port:{shots:['Where the goods are made','A physical handoff','Follow the goods beyond the shore'],zh:['商品在哪里生产','一次真实的物理交接','沿商品追踪到海岸之外'],method:'The cargo moves through physical handoffs. Consumption accounting links it to production that occurred elsewhere; production emissions do not travel inside the manufactured goods.',methodZh:'货物经过物理交接继续流动。消费核算把它连接到别处的生产；制造排放并不装在商品里面运输。',next:'The object has a production history. Which boundary makes that history useful for a decision?',nextZh:'一个物品有自己的生产历史。怎样的边界能让这段历史服务于决策？'},
    energy:{shots:['A target needs physical equipment','Deliver and assemble','Operate—and build again'],zh:['目标需要真实设备','运输与组装','运行，并继续建设'],method:'Energy pathways specify technologies. Their construction, replacement and material intensities translate a target into annual production requirements. This illustrative delivery does not establish a shortage.',methodZh:'能源路径规定技术组合。建设、替换与材料强度把目标转为逐年的生产需求。此处的示意运输并不证明出现短缺。',next:'The same target can require different places, technologies and material flows. Which consequence changes the decision?',nextZh:'同一目标可能需要不同地点、技术与材料流。什么后果会真正改变决策？'}
  };
  function current(){const base=data.chapters[index];return card>=0?{...base,...base.cards[card]}:base;}
  // Sparse publication-year windows remain intact; these shots are editorial
  // comparisons of methods, not nineteen asserted autobiographical discoveries.
  const SHOTS={
    2008:[['water','The record has a catchment','记录有其流域'],['lab','Examine ancient sediment evidence','检查古湖沉积证据'],['water','Read the water before the elevation','先读水系，再读古山高']],
    2009:[['basin','Begin with separated catchments','从分离的流域开始'],['basin','A gorge connects the drainage','一道峡谷连通水系'],['basin','Read the connected regional record','读取相连的区域记录']],
    2010:[['port','A purchased object has a production history','购买的物品有生产历史'],['cement','A parallel question: installed infrastructure','并行问题：已安装的设施'],['energy','Inspect accounting and future commitment','检验核算与未来排放承诺']],
    2011:[['fuel','Carbon-bearing fuel leaves extraction','含碳燃料离开开采环节'],['industry','Combustion supports production','燃烧支持生产'],['port','Manufactured goods carry a production history','制造商品有生产历史'],['consumption','A service reaches final consumption','服务到达最终消费']],
    2012:[['fuel','Fuel physically contains carbon','燃料在物理上含有碳'],['records','Open, compare and align the source records','打开、比较并统一来源记录'],['port','Compare attributed production on a consistent basis','按一致口径比较归属的生产排放']],
    2013:[['cement','Production belongs to a region','生产发生在具体地区'],['port','Consumption connects regions','消费把地区连接起来'],['cement','A national total can conceal those links','全国总量可能遮住这种联系']],
    2014:[['port','Trade moves goods','贸易运输商品'],['community','Atmospheric transport is another pathway','大气输送是另一条路径'],['community','Assess air where people live','评估人们居住地的空气']],
    2015:[['cement','Inspect a specific production sector','检查具体生产行业'],['energy','Consider an energy-system intervention','考察能源系统的干预'],['cement','Compare opportunities by region and industry','按地区与行业比较机会']],
    2016:[['cement','Production is only the beginning','生产只是开始'],['cement','Concrete enters use and later life','混凝土进入使用与后续阶段'],['cement','Examine the material in later life','检查材料的后续生命周期']],
    2017:[['port','Connect consumption to production','把消费连接到生产'],['community','Goods and polluted air travel differently','商品与污染空气沿不同路径移动'],['community','Ask who bears the health impact','追问谁承担健康影响']],
    2018:[['energy','People need delivered services','人们需要实际服务'],['cement','Some services are harder to decarbonize','有些服务更难脱碳'],['energy','Weather makes reliability an hourly question','天气让可靠性成为逐小时的问题']],
    2019:[['industry','The infrastructure question returns','回到基础设施问题'],['idle','An alternative edit: operation stops','一个替代情景：运行停止'],['power','A separate replacement context','另一个替换供能情境']],
    2020:[['day-power','Power activity at an observation interval','一个观测时段中的电力活动'],['activity-records','Check activity records and organize daily estimates','检查活动记录并整理每日估算'],['day-industry','Resolve when industrial activity takes place','细分工业活动发生的时间']],
    2021:[['industry','Production has process and energy inputs','生产包含工艺与能源输入'],['power','An energy intervention has a specific scope','能源干预有其具体范围'],['industry','The remaining production question differs','剩余的生产问题仍然不同']],
    2022:[['farm','A crop has a production landscape','农产品有其生产地景'],['port','Follow the shipment to consumption','沿货运追踪到消费'],['farm','Keep agriculture and land-use change distinct','区分农业与土地利用变化']],
    2023:[['energy','A pathway needs delivered equipment','路径需要设备交付'],['resource','Rock is a stock; loading is a flow','岩层是存量，装载是流量'],['energy','Annual construction needs repeated throughput','逐年建设需要持续周转']],
    2024:[['energy','A shared target leaves design choices','共同目标仍留下设计选择'],['farm','Places impose different constraints','不同地点有不同约束'],['energy','Compare futures without assigning probabilities','比较未来，但不赋予概率']],
    2025:[['port','Energy transitions change what is imported','能源转型改变进口内容'],['energy','Materials enter a technology pathway','材料进入技术路径'],['port','Trade exposure is not a delivery shortage','贸易暴露并非交付短缺']],
    2026:[['solar','A solar design uses a place','光伏设计占用具体地点'],['community','A pathway has local consequences','路径有地方后果'],['energy','Separate new plans from published evidence','区分新计划与已发表证据']]
  };
  function directing(c){
    let shots=SHOTS[c.year].map(x=>[...x]);
    if(c.year===2010&&card>=0)shots=c.scene==='infrastructure'?[['industry','Installed equipment continues operating','已安装设备继续运行'],['industry','Its assumed lifetime matters','假设的运行寿命很重要'],['energy','Replacement changes the future commitment','替换改变未来承诺']]:[['port','Where was the object produced?','物品在哪里生产？'],['port','Goods travel to consumption','商品运往消费地'],['port','Attribute the production history','归属生产历史']];
    if(c.scene==='corporate')shots=[['port','A supplier has a location','供应商有其地点'],['port','Purchased goods connect production regions','采购连接不同生产地区'],['port','Supplier geography changes the footprint','供应商地理改变碳足迹']];
    if(c.scene==='ai')shots=[['ai-site','A candidate place has a physical connection','候选地点有其物理接入条件'],['ai-room','Examine the power-service infrastructure','检查供电服务设施'],['ai-cooling','Inspect the cooling service, then record the check','检查冷却服务，并记录检查过程'],['comparison-records','Set up a comparison; no option has been selected','准备比较：尚未选出方案']];
    if(c.scene==='equity')shots=[['industry','Pathways leave different residual emissions','不同路径留下不同残余排放'],['power','Removal reliance changes the mitigation mix','移除依赖改变减排组合'],['community','Examine who receives the health benefits','检查谁获得健康收益']];
    if(c.year===2026&&card>=0&&c.scene==='frontier')shots=[['solar','The fixed-tilt row stays in place','固定倾角阵列保持原位'],['solar','The tracker row changes orientation','跟踪阵列改变朝向'],['solar','Compare designs under land constraints','在土地约束下比较设计']];
    if(c.year===2026&&c.scene==='system')shots=[['power','An operating system depends on weather','运行系统依赖天气'],['power','Resources can fall over short intervals','资源能在短时段内下降'],['power','Examine the resulting reliability challenge','检查由此带来的可靠性挑战']];
    const method=c.year===2010&&card<0?'Two parallel questions connect consumption to production elsewhere and existing infrastructure to conditional future emissions. The plant and power landscape do not imply that those accounts have the same boundary.':c.year===2008||c.year===2009?FILM_TEXT.water.method:c.year===2022?'Agricultural and land-use-change emissions are traced through multiregional trade accounts. A crop truck does not imply that its shipment caused deforestation.':c.scene==='corporate'?'Matched single-region and multiregional accounting models compare corporate footprints and priorities. Supplier locations are resolved within modeled accounts; the generic cargo handoff is not a direct company audit, identified supplier or national resource-risk calculation.':c.scene==='ai'?'The August 2026 announcement describes a funded plan for comparing AI site and power choices. Site, power-room and cooling-service checks are generic engineering illustrations; the blank comparison records do not depict a completed tool, calculated values or a selected option.':c.year===2011?'The account follows fossil carbon from extraction through production to final consumption, exposing different policy intervention points. Carbon in fuels and production emissions attributed to manufactured goods are not additive quantities in this film.':c.year===2012?'Trade-carbon accounts depend on aligned definitions and data. Opening two folders and physically aligning their sheets illustrates that comparison step, with no reconstructed numerical ledger. Carbon contained in fuel and production emissions attributed to manufactured goods remain distinct accounts.':c.year===2026&&card>=0&&c.scene==='frontier'?'The China analysis compares fixed-tilt and tracking PV under land-cost and output assumptions and evaluates associated material requirements. Painted tracker positions do not encode a calculated yield, LCOE or selected winner.':c.year===2024?'The analysis compares scenario ensembles and regional/technology differences. Alternative scenery is not an observed future, an assigned probability or a material-production forecast.':c.year===2026&&card<0?'This overview compares the questions of separate solar-design, health/equity, funded-AI-plan and energy-resource studies. Their methods and results are not combined into one analysis.':c.year===2026&&c.scene==='system'?'The September paper studies short-interval wind and solar resource deficits. These weather illustrations are not computed dispatch, a storage solution or a measured event trace.':c.scene==='equity'?'The analysis compares residual-emissions and carbon-removal choices under net-zero pathways and their air-quality/health consequences. The generic scenes do not show a calculated removal rate, exposure or individual outcome.':c.year===2023?'Technology pathways and material intensities create annual construction and replacement requirements. Geological availability is a separate test; the yard stock is not a measure of geological reserves.':c.year===2016?'The lifecycle account estimates cement carbonation during use and later life. Pouring and sample handling illustrate those stages; they do not show a measured uptake rate or cancel production emissions.':c.year===2021?'The analysis distinguishes process chemistry from energy use and compares production interventions. The generic kiln and construction crew are not an observed implementation of those combinations.':c.year===2014||c.year===2017?'Economic and emissions accounts connect to atmospheric and health analysis. Cargo and visible aerosol have separate paths; the image is neither visible CO₂ nor a computed exposure map.':c.scene==='daily'?'Sector activity records are checked and organized into daily emissions estimates. Blank folders, aligned sheets and an unlabeled calendar represent the data-handling method; these are not direct CO₂ measurements or a reproduction of the Carbon Monitor time series.':c.scene==='infrastructure'?'Operating life, utilization and replacement assumptions determine conditional future emissions commitments. Illustrative equipment does not imply unavoidable future operation.':c.scene==='risk'?'Transition pathways change trade exposure under resource-location and import assumptions. This does not model customer-qualified magnet deliveries or establish an observed disruption.':c.scene==='system'?'Energy services require a combination of generation, storage, transmission and other options. Wind and weather here are illustrative, not a calculated hourly dispatch.':c.scene==='frontier'||c.scene==='scenarios'?FILM_TEXT.energy.method:FILM_TEXT.port.method;
    const boundary=c.visual+' '+method;
    return {shots,method,boundary,next:c.continuity,status:'Year treatment · review draft'};
  }
  function sources(rows){return rows.map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener"><span>${esc(r.kind)} · ${esc(r.date)}</span><strong>${esc(r.title)}</strong>${r.note?`<small>${esc(r.note)}</small>`:''}<b aria-hidden="true">↗</b></a>`).join('');}
  function imageLayer(id,key,x=0,y=0,w=1,z=1,extra='',mandatory=true){return `<div class="rf-image-layer ${extra}" data-rf-part="${id}" data-rf-key="${key}" style="left:${x*100}%;top:${y*100}%;width:${w*100}%;z-index:${z}"><img src="${ASSETS[key]}" alt="" draggable="false" data-rf-required="${mandatory}"></div>`;}
  function background(id,key,z=0){return `<div class="rf-environment" data-rf-part="${id}" data-rf-key="${key}" style="z-index:${z}"><img src="${ASSETS[key]}" alt="" draggable="false" data-rf-required="true"></div>`;}
  function waterWorld(){return background('wide','alpineWide')+background('field','alpine',1)+`<div class="rf-water-surface rf-river-surface" data-rf-part="river" style="z-index:2"><img src="${ASSETS.alpine}" alt="" draggable="false"></div><div class="rf-field-actor" data-rf-part="field-actor" style="background-image:url('${ASSETS.fieldGesture}')"><img class="rf-preload" src="${ASSETS.fieldGesture}" alt="" data-rf-required="true"></div>`;}
  function portWorld(){return background('port-base','port')+`<div class="rf-water-surface rf-harbor-surface" data-rf-part="harbor" style="z-index:1"><img src="${ASSETS.port}" alt="" draggable="false"></div>`+imageLayer('wake','wake',.37,.53,.40,2)+imageLayer('vessel','vessel',.475,.47,.47,3)+`<div class="rf-hoist-cable" data-rf-part="cable"></div>`+imageLayer('hook','hook',.40,.424,.102,5,'rf-rig-layer')+imageLayer('container','container',.408,.665,.106,6)+imageLayer('port-team','portTeam',.035,.775,.118,8,'',false);}
  function energyWorld(materials=true){return background('energy-base','energy')+imageLayer('weather','atmosphere',-.35,-.025,.70,1,'',false)+(materials?imageLayer('pallet','pallet',.541,.838,.10,6)+imageLayer('handler','handler',.34,.74,.18,5):'')+[[-1,.166,.124,.129],[0,.069,.212,.075],[1,.245,.266,.090]].map(([n,x,y,w])=>`<div class="rf-rotor-plane" data-rf-part="rotor-plane-${n}" style="left:${x*100}%;top:${y*100}%;width:${w*100}%;"><div class="rf-rotor-turn" data-rf-part="rotor-${n}"><img src="${ASSETS.rotor}" alt="" draggable="false" data-rf-required="true"></div></div>`).join('');}
  function spriteLayer(id,key,extra=''){return `<div class="rf-actor-sheet ${extra}" data-rf-part="${id}" style="background-image:url('${ASSETS[key]}')"><img class="rf-preload" src="${ASSETS[key]}" alt="" data-rf-required="true"></div>`;}
  function labWorld(){return background('lab-base','lab')+spriteLayer('sample-hand','hand','rf-sample-hand');}
  function farmWorld(){return background('farm-base','farm')+imageLayer('crop-truck','cropTruck',.45,.62,.32,6);}
  function cementWorld(crew=true){return background('cement-base','cement')+imageLayer('cement-truck','cementTruck',-.25,.50,.185,4)+(crew?spriteLayer('concrete-worker','worker','rf-concrete-worker'):'');}
  function aiWorld(room=false){return background('ai-base',room?'aiRoom':'aiSite')+spriteLayer('engineer','engineer','rf-engineer');}
  function communityWorld(){return background('community-base','cement')+imageLayer('cement-truck','cementTruck',-.25,.50,.18,4)+`<div class="rf-atmosphere-layer" data-rf-part="atmosphere"><img src="${ASSETS.atmosphere}" alt="" data-rf-required="false"></div>`;}
  function basinWorld(){return background('basin-separate','basinSeparate')+background('basin-integrated','basinIntegrated',1)+`<div class="rf-basin-current" data-rf-part="basin-current"><img src="${ASSETS.basinIntegrated}" alt=""></div>`;}
  function quarryWorld(resource=false){return background('quarry-base',resource?'resource':'fuel')+spriteLayer('excavator','excavator','rf-excavator')+spriteLayer('excavator-flow','excavator','rf-excavator rf-excavator-stream')+imageLayer('haul-empty','haulEmpty',.50,.607,.21,9)+imageLayer('haul-loaded','haulLoaded',.50,.607,.21,10);}
  function solarWorld(){return background('solar-base','solar')+spriteLayer('tracker','tracker','rf-solar-tracker');}
  function recordsWorld(daily=false){return background('records-base','records')+spriteLayer('record-hands','recordsAlignment','rf-record-hands')+(daily?`<img class="rf-preload" src="${ASSETS.recordsHands}" alt="" data-rf-required="true">`:'');}
  function coolingWorld(){return background('cooling-base','aiCooling')+spriteLayer('cooling-actor','coolingGesture','rf-cooling-actor');}
  const WORLD_BUILDERS={water:waterWorld,lab:labWorld,port:portWorld,energy:energyWorld,farm:farmWorld,cement:cementWorld,community:communityWorld,power:()=>energyWorld(false),industry:()=>cementWorld(false),idle:()=>background('idle-base','cement'),'day-power':()=>energyWorld(false),'day-port':portWorld,'day-industry':()=>cementWorld(false),'ai-site':()=>aiWorld(false),'ai-room':()=>aiWorld(true),basin:basinWorld,fuel:()=>quarryWorld(false),resource:()=>quarryWorld(true),consumption:()=>aiWorld(true),solar:solarWorld,records:()=>recordsWorld(false),'activity-records':()=>recordsWorld(true),'comparison-records':()=>recordsWorld(false),'ai-cooling':coolingWorld};
  function buildShot(kind,i){const art=WORLD_BUILDERS[kind]().replace(/data-rf-part="([^"]+)"/g,(_,name)=>`data-rf-part="s${i}-${name}"`);return `<div class="rf-shot-plane" data-rf-shot="${i}" data-rf-family="${kind}"><div class="rf-world">${art}<div class="rf-day-light" data-rf-part="s${i}-day-light" aria-hidden="true"></div></div></div>`;}
  function shell(){
    mount.innerHTML=`<div class="rf-shell rf-cinematic-draft"><div class="rf-top"><div><span id="rf-years" class="rf-years"></span><span id="rf-tag" class="rf-tag"></span></div><span class="rf-edition">19-YEAR REVIEW DRAFT<br><span>Layered illustrated animation · 2008–2026</span></span></div><div class="rf-heading"><h2 id="rf-question"></h2><p id="rf-question-zh"></p></div><div class="rf-view-cards" id="rf-view-cards" aria-label="Related questions in this year"></div><div class="rf-stage" id="rf-stage"></div><div class="rf-shot-caption"><span id="rf-shot-number"></span><div><p id="rf-shot-title"></p><p id="rf-shot-title-zh"></p></div><span id="rf-shot-status"></span></div><div class="rf-caption"><span id="rf-beat-number"></span><div><p id="rf-beat"></p><p id="rf-beat-zh"></p></div></div><div class="rf-controls"><button data-rf-action="proof">Play three-year preview</button><button data-rf-action="play" aria-pressed="false">Play the chronology</button><button data-rf-action="replay">Replay this year</button><button data-rf-action="prev">Previous year</button><button data-rf-action="next">Next year</button><button data-rf-action="language">中文 / English</button><button data-rf-action="motion" aria-pressed="${lowMotion}">Reduced motion</button><span id="rf-status" role="status" aria-live="polite"></span></div><div class="rf-scrub"><label for="rf-progress">Inspect this year <output id="rf-progress-label">0%</output></label><input id="rf-progress" type="range" min="0" max="1000" step="10" value="0"><p>Question → physical action / method → next question. Film timing and scenery are representative.</p></div><nav class="rf-chapters" aria-label="Publication-year windows">${data.chapters.map((c,i)=>`<button data-rf-chapter="${i}" aria-label="${esc(c.years+': '+c.title)}"><strong>${esc(c.years)}</strong><small>${esc(c.tag)}</small></button>`).join('')}</nav><div class="rf-story-note"><span class="rf-label">FOLLOWING WHAT THE VISIBLE PICTURE LEAVES OUT</span><p id="rf-method"></p><p id="rf-next-question"></p><p class="rf-small">All nineteen year treatments are available for review. This is layered illustrated animation with a finite set of drawn poses, not a fully produced anime film. Scenery and anonymous actors do not reenact Davis or a documented field trip; motion, counts and timing encode no measured result.</p></div><div class="rf-record"><article><span class="rf-label">THE DOCUMENTED QUESTION</span><h3 id="rf-branch"></h3><p id="rf-summary"></p><p class="rf-continuity" id="rf-continuity"></p><details><summary>Evidence and illustration boundaries</summary><p id="rf-visual"></p></details></article><aside><span class="rf-label">READ THE PRIMARY SOURCES</span><div id="rf-sources" class="rf-source-list"></div></aside></div><div class="rf-method"><p class="rf-label">HOW TO READ THE HISTORY</p><p>${esc(data.interpretation)}</p><details><summary>Personal account, seminar framing and a preprint branch</summary><div class="rf-context">${data.context.map(c=>`<article><span>${esc(c.kind)} · ${esc(c.date)}</span><h3>${esc(c.label)}</h3><p>${esc(c.text)}</p><a href="${esc(c.url)}" target="_blank" rel="noopener">Open the source ↗</a>${c.companion_url?` <a href="${esc(c.companion_url)}" target="_blank" rel="noopener">Later preprint version ↗</a>`:''}</article>`).join('')}</div></details><p class="rf-small">Team publications do not establish who originated every idea. Selected studies are not nineteen exclusive career phases or a complete current lab agenda. Evidence checked ${esc(data.as_of)}.</p></div><div class="rf-connection"><span class="rf-label">${esc(data.connection.label)}</span><h3>${esc(data.connection.question)}</h3><p lang="zh">${esc(data.connection.question_zh)}</p><p class="rf-small">${esc(data.connection.note)}</p></div></div>`;
    mount.querySelectorAll('[data-rf-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.rfAction;
      if(action==='proof'){pause();proof=true;replayHold=false;select(data.chapters.findIndex(c=>c.year===PROOF_YEARS[0]));showChapter();start();}
      if(action==='play'){proof=false;replayHold=false;if(playing)pause();else{if(elapsed>=duration){if(index===data.chapters.length-1)select(0);else elapsed=0;}start();}}
      if(action==='replay'){pause();replayHold=true;elapsed=0;beat=-1;render();start();}
      if(action==='prev'||action==='next'){pause();proof=false;select(clamp(index+(action==='prev'?-1:1),0,data.chapters.length-1));showChapter();}
      if(action==='language'){language=language==='en'?'zh':'en';beat=-1;question();render();}
      if(action==='motion'){lowMotion=!lowMotion;pause();render();sync();}
    }));
    mount.querySelectorAll('[data-rf-chapter]').forEach(b=>b.addEventListener('click',()=>{pause();proof=false;select(Number(b.dataset.rfChapter));showChapter();}));
    mount.querySelector('#rf-progress').addEventListener('input',e=>{pause();elapsed=Number(e.target.value)/1000*duration;render();});
  }
  function showChapter(){mount.querySelector('.rf-heading').scrollIntoView({block:'start',behavior:'instant'});}
  function question(){const c=current(),q=mount.querySelector('#rf-question'),z=mount.querySelector('#rf-question-zh');q.textContent=language==='en'?c.title:c.question_zh;q.lang=language;z.textContent=language==='en'?c.question_zh:c.title;z.lang=language==='en'?'zh':'en';mount.dataset.language=language;}
  function select(next,view=-1){
    index=next;card=view;elapsed=0;beat=-1;const c=current();director=directing(c);duration=director.shots.length===4?22000:Math.max(16000,c.duration_ms||18000);family=director.shots[0][0];
    mount.dataset.year=String(c.year);mount.querySelector('#rf-years').textContent=c.years;mount.querySelector('#rf-tag').innerHTML=`${esc(c.tag)} <span lang="zh">${esc(c.tag_zh)}</span>`;question();
    const choices=data.chapters[index].cards||[],picker=mount.querySelector('#rf-view-cards');picker.hidden=!choices.length;picker.innerHTML=choices.length?`<button data-rf-card="-1" aria-pressed="${card<0}">Year overview</button>${choices.map((c,i)=>`<button data-rf-card="${i}" aria-pressed="${card===i}">${esc(c.card_label||c.tag)}</button>`).join('')}`:'';picker.querySelectorAll('[data-rf-card]').forEach(b=>b.addEventListener('click',()=>{pause();const selected=Number(b.dataset.rfCard);select(index,selected);mount.querySelector(`[data-rf-card="${selected}"]`).focus({preventScroll:true});}));
    mount.querySelector('#rf-branch').textContent=c.branch;mount.querySelector('#rf-summary').textContent=c.summary;mount.querySelector('#rf-continuity').textContent=c.continuity;mount.querySelector('#rf-visual').textContent=director.boundary;mount.querySelector('#rf-sources').innerHTML=sources(c.papers);
    mount.querySelectorAll('[data-rf-chapter]').forEach(b=>{const active=Number(b.dataset.rfChapter)===index;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'step':'false');});
    const stage=mount.querySelector('#rf-stage');stage.innerHTML=`<div class="rf-cinema" role="img" aria-label="${esc(director.boundary)}">${director.shots.map((shot,i)=>buildShot(shot[0],i)).join('')}<span class="rf-world-year">${esc(c.years)}</span><span class="rf-transition-mark" aria-hidden="true"></span><div class="rf-artwork-status" hidden>Art layers are being prepared for this cinematic draft.</div></div>`;
    canvas=stage.querySelector('.rf-cinema');shotWorlds=[...canvas.querySelectorAll('.rf-shot-plane')];world=shotWorlds[0].querySelector('.rf-world');layers={};canvas.querySelectorAll('[data-rf-part]').forEach(n=>{layers[n.dataset.rfPart]=n;});
    const thisGeneration=++generation,required=[...canvas.querySelectorAll('[data-rf-required="true"]')];let missing=false;
    const check=()=>{if(thisGeneration!==generation)return;const ready=required.every(i=>i.complete&&i.naturalWidth>0);canvas.dataset.assets=ready?'ready':missing?'missing':'loading';canvas.querySelector('.rf-artwork-status').hidden=ready;};
    required.forEach(i=>{i.addEventListener('load',check,{once:true});i.addEventListener('error',()=>{missing=true;check();},{once:true});});
    canvas.querySelectorAll('[data-rf-required="false"]').forEach(i=>i.addEventListener('error',()=>i.parentElement.hidden=true,{once:true}));check();render();sync();
  }
  function style(id,values){const n=layers[activePrefix+id];if(n)Object.assign(n.style,values);}
  function shift(id,x=0,y=0,rotate=0){style(id,{transform:`translate(${x.toFixed(3)}%,${y.toFixed(3)}%) rotate(${rotate.toFixed(3)}deg)`});}
  function visibility(id,alpha){style(id,{opacity:String(clamp(alpha))});}
  function fieldFrame(t,shot){
    const close=ease(span(t,.23,.31));visibility('wide',1-close);visibility('field',close);visibility('river',close*.62);
    shift('river',t*1.05,Math.sin(t*11)*.26);
    const pose=gestureFrame(t,[0,.34,.42,.50,.59,.68,.77,.86]),w=.28,contact=[[.474,.964],[.484,.965],[.528,.965],[.538,.963],[.476,.982],[.472,.982],[.528,.984],[.522,.984]];
    // Eight connected drawings keep the forward boot on one bank point. The
    // persistent case/tray stays in the illustration during specimen handling.
    sheet('field-actor','sediment-specimen-handling',pose,.20-w*contact[pose][0],.93-w*(1672/941)*contact[pose][1],w,{columns:4,rows:2,aspect:1});visibility('field-actor',close);
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(1.8%, -1.2%) scale(1.045)':'translate(10%, -6%) scale(1.18)';
    canvas.dataset.materialState=close<.05?'fixed-mountain-drainage-context':['retrieve-a-stored-sediment-specimen','raise-the-specimen-from-the-case','lift-for-examination','inspect-the-sediment-vial','rotate-and-check-the-specimen','lower-the-specimen-toward-the-case','seat-the-specimen-in-the-case','release-the-returned-specimen'][pose];
  }
  function portFrame(t,shot){
    const arrive=ease(span(t,.02,.23)),depart=ease(span(t,.76,1));
    // The vessel stays on the water surface; its drawn deck receives the cargo.
    style('vessel',{left:`${(lerp(.59,.475,arrive)+depart*.28)*100}%`,top:`${(lerp(.435,.47,arrive)+depart*.105)*100}%`});
    shift('harbor',t*.32,Math.sin(t*8)*.16);
    style('wake',{left:`${(lerp(.42,.305,arrive)+depart*.28)*100}%`,top:`${(lerp(.505,.54,arrive)+depart*.105)*100}%`,opacity:String((1-arrive)*.55+depart*.70)});
    const lift=ease(span(t,.25,.43)),traverse=ease(span(t,.43,.60)),lower=ease(span(t,.61,.73));
    const x=lerp(.447,.625,traverse),y=.68-lift*.10+lower*.035;
    const onDeck=t>=.735;
    style('container',{left:`${(x-.053+(onDeck?depart*.28:0))*100}%`,top:`${(y+(onDeck?depart*.105:0))*100}%`});
    const hookY=onDeck?lerp(y-.0974,.375,ease(span(t,.75,.91))):y-.0974;
    style('hook',{left:`${(x-.051)*100}%`,top:`${hookY*100}%`});
    style('cable',{left:`${x*100}%`,top:'40.5%',height:`${Math.max(.01,hookY+.043-.405)*100}%`});
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(-2%, -4%) scale(1.11)':'scale(1)';
    canvas.dataset.materialState=t<.25?'cargo-arrives-at-the-shore':t<.735?'hoist-transfer-to-vessel':'manufactured-goods-leave-production-location';
  }
  function energyFrame(t,shot){
    const arrive=ease(span(t,.05,.33)),carry=ease(span(t,.47,.73)),lower=ease(span(t,.74,.84)),leave=ease(span(t,.86,1));
    const hx=.335+arrive*.105+carry*.155-leave*.21,hy=.705+arrive*.018-carry*.055+leave*.035;
    style('handler',{left:`${hx*100}%`,top:`${hy*100}%`});
    const picked=t>=.34,deposited=t>=.84;
    style('pallet',{left:`${(picked&&!deposited?hx+.101:deposited?.696:.541)*100}%`,top:`${(picked&&!deposited?hy+.115:deposited?.783:.838)*100}%`});
    style('weather',{left:`${(-.35+t*.90)*100}%`,opacity:String(current().scene==='system'? .68:.27)});
    const drought=current().year===2026&&current().scene==='system';
    const rotation=drought?(t<.40?390*t:t<.68?156+(t-.40)*65:174.2+(t-.68)*370):span(t,.34,1)*470;
    for(const [n,speed]of[[-1,1],[0,.83],[1,.91]])style(`rotor-${n}`,{transform:`rotate(${rotation*speed}deg)`});
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(-2%, -6%) scale(1.11)':'translate(1%, 1%) scale(1.025)';
    canvas.dataset.materialState=t<.34?'forks-approach-the-material-pallet':t<.84?'material-pallet-carried-on-low-forks':'pallet-deposited-and-vehicle-withdraws';
  }
  function gestureFrame(t,thresholds){let frame=0;for(let i=1;i<thresholds.length;i++)if(t>=thresholds[i])frame=i;return frame;}
  function sheet(id,key,pose,x,y,width,layout){
    const columns=layout?.columns||2,rows=layout?.rows||2,column=pose%columns,row=Math.floor(pose/columns),values={backgroundPosition:`${columns===1?0:column/(columns-1)*100}% ${rows===1?0:row/(rows-1)*100}%`,backgroundSize:`${columns*100}% ${rows*100}%`,left:`${x*100}%`,top:`${y*100}%`,width:`${width*100}%`};
    if(layout?.aspect)values.aspectRatio=String(layout.aspect);
    style(id,values);canvas.dataset.actorPose=key+':'+pose;
  }
  function labFrame(t,shot){
    const pose=t<.22?0:t<.47?1:t<.75?2:3,anchors=[.84,.84,.81,.89];
    // Register the forearm exit at the scene edge; each sample stays on or
    // above the painted bench rather than jumping to an arbitrary origin.
    const w=.32,x=.89-anchors[pose]*w,y=.98-.96*w*(1672/941);
    sheet('sample-hand','sediment-specimen',pose,x,y,w);
    shift('sample-hand',0,Math.sin(t*7)*.3);
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(-4%, -5%) scale(1.12)':'translate(1%, -1%) scale(1.045)';
    canvas.dataset.materialState=pose===0?'ancient-sediment-specimen-at-the-bench':pose===1?'specimen-lifted-for-inspection':pose===2?'record-comparison-context':'specimen-returned-to-tray';
  }
  function farmFrame(t,shot){
    const travel=ease(span(t,.04,.93)),w=lerp(.31,.105,travel),groundX=lerp(.64,.78,travel),groundY=lerp(.91,.65,travel);
    style('crop-truck',{left:`${(groundX-w*.59)*100}%`,top:`${(groundY-w*(1024/1536)*(1672/941)*.965)*100}%`,width:`${w*100}%`});
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(-1%, -2%) scale(1.055)':'scale(1)';
    canvas.dataset.materialState=travel<.4?'crop-shipment-leaves-the-production-landscape':'shipment-travels-toward-processing-and-consumption';
  }
  function cementFrame(t,shot,community=false,crew=true){
    const drive=ease(span(t,.02,.43)),departure=ease(span(t,.83,1)),w=community?.12:.185;
    const x=lerp(-.24,.41,drive)+departure*.40,roadX=x+w*.61,groundY=.738-.20*roadX;
    style('cement-truck',{left:`${x*100}%`,top:`${(groundY-w*.886)*100}%`,width:`${w*100}%`,transform:'rotate(5.5deg)'});
    if(!community&&crew){const pose=t<.49?0:t<.69?1:t<.86?2:3,w=.085,ankles=[[.50,.94],[.52,.92],[.62,.93],[.45,.90]];sheet('concrete-worker','concrete-lifecycle',pose,.59-w*ankles[pose][0],.905-w*(1672/941)*ankles[pose][1],w);visibility('concrete-worker',ease(span(t,.35,.43)));}
    if(community){style('atmosphere',{left:`${lerp(.21,.66,t)*100}%`,top:`${lerp(.05,.12,t)*100}%`,width:'36%',opacity:String(.44)});world.style.transform=shot===0?'scale(1)':'translate(-21%, 4%) scale(1.43)';}
    else world.style.transform=shot===0?'scale(1)':shot===1?'translate(-8%, -4%) scale(1.13)':'translate(-11%, -10%) scale(1.22)';
    canvas.dataset.materialState=community?'representative-community-and-atmospheric-context':t<.43?'cement-delivery-at-a-generic-production-site':t<.69?'concrete-placement-and-use':t<.86?'later-life-sample-examination':'concrete-sample-record-context';
  }
  function aiFrame(t,shot,room){
    const pose=shot===0?(t<.48?0:1):shot===1?(t<.70?2:3):3;
    const anchors=[.503,.428,.507,.456],w=.21,groundX=.30,groundY=.87;
    sheet('engineer','anonymous-engineering-review',pose,groundX-w*anchors[pose],groundY-w*(1672/941)*.930,w);
    world.style.transform=room?'translate(-4%, -1%) scale(1.08)':shot===0?'scale(1)':'translate(-3%, -1%) scale(1.065)';
    canvas.dataset.materialState=room?'representative-power-infrastructure-inspection-for-a-funded-plan':'candidate-site-review-no-computed-winner';
  }
  function shotBounds(){return director.shots.length===4?[0,.24,.49,.75,1]:[0,.30,.73,1];}
  function narrativePhase(i){return director.shots.length===4?(i===0?0:i===3?2:1):i;}
  function worldTime(i,t){const bounds=shotBounds(),kind=director.shots[i][0];let a=i,b=i;while(a>0&&director.shots[a-1][0]===kind)a--;while(b<director.shots.length-1&&director.shots[b+1][0]===kind)b++;return clamp((t-bounds[a])/(bounds[b+1]-bounds[a]));}
  function basinFrame(t,shot){
    const joined=ease(span(t,.29,.52));visibility('basin-separate',1-joined);visibility('basin-integrated',joined);visibility('basin-current',joined*.55);shift('basin-current',t*.40,Math.sin(t*8)*.13);
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(-2%, -1%) scale(1.10)':'scale(1)';
    canvas.dataset.materialState=joined<.1?'illustrative-separate-catchments':joined<.95?'illustrative-drainage-integration':'paired-state-connected-catchments-not-measured-topography';
  }
  function quarryFrame(t,shot,resource){
    const pose=t<.27?0:t<.50?1:t<.68?2:3,ground=[.51,.80],w=.21,anchors=[[253,505],[315,505],[317,502],[286,502]],h=w*(543/724)*(1672/941),x=ground[0]-w*anchors[pose][0]/724,y=ground[1]-h*anchors[pose][1]/543;
    sheet('excavator',resource?'qualitative-resource-extraction':'carbon-bearing-bulk-fuel',pose,x,y,w);
    const flowX=ground[0]-w*317/724,flowY=ground[1]-h*502/543;
    sheet('excavator-flow','falling-bulk-solids',2,flowX,flowY,w);visibility('excavator-flow',pose===2?.62:0);shift('excavator-flow',0,span(t,.50,.68)*3.5);
    const loading=ease(span(t,.63,.73)),departure=ease(span(t,.80,1)),tw=.21*(1-departure*.08),truckX=.50+departure*.12,truckGround=.84-departure*.035,truckY=truckGround-tw*(1024/1536)*(1672/941)*(957/1024);
    for(const id of ['haul-empty','haul-loaded'])style(id,{left:`${truckX*100}%`,top:`${truckY*100}%`,width:`${tw*100}%`});
    visibility('haul-empty',1-loading);visibility('haul-loaded',loading);
    if(resource){const reveal=ease(span(t,.13,.22));visibility('excavator',reveal);visibility('haul-empty',(1-loading)*reveal);visibility('haul-loaded',loading*reveal);}
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(-2%, -1%) scale(1.08)':'scale(1)';
    canvas.dataset.actorPose='excavator:'+pose;
    canvas.dataset.materialState=resource&&t<.13?'qualitative-geological-outcrop-no-reserve-tonnage':pose<2?'bulk-solids-dug-and-raised':pose===2?'bucket-cascade-enters-the-haul-bed':loading>.98?'loaded-haul-vehicle-leaves-the-loading-point':'truck-loading-completes';
  }
  function solarFrame(t,shot){
    const pose=t<.25?0:t<.48?1:t<.73?2:3,w=.32,anchors=[[.9253,.9434],[.9261,.9453],[.9250,.8828],[.9230,.8809]],h=w*(512/768)*(1672/941);
    sheet('tracker','qualitative-tracker-orientation',pose,.865-w*anchors[pose][0],.776-h*anchors[pose][1],w);
    world.style.transform=shot===0?'scale(1)':shot===1?'translate(-3%, -3%) scale(1.08)':'scale(1)';
    canvas.dataset.materialState='fixed-tilt-row-stationary-and-tracker-orientation-'+pose+'-no-yield-or-cost-ranking';
  }
  function recordsFrame(t,shot,kind){
    // The painted props actually change: closed folders open, sheets align,
    // and the daily-activity view ends with a turned binder page/calendar.
    // The blank pages encode no measurements, scores or completed AI results.
    const daily=kind==='activity-records',calendar=daily&&t>=.84,actionTime=daily?clamp(t/.80):t,order=[0,1,3,4,5,6,7],step=gestureFrame(actionTime,[0,.10,.25,.40,.51,.63,.76]),pose=calendar?3:order[step];
    const w=.48,h=w*(362/543)*(1672/941);
    // The one raised-cover pose with a clipped upper tip is not displayed.
    // The daily binder is a separate closing insert, not a second ghost hand.
    style('record-hands',{backgroundImage:`url('${ASSETS[calendar?'recordsHands':'recordsAlignment']}')`});
    sheet('record-hands',daily?'activity-record-handling':kind==='comparison-records'?'provisional-option-comparison':'source-definition-alignment',pose,.56-w*.50,.78-h*.58,w,calendar?{columns:2,rows:2,aspect:1.5}:{columns:4,rows:2,aspect:543/362});
    // A short settling motion brings the physical folders onto the tabletop;
    // all later poses remain in contact with the same work surface.
    const settle=1-ease(span(t,0,.16));
    shift('record-hands',settle*1.2,settle*3.2,settle*-.4);
    world.style.transform=lowMotion?'none':'translate(-1%, -2%) scale(1.045)';
    canvas.dataset.materialState=calendar?'daily-activity-binder-organized-not-direct-co2-measurement':['separate-source-folders-on-the-table','grip-the-folder-covers','open-source-folders-side-by-side','select-the-matching-record-sheets','draw-the-paired-sheets-forward','straighten-the-sheet-edges','hold-aligned-records-with-no-computed-values'][step];
  }
  function coolingFrame(t){
    const pose=gestureFrame(t,[0,.10,.23,.35,.50,.64,.77,.89]),foot=[[492,354],[469,354],[469,354],[450,354],[475.5,340],[453,340],[453,340],[452.5,340]],leftFoot=[321,295,299.5,287.5,305,279.5,280,286.5],w=(.596-.486)*543/(foot[pose][0]-leftFoot[pose]),h=w*(362/543)*(1672/941);
    // Register both support feet, compensating the modest drawing-scale shifts.
    // The integral operator/fixture keeps the hand attached during the turn.
    sheet('cooling-actor','illustrative-cooling-service-inspection',pose,.596-w*foot[pose][0]/543,.89-h*foot[pose][1]/362,w,{columns:4,rows:2,aspect:543/362});
    world.style.transform='translate(-2%, -2%) scale(1.06)';
    canvas.dataset.materialState=['grip-the-supported-inspection-lever','begin-the-lever-turn','continue-the-contact-preserving-turn','complete-the-lever-turn','release-and-lower-for-inspection','crouch-to-check-the-sight-window','rise-with-physical-notes','write-the-inspection-note'][pose];
  }
  function updateWorld(kind,t,shot){
    const daily=kind.startsWith('day-'),base=daily?kind.slice(4):kind;
    if(base==='records'||base==='activity-records'||base==='comparison-records')recordsFrame(t,shot,base);
    else if(base==='ai-cooling')coolingFrame(t);
    else if(base==='solar')solarFrame(t,shot);
    else if(base==='basin')basinFrame(t,shot);
    else if(base==='fuel'||base==='resource')quarryFrame(t,shot,base==='resource');
    else if(base==='water')fieldFrame(shot===2?.65+t*.35:t,shot);
    else if(base==='port')portFrame(t,shot);
    else if(base==='energy'||base==='power'){energyFrame(t,shot);if(base==='power'){world.style.transform=shot===0?'scale(1)':shot===1?'translate(-17%, -6%) scale(1.28)':'translate(-21%, -4%) scale(1.37)';canvas.dataset.materialState='representative-power-service-operation';}}
    else if(base==='lab')labFrame(t,shot);
    else if(base==='farm')farmFrame(t,shot);
    else if(base==='industry'){cementFrame(t,shot,false,false);canvas.dataset.materialState='representative-industrial-delivery-and-operation';}
    else if(base==='idle'){world.style.transform='translate(12%, 5%) scale(1.22)';canvas.dataset.materialState='illustrative-alternative-industrial-operation-stopped';}
    else if(base==='ai-site'||base==='ai-room'||base==='consumption'){aiFrame(t,shot,base!=='ai-site');if(base==='consumption')canvas.dataset.materialState='illustrative-powered-service-and-final-consumption';}
    else cementFrame(t,shot,base==='community');
    style('day-light',{opacity:daily?String(shot===0?.14*(1-t):shot===1?.02:span(t,.05,.85)*.32):'0'});
    if(daily)canvas.dataset.observationInterval=['illustrative-morning','illustrative-daytime','illustrative-evening'][shot];else delete canvas.dataset.observationInterval;
  }
  function render(){
    const t=clamp(elapsed/duration),c=current(),bounds=shotBounds(),shot=Math.min(director.shots.length-1,bounds.findIndex((v,i)=>i<bounds.length-1&&t>=v&&t<bounds[i+1])<0?director.shots.length-1:bounds.findIndex((v,i)=>i<bounds.length-1&&t>=v&&t<bounds[i+1]));
    shotWorlds.forEach((plane,i)=>{
      activePrefix=`s${i}-`;world=plane.querySelector('.rf-world');
      const u=lowMotion?[.16,.54,.91][narrativePhase(i)]:worldTime(i,t);
      updateWorld(director.shots[i][0],u,i);
      if(lowMotion)world.style.transform='none';
      // Consecutive views of one world share an action phase and use a camera
      // cut, not a dissolve of two differently framed copies of the actor.
      const sameBefore=i>0&&director.shots[i-1][0]===director.shots[i][0],sameAfter=i<director.shots.length-1&&director.shots[i+1][0]===director.shots[i][0];
      const entrance=i===0?1:sameBefore?(t>=bounds[i]?1:0):ease(span(t,bounds[i]-.017,bounds[i]+.017)),exit=i===director.shots.length-1?1:sameAfter?(t<bounds[i+1]?1:0):1-ease(span(t,bounds[i+1]-.017,bounds[i+1]+.017)),alpha=entrance*exit;
      plane.style.opacity=String(alpha);plane.style.zIndex=String(i+1);plane.setAttribute('aria-hidden',i!==shot?'true':'false');
    });
    activePrefix=`s${shot}-`;world=shotWorlds[shot].querySelector('.rf-world');family=director.shots[shot][0];
    // Metadata is taken from the actual active scene, not the last invisible layer.
    delete canvas.dataset.actorPose;
    updateWorld(family,lowMotion?[.16,.54,.91][narrativePhase(shot)]:worldTime(shot,t),shot);
    if(lowMotion)world.style.transform='none';
    canvas.dataset.family=family;canvas.dataset.treatment='review-draft';
    const cut=Math.max(0,...bounds.slice(1,-1).map(x=>1-Math.abs(t-x)/.024));canvas.querySelector('.rf-transition-mark').style.opacity=String(lowMotion?0:cut*.38);
    canvas.dataset.progress=t.toFixed(5);canvas.dataset.chapter=c.id;canvas.dataset.shot=String(shot+1);canvas.dataset.reducedMotion=String(lowMotion);
    if(beat!==shot){beat=shot;const story=director.shots[shot],phase=narrativePhase(shot);mount.querySelector('#rf-shot-number').textContent=String(shot+1).padStart(2,'0');mount.querySelector('#rf-shot-title').textContent=story[language==='en'?1:2];mount.querySelector('#rf-shot-title-zh').textContent=story[language==='en'?2:1];mount.querySelector('#rf-shot-status').textContent=proof?'Three-year preview':director.status;mount.querySelector('#rf-beat-number').textContent=phase===0?'QUESTION':phase===1?'METHOD':'NEXT';mount.querySelector('#rf-beat').textContent=c.beats[phase][language==='en'?0:1];mount.querySelector('#rf-beat-zh').textContent=c.beats[phase][language==='en'?1:0];mount.querySelector('#rf-method').textContent=director.method;mount.querySelector('#rf-next-question').textContent=director.next;
      for(const id of ['rf-shot-title','rf-beat'])mount.querySelector('#'+id).lang=language;
      for(const id of ['rf-shot-title-zh','rf-beat-zh'])mount.querySelector('#'+id).lang=language==='en'?'zh':'en';
      mount.querySelector('#rf-method').lang='en';mount.querySelector('#rf-next-question').lang='en';}
    mount.querySelector('#rf-progress').value=String(Math.round(t*1000));mount.querySelector('#rf-progress-label').textContent=`${Math.round(t*100)}%`;mount.querySelector('#rf-progress').setAttribute('aria-valuetext',`${Math.round(t*100)} percent, ${c.years}, shot ${shot+1}: ${director.shots[shot][language==='en'?1:2]}`);
  }
  function sync(){
    const play=mount.querySelector('[data-rf-action="play"]');play.textContent=playing?'Pause playback':'Play the chronology';play.setAttribute('aria-pressed',String(playing));
    const motion=mount.querySelector('[data-rf-action="motion"]');motion.setAttribute('aria-pressed',String(lowMotion));
    mount.querySelector('[data-rf-action="prev"]').disabled=index===0;mount.querySelector('[data-rf-action="next"]').disabled=index===data.chapters.length-1;
    mount.querySelector('#rf-status').textContent=`${proof?'Three-year preview':'Year window'} · ${current().years} · ${playing?'Playing':'Paused'}`;mount.dataset.playing=String(playing);
  }
  function pause(){playing=false;last=0;if(raf)cancelAnimationFrame(raf);raf=0;if(data)sync();}
  function start(){if(playing)return;playing=true;last=0;sync();raf=requestAnimationFrame(tick);}
  function tick(now){
    if(!playing)return;if(last)elapsed=Math.min(duration,elapsed+Math.min(100,now-last));last=now;render();
    if(elapsed>=duration){if(replayHold){pause();return;}if(proof){const p=PROOF_YEARS.indexOf(current().year);if(p<0||p===PROOF_YEARS.length-1){pause();return;}select(data.chapters.findIndex(c=>c.year===PROOF_YEARS[p+1]));}else{if(index===data.chapters.length-1){pause();return;}select(index+1);}last=now;}
    raf=requestAnimationFrame(tick);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('pagehide',pause);
  preference.addEventListener('change',()=>{lowMotion=preference.matches;pause();if(data){render();sync();}});
  fetch('data/davis-evolution.json').then(r=>{if(!r.ok)throw Error('Timeline unavailable');return r.json();}).then(d=>{data=d;if(!Array.isArray(d.chapters)||!d.chapters.length)throw Error('Timeline incomplete');shell();select(0);mount.dataset.ready='true';mount.dataset.visualStatus='cinematic-draft';}).catch(()=>{mount.dataset.ready='error';mount.innerHTML='<p class="rf-load-error">The sourced timeline could not load. Reload to try again.</p>';});
})();
