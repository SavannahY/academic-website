(function () {
  'use strict';
  const host = document.getElementById('market-evidence');
  if (!host) return;
  const colors = ['#d7b47b', '#79a491', '#b88976', '#94aaca'];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const number = value => Number(value).toLocaleString('en-US', {maximumFractionDigits: 2});
  const axisUnit = benchmark => `${benchmark.currency} / ${benchmark.price_per_unit === 'metric ton of combined imported products' ? 'product tonne' : benchmark.price_per_unit === 'dry metric ton' ? 'dry tonne' : benchmark.price_per_unit}`;
  let data, selectedView, selectedContext;
  const source = id => data.sources.find(item => item.id === id);
  const sourceLink = id => {
    const item = source(id);
    return item ? `<a href="${escape(item.url)}" target="_blank" rel="noopener">${escape(item.title)}</a>` : '';
  };
  const sourcesFor = view => [...new Set(view.series.flatMap(item => item.points.map(point => point.source_id)))];
  function plotLayout(unit) {
    return {
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
      font: {family: 'Arial, sans-serif', color: '#b3bdb1', size: 12},
      margin: {l: 64, r: 16, t: 16, b: 82},
      xaxis: {type: 'category', gridcolor: '#26352d', linecolor: '#405245', tickfont: {size: 11}, fixedrange: false},
      yaxis: {title: {text: unit, font: {size: 11}, standoff: 10}, rangemode: 'tozero', gridcolor: '#26352d', tickformat: '~s', fixedrange: false, automargin: true},
      legend: {orientation: 'h', y: -0.22, x: 0, font: {size: 11}},
      hoverlabel: {bgcolor: '#17231d', bordercolor: '#b89561', font: {color: '#eee9d8'}},
      hovermode: 'closest', uirevision: 'selected-evidence'
    };
  }
  const plotConfig = {responsive: true, displaylogo: false, displayModeBar: false};
  function paddedPoints(series) {
    const points = series.points.slice().sort((a, b) => a.period.localeCompare(b.period));
    if (series.period_type !== 'annual' || !points.every(point => /^\d{4}$/.test(point.period))) return points;
    const first = Number(points[0].period), last = Number(points.at(-1).period);
    const byYear = new Map(points.map(point => [Number(point.period), point]));
    return Array.from({length: last - first + 1}, (_, index) => byYear.get(first + index) || {period: String(first + index), value: null, missing: true});
  }
  function priceTrace(series, index, view) {
    const points = paddedPoints(series);
    const unit = `${series.benchmark.currency} / ${series.benchmark.price_per_unit}`;
    const common = {
      name: series.label, x: points.map(point => point.period), y: points.map(point => point.value),
      customdata: points.map(point => [point.estimated ? 'Estimated by source' : point.missing ? 'Unavailable' : 'Reported observation', point.source_locator || '']),
      hovertemplate: `<b>%{x}</b><br>%{y:,.2f} ${escape(unit)}<br>%{customdata[0]}<extra>%{fullData.name}</extra>`,
      marker: {color: colors[index % colors.length]},
      connectgaps: false
    };
    if (view.mode === 'bar') return {...common, type: 'bar', marker: {color: colors[index % colors.length]}};
    return {...common, type: 'scatter', mode: points.length === 1 ? 'markers' : 'lines+markers',
      line: {color: colors[index % colors.length], width: 2.5},
      marker: {color: colors[index % colors.length], size: 8, symbol: points.map(point => point.estimated ? 'diamond-open' : 'circle')}
    };
  }
  function priceTable(view) {
    if (!view.series.length) return '';
    const rows = view.series.flatMap(item => item.points.map(point => `<tr><td>${escape(item.label)}</td><td>${escape(point.period)}${point.estimated ? ' · estimate' : ''}</td><td>${number(point.value)}</td><td>${escape(item.benchmark.currency)} / ${escape(item.benchmark.price_per_unit)}</td><td>${sourceLink(point.source_id)}<small>${escape(point.source_locator)}</small></td></tr>`));
    return `<details class="market-drawer"><summary>Read exact source values</summary><div class="market-table-wrap"><table><caption>Separate source-defined series; no currency, tax or product conversion</caption><thead><tr><th scope="col">Series</th><th scope="col">Period</th><th scope="col">Value</th><th scope="col">Unit</th><th scope="col">Source</th></tr></thead><tbody>${rows.join('')}</tbody></table></div></details>`;
  }
  function drawPrice(id) {
    selectedView = data.views.find(view => view.id === id);
    const view = selectedView;
    document.getElementById('market-price-title').textContent = view.title;
    document.getElementById('market-price-explanation').textContent = view.explanation;
    document.getElementById('market-price-scope').textContent = view.scope_note;
    document.getElementById('market-price-unit').textContent = view.series.length ? `${view.series[0].benchmark.currency} / ${view.series[0].benchmark.price_per_unit} · ${view.series[0].period_type} observations · hollow diamonds mark source estimates` : '';
    const material = data.materials.find(item => item.id === view.material);
    document.getElementById('market-purchase-form').textContent = `Factory form: ${material.purchase_form}`;
    const chart = document.getElementById('market-price-plot');
    const gap = document.getElementById('market-price-gap');
    const download = document.getElementById('market-download');
    chart.hidden = !view.series.length;
    gap.hidden = Boolean(view.series.length);
    download.disabled = !view.series.length;
    document.getElementById('market-values').innerHTML = priceTable(view);
    const refs = data.external_references.filter(item => item.material === view.material);
    document.getElementById('market-reference-links').innerHTML = refs.length ? `<p class="market-reference-label">Product references</p>${refs.map(item => `<a href="${escape(item.url)}" target="_blank" rel="noopener">${escape(item.title)}<small>${escape(item.reason)}</small></a>`).join('')}` : '';
    document.getElementById('market-metadata').innerHTML = view.series.map(item => {
      const b = item.benchmark;
      return `<article><h4>${escape(item.label)}</h4><p>${escape(b.chemical_form)} · ${escape(b.grade_or_assay)}</p><p><strong>Statistic:</strong> ${escape(b.statistic)}<br><strong>Location:</strong> ${escape(b.geography)}<br><strong>Delivery:</strong> ${escape(b.incoterm_or_delivery_basis)}<br><strong>Tax:</strong> ${escape(b.tax_basis)}</p><p><strong>Provider:</strong> ${escape(b.provider)}<br><strong>Reuse:</strong> ${escape(b.reuse)}</p>${b.comparability_warning ? `<p>${escape(b.comparability_warning)}</p>` : ''}</article>`;
    }).join('') || '<p>A quote requires its own date, grade, lot, delivery and tax terms. No price has been substituted.</p>';
    document.getElementById('market-price-sources').innerHTML = sourcesFor(view).map(sourceLink).join('');
    if (!view.series.length) {
      if (window.Plotly) window.Plotly.purge(chart);
      return;
    }
    const b = view.series[0].benchmark;
    const unit = `${b.currency} / ${b.price_per_unit}`;
    chart.setAttribute('aria-label', `${view.title}. ${unit}. ${view.series.map(item => `${item.label}: ${item.points.map(point => `${point.period}, ${number(point.value)}${point.estimated ? ', estimated' : ''}`).join('; ')}`).join('. ')}`);
    window.Plotly.react(chart, view.series.map((item, index) => priceTrace(item, index, view)), plotLayout(axisUnit(b)), plotConfig);
  }
  function setMaterial(material, preferredView) {
    const select = document.getElementById('market-material');
    const benchmark = document.getElementById('market-benchmark');
    select.value = material;
    const choices = data.views.filter(view => view.material === material);
    benchmark.innerHTML = choices.map(view => `<option value="${escape(view.id)}">${escape(view.label)}</option>`).join('');
    benchmark.value = choices.some(view => view.id === preferredView) ? preferredView : choices[0].id;
    host.querySelectorAll('[data-market-material]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.marketMaterial === material)));
    drawPrice(benchmark.value);
  }
  function drawContext(id) {
    selectedContext = data.context_views.find(view => view.id === id);
    const view = selectedContext;
    const chart = document.getElementById('market-context-plot');
    document.getElementById('market-context-title').textContent = view.title;
    document.getElementById('market-context-basis').textContent = `${view.geography} · ${view.measure} · ${view.unit}`;
    document.getElementById('market-context-caveat').textContent = view.caveat;
    document.getElementById('market-context-sources').innerHTML = view.source_ids.map(sourceLink).join('');
    chart.setAttribute('aria-label', `${view.title}. ${view.unit}. ${view.series.map(item => item.label + ': ' + item.periods.map((period, index) => `${period}, ${number(item.values[index])}${item.estimated_periods.includes(period) ? ', estimated' : ''}`).join('; ')).join('. ')}`);
    const traces = view.series.map((item, index) => ({type: 'scatter', mode: 'lines+markers', name: item.label,
      x: item.periods, y: item.values, connectgaps: false,
      line: {color: colors[index], width: 2.5},
      marker: {color: colors[index], size: 8, symbol: item.periods.map(period => item.estimated_periods.includes(period) ? 'diamond-open' : 'circle')},
      customdata: item.periods.map(period => item.estimated_periods.includes(period) ? 'Estimated by source' : 'Reported observation'),
      hovertemplate: `<b>%{x}</b><br>%{y:,.2f}<br>%{customdata}<extra>%{fullData.name}</extra>`
    }));
    const layout = plotLayout('');
    window.Plotly.react(chart, traces, layout, plotConfig);
    document.getElementById('market-context-values').innerHTML = `<details class="market-drawer"><summary>Read exact output / trade values</summary><div class="market-table-wrap"><table><caption>${escape(view.unit)} · ${escape(view.measure)}</caption><thead><tr><th scope="col">Series</th><th scope="col">Period</th><th scope="col">Value</th></tr></thead><tbody>${view.series.flatMap(item => item.periods.map((period, index) => `<tr><td>${escape(item.label)}</td><td>${escape(period)}${item.estimated_periods.includes(period) ? ' · estimate' : ''}</td><td>${number(item.values[index])}</td></tr>`)).join('')}</tbody></table></div></details>`;
  }
  function mount() {
    host.classList.add('market-evidence');
    host.innerHTML = `<section class="section-wrap material-section" aria-labelledby="market-heading">
      <div class="material-heading"><div><p class="eyebrow">Price evidence / the purchased form</p><h2 id="market-heading">A quote starts<br><em>with a product.</em></h2></div><p>A magnet factory may buy NdPr metal, DyFe and ferroboron. Follow their own price evidence, then compare the upstream forms without treating them as the same material.</p></div>
      <div class="market-feed-shortcuts" aria-label="Common purchased feedstocks"><button type="button" data-market-material="NdPr" data-market-view="ndpr-purchase-annual"><b>Nd + Pr</b><span>Combined metal alloy · 镨钕金属</span></button><button type="button" data-market-material="Dy" data-market-view="dyfe-market-2015"><b>Dy + Fe</b><span>Dysprosium–iron master alloy · 镝铁</span></button><button type="button" data-market-material="B" data-market-view="feb-quote-gap"><b>Fe + B</b><span>Ferroboron master alloy · 硼铁</span></button></div>
      <div class="market-explorer"><div class="market-controls"><label>Ingredient<select id="market-material">${data.materials.map(item => `<option value="${escape(item.id)}">${escape(item.label)}</option>`).join('')}</select></label><label>Price evidence<select id="market-benchmark"></select></label></div>
        <div class="market-chart-head"><div><p id="market-purchase-form" class="market-form-label"></p><h3 id="market-price-title"></h3></div><button id="market-download" type="button">Download selected evidence</button></div>
        <p id="market-price-explanation" class="market-explanation" role="status"></p><p id="market-price-unit" class="market-unit"></p>
        <div id="market-price-plot" class="market-plot" role="img" aria-label="Selected public price evidence"></div>
        <div id="market-price-gap" class="market-gap" hidden><span aria-hidden="true">?</span><div><h4>Purchase price remains unknown.</h4><p>Choose an upstream benchmark above, or open the product references below. A real factory quote must match the purchased form.</p></div></div>
        <p id="market-price-scope" class="market-scope"></p><div id="market-price-sources" class="market-source-links"></div><div id="market-values"></div>
        <details class="market-drawer"><summary>Product basis, taxes & rights</summary><div id="market-metadata" class="market-metadata"></div></details><div id="market-reference-links" class="market-reference-links"></div>
      </div>
      <div class="market-context"><div class="market-context-intro"><p class="eyebrow">A separate supply lens</p><h3>Tonnes of what?</h3><p>Production, trade and consumption answer different questions. The same element can be counted as B₂O₃ content, borate product mass, or ferroboron feed.</p><label>Supply evidence<select id="market-context-select">${data.context_views.map(view => `<option value="${escape(view.id)}">${escape(view.label)}</option>`).join('')}</select></label></div><div class="market-context-chart"><h4 id="market-context-title"></h4><p id="market-context-basis"></p><div id="market-context-plot" class="market-plot market-context-plot" role="img" aria-label="Selected supply evidence"></div><p id="market-context-caveat"></p><div id="market-context-sources" class="market-source-links"></div><div id="market-context-values"></div></div></div>
      <div class="market-driver-intro"><p class="eyebrow">Why prices moved / reported explanations</p><h3>Read the mechanism<br><em>alongside the graph.</em></h3><p>These accounts come from dated reports. A timeline alone cannot measure a policy’s causal effect, and annual values cannot establish monthly seasonality.</p></div><div class="market-drivers">${data.drivers.map(item => `<article><p class="market-driver-date">${escape(item.period)}</p><h4>${escape(item.title)}</h4><p>${escape(item.text)}</p><small>${escape(item.scope)}</small><div class="market-source-links">${item.source_ids.map(sourceLink).join('')}</div></article>`).join('')}</div>
      <details class="market-drawer market-coverage"><summary>Where evidence is still missing</summary><ul>${data.gaps.map(gap => `<li>${escape(gap)}</li>`).join('')}</ul><p>Source check: ${escape(data.as_of)}. Restricted assessment values are absent from this page’s dataset and downloads.</p></details>
    </section>`;
    document.getElementById('market-material').addEventListener('change', event => setMaterial(event.target.value));
    document.getElementById('market-benchmark').addEventListener('change', event => drawPrice(event.target.value));
    document.getElementById('market-context-select').addEventListener('change', event => drawContext(event.target.value));
    host.querySelectorAll('[data-market-material]').forEach(button => button.addEventListener('click', () => setMaterial(button.dataset.marketMaterial, button.dataset.marketView)));
    document.getElementById('market-download').addEventListener('click', () => {
      if (!selectedView.series.length) return;
      const ids = sourcesFor(selectedView);
      const payload = {as_of: data.as_of, view: selectedView, sources: data.sources.filter(item => ids.includes(item.id)), note: 'Separate source-defined series. No price values from restricted publishers. Not a factory purchase quote.'};
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'}));
      const link = document.createElement('a');
      link.href = url; link.download = `rare-earth-${selectedView.id}.json`; link.click(); URL.revokeObjectURL(url);
    });
    setMaterial('NdPr', 'ndpr-purchase-annual');
    document.getElementById('market-context-select').value = 'borates-producer-output';
    drawContext('borates-producer-output');
  }
  fetch('data/market-evidence.json').then(response => {
    if (!response.ok) throw new Error('Market evidence could not be loaded.');
    return response.json();
  }).then(result => {
    data = result;
    if (!window.Plotly) throw new Error('Chart library is unavailable.');
    mount();
  }).catch(error => {
    host.innerHTML = `<section class="section-wrap material-section"><h2>Purchased-form price evidence</h2><p role="status">${escape(error.message)} The sourced twenty-year charts above remain available.</p></section>`;
  });
})();
