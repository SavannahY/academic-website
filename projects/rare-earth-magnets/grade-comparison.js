/* Revision-specific supplier properties and separately sourced formulation examples. */
(() => {
  'use strict';

  const mount = document.getElementById('grade-comparison');
  if (!mount) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const link = value => /^https:\/\//.test(String(value)) ? esc(value) : '#';
  const number = value => Number(value).toLocaleString('en-US');
  const graphicNumber = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 3, useGrouping: false });
  const family = grade => grade.suffix || 'standard';
  const familyNames = { all: 'All grades', standard: 'No suffix', H: 'H', SH: 'SH', UH: 'UH' };
  const energyX = value => 14 + (Number(value) - 30) / 25 * 292;
  let dataset;
  let formulations;
  let formulationStatus = 'loading';
  let selected = 'N52';
  let filter = 'all';

  function formulationSources(ids = []) {
    return [...new Set(ids)].map(id => {
      const source = formulations?.sources.find(item => item.id === id);
      if (!source) return '';
      return `<a href="${link(source.url)}" target="_blank" rel="noopener">${esc(source.label || source.title)} ↗<small>${esc(source.kind)}${source.date ? ` · ${esc(source.date)}` : ''}${source.locator ? ` · ${esc(source.locator)}` : ''}</small></a>`;
    }).join('');
  }

  function priceEvidenceLink(item) {
    return `<a href="#${item.panel === 'history' ? 'prices' : 'market-evidence'}" class="gc-price-link" data-gc-price="${esc(item.material)}"${item.view ? ` data-gc-price-view="${esc(item.view)}"` : ''} data-gc-price-panel="${esc(item.panel || 'market')}">${esc(item.label)} ↗<small>${esc(item.basis)}</small></a>`;
  }

  function compositionGraphic(example) {
    const graphic = example.compositionGraphic;
    if (!graphic) return '';
    if (graphic.mode === 'separate-chips') {
      return `<div class="gc-composition-graphic"><p class="gc-graphic-basis">${esc(graphic.basisLabel)}</p>${graphic.groups.map(group => `<div class="gc-atomic-group"><p>${esc(group.label)} · <strong>${esc(group.basis)}</strong></p><ul>${group.items.map(item => `<li><span>${esc(item.label)}</span><strong>${esc(item.valueText)}</strong></li>`).join('')}</ul></div>`).join('')}<p class="gc-graphic-note">${esc(graphic.note)}</p></div>`;
    }
    const palette = { NdPr: '#8aab95', Nd: '#8aab95', Pr: '#b9cbaa', Dy: '#bb785d', Tb: '#e1c393', Fe: '#506457', B: '#91a5b3', other: '#788a80', unspecified: '#39423d' };
    const segments = [...graphic.segments];
    if (graphic.unspecifiedPct > 0) segments.push({ label: 'Unspecified', value: graphic.unspecifiedPct, colorKey: 'unspecified' });
    let position = 0;
    const rectangles = segments.map(segment => {
      const start = position;
      position += Number(segment.value);
      return `<rect x="${start * 5}" y="0" width="${Number(segment.value) * 5}" height="28" fill="${palette[segment.colorKey] || palette.other}"><title>${esc(segment.label)}: ${graphicNumber(segment.value)} wt%</title></rect>`;
    }).join('');
    const accessible = `${graphic.basisLabel}. ${segments.map(segment => `${segment.label} ${graphicNumber(segment.value)} percent`).join('; ')}. Fixed zero to one hundred percent scale; not normalized.`;
    const legend = segments.filter(segment => segment.value >= 1 || segment.colorKey === 'unspecified').map(segment => `<li><i style="background:${palette[segment.colorKey] || palette.other}" aria-hidden="true"></i>${esc(segment.label)} <strong>${graphicNumber(segment.value)}%</strong></li>`).join('');
    return `<div class="gc-composition-graphic"><p class="gc-graphic-basis">${esc(graphic.basisLabel)} · fixed 0–100%</p><svg class="gc-mass-strip" viewBox="0 0 500 28" role="img" aria-label="${esc(accessible)}" focusable="false"><rect width="500" height="28" fill="${palette.unspecified}"/>${rectangles}</svg><ul class="gc-composition-legend">${legend}</ul><p class="gc-graphic-note">${esc(graphic.note)}</p></div>`;
  }

  function formulationExample(reference, grade) {
    const example = formulations.examples.find(item => item.id === reference.id);
    if (!example) return '';
    const ingredients = example.composition.map(item => `<li><span>${esc(item.label)}${item.chinese ? ` <small lang="zh">${esc(item.chinese)}</small>` : ''}</span><strong>${esc(item.valueText)}</strong></li>`).join('');
    const feeds = (example.feedstocks || []).map(item => `<li><strong>${esc(item.label)}</strong><span>${esc(item.note)}</span></li>`).join('');
    const performance = (example.performance || []).map(item => `<li><span>${esc(item.label)}</span><strong>${esc(item.valueText)}</strong></li>`).join('');
    return `<article class="gc-formula-example">
      <p class="gc-evidence-tag">${esc(reference.relationship)}</p><h5>${esc(example.label)}</h5>
      <p class="gc-example-relation">${esc(reference.note)}</p>
      <p class="gc-composition-basis"><strong>Reported designation: ${esc(example.reportedDesignation)}</strong><br>${esc(example.compositionBasis)}</p>
      ${compositionGraphic(example)}
      <details class="gc-exact-composition"><summary>Source-reported ingredients & exact values</summary><ul class="gc-ingredient-list" aria-label="Source-reported composition for ${esc(example.reportedDesignation)}">${ingredients}</ul></details>
      ${(example.criticalMetals || []).length ? `<div class="gc-critical-metals"><p>Rare-earth elements to trace in this example</p><ul aria-label="Rare-earth inputs">${example.criticalMetals.map(metal => `<li>${esc(metal)}</li>`).join('')}</ul></div>` : ''}
      ${feeds ? `<div class="gc-feedstock-notes"><h6>Purchased forms <span lang="zh">采购原料</span></h6><ul>${feeds}</ul></div>` : ''}
      ${(example.balanceNotes || []).length ? `<p class="gc-balance-note">${example.balanceNotes.map(esc).join(' ')}</p>` : ''}
      ${(example.process || []).length ? `<div class="gc-process-notes"><h6>How this example was made</h6><ol>${example.process.map(step => `<li><strong>${esc(step.label)}</strong><span>${esc(step.note)}</span></li>`).join('')}</ol></div>` : ''}
      ${performance ? `<details class="gc-example-performance"><summary>Reported performance · separate from ${esc(grade.grade)} supplier limits</summary><ul>${performance}</ul></details>` : '<p class="gc-unverified-performance">No magnetic-property measurements were verified for this separate example. This does not establish that it meets the supplier limits above.</p>'}
      ${(example.caveats || []).length ? `<aside class="gc-formulation-caveat"><ul>${example.caveats.map(note => `<li>${esc(note)}</li>`).join('')}</ul></aside>` : ''}
      <div class="gc-formulation-sources">${formulationSources(example.sourceIds)}</div>
    </article>`;
  }

  function formulationSection(grade) {
    if (!formulations) return `<section class="gc-formulation"><h4 id="gc-formulation-heading" tabindex="-1">Formulation & critical inputs <small lang="zh">配方与关键原料</small></h4><p>${formulationStatus === 'loading' ? 'Loading the separate formulation evidence…' : 'The separate formulation evidence could not load. Supplier properties above remain available.'}</p></section>`;
    const entry = formulations.grades.find(item => item.grade === grade.grade);
    if (!entry) return '';
    return `<section class="gc-formulation" aria-labelledby="gc-formulation-heading">
      <div class="gc-property-heading"><span class="gc-axis-number">03</span><div><h4 id="gc-formulation-heading" tabindex="-1">Formulation & critical inputs</h4><p lang="zh">配方 · 采购原料 · 价格波动</p></div></div>
      <p class="gc-formulation-intro">${esc(entry.summary)}</p>
      <p class="gc-evidence-boundary">${esc(entry.evidenceBoundary)}</p>
      ${entry.examples.map(reference => formulationExample(reference, grade)).join('')}
      <div class="gc-grade-application"><h5>Where these properties may help</h5><p>${esc(entry.application.summary)}</p><ul>${entry.application.considerations.map(note => `<li>${esc(note)}</li>`).join('')}</ul><p class="gc-application-basis">${esc(entry.application.basis)}</p><div class="gc-formulation-sources">${formulationSources(entry.application.sourceIds)}</div></div>
      <div class="gc-grade-volatility"><h5>Follow the input price evidence</h5><p>${esc(entry.priceNote)}</p><div class="gc-price-links">${entry.priceLinks.map(priceEvidenceLink).join('')}</div></div>
      <p class="gc-formulation-close">${esc(formulations.scope)}</p>
    </section>`;
  }

  function openPriceEvidence(anchor) {
    const material = anchor.dataset.gcPrice;
    if (anchor.dataset.gcPricePanel === 'history') {
      const button = [...document.querySelectorAll('#price-picker [data-price]')].find(item => item.dataset.price === material);
      button?.click();
      return;
    }
    const selector = document.getElementById('market-material');
    if (!selector || ![...selector.options].some(option => option.value === material)) return;
    selector.value = material;
    selector.dispatchEvent(new Event('change', { bubbles: true }));
    const benchmark = document.getElementById('market-benchmark');
    const view = anchor.dataset.gcPriceView;
    if (benchmark && view && [...benchmark.options].some(option => option.value === view)) {
      benchmark.value = view;
      benchmark.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function validFormulations(candidate) {
    if (!Array.isArray(candidate?.grades) || !Array.isArray(candidate.examples) || !Array.isArray(candidate.sources)) return false;
    const sourceIds = new Set(candidate.sources.map(source => source.id));
    const examples = new Map(candidate.examples.map(example => [example.id, example]));
    return dataset.grades.every(grade => {
      const entry = candidate.grades.find(item => item.grade === grade.grade);
      return entry && Array.isArray(entry.examples) && Array.isArray(entry.priceLinks)
        && Array.isArray(entry.application?.considerations) && Array.isArray(entry.application.sourceIds)
        && entry.application.sourceIds.every(id => sourceIds.has(id))
        && entry.examples.every(reference => {
          const example = examples.get(reference.id);
          if (!example || !Array.isArray(example.composition) || !Array.isArray(example.sourceIds)
            || !example.sourceIds.every(id => sourceIds.has(id))) return false;
          const graphic = example.compositionGraphic;
          if (!graphic) return true;
          if (graphic.mode === 'separate-chips') return Array.isArray(graphic.groups) && graphic.groups.every(group => Array.isArray(group.items));
          if (graphic.mode !== 'mass-strip' || !Array.isArray(graphic.segments)) return false;
          const total = graphic.segments.reduce((sum, segment) => sum + Number(segment.value), Number(graphic.unspecifiedPct || 0));
          return graphic.segments.every(segment => Number.isFinite(segment.value) && segment.value >= 0)
            && Number.isFinite(graphic.unspecifiedPct) && graphic.unspecifiedPct >= 0 && Math.abs(total - 100) < .0001;
        });
    });
  }

  function energyRange(grade, selectedView = false) {
    const values = grade.energyProduct.MGOe;
    const min = energyX(values.min);
    const nominal = energyX(values.nominal);
    const max = energyX(values.max);
    return `<svg class="gc-range${selectedView ? ' gc-range-large' : ''}" viewBox="0 0 320 34" aria-hidden="true" focusable="false">
      <path class="gc-range-guide" d="M14 17H306"/>
      <path class="gc-range-band" d="M${min} 17H${max}"/>
      <path class="gc-range-cap" d="M${min} 10V24M${max} 10V24"/>
      <circle class="gc-range-dot" cx="${nominal}" cy="17" r="5"/>
    </svg>`;
  }

  function dateLabel(grade) {
    return grade.sourceDate ? `${esc(grade.sourceDate)} · interpreted from the printed revision` : 'Calendar date ambiguous · kept unassigned';
  }

  function row(grade) {
    const values = grade.energyProduct.MGOe;
    const active = grade.grade === selected;
    const flag = grade.qualityFlags.length ? '<span class="gc-row-note">Source note</span>' : '';
    return `<button type="button" class="gc-grade-row${active ? ' is-selected' : ''}" data-gc-grade="${esc(grade.grade)}" aria-pressed="${active}" aria-controls="gc-selected-detail" aria-label="${esc(grade.grade)}: maximum energy product ${values.min} minimum, ${values.nominal} nominal, ${values.max} maximum MGOe; intrinsic coercivity minimum ${grade.intrinsicCoercivity.min} kiloamperes per meter${grade.qualityFlags.length ? '; source notes available' : ''}">
      <span class="gc-row-name">${esc(grade.grade)}${flag}</span>
      <span class="gc-row-range">${energyRange(grade)}<span class="gc-row-values">${values.min} <span>/</span> ${values.nominal} <span>/</span> ${values.max} <small>MGOe</small></span></span>
      <span class="gc-row-coercivity"><small>Hcj minimum</small>≥ ${number(grade.intrinsicCoercivity.min)} <small>kA/m</small></span>
    </button>`;
  }

  function renderList() {
    const visible = dataset.grades.filter(grade => filter === 'all' || family(grade) === filter);
    if (!visible.some(grade => grade.grade === selected)) selected = visible[0].grade;
    mount.querySelector('#gc-list').innerHTML = visible.map(row).join('');
    mount.querySelector('#gc-grade-select').innerHTML = visible.map(grade => `<option value="${esc(grade.grade)}"${grade.grade === selected ? ' selected' : ''}>${esc(grade.grade)}</option>`).join('');
    mount.querySelectorAll('[data-gc-family]').forEach(button => {
      const active = button.dataset.gcFamily === filter;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    mount.querySelector('#gc-count').textContent = `${visible.length} of ${dataset.grades.length} supplier examples`;
    const explanation = filter === 'all'
      ? 'The N number and the H-family suffix describe different properties. Compare the quoted range and Hcj minimum separately.'
      : dataset.classes.find(item => item.id === filter)?.explanation || '';
    mount.querySelector('#gc-family-explanation').textContent = explanation;
    renderDetail();
  }

  function renderDetail() {
    const grade = dataset.grades.find(item => item.grade === selected);
    const energy = grade.energyProduct.MGOe;
    const si = grade.energyProduct.kJPerM3;
    const coercivity = grade.intrinsicCoercivity;
    const temp = grade.maxUseTemperature;
    const nominalTypical = grade.summaryCatalog.energyProductTypical;
    const position = Math.max(0, Math.min(100, (coercivity.min - 800) / 1300 * 100));
    const flags = grade.qualityFlags.length
      ? `<aside class="gc-source-notes" aria-label="Source notes for ${esc(grade.grade)}"><h4>Source notes · values kept as printed</h4><ul>${grade.qualityFlags.map(flag => `<li>${esc(flag)}</li>`).join('')}</ul></aside>`
      : '<p class="gc-no-flags">No row-specific discrepancy recorded in this evidence check.</p>';

    mount.querySelector('#gc-selected-detail').innerHTML = `
      <div class="gc-selected-head"><div><p class="gc-kicker">Selected supplier example</p><h3 id="gc-selected-title">${esc(grade.grade)}</h3></div><span class="gc-family-tag">${grade.suffix ? `${esc(grade.suffix)} coercivity class` : 'No H-family suffix'}</span></div>
      <p class="gc-selected-context">${esc(grade.supplier)} · sintered NdFeB. This is a published property table for one revision, not a measured batch or a universal grade recipe.</p>
      <a class="gc-formulation-jump" href="#gc-formulation-heading">Ingredients & price exposure ↓</a>

      <section class="gc-property" aria-labelledby="gc-energy-heading"><div class="gc-property-heading"><span class="gc-axis-number">01</span><div><h4 id="gc-energy-heading">Maximum energy product <span>(BH)max</span></h4><p>Magnetic energy density · MGOe</p></div></div>
        ${energyRange(grade, true)}
        <div class="gc-three-values"><div><small>Minimum entry</small><strong>${energy.min}</strong></div><div class="gc-nominal"><small>Nominal entry</small><strong>${energy.nominal}</strong></div><div><small>Maximum entry</small><strong>${energy.max}</strong></div></div>
        <p class="gc-explanation">The nominal entry is the supplier’s reference value inside the quoted interval. The min/max markers are specification-table entries, not statistical percentiles. ${esc(grade.grade)} does not promise a value equal to its grade number.</p>
      </section>

      <section class="gc-property" aria-labelledby="gc-coercivity-heading"><div class="gc-property-heading"><span class="gc-axis-number">02</span><div><h4 id="gc-coercivity-heading">Intrinsic coercivity <span>Hcj</span></h4><p>Resistance to demagnetization · kA/m</p></div></div>
        <p class="gc-coercivity-value"><span>Minimum</span><strong>≥ ${number(coercivity.min)} <small>kA/m</small></strong></p>
        <div class="gc-coercivity-gauge" aria-hidden="true"><div class="gc-coercivity-track"><i style="left:${position}%"></i></div><div class="gc-gauge-labels"><span>800 kA/m</span><span>2,100 kA/m</span></div></div>
        <p class="gc-explanation">A higher Hcj means greater resistance to an opposing magnetic field. Heat generally lowers that resistance. H/SH/UH classes relate to this property; they do not specify how much Dy or Tb the alloy contains.</p>
      </section>

      <section class="gc-temperature" aria-labelledby="gc-temperature-heading"><div><h4 id="gc-temperature-heading">Catalog temperature · separate source</h4><strong>${temp.celsius}°C</strong></div><div><p>Historical catalog’s Tw max entry for this row. <strong>Application dependent:</strong> check the part’s shape, magnetic circuit, opposing fields and acceptable flux loss. It is not the Curie temperature or a guaranteed system operating limit.</p><a href="${link(temp.sourceUrl)}" target="_blank" rel="noopener">Summary catalog · Rev. ${esc(temp.sourceRevision)} · ${esc(temp.sourceDate)}</a></div></section>

      <div class="gc-source"><a href="${link(grade.sourceUrl)}" target="_blank" rel="noopener">Open ${esc(grade.grade)} supplier sheet ↗</a><p><strong>Printed Rev. ${esc(grade.sourceRevision)}</strong><br>${dateLabel(grade)}<br>Magnetic Properties table · PDF page 1 · verified ${esc(grade.verifiedOn)}</p><p>Upload-folder and filename dates are not treated as the document revision.</p></div>
      ${flags}
      <details class="gc-quoted-details"><summary>More quoted fields & reporting basis</summary><dl><dt>Energy product · kJ/m³, as printed</dt><dd>${si.min} / ${si.nominal} / ${si.max} <span>(min / nominal / max)</span></dd><dt>Residual induction Br · mT, as printed</dt><dd>${grade.residualInduction.mT.min} / ${grade.residualInduction.mT.nominal} / ${grade.residualInduction.mT.max}</dd><dt>Historical summary’s typical energy product</dt><dd>${nominalTypical ? `${nominalTypical.MGOe} MGOe · a different field from the individual sheet’s nominal entry` : esc(grade.summaryCatalog.basis)}</dd></dl><p>SI and CGS entries are quoted independently from the same sheet. Where they disagree, this view keeps both and shows a source note; it does not silently convert or repair them.</p></details>
      ${formulationSection(grade)}`;

    mount.querySelectorAll('[data-gc-grade]').forEach(button => {
      const active = button.dataset.gcGrade === selected;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    mount.querySelector('#gc-selection-status').textContent = `${grade.grade} selected. Energy product ${energy.min} to ${energy.max} MGOe, nominal ${energy.nominal}. Intrinsic coercivity minimum ${number(coercivity.min)} kA/m. ${grade.qualityFlags.length} source notes.`;
    mount.querySelector('#gc-view-detail').textContent = `Read ${grade.grade} details ↑`;
    mount.querySelector('#gc-grade-select').value = selected;
  }

  function render() {
    mount.innerHTML = `<div class="gc-shell">
      <div class="gc-intro"><p class="gc-kicker">Thirteen primary supplier examples · verified ${esc(dataset.asOf)}</p><h3>A grade has more than one dimension.</h3><p>A higher energy product can help obtain useful magnetic output from less magnet volume. It does not by itself give a motor’s torque, a magnet’s pull force or its heat tolerance.</p></div>
      <div class="gc-reading-key"><div><span class="gc-key-symbol">N<span>52</span></span><p><strong>Number → energy-product class</strong>The individual sheet gives the actual min, nominal and max values. N52 here is 49 / 51 / 53 MGOe.</p></div><div><span class="gc-key-symbol">N35<span>SH</span></span><p><strong>Suffix → coercivity class</strong>Compare resistance to demagnetization separately. A smaller N number can have a higher Hcj.</p></div></div>
      <div class="gc-toolbar"><div class="gc-family-filters" role="group" aria-label="Filter supplier examples by coercivity family">${Object.entries(familyNames).map(([id, label]) => `<button type="button" data-gc-family="${id}" aria-pressed="${id === filter}">${label}</button>`).join('')}</div><label class="gc-grade-select-label" for="gc-grade-select">Open a grade<select id="gc-grade-select"></select></label><p id="gc-count" role="status"></p></div>
      <p id="gc-family-explanation" class="gc-filter-explanation"></p>
      <div class="gc-layout"><article id="gc-selected-detail" class="gc-selected-detail" aria-labelledby="gc-selected-title" tabindex="-1"></article><div class="gc-browser"><h3>Compare quoted energy ranges</h3><p>Choose any row. Every graphic uses the same 30–55 MGOe axis, so interval positions can be compared.</p><div class="gc-browser-axis" aria-hidden="true"><span></span><svg viewBox="0 0 320 24" focusable="false">${[30, 35, 40, 45, 50, 55].map(value => `<text x="${energyX(value)}" y="16" text-anchor="${value === 30 ? 'start' : value === 55 ? 'end' : 'middle'}">${value}</text>`).join('')}</svg><span>MGOe</span></div><div id="gc-list" class="gc-list" role="group" aria-label="Choose a documented grade"></div><p class="gc-range-key"><i></i> Line ends = min/max · filled dot = nominal.<br>Values below each line read min / nominal / max.</p><button type="button" id="gc-view-detail" class="gc-view-detail" aria-controls="gc-selected-detail">Read selected grade details ↑</button></div></div>
      <p class="gc-footnote">These revision-specific Arnold examples are not universal standards, stock availability, grade-specific formulations or engineering guarantees. Higher N does not automatically mean more dysprosium or terbium; material composition and processing must be established separately.</p>
      <p id="gc-selection-status" class="gc-sr-only" aria-live="polite" aria-atomic="true"></p>
    </div>`;
    mount.addEventListener('click', event => {
      const familyButton = event.target.closest('[data-gc-family]');
      const gradeButton = event.target.closest('[data-gc-grade]');
      const priceAnchor = event.target.closest('[data-gc-price]');
      if (priceAnchor && mount.contains(priceAnchor)) {
        openPriceEvidence(priceAnchor);
      } else if (event.target.closest('#gc-view-detail')) {
        mount.querySelector('#gc-selected-detail').focus();
      } else if (familyButton && mount.contains(familyButton)) {
        filter = familyButton.dataset.gcFamily;
        renderList();
      } else if (gradeButton && mount.contains(gradeButton)) {
        selected = gradeButton.dataset.gcGrade;
        renderDetail();
      }
    });
    mount.querySelector('#gc-grade-select').addEventListener('change', event => {
      selected = event.target.value;
      renderDetail();
    });
    renderList();
  }

  mount.innerHTML = '<p class="gc-loading" role="status">Loading verified supplier grade examples…</p>';
  const readJSON = path => fetch(path).then(response => {
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  });
  Promise.allSettled([readJSON('data/grade-catalog.json'), readJSON('data/grade-formulations.json')]).then(results => {
    if (results[0].status !== 'fulfilled') throw new Error('Grade catalog unavailable');
    const data = results[0].value;
    if (!Array.isArray(data.grades) || !data.grades.length) throw new Error('No verified grade rows available');
    dataset = data;
    if (results[1].status === 'fulfilled') {
      const candidate = results[1].value;
      if (validFormulations(candidate)) formulations = candidate;
    }
    formulationStatus = formulations ? 'ready' : 'unavailable';
    if (!dataset.grades.some(grade => grade.grade === selected)) selected = dataset.grades[0].grade;
    render();
  }).catch(() => {
    mount.innerHTML = '<p class="gc-loading" role="status">The grade comparison could not load. Reload the page to retry. The individual supplier sources remain available in the field guide.</p>';
  });
})();
