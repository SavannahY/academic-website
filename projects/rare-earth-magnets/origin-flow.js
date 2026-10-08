/* Named origin relationships. Line width never represents mass, trade or market share. */
(() => {
  'use strict';
  const mount = document.getElementById('mining-origin-details');
  if (!mount) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const textOf = (record, key, fallback = '') => language === 'zh' ? (record?.[`${key}_zh`] || record?.[key] || fallback) : (record?.[key] || fallback);
  const translate = (en, zh) => language === 'zh' ? zh : en;
  const readable = value => String(value || '').replace(/[-_]/g, ' ');
  const number = value => typeof value === 'number' ? value.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {maximumFractionDigits: 3}) : String(value ?? '');
  const safeURL = value => { try { const url = new URL(value, document.baseURI); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch { return ''; } };
  const dataURL = new URL('data/element-origin-flow.json', document.baseURI);
  const stageOrder = ['country', 'origin', 'processing', 'product'];
  const rareEarthOrder = ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Y', 'Sc'];
  let data, selected = 'NdPr', country = '', language = 'en', inspection = null, visible = {nodes: [], links: []};
  let resizeObserver, frame, hovered = null, elementChoicesOpen = true, reoContextOpen = false;

  const stageLabel = stage => ({
    country: translate('Country', '国家'),
    origin: translate('Mine · locality · project', '矿山 · 产地 · 项目'),
    processing: translate('Processing · metal conversion', '分离加工 · 金属转化'),
    product: translate('Selected metal / purchased alloy', '所选金属 / 购入合金'),
    gap: translate('Evidence gap', '证据缺口')
  }[stage] || readable(stage));
  const kindLabel = kind => ({
    documented: translate('Documented process route', '有记录的工艺路径'),
    association: translate('Geographic association', '地域关联'),
    capability: translate('Capability only', '仅有工艺能力'),
    proposed: translate('Proposed relationship', '拟议关联'),
    gap: translate('Unverified connection', '未证实的连接')
  }[kind] || readable(kind));
  const coverageLabel = value => ({
    'documented-selected-origins': translate('Selected origins documented', '已有部分产地记录'),
    'resource-only': translate('Geological occurrence only', '仅有地质成分证据'),
    'first-separated-output': translate('First separated oxide; deliveries unassigned', '首批分离氧化物；交付未指定'),
    'byproduct-route': translate('Byproduct recovery route', '副产品回收路径'),
    'regional-origin': translate('Regional origin evidence', '地区产地证据'),
    'coproduct-chain': translate('Commercial coproduct chain', '商业共产品链'),
    'geology-and-capability': translate('Geology & product capability', '地质与产品能力'),
    'mixed-product-only': translate('Mixed product; metal origin open', '混合产品；金属来源未知'),
    unavailable: translate('Origin evidence unavailable', '暂无产地证据'),
    noncommercial: translate('No commercial origin chain shown', '未展示商业产地链')
  }[value] || translate('Partial origin evidence', '部分产地证据'));
  const material = () => data.material_options.find(option => option.id === selected);
  const nodeByID = id => data.nodes.find(node => node.id === id);
  const sourceByID = id => data.sources.find(source => source.id === id);
  const productOf = node => language === 'zh' ? (node?.product_by_material_zh?.[selected] || node?.product_by_material?.[selected] || textOf(node, 'product')) : (node?.product_by_material?.[selected] || textOf(node, 'product'));
  const sourceIDs = record => Array.isArray(record?.sources) ? record.sources : [];
  const sourcesHTML = ids => {
    const sources = [...new Set(ids || [])].map(sourceByID).filter(Boolean);
    if (!sources.length) return `<p class="of-no-source">${translate('No source is attached to this record.', '此记录未附来源。')}</p>`;
    return `<ul class="of-source-list">${sources.map(source => {
      const href = safeURL(source.url);
      const title = textOf(source, 'title', source.id);
      const qualifications = [
        [translate('Source type', '来源类型'), source.type ? readable(source.type) : ''],
        [translate('Locator', '定位信息'), textOf(source, 'locator')],
        [translate('Evidence limit', '证据限制'), textOf(source, 'limit')],
        [translate('Retrieval note', '读取说明'), textOf(source, 'retrieval_note')]
      ].filter(([, value]) => value);
      return `<li>${href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(title)} <span aria-hidden="true">↗</span></a>` : `<span>${esc(title)}</span>`}<small>${source.date ? `${translate('Published', '发布日期')} ${esc(source.date)}` : translate('Publication date not specified', '未注明发布日期')}${source.checked_at ? ` · ${translate('Checked', '核查日期')} ${esc(source.checked_at)}` : ''}</small>${qualifications.map(([label, value]) => `<span class="of-source-qualification"><b>${esc(label)}:</b> ${esc(value)}</span>`).join('')}</li>`;
    }).join('')}</ul>`;
  };

  function setURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('origin_material', selected);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function filteredGraph() {
    const nodes = data.nodes.filter(node => Array.isArray(node.materials) && node.materials.includes(selected));
    const nodeIDs = new Set(nodes.map(node => node.id));
    const links = data.links.filter(link => Array.isArray(link.materials) && link.materials.includes(selected) && nodeIDs.has(link.from) && nodeIDs.has(link.to));
    if (!country || !nodeIDs.has(country)) return {nodes, links};
    const retained = new Set([country, ...nodes.filter(node => node.stage === 'product' || node.stage === 'gap').map(node => node.id)]);
    let changed = true;
    while (changed) {
      changed = false;
      links.forEach(link => {
        if (retained.has(link.from) && !retained.has(link.to)) { retained.add(link.to); changed = true; }
      });
    }
    return {nodes: nodes.filter(node => retained.has(node.id)), links: links.filter(link => retained.has(link.from) && retained.has(link.to))};
  }

  function gapLane(node) {
    if (node.stage !== 'gap') return stageOrder.includes(node.stage) ? node.stage : 'processing';
    const outgoing = visible.links.filter(link => link.from === node.id).map(link => nodeByID(link.to)).filter(Boolean);
    const incoming = visible.links.filter(link => link.to === node.id).map(link => nodeByID(link.from)).filter(Boolean);
    const next = outgoing.map(item => stageOrder.indexOf(item.stage)).filter(index => index >= 0);
    const previous = incoming.map(item => stageOrder.indexOf(item.stage)).filter(index => index >= 0);
    if (next.length) return stageOrder[Math.max(1, Math.min(...next) - 1)];
    if (previous.length) return stageOrder[Math.min(3, Math.max(...previous) + 1)];
    return 'product';
  }

  function statusHTML(node) {
    const status = textOf(node, 'status', node.stage === 'gap' ? translate('Unknown', '未知') : translate('Status not specified', '未注明状态'));
    return `<span class="of-node-status">${esc(readable(status))}${node.status_as_of ? ` <span>· ${esc(node.status_as_of)}</span>` : ''}</span>`;
  }

  function nodeHTML(node) {
    const isGap = node.stage === 'gap';
    const name = textOf(node, 'label', node.id);
    const product = productOf(node);
    const title = [name, textOf(node, 'status'), textOf(node, 'note'), product ? `${translate('Product', '产品')}: ${product}` : ''].filter(Boolean).join(' · ');
    const elements = material()?.kind === 'purchased-alloy' && Array.isArray(node.constituents) ? node.constituents.filter(symbol => material().elements.includes(symbol)) : [];
    const branch = elements.length ? `<span class="of-node-elements">${elements.map(symbol => `<span><b>${esc(symbol)}</b>${symbol === 'Fe' ? ` ${translate('carrier', '载体')}` : symbol === 'B' ? ` ${translate('boron · non-REE', '硼 · 非稀土')}` : ''}</span>`).join('')}</span>` : '';
    return `<button type="button" class="of-node${isGap ? ' of-node-gap' : ''}" data-origin-node="${esc(node.id)}" data-stage="${esc(node.stage)}" aria-pressed="${inspection?.type === 'node' && inspection.id === node.id}" aria-describedby="of-node-hint" title="${esc(title)}"><span class="of-node-label">${esc(name)}</span>${node.stage === 'origin' && node.country ? `<span class="of-node-place">${esc(node.country)}${node.region ? ` · ${esc(node.region)}` : ''}</span>` : ''}${branch}${statusHTML(node)}${product ? `<span class="of-node-product">${esc(product)}</span>` : ''}<span class="of-node-inspect">${translate('Inspect evidence', '查看证据')} <span aria-hidden="true">↗</span></span></button>`;
  }

  function countryHTML(allNodes) {
    const countries = allNodes.filter(node => node.stage === 'country');
    const option = material();
    const summary = data.material_summaries?.[selected] || {};
    return `<div class="of-country-coverage" aria-label="${translate('Country coverage of the selected origin evidence', '所选产地证据的国家范围')}"><div class="of-coverage-heading"><h4>${translate('Countries represented in this evidence', '本视图中有证据的国家')}</h4><p>${esc(textOf(summary, 'country_note', translate('Named examples show where these origins are located. Worldwide supply shares are unknown here.', '列举的产地显示其所在地；本视图不提供全球供给份额。')))}</p></div><div class="of-country-cards"><button type="button" class="of-country-card${!country ? ' active' : ''}" data-origin-country="" aria-pressed="${!country}"><strong>${translate('All examples', '全部例子')}</strong><span>${translate('Show the full selected evidence', '显示全部所选证据')}</span></button>${countries.map(node => {
      const origins = allNodes.filter(item => item.stage === 'origin' && (item.country === node.country || item.country === node.label));
      return `<button type="button" class="of-country-card${country === node.id ? ' active' : ''}" data-origin-country="${esc(node.id)}" aria-pressed="${country === node.id}"><strong>${esc(textOf(node, 'label', node.country))}</strong><span>${origins.length ? translate(`${origins.length} ${origins.length === 1 ? 'source record' : 'source records'} shown`, `展示 ${origins.length} 条来源记录`) : translate('Named origin evidence', '具名产地证据')}</span></button>`;
    }).join('')}<div class="of-country-card of-country-unknown" data-origin-country-unknown><strong>${translate('Other origins / share unknown', '其他产地 / 份额未知')}</strong><span>${translate('No global denominator or complete country split', '缺少全球分母与完整国家分布')}</span></div></div>${country ? `<p class="of-country-focus-note">${translate('Country focus shows the named downstream evidence. The selected product and generic unresolved boundary remain visible; no new link is inferred between them and this country.', '国家聚焦展示具名下游证据；所选产品与通用未解决边界仍然可见，不会新增它们与该国家之间的推断连接。')}</p>` : ''}${option?.coverage === 'noncommercial' ? `<p class="of-noncommercial-note">${esc(textOf(option, 'note', translate('No commercial mine-to-metal chain is documented for this selection.', '此选择未记录商业矿山到金属链。')))}</p>` : ''}</div>`;
  }

  function graphHTML() {
    const option = material();
    return `<div class="of-graph-heading"><div><p class="of-kicker">${translate('Follow named origins', '追踪具名产地')}</p><h4>${esc(textOf(option, 'label', selected))}</h4></div><span class="of-coverage-badge" data-origin-coverage="${esc(option?.coverage || 'unavailable')}">${esc(coverageLabel(option?.coverage))}</span></div><p class="of-graph-instruction">${translate('Choose a place or a line to inspect its evidence. Country buttons narrow the view. Scroll within the diagram for additional places and across the four stages.', '选择地点或连线查看证据。国家按钮可缩小视图；在图内滚动可查看更多地点与四个阶段。')}</p><div class="of-legend" aria-label="${translate('Relationship line legend', '关联连线图例')}">${['documented', 'association', 'capability', 'proposed', 'gap'].map(kind => `<span><i class="of-line-key of-line-${kind}" aria-hidden="true"></i>${esc(kindLabel(kind))}</span>`).join('')}</div><p class="of-volume-boundary"><strong>${translate('Qualitative relationships.', '定性关联。')}</strong> ${translate('Every line is thin and fixed in width. Lines and country cards encode evidence, never tonnes, shipment volumes, market shares or proportions.', '所有连线宽度固定；连线与国家卡片表达证据，不代表吨位、运输量、市场份额或比例。')}</p><div class="of-graph-scroll" tabindex="0" role="region" aria-label="${translate('Qualitative country to product origin diagram; scroll for all stages and records', '国家到产品的定性产地关系图；滚动可查看所有阶段与记录')}"><div class="of-graph" data-origin-graph><svg class="of-links" aria-label="${translate('Evidence relationships between named places', '具名地点之间的证据关联')}"></svg>${stageOrder.map((stage, index) => {
      const nodes = visible.nodes.filter(node => gapLane(node) === stage);
      return `<section class="of-lane" data-origin-lane="${stage}" aria-label="${esc(stageLabel(stage))}"><h5><span>${String(index + 1).padStart(2, '0')}</span>${esc(stageLabel(stage))}</h5><div class="of-lane-nodes">${nodes.length ? nodes.map(nodeHTML).join('') : `<div class="of-stage-empty" data-origin-empty="${stage}"><span aria-hidden="true">?</span><strong>${translate('No named evidence', '暂无具名证据')}</strong><p>${translate('This stage is not documented for this selection.', '此选择在本阶段暂无记录。')}</p></div>`}</div></section>`;
    }).join('')}<div class="of-tooltip" role="tooltip" hidden aria-hidden="true"></div></div></div><p class="of-stage-boundary">${translate('A resource, processing capability or proposed project does not establish a delivered metal. A gap remains a gap until the named connection is supported.', '资源、加工能力或拟议项目不等于已交付金属。只有具名连接获得证据支持后，缺口才能补全。')}</p><p id="of-node-hint" class="of-sr-only">${translate('Press Enter to open the source record below the graph. Tab also reaches every relationship in the evidence panel.', '按回车键可在关系图下方打开来源记录。使用 Tab 也可访问证据面板中的每条关联。')}</p>`;
  }

  function constituentsHTML(option) {
    const elements = Array.isArray(option?.elements) ? option.elements : [];
    if (option?.kind !== 'purchased-alloy') return '';
    const words = translate('Contained elements', '所含元素');
    const carrier = elements.includes('Fe') ? translate('Carrier Fe is part of this purchased alloy; count it once in the charge.', '载体铁属于此购入合金；配料时只计算一次。') : translate('These are constituents of one purchased alloy, not additional purchases.', '这些是一份购入合金中的元素，不是额外的购料。');
    return `<div class="of-constituents"><span>${words}</span>${elements.map(symbol => `<span class="of-constituent"><b>${esc(symbol)}</b>${symbol === 'Fe' || symbol === 'B' ? `<small>${translate('non-REE', '非稀土')}</small>` : ''}</span>`).join('')}<p>${carrier}${selected === 'FeB' ? ` ${translate('FeB is Fe + B (boron); B is not Tb (terbium).', '硼铁 FeB 为 Fe + B（硼）；B 不是 Tb（铽）。')}` : ''}</p></div>`;
  }

  function selectHTML() {
    const kinds = [
      ['purchased-alloy', translate('Purchased alloys / master alloys', '购入合金 / 中间合金')],
      ['rare-earth-element', translate('All 17 rare-earth elements', '全部 17 种稀土元素')],
      ['non-rare-earth-element', translate('Other magnet constituents · not rare earths', '其他磁体元素 · 非稀土')]
    ];
    return kinds.map(([kind, label]) => `<optgroup label="${esc(label)}">${data.material_options.filter(option => option.kind === kind).map(option => `<option value="${esc(option.id)}"${option.id === selected ? ' selected' : ''}>${esc(textOf(option, 'label', option.id))}</option>`).join('')}</optgroup>`).join('');
  }

  function controlsHTML() {
    const option = material();
    const alloys = data.material_options.filter(item => item.kind === 'purchased-alloy');
    const elements = data.material_options.filter(item => item.kind === 'rare-earth-element').sort((a, b) => rareEarthOrder.indexOf(a.id) - rareEarthOrder.indexOf(b.id));
    const others = data.material_options.filter(item => item.kind === 'non-rare-earth-element');
    const choices = options => options.map(item => `<button type="button" class="of-material-chip${selected === item.id ? ' active' : ''}" data-material-option="${esc(item.id)}" data-material-kind="${esc(item.kind)}" aria-pressed="${selected === item.id}" title="${esc(textOf(item, 'label', item.id))}" aria-label="${esc(`${item.id} · ${textOf(item, 'label', item.id)}`)}"><b>${esc(item.id)}</b>${item.kind === 'purchased-alloy' ? `<span>${esc(textOf(item, 'label', item.id))}</span>` : ''}</button>`).join('');
    return `<header class="of-header"><div><p class="of-kicker">${translate('Element & purchased-product origins', '元素与购入产品的产地')}</p><h3>${translate('Where does this material begin?', '这种材料从哪里开始？')}</h3><p>${translate('Trace named countries, mines and processing places toward the metal or alloy you select.', '沿具名国家、矿山与加工地点，追踪到所选金属或合金。')}</p></div><label class="of-language" for="of-language">${translate('Diagram language', '关系图语言')}<select id="of-language" data-origin-language><option value="en"${language === 'en' ? ' selected' : ''}>English</option><option value="zh"${language === 'zh' ? ' selected' : ''}>中文</option></select></label></header><div class="of-main-controls"><label class="of-material-select" for="of-material">${translate('Choose a metal or purchased alloy', '选择金属或购入合金')}<select id="of-material" data-origin-material-select>${selectHTML()}</select></label><div class="of-material-note"><span class="of-kind-label">${option?.kind === 'purchased-alloy' ? translate('One purchased product', '一份购入产品') : option?.kind === 'non-rare-earth-element' ? translate('Not a rare-earth element', '非稀土元素') : translate('Rare-earth element', '稀土元素')}</span><p>${esc(textOf(option, 'note'))}</p></div></div><div class="of-purchased-choices" role="group" aria-label="${translate('Purchased alloy shortcuts', '购入合金快捷选择')}">${choices(alloys)}</div><details class="of-element-choices"${elementChoicesOpen ? ' open' : ''}><summary>${translate('Choose any of the 17 rare-earth elements', '选择任一 17 种稀土元素')} <span>${translate('La–Lu + Y + Sc', 'La–Lu + Y + Sc')}</span></summary><div class="of-element-grid" role="group" aria-label="${translate('All 17 rare-earth elements', '全部 17 种稀土元素')}">${choices(elements)}</div><div class="of-other-elements" role="group" aria-label="${translate('Non rare-earth constituents', '非稀土元素')}"><span>${translate('Also needed in magnets · not rare earths', '磁体也需要 · 非稀土元素')}</span>${choices(others)}</div></details>${constituentsHTML(option)}`;
  }

  function relationshipButtonHTML(link, contextNode = '') {
    const from = nodeByID(link.from), to = nodeByID(link.to);
    const name = contextNode === link.from ? textOf(to, 'label', link.to) : contextNode === link.to ? textOf(from, 'label', link.from) : `${textOf(from, 'label', link.from)} → ${textOf(to, 'label', link.to)}`;
    const direction = contextNode === link.from ? translate('To', '至') : contextNode === link.to ? translate('From', '来自') : '';
    return `<button type="button" class="of-relationship of-relation-${esc(link.kind || 'gap')}" data-origin-link="${esc(link.id)}" aria-pressed="${inspection?.type === 'link' && inspection.id === link.id}"><span>${esc(kindLabel(link.kind || 'gap'))}</span><strong>${direction ? `${direction} ` : ''}${esc(name)}</strong><small>${esc(textOf(link, 'note'))}</small></button>`;
  }

  function quantitiesHTML(node) {
    const records = Array.isArray(node.quantity_records) ? node.quantity_records : [];
    if (!records.length) return `<p class="of-quantity-unknown">${translate('No element-specific delivered-metal quantity is assigned to this origin record.', '此产地记录未赋予某种元素的交付金属数量。')}</p>`;
    return `<div class="of-quantities"><h5>${translate('Native source quantities', '来源原始数量')}</h5><p>${translate('Each record retains its reported product, unit, year and scope. These values are not added or converted into the selected metal or alloy.', '每条记录保留报告的产品、单位、年份与范围；这些数值不会相加，也不会转化为所选金属或合金量。')}</p>${records.map(record => {
      const scope = typeof record.scope === 'object' && record.scope ? [readable(record.scope.kind), record.scope.site_label || textOf(nodeByID(record.scope.site_id), 'label'), record.scope.company_label || record.scope.company, record.scope.country, record.scope.destination ? 'to '+record.scope.destination : '', record.scope.allocation].filter(Boolean).join(' · ') : textOf(record, 'scope');
      const ids = record.source_id ? [record.source_id] : record.source_ids || sourceIDs(record);
      return `<article class="of-quantity-record" data-origin-quantity="${esc(record.id || '')}">${record.label ? `<span class="of-quantity-label">${esc(textOf(record, 'label'))}</span>` : ''}<strong>${esc(number(record.value))} ${esc(record.unit || '')}</strong><span>${esc(record.material || record.product || translate('Reported material not specified', '未注明报告材料'))}${record.year || record.period ? ` · ${esc(record.year || record.period)}` : ''}</span>${record.status ? `<p><b>${translate('Status', '状态')}:</b> ${esc(readable(textOf(record, 'status')))}</p>` : ''}${scope ? `<p><b>${translate('Scope', '范围')}:</b> ${esc(scope)}</p>` : ''}${record.note ? `<p>${esc(textOf(record, 'note'))}</p>` : ''}${sourcesHTML(ids)}</article>`;
    }).join('')}</div>`;
  }

  function reoContextHTML() {
    const context = data.total_reo_country_context;
    if (!context || !Array.isArray(context.rows) || !context.rows.length) return '';
    const rows = [...context.rows].filter(row => Number.isFinite(Number(row.value))).sort((a, b) => Number(b.value) - Number(a.value));
    const maximum = Math.max(...rows.map(row => Number(row.value)), 1);
    const sourceIds = [...new Set(rows.flatMap(row => row.source_ids || []))];
    return `<details class="of-reo-context" data-origin-total-reo${reoContextOpen ? ' open' : ''}><summary>${translate('Total rare-earth mining', '全部稀土开采')} · ${esc(context.year || 2025)} ${translate('REO context', 'REO 背景')}</summary><div class="of-reo-body"><h4>${translate('National totals for all reported rare earths', '报告稀土的国家总量')}</h4><p class="of-reo-boundary">${translate('This separate chart shows national mining in REO equivalent. It is not the country mix of the selected element or purchased alloy, and cannot be assigned to a mine, Nd, Pr, Dy, Tb or a metal-conversion stage.', '此独立图表展示以 REO 当量计的国家开采量，不代表所选元素或购入合金的国家构成，也不能分配给矿山、Nd、Pr、Dy、Tb 或金属转化阶段。')}</p><p class="of-reo-unit">${esc(context.year || 2025)} · ${esc(context.unit || translate('metric tonnes REO equivalent', '公吨 REO 当量'))} · ${translate('USGS national estimates', 'USGS 国家估计值')}</p><div class="of-reo-chart" role="list" aria-label="${translate('Country mining estimates in native REO tonnes, no individual element assignment', '国家开采估计值，保留原始 REO 吨位，不分配给单一元素')}">${rows.map(row => `<div class="of-reo-row" role="listitem" data-origin-reo-country="${esc(row.country)}"><strong>${esc(textOf(row, 'country'))}</strong><span class="of-reo-track" aria-hidden="true"><i style="width:${Math.max(0, Number(row.value)) / maximum * 100}%"></i></span><span class="of-reo-value">${esc(number(row.value))}<small>${esc(row.year || context.year || '')}</small></span></div>`).join('')}</div><div class="of-reo-totals">${context.row_sum !== undefined ? `<span>${translate('Country-row sum', '国家行合计')} <strong>${esc(number(context.row_sum))}</strong></span>` : ''}${context.rounded_world_total !== undefined ? `<span>${translate('Published world total · rounded', '发布的全球总量 · 已四舍五入')} <strong>${esc(number(context.rounded_world_total))}</strong></span>` : ''}</div><p class="of-reo-boundary">${esc(textOf(context, 'warning', translate('These country totals never determine the graph line widths or the quantities of individual elements.', '这些国家总量不会决定关系图的连线宽度或单一元素量。')))}</p>${sourcesHTML(sourceIds)}<a class="of-reo-link" href="flows.html?view=balance">${translate('Explore source quantities & material balances', '查看来源数量与物料平衡')} ↗</a></div></details>`;
  }

  function detailHTML() {
    const record = inspection?.type === 'link' ? visible.links.find(link => link.id === inspection.id) : visible.nodes.find(node => node.id === inspection?.id);
    const summary = data.material_summaries?.[selected] || {};
    if (!record) return `<div class="of-detail-empty"><p class="of-kicker">${translate('Evidence inspector', '证据查看器')}</p><h4>${translate('Select a place or relationship.', '选择地点或关联。')}</h4><p>${esc(textOf(summary, 'note', translate('The view distinguishes a known locality from an unverified journey to a purchased product.', '本视图区分已知产地与尚未证实的购入产品路径。')))}</p>${sourcesHTML(summary.source_ids || [])}</div>`;
    if (inspection.type === 'link') {
      const from = nodeByID(record.from), to = nodeByID(record.to);
      return `<div class="of-detail-record"><div class="of-detail-main"><p class="of-kicker">${translate('Relationship evidence', '关联证据')} · ${esc(kindLabel(record.kind || 'gap'))}</p><h4>${esc(textOf(from, 'label', record.from))}<span aria-hidden="true"> → </span>${esc(textOf(to, 'label', record.to))}</h4><p>${esc(textOf(record, 'note', translate('No relationship note supplied.', '未提供关联说明。')))}</p><p class="of-detail-boundary">${record.kind === 'documented' ? translate('A documented relationship supports this named edge only. It is not a quantity, country share or a procurement record for your lot.', '记录仅支持此具名关联，不代表数量、国家份额或您批次的采购记录。') : record.kind === 'association' ? translate('This line locates a source record within a country or region; it does not show a shipment.', '此线定位国家或地区中的来源记录，不代表运输。') : record.kind === 'capability' ? translate('Capability evidence does not confirm this origin supplied this plant or a delivered metal.', '能力证据并未确认该产地供应此工厂或交付金属。') : record.kind === 'proposed' ? translate('A proposed relationship is not an operating shipment chain.', '拟议关联不等于已运营的运输链。') : translate('The connection is unknown. This line marks where the evidence stops.', '连接未知；此线标示证据停止的位置。')}</p><div class="of-detail-actions"><button type="button" data-origin-inspect-node="${esc(record.from)}">${translate('Inspect start', '查看起点')}</button><button type="button" data-origin-inspect-node="${esc(record.to)}">${translate('Inspect destination', '查看终点')}</button></div></div><div class="of-detail-sources"><h5>${translate('Sources for this relationship', '此关联的来源')}</h5>${sourcesHTML(sourceIDs(record))}</div></div>`;
    }
    const relationships = visible.links.filter(link => link.from === record.id || link.to === record.id);
    const metadata = [
      [translate('Stage', '阶段'), record.physical_stage ? readable(record.physical_stage) : stageLabel(record.stage)],
      [translate('Country / region', '国家 / 地区'), [record.country, record.region].filter(Boolean).join(' · ')],
      [translate('Operator', '运营方'), textOf(record, 'operator')],
      [translate('Product stated', '所述产品'), productOf(record)],
      [translate('Status as of', '状态截至'), record.status_as_of]
    ].filter(([, value]) => value);
    return `<div class="of-detail-record"><div class="of-detail-main"><p class="of-kicker">${translate('Place / product evidence', '地点 / 产品证据')}</p><h4>${esc(textOf(record, 'label', record.id))}</h4>${statusHTML(record)}<p>${esc(textOf(record, 'note', translate('No additional locality note supplied.', '未提供更多产地说明。')))}</p><dl class="of-record-fields">${metadata.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>${quantitiesHTML(record)}</div><div class="of-detail-sources"><h5>${translate('Sources for this record', '此记录的来源')}</h5>${sourcesHTML(sourceIDs(record))}<h5>${translate('Connected evidence', '相关证据')}</h5><div class="of-related-links">${relationships.length ? relationships.map(link => relationshipButtonHTML(link, record.id)).join('') : `<p class="of-no-source">${translate('No named connection is documented from this record in the selected view.', '此选择中未记录从该条目出发的具名连接。')}</p>`}</div></div></div>`;
  }

  function renderDetail() {
    const panel = mount.querySelector('#of-evidence-detail');
    if (panel) panel.innerHTML = detailHTML();
    highlight();
  }

  function highlight() {
    const current = hovered || inspection;
    const relevantLinks = current?.type === 'node' ? new Set(visible.links.filter(link => link.from === current.id || link.to === current.id).map(link => link.id)) : new Set(current?.type === 'link' ? [current.id] : []);
    const relevantNodes = current?.type === 'node' ? new Set([current.id, ...visible.links.filter(link => relevantLinks.has(link.id)).flatMap(link => [link.from, link.to])]) : new Set(current?.type === 'link' ? visible.links.filter(link => link.id === current.id).flatMap(link => [link.from, link.to]) : []);
    mount.querySelectorAll('[data-origin-node]').forEach(button => {
      button.classList.toggle('of-node-related', relevantNodes.has(button.dataset.originNode));
      button.classList.toggle('of-node-selected', inspection?.type === 'node' && inspection.id === button.dataset.originNode);
      button.setAttribute('aria-pressed', String(inspection?.type === 'node' && inspection.id === button.dataset.originNode));
    });
    mount.querySelectorAll('.of-link-group').forEach(group => {
      group.classList.toggle('of-link-active', relevantLinks.has(group.dataset.originLink));
      group.classList.toggle('of-link-muted', Boolean(current) && !relevantLinks.has(group.dataset.originLink));
      group.setAttribute('aria-pressed', String(inspection?.type === 'link' && inspection.id === group.dataset.originLink));
    });
    mount.querySelectorAll('.of-relationship').forEach(button => button.setAttribute('aria-pressed', String(inspection?.type === 'link' && inspection.id === button.dataset.originLink)));
  }

  function drawLinks() {
    const graph = mount.querySelector('.of-graph');
    const svg = mount.querySelector('.of-links');
    if (!graph || !svg) return;
    const bounds = graph.getBoundingClientRect(), width = graph.scrollWidth, height = graph.scrollHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width); svg.setAttribute('height', height);
    const buttons = new Map([...graph.querySelectorAll('[data-origin-node]')].map(button => [button.dataset.originNode, button]));
    svg.innerHTML = `<defs><marker id="of-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 5 3 L 0 6" fill="none" stroke="currentColor" stroke-width="1"/></marker></defs>${visible.links.map(link => {
      const start = buttons.get(link.from), finish = buttons.get(link.to);
      if (!start || !finish) return '';
      const a = start.getBoundingClientRect(), b = finish.getBoundingClientRect();
      const forward = b.left > a.right;
      const backward = a.left > b.right;
      const sameLane = !forward && !backward;
      const x1 = (sameLane || forward ? a.right : a.left) - bounds.left;
      const x2 = (sameLane || backward ? b.right : b.left) - bounds.left;
      const y1 = a.top + a.height / 2 - bounds.top, y2 = b.top + b.height / 2 - bounds.top;
      const bend = sameLane ? 18 : Math.max(24, Math.abs(x2 - x1) * 0.45);
      const path = sameLane ? `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 + bend} ${y2}, ${x2} ${y2}` : `M ${x1} ${y1} C ${x1 + (forward ? bend : -bend)} ${y1}, ${x2 + (forward ? -bend : bend)} ${y2}, ${x2} ${y2}`;
      const label = `${textOf(nodeByID(link.from), 'label', link.from)} → ${textOf(nodeByID(link.to), 'label', link.to)} · ${kindLabel(link.kind || 'gap')}`;
      return `<g class="of-link-group of-link-${esc(link.kind || 'gap')}" data-origin-link="${esc(link.id)}" role="button" tabindex="0" aria-label="${esc(`${label}. ${translate('Inspect evidence', '查看证据')}`)}" aria-pressed="false"><title>${esc(`${label}${link.note ? ` · ${textOf(link, 'note')}` : ''}`)}</title><path class="of-link-hit" d="${path}"/><path class="of-link-path" d="${path}" marker-end="url(#of-arrow)"/></g>`;
    }).join('')}`;
    highlight();
  }

  function scheduleLines() { if (frame) cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { frame = null; drawLinks(); }); }

  function hideTooltip() {
    const tooltip = mount.querySelector('.of-tooltip');
    if (tooltip) tooltip.hidden = true;
    hovered = null;
    highlight();
  }

  function showTooltip(button) {
    const record = visible.nodes.find(node => node.id === button.dataset.originNode);
    const tooltip = mount.querySelector('.of-tooltip'), graph = mount.querySelector('.of-graph');
    if (!record || !tooltip || !graph) return;
    hovered = {type: 'node', id: record.id}; highlight();
    tooltip.innerHTML = `<strong>${esc(textOf(record, 'label', record.id))}</strong><span>${esc(stageLabel(record.stage))} · ${esc(readable(textOf(record, 'status', translate('Unknown', '未知'))))}</span><p>${esc(textOf(record, 'note', translate('Select to inspect the source record.', '选择以查看来源记录。')))}</p><small>${sourceIDs(record).length} ${translate('source records · click for details', '条来源记录 · 点击查看详情')}</small>`;
    tooltip.hidden = false;
    const bounds = graph.getBoundingClientRect(), card = button.getBoundingClientRect();
    const left = Math.max(8, Math.min(card.left - bounds.left, graph.scrollWidth - tooltip.offsetWidth - 8));
    const above = card.top - bounds.top - tooltip.offsetHeight - 7;
    tooltip.style.left = `${left}px`; tooltip.style.top = `${above > 40 ? above : card.bottom - bounds.top + 7}px`;
  }

  function render() {
    visible = filteredGraph();
    const allNodes = data.nodes.filter(node => Array.isArray(node.materials) && node.materials.includes(selected));
    const retained = inspection && (inspection.type === 'node' ? visible.nodes : visible.links).some(record => record.id === inspection.id);
    if (!retained) inspection = null;
    mount.dataset.originMaterial = selected; mount.dataset.originLanguage = language;
    mount.innerHTML = `${controlsHTML()}${countryHTML(allNodes)}${reoContextHTML()}<div class="of-diagram">${graphHTML()}</div><section id="of-evidence-detail" class="of-evidence-detail" aria-label="${translate('Selected evidence record', '所选证据记录')}" aria-live="polite">${detailHTML()}</section><details class="of-all-relationships"><summary>${translate('Inspect every relationship in this view', '查看本视图中的每一条关联')} <span>(${visible.links.length})</span></summary><div class="of-relationship-index">${visible.links.length ? visible.links.map(link => relationshipButtonHTML(link)).join('') : `<p>${translate('No named origin-to-product relationships are documented for this selection.', '此选择未记录具名产地到产品的关联。')}</p>`}</div></details><footer class="of-footer"><span>${translate('Dataset as of', '数据截至')} ${esc(data.as_of || translate('date unspecified', '未注明日期'))}</span><p>${esc(textOf(data, 'scope', translate('Selected public evidence, not a complete census or lot traceability record.', '部分公开证据，非完整普查或批次追溯记录。')))}</p></footer><div class="of-announcement of-sr-only" aria-live="polite" aria-atomic="true">${esc(textOf(material(), 'label', selected))}. ${esc(coverageLabel(material()?.coverage))}. ${visible.nodes.length} ${translate('records shown.', '条记录。')}</div>`;
    hideTooltip(); scheduleLines();
    resizeObserver?.disconnect();
    if ('ResizeObserver' in window) { resizeObserver = new ResizeObserver(scheduleLines); resizeObserver.observe(mount.querySelector('.of-graph')); }
  }

  function inspect(type, id) {
    if (!(type === 'node' ? visible.nodes : visible.links).some(record => record.id === id)) return;
    inspection = {type, id}; hovered = null; hideTooltip(); renderDetail();
    mount.dataset.originInspection = `${type}:${id}`;
  }

  function changeMaterial(id, focusKind) {
    if (!data.material_options.some(option => option.id === id)) return;
    selected = id; country = ''; inspection = null; setURL(); render();
    if (focusKind === 'select') mount.querySelector('#of-material')?.focus({preventScroll: true});
    if (focusKind === 'chip') [...mount.querySelectorAll('[data-material-option]')].find(button => button.dataset.materialOption === id)?.focus({preventScroll: true});
    mount.dispatchEvent(new CustomEvent('originflow:change', {bubbles: true, detail: {material: selected, language, country}}));
  }

  mount.addEventListener('click', event => {
    const button = event.target.closest('button, .of-link-group');
    if (!button || !mount.contains(button)) return;
    if (button.hasAttribute('data-material-option')) changeMaterial(button.dataset.materialOption, 'chip');
    else if (button.hasAttribute('data-origin-country')) {
      country = button.dataset.originCountry; inspection = null; render();
      [...mount.querySelectorAll('[data-origin-country]')].find(item => item.dataset.originCountry === country)?.focus({preventScroll: true});
    } else if (button.hasAttribute('data-origin-node')) inspect('node', button.dataset.originNode);
    else if (button.hasAttribute('data-origin-inspect-node')) inspect('node', button.dataset.originInspectNode);
    else if (button.hasAttribute('data-origin-link')) inspect('link', button.dataset.originLink);
    else if (button.hasAttribute('data-origin-retry')) load();
  });
  mount.addEventListener('change', event => {
    if (event.target.matches('#of-material')) changeMaterial(event.target.value, 'select');
    if (event.target.matches('#of-language')) {
      language = event.target.value === 'zh' ? 'zh' : 'en'; render(); mount.querySelector('#of-language')?.focus({preventScroll: true});
    }
  });
  mount.addEventListener('keydown', event => {
    const group = event.target.closest('.of-link-group');
    if (group && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); inspect('link', group.dataset.originLink); }
    if (event.key === 'Escape') hideTooltip();
  });
  mount.addEventListener('pointerover', event => {
    const button = event.target.closest('[data-origin-node]');
    if (button && !button.contains(event.relatedTarget) && event.pointerType !== 'touch') showTooltip(button);
  });
  mount.addEventListener('pointerout', event => {
    const button = event.target.closest('[data-origin-node]');
    if (button && !button.contains(event.relatedTarget)) hideTooltip();
  });
  mount.addEventListener('focusin', event => {
    const button = event.target.closest('[data-origin-node]');
    if (button) showTooltip(button);
  });
  mount.addEventListener('focusout', event => { if (event.target.closest('[data-origin-node]')) hideTooltip(); });
  mount.addEventListener('toggle', event => {
    if (event.target.matches('.of-element-choices')) elementChoicesOpen = event.target.open;
    if (event.target.matches('.of-reo-context')) reoContextOpen = event.target.open;
  }, true);
  window.addEventListener('resize', scheduleLines, {passive: true});
  window.addEventListener('popstate', () => {
    if (!data) return;
    const id = new URL(window.location.href).searchParams.get('origin_material');
    if (id && data.material_options.some(option => option.id === id)) { selected = id; country = ''; inspection = null; render(); }
  });

  async function load() {
    mount.dataset.ready = 'loading'; mount.dataset.originFlowState = 'loading';
    mount.innerHTML = '<p class="of-loading" role="status">Loading named origin evidence…</p>';
    try {
      const response = await fetch(dataURL, {cache: 'no-cache'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.material_options) || !payload.material_options.length || !Array.isArray(payload.nodes) || !Array.isArray(payload.links) || !Array.isArray(payload.sources)) throw new Error('Origin dataset has an invalid structure.');
      data = payload;
      const requested = new URL(window.location.href).searchParams.get('origin_material');
      selected = data.material_options.some(option => option.id === requested) ? requested : data.material_options.some(option => option.id === 'NdPr') ? 'NdPr' : data.material_options[0].id;
      render(); mount.dataset.ready = 'true'; mount.dataset.originFlowState = 'ready';
      mount.dispatchEvent(new CustomEvent('originflow:ready', {bubbles: true, detail: {material: selected, asOf: data.as_of}}));
    } catch (error) {
      mount.dataset.ready = 'error'; mount.dataset.originFlowState = 'error';
      mount.innerHTML = `<div class="of-load-error" role="status"><h3>Origin evidence could not be loaded.</h3><p>The diagram needs its source dataset before it can show named relationships.</p><button type="button" data-origin-retry>Retry loading evidence</button></div>`;
      console.warn('Origin flow:', error.message);
    }
  }
  load();
})();
