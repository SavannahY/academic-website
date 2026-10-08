/* Educational choreography. No rates, energy totals or measured material flows are inferred here. */
'use strict';
const q = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, title) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)}</a>`;
const references = {
  ulvac: ['https://www.ulvac.co.jp/en/research_development/technical_journal/83E/TJ83E_6.pdf', 'ULVAC process sequence'],
  arnold: ['https://www.arnoldmagnetics.com/products/neodymium-iron-boron-magnets/', 'Arnold magnet materials'],
  mp: ['https://www.mpmaterials.com/mountain-pass', 'Mountain Pass operations'],
  lynas: ['https://lynasrareearths.com/about-us/kalgoorlie/', 'Lynas upstream processing'],
  afg: ['https://www.hosokawa-alpine.com/powder-particle-processing/technologies/grinding-and-classifying/jet-mills/afg/', 'Hosokawa jet milling'],
  pulse: ['https://www.magnet-physik.de/wp-content/uploads/2023/02/18577421-IM-X-e-3138.pdf', 'MAGNET-PHYSIK pulse equipment'],
  magnetizing: ['https://www.arnoldmagnetics.com/permanent-magnets/capabilities/magnetizing/', 'Arnold magnetizing explanation'],
  gbd: ['https://doi.org/10.1016/j.actamat.2012.12.018', 'Published diffusion study'],
  boron: ['https://www.nippondenko.co.jp/ourbusiness/functionalmaterials/boron/', 'Nippon Denko ferroboron']
};
references.consarc = ['https://inductothermgroup.com/products/vacuum-induction-melting-strip-casting-furnaces/', 'Consarc melting & cooled-wheel casting'];
references.ulvac2026 = ['https://ir.ulvac.co.jp/en/ir/newsrelease/PressRelease-2026040702/main/0/link/EN_Presentation_Material_for_ULVAC_IR_Seminar_2026.pdf', 'ULVAC 2026 process diagrams'];
references.arnoldProcess = ['https://www.arnoldmagnetics.com/resources/magnet-manufacturing-process/', 'Arnold compact sintering & tempering'];
references.liquidPhase = ['https://www.arnoldmagnetics.com/wp-content/uploads/2017/10/Energy-Critical-Magnetic-Material-Manufacturing-Processes-Yin-and-Constantinides-PowderMet-2013-ppr.pdf', 'Producer technical paper: liquid-phase sintering'];
const steps = [
  {title:'Extract the mineral', group:'01 / Upstream', sheet:'upstream', cell:0, input:'Ore in a geological deposit', output:'Mined ore', explanation:'Extraction starts with a deposit, not a bag of pure neodymium. Deposit chemistry determines the next route.', conditions:'Representative hard-rock mine. Ion-adsorption clay extraction uses a different route.', refs:['mp'], function:'Mining equipment', phase:'Excavate and move ore'},
  {title:'Upgrade the ore', group:'01 / Upstream', sheet:'upstream', cell:1, input:'Ore + water + process reagents', output:'Mineral concentrate + tailings', explanation:'Crushing and concentration separate useful mineral from much of the surrounding rock.', conditions:'A hard-rock route; the recovery, reagents and tailings depend on mineralogy. No universal yield is assumed.', refs:['mp'], function:'Crushers and concentration equipment', phase:'Reduce size; separate minerals'},
  {title:'Separate rare earths', group:'02 / Chemical processing', sheet:'upstream', cell:2, input:'Chemically treated mixed rare-earth stream', output:'Separated products, including NdPr', explanation:'Chemical treatment prepares a mixed stream for separation. Nd and Pr can remain together as a commercial product.', conditions:'Mixer-settlers represent one separation technology. Acid/alkali treatment, precipitation and wastewater handling are additional operations.', refs:['mp','lynas'], function:'Leaching and solvent-extraction systems', phase:'Separate a mixed chemical stream'},
  {title:'Make metal feedstock', group:'02 / Chemical processing', sheet:'upstream', cell:3, input:'Rare-earth oxide or another conversion feed', output:'Metal or master alloy', explanation:'The purchased form matters: NdPr metal, Dy–Fe alloy and ferroboron are different products with different assays.', conditions:'Illustrative rare-earth electrolysis/reduction cell; not every feedstock uses the same route. Ferroboron has its own upstream production.', refs:['boron','arnold'], function:'Metal conversion equipment', phase:'Convert chemical feed to metallic feed'},
  {title:'Melt & strip cast', group:'03 / Magnet manufacturing', sheet:'upstream', cell:4, input:'Weighed NdPr + Fe + FeB + selected additions', output:'Rapidly cooled alloy flakes', explanation:'The furnace combines a specified composition; a cooled roll forms thin alloy ribbons.', conditions:'Cutaway view. Molten alloy contacts the roll rim. Cooling history and oxygen control affect the resulting microstructure.', oems:['ulvac-magcaster600'], refs:['ulvac'], phase:'Melt → cooled roll → alloy flakes'},
  {title:'Hydrogen decrepitation', group:'03 / Magnet manufacturing', sheet:'upstream', cell:5, input:'Alloy flakes + controlled hydrogen', output:'Brittle coarse alloy powder', explanation:'Hydrogen helps the alloy break down, preparing it for fine milling.', conditions:'Open door shows loading only. Processing occurs in a sealed, controlled chamber; degassing is part of the route.', oems:['ulvac-fhh-hydrogen','bqd-hd600gc'], refs:[], phase:'Sealed treatment and degassing'},
  {title:'Jet mill the powder', group:'03 / Magnet manufacturing', sheet:'factory', cell:0, input:'Coarse alloy powder + process gas', output:'Fine powder with controlled size distribution', explanation:'Gas jets cause particle collisions; classification controls which particle sizes leave the mill.', conditions:'No grinding blades are implied. The cyclone collects product; it is not the grinding chamber. Fine reactive powder requires atmosphere control.', oems:['hosokawa-afgr','netzsch-mjet'], refs:['afg'], phase:'Gas jets → collisions → classification'},
  {title:'Align & press', group:'03 / Magnet manufacturing', sheet:'factory', cell:1, input:'Fine anisotropic alloy powder', output:'Aligned, compacted green body', explanation:'A magnetic field orients the powder while pressing gives it a shape.', conditions:'Arrows indicate powder alignment, not final working magnetization. Field, pressure and atmosphere require product-specific settings.', oems:['bqd-des450','ndk-rip'], refs:[], field:true, phase:'Orient grains; compact the powder'},
  {title:'Sinter & age', group:'03 / Magnet manufacturing', sheet:'factory', cell:2, input:'Pressed green body', output:'Dense magnet material', explanation:'Controlled thermal treatment densifies the body and develops the grain-boundary structure.', conditions:'Open furnace shows loading/cutaway only. Heat treatment operates in a sealed vacuum or controlled atmosphere; no actual temperature program is simulated.', oems:['ulvac-fsc','ulvac-fhh317'], refs:[], phase:'Controlled densification and heat treatment'},
  {title:'Machine the shape', group:'03 / Magnet manufacturing', sheet:'factory', cell:3, input:'Sintered magnet block', output:'Dimensioned pieces + machining scrap', explanation:'Grinding or cutting produces the required dimensions and tolerances.', conditions:'Geometry, material removal and scrap recovery are product-specific. Illustrated equipment does not establish a factory yield.', oems:['daxing-md7640'], refs:[], phase:'Cut, grind and check dimensions'},
  {title:'Diffuse, when needed', group:'03 / Optional route', sheet:'factory', cell:2, input:'Shaped magnet + selected Dy/Tb diffusion source', output:'Magnet with modified grain boundaries', explanation:'A diffusion treatment can concentrate heavy rare earths near grain boundaries to improve coercivity.', conditions:'Optional product-dependent operation. Generic thermal equipment is illustrated; this is not a named Magrise reconstruction or a universal Dy/Tb recipe.', refs:['gbd','ulvac'], function:'Grain-boundary diffusion furnace', phase:'Optional surface source and heat treatment'},
  {title:'Protect the surface', group:'03 / Magnet manufacturing', sheet:'factory', cell:4, input:'Dimensioned magnet + coating materials', output:'Coated magnet component', explanation:'A coating protects the reactive alloy; the required coating depends on its service environment.', conditions:'Plating tanks represent one route. Surface preparation, bath chemistry, rinsing and waste treatment are additional controls.', oems:['fengfan-4650'], refs:['arnold'], phase:'Prepare surface; apply protection'},
  {title:'Magnetize the part', group:'04 / Functional magnet', sheet:'factory', cell:5, input:'Unmagnetized part', output:'Magnetized part with specified poles', explanation:'The manufactured part enters a fixture. A strong field establishes magnetization; the part remains magnetized after the field switches off.', conditions:'Direction markers represent magnetization along an already established texture axis—not material flow or physical rotation of powder grains. The brief illustrative pulse is not an actual pulse-duration specification.', oems:['magphys-u2800','maginst-3000-1'], refs:['pulse','magnetizing'], field:true, phase:'A brief pulse establishes magnetization'},
  {title:'Inspect & qualify', group:'04 / Customer acceptance', input:'A candidate magnet component', output:'Accepted part, rework or rejection', explanation:'Material properties and finished-part performance are checked against an agreed specification. Customer acceptance is a separate constraint.', conditions:'B–H characterization, dimensions, coating and assembly tests answer different questions. Qualification is not guaranteed by an N-grade alone.', oems:['magphys-permagraph-c'], refs:['arnold'], diagram:'Br · Hcj · (BH)max', subtitle:'Measure properties → verify the part → customer acceptance', phase:'Evidence before accepted delivery'},
  {title:'Put it to work', group:'05 / Application', input:'Qualified magnets + assembly components', output:'A motor, generator, actuator or other product', explanation:'The same element balance can support very different products. Shape, temperature, field exposure and accepted suppliers determine usability.', conditions:'Explore application-specific capability priorities below. A tonne of oxide cannot directly replace a tonne of qualified magnets.', refs:['arnold'], diagram:'Material → part → motion', subtitle:'EV traction · PM wind · robotics · HDD actuators', phase:'A qualified component reaches an application'}
];
const processNamesChinese = ['采矿','选矿','稀土分离','制备金属原料','熔炼与甩带','氢破碎','气流磨制粉','磁场取向与压制','烧结与时效','机加工','晶界扩散（可选）','表面防护','充磁','检测与客户认证','应用与装配'];
steps[4].refs.push('consarc','ulvac2026');
steps[8].refs.push('ulvac2026','arnoldProcess','liquidPhase');
steps[8].explanation='Previously pressed bodies densify and shrink during liquid-phase-assisted sintering. Cooling and a separate aging or tempering treatment develop the required microstructure.';
steps[8].conditions='The animation is a loading view and explanatory cutaway. Actual treatment uses a sealed vacuum or controlled atmosphere. Liquid phases assist sintering while the bulk compact retains its shape; it is not poured into alloy flakes. Furnace arrangements and the placement of aging vary by route.';
let equipment = null, routeData = null, current = 0, playing = false, elapsed = 0, lastTick = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reduced.matches;
function setMotionPaused(value) {
  motionPaused = value;
  document.body.classList.toggle('motion-paused', value);
  q('#all-motion-toggle').textContent = value ? 'Resume all motion' : 'Pause all motion';
  q('#all-motion-toggle').setAttribute('aria-pressed', String(value));
  if(value) setPlaying(false);
}
const duration = 12000;
let singleCycle = false;
const parallelNotes = {
  0:'Upstream extraction is distinct from a magnet factory receiving purchased feedstocks. The factory need not operate its own mine or separation plant.',
  3:'Separate suppliers can prepare NdPr alloy, iron, ferroboron and grade-dependent additions in parallel. Their specified feedstocks converge at the alloy charge.',
  4:'Receiving and checking different feedstocks can happen in parallel; the charge is weighed to one specified formulation before alloying.',
  6:'Different batches can occupy different machines at once. Each batch still requires its own alloy preparation and decrepitation before fine milling.',
  8:'Batch A may be in thermal processing while batch B is pressed and batch C is milled. This is concurrency between batches, not a shortcut in one batch’s process order.',
  10:'Grain-boundary diffusion is an optional grade-dependent branch. A qualified route may bypass it; it is not mandatory for every NdFeB magnet.'
};
function renderOem(step) {
  const entries = (step.oems || []).map(id => equipment?.equipment.find(e => e.id === id)).filter(Boolean);
  if (!entries.length) {
    q('#oem-evidence').innerHTML = `<h3>${esc(step.function || 'Representative process')}</h3><p>A generic reconstruction. No specific manufacturer or installed plant is assigned to this artwork.</p>`;
    return;
  }
  q('#oem-evidence').innerHTML = entries.map(e => {
    const maker = equipment.manufacturers.find(m => m.id === e.manufacturerId);
    const sourceIds = [...new Set([...(e.sourceIds || []), ...(maker?.manufacturingSites || []).flatMap(p => p.sourceIds || [])])];
    const sources = sourceIds.map(id => equipment.sources.find(s => s.id === id)).filter(Boolean);
    const site = (maker?.manufacturingSites || []).map(p => `${p.city}, ${p.country}: ${p.evidenceScope}`).join(' ');
    return `<h3>${esc(e.model || e.name)}</h3><p><strong>${esc(maker?.name)} · ${esc(maker?.country)}</strong></p><p>${esc(e.relevance)}</p><details class="evidence-drawer"><summary>Factory location & evidence</summary><p>${esc(site || 'A manufacturing location for this equipment model has not been established.')}</p><p>${esc(e.limitations)}</p>${sources.map(s => link(s.url,s.title)).join('')}</details><p class="energy-note"><strong>Electricity</strong><br>${esc(e.powerEvidence?.note || 'Actual plant kWh and kWh/kg are not established by the reviewed source.')}<br>Measured plant consumption: ${e.powerEvidence?.measuredPlantKwh == null ? 'not reported' : esc(e.powerEvidence.measuredPlantKwh)}</p>`;
  }).join('');
}
function renderPhase() {
  const phase = elapsed < duration * .22 ? 'input' : elapsed < duration * .77 ? 'running' : 'output';
  const step = steps[current];
  q('#machine-stage').className = `machine-stage ${phase}`;
  const motionState = window.ProcessMotion?.update(elapsed, duration);
  q('#machine-phase').textContent = motionState?.caption || (phase === 'input' ? `Input · ${step.input}` : phase === 'running' ? step.phase : `Output · ${step.output}`);
  q('#cycle-progress').value = String(Math.round(Math.min(elapsed/duration,1)*1000));
  q('#cycle-progress-label').textContent = `${Math.round(Math.min(elapsed/duration,1)*100)}%`;
  document.body.classList.toggle('process-paused', !playing);
}
function renderStep(index) {
  current = (index + steps.length) % steps.length;
  elapsed = 0;
  const step = steps[current];
  q('#process-title').textContent = step.title;
  q('#process-chinese').textContent = processNamesChinese[current];
  q('#stage-group').textContent = step.group;
  q('#tour-position').textContent = `${current + 1} / ${steps.length} · ${playing ? 'Playing' : 'Paused'}`;
  q('#process-input').textContent = step.input;
  q('#process-output').textContent = step.output;
  q('#process-explanation').textContent = step.explanation;
  q('#process-conditions').textContent = step.conditions;
  q('#process-parallel-note').textContent = parallelNotes[current] || '';
  q('#process-parallel-note').hidden = !parallelNotes[current];
  const art = q('#machine-art');
  art.setAttribute('aria-label', step.sheet ? `Representative ${step.title.toLowerCase()} machinery; AI-generated illustration` : `${step.diagram}: ${step.subtitle}`);
  art.style.backgroundImage = 'none';
  window.ProcessMotion?.mount(art, current);
  q('#process-sources').innerHTML = (step.refs || []).map(key => link(...references[key])).join('');
  document.querySelectorAll('[data-process]').forEach(button => {
    const active = Number(button.dataset.process) === current;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
  renderOem(step); renderPhase();
}
function setPlaying(value) {
  if(value && elapsed >= duration) elapsed = 0;
  playing = value; lastTick = performance.now();
  q('#tour-play').textContent = playing ? 'Pause the sequence' : 'Play the sequence';
  q('#tour-play').setAttribute('aria-pressed', String(playing));
  q('#tour-position').textContent = `${current + 1} / ${steps.length} · ${playing ? 'Playing' : 'Paused'}`;
  document.body.classList.toggle('process-paused', !playing);
}
q('#process-steps').innerHTML = steps.map((s,i) => `<button data-process="${i}" aria-pressed="${i === 0}"><small>${String(i+1).padStart(2,'0')}</small><span class="process-name">${esc(s.title)}<span class="process-name-chinese" lang="zh">${esc(processNamesChinese[i])}</span></span></button>`).join('');
q('#process-steps').addEventListener('click', event => {const button = event.target.closest('[data-process]'); if (button) {setPlaying(false);renderStep(Number(button.dataset.process));}});
q('#tour-play').addEventListener('click', () => {singleCycle=false;if(!playing && motionPaused)setMotionPaused(false);setPlaying(!playing);});
q('#tour-replay').addEventListener('click',()=>{singleCycle=true;elapsed=0;if(motionPaused)setMotionPaused(false);setPlaying(true);renderPhase();});
q('#cycle-progress').addEventListener('input',event=>{setPlaying(false);elapsed=Number(event.target.value)/1000*duration;renderPhase();});
q('#all-motion-toggle').addEventListener('click',()=>setMotionPaused(!motionPaused));
q('#tour-prev').addEventListener('click', () => {setPlaying(false);renderStep(current-1);});
q('#tour-next').addEventListener('click', () => {setPlaying(false);renderStep(current+1);});
function tick(now) {
  if (playing && !document.hidden) {elapsed += Math.min(now-lastTick,100); if (elapsed >= duration) {elapsed=duration;if(singleCycle || current === steps.length-1) setPlaying(false); else renderStep(current+1);}renderPhase();}
  lastTick = now; requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
reduced.addEventListener('change', () => {if(reduced.matches)setMotionPaused(true);});

function renderRoute(id) {
  document.querySelectorAll('[data-route]').forEach(b => b.classList.toggle('active',b.dataset.route === id));
  const stops = id === 'mp' ? [
    ['Mountain Pass','California · MP Materials','Ore → concentrate → NdPr oxide'],
    ['Independence','Fort Worth, Texas · MP Materials','Metal → alloy → magnets']
  ] : [
    ['Mt Weld','Western Australia · Lynas','Ore → mineral concentrate'],
    ['Kalgoorlie','Western Australia · Lynas','Mixed rare-earth carbonate'],
    ['Malaysia','Lynas separation facility','Separated rare-earth products'],
    ['U.S. industry','Aggregate market connection','Specific customers unassigned']
  ];
  const products = id === 'mp' ? ['NdPr feed'] : ['Concentrate','Mixed carbonate','Product unspecified'];
  q('#route-animation').innerHTML = stops.map((s,i) => `<div class="route-stop"><strong>${esc(s[0])}</strong><small>${esc(s[1])}</small><p>${esc(s[2])}</p></div>${i < stops.length-1 ? `<div class="route-link" aria-hidden="true"><i></i><span>${esc(products[i])}</span></div>` : ''}`).join('');
  const ids = id === 'mp' ? ['mp-independence'] : ['weld-kalgoorlie','kalgoorlie-malaysia','lynas-us-market'];
  const routes = (routeData?.routes || []).filter(r => ids.includes(r.id));
  const sources = [...new Set(routes.flatMap(r => r.sources))].map(id => routeData.sources.find(s => s.id === id)).filter(Boolean);
  q('#route-evidence').innerHTML = `<p>${id === 'mp' ? 'MP documents Mountain Pass feed for the named Fort Worth facility. This diagram does not assign shipment tonnage or an onward customer delivery.' : 'The Australian and Malaysian processing links are documented. The final U.S. connection is company-level evidence: it is not a traced NdPr, Dy or Tb shipment to a named customer.'}</p><p>Equal-width links show relationships, not market shares. Shipping mode is unspecified.</p>${sources.map(s=>link(s.url,s.title)).join('')}`;
}
document.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click',()=>renderRoute(b.dataset.route)));
const sectors = {
  ev:{title:'A motor that survives its duty cycle',focus:[2,3,4],need:'Compact traction motors can need high-coercivity magnets to resist heat and opposing fields. The required chemistry depends on the motor and accepted grade.',priority:'Connect separated material to metal/alloy, controlled magnet processing and an automotive-qualified component. An unqualified new supplier may not replace an existing one immediately.',alternative:'Induction and electrically excited designs can avoid rare-earth rotor magnets. Lower-heavy-rare-earth formulations and diffusion are conditional design/process options.'},
  wind:{title:'Start with the generator design',focus:[0,2,4],need:'Permanent-magnet generators need magnets; other generator designs do not. Magnet intensity changes substantially between direct-drive and geared designs.',priority:'Match NdPr supply and large-component manufacturing/qualification to the selected generator. Do not apply one magnet-intensity number to the entire U.S. wind fleet.',alternative:'Compare accepted generator alternatives, material intensity, weight, efficiency and service requirements before ranking an investment.'},
  robots:{title:'Precision motion in a small package',focus:[2,3,4],need:'Some servo motors and actuators use NdFeB for compact, responsive motion. Robotics is not a single magnet grade or a separately measured demand series here.',priority:'Investigate powder control, geometry, coating, magnetization pattern and supplier acceptance for a specific motor family, alongside material availability.',alternative:'Different actuator/motor designs and qualified material choices may change the required chemistry. Temperature and demagnetization resistance matter alongside energy density.'},
  hdd:{title:'The actuator, not the processor',focus:[3,4],need:'HDD voice-coil actuators are a direct magnet use. CPU/GPU silicon and copper/aluminum interconnects do not imply the same NdFeB dependency.',priority:'Distinguish storage-component suppliers from an entire data-center bill of materials. Precision assembly and component qualification connect magnet supply to actual HDD deliveries.',alternative:'SSD storage uses a different component architecture. Fans and cooling pumps depend on motor design; liquid cooling does not prove either universal need or zero need for rare-earth magnets.'}
};
function renderSector(id) {
  const s = sectors[id];
  document.querySelectorAll('[data-sector]').forEach(b=>b.classList.toggle('active',b.dataset.sector===id));
  q('#capability-chain').innerHTML = ['Mine & separate','Make metal / master alloy','Control powder & thermal processing','Shape, coat & magnetize','Qualify the customer component'].map((label,i)=>`<div class="${s.focus.includes(i)?'focus':''}"><b>${String(i+1).padStart(2,'0')}</b>${label}${s.focus.includes(i)?'<small>Investigate</small>':''}</div>`).join('');
  q('#sector-detail').innerHTML = `<h3>${esc(s.title)}</h3><p>${esc(s.need)}</p><p><strong>Capability to investigate.</strong> ${esc(s.priority)}</p><p><strong>Design alternatives.</strong> ${esc(s.alternative)}</p>`;
}
document.querySelectorAll('[data-sector]').forEach(b=>b.addEventListener('click',()=>renderSector(b.dataset.sector)));
let diverse=false, independent=false, buffer=false, bufferRemaining=0, bufferElapsed=0, bufferLastTick=0, bufferTimer=null;
function renderResearch() {
  q('#bottleneck-scene').className = `bottleneck-scene${diverse?' diverse':''}${independent?' independent-open':''}${buffer?' buffered':''}`;
  q('#diversity-toggle').setAttribute('aria-pressed',String(diverse));
  q('#processor-toggle').setAttribute('aria-pressed',String(independent));
  q('#buffer-toggle').setAttribute('aria-pressed',String(buffer));
  q('#buffer-toggle').textContent = buffer ? `Buffer: ${bufferRemaining} / 4 illustrative units · reset` : 'Use a finite buffer';
  q('#bottleneck-scene').querySelectorAll('.buffer-stock i').forEach((item,i)=>item.classList.toggle('spent',i>=bufferRemaining));
  let title, text;
  if(independent) {title='An alternative passage can help—if it is ready.';text='The scene assumes usable, qualified independent capacity already exists. A research model must test construction, ramp and customer acceptance against the decision date, shock date and delivery deadline.';}
  else if(buffer && bufferRemaining>0) {title='A stock buys time, then runs down.';text='The illustrated stock is finite and does not replenish automatically. These four tiles and their animation time are explanatory units, not tonnes or days of market coverage.';}
  else if(buffer) {title='The illustrative stock is exhausted.';text='With no usable replenishment path, inventory cannot sustain delivery indefinitely. Reset starts a new illustrative preparedness case; it does not represent automatic replenishment.';}
  else if(diverse) {title='More origins still feed the same disrupted passage.';text='Total mining capacity is held fixed in this illustration. The outcome follows from the assumed shared processor; the scientific question is when that constraint binds and when a feasible alternative changes it.';}
  else {title='Find the condition that prevents accepted delivery.';text='This is a qualitative topology illustration. Davis’s trade assessment allows manufacturing to relocate more readily than mineral reserves; our next question is when that assumption works for a specified NdFeB product and deadline.';}
  q('#research-finding-title').textContent=title;q('#research-finding-text').textContent=text;
}
q('#diversity-toggle').addEventListener('click',()=>{diverse=!diverse;renderResearch();});
q('#processor-toggle').addEventListener('click',()=>{independent=!independent;renderResearch();});
q('#buffer-toggle').addEventListener('click',()=>{
  clearInterval(bufferTimer);buffer=true;bufferRemaining=4;bufferElapsed=0;bufferLastTick=performance.now();renderResearch();
  bufferTimer=setInterval(()=>{const now=performance.now();if(!motionPaused&&!document.hidden)bufferElapsed+=Math.min(now-bufferLastTick,500);bufferLastTick=now;bufferRemaining=Math.max(0,4-Math.floor(bufferElapsed/2500));renderResearch();if(!bufferRemaining)clearInterval(bufferTimer);},250);
});
renderStep(0);renderRoute('mp');renderSector('ev');renderResearch();setMotionPaused(motionPaused);
Promise.all([fetch('data/equipment-evidence.json').then(r=>{if(!r.ok)throw Error('Equipment evidence unavailable');return r.json();}),fetch('data/mine-routes.json').then(r=>{if(!r.ok)throw Error('Route evidence unavailable');return r.json();})]).then(([e,r])=>{equipment=e;routeData=r;renderOem(steps[current]);renderRoute(q('[data-route].active').dataset.route);}).catch(error=>{q('#oem-evidence').innerHTML=`<p>${esc(error.message)}. Source-linked overview remains available; reload to retry.</p>`;});
