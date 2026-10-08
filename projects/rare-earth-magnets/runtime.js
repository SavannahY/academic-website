'use strict';
// Run the canonical Python implementation in a worker, keeping the UI responsive.
(() => {
  let worker = null, nextId = 0;
  const pending = new Map();
  const base = new URL('.', document.currentScript.src);
  function request(action, config) {
    if (!worker) {
      worker = new Worker(new URL('python-worker.js?v=20261007-5', base));
      worker.onmessage = ({data}) => {
        const task = pending.get(data.id);
        if (!task) return;
        pending.delete(data.id);
        clearTimeout(task.timer);
        if (data.error) task.reject(new Error(data.error));
        else task.resolve(data.result);
      };
      worker.onerror = () => {
        for (const task of pending.values()) {
          clearTimeout(task.timer);
          task.reject(new Error('The research runtime could not load. Check your connection and reload the page.'));
        }
        pending.clear();
        worker.terminate(); worker = null;
      };
    }
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error('The Python runtime did not respond. Check your connection and reload to retry.'));
      }, 120000);
      pending.set(id, {resolve, reject, timer});
      worker.postMessage({id, action, config});
    });
  }
  globalThis.RareEarthRuntime = Object.freeze({
    defaults: () => request('defaults'),
    sources: () => request('sources'),
    run: config => request('run', config),
    tradeRisk: config => request('trade-risk', config),
    chainDefaults: () => request('chain-defaults'),
    chainSimulate: config => request('chain-simulate', config),
    chainCompare: config => request('chain-compare', config),
  });
})();
