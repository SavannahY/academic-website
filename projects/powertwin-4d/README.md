# PowerTwin 4D — personal exploratory project

A static, browser-based exploratory model by Jane Yang, connecting modular data center design, electricity supply, and 4D construction planning.

Published at https://janeyang.me/projects/powertwin-4d/ as part of Jane’s academic website. This copy contains only the previously public static runtime, with personal-site branding. It is an illustrative research prototype, not validated engineering or a deployed project.

## Hosting and behavior

- GitHub Pages serves this directory directly; no build, API server, paid storage, or external JavaScript CDN is required.
- The model, scenario controls, timeline, and planning calculations run in the browser. The knowledge layer loads from `knowledge/knowledge_base.json`.
- View settings are reflected in the URL. Copy snapshot and Export pilot brief produce browser-local outputs.
- Backend simulation, cloud persistence, and multi-user collaboration are unavailable in this static version. The original cloud-save control is omitted.
- A preview image is displayed if WebGL initialization fails; a static preview is also provided when JavaScript is disabled.
- Only the required Three.js global build is bundled; unused modules and private backend/project data are excluded.

Serve the repository root over HTTP for local review, then visit `/projects/powertwin-4d/`. The knowledge JSON requires HTTP hosting rather than opening the HTML as a `file://` URL.

## Third-party code

Three.js r165 is distributed under the MIT license; see `vendor/three/LICENSE`. The bundled global wrapper retains the upstream copyright header.
