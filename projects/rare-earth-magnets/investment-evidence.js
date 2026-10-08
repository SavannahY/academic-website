/* Public disclosure evidence, not an optimized investment recommendation. */
(() => {
  'use strict';
  const mount = document.getElementById('investment-evidence');
  if (!mount) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const fmt = value => Number(value).toLocaleString('en-US');
  const secureLink = value => /^https:\/\//.test(String(value)) ? esc(value) : '#';
  const categories = {
    project_estimate: ['Project estimate', 'budget'],
    actual_spend: ['Reported cash expenditure', 'spend'],
    cumulative_investment: ['Cumulative investment claim', 'spend'],
    accounting: ['Capitalized accounting addition', 'spend'],
    guidance: ['Company spending guidance', 'budget'],
    property_purchase: ['Property acquisition price', 'spend'],
    grant: ['Grant / direct funding', 'support'],
    incentive: ['Incentive package', 'support'],
    tax_credit: ['Tax credit', 'support'],
    budget_share: ['Proposed budget share', 'support'],
    equity: ['Equity / capitalization', 'support'],
    loan: ['Loan / financing commitment', 'support'],
    guarantee: ['Loan guarantee', 'support'],
    working_capital: ['Working-capital credit', 'support'],
    revenue: ['Company revenue · not capex or value added', 'accounts'],
    commercial: ['Commercial commitment', 'commercial'],
    prepayment: ['Customer prepayment', 'commercial'],
    price_floor: ['Price-floor protection', 'commercial'],
    offtake: ['Offtake / purchase assurance', 'commercial']
  };
  const filterNames = { all: 'All money types', budget: 'Estimates & guidance', spend: 'Expenditure & acquisition', support: 'Financing & support', commercial: 'Commercial agreements', accounts: 'Company accounts' };
  let data;
  let stage = 'all';
  let region = 'all';
  let selected = 'mountain_pass_ndpr';
  let moneyFilter = 'all';

  function sourceLinks(ids, context = '') {
    return `<div class="ie-source-links">${[...new Set(ids || [])].map(id => {
      const source = data.sources.find(item => item.id === id);
      return source ? `<a href="${secureLink(source.url)}" target="_blank" rel="noopener">${esc(source.title)}${source.date ? ` · ${esc(source.date)}` : ''} ↗</a>` : '';
    }).join('')}${context ? `<p>${esc(context)}</p>` : ''}</div>`;
  }

  function amountLabel(record) {
    if (record.amount === null || record.amount === undefined) return 'Amount not disclosed';
    const currency = record.currency || '';
    const symbols = { USD: '$', AUD: 'A$', EUR: '€', GBP: '£', CNY: 'CN¥', RMB: 'RMB ' };
    const symbol = symbols[currency] || `${currency} `;
    const prefix = { greater_than: '>', approximately: '≈ ', up_to: 'Up to ', at_least: 'At least ', no_more_than: 'No more than ' }[record.comparison] || '';
    const amount = Array.isArray(record.amount) ? record.amount.map(fmt).join('–') : fmt(record.amount);
    const unit = record.unit ? ` / ${record.unit}` : currency.includes('/') ? ` ${currency}` : '';
    return `${prefix}${symbol}${amount}${unit}`;
  }

  function renderGlobal() {
    const g = data.global_investment;
    return `<section class="ie-global" aria-labelledby="ie-global-title"><div class="ie-global-head"><div><p class="ie-kicker">A global diversification scenario · ${esc(g.as_of_report)}</p><h2 id="ie-global-title">The scale of a different supply chain.</h2></div><div class="ie-global-total"><strong>~$60B</strong><span>Modelled requirement to 2035</span></div></div>
      <p class="ie-global-scope">${esc(g.geography)} ${esc(g.product_scope)}</p>
      <div class="ie-global-stages" aria-label="Qualitative allocation of scenario investment">${g.stage_allocations.map(item => `<article><h3>${esc(item.stage)}</h3><strong>${esc(item.allocation)}</strong><p>${esc(item.basis)}</p></article>`).join('')}</div>
      <p class="ie-global-note">The three panels describe allocation; their sizes do not encode exact shares. ${esc(g.total_status)}</p>
      ${sourceLinks(g.source_ids, g.source_locator)}
      <details class="ie-method"><summary>Scenario method, scope & chart correction</summary><p>${esc(g.scenario)}</p><p>${esc(g.method)}</p><ul>${g.caveats.map(item => `<li>${esc(item)}</li>`).join('')}</ul></details>
    </section>`;
  }

  function available() {
    return data.facilities.filter(item => (stage === 'all' || item.stage_ids.includes(stage)) && (region === 'all' || item.country === region));
  }

  function renderSelectors() {
    const candidates = available();
    if (!candidates.some(item => item.id === selected)) selected = candidates[0]?.id || null;
    mount.querySelector('#ie-facility').innerHTML = candidates.map(item => `<option value="${esc(item.id)}"${item.id === selected ? ' selected' : ''}>${esc(item.name)} · ${esc(item.country)}</option>`).join('');
    mount.querySelector('#ie-facility').disabled = !candidates.length;
    mount.querySelectorAll('[data-ie-stage]').forEach(button => {
      const active = button.dataset.ieStage === stage;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    mount.querySelector('#ie-filter-status').textContent = `${candidates.length} selected facility, chain or context records · evidence cutoff ${data.as_of}`;
    renderFacility();
  }

  function quantityLabel(record) {
    if (record.value === null || record.value === undefined) return 'Not reported / not verified';
    return `${Array.isArray(record.value) ? record.value.map(fmt).join('–') : fmt(record.value)} ${record.unit}`;
  }

  function quantityGroup(records, emptyNote) {
    if (!records.length) return `<div class="ie-unknown"><strong>Unknown</strong><p>${esc(emptyNote)} No zero is assigned.</p></div>`;
    const groups = new Map();
    records.forEach(record => {
      const key = `${record.product}|${record.unit}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(record);
    });
    return [...groups.values()].map(group => {
      const known = group.filter(record => record.value !== null && record.value !== undefined);
      const maximum = Math.max(0, ...known.map(record => Array.isArray(record.value) ? Math.max(...record.value) : record.value));
      const axisMaximum = maximum ? (/^percent\b/i.test(group[0].unit) ? 100 : maximum * 1.1) : null;
      const rows = group.map(record => {
        const unknown = record.value === null || record.value === undefined;
        let chart = '';
        if (!unknown && axisMaximum) {
          const lo = Array.isArray(record.value) ? record.value[0] : record.value;
          const hi = Array.isArray(record.value) ? record.value[1] : record.value;
          const style = record.measure === 'actual_output' ? 'observed' : record.measure === 'capacity' ? 'capacity' : 'context';
          chart = `<div class="ie-quantity-track" aria-hidden="true"><span class="ie-quantity-bar ${style}" style="width:${hi / axisMaximum * 100}%"></span>${lo !== hi ? `<span class="ie-quantity-range" style="left:${lo / axisMaximum * 100}%;width:${(hi - lo) / axisMaximum * 100}%"></span>` : ''}</div>`;
        }
        return `<div class="ie-quantity-row${unknown ? ' is-unknown' : ''}"><div class="ie-quantity-label"><strong>${esc(quantityLabel(record))}</strong><span>${esc(record.period || 'Period not specified')}</span></div>${chart}<p class="ie-record-status">${esc(record.status)}</p><p class="ie-record-basis">${esc(record.reason || record.basis || '')}</p>${sourceLinks(record.source_ids)}</div>`;
      }).join('');
      return `<section class="ie-quantity-group"><h4>${esc(group[0].product)}</h4>${rows}${axisMaximum ? `<p class="ie-axis-note">Graphic scale: 0–${fmt(Number(axisMaximum.toPrecision(6)))} ${esc(group[0].unit)}. Only this product and unit share the scale.${known.some(record => Array.isArray(record.value)) ? ' Hatching marks the quoted range, not a probability distribution.' : ''}</p>` : '<p class="ie-axis-note">No verified quantity available to plot.</p>'}</section>`;
    }).join('');
  }

  function annual(record) {
    return /^\d{4}$/.test(record.period || '') || /^FY\d{4}$/.test(record.period || '');
  }

  function renderActual() {
    const facility = data.facilities.find(item => item.id === selected);
    if (!facility || !mount.querySelector('#ie-actual-quantities')) return;
    const records = facility.records.filter(record => record.measure === 'actual_output');
    const period = mount.querySelector('#ie-output-period')?.value;
    const shown = period ? records.filter(record => record.period === period) : records;
    mount.querySelector('#ie-actual-quantities').innerHTML = quantityGroup(shown, 'Period output is not disclosed in the reviewed evidence.');
  }

  function renderMoney() {
    const facility = data.facilities.find(item => item.id === selected);
    if (!facility) return;
    const records = facility.money_refs.map(id => data.money_records.find(item => item.id === id)).filter(Boolean);
    const shown = records.filter(record => moneyFilter === 'all' || categories[record.category]?.[1] === moneyFilter);
    mount.querySelectorAll('[data-ie-money-filter]').forEach(button => {
      const active = button.dataset.ieMoneyFilter === moneyFilter;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    mount.querySelector('#ie-money-records').innerHTML = shown.length ? shown.map(moneyCard).join('') : '<div class="ie-unknown"><strong>Unknown / no record</strong><p>No verified amount for this type is included for the selected evidence record. This is not a zero cost.</p></div>';
    mount.querySelector('#ie-money-status').textContent = `${shown.length} of ${records.length} money records shown · no sum calculated`;
  }

  function moneyCard(record) {
    const type = categories[record.category]?.[0] || 'Reported financial record';
    const status = record.display_status || record.status;
    const current = record.category === 'revenue' ? 'Reported sales revenue · not project spending' : record.spent === true ? 'Reported expenditure' : record.spent === false ? 'Not evidence of expenditure' : 'See source status';
    return `<article class="ie-money-card"><p class="ie-money-type">${esc(type)}</p><strong class="ie-money-amount">${esc(amountLabel(record))}</strong><h4>${esc(record.display_title || record.kind)}</h4><p class="ie-money-scope">${esc(record.display_scope || record.scope)}</p><p class="ie-money-period">${esc(record.period || '')}${status ? ` · ${esc(status)}` : ''}</p><p class="ie-money-state">${esc(current)}</p>${record.uncertainty_percent ? `<p class="ie-money-caution">Study estimate uncertainty: ±${record.uncertainty_percent}%; not a probability distribution.</p>` : ''}${record.caution ? `<p class="ie-money-caution">${esc(record.caution)}</p>` : ''}${sourceLinks(record.source_ids)}</article>`;
  }

  function renderFacility() {
    const facility = data.facilities.find(item => item.id === selected);
    const panel = mount.querySelector('#ie-facility-detail');
    if (!facility) {
      panel.innerHTML = '<div class="ie-empty" role="status"><h3 id="ie-selected-title">No included evidence records</h3><p>No records match this stage and geography. Broaden one filter.</p></div>';
      return;
    }
    const actual = facility.records.filter(record => record.measure === 'actual_output');
    const periods = [...new Set(actual.map(record => record.period))];
    const preferred = actual.find(annual)?.period || periods[0];
    const capacities = facility.records.filter(record => record.measure === 'capacity');
    const contextual = facility.records.filter(record => !['actual_output', 'capacity'].includes(record.measure));
    const money = facility.money_refs.map(id => data.money_records.find(item => item.id === id)).filter(Boolean);
    const knownProjectBudget = money.some(item => item.category === 'project_estimate' && item.standalone_facility_cost);
    const stageLabels = facility.stage_ids.map(id => data.stages.find(item => item.id === id)?.label).filter(Boolean);
    panel.innerHTML = `<div class="ie-facility-head"><div><p class="ie-kicker">${esc(facility.country)} · ${esc(facility.operator)}</p><h3 id="ie-selected-title">${esc(facility.name)}</h3><p>${esc(facility.site)}</p></div><span class="ie-entity-tag">${facility.record_type === 'context' ? 'Context · not a separate physical plant' : facility.record_type === 'facility_or_chain' ? 'Selected facility / linked chain' : 'Selected facility'}</span></div>
      <div class="ie-stage-tags">${stageLabels.map(label => `<span>${esc(label)}</span>`).join('')}</div>
      <div class="ie-readiness"><h4>Readiness is part of capacity.</h4><p>${esc(facility.status)}</p><span>Disclosure/status date: ${esc(facility.status_date)}</span>${sourceLinks(facility.source_ids)}</div>
      ${contextual.length ? `<section class="ie-contextual-metrics" aria-labelledby="ie-contextual-title"><div class="ie-card-heading"><span class="ie-swatch context"></span><h3 id="ie-contextual-title">Other reported measures · separate definitions</h3></div><p>Administrative quotas, production estimates, finished-product sales, progress indicators and regional cost ratios retain their own meanings. They are not interchangeable with achieved production, annual capacity or customer-qualified delivery.</p>${quantityGroup(contextual, 'No contextual quantity is available.')}</section>` : ''}
      ${actual.length || capacities.length || facility.record_type !== 'context' ? `<div class="ie-output-columns"><section class="ie-output-card ie-observed-card" aria-labelledby="ie-observed-title"><div class="ie-card-heading"><span class="ie-swatch observed"></span><h3 id="ie-observed-title">Reported period output</h3></div><p>What the source says was produced. Quarterly and half-year totals remain their own periods.</p>${periods.length ? `<label class="ie-period-label" for="ie-output-period">Output period<select id="ie-output-period">${periods.map(period => `<option value="${esc(period)}"${period === preferred ? ' selected' : ''}>${esc(period)}</option>`).join('')}</select></label>` : ''}<div id="ie-actual-quantities"></div></section>
      <section class="ie-output-card ie-capacity-card" aria-labelledby="ie-capacity-title"><div class="ie-card-heading"><span class="ie-swatch capacity"></span><h3 id="ie-capacity-title">Design, plans & targets</h3></div><p>Annual rates are references with status labels. They do not establish current output or qualified delivery.</p>${quantityGroup(capacities, 'Product-specific annual capacity is not disclosed or verified.')}<p class="ie-nonadditive">Alternative initial/expanded designs and feed/output quantities are not added. ${esc(facility.caution || '')}</p></section></div>
      ` : '<p class="ie-context-no-output">This is a company, aggregate or comparative context record; no separate physical-plant output or capacity is inferred.</p>'}
      ${facility.schedule.length ? `<div class="ie-schedule"><h4>Expected milestones · conditional dates</h4>${facility.schedule.map(item => `<p><strong>${esc(item.date)}</strong> · ${esc(item.kind || item.product || '')}</p>${sourceLinks([item.source_id])}`).join('')}</div>` : ''}
      <section class="ie-money-section" aria-labelledby="ie-money-title"><div class="ie-money-heading"><div><p class="ie-kicker">Money has different meanings</p><h3 id="ie-money-title">What is the amount actually for?</h3></div><p>Project estimates, company expenditure, financing and customer agreements remain separate. No currencies or amounts are combined.</p></div>${knownProjectBudget ? '' : '<p class="ie-unallocated">No current standalone facility construction cost is verified in this record. Company/segment totals below are context, not allocated facility or machine costs.</p>'}
      <div class="ie-money-filters" role="group" aria-label="Filter money by instrument">${Object.entries(filterNames).map(([id, label]) => `<button type="button" data-ie-money-filter="${id}" aria-pressed="${id === moneyFilter}">${label}</button>`).join('')}</div><p id="ie-money-status" class="ie-count" role="status"></p><div id="ie-money-records" class="ie-money-records"></div></section>
      <aside class="ie-evidence-gaps"><h4>What this record cannot establish</h4><ul>${facility.gaps.map(gap => `<li>${esc(gap)}</li>`).join('')}</ul></aside>`;
    mount.querySelector('#ie-output-period')?.addEventListener('change', renderActual);
    renderActual();
    renderMoney();
    mount.querySelector('#ie-selection-status').textContent = `${facility.name}, ${facility.country}, selected. ${stageLabels.join(', ')}. ${facility.status}`;
  }

  function render() {
    const countries = [...new Set(data.facilities.map(item => item.country))].sort();
    mount.innerHTML = `<div class="ie-shell">${renderGlobal()}
      <section class="ie-explorer" aria-labelledby="ie-explorer-title"><div class="ie-explorer-heading"><div><p class="ie-kicker">From announcements to usable output</p><h2 id="ie-explorer-title">Choose a stage. Open a place.</h2></div><p>Follow the physical product and its readiness. An operating mine, an oxide refinery and a qualified magnet factory provide different capabilities.</p></div>
      <div class="ie-stage-picker" role="group" aria-label="Choose supply-chain stage">${data.stages.map(item => `<button type="button" data-ie-stage="${item.id}" aria-pressed="${item.id === stage}"><strong>${esc(item.label)}</strong>${item.form ? `<span>${esc(item.form)}</span>` : '<span>Selected public evidence</span>'}</button>`).join('')}</div>
      <div class="ie-location-controls"><label for="ie-region">Country / chain geography<select id="ie-region"><option value="all">All included geographies</option>${countries.map(country => `<option value="${esc(country)}">${esc(country)}</option>`).join('')}</select></label><label for="ie-facility">Facility, chain or context<select id="ie-facility"></select></label></div><p id="ie-filter-status" class="ie-count" role="status"></p><article id="ie-facility-detail" aria-labelledby="ie-selected-title"></article></section>
      <details class="ie-company-context"><summary>MP Materials · unallocated company accounting & financing records</summary><p>These disclosures span several projects or concern financing/accounting. Repeated references are the same records, not additional money. This view never allocates them to a machine or sums them.</p><div class="ie-money-records">${data.mp_company_context_refs.map(id => data.money_records.find(item => item.id === id)).filter(Boolean).map(moneyCard).join('')}</div></details>
      <details class="ie-method ie-scope-method"><summary>Evidence coverage & comparison rules</summary><p>${esc(data.scope)}</p><ul>${data.rules.map(rule => `<li>${esc(rule)}</li>`).join('')}</ul></details><p id="ie-selection-status" class="ie-sr-only" aria-live="polite" aria-atomic="true"></p>
    </div>`;
    mount.querySelector('#ie-region').addEventListener('change', event => { region = event.target.value; renderSelectors(); });
    mount.querySelector('#ie-facility').addEventListener('change', event => { selected = event.target.value; renderFacility(); });
    mount.addEventListener('click', event => {
      const stageButton = event.target.closest('[data-ie-stage]');
      const moneyButton = event.target.closest('[data-ie-money-filter]');
      if (stageButton && mount.contains(stageButton)) { stage = stageButton.dataset.ieStage; renderSelectors(); }
      else if (moneyButton && mount.contains(moneyButton)) { moneyFilter = moneyButton.dataset.ieMoneyFilter; renderMoney(); }
    });
    renderSelectors();
  }

  mount.innerHTML = '<p class="ie-loading" role="status">Loading sourced capacity and investment evidence…</p>';
  fetch('data/investment-evidence.json').then(response => {
    if (!response.ok) throw new Error(`Investment evidence request: ${response.status}`);
    return response.json();
  }).then(value => { data = value; render(); }).catch(() => {
    mount.innerHTML = '<p class="ie-loading" role="status">The investment evidence could not load. Reload to retry; no missing quantities are treated as zero.</p>';
  });
})();
