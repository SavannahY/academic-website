/* Source-native supply quantities: bands share a scale only inside one declared partition. */
(() => {
  'use strict';
  const mount = document.getElementById('supply-quantities');
  if (!mount) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const finite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const sum = values => values.reduce((total, value) => total + (finite(value) ? value : 0), 0);
  const distinct = (...values) => [...new Set(values.flat().filter(Boolean))];
  const readable = value => String(value ?? '').replace(/[_-]/g, ' ');
  const dataURL = new URL('data/material-supply-quantities.json', document.baseURI);
  const palette = ['#c5a46b', '#8aab95', '#77a8b8', '#d29672', '#aaa4ce', '#b7bf82', '#a0afb1'];
  const rareEarthOrder = ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Y', 'Sc'];
  const statuses = ['reported', 'evidence_estimated', 'partial', 'scenario', 'not_mined'];
  let packet, selectedMaterial = 'NdPr', selectedDataset = '', selectedYear = 'all', statusFilter = 'all', constituent = '', language = 'en', inspection = '', view;
  let elementsOpen = true, exactOpen = false, quotaOpen = false, selectedQuota = '';
  let quotaRecords = [];
  const scenarios = new Map();
  const t = (en, zh) => language === 'zh' ? zh : en;
  const txt = (record, key, fallback = '') => language === 'zh' ? (record?.[`${key}_zh`] || record?.[key] || record?.[`${key}_en`] || fallback) : (record?.[key] || record?.[`${key}_en`] || fallback);
  const format = (value, digits = 3) => finite(value) ? value.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {maximumFractionDigits: digits}) : t('Unknown', '未知');
  const quantity = record => record?.record_type === 'below_precision' ? t('Below published precision', '低于公布精度') : finite(record?.value) ? format(record.value) : Array.isArray(record?.range) && record.range.length === 2 ? `${format(record.range[0])}–${format(record.range[1])}` : t('Unknown', '未知');
  const percent = (value, denominator) => finite(value) && finite(denominator) && denominator > 0 ? `${format(value / denominator * 100, 2)}%` : t('Unknown', '未知');
  const statusLabel = status => ({reported:t('Reported', '已报告'), evidence_estimated:t('Source-based estimate', '基于来源的估计'), partial:t('Partial evidence', '部分证据'), scenario:t('Illustrative scenario', '说明性情景'), not_mined:t('Not mined', '非开采来源'), quota:t('Authorized quota', '核定配额')}[status] || readable(status));
  const option = () => packet.material_options.find(item => item.id === selectedMaterial);
  const datasets = () => packet.datasets.filter(item => item.material === selectedMaterial);
  const profile = () => packet.datasets.find(item => item.id === selectedDataset);
  const source = id => packet.sources.find(item => item.id === id) || packet.china_quota_context?.sources?.find(item => item.id === id);
  const ids = record => Array.isArray(record?.source_ids) ? record.source_ids : Array.isArray(record?.sources) ? record.sources : [];
  const badge = status => `<span class="sq-status" data-supply-status="${esc(status)}">${esc(statusLabel(status))}</span>`;
  const safeURL = value => { try { const url = new URL(value, document.baseURI); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch { return ''; } };

  function sourcesHTML(sourceIds) {
    const rows = distinct(sourceIds || []).map(source).filter(Boolean);
    if (!rows.length) return `<p>${t('No reported source is assigned to this record.', '此记录未赋予报告来源。')}</p>`;
    return `<ul class="sq-source-list">${rows.map(row => {
      const href = safeURL(row.url);
      return `<li>${href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(txt(row, 'title', txt(row, 'label', row.id)))} ↗</a>` : esc(txt(row, 'title', row.id))}<small>${row.date || row.publication_date ? `${t('Published', '发布日期')} ${esc(row.date || row.publication_date)}` : t('Publication date not specified', '未注明发布日期')}${row.checked_at ? ` · ${t('Checked', '核查日期')} ${esc(row.checked_at)}` : ''}${row.locator ? ` · ${esc(txt(row, 'locator'))}` : ''}</small>${row.limit ? `<span class="sq-source-limit">${esc(txt(row, 'limit'))}</span>` : ''}${row.primary_source_status ? `<span class="sq-source-limit">${esc(txt(row, 'primary_source_status'))}</span>` : ''}</li>`;
    }).join('')}</ul>`;
  }

  function formulaHTML(formula, range) {
    if (!formula && !Array.isArray(range)) return '';
    return `<section class="sq-formula"><h5>${t('Calculation & assumptions', '计算与假设')}</h5>${formula?.expression ? `<code>${esc(formula.expression)}</code>` : ''}${(formula?.inputs || []).map(input => `<div class="sq-formula-input"><strong>${esc(txt(input, 'name'))}</strong> · ${esc(format(input.value, 10))} ${esc(input.unit || '')}${sourcesHTML(ids(input))}</div>`).join('')}${(formula?.assumptions || []).length ? `<h5>${t('Assumptions', '假设')}</h5><ul>${formula.assumptions.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}${(formula?.limitations || []).length ? `<h5>${t('Limits', '限制')}</h5><ul>${formula.limitations.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}${Array.isArray(range) ? `<p class="sq-range-note">${t('Source / assumption range', '来源 / 假设范围')}: ${esc(format(range[0]))}–${esc(format(range[1]))}. ${t('No midpoint or statistical confidence interval is inferred.', '不推断中点或统计置信区间。')}</p>` : ''}</section>`;
  }

  function availableProfiles() {
    return datasets().filter(item => (statusFilter === 'all' ? item.status !== 'scenario' : item.status === statusFilter) && (selectedYear === 'all' || String(item.year) === selectedYear));
  }

  function chooseProfile(requested = '') {
    const choices = availableProfiles();
    const preferred = requested || option()?.default_dataset_id;
    selectedDataset = choices.some(item => item.id === preferred) ? preferred : choices[0]?.id || '';
    inspection = '';
    const panels = profile()?.constituent_panels || [];
    if (!panels.some(panel => panel.material === constituent)) constituent = panels[0]?.material || '';
  }

  function updateURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('supply_material', selectedMaterial);
    if (selectedDataset) url.searchParams.set('supply_dataset', selectedDataset); else url.searchParams.delete('supply_dataset');
    if (selectedYear !== 'all') url.searchParams.set('supply_year', selectedYear); else url.searchParams.delete('supply_year');
    if (statusFilter !== 'all') url.searchParams.set('supply_status', statusFilter); else url.searchParams.delete('supply_status');
    if (constituent) url.searchParams.set('supply_constituent', constituent); else url.searchParams.delete('supply_constituent');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function originLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('origin_material', selectedMaterial); url.hash = 'mining-origin-details';
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function controlsHTML() {
    const all = datasets(), choices = availableProfiles();
    const years = distinct(all.map(item => item.year).filter(value => value !== null && value !== undefined)).sort((a, b) => Number(b) - Number(a));
    const kinds = [['purchased-alloy', t('Purchased alloys', '购入合金')], ['rare-earth-element', t('All 17 rare-earth elements', '全部 17 种稀土元素')], ['non-rare-earth-element', t('Other elements · non-REE', '其他元素 · 非稀土')]];
    const materialOptions = kinds.map(([kind, label]) => `<optgroup label="${esc(label)}">${packet.material_options.filter(item => item.kind === kind).map(item => `<option value="${esc(item.id)}"${item.id === selectedMaterial ? ' selected' : ''}>${esc(txt(item, 'label', item.id))}</option>`).join('')}</optgroup>`).join('');
    const chips = list => list.map(item => `<button type="button" class="sq-material-chip${item.id === selectedMaterial ? ' active' : ''}" data-supply-material="${esc(item.id)}" data-supply-material-kind="${esc(item.kind)}" aria-label="${esc(txt(item, 'label', item.id))}" title="${esc(txt(item, 'label', item.id))}" aria-pressed="${item.id === selectedMaterial}"><b>${esc(item.id)}</b>${item.kind === 'purchased-alloy' ? `<span>${esc(txt(item, 'label', item.id))}</span>` : ''}</button>`).join('');
    const elements = packet.material_options.filter(item => item.kind === 'rare-earth-element').sort((a, b) => rareEarthOrder.indexOf(a.id) - rareEarthOrder.indexOf(b.id));
    return `<header class="sq-header"><div><p class="sq-kicker">${t('Quantitative supply flow', '定量供应流量')}</p><h3>${t('Follow supply on its own basis.', '沿材料自身口径追踪供应。')}</h3><p>${t('Choose a material and source. Widths encode comparable native quantities; unknown origins remain explicit.', '选择材料与来源；带宽表示可比原始数量，未知产地保持明确。')}</p></div><label class="sq-language" for="sq-language">${t('Chart language', '图表语言')}<select id="sq-language"><option value="en"${language === 'en' ? ' selected' : ''}>English</option><option value="zh"${language === 'zh' ? ' selected' : ''}>中文</option></select></label></header><div class="sq-controls"><label for="sq-material">${t('Material / purchased form', '材料 / 购入形态')}<select id="sq-material" data-supply-material-select>${materialOptions}</select></label><label for="sq-dataset">${t('Source dataset', '来源数据集')}<select id="sq-dataset"${choices.length ? '' : ' disabled'}>${choices.length ? choices.map(item => `<option value="${esc(item.id)}"${item.id === selectedDataset ? ' selected' : ''}>${esc(txt(item, 'label', item.id))} · ${esc(statusLabel(item.status))}</option>`).join('') : `<option>${t('No dataset for these filters', '当前筛选无数据集')}</option>`}</select></label><label for="sq-year">${t('Dataset year', '数据集年份')}<select id="sq-year"><option value="all"${selectedYear === 'all' ? ' selected' : ''}>${t('All years', '全部年份')}</option>${years.map(year => `<option value="${esc(year)}"${String(year) === selectedYear ? ' selected' : ''}>${esc(year)}</option>`).join('')}</select></label><label for="sq-status">${t('Evidence state', '证据状态')}<select id="sq-status"><option value="all"${statusFilter === 'all' ? ' selected' : ''}>${t('All evidence', '全部证据')}</option>${statuses.map(status => `<option value="${status}"${statusFilter === status ? ' selected' : ''}${all.some(item => item.status === status) ? '' : ' disabled'}>${esc(statusLabel(status))}</option>`).join('')}</select></label></div><div class="sq-alloys" role="group" aria-label="${t('Purchased alloy choices', '购入合金选择')}">${chips(packet.material_options.filter(item => item.kind === 'purchased-alloy'))}</div><details class="sq-elements"${elementsOpen ? ' open' : ''}><summary>${t('All 17 rare-earth elements', '全部 17 种稀土元素')} <small>La–Lu + Y + Sc</small></summary><div class="sq-element-grid" role="group" aria-label="${t('Choose a rare-earth element', '选择稀土元素')}">${chips(elements)}</div><div class="sq-non-ree" role="group" aria-label="${t('Non rare-earth constituents', '非稀土元素')}"><span>${t('Other magnet constituents · non-REE', '其他磁体元素 · 非稀土')}</span>${chips(packet.material_options.filter(item => item.kind === 'non-rare-earth-element'))}</div></details>`;
  }

  function residual(parent, children, given, label, id) {
    const remainder = Math.max(0, parent.value - sum(children.map(item => item.value)));
    if (given && finite(given.value)) return {...given, id:given.id || id, label:given.label || label};
    return {id, label, value:remainder, status:'partial', source_ids:distinct(ids(parent), children.flatMap(ids)), note:t('Quantity is the parent total minus the assigned comparable rows. Its specific geography is unknown.', '数量等于父级总量减去已分配的可比行；具体地理分布未知。'), formula:{expression:`${parent.value} − (${children.map(item => item.value).join(' + ') || '0'}) = ${remainder}`, inputs:[{name:t('Parent total', '父级总量'), value:parent.value, unit:parent.unit, source_ids:ids(parent)}], assumptions:[t('The listed children use the same year, stage and unit as their parent.', '列出的子级与父级使用相同年份、阶段与单位。')], limitations:[t('The residual is not assigned to a named country or province.', '剩余量不赋予任何具名国家或省份。')]}};
  }

  function userScenario(dataset) {
    const values = scenarios.get(dataset.id) || {total:'', china:'', province:'', provinceShare:''};
    const parse = raw => raw === '' ? null : Number(raw);
    const total = parse(values.total), chinaShare = parse(values.china), provinceShare = parse(values.provinceShare);
    const validShare = value => value === null || (finite(value) && value <= 100);
    const error = !validShare(chinaShare) || !validShare(provinceShare) || (total !== null && !finite(total));
    if (!finite(total) || total <= 0 || error) return {...dataset, global_total:null, countries:[], unallocated:null, partial_records:[], scenario_warning:error ? t('Shares must be 0–100 and the total must be nonnegative. No chart is calculated from invalid inputs.', '份额须为 0–100，总量不得为负；无效输入不会生成图表。') : ''};
    const chinaValue = chinaShare === null ? 0 : total * chinaShare / 100;
    const provinces = values.province.trim() && provinceShare !== null ? [{id:'user-province', label:values.province.trim(), value:chinaValue * provinceShare / 100, status:'scenario', source_ids:[], formula:{expression:`${chinaValue} × ${provinceShare}%`, assumptions:[t('Province share is entered by the user.', '省份份额由用户输入。')]}}] : [];
    return {...dataset, global_total:{value:total, unit:dataset.unit, source_ids:[]}, countries:chinaShare === null ? [] : [{id:'user-china', label:t('China · user allocation', '中国 · 用户分配'), country:'China', value:chinaValue, status:'scenario', source_ids:[], provinces, unallocated:{id:'user-china-unallocated', label:t('China province unallocated · scenario', '中国省份未分配 · 情景'), value:chinaValue - sum(provinces.map(item => item.value)), status:'scenario', source_ids:[]}, formula:{expression:`${total} × ${chinaShare}%`, assumptions:[t('China share is entered by the user.', '中国份额由用户输入。')]}}], unallocated:{id:'user-global-unallocated', label:t('Other / unassigned origins · scenario', '其他 / 未分配产地 · 情景'), value:total - chinaValue, status:'scenario', source_ids:[]}, partial_records:[]};
  }

  function makeView() {
    const wrapper = profile();
    if (!wrapper) return null;
    const panels = wrapper.constituent_panels || [];
    const panel = panels.find(item => item.material === constituent) || panels[0];
    let dataset = panel ? packet.datasets.find(item => item.id === panel.dataset_id) : wrapper;
    if (!dataset) return {wrapper, dataset:wrapper, records:[], countries:[], provinces:[], partial:[], mode:'unavailable', integrity:t('The constituent source dataset is unavailable.', '该组成元素的来源数据集不可用。')};
    if (dataset.status === 'scenario') dataset = userScenario(dataset);
    const total = finite(dataset.global_total?.value) ? dataset.global_total.value : null;
    const china = (dataset.countries || []).find(item => item.country === 'China' || item.id === 'china' || item.id === 'user-china');
    const normalize = (row, type, parent = null) => ({...row, id:`${dataset.id}:${row.id || type}`, record_id:row.id, record_type:type, unit:row.unit || dataset.unit, product:row.product || dataset.product, stage:row.stage || dataset.stage, year:row.year ?? dataset.year, period:row.period || (row.year ?? dataset.year), status:row.status || dataset.status, global_value:total, china_value:china?.value ?? null, parent_value:parent?.value ?? null});
    const roundingIDs = new Set((dataset.rounding_zero_rows || []).map(item => item.id));
    let countries = (dataset.countries || []).filter(item => !roundingIDs.has(item.id)).map(item => normalize(item, 'country'));
    let provinces = [];
    let integrity = '';
    const tolerance = Math.max(1e-7, (total || china?.value || 1) * 1e-7);
    if (total !== null) {
      const known = countries.filter(item => finite(item.value));
      const extra = residual({...dataset.global_total, unit:dataset.unit}, known, dataset.unallocated, t('Origin unallocated', '产地未分配'), 'global-unallocated');
      if (finite(extra.value) && extra.value > tolerance) countries.push(normalize(extra, 'global_residual'));
      if (Math.abs(sum(countries.map(item => item.value)) - total) > tolerance) integrity = t('Country quantities do not partition the declared global total. They are shown as independent source records instead of a closed Sankey.', '国家数量未能分割所声明的全球总量；它们作为独立来源记录展示，不生成闭合桑基图。');
    }
    if (china && finite(china.value)) {
      const children = (china.provinces || []).map(item => normalize(item, /unallocated|unknown/i.test(`${item.id || ''} ${item.label || ''}`) ? 'province_residual' : 'province', china));
      const known = children.filter(item => finite(item.value));
      const extra = residual({...china, unit:dataset.unit}, known, china.unallocated || china.province_unallocated, t('China province unallocated', '中国省份未分配'), 'china-unallocated');
      provinces = [...children];
      if (finite(extra.value) && extra.value > tolerance) provinces.push(normalize(extra, 'province_residual', china));
      if (Math.abs(sum(provinces.map(item => item.value)) - china.value) > tolerance) integrity = t('Provincial quantities do not partition China on the declared basis. No proportional province allocation is drawn.', '省级数量在所声明的口径下未能分割中国总量；不绘制省级比例分配。');
    }
    const globalRecord = normalize({...dataset.global_total, id:'global-total', label:t('Global total', '全球总量'), value:total, status:dataset.status, source_ids:distinct(ids(dataset.global_total), ids(dataset)), formula:dataset.global_total?.formula || dataset.formula, conversion_formula:dataset.conversion_formula, conversion_factor:dataset.conversion_factor}, 'global');
    const partial = (dataset.partial_records || []).map(item => normalize(item, 'partial'));
    const belowPrecision = (dataset.rounding_zero_rows || []).map(item => normalize({...item, value:null, formula:null, range:undefined, status:'partial', note:item.zero_note || item.note || t('The source rounds this origin to 0.0%; this is below published precision, not proof of zero production.', '来源将此产地四舍五入为0.0%；这低于公布精度，不是产量为零的证据。')}, 'below_precision'));
    const records = [globalRecord, ...countries, ...provinces, ...partial, ...belowPrecision];
    const mode = dataset.status === 'not_mined' ? 'not_mined' : integrity ? 'partial' : total !== null && total > 0 ? 'global' : china && finite(china.value) && china.value > 0 && provinces.length ? 'china_only' : 'partial';
    return {wrapper, dataset, panel, total, china:china ? countries.find(item => item.record_id === china.id) : null, countries, provinces, globalRecord, partial, belowPrecision, records, mode, integrity};
  }

  function selectedRecord() { return view?.records.find(item => item.id === inspection) || quotaRecords.find(item => item.id === inspection) || view?.globalRecord || null; }
  function scopeText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return [value.label, readable(value.kind), value.country, value.region, value.site_label, value.company_label].filter(Boolean).join(' · ');
  }

  function shareBasisHTML(record) {
    if (!finite(record.source_share_pct)) return '';
    const below = record.record_type === 'below_precision';
    const raw = below ? record.source_share_pct.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {minimumFractionDigits:1, maximumFractionDigits:10}) : format(record.source_share_pct, 10);
    return `<dl class="sq-detail-facts sq-normalization"><div><dt>${t('Published rounded share', '来源公布的四舍五入份额')}</dt><dd>${esc(raw)}%</dd></div><div><dt>${t('Sum of source shares', '来源份额合计')}</dt><dd>${esc(format(record.source_share_sum_pct, 10))}%</dd></div>${below ? '' : `<div><dt>${t('Normalized share', '归一化份额')}</dt><dd>${esc(format(record.share_of_global_pct, 10))}%</dd></div>`}</dl><p>${below ? t('The rounded source percentage does not establish an observed zero quantity or a quantitative band.', '四舍五入的来源百分比不代表观测到的零数量，也不确立定量带宽。') : t('Rounded source percentages are normalized to preserve the published world total. Display precision is not measurement certainty.', '来源的四舍五入百分比经归一化以保留公布的全球总量；显示精度不代表测量确定性。')}</p>`;
  }

  function detailHTML() {
    const record = selectedRecord();
    if (!record) return '';
    const quota = record.record_type.startsWith('quota');
    const fields = [
      [t('Period / year', '时期 / 年份'), record.period ?? record.year ?? t('Not specified', '未注明')],
      [t('Physical product', '物理产品'), txt(record, 'product')],
      [t('Stage', '阶段'), readable(record.stage)],
      [t('Native unit', '原始单位'), record.unit],
      [t('Scope / geography', '范围 / 地理'), scopeText(record.scope) || record.country || record.region || txt(record, 'label')],
      [t('Share of global', '占全球份额'), ['partial', 'below_precision'].includes(record.record_type) || quota ? t('Unknown · no comparable global allocation', '未知 · 缺少可比全球分配') : percent(record.value, record.global_value)],
      [quota ? t('Share of China quota', '占中国配额份额') : t('Share of China', '占中国份额'), ['province', 'province_residual', 'quota_province', 'quota_mine'].includes(record.record_type) ? percent(record.value, record.china_value) : t('Not a China child', '非中国子级')],
      [t('Share of parent province quota', '占父级省份配额'), record.record_type === 'quota_mine' ? percent(record.value, record.parent_value) : ''],
      [t('Hard-rock quota', '岩矿配额'), finite(record.hard_rock_tonnes) ? `${format(record.hard_rock_tonnes)} ${record.unit}` : ''],
      [t('Ion-adsorption quota', '离子型配额'), finite(record.ion_adsorption_tonnes) ? `${format(record.ion_adsorption_tonnes)} ${record.unit}` : ''],
      [t('Operator', '运营商'), record.operator || ''],
      [t('Operating status', '运营状态'), record.operating_status || ''],
      [t('Quota type', '配额类型'), record.quota_type || '']
    ].filter(([, value]) => value !== '' && value !== null && value !== undefined);
    const components = (record.components || []).map((component, index) => `<details class="sq-component-evidence"><summary>${t('Constituent calculation', '组成元素计算')} ${index + 1} · ${esc(record.formula?.inputs?.[index]?.unit || '')}</summary><p>${esc(format(component.value, 10))} ${esc(record.formula?.inputs?.[index]?.unit || '')}</p>${shareBasisHTML(component)}${formulaHTML(component.formula, component.range)}${sourcesHTML(ids(component))}</details>`).join('');
    return `<div class="sq-detail-layout"><div><p class="sq-kicker">${t('Quantity evidence inspector', '数量证据查看器')}</p><h4>${esc(txt(record, 'label', record.record_id))}</h4>${badge(record.status)}<strong class="sq-detail-value">${esc(quantity(record))}<small>${esc(record.unit || '')}</small></strong><p>${esc(txt(record, 'note', txt(view.dataset, 'note')))}</p><dl class="sq-detail-facts">${fields.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>${record.country === 'China' || record.record_type === 'province_residual' ? quotaShortcutHTML() : ''}${shareBasisHTML(record)}${record.conversion_formula ? `<section class="sq-formula"><h5>${t('Oxide → contained-element conversion', '氧化物 → 所含元素换算')}</h5><code>${esc(record.conversion_formula)}</code><p>${t('Mass fraction', '质量分数')}: ${esc(format(record.conversion_factor, 10))}</p></section>` : ''}${formulaHTML(record.formula, record.range)}${components}</div><div><h5>${t('Sources for this quantity', '此数量的来源')}</h5>${sourcesHTML(ids(record))}<p>${quota ? t('This is an authorized mixed-REO quota, not observed mining output, recovered metal or individual-element supply. It is not attached to the element Sankey.', '此为混合REO核定配额，不是实际开采产量、回收金属或逐元素供应，不接入元素桑基图。') : record.status === 'scenario' ? t('These values are explicit user assumptions. They are not observed production or source-based estimates, and do not change the sourced datasets.', '这些数值是用户的明确假设；不是观测产量或来源估计，也不会修改有来源的数据集。') : t('The source describes this product, stage and period. A mining-content quantity does not establish recovered oxide, refined metal, alloy output, actual trade or a purchased lot’s origin.', '来源描述本产品、阶段与时期；开采含量不等于回收氧化物、精炼金属、合金产量、实际贸易或购入批次产地。')}</p></div></div>`;
  }

  function svgRecord(record, shape, label = '') {
    const description = `${txt(record, 'label')} · ${quantity(record)} ${record.unit} · ${statusLabel(record.status)}${record.record_type.startsWith('province') ? ` · ${percent(record.value, record.china_value)} ${t('of China', '占中国')} · ${percent(record.value, record.global_value)} ${t('of global', '占全球')}` : record.record_type !== 'partial' ? ` · ${percent(record.value, record.global_value)} ${t('of global', '占全球')}` : ''}`;
    return `<g class="sq-svg-record${inspection === record.id ? ' sq-active' : ''}" data-supply-record="${esc(record.id)}" role="button" tabindex="0" aria-label="${esc(`${description}. ${t('Inspect source and calculation', '查看来源与计算')}`)}"><title>${esc(description)}</title>${shape}${label}</g>`;
  }

  function sankeySVG() {
    const chinaOnly = view.mode === 'china_only';
    const denominator = chinaOnly ? view.china.value : view.total;
    const countries = (chinaOnly ? [] : view.countries).filter(item => finite(item.value));
    const provinces = view.provinces.filter(item => finite(item.value));
    const scale = 400 / denominator, gap = 60, top = 55, width = 1180;
    const countryStack = sum(countries.map(item => item.value * scale)) + Math.max(0, countries.length - 1) * gap + countries.filter(item => item.value === 0).length * 15;
    const provinceStack = sum(provinces.map(item => item.value * scale)) + Math.max(0, provinces.length - 1) * gap + provinces.filter(item => item.value === 0).length * 15;
    const height = Math.max(620, countryStack + 105, provinceStack + 105);
    const root = chinaOnly ? view.china : view.globalRecord;
    const rootY = (height - denominator * scale) / 2;
    const rootX = 40, countryX = 565, provinceX = 1120, nodeWidth = 14;
    const countryPositions = new Map();
    let y = (height - countryStack) / 2;
    countries.forEach(record => { const h = record.value * scale; countryPositions.set(record.id, {x:countryX, y, h}); y += h + gap + (h === 0 ? 15 : 0); });
    const chinaPosition = chinaOnly ? {x:rootX, y:rootY, h:denominator * scale} : countryPositions.get(view.china?.id);
    let provinceY = Math.max(top, Math.min(height - provinceStack - 40, (chinaPosition ? chinaPosition.y + chinaPosition.h / 2 : height / 2) - provinceStack / 2));
    const provincePositions = new Map();
    provinces.forEach(record => { const h = record.value * scale; provincePositions.set(record.id, {x:provinceX, y:provinceY, h}); provinceY += h + gap + (h === 0 ? 15 : 0); });
    const band = (record, a, b, color) => {
      const middle = (a.x + nodeWidth + b.x) / 2;
      const path = `M ${a.x + nodeWidth} ${a.y} C ${middle} ${a.y}, ${middle} ${b.y}, ${b.x} ${b.y} L ${b.x} ${b.y + b.h} C ${middle} ${b.y + b.h}, ${middle} ${a.y + a.h}, ${a.x + nodeWidth} ${a.y + a.h} Z`;
      return record.value > 0 ? svgRecord(record, `<path class="sq-band-shape" fill="${color}" d="${path}" data-supply-band="${esc(record.id)}" data-native-value="${record.value}" data-band-height="${a.h}"/>`) : '';
    };
    const node = (record, position, color, isRoot = false) => {
      const center = position.y + position.h / 2;
      const labelX = isRoot ? position.x + nodeWidth + 9 : position.x - 9;
      const align = isRoot ? 'start' : 'end';
      const share = record.record_type.startsWith('province') ? `${percent(record.value, record.china_value)} ${t('China', '中国')} · ${percent(record.value, record.global_value)} ${t('global', '全球')}` : `${percent(record.value, record.global_value)} ${t('of global', '占全球')}`;
      const label = `<text class="sq-node-name" x="${labelX}" y="${center - 16}" text-anchor="${align}">${esc(txt(record, 'label'))}</text><text class="sq-node-value" x="${labelX}" y="${center + 2}" text-anchor="${align}">${esc(format(record.value))} ${esc(record.unit || '')}</text><text class="sq-node-share" x="${labelX}" y="${center + 19}" text-anchor="${align}">${esc(share)}</text>`;
      return svgRecord(record, `<rect class="sq-node-rect" x="${position.x}" y="${position.y}" width="${nodeWidth}" height="${position.h}" fill="${color}" data-native-value="${record.value}"/><rect class="sq-hit" x="${isRoot ? position.x - 4 : position.x - 250}" y="${center - 24}" width="${isRoot ? 310 : 280}" height="48"/>`, label);
    };
    let rootOffset = rootY, paths = '';
    countries.forEach((record, index) => { const position = countryPositions.get(record.id); paths += band(record, {x:rootX, y:rootOffset, h:position.h}, position, record.country === 'China' ? palette[0] : palette[(index + 1) % palette.length]); rootOffset += position.h; });
    let chinaOffset = chinaPosition?.y || rootY;
    if (chinaPosition) provinces.forEach((record, index) => { const position = provincePositions.get(record.id); paths += band(record, {x:chinaPosition.x, y:chinaOffset, h:position.h}, position, record.record_type === 'province_residual' ? '#a0afb1' : palette[(index + 1) % palette.length]); chinaOffset += position.h; });
    const nodes = node(root, {x:rootX, y:rootY, h:denominator * scale}, palette[0], true) + countries.map((record, index) => node(record, countryPositions.get(record.id), record.country === 'China' ? palette[0] : palette[(index + 1) % palette.length])).join('') + provinces.map((record, index) => node(record, provincePositions.get(record.id), record.record_type === 'province_residual' ? '#a0afb1' : palette[(index + 1) % palette.length])).join('');
    return `<svg class="sq-chart-svg" viewBox="0 0 ${width} ${height}" role="group" aria-label="${esc(chinaOnly ? t('China quantity to its provincial allocation; global denominator unknown', '中国数量到省级分配；全球分母未知') : t('Global quantity to countries and China provincial allocation', '全球数量到国家与中国省级分配'))}" data-supply-svg data-denominator="${denominator}" data-native-scale="${scale}"><text class="sq-column-label" x="40" y="23">${chinaOnly ? t('China · global total unknown', '中国 · 全球总量未知') : t('Global total', '全球总量')}</text>${chinaOnly ? '' : `<text class="sq-column-label" x="565" y="23" text-anchor="middle">${t('Countries · same production basis', '国家 · 相同产量口径')}</text>`}<text class="sq-column-label" x="1120" y="23" text-anchor="end">${t('China provinces · children of China only', '中国省份 · 仅为中国子级')}</text>${paths}${nodes}</svg>`;
  }

  function partialHTML(records, heading = '') {
    if (!records.length) return '';
    const groups = new Map();
    records.forEach(record => { const key = [record.unit, record.product, record.stage, record.period || record.year].join('|'); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(record); });
    return `<section class="sq-partial-section"><h4>${heading || t('Independent source quantities', '独立来源数量')}</h4><p>${t('Each group keeps its own product, stage, unit and period. The axis compares source quantities within that group; no sum, global share or finished-alloy output is inferred.', '每组保留自身产品、阶段、单位与时期；轴仅比较组内来源数量，不推断合计、全球份额或成品合金产量。')}</p>${[...groups.values()].map(rows => {
      const comparable = rows.filter(record => finite(record.value)), ranges = rows.filter(record => !finite(record.value));
      const maximum = Math.max(1, ...comparable.map(record => record.value)), width = 820, height = comparable.length * 72 + 35, barX = 280, barWidth = 365;
      return `<article class="sq-partial-group"><h5>${esc(txt(rows[0], 'product', t('Native source product', '来源原始产品')))} · ${esc(readable(rows[0].stage))}</h5><p>${esc(rows[0].period || rows[0].year || t('Period not specified', '未注明时期'))} · ${esc(rows[0].unit || '')} · ${t('Global allocation unknown', '全球分配未知')}</p>${comparable.length ? `<div class="sq-chart-scroll" tabindex="0" role="region" aria-label="${t('Independent native source quantity bars', '独立来源的原始数量条形图')}"><svg class="sq-partial-bars" viewBox="0 0 ${width} ${height}" role="group"><text class="sq-bar-axis" x="${barX}" y="13">0</text><text class="sq-bar-axis" x="${barX + barWidth}" y="13" text-anchor="end">${esc(format(maximum))}</text>${comparable.map((record, index) => {
        const y = 33 + index * 72, valueWidth = record.value / maximum * barWidth;
        return svgRecord(record, `<rect class="sq-hit" x="0" y="${y - 4}" width="810" height="60"/><rect x="${barX}" y="${y + 5}" width="${barWidth}" height="15" fill="#8aab950c"/><rect x="${barX}" y="${y + 5}" width="${valueWidth}" height="15" fill="${record.status === 'scenario' ? '#aaa4ce' : '#8aab95'}" data-supply-partial-bar="${esc(record.id)}" data-native-value="${record.value}"/><text x="0" y="${y + 15}">${esc(txt(record, 'label', record.record_id))}</text><text class="sq-bar-value" x="${barX + barWidth + 13}" y="${y + 16}">${esc(quantity(record))}</text><text class="sq-bar-axis" x="0" y="${y + 37}">${esc(statusLabel(record.status))}</text>`);
      }).join('')}</svg></div>` : ''}${ranges.map(record => `<button type="button" class="sq-range-record" data-supply-record="${esc(record.id)}" data-supply-range-record><span>${esc(txt(record, 'label', record.record_id))}</span><strong>${esc(quantity(record))} <small>${esc(record.unit || '')}</small></strong><span>${Array.isArray(record.range) ? t('Source range · no midpoint or point-width bar', '来源范围 · 不取中点，不绘制点值带宽') : t('Quantity not established', '数量尚未建立')}</span></button>`).join('')}</article>`;
    }).join('')}</section>`;
  }

  function roundingFootnoteHTML() {
    return view.belowPrecision?.length ? `<p class="sq-chart-note sq-rounding-note" data-supply-rounding-note>${t('Additional origins round to 0.0% in the source; this is below published precision, not proof of zero production.', '其他产地在来源中四舍五入为0.0%；这低于公布精度，不是产量为零的证据。')}</p>` : '';
  }

  function roundingEvidenceHTML() {
    if (!view.belowPrecision?.length) return '';
    return `<details class="sq-rounding-evidence" data-supply-rounding-evidence><summary>${t('Origins below published precision · source entries', '低于公布精度的产地 · 来源记录')} (${view.belowPrecision.length})</summary><p>${t('The entries retain the source’s rounded percentages. Quantity is unknown; no zero tonnes or minimum-width bands are inferred.', '这些记录保留来源的四舍五入百分比；数量未知，不推断零吨或最小带宽。')}</p><ul>${view.belowPrecision.map(record => `<li data-supply-below-precision="${esc(record.id)}"><button type="button" data-supply-record="${esc(record.id)}">${esc(txt(record, 'label', record.record_id))} · ${esc(record.source_share_pct.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {minimumFractionDigits:1, maximumFractionDigits:10}))}% ${t('published rounded share', '公布的四舍五入份额')}</button><small>${t('Source IDs', '来源编号')}: ${esc(ids(record).join(', '))}</small>${sourcesHTML(ids(record))}</li>`).join('')}</ul></details>`;
  }

  function exactHTML() {
    return `<details class="sq-exact"${exactOpen ? ' open' : ''}><summary>${t('Exact quantities, both denominators & keyboard selection', '确切数量、两种分母与键盘选择')} (${view.records.length})</summary><div class="sq-exact-scroll"><table><caption class="sq-sr-only">${esc(txt(view.dataset, 'label'))}</caption><thead><tr><th scope="col">${t('Place / record', '地点 / 记录')}</th><th scope="col">${t('Native quantity', '原始数量')}</th><th scope="col">${t('% of global', '占全球 %')}</th><th scope="col">${t('% of China', '占中国 %')}</th><th scope="col">${t('Evidence state', '证据状态')}</th></tr></thead><tbody>${view.records.map(record => `<tr data-supply-exact-row="${esc(record.id)}"><td><button type="button" data-supply-record="${esc(record.id)}">${esc(txt(record, 'label', record.record_id))}</button><small>${esc(record.period || record.year || '')} · ${esc(readable(record.stage))}</small></td><td class="sq-number">${esc(quantity(record))} ${esc(record.unit || '')}</td><td class="sq-number">${record.record_type === 'partial' ? t('Unknown', '未知') : esc(percent(record.value, record.global_value))}</td><td class="sq-number">${record.record_type.startsWith('province') ? esc(percent(record.value, record.china_value)) : '—'}</td><td>${esc(statusLabel(record.status))}</td></tr>`).join('')}</tbody></table></div><p class="sq-chart-note">${t('China provinces partition China only. They are not added again to the global total. Unknown location does not mean zero quantity; an unknown denominator does not become 100%.', '中国省份只分割中国总量，不再次加进全球总量。未知地点不代表数量为零；未知分母不会变成 100%。')}</p></details>`;
  }

  function scenarioHTML(dataset) {
    if (dataset.status !== 'scenario') return '';
    const values = scenarios.get(dataset.id) || {total:'', china:'', province:'', provinceShare:''};
    return `<section class="sq-scenario"><h4>${t('Enter an explicit allocation scenario', '输入明确的分配情景')}</h4><p>${t('Inputs begin empty. This scenario assumes a total and shares for the selected native product; it is not a measurement or source-based supply estimate.', '输入初始为空；此情景假设所选原始产品的总量与份额，不是测量或来源供应估计。')}</p><div class="sq-scenario-fields"><label>${t('Illustrative total', '说明性总量')} · ${esc(dataset.unit || '')}<input type="number" min="0" step="any" inputmode="decimal" data-supply-scenario-field="total" value="${esc(values.total)}" placeholder="${t('Enter a total', '输入总量')}"></label><label>${t('China share · % of your total', '中国份额 · 占假设总量 %')}<input type="number" min="0" max="100" step="any" inputmode="decimal" data-supply-scenario-field="china" value="${esc(values.china)}" placeholder="${t('Optional · unknown until entered', '可选 · 输入前为未知')}"></label><label>${t('Your province label', '您的省份标签')}<input type="text" maxlength="70" data-supply-scenario-field="province" value="${esc(values.province)}" placeholder="${t('Optional illustrative province', '可选的说明性省份')}"></label><label>${t('Province share · % of your China allocation', '省份份额 · 占假设中国分配 %')}<input type="number" min="0" max="100" step="any" inputmode="decimal" data-supply-scenario-field="provinceShare" value="${esc(values.provinceShare)}" placeholder="${t('Optional', '可选')}"></label></div><div class="sq-scenario-actions"><button type="button" data-supply-scenario-apply>${t('Draw my scenario', '绘制我的情景')}</button><button type="button" data-supply-scenario-clear>${t('Clear scenario inputs', '清除情景输入')}</button></div>${view.dataset.scenario_warning ? `<p class="sq-scenario-warning">${esc(view.dataset.scenario_warning)}</p>` : ''}</section>`;
  }

  function prepareQuota() {
    const choices = packet.china_quota_context?.quota_views || [];
    const selected = choices.find(item => item.id === selectedQuota) || choices.find(item => /annual/.test(item.id)) || choices[0];
    selectedQuota = selected?.id || '';
    if (!selected) { quotaRecords = []; return; }
    const common = {unit:t('tonnes authorized mixed REO', '吨核定混合REO'), product:txt(selected, 'form', 'total REO'), stage:selected.stage_id || selected.stage, period:`${selected.year} · ${selected.period}`, year:selected.year, status:'quota', global_value:null, china_value:selected.china_total_tonnes, note:txt(selected, 'note'), country:'China'};
    quotaRecords = [{...common, id:`quota:${selected.id}:total`, label:txt(selected, 'label'), value:selected.china_total_tonnes, record_type:'quota_total', source_ids:ids(selected), hard_rock_tonnes:selected.hard_rock_total_tonnes, ion_adsorption_tonnes:selected.ion_adsorption_total_tonnes}, ...(selected.rows || []).map(row => ({...common, ...row, id:`quota:${selected.id}:${row.id}`, label:txt(row, 'province'), value:row.tonnes, record_type:'quota_province'})), ...(selected.province_mine_children || []).map(row => ({...common, ...row, id:`quota:${selected.id}:${row.mine_id}`, label:txt(row, 'mine'), value:row.tonnes, record_type:'quota_mine', parent_value:selected.rows?.find(item => item.id === row.province_id)?.tonnes, note:t('Authorized quota for this named mine. This is not observed output and is not allocated to individual elements.', '该具名矿山的核定配额；不是实际产量，也不分配到各元素。')}))];
  }

  function quotaShortcutHTML() {
    if (!(packet.china_quota_context?.quota_views || []).length) return '';
    return `<div class="sq-quota-shortcut"><button type="button" data-supply-open-quota>${t('China provinces · 2021 mining quotas ↗', '中国省份 · 2021年开采配额 ↗')}</button><span>${t('Mixed REO allowance, separate from the selected element.', '混合REO核定量，与所选元素分开。')}</span></div>`;
  }

  function quotaHTML() {
    const choices = packet.china_quota_context?.quota_views || [];
    const selected = choices.find(item => item.id === selectedQuota);
    if (!selected) return '';
    const rows = quotaRecords.filter(item => item.record_type === 'quota_province').sort((a,b) => b.value - a.value), mines = quotaRecords.filter(item => item.record_type === 'quota_mine');
    const partition = Math.abs(sum(rows.map(item => item.value)) - selected.china_total_tonnes) <= Math.max(1e-7, selected.china_total_tonnes * 1e-7);
    return `<details id="sq-quota-panel" class="sq-quota" data-supply-quota-panel${quotaOpen ? ' open' : ''}><summary>${t('Separate provincial view · authorized mixed-REO mining quota', '独立省级视图 · 核定混合REO开采配额')}</summary><p class="sq-boundary"><strong>${t('Quota, not observed individual-element output.', '配额，不是实际逐元素产量。')}</strong> ${t('These mixed-REO quantities have their own China denominator. They do not divide the element or purchased-alloy supply above. The annual quota includes the first batch; the two views must not be added.', '这些混合REO数量使用自身的中国分母，不分割上方元素或购入合金供应。全年配额包含第一批；两视图不可相加。')}</p><label class="sq-quota-control" for="sq-quota-view">${t('Authorization period', '核定时期')}<select id="sq-quota-view">${choices.map(item => `<option value="${esc(item.id)}"${selectedQuota === item.id ? ' selected' : ''}>${esc(txt(item, 'label'))}</option>`).join('')}</select></label><div class="sq-quota-total"><button type="button" data-supply-record="${esc(quotaRecords[0].id)}">${esc(format(selected.china_total_tonnes))} ${t('tonnes authorized mixed REO · China', '吨核定混合REO · 中国')}</button><span>${esc(selected.year)} · ${esc(readable(selected.stage_id || selected.stage))} · ${t('Global quota denominator unknown', '全球配额分母未知')}</span></div><p class="sq-chart-note">${esc(txt(selected, 'note'))}</p>${partition ? `<div class="sq-quota-rows" role="group" aria-label="${t('Province quota bars using China quota as denominator', '以中国配额为分母的省级配额条形图')}">${rows.map(row => `<button type="button" class="sq-quota-row" data-supply-record="${esc(row.id)}" data-supply-quota-row><span class="sq-quota-name">${esc(txt(row, 'label'))}</span><span class="sq-quota-track"><i style="width:${row.value / selected.china_total_tonnes * 100}%" data-native-value="${row.value}" data-supply-quota-band></i></span><span class="sq-quota-value">${esc(format(row.value))}<small>${esc(percent(row.value, selected.china_total_tonnes))} ${t('of China quota', '占中国配额')}</small></span></button>`).join('')}</div>` : `<p class="sq-boundary">${t('Provincial records do not close the declared quota total; no proportional allocation is drawn.', '省级记录未闭合所声明的配额总量；不绘制比例分配。')}</p>`}${mines.length ? `<div class="sq-quota-mines"><h5>${t('Named mine authorization · same quota year and form', '具名矿山核定量 · 相同配额年份与形态')}</h5>${mines.map(row => `<button type="button" data-supply-record="${esc(row.id)}">${esc(txt(row, 'label'))} · ${esc(format(row.value))} ${t('tonnes mixed REO quota', '吨混合REO配额')}<small>${esc(percent(row.value, row.parent_value))} ${t('of parent province quota', '占父级省份配额')} · ${esc(percent(row.value, row.china_value))} ${t('of China quota', '占中国配额')} · ${t('Global share unknown', '全球份额未知')}</small></button>`).join('')}</div>` : ''}<p class="sq-chart-note">${t('Click a quota row to inspect its original notice, period and authorization basis in the evidence inspector above.', '点击配额行，可在上方证据查看器查看原始通知、时期与核定口径。')}</p>${sourcesHTML(ids(selected))}</details>`;
  }

  function profileHTML() {
    if (!view) return `<div class="sq-empty"><h4>${t('No dataset matches these filters.', '当前筛选无匹配数据集。')}</h4><p>${t('Select another year or return to all evidence. Missing quantitative coverage is not zero production.', '选择其他年份或返回全部证据；缺少定量覆盖不代表产量为零。')}</p><button type="button" data-supply-reset-filters>${t('Show all evidence & years', '显示全部证据与年份')}</button></div>`;
    const dataset = view.dataset, wrapper = view.wrapper;
    const constituentPanels = wrapper.constituent_panels || [];
    const boughtForm = option()?.kind === 'purchased-alloy';
    const facts = [[t('Year / period', '年份 / 时期'), dataset.year ?? dataset.period ?? t('Source-specific periods', '依来源时期')], [t('Product form', '产品形态'), txt(dataset, 'product')], [t('Physical stage', '物理阶段'), readable(dataset.stage)], [t('Mass / quantity basis', '质量 / 数量口径'), txt(dataset, 'unit')]];
    const body = ['global', 'china_only'].includes(view.mode) ? `<div class="sq-chart-shell"><div class="sq-chart-topline"><span>${view.mode === 'global' ? t('One comparable global total → countries → China provinces', '一个可比全球总量 → 国家 → 中国省份') : t('China allocation only · global total unknown', '仅展示中国分配 · 全球总量未知')}</span><span>${t('Click a node or band · Tab + Enter to inspect', '点击节点或流带 · Tab + 回车查看')}</span></div><div class="sq-chart-scroll" tabindex="0" role="region" aria-label="${t('Quantitative supply Sankey, horizontally scrollable on small screens', '定量供应桑基图，小屏幕可横向滚动')}">${sankeySVG()}</div><p class="sq-chart-note">${t('Band thickness is proportional to the same native quantity basis throughout this diagram. Scroll across the three columns on small screens. These are production allocations, not verified mine-to-factory shipments.', '本图带宽始终按相同原始数量口径成比例绘制。小屏幕上可横向滚动查看三列。这些是产量分配，不是已核实的矿山到工厂运输。')}</p>${roundingFootnoteHTML()}${roundingEvidenceHTML()}</div>` : `<div class="sq-empty"><h4>${view.mode === 'not_mined' ? t('This selection has no mined supply total.', '此选择没有开采供应总量。') : t('A comparable global allocation is not established.', '尚未建立可比的全球分配。')}</h4><p>${esc(txt(dataset, 'note'))}</p><p>${t('No global Sankey or 100% allocation is invented. Source-specific quantities retain their own product, stage, unit and period below.', '不虚构全球桑基图或 100% 分配。下方来源数量保留自身产品、阶段、单位与时期。')}</p></div>`;
    const independent = view.integrity || view.mode === 'partial' ? [...view.countries, ...view.partial] : view.partial;
    return `<div class="sq-dataset-heading"><div><p class="sq-kicker">${boughtForm ? t('Purchased form selected · quantitative basis below', '已选择购入形态 · 定量口径如下') : t('Selected source dataset', '所选来源数据集')}</p><h4>${esc(txt(wrapper, 'label', wrapper.id))}</h4></div>${badge(wrapper.status)}</div>${constituentPanels.length ? `<div class="sq-alloys sq-constituent-panels" role="group" aria-label="${t('Separate constituent supply views', '分别查看组成元素供应')}">${constituentPanels.map(panel => `<button type="button" class="sq-material-chip${panel.material === constituent ? ' active' : ''}" data-supply-constituent="${esc(panel.material)}" aria-pressed="${panel.material === constituent}"><b>${esc(panel.material)}</b><span>${esc(txt(panel, 'role', panel.material))}</span></button>`).join('')}</div><p class="sq-boundary"><strong>${t('Constituent context, not alloy output.', '组成元素背景，不是合金产量。')}</strong> ${t('These panels keep the ingredient supply bases separate. Their quantities are not added into a DyFe or FeB output total. Carrier Fe belongs to the purchased alloy and is counted once in a charge; B is boron, not Tb.', '各面板保留不同原料的供应口径，不相加为镝铁或硼铁产量。载体铁属于购入合金，配料时只计算一次；B 为硼，不是 Tb。')}</p><h4 class="sq-constituent-title">${esc(txt(dataset, 'label'))} ${badge(dataset.status)}</h4>` : ''}${boughtForm && !constituentPanels.length ? `<p class="sq-boundary sq-short-boundary">${t('NdPr is selected as one purchased form. This chart keeps the source’s physical stage; mined content or oxide production does not establish finished NdPr metal.', '镨钕按一种购入形态选择；本图保留来源物理阶段，矿料含量或氧化物产量不等于成品镨钕金属。')}</p>` : ''}<dl class="sq-basis">${facts.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>${quotaShortcutHTML()}${view.integrity ? `<p class="sq-boundary sq-integrity-note">${esc(view.integrity)}</p>` : ''}${scenarioHTML(dataset)}${body}<div class="sq-metrics"><article class="sq-metric"><span>${t('Global total on this basis', '此口径下的全球总量')}</span><strong>${esc(format(view.total))}<small>${esc(dataset.unit || '')}</small></strong><p>${esc(statusLabel(dataset.status))} · ${esc(readable(dataset.stage))}</p></article><article class="sq-metric"><span>${t('China national quantity', '中国国家数量')}</span><strong>${esc(format(view.china?.value))}<small>${esc(dataset.unit || '')}</small></strong><p>${t('Share of global', '占全球份额')}: ${esc(percent(view.china?.value, view.total))}</p></article><article class="sq-metric"><span>${t('China provincial allocation', '中国省级分配')}</span><strong>${view.provinces.some(item => item.record_type === 'province' && finite(item.value) && item.value > 0) ? t('Named + unallocated', '具名 + 未分配') : t('Unallocated', '未分配')}</strong><p>${t('Province shares use China and global as separate denominators. China is counted once.', '省级份额分别使用中国与全球分母；中国只计算一次。')}</p></article></div><section id="sq-record-detail" class="sq-record-detail" aria-live="polite" aria-label="${t('Selected quantity evidence', '所选数量证据')}">${detailHTML()}</section>${partialHTML(independent)}${['global', 'china_only'].includes(view.mode) ? '' : roundingFootnoteHTML() + roundingEvidenceHTML()}${exactHTML()}<details class="sq-method-note"><summary>${t('Dataset scope & purchased-form boundary', '数据集范围与购入形态边界')}</summary><p>${esc(txt(wrapper, 'note'))}</p>${wrapper !== dataset ? `<p>${esc(txt(dataset, 'note'))}</p>` : ''}${dataset.purchased_form_note ? `<p>${esc(txt(dataset, 'purchased_form_note'))}</p>` : ''}</details>${quotaHTML()}<a class="sq-origin-link" href="${esc(originLink())}">${t('Trace named mines, processing and metal-conversion evidence', '追踪具名矿山、加工与金属转化证据')} · ${esc(selectedMaterial)} ↗</a>`;
  }

  function render() {
    prepareQuota(); view = makeView();
    if (![...(view?.records || []), ...quotaRecords].some(record => record.id === inspection)) inspection = view?.globalRecord?.id || '';
    mount.dataset.supplyMaterial = selectedMaterial; mount.dataset.supplyDataset = selectedDataset; mount.dataset.supplyRenderMode = view?.mode || 'unavailable'; mount.dataset.supplyStatus = view?.dataset.status || 'unavailable';
    mount.innerHTML = `${controlsHTML()}${profileHTML()}<footer class="sq-footer"><span>${t('Evidence checked', '证据核查')} ${esc(packet.as_of || t('See source dates', '详见来源日期'))}</span><p>${esc(txt(packet, 'scope', t('Native quantities, source estimates and explicit scenarios retain separate physical and evidence boundaries.', '原始数量、来源估计与明确情景保留各自物理和证据边界。')))}</p></footer><div class="sq-sr-only" aria-live="polite">${esc(txt(option(), 'label', selectedMaterial))} · ${esc(view ? statusLabel(view.dataset.status) : t('No matching dataset', '无匹配数据集'))}</div>`;
  }

  function inspect(id) {
    if (![...(view?.records || []), ...quotaRecords].some(record => record.id === id)) return;
    inspection = id;
    const detail = mount.querySelector('#sq-record-detail');
    if (detail) detail.innerHTML = detailHTML();
    mount.querySelectorAll('.sq-svg-record').forEach(node => node.classList.toggle('sq-active', node.dataset.supplyRecord === id));
    mount.dataset.supplyInspection = id;
  }

  function changeMaterial(id) {
    if (!packet.material_options.some(item => item.id === id)) return;
    selectedMaterial = id; selectedYear = 'all'; constituent = ''; chooseProfile(); updateURL(); render();
    mount.dispatchEvent(new CustomEvent('supplyquantities:change', {bubbles:true, detail:{material:id, dataset:selectedDataset}}));
  }

  mount.addEventListener('click', event => {
    const target = event.target.closest('button, .sq-svg-record');
    if (!target || !mount.contains(target)) return;
    if (target.hasAttribute('data-supply-material')) { changeMaterial(target.dataset.supplyMaterial); [...mount.querySelectorAll('[data-supply-material]')].find(item => item.dataset.supplyMaterial === selectedMaterial)?.focus({preventScroll:true}); }
    else if (target.hasAttribute('data-supply-open-quota')) {
      const panel = mount.querySelector('#sq-quota-panel');
      if (panel) { quotaOpen = true; panel.open = true; panel.querySelector('summary')?.focus({preventScroll:true}); panel.scrollIntoView({behavior:'auto', block:'start'}); }
    }
    else if (target.hasAttribute('data-supply-record')) inspect(target.dataset.supplyRecord);
    else if (target.hasAttribute('data-supply-constituent')) { constituent = target.dataset.supplyConstituent; inspection = ''; updateURL(); render(); }
    else if (target.hasAttribute('data-supply-reset-filters')) { selectedYear = 'all'; statusFilter = 'all'; chooseProfile(); updateURL(); render(); }
    else if (target.hasAttribute('data-supply-scenario-apply')) {
      const inputs = {}; mount.querySelectorAll('[data-supply-scenario-field]').forEach(input => inputs[input.dataset.supplyScenarioField] = input.value);
      scenarios.set(view.dataset.id, inputs); inspection = ''; render();
    } else if (target.hasAttribute('data-supply-scenario-clear')) { scenarios.delete(view.dataset.id); inspection = ''; render(); }
    else if (target.hasAttribute('data-supply-retry')) load();
  });
  mount.addEventListener('change', event => {
    const select = event.target;
    if (select.matches('#sq-material')) changeMaterial(select.value);
    else if (select.matches('#sq-dataset')) { selectedDataset = select.value; constituent = ''; chooseProfile(selectedDataset); updateURL(); render(); }
    else if (select.matches('#sq-year')) { selectedYear = select.value; chooseProfile(); updateURL(); render(); }
    else if (select.matches('#sq-status')) { statusFilter = select.value; chooseProfile(); updateURL(); render(); }
    else if (select.matches('#sq-quota-view')) { selectedQuota = select.value; inspection = ''; quotaOpen = true; render(); }
    else if (select.matches('#sq-language')) { language = select.value === 'zh' ? 'zh' : 'en'; render(); }
    if (select.id) mount.querySelector(`#${select.id}`)?.focus({preventScroll:true});
  });
  mount.addEventListener('keydown', event => { const node = event.target.closest('.sq-svg-record'); if (node && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); inspect(node.dataset.supplyRecord); } });
  mount.addEventListener('toggle', event => { if (event.target.matches('.sq-elements')) elementsOpen = event.target.open; if (event.target.matches('.sq-exact')) exactOpen = event.target.open; if (event.target.matches('.sq-quota')) quotaOpen = event.target.open; }, true);

  async function load() {
    mount.dataset.ready = 'loading'; mount.dataset.supplyQuantitiesState = 'loading';
    mount.innerHTML = `<p class="sq-loading" role="status">${t('Loading source-native supply quantities…', '正在加载来源原始供应数量…')}</p>`;
    try {
      const response = await fetch(dataURL, {cache:'no-store'});
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.material_options) || !Array.isArray(data.datasets) || !Array.isArray(data.sources)) throw Error('Invalid supply quantity dataset structure');
      packet = data;
      const url = new URL(window.location.href), requested = url.searchParams.get('supply_material') || url.searchParams.get('origin_material');
      selectedMaterial = packet.material_options.some(item => item.id === requested) ? requested : packet.material_options.some(item => item.id === 'NdPr') ? 'NdPr' : packet.material_options[0]?.id;
      selectedYear = url.searchParams.get('supply_year') || 'all'; statusFilter = statuses.includes(url.searchParams.get('supply_status')) ? url.searchParams.get('supply_status') : 'all'; constituent = url.searchParams.get('supply_constituent') || '';
      chooseProfile(url.searchParams.get('supply_dataset')); render();
      mount.dataset.ready = 'true'; mount.dataset.supplyQuantitiesState = 'ready';
      mount.dispatchEvent(new CustomEvent('supplyquantities:ready', {bubbles:true, detail:{material:selectedMaterial, dataset:selectedDataset}}));
    } catch (error) {
      mount.dataset.ready = 'error'; mount.dataset.supplyQuantitiesState = 'error';
      mount.innerHTML = `<div class="sq-empty" role="status"><h4>${t('Supply quantities could not be loaded.', '无法加载供应数量。')}</h4><p>${t('The chart requires its source dataset before any quantitative width can be drawn.', '只有加载来源数据集后，才会绘制定量带宽。')}</p><button type="button" class="sq-retry" data-supply-retry>${t('Retry loading evidence', '重新加载证据')}</button></div>`;
      console.warn('Supply quantities:', error.message);
    }
  }
  load();
})();
