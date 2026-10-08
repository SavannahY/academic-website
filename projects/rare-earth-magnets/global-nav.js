/* Four stable chapters; the current surface determines the chapter context. */
(() => {
  'use strict';
  const header = document.querySelector('.masthead');
  const primary = header?.querySelector('nav');
  if (!header || !primary) return;
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  const chapters = [
    { id: 'demand', number: '01', en: 'Demand / Applications', zh: '需求流量 / 应用', href: 'flows.html?view=demand#flow-workspace', links: [
      ['demand-flow', 'Sourced demand flows', '有来源的需求流量', 'flows.html?view=demand#flow-workspace'],
      ['application-map', 'U.S. application map', '美国应用地图', 'grades.html?layer=applications&application_country=United%20States#origins'],
      ['requirements', 'Application requirements', '应用要求', 'applications.html']
    ] },
    { id: 'supply', number: '02', en: 'Supply', zh: '供应', href: 'grades.html#origin-flow', links: [
      ['origin-flow', 'Mining-origin flow', '矿源流向', 'grades.html#origin-flow'],
      ['supply-atlas', 'Supply atlas', '供应地图', 'grades.html?layer=facilities#origins'],
      ['performance', 'Grade performance', '磁体牌号与性能', 'grades.html#performance'],
      ['composition', 'Alloy formulations', '合金配方', 'grades.html#composition'],
      ['prices', 'Material prices', '原料价格', 'grades.html#prices'],
      ['prototype', '100-unit prototype', '100 单位示意系统', 'flows.html?view=prototype#flow-workspace'],
      ['balance', 'Material balance', '物料平衡', 'flows.html?view=balance#flow-workspace']
    ] },
    { id: 'factory', number: '03', en: 'Factory Tour', zh: '工厂之旅', href: 'process.html', links: [
      ['process', 'Factory tour & processes', '工厂之旅与工序', 'process.html'],
      ['readiness', 'Equipment readiness', '设备就绪', 'future.html?question=readiness#future-questions']
    ] },
    { id: 'future', number: '04', en: 'Future Importance', zh: '未来的重要性', href: 'future.html#future-questions', links: [
      ['future', 'Future research questions', '未来研究问题', 'future.html#future-questions'],
      ['investment', 'Investment & security', '投资与供应安全', 'investment.html'],
      ['chain', 'Supply laboratory', '供应链实验', 'chain.html'],
      ['experiment', 'Quantitative experiment', '定量实验', 'index.html#experiment']
    ] }
  ];
  const resources = [
    ['research', 'Research film', '研究动画', 'research.html#research-film'],
    ['knowledge', 'Davis knowledge', 'Davis 知识框架', 'knowledge.html'],
    ['methods', 'Methods & evidence', '方法与证据', 'methods.html'],
    ['collaborators', 'Collaborators', '合作研究者', 'collaborators.html'],
    ['students', 'Students', '学生', 'students.html']
  ];
  const pageSections = {
    index: [['Chapter guide', '四章指南', '#chapter-guide'], ['Overview', '系统概览', '#supply-board'], ['Experiment', '实验', '#experiment'], ['Sources', '来源', '#sources']],
    applications: [['Practitioner context', '从业者背景', '#industry-insights']],
    future: [['Two linked maps', '两张关联地图', '#future-linked-maps'], ['Demand & qualification', '需求与认证', 'future.html?question=demand#future-questions'], ['Equipment readiness', '设备就绪', 'future.html?question=readiness#future-questions'], ['Cost & security', '成本与供应安全', 'future.html?question=frontier#future-questions']],
    knowledge: [['Concept map', '概念图', 'knowledge.html?view=topics'], ['Chronology', '时间树', 'knowledge.html?view=tree']]
  };
  const initial = new URLSearchParams(location.search);
  let mapMode = initial.get('layer') || document.getElementById('map-layer')?.value || 'facilities';
  let flowView = initial.get('view') || 'demand';
  let question = initial.get('question') || 'demand';
  let surfaceHash = location.hash;
  let urlHash = location.hash;
  let urlLayer = initial.get('layer');
  let previousSignature = '';
  header.querySelector('.brand')?.setAttribute('href', chapters[0].href);
  header.classList.add('site-header');
  primary.classList.add('site-primary');
  primary.setAttribute('aria-label', 'Four chapters / 四个章节');
  let bar = document.querySelector('.site-chapter-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'site-chapter-bar';
    header.after(bar);
  }
  let pagination = document.querySelector('.site-chapter-pagination');
  if (!pagination) {
    pagination = document.createElement('nav');
    pagination.className = 'site-chapter-pagination';
    pagination.setAttribute('aria-label', 'Continue through the chapters / 继续阅读章节');
    const main = document.querySelector('main');
    if (main) main.after(pagination);
    else document.querySelector('footer')?.before(pagination);
  }
  function bilingual(en, zh) {
    const label = document.createElement('span');
    label.className = 'site-link-label';
    const english = document.createElement('span');
    english.lang = 'en';
    english.className = 'site-link-en';
    english.textContent = en;
    const chinese = document.createElement('small');
    chinese.lang = 'zh';
    chinese.textContent = zh;
    label.append(english, chinese);
    return label;
  }
  function link(id, en, zh, href, current = '') {
    const anchor = document.createElement('a');
    anchor.href = href;
    if (id) anchor.dataset.navRoute = id;
    if (current) anchor.setAttribute('aria-current', current);
    anchor.append(bilingual(en, zh));
    return anchor;
  }
  function context() {
    const hash = surfaceHash;
    if (page === 'flows') return flowView === 'prototype'
      ? { chapter: 1, route: 'prototype', en: '100-unit prototype', zh: '100 单位示意系统' }
      : flowView === 'balance'
        ? { chapter: 1, route: 'balance', en: 'Material balance', zh: '物料平衡' }
        : { chapter: 0, route: 'demand-flow', en: 'Sourced demand flows', zh: '有来源的需求流量' };
    if (page === 'grades') {
      const supplySections = { '#origin-flow': ['origin-flow', 'Mining-origin flow', '矿源流向'], '#performance': ['performance', 'Grade performance', '磁体牌号与性能'], '#composition': ['composition', 'Alloy formulations', '合金配方'], '#prices': ['prices', 'Material prices', '原料价格'] };
      if (supplySections[hash]) {
        const [route, en, zh] = supplySections[hash];
        return { chapter: 1, route, en, zh };
      }
      if (mapMode === 'applications') {
        const country = document.getElementById('map-application-country')?.value || new URLSearchParams(location.search).get('application_country');
        return { chapter: 0, route: 'application-map', en: country === 'United States' ? 'U.S. application map' : 'Application map', zh: country === 'United States' ? '美国应用地图' : '应用地图' };
      }
      return { chapter: 1, route: 'supply-atlas', en: mapMode === 'reserves' ? 'Supply atlas · Country reserves' : 'Supply atlas & material guide', zh: mapMode === 'reserves' ? '供应地图 · 国家储量' : '供应地图与材料指南' };
    }
    if (page === 'applications') return { chapter: 0, route: 'requirements', en: 'Application requirements', zh: '应用要求' };
    if (page === 'process') return { chapter: 2, route: 'process', en: 'Factory tour & processes', zh: '工厂之旅与工序' };
    if (page === 'future' && question === 'readiness') return { chapter: 2, route: 'readiness', en: 'Equipment readiness', zh: '设备就绪' };
    if (page === 'future') return { chapter: 3, route: 'future', en: question === 'frontier' ? 'Future research · Cost & security' : 'Future research · Demand & qualification', zh: question === 'frontier' ? '未来研究 · 成本与供应安全' : '未来研究 · 需求与认证' };
    if (page === 'investment') return { chapter: 3, route: 'investment', en: 'Investment & security', zh: '投资与供应安全' };
    if (page === 'chain') return { chapter: 3, route: 'chain', en: 'Supply laboratory', zh: '供应链实验' };
    if (page === 'index') return !hash || hash === '#chapter-guide'
      ? { chapter: 0, route: 'chapter-guide', en: 'Start here · Four chapters', zh: '从这里开始 · 四章指南' }
      : { chapter: 3, route: 'experiment', en: 'Quantitative experiment', zh: '定量实验' };
    const resource = resources.find(([id]) => id === page);
    return { chapter: 3, resource: page, en: `Research resource · ${resource?.[1] || 'Further reading'}`, zh: `研究资料 · ${resource?.[2] || '延伸阅读'}` };
  }
  function continuation(chapter, direction) {
    const label = direction === 'previous' ? 'Previous chapter' : direction === 'next' ? 'Next chapter' : 'Return to chapter 01';
    const labelZh = direction === 'previous' ? '上一章' : direction === 'next' ? '下一章' : '回到第一章';
    const anchor = link('', `${chapter.number} ${chapter.en}`, chapter.zh, chapter.href);
    anchor.className = `site-chapter-step site-chapter-${direction}`;
    const eyebrow = document.createElement('span');
    eyebrow.className = 'site-step-direction';
    eyebrow.textContent = `${direction === 'previous' ? '← ' : ''}${label} / ${labelZh}${direction !== 'previous' ? ' →' : ''}`;
    anchor.prepend(eyebrow);
    return anchor;
  }
  function render() {
    const current = context();
    const chapter = chapters[current.chapter];
    const signature = JSON.stringify([current, location.hash, document.documentElement.lang]);
    if (signature === previousSignature) return;
    previousSignature = signature;
    document.body.dataset.chapter = chapter.number;
    primary.replaceChildren(...chapters.map((item, index) => {
      const anchor = link(item.id, item.en, item.zh, item.href, index === current.chapter ? 'step' : '');
      const number = document.createElement('span');
      number.className = 'site-chapter-number';
      number.textContent = item.number;
      anchor.prepend(number);
      return anchor;
    }));
    const status = document.createElement('div');
    status.className = 'site-chapter-context';
    const progress = document.createElement('p');
    progress.className = 'site-chapter-progress';
    progress.textContent = `Chapter ${chapter.number} of 04 / 第 ${chapter.number} 章 · ${chapter.en}`;
    const surface = document.createElement('p');
    surface.className = 'site-current-context';
    surface.append(bilingual(current.en, current.zh));
    status.append(progress, surface);
    const secondary = document.createElement('nav');
    secondary.className = 'site-secondary';
    secondary.setAttribute('aria-label', `${chapter.en} subpages / 本章页面`);
    secondary.replaceChildren(...chapter.links.map(([id, en, zh, href]) => link(id, en, zh, href, id === current.route ? 'page' : '')));
    const hint = document.createElement('p');
    hint.className = 'site-navigation-hint';
    hint.textContent = 'Explore this chapter / 本章页面 · Swipe links →';
    const resourceNav = document.createElement('nav');
    resourceNav.className = 'site-resources';
    resourceNav.setAttribute('aria-label', 'Supporting research resources / 研究资料');
    const resourceLabel = document.createElement('span');
    resourceLabel.className = 'site-resource-label';
    resourceLabel.textContent = 'Research resources / 研究资料';
    resourceNav.append(resourceLabel, ...resources.map(([id, en, zh, href]) => link(id, en, zh, href, id === current.resource ? 'page' : '')));
    const local = document.createElement('nav');
    local.className = 'site-page-links';
    local.setAttribute('aria-label', 'Current page sections / 当前页面内容');
    local.append(...(pageSections[page] || []).map(([en, zh, href]) => link('', en, zh, href, href === location.hash || (page === 'index' && current.route === 'chapter-guide' && href === '#chapter-guide') ? 'location' : '')));
    bar.replaceChildren(status, hint, secondary, ...(local.childElementCount ? [local] : []), resourceNav);
    const projects = link('', 'Return to personal projects', '返回个人项目', 'https://janeyang.me/#personal-projects');
    projects.className = 'site-project-return site-pagination-return';
    pagination.replaceChildren(...(current.chapter > 0 ? [continuation(chapters[current.chapter - 1], 'previous')] : []), continuation(chapters[current.chapter < 3 ? current.chapter + 1 : 0], current.chapter < 3 ? 'next' : 'return'), projects);
    pagination.classList.toggle('site-first-chapter', current.chapter === 0);
  }
  function readLocation() {
    const params = new URLSearchParams(location.search);
    flowView = params.get('view') || 'demand';
    question = params.get('question') || 'demand';
    if (page === 'grades' && params.get('layer') !== urlLayer) {
      urlLayer = params.get('layer');
      mapMode = urlLayer || 'facilities';
      surfaceHash = '#origins';
    }
    if (location.hash !== urlHash) {
      urlHash = location.hash;
      surfaceHash = urlHash;
    }
    render();
  }
  function selectMap(mode, userSelected = false) {
    if (mode !== mapMode || userSelected) surfaceHash = '#origins';
    mapMode = mode;
    render();
  }
  document.addEventListener('rareearth:navigation-mode', event => selectMap(event.detail?.mode || mapMode));
  document.getElementById('map-layer')?.addEventListener('change', event => selectMap(event.target.value, true));
  document.getElementById('map-application-country')?.addEventListener('change', () => { surfaceHash = '#origins'; render(); });
  document.addEventListener('rareearth:flow-view', event => { flowView = event.detail?.view || flowView; render(); });
  document.addEventListener('click', event => {
    const flow = event.target.closest?.('[data-flow-view]');
    const future = event.target.closest?.('[data-question], [data-case-question]');
    if (flow) { flowView = flow.dataset.flowView; render(); }
    if (future) { question = future.dataset.question || future.dataset.caseQuestion; render(); }
  });
  // Existing views use replaceState without a native URL-change event.
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      queueMicrotask(readLocation);
      return result;
    };
  }
  window.addEventListener('popstate', readLocation);
  window.addEventListener('hashchange', readLocation);
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  render();
})();
