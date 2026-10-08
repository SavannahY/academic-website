/* Source-native quantities for explicitly matched supply places only.
   This component does not convert, sum, annualize or infer material flows. */
(() => {
  'use strict';

  const siteBindings = Object.freeze({
    'mountain-pass': 'mp_mine',
    independence: 'mp_independence',
    mp_10x: 'mp_10x',
    neo_narva: 'neo_narva',
    evac_sumter: 'evac_sumter',
    white_mesa: 'white_mesa'
  });
  // These named bases do not inherit the group's tonnes.
  const jlmagPlants = new Set(['jlmag_ganzhou', 'jlmag_baotou', 'jlmag_ningbo', 'jlmag_jincheng']);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const copy = {
    en: {
      title: 'Quantities · keep their original basis',
      siteScope: 'Matched operating site / project',
      groupScope: 'JL MAG group · no plant allocation',
      mpSalesScope: 'MP company sales KPI · oxide and metal; no plant delivery allocation',
      intercompany: 'Intercompany sales included: ',
      plantUnknown: 'Actual output at this plant: unknown in this quantity packet. JL MAG’s company totals are not assigned to this base.',
      openGroup: 'View the separate JL MAG group record',
      unavailable: 'Quantity evidence could not load. Unknown values have not been replaced with zero.',
      pending: 'Quantity evidence has not loaded yet. No output is inferred.',
      unmatched: 'No source-native quantity is established for this matched place in the current packet.',
      unknown: 'Undisclosed',
      product: 'Product',
      period: 'Period / capacity basis',
      scope: 'Quantity scope',
      source: 'Primary source',
      published: 'Published',
      checked: 'Checked',
      details: 'Definitions & limits',
      missing: 'Not established',
      boundary: 'Production, sales, capacity and pilot milestones are different measures. No records are added, annualized, converted to contained elements, or assigned to customers here.',
      annualMagnetUnknown: 'Achieved routine annual magnet output: unknown in these sources. Capacity, a ramp-up or an undisclosed commercial delivery is not an achieved annual rate.',
      pilotUnknown: 'Routine commercial annual Dy/Tb oxide output: unknown here. These cumulative pilot milestones are not an annual production rate or pure-element weights.',
      groupUnknown: 'Plant-level output and achieved finished-magnet production: unknown here. Group blank production and finished-product sales are not a yield pair.',
      mpBoundary: 'Mountain Pass’s concentrate and separated oxide belong to the same chain and overlap. Sales recognition is different from production or physical shipment; the company’s oxide-equivalent sales convention changed from 1.20 to 1.25 in Q1 2026 without recasting prior periods.',
      earlierPlan: 'Earlier plan · superseded; do not add to the expansion',
      supersedes: 'An expansion target; not additional to the earlier initial plan',
      capacitySnapshots: 'Capacity snapshots and future targets are not additive.',
      sourceMissing: 'Source record unavailable; quantity is not displayed.'
    },
    zh: {
      title: '数量证据 · 保留原始口径',
      siteScope: '明确匹配的生产地点 / 项目',
      groupScope: '金力永磁集团 · 未分配至各工厂',
      mpSalesScope: 'MP公司销售指标 · 氧化物与金属；未分配至工厂交付',
      intercompany: '包含内部销售：',
      plantUnknown: '该工厂的实际产量：本数量资料包中未知。金力永磁公司总量不分配给该基地。',
      openGroup: '查看单独的金力永磁集团记录',
      unavailable: '数量证据加载失败；未知值没有用零替代。',
      pending: '数量证据尚未加载；不推断产量。',
      unmatched: '当前资料包没有为该明确匹配地点提供原始口径数量。',
      unknown: '未披露',
      product: '产品形态',
      period: '统计期间 / 产能口径',
      scope: '数量范围',
      source: '一手来源',
      published: '发表',
      checked: '核查',
      details: '定义与限制',
      missing: '尚未建立',
      boundary: '产量、销量、产能与中试里程碑是不同量。本组件不相加、不年化、不换算为所含元素，也不分配至客户。',
      annualMagnetUnknown: '常规实际磁体年产量：这些来源中未知。产能、爬坡或未披露数量的商业交付不等于实际年产量。',
      pilotUnknown: '常规商业镝 / 铽氧化物年产量：此处未知。累计中试里程碑不是年产率，也不是纯元素重量。',
      groupUnknown: '各工厂产量及实际成品磁体产量：此处未知。集团毛坯产量和成品销量不能作为收率对。',
      mpBoundary: 'Mountain Pass 的精矿与分离氧化物处于同一链条，数量重叠。销售确认不等于生产或实物发运；公司的氧化物当量销售系数在2026年第一季度由1.20改为1.25，未重述以前期间。',
      earlierPlan: '早期方案 · 已被更新；不与扩建相加',
      supersedes: '扩建目标；不额外叠加早期初始方案',
      capacitySnapshots: '各时点产能与未来目标不可相加。',
      sourceMissing: '来源记录不可用；不显示该数量。'
    }
  };
  const statuses = {
    observed_reported: ['Reported quantity', '已报告数量'],
    observed_reported_approximate: ['Reported · approximate', '已报告 · 约数'],
    observed_estimate: ['Statistical estimate', '统计估算'],
    observed_reported_pilot: ['Pilot · reported cumulative milestone', '中试 · 已报告累计里程碑'],
    observed_event_quantity_unknown: ['Commercial delivery · amount undisclosed', '商业交付 · 数量未披露'],
    planned_capacity: ['Planned capacity · not achieved output', '计划产能 · 非实际产量'],
    planned_capacity_lower_bound: ['Planned capacity · lower bound', '计划产能 · 下界'],
    nameplate_capacity: ['Nameplate capacity · not achieved output', '名义产能 · 非实际产量'],
    reported_effective_capacity: ['Reported effective capacity · not output', '报告的有效产能 · 非产量']
  };
  const timeBases = {
    annual_capacity: ['Annual capacity', '年产能'],
    production: ['Production', '生产'],
    sales_recognition: ['Sales recognition', '销售确认'],
    statistical_period: ['Reported statistical period', '报告的统计期间']
  };
  const labelZh = {
    mp_concentrate_fy25: 'MP 精矿生产 · 2025全年',
    mp_ndpr_production_fy25: 'MP 分离镨钕氧化物生产 · 2025全年',
    mp_concentrate_sales_fy25: 'MP 精矿销售 · 2025全年',
    mp_ndpr_sales_fy25: 'MP 氧化物当量销售 · 2025全年',
    mp_concentrate_q226: 'MP 精矿生产 · 2026第二季度',
    mp_ndpr_production_q226: 'MP 分离镨钕氧化物生产 · 2026第二季度',
    mp_ndpr_sales_q226: 'MP 氧化物当量销售 · 2026第二季度',
    mp_independence_initial: 'Independence 初始磁体产能方案',
    mp_independence_expansion: 'Independence 磁体扩建目标',
    mp_10x: '10X 计划磁体产能',
    neo_narva_1a: 'Narva 1A期磁体目标产能',
    neo_narva_1b: 'Narva 1B期磁体计划产能',
    neo_commercial_event: 'Narva 首批商业客户交付',
    evac_nameplate: 'eVAC Sumter 名义产能',
    jlmag_blank_fy25: '金力永磁集团 · 毛坯产量',
    jlmag_finished_sales_fy25: '金力永磁集团 · 成品销量',
    jlmag_designed_capacity_2025: '金力永磁集团 · 年末设计产能',
    jlmag_annual_capacity_2025: '金力永磁集团 · 报告的实际年生产能力',
    jlmag_planned_capacity_2027: '金力永磁集团 · 计划总产能',
    ef_tb_pilot: 'White Mesa 首批铽氧化物',
    ef_dy_pilot: 'White Mesa 镝氧化物中试'
  };
  let packet = null;
  let pending = null;
  let failed = false;

  function translated(table, key, language) {
    const row = table[key];
    return row ? row[language === 'zh' ? 1 : 0] : key;
  }

  function sourceURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function valueHTML(record, language) {
    const l = copy[language];
    if (!Number.isFinite(record.value)) return `<strong class="ve-value ve-value-unknown">${l.unknown}</strong>`;
    const number = new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-US', {maximumFractionDigits: 6}).format(record.value);
    const comparator = record.comparator === 'nearly' ? (language === 'zh' ? '接近 ' : 'nearly ')
      : ['>', '≥', '<', '≤'].includes(record.comparator) ? `${record.comparator} `
      : record.quantity_status === 'observed_reported_approximate' ? '≈ ' : '';
    return `<strong class="ve-value">${esc(comparator + number)}</strong>`;
  }

  function category(record) {
    if (record.quantity_status === 'observed_reported_pilot') return 'pilot';
    if (record.time_basis === 'annual_capacity') return 'capacity';
    if (record.time_basis === 'sales_recognition') return 'sales';
    if (record.quantity_status === 'observed_event_quantity_unknown') return 'event';
    return 'production';
  }

  function recordHTML(record, sources, node, language, group) {
    const l = copy[language], source = sources.get(record.source_id), url = sourceURL(source?.url);
    if (!source || !url) return `<p class="ve-gap">${l.sourceMissing}</p>`;
    const notes = [record.unit_note, record.overlap_note, record.conversion_note,
      record.recognition_basis && `Recognition basis: ${record.recognition_basis}`,
      record.includes_intercompany_sales && `${l.intercompany}${record.includes_intercompany_sales}`,
      record.purity_basis,
      record.not_yield_pair && l.groupUnknown,
      record.superseded_by && l.earlierPlan,
      record.id === 'mp_independence_expansion' && l.supersedes,
      record.overlap_group === 'jlmag_capacity_snapshots' && l.capacitySnapshots,
      record.annualize_allowed === false && (language === 'zh' ? '不允许年化。' : 'Do not annualize this milestone.')
    ].filter(Boolean);
    const oxideEquivalentSales = ['mp_ndpr_sales_fy25', 'mp_ndpr_sales_q226'].includes(record.id);
    const scope = group ? l.groupScope : oxideEquivalentSales ? l.mpSalesScope : record.scope.site_label || node.name || node.id;
    const locator = record.source_locator || source.locator;
    return `<article class="ve-record ve-record-${category(record)}" data-volume-record="${esc(record.id)}">
      <p class="ve-status">${esc(translated(statuses, record.quantity_status, language))}</p>
      <h5>${esc(language === 'zh' ? labelZh[record.id] || record.label_en : record.label_en)}</h5>
      <p class="ve-quantity">${valueHTML(record, language)}<span>${esc(record.native_unit)}</span></p>
      <dl class="ve-basis"><div><dt>${l.product}</dt><dd>${esc(record.product_form)}</dd></div><div><dt>${l.period}</dt><dd>${esc(record.period)} · ${esc(translated(timeBases, record.time_basis, language))}</dd></div><div><dt>${l.scope}</dt><dd>${esc(scope)}</dd></div></dl>
      ${record.superseded_by ? `<p class="ve-gap">${l.earlierPlan}</p>` : ''}
      <a class="ve-source" href="${esc(url)}" target="_blank" rel="noopener">${l.source} ↗ ${esc(source.title)}</a>
      <p class="ve-source-meta">${source.publication_date ? `${l.published}: ${esc(source.publication_date)}` : ''}${source.revision_date ? ` · Revision: ${esc(source.revision_date)}` : ''} · ${l.checked}: ${esc(record.checked_at || source.checked_at || packet.as_of)}${locator ? `<br>${esc(locator)}` : ''}</p>
      <details class="ve-definitions"><summary>${l.details}</summary>${[...new Set(notes)].map(note => `<p>${esc(note)}</p>`).join('')}${record.missing_fields?.length ? `<p><strong>${l.missing}:</strong> ${esc(record.missing_fields.join('; '))}.</p>` : ''}<p class="ve-native-basis">${esc(record.quantity_status)} · ${esc(record.time_basis)} · ${esc(record.stage)}</p></details>
    </article>`;
  }

  function unknownHTML(node, language) {
    const l = copy[language];
    return `<section class="volume-evidence" data-volume-place="${esc(node.id)}" lang="${language === 'zh' ? 'zh-CN' : 'en'}"><h4>${l.title}</h4><p class="ve-gap">${l.plantUnknown}</p><button type="button" class="ve-group-link" data-related-place="jlmag_group">${l.openGroup} ↗</button></section>`;
  }

  window.loadVolumeEvidence = function loadVolumeEvidence() {
    if (pending) return pending;
    pending = fetch('data/volume-records.json', {cache: 'no-store'})
      .then(response => {
        if (!response.ok) throw new Error('Source-native quantity packet unavailable');
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data.records) || !Array.isArray(data.sources)) throw new Error('Invalid quantity packet');
        packet = data;
        failed = false;
        return packet;
      })
      .catch(() => {
        failed = true;
        return null;
      });
    return pending;
  };

  window.renderVolumeEvidenceForPlace = function renderVolumeEvidenceForPlace(node, language = 'en') {
    if (!node || typeof node.id !== 'string') return '';
    language = language === 'zh' ? 'zh' : 'en';
    const l = copy[language];
    if (jlmagPlants.has(node.id)) return unknownHTML(node, language);
    const siteId = siteBindings[node.id], group = node.id === 'jlmag_group';
    if (!siteId && !group) return '';
    const prefix = `<section class="volume-evidence" data-volume-place="${esc(node.id)}" lang="${language === 'zh' ? 'zh-CN' : 'en'}"><h4>${l.title}</h4>`;
    if (!packet) return `${prefix}<p class="ve-gap">${failed ? l.unavailable : l.pending}</p></section>`;
    // Never match by country, parent/company name, coordinates or material tags.
    const records = packet.records.filter(record => group
      ? record.scope?.kind === 'company' && record.scope.company_id === 'app_jlmag' && !record.scope.site_id
      : ['site', 'company_operating_site'].includes(record.scope?.kind) && record.scope.site_id === siteId);
    if (!records.length) return `${prefix}<p class="ve-gap">${l.unmatched}</p></section>`;
    const sources = new Map(packet.sources.map(source => [source.id, source]));
    const gap = group ? l.groupUnknown : siteId === 'white_mesa' ? l.pilotUnknown
      : ['mp_independence', 'mp_10x', 'neo_narva', 'evac_sumter'].includes(siteId) ? l.annualMagnetUnknown : '';
    const scope = group ? l.groupScope : l.siteScope;
    return `${prefix}<p class="ve-scope">${scope}</p>${gap ? `<p class="ve-gap">${gap}</p>` : ''}${siteId === 'mp_mine' ? `<p class="ve-chain-boundary">${l.mpBoundary}</p>` : ''}<details class="ve-record-list" open><summary>${language === 'zh' ? '逐条查看原始量' : 'Inspect the source-native records'} · ${records.length}</summary><div class="ve-records">${records.map(record => recordHTML(record, sources, node, language, group)).join('')}</div></details><p class="ve-boundary">${l.boundary}</p></section>`;
  };
})();
