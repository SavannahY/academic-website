/* Readable full text of completed public-source memos; no new research model. */
(() => {
  'use strict';
  const mount = document.getElementById('methods-reading');
  if (!mount) return;
  const esc = text => String(text ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const headings = new Set(['Small study-method comparison','The energy/material-security baseline in detail','The demand calculation is closer to a reproducible public starting point','What the other studies add about research construction','Recurring patterns — interpretation from the documented studies, not claims about daily routine','Publicly documented magnet-related scope and what remains unknown','Publicly reproducible work and additional evidence needed','Five concrete research-design recommendations (proposed design, not Davis’s established findings)','Research-design questions','TIMELINE','DOCUMENTED REASONS VERSUS INTERPRETATIONS','FIVE RECURRING RESEARCH HABITS','PROPOSED MAGNET RESEARCH CONNECTIONS — NOT AN EXISTING DAVIS PROJECT DESCRIPTION',"PROPOSED MAGNET RESEARCH CONNECTIONS — NOT AN EXISTING DAVIS PROJECT DESCRIPTION",'RESEARCH-DESIGN QUESTIONS','EVIDENCE GAPS']);
  function inline(text) {
    const links = [];
    let encoded = esc(text).replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, (_, label, url) => { const id = links.length; links.push(`<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`); return `@@MEMOLINK${id}@@`; });
    encoded = encoded.replace(/https:\/\/[^\s<>]+/g, raw => { const url = raw.replace(/[.,;]+$/, ''); return `<a href="${url}" target="_blank" rel="noopener">${url} ↗</a>${raw.slice(url.length)}`; });
    return encoded.replace(/@@MEMOLINK(\d+)@@/g, (_, id) => links[Number(id)]);
  }
  function renderText(body) {
    const blocks = body.trim().split(/\n\s*\n/);
    return blocks.map(block => {
      const lines = block.split('\n');
      if (headings.has(block)) return `<h3>${esc(block)}</h3>`;
      if (lines.every(line => line.trim().startsWith('|'))) {
        const rows = lines.filter(line => !/^\|[\s:|\-]+\|\s*$/.test(line.trim())).map(line => line.trim().slice(1,-1).split('|').map(cell => cell.trim()));
        return `<div class="memo-table-wrap" role="region" tabindex="0" aria-label="Study comparison table; scroll horizontally on a narrow screen"><table><thead><tr>${rows[0].map(cell => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      }
      if (lines.every(line => /^- /.test(line))) return `<ul>${lines.map(line => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
      return `<p>${inline(block).replace(/\n/g,'<br>')}</p>`;
    }).join('');
  }
  fetch('data/davis-methods.json').then(response => {if (!response.ok) throw new Error('Report unavailable');return response.json();}).then(data => {
    mount.innerHTML = data.reports.map(report => `<article class="memo-report" id="${esc(report.id)}"><header><p class="eyebrow">Public research review · ${esc(data.verified_on)}</p><h2>${esc(report.title)}</h2><p lang="zh">${esc(report.title_zh)}</p><p>${esc(report.basis)}</p></header><div class="memo-body">${renderText(report.body)}<p class="memo-coverage">${esc(data.scope)}</p></div></article>`).join('');
    mount.dataset.ready = 'true';
  }).catch(() => {mount.innerHTML='<p>The research reports could not load. Reload to retry. The Research, Collaborators and Students pages remain accessible above.</p>';});
})();
