/* Source-backed ingredient paths. This module mounts only inside #supply-paths. */
(() => {
  'use strict';
  const mount = document.getElementById('supply-paths');
  if (!mount) return;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state = { ingredient: 'All', path: null, detail: null, expanded: false };
  let data, nodeById, linkById, sourceById;
    const match = tags => state.ingredient === 'All' || (state.ingredient === 'Nd' || state.ingredient === 'Pr' ? tags.includes('NdPr') || tags.includes(state.ingredient) : tags.includes(state.ingredient));
  const kindLabel = {reported:'Reported operating relationship',agreement:'Agreement / proposed connection',pilot:'Pilot / demonstration / qualification',aggregate:'Regional or national aggregate',gap:'Evidence gap',capability:'Commercial capability relationship'};
  function sourceLinks(ids) {
    return [...new Set(ids || [])].map(id => sourceById.get(id)).filter(Boolean).map(s => `<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)}<span>${escape(s.date ? s.date : 'Publication date not stated')} · checked ${escape(s.checked || data.as_of)}</span></a>`).join('');
  }
  function quantityEvidence(link) {
    const q = link.tonnage;
    if (!q) return '<p class="supply-detail-boundary">No route-specific delivered tonnage is established by the cited evidence. This relationship does not automatically trace every downstream customer.</p>';
    const value = Number(q.value);
    const mass = value === 0.1 && q.unit === 'metric tonnes alloy' ? '100 kg of NdFeB alloy (0.1 metric tonne)' : q.unit === 'metric tonnes alloy order' ? `${value} metric tonnes of NdFeB alloy` : `${value} ${q.unit}`;
    if (link.status.includes('delivered-sample')) return `<p class="supply-quantity"><strong>Reported commissioning sample:</strong> ${escape(mass)} · ${escape(q.period)}.</p><p class="supply-detail-boundary">This is reported alloy sample mass. Continuous commercial delivery volume and contained Nd, Pr, Dy or Tb mass are not established. The exact receiving facility remains unassigned.</p>`;
    return `<p class="supply-quantity"><strong>Scheduled purchase order:</strong> ${escape(mass)} · ${escape(q.period)}.</p><p class="supply-detail-boundary">This is ordered alloy mass, not verified realized delivery or contained rare-earth-element mass. Actual delivered batches and customer acceptance remain unverified.</p>`;
  }
  function resolveStep(step) { return typeof step === 'string' ? nodeById.get(step) : step; }
  function connection(path, from, to) {
    if (!from?.id || !to?.id) return null;
    return (path.link_ids || []).map(id => linkById.get(id)).find(l => l?.from === from.id && l?.to === to.id) || null;
  }
  function filterNote() {
    if (state.ingredient === 'Nd' || state.ingredient === 'Pr') return 'Combined NdPr products remain joint products. Selecting one element does not split their assay or shipment. NdFeB samples with undisclosed Pr content appear under Nd and All, not the Pr product filter.';
    if (state.ingredient === 'All') return 'All is the union of the tagged pathways below. Broad agreements with undisclosed elemental scope appear only here. This is a selected evidence atlas, not a complete shipment census.';
    if (state.ingredient === 'Fe') return 'Follow high-purity iron to a supplier specification. Ordinary ore, pellets and steel do not by themselves establish magnet-grade iron supply.';
    if (state.ingredient === 'B') return 'Follow borates upstream, then look for a documented conversion to ferroboron. Borax, boric acid and ferroboron are different purchased products.';
    if (state.ingredient === 'Dy') return 'Dysprosium can reach factories as Dy–Fe alloy or other qualified feed. A separated oxide or pilot sample still needs documented conversion and customer acceptance.';
    if (state.ingredient === 'Tb') return 'Terbium oxide, metal/alloy and diffusion feed are different forms. Terbium sample qualification does not establish continuous U.S. magnet deliveries.';
    return 'NdPr is a combined neodymium–praseodymium product. Track concentrate, oxide, metal and alloy as distinct physical forms.';
  }
  function pathCountries(path) {
    return [...new Set(path.steps.map(resolveStep).filter(n => n && !n.gap).map(n => n.country))].join(' → ');
  }
  function choosePath(id) { state.path = id; state.detail = null; render(); }
  function render() {
    const available = data.paths.filter(p => match(p.ingredients));
    if (!available.some(p => p.id === state.path)) state.path = available[0]?.id;
    const path = available.find(p => p.id === state.path);
    const forms = data.supplier_forms.filter(f => match(f.ingredients));
    mount.innerHTML = `<section class="supply-explorer" aria-labelledby="supply-title">
      <div class="supply-heading"><div><p class="eyebrow">Ingredient pathways · public evidence</p><h2 id="supply-title">From rock to a<br><em>qualified magnet.</em></h2></div><p>A mine, an oxide, a master alloy and an accepted component are different things. Follow the product at each handoff—and see where the public trail stops.</p></div>
      <div class="supply-filters" role="group" aria-label="Choose ingredient">${data.ingredient_filters.map(f => `<button type="button" data-supply-filter="${escape(f.id)}" class="${f.id === state.ingredient ? 'active' : ''}" aria-pressed="${f.id === state.ingredient}"><b>${escape(f.label)}</b>${f.name ? `<span>${escape(f.name.split(' · ')[0])}</span>` : ''}</button>`).join('')}</div>
      <p class="supply-filter-note" aria-live="polite">${escape(filterNote())}</p>
      <div class="supply-stage-key" aria-label="Typical physical stages"><span>Ore / concentrate</span><i aria-hidden="true">→</i><span>Separated oxide</span><i aria-hidden="true">→</i><span>Metal / master alloy</span><i aria-hidden="true">→</i><span>Magnet</span><i aria-hidden="true">→</i><span>Accepted component</span></div>
      <p class="supply-stage-note">This is a reading guide. A missing stage stays a gap; the arrows above do not establish a supplier route.</p>
      <div class="supply-path-select"><label for="supply-route">Choose a source-backed path <small>${available.length} relevant paths / capability islands</small></label><select id="supply-route">${available.map(p => `<option value="${escape(p.id)}" ${p.id === state.path ? 'selected' : ''}>${escape(p.title)}</option>`).join('')}</select></div>
      ${path ? renderPath(path) : '<p>No verified pathway in this evidence package.</p>'}
      <div class="supply-legend" aria-label="Relationship legend">${['reported','agreement','capability','pilot','aggregate','gap'].map(k => `<span><i class="supply-line ${k}" aria-hidden="true"></i>${escape(kindLabel[k])}</span>`).join('')}</div>
      <p class="supply-width-note">Equal-width connections encode evidence type, not tonnes or market shares. An operator name or shared parent is not proof of a shipment.</p>
      <div id="supply-inspector" class="supply-inspector" role="region" aria-label="Selected supply-path evidence" tabindex="-1">${renderDetail(path)}</div>
      <div class="supply-forms"><p class="eyebrow">What a magnet factory actually buys</p><div>${forms.map(f => `<article><strong>${escape(f.name)}</strong><p>${escape(f.description)}</p>${f.node ? `<button type="button" data-supply-form-node="${escape(f.node)}">Inspect documented product ↗</button>` : '<span class="supply-form-gap">Connected supplier trail not established here</span>'}</article>`).join('')}</div></div>
      <details class="supply-other-paths" ${state.expanded ? 'open' : ''}><summary>Explore every relevant path <span>${available.length}</span></summary><div>${available.map(p => `<button type="button" data-supply-path="${escape(p.id)}" aria-pressed="${p.id === state.path}"><strong>${escape(p.title)}</strong><span>${escape(pathCountries(p))}</span><small>${escape(p.subtitle)}</small></button>`).join('')}</div></details>
      <details class="supply-method"><summary>Evidence boundaries and source coverage</summary><p>As of ${escape(data.as_of)}. ${escape(data.scope)} Statements describe source-reviewed public evidence at its stated maturity; coverage and shipment traceability remain incomplete. “Not established” means this package lacks a verified link, not that a real-world link cannot exist.</p><p>Generic rare-earth agreements are All-only unless their elemental scope is verified. Nd and Pr can share a combined NdPr pathway. NdFeB commissioning samples/orders with undisclosed Pr assay are Nd-only for filtering; no Pr/Dy/Tb composition is assumed. Total REO/TREO, facility nameplate capacity and finished-magnet mass are not converted into elemental delivered tonnes.</p><p>Country and place labels describe reported geography. Regional/national nodes are aggregates, not facility coordinates. Operator/group labels are not a legal ownership-control audit. Source dates are publication dates where stated; undated pages show their check date.</p><p>Wilmington, California (U.S. Borax / Port of Los Angeles) and Wilmington, Delaware (an Etimine product-packaging option) are different places.</p><a href="data/supply-paths.json" download="supply-paths.json">Download the path evidence JSON</a></details>
    </section>`;
    mount.querySelectorAll('[data-supply-filter]').forEach(button => button.addEventListener('click', () => { const id = button.dataset.supplyFilter; state.ingredient = id; state.detail = null; render(); mount.querySelector(`[data-supply-filter="${id}"]`)?.focus(); }));
    mount.querySelector('#supply-route')?.addEventListener('change', event => { choosePath(event.target.value); mount.querySelector('#supply-route')?.focus(); });
    mount.querySelectorAll('[data-supply-path]').forEach(button => button.addEventListener('click', () => { state.expanded = true; choosePath(button.dataset.supplyPath); mount.querySelector('#supply-route')?.focus(); }));
    mount.querySelectorAll('[data-supply-node]').forEach(button => button.addEventListener('click', () => { state.detail = {type:'node', id:button.dataset.supplyNode}; updateDetail(path); }));
    mount.querySelectorAll('[data-supply-link]').forEach(button => button.addEventListener('click', () => { state.detail = {type:'link', id:button.dataset.supplyLink}; updateDetail(path); }));
    mount.querySelectorAll('[data-supply-gap]').forEach(button => button.addEventListener('click', () => { state.detail = {type:'gap', index:Number(button.dataset.supplyGap)}; updateDetail(path); }));
    mount.querySelectorAll('[data-supply-form-node]').forEach(button => button.addEventListener('click', () => { state.detail = {type:'node',id:button.dataset.supplyFormNode}; updateDetail(path); }));
    const allDetails = mount.querySelector('.supply-other-paths'); allDetails?.addEventListener('toggle', () => { state.expanded = allDetails.open; });
  }
  function renderPath(path) {
    const steps = path.steps.map(resolveStep);
    return `<article class="supply-path" aria-labelledby="supply-path-title"><div class="supply-path-top"><div><h3 id="supply-path-title">${escape(path.title)}</h3><p>${escape(path.subtitle)}</p></div><span class="supply-us-status">U.S. connection<br><b>${escape(path.us_connection)}</b></span></div><div class="supply-track" role="group" aria-label="Product and processing stages">${steps.map((n,index) => {
      if (!n) return '';
      const next=steps[index+1]; const l=connection(path,n,next); const k=l?.kind || 'gap';
      const node=`<button type="button" class="supply-node ${n.gap ? 'gap' : ''}" ${n.gap ? `data-supply-gap="${index}"` : `data-supply-node="${escape(n.id)}"`} aria-label="${escape(`${n.label}; ${n.country}; ${n.product}; inspect evidence`)}"><span class="supply-stage">${escape(n.stage)}</span><strong>${escape(n.label)}</strong>${!n.gap ? `<span class="supply-country">${escape(n.country)}${n.country_zh ? `<small>${escape(n.country_zh)}</small>` : ''}</span><span class="supply-location">${escape(n.location)}</span><span class="supply-product">${escape(n.product)}</span><span class="supply-maturity">${escape(n.status)}</span>` : `<span class="supply-gap-note">${escape(n.note)}</span><span class="supply-maturity">Not established</span>`}<span class="supply-inspect">Inspect ${n.gap ? 'gap' : 'evidence'} ↗</span></button>`;
      const arrow=next ? `<div class="supply-transfer ${k}">${l ? `<button type="button" data-supply-link="${escape(l.id)}" aria-label="Inspect relationship: ${escape(l.product)}"><i class="supply-arrow" aria-hidden="true"></i><span>${escape(l.kind === 'reported' ? 'reported link' : l.kind === 'aggregate' ? 'aggregate' : l.kind === 'pilot' ? 'pilot / qualification' : l.kind === 'capability' ? 'commercial relation' : 'agreement')}</span></button>` : '<i class="supply-arrow" aria-hidden="true"></i><span>gap</span>'}</div>` : '';
      return node+arrow;
    }).join('')}</div><p class="supply-path-note">${escape(path.note)}</p></article>`;
  }
  function renderDetail(path) {
    if (!path) return '';
    if (!state.detail) return `<div class="supply-detail-intro"><strong>Click a place, product or connecting arrow.</strong><p>Inspect the operator, maturity, dated claim and primary source. Dashed agreement arrows and gaps keep planned supply separate from delivered material.</p></div>`;
    if (state.detail.type==='gap') { const gap=resolveStep(path.steps[state.detail.index]); return `<p class="eyebrow">Public evidence stops here</p><h3>${escape(gap.label)}</h3><p>${escape(gap.note)}</p><p class="supply-detail-boundary">A missing link is an uncertainty to investigate. No route or delivered tonnage is filled in by assumption.</p>`; }
    if (state.detail.type==='link') { const l=linkById.get(state.detail.id), from=nodeById.get(l.from),to=nodeById.get(l.to); return `<p class="eyebrow">${escape(kindLabel[l.kind])}</p><h3>${escape(from.label)} → ${escape(to.label)}</h3><p class="supply-detail-geography">${escape(from.country)} → ${escape(to.country)}</p><p><strong>Product / relationship:</strong> ${escape(l.product)}</p><p><strong>Reported status:</strong> ${escape(l.status)}</p>${l.note ? `<p class="supply-detail-boundary">${escape(l.note)}</p>` : ''}${quantityEvidence(l)}<div class="supply-detail-sources">${sourceLinks(l.sources)}</div>`; }
    const n=nodeById.get(state.detail.id);
    return `<p class="eyebrow">${escape(n.stage)}</p><h3>${escape(n.label)}</h3><p class="supply-detail-geography">${escape(n.country)}${n.country_zh ? ` · ${escape(n.country_zh)}` : ''} — ${escape(n.location)}</p><div class="supply-detail-facts"><p><strong>Physical product</strong>${escape(n.product)}</p><p><strong>Operator / group</strong>${escape(n.operator)}</p><p><strong>Published maturity</strong>${escape(n.status)}</p></div>${n.note ? `<p>${escape(n.note)}</p>` : ''}${n.ingredient_status ? `<p class="supply-detail-boundary">Ingredient-specific maturity: ${escape(Object.entries(n.ingredient_status).map(([element,status]) => `${element}: ${status}`).join('; '))}</p>` : ''}${n.ingredient_scope ? `<p class="supply-detail-boundary">${escape(n.ingredient_scope)}</p>` : ''}<p class="supply-detail-boundary">${escape(n.source_note || 'Capability does not establish a connecting shipment.')}</p>${n.evidence_dates ? `<p class="supply-detail-dates">Evidence dates: ${escape(n.evidence_dates.join('; '))}</p>` : ''}<div class="supply-detail-sources">${sourceLinks(n.sources)}</div>`;
  }
  function updateDetail(path) {
    const inspector=mount.querySelector('#supply-inspector'); inspector.innerHTML=renderDetail(path);
    mount.querySelectorAll('.supply-node').forEach(b => b.classList.toggle('selected', state.detail?.type==='node' && b.dataset.supplyNode===state.detail.id || state.detail?.type==='gap' && Number(b.dataset.supplyGap)===state.detail.index));
    // Focus the evidence region so keyboard users reach the newly opened content and its links.
    inspector.focus({preventScroll:true});
  }
  async function start() {
    try {
      const response=await fetch('data/supply-paths.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data=await response.json(); nodeById=new Map(data.nodes.map(n=>[n.id,n])); linkById=new Map(data.links.map(l=>[l.id,l])); sourceById=new Map(data.sources.map(s=>[s.id,s]));
      render(); mount.dataset.supplyReady='true';
    } catch(error) {
      mount.innerHTML='<section class="supply-explorer"><h2>Ingredient pathways</h2><p>The source-backed path data could not load. Refresh this page or inspect the downloadable evidence package.</p></section>';
      mount.dataset.supplyReady='error'; console.error('Ingredient paths failed to load:', error);
    }
  }
  start();
})();
