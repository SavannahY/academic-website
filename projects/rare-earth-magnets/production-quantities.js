/* Reported mine production uses the source's rounded world denominator. */
(() => {
  'use strict';
  let packet=null;
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=(n,d=0)=>n.toLocaleString('en-US',{maximumFractionDigits:d});
  function mount(){
    const box=document.getElementById('production-quantities');
    if(!box||box.dataset.ready||!packet)return;
    box.dataset.ready='true';
    const rows=packet.records.filter(r=>r.id.startsWith('mine_2025_')).sort((a,b)=>b.value-a.value);
    const total=packet.records.find(r=>r.id==='world_mine_2025')?.value;
    if(!Number.isFinite(total)||total<=0)return;
    const source=packet.sources.find(s=>s.id==='USGS_RE_2026');
    let unit='tonnes',selected=rows[0].id;
    box.innerHTML=`<section class="production-quantities"><p class="micro-label">A separate source boundary · 2025 estimated mine production</p><h3>Where rare-earth concentrate is produced.</h3><p>These bars show REO-equivalent/content, covering all reported rare earths. They cannot establish NdPr, Dy, Tb or finished-magnet flows. Coverage and year differ from the 2024 magnet-rare-earth mining shares in the original prototype.</p><div class="production-unit" role="group" aria-label="Mine production display unit"><button type="button" data-production-unit="tonnes" aria-pressed="true">Tonnes REO</button><button type="button" data-production-unit="share" aria-pressed="false">% of world total</button></div><p class="production-denominator">Published world denominator: <strong>${fmt(total)} tonnes REO</strong> · 2025. Country rows total ${fmt(rows.reduce((s,r)=>s+r.value,0))}; the 690-tonne rounding difference is not another producing country.</p><div class="production-bars"></div><details class="production-more"><summary>All reported countries and zero values</summary><div class="production-all"></div></details><div class="production-detail" aria-live="polite"></div><a class="production-source" href="${esc(source?.url)}" target="_blank" rel="noopener">${esc(source?.title||'USGS MCS 2026')} · ${esc(source?.locator||'Rare earths table')}</a></section>`;
    function row(r){
      const share=r.value/total*100,label=unit==='share'?`${fmt(share,2)}%`:`${fmt(r.value)} t REO`;
      return `<button type="button" class="production-row" data-production-record="${esc(r.id)}" aria-pressed="${r.id===selected}"><span>${esc(r.scope.country)}</span><i aria-hidden="true"><b style="width:${share}%"></b></i><strong>${label}</strong></button>`;
    }
    function render(){
      box.querySelector('.production-bars').innerHTML=rows.slice(0,4).map(row).join('');
      box.querySelector('.production-all').innerHTML=rows.slice(4).map(row).join('');
      box.querySelectorAll('[data-production-unit]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.productionUnit===unit)));
      const r=rows.find(x=>x.id===selected);
      box.querySelector('.production-detail').innerHTML=`<strong>${esc(r.scope.country)} · ${fmt(r.value)} tonnes REO</strong><p>${esc(r.period)} · ${esc(r.quantity_status.replaceAll('_',' '))} · country aggregate</p><p>${esc(r.product_form)}. Individual-element assay, plant allocation, and destination/customer flows are unknown.</p><p>${esc(r.unit_note||'Use the source’s own REO-equivalent/content basis.')}</p>`;
    }
    box.onclick=e=>{const u=e.target.closest('[data-production-unit]'),r=e.target.closest('[data-production-record]');if(u)unit=u.dataset.productionUnit;if(r)selected=r.dataset.productionRecord;if(u||r)render();};
    render();
  }
  new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
  fetch('data/volume-records.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('missing quantity evidence');return r.json();}).then(data=>{packet=data;mount();}).catch(()=>{const box=document.getElementById('production-quantities');if(box)box.textContent='Mine-production evidence unavailable; no country values were inferred.';});
})();
