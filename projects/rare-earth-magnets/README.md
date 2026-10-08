# Rare Earth — a material observatory

A complete static interactive website connecting magnet materials, sourced supply and application evidence, flows, investment and security, manufacturing processes, scenario laboratories and a public-source research knowledge map.

Start with `index.html`. Serve this directory using a static HTTP server, for example `python3 -m http.server 8000`, and open its URL. Relative links support hosting at `/projects/rare-earth-magnets/` or another subpath.

## Evidence and assumptions

Public-source records retain citations, dates, units, product forms, status and uncertainty. Historical demand estimates are distinct from observed production and trade. Missing assays, shipments, qualifying demand and plant-level volumes remain unknown. Scholarly biographies and research summaries are based on cited public records, with editorial interpretations labeled.

The original 100-unit prototype is an illustrative allocation: stage margins and hypothetical end-use weights do not establish actual trade routes or an absolute-tonne conversion. Purchased-material examples and the supply laboratory use explicit scenario assumptions. Budget credits are not dollars, and map pins do not calibrate capacities, inventories, yields or customer allocation.

The practitioner section presents anonymous observations and exploratory questions; public evidence is cited separately. These observations do not establish named customer access, actual shipments, pricing or calibrated model inputs.

The original Python model runs inside a browser worker through Pyodide 0.29.4. First load requires the Pyodide CDN. The public asset `engine/rareearth/package-init.py` is written to the normal `rareearth/__init__.py` path inside the worker's virtual filesystem.

## Artwork and credits

The generic machine and narrative illustrations are author-created AI-generated educational artwork. They depict conceptual machinery and imagined scenes, not verified photographs of named operators, people, products, facilities, actual research activities or engineering drawings.

Public source links appear alongside relevant evidence. Supplier product references retain publisher attribution; supplier photos are omitted. See `THIRD-PARTY-NOTICES.md` for library, dataset and runtime credits. This export grants no new open-source license for original project code.
