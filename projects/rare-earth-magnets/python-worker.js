'use strict';
const PYODIDE_VERSION = '0.29.4';
let runtimePromise;
async function initialize() {
  importScripts('https://cdn.jsdelivr.net/pyodide/v' + PYODIDE_VERSION + '/full/pyodide.js');
  const py = await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v' + PYODIDE_VERSION + '/full/'});
  py.FS.mkdirTree('/study/rareearth');
  py.FS.mkdirTree('/study/data');
  const paths = ['rareearth/__init__.py','rareearth/model.py','rareearth/trade_risk.py','rareearth/chain.py','data/baseline.json','data/sources.json','data/supply-chain.json'];
  const files = await Promise.all(paths.map(async path => {
    const downloadPath = path === 'rareearth/__init__.py' ? 'rareearth/package-init.py' : path;
    const response = await fetch(new URL('engine/' + downloadPath, self.location.href));
    if (!response.ok) throw new Error('A research model asset could not be loaded. Reload to retry.');
    return [path, await response.text()];
  }));
  for (const [path, content] of files) py.FS.writeFile('/study/' + path, content);
  await py.runPythonAsync(`
import sys, json
sys.path.insert(0, '/study')
from rareearth.model import default_config, simulate, compare
from rareearth.trade_risk import trade_risk
from rareearth.chain import default_chain_config, simulate_chain, compare_chain
from pathlib import Path
def _website_request(request_json):
    request = json.loads(request_json)
    action = request['action']
    if action == 'defaults':
        result = default_config()
    elif action == 'sources':
        result = json.loads(Path('/study/data/sources.json').read_text())
    elif action == 'run':
        config = request.get('config')
        result = {'simulation': simulate(config), 'comparison': compare(config)}
    elif action == 'trade-risk':
        result = trade_risk(**request.get('config', {}))
    elif action == 'chain-defaults':
        result = default_chain_config()
    elif action == 'chain-simulate':
        result = simulate_chain(request.get('config'))
    elif action == 'chain-compare':
        result = compare_chain(request.get('config'))
    else:
        raise ValueError('Unknown research action')
    return json.dumps(result, allow_nan=False)
`);
  return py;
}
// Serialize messages so input state cannot change during another Python call.
let queue = Promise.resolve();
self.onmessage = ({data}) => {
  queue = queue.then(async () => {
    try {
      runtimePromise ||= initialize();
      const py = await runtimePromise;
      py.globals.set('_request_json', JSON.stringify(data));
      const result = JSON.parse(await py.runPythonAsync('_website_request(_request_json)'));
      self.postMessage({id:data.id, result});
    } catch (error) {
      const message = String(error.message || error).split('\n').filter(Boolean).pop();
      self.postMessage({id:data.id, error:message || 'The simulation could not complete.'});
    }
  });
};
