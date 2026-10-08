/* Stable destinations. Local links explain the current section; filters do not rename it. */
(() => {
  'use strict';
  const header=document.querySelector('.masthead'),nav=header?.querySelector('nav');
  if(!header||!nav)return;
  const page=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'');
  const primary=[
    ['supply','Supply chain','供应链','grades.html?layer=facilities#origins'],
    ['flows','Flows & balance','流量与平衡','flows.html'],
    ['applications','Applications & demand','应用与需求','grades.html?layer=applications&application_country=United%20States#origins'],
    ['future','Future research','未来研究','future.html'],
    ['knowledge','Davis knowledge','Davis 知识框架','knowledge.html'],
    ['process','Factory tour','工序与设备','process.html'],
    ['chain','Supply laboratory','供应链实验','chain.html']
  ];
  const sections={
    flows:[['Flow workspace','流量视图','#flow-workspace'],['Sourced demand','有来源的需求','flows.html?view=demand'],['Original prototype','原始示意图','flows.html?view=prototype'],['Material balance','物料平衡','flows.html?view=balance'],['U.S. application map','美国应用地图','grades.html?layer=applications&application_country=United%20States#origins']],
    index:[['Material guide','材料指南','grades.html'],['Application requirements','应用要求','applications.html'],['Investment & security','投资与安全','investment.html'],['Overview','系统概览','#supply-board'],['Experiment','实验','#experiment'],['Sources','来源','#sources']],
    grades:[['Atlas','地图','#origins'],['Performance','性能','#performance'],['Formulation','配方','#composition'],['Prices','价格','#prices'],['Industry size','行业规模','future.html?question=demand#future-questions'],['Application requirements','应用要求','applications.html'],['Investment & security','投资与安全','investment.html']],
    applications:[['U.S. application map','美国应用地图','grades.html?layer=applications&application_country=United%20States#origins'],['Industry size','行业规模','future.html?question=demand#future-questions'],['Practitioner context','从业者背景','#industry-insights'],['Material guide','材料指南','grades.html']],
    future:[['Two maps','两张地图','#future-linked-maps'],['Demand & qualification','需求与认证','future.html?question=demand#future-questions'],['Equipment readiness','设备就绪','future.html?question=readiness#future-questions'],['Cost & security','成本与安全','future.html?question=frontier#future-questions']],
    knowledge:[['Concept map','概念图','knowledge.html?view=topics'],['Chronology','时间树','knowledge.html?view=tree'],['Research film','研究动画','research.html#research-film'],['Methods','方法','methods.html'],['Collaborators','合作研究者','collaborators.html'],['Students','学生','students.html']],
    process:[['Material guide','材料指南','grades.html'],['Equipment readiness','设备就绪','future.html?question=readiness#future-questions'],['Investment & security','投资与安全','investment.html']],
    chain:[['Investment & security','投资与安全','investment.html'],['Methods','方法','methods.html'],['Material guide','材料指南','grades.html']]
  };
  const researchPages=new Set(['research','methods','collaborators','students']);
  const local=sections[page]||(researchPages.has(page)?sections.knowledge:[['Material guide','材料指南','grades.html'],['Application requirements','应用要求','applications.html'],['Investment & security','投资与安全','investment.html']]);
  const secondary=document.createElement('nav');secondary.className='site-secondary';secondary.setAttribute('aria-label','Section navigation');header.after(secondary);
  header.classList.add('site-header');nav.classList.add('site-primary');
  let mode=new URLSearchParams(location.search).get('layer')||document.getElementById('map-layer')?.value||'facilities';
  function anchor(label,url){const a=document.createElement('a');a.textContent=label;a.href=url;return a;}
  function render(){
    const zh=document.documentElement.lang.startsWith('zh');
    const active=page==='grades'?(mode==='applications'?'applications':'supply'):page==='applications'?'applications':researchPages.has(page)?'knowledge':page;
    nav.replaceChildren(...primary.map(([id,en,cn,url])=>{const a=anchor(zh?cn:en,url);a.dataset.navRoute=id;if(id===active)a.setAttribute('aria-current','page');return a;}));
    secondary.replaceChildren(anchor(zh?'← Jane Yang · 项目':'← Jane Yang · Projects','../../#personal-projects'),...local.map(([en,cn,url])=>anchor(zh?cn:en,url)));
  }
  document.addEventListener('rareearth:navigation-mode',e=>{mode=e.detail?.mode||mode;render();});
  document.getElementById('map-layer')?.addEventListener('change',e=>{mode=e.target.value;render();});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  render();
})();
