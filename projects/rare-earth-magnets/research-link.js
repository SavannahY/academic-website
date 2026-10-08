/* Source-backed deep links operate the existing timeline controls; film unchanged. */
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const year = params.get('year');
  if (!/^20\d{2}$/.test(year || '')) return;
  const mount = document.getElementById('research-film');
  if (!mount) return;
  let handled = false;
  const apply = () => {
    if (handled || mount.dataset.ready !== 'true') return;
    const buttons = [...mount.querySelectorAll('[data-rf-chapter]')];
    const button = buttons.find(item => item.querySelector('strong')?.textContent.trim() === year);
    if (!button) return;
    handled = true;
    button.click();
    const requested = params.get('card');
    if (/^\d{1,2}$/.test(requested || '')) {
      const card = mount.querySelector(`[data-rf-card="${Number(requested)}"]`);
      card?.click();
    }
    mount.dataset.linkedYear = year;
    observer.disconnect();
  };
  const observer = new MutationObserver(apply);
  observer.observe(mount, {attributes:true,attributeFilter:['data-ready'],childList:true,subtree:true});
  apply();
})();
