'use strict';
const citations = {
  tsg: '@article{he2026flexibility,\n  author = {He, Zhihao and Li, Zhiyi and Yang, Zhengjie and Han, Xutao and Wan, Can and Ju, Ping and Xu, Yan},\n  title = {Analyzing the Aggregate Flexibility of Generalized Energy Storage Resources: An Enhanced Region Learning Method},\n  journal = {IEEE Transactions on Smart Grid},\n  year = {2026},\n  volume = {17},\n  number = {4},\n  pages = {3170--3181},\n  doi = {10.1109/TSG.2026.3655773}\n}',
  irfa: '@article{hua2026greeninnovation,\n  author = {Hua, Huan and Jiang, Gaozhe and Chao, Gang and Yang, Zhengjie},\n  title = {Can corporate green strategic actions enhance green innovation performance?},\n  journal = {International Review of Financial Analysis},\n  year = {2026},\n  volume = {118},\n  pages = {105421},\n  doi = {10.1016/j.irfa.2026.105421}\n}',
  frl: '@article{li2025greenwashing,\n  author = {Li, Yenan and Yang, Zhengjie and Dong, Xiangyu},\n  title = {Green bond and greenwashing: New insights from Chinese firms},\n  journal = {Finance Research Letters},\n  year = {2025},\n  volume = {85},\n  pages = {107847},\n  doi = {10.1016/j.frl.2025.107847}\n}'
};
const copyStatus = document.getElementById('copy-status');
const fallback = document.getElementById('citation-fallback');
const citationText = document.getElementById('citation-text');
let lastCitationButton;
document.querySelectorAll('[data-citation]').forEach(button => {
  button.addEventListener('click', async () => {
    const citation = citations[button.dataset.citation];
    if (!citation) return;
    lastCitationButton = button;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(citation);
      copyStatus.textContent = 'BibTeX citation copied.';
      button.textContent = 'Copied';
      window.setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 2000);
    } catch {
      fallback.hidden = false;
      citationText.value = citation;
      citationText.focus();
      citationText.select();
      copyStatus.textContent = 'Select and copy the citation below.';
    }
  });
});
document.getElementById('close-citation').addEventListener('click', () => {
  fallback.hidden = true;
  copyStatus.textContent = '';
  if (lastCitationButton) lastCitationButton.focus();
});
