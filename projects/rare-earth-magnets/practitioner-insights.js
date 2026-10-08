/* Anonymous practitioner observations, distinct from sourced evidence and model inputs. */
(() => {
  'use strict';
  const root=document.getElementById('industry-insights');
  if(!root)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={en:{eyebrow:'Industry notebook',title:'Find the product. Understand the buyer.',language:'Practitioner section language',observations:'Practitioner observations',evidence:'Public evidence',questions:'Questions to test',roles:'Explore a possible buyer path',path:'Roles may overlap or be skipped. Arrows explain roles; they do not establish a named supplier chain.',product:'Product to identify',lens:'A practical buyer-comparison lens',source:'Primary source',boundary:'Evidence boundary'},zh:{eyebrow:'行业观察笔记',title:'明确产品，理解采购方。',language:'从业者背景部分的语言',observations:'从业者观察',evidence:'公开证据',questions:'待验证问题',roles:'探索一种可能的客户路径',path:'角色可能重叠或省略。箭头解释角色，并不建立具名供应链。',product:'需要明确的产品',lens:'实际采购的比较维度',source:'一手来源',boundary:'证据边界'}};
  let data,sources=[],lang='en',tab='observations',role='producer',criterion='cost';
  const t=r=>r?.[lang]||r?.en||'';
  function render(){
    const l=labels[lang],selected=data.roles.find(r=>r.id===role),item=data.buyer_lens.find(r=>r.id===criterion);
    const tabs=['observations','evidence','questions'];
    const cards=tab==='observations'?data.observations:tab==='questions'?data.questions:data.evidence;
    root.lang=lang==='zh'?'zh-CN':'en';
    root.innerHTML=`<div class="pi-heading"><div><p class="eyebrow">${l.eyebrow}</p><h2>${l.title}</h2></div><div class="pi-language" role="group" aria-label="${l.language}"><button type="button" data-pi-lang="en" aria-pressed="${lang==='en'}">English</button><button type="button" data-pi-lang="zh" aria-pressed="${lang==='zh'}">中文</button></div></div><p class="pi-provenance">${esc(t(data.provenance))}</p><div class="pi-tabs" role="group" aria-label="${lang==='en'?'Separate observations, evidence and questions':'区分观察、证据及问题'}">${tabs.map(k=>`<button type="button" data-pi-tab="${k}" aria-pressed="${k===tab}">${l[k]}</button>`).join('')}</div><div class="pi-cards">${cards.map(r=>{const s=sources.find(x=>x.id===r.source_id);return `<article><span class="pi-evidence-kind">${l[tab]}</span><h3>${esc(t(r))}</h3><p>${esc(r['body_'+lang])}</p>${s?`<a href="${esc(s.url)}" target="_blank" rel="noopener">${l.source} ↗<small>${esc(s.date||s.publication_date||'')} · ${esc(s.title)}</small></a>`:''}</article>`;}).join('')}</div><div class="pi-role-section"><p class="eyebrow">${l.roles}</p><div class="pi-role-path" role="group" aria-label="${l.roles}">${data.roles.map((r,i)=>`${i?'<span aria-hidden="true">→</span>':''}<button type="button" data-pi-role="${r.id}" aria-pressed="${r.id===role}"><span>0${i+1}</span>${esc(t(r))}</button>`).join('')}</div><p class="pi-path-note">${l.path}</p><div class="pi-role-detail" aria-live="polite"><strong>${l.product}: ${esc(selected['product_'+lang])}</strong><p>${esc(selected['note_'+lang])}</p></div></div><div class="pi-buyer"><p class="eyebrow">${l.lens}</p><div class="pi-criteria" role="group" aria-label="${l.lens}">${data.buyer_lens.map(r=>`<button type="button" data-pi-criterion="${r.id}" aria-pressed="${r.id===criterion}">${esc(t(r))}</button>`).join('')}</div><p class="pi-criterion-detail" aria-live="polite">${esc(item['body_'+lang])}</p></div><p class="pi-boundary"><strong>${l.boundary}</strong> · ${esc(data['boundary_'+lang])}</p>`;
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    let attribute;
    if(b.dataset.piLang){lang=b.dataset.piLang;attribute='data-pi-lang';}
    else if(b.dataset.piTab){tab=b.dataset.piTab;attribute='data-pi-tab';}
    else if(b.dataset.piRole){role=b.dataset.piRole;attribute='data-pi-role';}
    else if(b.dataset.piCriterion){criterion=b.dataset.piCriterion;attribute='data-pi-criterion';}
    if(attribute){const value=b.getAttribute(attribute);render();root.querySelector(`[${attribute}="${value}"]`)?.focus({preventScroll:true});}
  });
  Promise.all([fetch('data/practitioner-insights.json').then(r=>{if(!r.ok)throw Error('Practitioner context unavailable');return r.json();}),fetch('data/application-supply.json').then(r=>{if(!r.ok)throw Error('Sources unavailable');return r.json();})]).then(([interview,atlas])=>{data=interview;sources=atlas.sources;render();}).catch(()=>{root.innerHTML='<p class="pi-boundary">The industry notebook could not load. No observation or source claims have been generated.</p>';});
})();
