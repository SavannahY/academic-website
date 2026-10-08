/* Decision framework from public evidence; no national cost or portfolio optimizer. */
(() => {
  'use strict';
  const mount = document.getElementById('investment-study');
  if (!mount) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const safeUrl = value => /^https:\/\//.test(String(value)) ? esc(value) : '#';
  let data;
  let definitionId = 'china_independent_allies';
  let optionId = 'inventory';

  function sources(ids, locator = '') {
    return `<div class="is-sources">${[...new Set(ids || [])].map(id => {
      const source = data.sources.find(item => item.id === id);
      return source ? `<a href="${safeUrl(source.url)}" target="_blank" rel="noopener">${esc(source.title)}${source.date ? ` · ${esc(source.date)}` : ''} ↗</a>` : '';
    }).join('')}${locator ? `<p>${esc(locator)}</p>` : ''}</div>`;
  }

  function renderDefinition() {
    const definition = data.definitions.find(item => item.id === definitionId);
    const domestic = definitionId === 'us_located_chain';
    mount.querySelectorAll('[data-is-definition]').forEach(button => {
      const active = button.dataset.isDefinition === definitionId;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    mount.querySelector('#is-definition-detail').innerHTML = `<h3>${esc(definition.label)}</h3><p>${esc(definition.meaning)}</p><p class="is-boundary-rule">${esc(definition.boundary)}</p><div class="is-route" role="list" aria-label="Definition boundary: ${esc(definition.label)}. Every required stage must satisfy its origin, location and access rules.">${data.route_boundary.map((step, i) => `<div class="is-route-step" role="listitem"><span class="is-route-index" aria-hidden="true">${i + 1}</span><div><h4>${esc(step.label)}</h4><p>${esc(step.form)}</p><span class="is-route-tag">${i === data.route_boundary.length - 1 ? (domestic ? 'U.S. finishing / qualification' : 'Accepted by the target U.S. customer') : domestic ? 'U.S. location / eligible domestic feed' : 'U.S. or verified approved ally'}</span></div></div>`).join('')}</div><p class="is-diagram-note">Boundary diagram · scope requirements, not verified operating shipments or a certification of supplier eligibility.</p><details class="is-boundary-details"><summary>Boundary choices still to define</summary><ul>${definition.unresolved.map(item => `<li>${esc(item)}</li>`).join('')}</ul><p>Origin, product/entity access, available allocation and readiness require verification. Neither boundary automatically protects against a single plant outage.</p></details>`;
    renderOption();
  }

  function renderOption() {
    const option = data.options.find(item => item.id === optionId);
    const domestic = definitionId === 'us_located_chain';
    mount.querySelectorAll('[data-is-option]').forEach(button => {
      const active = button.dataset.isOption === optionId;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    mount.querySelector('#is-option-detail').innerHTML = `<div class="is-option-heading"><p class="is-kicker">Explore one intervention · no ranking implied</p><h3 id="is-option-title">${esc(option.option)}</h3></div><div class="is-option-story"><section><h4>What is paid upfront?</h4><p>${esc(option.upfront)}</p></section><section><h4>What continues to cost money?</h4><p>${esc(option.recurring)}</p></section><section><h4>When could it help?</h4><p>${esc(option.readiness)}</p></section></div><div class="is-eligibility"><h4>Under the selected definition</h4><p>${esc(domestic ? option.domestic_definition : option.allied_definition)}</p></div><div class="is-condition"><h4>A condition worth testing</h4><p>${esc(option.priority_condition)}</p><p class="is-condition-note">This is a conditional research hypothesis, not a measured benefit or an optimal priority.</p></div><details class="is-option-constraints"><summary>Evidence needed before allocating money</summary><ul>${option.constraints.map(item => `<li>${esc(item)}</li>`).join('')}</ul></details>${sources(option.source_ids)}`;
    mount.querySelector('#is-selection-status').textContent = `${data.definitions.find(item => item.id === definitionId).label}. ${option.option} selected. Costs, readiness and conditional definition eligibility updated.`;
  }

  function demandDrawer() {
    const demand = data.demand_example;
    return `<details class="is-demand-drawer"><summary>Why the demand boundary matters · a historical DOE example</summary><p class="is-demand-scope">${esc(demand.scope)}. These are not current, customer-qualified, grade-specific sintered-magnet requirements.</p><div class="is-demand-example">${demand.values.map(item => `<div><strong>${item.value.toFixed(1)} kt/year</strong><span>${item.year} · ${esc(item.status)}</span></div>`).join('')}</div><p>${esc(demand.scenario_basis)}</p><ul>${demand.limitations.map(item => `<li>${esc(item)}</li>`).join('')}</ul>${sources([demand.source_id, demand.corroborating_source_id], demand.locator)}</details>`;
  }

  function render() {
    const study = data.empirical_study;
    mount.innerHTML = `<section class="is-shell" aria-labelledby="is-study-title"><div class="is-study-heading"><p class="is-kicker">Investment decisions under limited capital & time · ${esc(data.as_of)}</p><h2 id="is-study-title">Independence is an outcome.<br><em>Define the service first.</em></h2><p>Which accepted magnet parts must reach which customers, by when? The answer changes the feasible routes and the costs that belong in a budget.</p></div>
      <aside class="is-national-finding"><h3>No verified public national total found.</h3><p>${esc(data.national_total.finding)}</p><p class="is-finding-limit">${esc(data.national_total.limitation)}</p><p>${esc(data.global_context)}</p>${sources(data.national_total.source_ids)}</aside>

      <section class="is-boundary-section" aria-labelledby="is-boundary-title"><div class="is-section-heading"><p class="is-kicker">First choose the outcome</p><h3 id="is-boundary-title">Two meanings of independence.</h3><p>These are alternative research boundaries. The picker does not price either one or claim that a route satisfies it.</p></div><div class="is-definition-picker" role="group" aria-label="Choose an independence definition">${data.definitions.map(item => `<button type="button" data-is-definition="${item.id}" aria-pressed="${item.id === definitionId}" aria-controls="is-definition-detail"><strong>${esc(item.label)}</strong><span>${esc(item.short)}</span></button>`).join('')}</div><div id="is-definition-detail" class="is-definition-detail"></div></section>

      <section class="is-options-section" aria-labelledby="is-options-title"><div class="is-section-heading"><p class="is-kicker">Different tools solve different gaps</p><h3 id="is-options-title">Where could investment help?</h3><p>Open a card to inspect its costs, readiness and boundary conditions. The six options are not ranked, and selection is not a portfolio recommendation.</p></div><div class="is-option-picker" role="group" aria-label="Choose an intervention to examine">${data.options.map(item => `<button type="button" data-is-option="${item.id}" aria-pressed="${item.id === optionId}" aria-controls="is-option-detail"><strong>${esc(item.card_label)}</strong><span>${esc(item.card_description)}</span></button>`).join('')}</div><article id="is-option-detail" class="is-option-detail" aria-labelledby="is-option-title"></article></section>

      <section class="is-ledgers-section" aria-labelledby="is-ledgers-title"><div class="is-section-heading"><p class="is-kicker">Keep the accounts interpretable</p><h3 id="is-ledgers-title">Three ledgers, three questions.</h3><p>An inventory asset, a yearly operating bill and a government loan do not become one construction total.</p></div><div class="is-ledgers">${data.cost_ledgers.map(item => `<article><h4>${esc(item.label)}</h4><p>${esc(item.detail)}</p><p class="is-ledger-rule">${esc(item.rule)}</p></article>`).join('')}</div></section>

      <section class="is-research-section" aria-labelledby="is-research-title"><div class="is-section-heading"><p class="is-kicker">Proposed empirical research · not a result</p><h3 id="is-research-title">Measure qualified service per budget.</h3><p>${esc(study.scope)}</p></div><div class="is-research-route"><div><strong>Define the accepted parts</strong><p>Demand, grade, shape, required performance and delivery deadline.</p></div><span aria-hidden="true">→</span><div><strong>Test complete eligible routes</strong><p>Assays, conversions, yield, allocated capacity, ramp and acceptance.</p></div><span aria-hidden="true">→</span><div><strong>Validate delivered service</strong><p>Check costs and mass balance against accepted customer shipments.</p></div></div><div class="is-frontier-proposal"><h4>A budget-versus-qualified-service frontier</h4><p>The proposed output compares how much customer-qualified demand different feasible portfolios can serve by each deadline. No frontier has been estimated here; no dollar optimum or national requirement is inferred.</p><p>${esc(study.deliverable)} ${esc(study.scale_rule)}</p></div><details class="is-research-inputs"><summary>Inputs needed before estimating that frontier</summary><ul>${data.framework.missing_inputs.map(item => `<li>${esc(item)}</li>`).join('')}</ul><p>${esc(study.design)}</p><p>${esc(data.framework.path_check)}</p><p>${esc(data.framework.readiness)}</p></details></section>
      ${demandDrawer()}<p class="is-scope-note">${esc(data.status)} · ${esc(data.scope)} No project-budget sums, dollar optimizer, investment ranking or current grade-specific national demand are produced by this component.</p><p id="is-selection-status" class="is-sr-only" aria-live="polite" aria-atomic="true"></p></section>`;
    mount.addEventListener('click', event => {
      const definition = event.target.closest('[data-is-definition]');
      const option = event.target.closest('[data-is-option]');
      if (definition && mount.contains(definition)) { definitionId = definition.dataset.isDefinition; renderDefinition(); }
      else if (option && mount.contains(option)) { optionId = option.dataset.isOption; renderOption(); }
    });
    renderDefinition();
  }

  mount.innerHTML = '<p class="is-loading" role="status">Loading the public investment decision study…</p>';
  fetch('data/investment-study.json').then(response => {
    if (!response.ok) throw new Error(`Investment study request: ${response.status}`);
    return response.json();
  }).then(value => { data = value; render(); }).catch(() => {
    mount.innerHTML = '<p class="is-loading" role="status">The investment decision study could not load. Reload to retry. No national spending total is assigned.</p>';
  });
})();
