const modules = [
  { id: "A-01", row: 1, feeder: "800V DC Bus A", mw: 3.2, racks: 8, rectifier: "R-1A", steelBay: "A1", design: 0, procure: 4, build: 9, basePower: 16, offset: 0, scan: "clear" },
  { id: "A-02", row: 1, feeder: "800V DC Bus A", mw: 3.2, racks: 8, rectifier: "R-1A", steelBay: "A2", design: 1, procure: 5, build: 10, basePower: 17, offset: 1, scan: "clear" },
  { id: "A-03", row: 1, feeder: "800V DC Bus A", mw: 3.2, racks: 8, rectifier: "R-1B", steelBay: "A3", design: 2, procure: 6, build: 11, basePower: 18, offset: 1, scan: "delta" },
  { id: "A-04", row: 1, feeder: "800V DC Bus A", mw: 3.2, racks: 8, rectifier: "R-1B", steelBay: "A4", design: 3, procure: 7, build: 12, basePower: 19, offset: 2, scan: "hold" },
  { id: "B-01", row: 2, feeder: "800V DC Bus B", mw: 2.8, racks: 7, rectifier: "R-2A", steelBay: "B1", design: 2, procure: 7, build: 12, basePower: 20, offset: 0, scan: "clear" },
  { id: "B-02", row: 2, feeder: "800V DC Bus B", mw: 2.8, racks: 7, rectifier: "R-2A", steelBay: "B2", design: 3, procure: 8, build: 13, basePower: 21, offset: 1, scan: "delta" },
  { id: "B-03", row: 2, feeder: "800V DC Bus B", mw: 2.8, racks: 7, rectifier: "R-2B", steelBay: "B3", design: 4, procure: 9, build: 14, basePower: 22, offset: 2, scan: "clear" },
  { id: "B-04", row: 2, feeder: "800V DC Bus B", mw: 2.8, racks: 7, rectifier: "R-2B", steelBay: "B4", design: 5, procure: 10, build: 15, basePower: 23, offset: 3, scan: "clear" },
  { id: "C-01", row: 3, feeder: "800V DC Bus C", mw: 2.4, racks: 6, rectifier: "R-3A", steelBay: "C1", design: 5, procure: 11, build: 16, basePower: 24, offset: 0, scan: "clear" },
  { id: "C-02", row: 3, feeder: "800V DC Bus C", mw: 2.4, racks: 6, rectifier: "R-3A", steelBay: "C2", design: 6, procure: 12, build: 17, basePower: 25, offset: 1, scan: "delta" },
  { id: "C-03", row: 3, feeder: "800V DC Bus C", mw: 2.4, racks: 6, rectifier: "R-3B", steelBay: "C3", design: 7, procure: 13, build: 18, basePower: 26, offset: 2, scan: "clear" },
  { id: "C-04", row: 3, feeder: "800V DC Bus C", mw: 2.4, racks: 6, rectifier: "R-3B", steelBay: "C4", design: 8, procure: 14, build: 19, basePower: 27, offset: 3, scan: "hold" }
];

const feeders = {
  "800V DC Bus A": { base: 15, capacity: 14.4, color: "#ff8a3d", rectifier: "SST-1 / R-1" },
  "800V DC Bus B": { base: 19, capacity: 13.2, color: "#2aa876", rectifier: "SST-2 / R-2" },
  "800V DC Bus C": { base: 23, capacity: 12.0, color: "#2d6bff", rectifier: "SST-3 / R-3" }
};

const dataCenterPresets = {
  aiPod: {
    label: "AI training pod",
    rackKw: 420,
    loadMultiplier: 1.12,
    footprintM2: 46,
    electricalTonPerMw: 3.8,
    coolingTonPerMw: 3.2,
    batteryTon: 4,
    structuralTonAdd: 5,
    settlementLimitMm: 8,
    anchorCount: 18
  },
  inference: {
    label: "Inference edge",
    rackKw: 180,
    loadMultiplier: 0.82,
    footprintM2: 40,
    electricalTonPerMw: 2.6,
    coolingTonPerMw: 1.8,
    batteryTon: 2,
    structuralTonAdd: 1,
    settlementLimitMm: 12,
    anchorCount: 14
  },
  hyperscale: {
    label: "Hyperscale hall",
    rackKw: 620,
    loadMultiplier: 1.28,
    footprintM2: 54,
    electricalTonPerMw: 4.4,
    coolingTonPerMw: 4,
    batteryTon: 7,
    structuralTonAdd: 8,
    settlementLimitMm: 7,
    anchorCount: 22
  }
};

const californiaSitePresets = {
  bayMud: {
    label: "Silicon Valley bay mud",
    siteClass: "D/E",
    allowableBearingKpa: 95,
    settlementLimitMm: 8,
    seismicG: 0.48,
    liquefaction: "High",
    groundwater: "Shallow",
    pileDepthM: 24,
    foundationHint: "Pile-supported mat"
  },
  alluvial: {
    label: "Central Valley alluvial",
    siteClass: "D",
    allowableBearingKpa: 145,
    settlementLimitMm: 12,
    seismicG: 0.36,
    liquefaction: "Med",
    groundwater: "Variable",
    pileDepthM: 14,
    foundationHint: "Mat + grade beams"
  },
  bedrock: {
    label: "Inland bedrock",
    siteClass: "B/C",
    allowableBearingKpa: 320,
    settlementLimitMm: 16,
    seismicG: 0.32,
    liquefaction: "Low",
    groundwater: "Deep",
    pileDepthM: 0,
    foundationHint: "Spread footings + mat"
  },
  coastalFill: {
    label: "Coastal fill / liquefaction",
    siteClass: "E",
    allowableBearingKpa: 80,
    settlementLimitMm: 7,
    seismicG: 0.46,
    liquefaction: "High",
    groundwater: "Shallow",
    pileDepthM: 28,
    foundationHint: "Deep piles + grade beams"
  }
};

const seismicTierPresets = {
  standard: { label: "Standard", gMultiplier: 1, anchorBonus: 0, matBonusM: 0 },
  enhanced: { label: "Enhanced", gMultiplier: 1.16, anchorBonus: 2, matBonusM: 0.08 },
  mission: { label: "Mission critical", gMultiplier: 1.32, anchorBonus: 4, matBonusM: 0.14 }
};

const marketSignals = [
  {
    source: "NVIDIA OCP",
    type: "800V DC",
    signal: "20+ partners backing 800V DC data centers.",
    implication: "Score DC busway, rectifier and rack-side conversion as core design gates.",
    pressure: 95,
    sourceUrl: "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin/"
  },
  {
    source: "Cooling profile B x NVIDIA",
    type: "Platform",
    signal: "Central rectifiers, DC busways, rack DC-DC and storage moving to engineering readiness.",
    implication: "Treat 800V DC as a serviceable platform, not a single-line diagram.",
    pressure: 88,
    sourceUrl: "https://www.vertiv.com/en-us/about/news-and-events/corporate-news/from-vision-to-readiness-vertiv-collaborates-with-nvidia-to-advance-800-vdc-platform-designs-to-power-the-next-generation-of-ai-factories/"
  },
  {
    source: "Electrical integration reference",
    type: "Sidecar",
    signal: "800V DC sidecar targets up to 1.2MW racks with modular storage and Live Swap.",
    implication: "Add sidecar, protection, metering and safety checks to each module.",
    pressure: 86,
    sourceUrl: "https://www.se.com/ww/en/about-us/newsroom/news/press-releases/schneider-electric-highlights-innovation-in-800-vdc-power-systems-in-support-of-nvidia%E2%80%99s-next-generation-gpus-68ecb631098fd4ea49024353/"
  },
  {
    source: "Electrical profile C",
    type: "Grid-to-chip",
    signal: "Reference design pairs busbar, storage, DC connectors and hot aisle containment.",
    implication: "Model power bursting, busbar routing and backup response from site to rack.",
    pressure: 82,
    sourceUrl: "https://www.eaton.com/us/en-us/company/news-insights/news-releases/2025/eaton-unveils-next-generation-architecture.html"
  },
  {
    source: "Cooling profile B Modular",
    type: "Prefab",
    signal: "Factory integration and parallel site prep can compress modular deployment.",
    implication: "Optimize steel, power skid and civil work as overlapping factory/site tracks.",
    pressure: 78,
    sourceUrl: "https://www.vertiv.com/en-us/solutions/vertiv-modular-solutions/"
  },
  {
    source: "Aeroderivative turbine reference",
    type: "Onsite aero",
    signal: "29 factory-packaged aeroderivative turbines are planned for an approximately 1 GW AI data center deployment.",
    implication: "Model firm gas, air permit, SCR, MV generation and the turbine seismic mat as one plant package.",
    pressure: 89,
    sourceUrl: "https://www.gevernova.com/news/press-releases/ge-vernova-crusoe-announce-major-29-unit-aeroderivative-gas-turbine-deliver-ai-data-centers"
  },
  {
    source: "California CGS",
    type: "Site risk",
    signal: "Fault zones, liquefaction and seismic hazards require parcel-level investigation.",
    implication: "California geotech must be a first-class input before modular release.",
    pressure: 90,
    sourceUrl: "https://www.conservation.ca.gov/cgs/alquist-priolo"
  },
  {
    source: "Power-flex research",
    type: "Grid ops",
    signal: "AI clusters can reduce demand during peaks through workload orchestration.",
    implication: "Optimizer should score grid-flex mode, telemetry and 800V bridge storage.",
    pressure: 84,
    sourceUrl: "https://arxiv.org/abs/2606.25098"
  },
  {
    source: "Power delivery research",
    type: "SST / DC-DC",
    signal: "Next-gen AI data centers need facility LVDC, high-ratio DC-DC and MV SST paths.",
    implication: "Track SST, DC-DC sidecar and busway maturity before scale-out.",
    pressure: 83,
    sourceUrl: "https://arxiv.org/abs/2606.25095"
  },
  {
    source: "NVIDIA GB200 NVL72",
    type: "Rack compute",
    signal: "Rack-scale liquid-cooled 72-GPU NVLink domain changes the unit of design from server to rack.",
    implication: "Model chips, rack fabric, liquid loops and software scheduling as one release unit.",
    pressure: 92,
    sourceUrl: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/"
  },
  {
    source: "AMD MI350 Series",
    type: "Open accelerator",
    signal: "MI355X planning basis includes 288GB HBM3E and ROCm software for AI/HPC workloads.",
    implication: "Keep AMD rack and ROCm stack as a first-class design path, not a footnote.",
    pressure: 80,
    sourceUrl: "https://www.amd.com/en/products/accelerators/instinct/mi350.html"
  },
  {
    source: "Google TPU v6e",
    type: "ASIC pod",
    signal: "Trillium exposes 256-chip pod topology, ICI bandwidth, HBM and JAX/XLA operating assumptions.",
    implication: "Add ASIC topology and software placement constraints beside GPU rack design.",
    pressure: 76,
    sourceUrl: "https://docs.cloud.google.com/tpu/docs/v6e"
  },
  {
    source: "Intel Gaudi 3",
    type: "Open Ethernet",
    signal: "Gaudi 3 emphasizes standard Ethernet scale-out and PyTorch-oriented software migration.",
    implication: "Keep Ethernet-first accelerator racks viable for cost-sensitive modular sites.",
    pressure: 72,
    sourceUrl: "https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi.html"
  },
  {
    source: "AWS Trainium",
    type: "Cloud ASIC",
    signal: "Trainium UltraServers pair Neuron software with Ray, Slurm, EKS and SageMaker HyperPod operations.",
    implication: "Software control plane and cloud-adjacent ASIC topology must be selectable in the design engine.",
    pressure: 78,
    sourceUrl: "https://aws.amazon.com/ai/machine-learning/trainium/"
  }
];

const constraintSources = {
  grid: {
    source: "DOE data center energy report",
    sourceUrl: "https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers"
  },
  geotech: {
    source: "California CGS / EQ Zapp",
    sourceUrl: "https://www.conservation.ca.gov/cgs/alquist-priolo"
  },
  water: {
    source: "CA Water Boards stormwater",
    sourceUrl: "https://www.waterboards.ca.gov/water_issues/programs/stormwater/construction.html"
  },
  air: {
    source: "Bay Area Air District permits",
    sourceUrl: "https://www.baaqmd.gov/permits/apply-for-a-permit"
  },
  supply: {
    source: "800V DC supplier ecosystem",
    sourceUrl: "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin/"
  },
  field: {
    source: "4D scan / commissioning data",
    sourceUrl: "https://arxiv.org/abs/2606.25098"
  },
  compute: {
    source: "Rack-scale AI hardware",
    sourceUrl: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/"
  },
  software: {
    source: "AI orchestration stack",
    sourceUrl: "https://www.amd.com/en/products/accelerators/instinct/mi350.html"
  }
};

const peerBenchmarks = [
  {
    name: "Cooling profile B Modular Designer",
    lane: "Configurator",
    signal: "Web-based 2D/3D modular configuration up to 200kW.",
    gap: "Stops before CA site gates, 800V optimization and capital case.",
    score: 44,
    sourceUrl: "https://www.vertiv.com/en-us/solutions/vertiv-modular-designer/"
  },
  {
    name: "Cooling profile B Modular Solutions",
    lane: "Prefab delivery",
    signal: "Factory integration and parallel site prep for modular delivery.",
    gap: "Strong prefab execution; not a site-to-finance optimization engine.",
    score: 58,
    sourceUrl: "https://www.vertiv.com/en-us/solutions/vertiv-modular-solutions/"
  },
  {
    name: "Electrical profile A 800V sidecar",
    lane: "Power system",
    signal: "800V DC sidecar, protection, metering and modular storage.",
    gap: "Power architecture without structural/geotech/schedule underwriting.",
    score: 52,
    sourceUrl: "https://www.se.com/ww/en/about-us/newsroom/news/press-releases/schneider-electric-highlights-innovation-in-800-vdc-power-systems-in-support-of-nvidia%E2%80%99s-next-generation-gpus-68ecb631098fd4ea49024353/"
  },
  {
    name: "NVIDIA 800V ecosystem",
    lane: "Market pull",
    signal: "20+ companies backing 800V DC AI factory infrastructure.",
    gap: "Sets direction; does not choose parcel, foundation, permit path or finance.",
    score: 68,
    sourceUrl: "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin/"
  }
];

const physicsSources = {
  energy: {
    source: "Feynman Lectures I.4",
    signal: "Energy is conserved across compute, cooling, conversion loss and storage.",
    sourceUrl: "https://www.feynmanlectures.caltech.edu/I_04.html"
  },
  circuits: {
    source: "Feynman Lectures I.25 / II.22",
    signal: "P = VI, conductor heating follows I2R, and current closes by Kirchhoff's law.",
    sourceUrl: "https://www.feynmanlectures.caltech.edu/II_22.html"
  },
  thermal: {
    source: "Feynman Lectures I.44",
    signal: "The first law closes rack heat, coolant enthalpy rise and rejected heat.",
    sourceUrl: "https://www.feynmanlectures.caltech.edu/I_44.html"
  },
  mechanics: {
    source: "Feynman Lectures I.9",
    signal: "Newton's laws connect mass, acceleration, force and structural reactions.",
    sourceUrl: "https://www.feynmanlectures.caltech.edu/I_09.html"
  },
  nvidia: {
    source: "NVIDIA PhysicsNeMo",
    signal: "Physics-ML modules, CFD packages, symbolic PDE residuals and Navier-Stokes examples.",
    sourceUrl: "https://github.com/NVIDIA/physicsnemo"
  },
  ocp: {
    source: "OCP ORv3 / ACS",
    signal: "Open 48V rack power, blind-mate liquid manifolds, cold plates, QDs and CDU interfaces.",
    sourceUrl: "https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns"
  }
};

const omniverseBlueprint = {
  source: "NVIDIA Omniverse Libraries",
  sourceUrl: "https://developer.nvidia.com/omniverse",
  docsUrl: "https://docs.nvidia.com/omniverse/index.html",
  dsxSignal: "DSX-style AI factory twin: OpenUSD scene graph, SimReady assets, telemetry streams and physics bindings.",
  layers: ["site", "civil", "structure", "construction", "power", "liquid", "compute", "software", "telemetry"]
};

const computePlatforms = {
  gb300: {
    label: "NVIDIA GB300 NVL72",
    vendor: "NVIDIA",
    silicon: "Grace Blackwell Ultra",
    softwareFamily: "cuda",
    acceleratorsPerRack: 72,
    cpuPerRack: 36,
    memoryGb: 288,
    fabricTbps: 130,
    ratedRackKw: 142,
    powerFactor: 0.34,
    cooling: "Full-rack liquid",
    source: "NVIDIA GB300 NVL72",
    sourceUrl: "https://www.nvidia.com/en-gb/data-center/gb300-nvl72/",
    signal: "72 Blackwell Ultra GPUs, 36 Grace CPUs and 130 TB/s NVLink in a fully liquid-cooled rack."
  },
  gb200: {
    label: "NVIDIA GB200 NVL72",
    vendor: "NVIDIA",
    silicon: "Grace Blackwell",
    softwareFamily: "cuda",
    acceleratorsPerRack: 72,
    cpuPerRack: 36,
    memoryGb: 186,
    fabricTbps: 130,
    powerFactor: 0.94,
    cooling: "Direct liquid",
    source: "NVIDIA GB200 NVL72",
    sourceUrl: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    signal: "36 Grace CPUs and 72 Blackwell GPUs in a rack-scale liquid-cooled NVLink domain."
  },
  rubin: {
    label: "Vera Rubin NVL72",
    vendor: "NVIDIA",
    silicon: "Rubin GPU + Vera CPU",
    softwareFamily: "cuda",
    acceleratorsPerRack: 72,
    cpuPerRack: 36,
    memoryGb: 288,
    fabricTbps: 260,
    powerFactor: 1.22,
    cooling: "45C liquid",
    source: "NVIDIA MGX / OCP",
    sourceUrl: "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin/",
    signal: "100% liquid-cooled modular MGX rack design with 800V DC support."
  },
  mi355: {
    label: "AMD MI355X OAM",
    vendor: "AMD",
    silicon: "CDNA 4",
    softwareFamily: "rocm",
    acceleratorsPerRack: 64,
    memoryGb: 288,
    fabricTbps: 72,
    powerFactor: 0.9,
    cooling: "DLC OAM",
    source: "AMD MI350 Series",
    sourceUrl: "https://www.amd.com/en/products/accelerators/instinct/mi350.html",
    signal: "MI355X OAM planning basis: 288GB HBM3E and 8TB/s memory bandwidth."
  },
  tpu6e: {
    label: "Google TPU v6e",
    vendor: "Google",
    silicon: "Trillium ASIC",
    softwareFamily: "jax",
    acceleratorsPerRack: 64,
    memoryGb: 32,
    fabricTbps: 102.4,
    powerFactor: 0.72,
    cooling: "Cloud TPU loop",
    source: "Google Cloud TPU v6e",
    sourceUrl: "https://docs.cloud.google.com/tpu/docs/v6e",
    signal: "256-chip Pod, 918 TFLOPs bf16 per chip, 800GB/s ICI per chip."
  },
  gaudi3: {
    label: "Intel Gaudi 3",
    vendor: "Intel",
    silicon: "Gaudi 3 AI accelerator",
    softwareFamily: "gaudi",
    acceleratorsPerRack: 64,
    memoryGb: 128,
    fabricTbps: 76.8,
    powerFactor: 0.78,
    cooling: "Ethernet OAM / PCIe",
    source: "Intel Gaudi 3",
    sourceUrl: "https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi.html",
    signal: "Open Ethernet scale-out and PyTorch-oriented Gaudi software path."
  },
  trainium3: {
    label: "AWS Trainium3",
    vendor: "AWS",
    silicon: "Trainium ASIC",
    softwareFamily: "neuron",
    acceleratorsPerRack: 144,
    memoryGb: 144,
    fabricTbps: 706,
    powerFactor: 0.68,
    cooling: "UltraServer liquid",
    source: "AWS Trainium",
    sourceUrl: "https://aws.amazon.com/ai/machine-learning/trainium/",
    signal: "Trainium3 UltraServers scale to 144 chips with NeuronSwitch and Neuron SDK."
  },
  custom: {
    label: "Custom XPU / ASIC",
    vendor: "Semi-custom",
    silicon: "XPU + DPU",
    softwareFamily: "mixed",
    acceleratorsPerRack: 96,
    memoryGb: 128,
    fabricTbps: 84,
    powerFactor: 0.82,
    cooling: "Vendor cold plate",
    source: "NVLink Fusion ecosystem",
    sourceUrl: "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin/",
    signal: "Semi-custom silicon can integrate into proven scale-up infrastructure."
  }
};

const rackProfiles = {
  nvl72: {
    label: "NVL72 rack",
    densityFactor: 1,
    rackMassTon: 4.8,
    coolingFactor: 1,
    fabricFactor: 1.05,
    serviceability: 86,
    pitch: "Rack-scale NVLink domain"
  },
  mgx800: {
    label: "MGX 800V rack",
    densityFactor: 1.18,
    rackMassTon: 5.6,
    coolingFactor: 1.08,
    fabricFactor: 1.16,
    serviceability: 82,
    pitch: "Modular tray + 800V busbar"
  },
  orv3: {
    label: "OCP ORv3 rack",
    densityFactor: 0.82,
    rackMassTon: 3.7,
    coolingFactor: 0.9,
    fabricFactor: 0.78,
    serviceability: 90,
    pitch: "Open rack service model"
  },
  podSlice: {
    label: "ASIC pod slice",
    densityFactor: 0.72,
    rackMassTon: 3.2,
    coolingFactor: 0.78,
    fabricFactor: 0.68,
    serviceability: 74,
    pitch: "Cloud ASIC topology"
  }
};

const powerSourceProfiles = {
  grid: {
    label: "Grid",
    shortLabel: "Utility grid",
    path: "Utility MVAC > switchgear > SST / rectifier > 800V DC",
    moduleLabel: "20 MW transformer line",
    unitMw: 20,
    moduleAvailability: 0.9985,
    conversionEfficiency: 0.985,
    capacityFactor: 1,
    color: "#f7f3ea",
    source: "DOE data center electricity demand",
    sourceUrl: "https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers"
  },
  btmGas: {
    label: "BTM gas",
    shortLabel: "Onsite gas",
    path: "Gas train > modular gensets > MV switchgear > SST / rectifier > 800V DC",
    moduleLabel: "2.5 MW gas generator",
    unitMw: 2.5,
    moduleAvailability: 0.985,
    conversionEfficiency: 0.44,
    capacityFactor: 0.92,
    fuelType: "Pipeline natural gas",
    technology: "Reciprocating gas engine",
    color: "#f5c766",
    source: "Caterpillar G3520H planning class",
    sourceUrl: "https://www.cat.com/en_US/products/new/power-systems/electric-power/gas-generator-sets/1000003143.html"
  },
  gasTurbine: {
    label: "Gas turbine",
    shortLabel: "Aero turbine",
    path: "Firm gas > DLE aeroderivative turbine > MV generator > switchgear > SST / rectifier > 800V DC",
    moduleLabel: "34.5 MW aero turbine",
    unitMw: 34.5,
    moduleAvailability: 0.998,
    conversionEfficiency: 0.394,
    capacityFactor: 0.9,
    fuelType: "Pipeline natural gas",
    technology: "LM2500XPRESS-class DLE aeroderivative",
    startupMinutes: 5,
    noxPpm: 15,
    packageLengthM: 28.5,
    packageWidthM: 3.04,
    packageHeightM: 8.2,
    largestLiftTon: 72,
    color: "#ff9b5a",
    source: "Aeroderivative turbine reference LM2500XPRESS",
    sourceUrl: "https://www.gevernova.com/power/en/lm2500xpress"
  },
  btmSolar: {
    label: "BTM solar",
    shortLabel: "Solar + storage",
    path: "PV field > DC combiner > grid-forming inverter > storage > 800V DC",
    moduleLabel: "5 MWac inverter block",
    unitMw: 5,
    moduleAvailability: 0.992,
    conversionEfficiency: 0.97,
    capacityFactor: 0.24,
    requiresFirming: true,
    color: "#36d7c8",
    source: "DOE solar + storage resilience",
    sourceUrl: "https://www.energy.gov/cmei/systems/solar-and-resilience-basics"
  }
};

const gasTurbineModels = {
  lm2500Xpress: {
    label: "GE LM2500XPRESS",
    shortLabel: "LM2500XPRESS",
    technology: "DLE aeroderivative turbine package",
    unitMw: 34.5,
    efficiencyPct: 39.4,
    startupMinutes: 5,
    startupLabel: "5 min",
    noxPpm: 15,
    packageLengthM: 28.5,
    packageWidthM: 3.04,
    packageHeightM: 8.2,
    largestLiftTon: 72,
    source: "Aeroderivative turbine reference LM2500XPRESS",
    sourceUrl: "https://www.gevernova.com/power/en/lm2500xpress"
  },
  lm6000Pc: {
    label: "GE LM6000VELOX PC",
    shortLabel: "LM6000 PC",
    technology: "PC Sprint aeroderivative turbine package",
    unitMw: 51.1,
    efficiencyPct: 39.7,
    startupMinutes: 5,
    startupLabel: "5 min",
    noxPpm: 15,
    packageLengthM: 20.43,
    packageWidthM: 4.1,
    packageHeightM: 14.38,
    largestLiftTon: 71,
    source: "Aeroderivative turbine reference LM6000VELOX PC Sprint",
    sourceUrl: "https://www.gevernova.com/gas-power/products/gas-turbines/lm6000"
  },
  lm6000Pf: {
    label: "GE LM6000VELOX PF+",
    shortLabel: "LM6000 PF+",
    technology: "PF+ Sprint aeroderivative turbine package",
    unitMw: 56.9,
    efficiencyPct: 41,
    startupMinutes: 5,
    startupLabel: "5 min",
    noxPpm: 15,
    packageLengthM: 20.43,
    packageWidthM: 4.1,
    packageHeightM: 14.38,
    largestLiftTon: 71,
    source: "Aeroderivative turbine reference LM6000VELOX PF+ Sprint",
    sourceUrl: "https://www.gevernova.com/gas-power/products/gas-turbines/lm6000"
  },
  sgt800: {
    label: "Siemens SGT-800",
    shortLabel: "SGT-800",
    technology: "Industrial single-shaft turbine package",
    unitMw: 62.5,
    efficiencyPct: 41.1,
    startupMinutes: null,
    startupLabel: "Vendor study",
    noxPpm: 15,
    packageLengthM: 22,
    packageWidthM: 5.5,
    packageHeightM: 8.5,
    largestLiftTon: 95,
    source: "Generation profile D SGT-800",
    sourceUrl: "https://www.siemens-energy.com/global/en/home/products-services/product/sgt-800.html"
  }
};

const reliabilityProfiles = {
  n: {
    label: "N",
    topology: "One capacity path",
    spareUnits: 0,
    pathCount: 1,
    commonModeFactor: 1
  },
  nPlus1: {
    label: "N+1",
    topology: "One modular spare",
    spareUnits: 1,
    pathCount: 1,
    commonModeFactor: 0.9998
  },
  twoN: {
    label: "2N",
    topology: "Two independent capacity paths",
    spareUnits: 0,
    pathCount: 2,
    commonModeFactor: 0.9997
  }
};

const backupProfiles = {
  none: {
    planCode: "P0",
    label: "No backup",
    shortLabel: "None",
    strategy: "Grid only",
    intent: "Development baseline",
    siteImpact: "Minimal",
    permitClass: "Utility only",
    costBand: "Low",
    accent: "#8b939d",
    storageLabel: "No storage",
    visualMode: "none",
    batteryHours: 0,
    autonomyHours: 0,
    transferSuccess: 0,
    topology: "No ride-through source",
    usableSoc: 0,
    dischargeEfficiency: 1,
    degradationReservePct: 0,
    generatorUnitMw: 0,
    generatorFuel: "None",
    generatorStartSeconds: 0,
    fuelLitersPerKwh: 0,
    blackStart: false,
    sourceUrl: "https://www.nvidia.com/en-eu/data-center/technologies/800-vdc-architecture/"
  },
  ups10: {
    planCode: "P1",
    label: "UPS 10 min",
    shortLabel: "10 min UPS",
    strategy: "Ride-through",
    intent: "Short event bridge",
    siteImpact: "Low",
    permitClass: "Battery review",
    costBand: "Medium",
    accent: "#2d6bff",
    storageLabel: "UPS / supercap",
    visualMode: "ups",
    batteryHours: 1 / 6,
    autonomyHours: 1 / 6,
    transferSuccess: 0.98,
    topology: "UPS / supercapacitor bridge",
    usableSoc: 0.8,
    dischargeEfficiency: 0.95,
    degradationReservePct: 0.15,
    generatorUnitMw: 0,
    generatorFuel: "None",
    generatorStartSeconds: 0,
    fuelLitersPerKwh: 0,
    blackStart: true,
    sourceUrl: "https://www.eaton.com/my/en-us/company/news-insights/news-releases/2025/eaton-next-generation-ai-factories.html"
  },
  bess2h: {
    planCode: "P2",
    label: "BESS 2 h",
    shortLabel: "2 h BESS",
    strategy: "Storage reserve",
    intent: "Grid support + black-start",
    siteImpact: "Medium",
    permitClass: "Battery + fire",
    costBand: "High",
    accent: "#2aa876",
    storageLabel: "LFP BESS",
    visualMode: "bess",
    batteryHours: 2,
    autonomyHours: 2,
    transferSuccess: 0.995,
    topology: "Modular LFP BESS with black-start controls",
    usableSoc: 0.8,
    dischargeEfficiency: 0.95,
    degradationReservePct: 0.15,
    generatorUnitMw: 0,
    generatorFuel: "None",
    generatorStartSeconds: 0,
    fuelLitersPerKwh: 0,
    blackStart: true,
    sourceUrl: "https://www.cummins.com/en-eu/generators/microgrids"
  },
  hybrid12: {
    planCode: "P3",
    label: "BESS + gas",
    shortLabel: "15 min + 12 h",
    strategy: "Gas hybrid",
    intent: "Long-duration continuity",
    siteImpact: "High",
    permitClass: "Air + gas",
    costBand: "Medium",
    accent: "#f5c766",
    storageLabel: "LFP BESS",
    visualMode: "gas",
    batteryHours: 0.25,
    autonomyHours: 12,
    transferSuccess: 0.997,
    topology: "BESS bridge plus N+1 standby gas generation",
    usableSoc: 0.8,
    dischargeEfficiency: 0.95,
    degradationReservePct: 0.15,
    generatorUnitMw: 2.5,
    generatorFuel: "Pipeline gas",
    generatorStartSeconds: 45,
    fuelLitersPerKwh: 0,
    blackStart: true,
    sourceUrl: "https://www.rolls-royce.com/media/our-stories/discover/2025/powering-data-centres-through-the-energy-transition.aspx"
  },
  hvo48: {
    planCode: "P4",
    label: "BESS + HVO 48 h",
    shortLabel: "15 min + 48 h",
    strategy: "Fuel-diverse",
    intent: "Extended utility outage",
    siteImpact: "High",
    permitClass: "Air + tank + fire",
    costBand: "High",
    accent: "#36d7c8",
    storageLabel: "LFP BESS",
    visualMode: "hvo",
    batteryHours: 0.25,
    autonomyHours: 48,
    transferSuccess: 0.999,
    topology: "Fast-cycle storage plus N+1 HVO standby generation",
    usableSoc: 0.8,
    dischargeEfficiency: 0.95,
    degradationReservePct: 0.15,
    generatorUnitMw: 3,
    generatorFuel: "HVO",
    generatorStartSeconds: 15,
    fuelLitersPerKwh: 0.245,
    blackStart: true,
    sourceUrl: "https://www.rolls-royce.com/media/our-stories/discover/2025/powering-data-centres-through-the-energy-transition.aspx"
  },
  fuelCell: {
    planCode: "P5",
    label: "Fuel cell + BESS",
    shortLabel: "FC + 4 h",
    strategy: "Fuel cell reserve",
    intent: "Low-emission bridge + FC stack",
    siteImpact: "Medium",
    permitClass: "Hydrogen / air review",
    costBand: "High",
    accent: "#7c6dff",
    storageLabel: "LFP BESS",
    visualMode: "fuelcell",
    batteryHours: 0.25,
    autonomyHours: 4,
    transferSuccess: 0.996,
    topology: "BESS bridge plus modular solid-oxide / PEM fuel cell blocks",
    usableSoc: 0.8,
    dischargeEfficiency: 0.95,
    degradationReservePct: 0.15,
    generatorUnitMw: 1.2,
    generatorFuel: "Hydrogen FC",
    generatorStartSeconds: 30,
    fuelLitersPerKwh: 0,
    blackStart: true,
    sourceUrl: "https://www.energy.gov/eere/fuelcells/fuel-cell-technologies-office"
  },
  microgrid72: {
    planCode: "P6",
    label: "Hybrid microgrid 72 h",
    shortLabel: "72 h microgrid",
    strategy: "Long-duration hybrid",
    intent: "Islanded campus continuity",
    siteImpact: "High",
    permitClass: "Air + gas + storage",
    costBand: "High",
    accent: "#2d6bff",
    storageLabel: "LFP BESS",
    visualMode: "microgrid",
    batteryHours: 2,
    autonomyHours: 72,
    transferSuccess: 0.999,
    topology: "2 h BESS plus N+1 gas gensets, solar firming boundary and microgrid controls",
    usableSoc: 0.8,
    dischargeEfficiency: 0.95,
    degradationReservePct: 0.15,
    generatorUnitMw: 2.5,
    generatorFuel: "Pipeline gas",
    generatorStartSeconds: 45,
    fuelLitersPerKwh: 0,
    blackStart: true,
    sourceUrl: "https://www.cummins.com/en-eu/generators/microgrids"
  }
};

const supplyStrategies = {
  balanced: {
    label: "Balanced",
    shortLabel: "Cost / schedule",
    leadFactor: 1,
    riskRelief: 2,
    localShare: 46,
    costIndex: 100,
    qualificationWeeks: 0,
    description: "Global best-source procurement with standard schedule buffers."
  },
  resilient: {
    label: "Dual source",
    shortLabel: "Resilience",
    leadFactor: 0.94,
    riskRelief: 14,
    localShare: 58,
    costIndex: 107,
    qualificationWeeks: 4,
    description: "Parallel qualification, reserved factory slots and regional alternates."
  },
  localized: {
    label: "US localized",
    shortLabel: "Domestic path",
    leadFactor: 1.04,
    riskRelief: 8,
    localShare: 76,
    costIndex: 113,
    qualificationWeeks: 6,
    description: "Localize power, steel, integration and service while retaining global silicon."
  }
};

const supplyShockProfiles = {
  base: { label: "Base", shortLabel: "No shock", affected: [], leadWeeks: 0, riskAdd: 0, costAddPct: 0 },
  taiwan: { label: "Taiwan delay", shortLabel: "Silicon / ODM", affected: ["silicon", "hbm", "rack", "network"], leadWeeks: 14, riskAdd: 24, costAddPct: 12 },
  transformer: { label: "Transformer queue", shortLabel: "Grid equipment", affected: ["transformer", "power800"], leadWeeks: 24, riskAdd: 22, costAddPct: 8 },
  logistics: { label: "Port disruption", shortLabel: "Global freight", affected: ["silicon", "hbm", "rack", "network", "power800", "cooling", "bess"], leadWeeks: 8, riskAdd: 14, costAddPct: 6 },
  switchgear: { label: "Switchgear delay", shortLabel: "MV gear", affected: ["transformer", "power800"], leadWeeks: 20, riskAdd: 20, costAddPct: 9 },
  cooling: { label: "Cooling shortage", shortLabel: "CDU / DLC", affected: ["cooling", "rack"], leadWeeks: 16, riskAdd: 18, costAddPct: 7 }
};

const opsFailureProfiles = {
  none: { label: "Nominal", color: "#2aa876", layers: [], action: "Monitor rack, bus, CDU and fabric telemetry." },
  cduFailure: { label: "CDU failure", color: "#dd3f32", layers: ["cooling"], action: "Isolate failed CDU train; shift load to N+1 CDU; cap rack power." },
  pumpFailure: { label: "Pump failure", color: "#dd7344", layers: ["cooling"], action: "Start standby pump; verify header pressure and valve lineup." },
  buswayFault: { label: "Busway fault", color: "#ff8a3d", layers: ["power"], action: "Open rack-side DC protection; sectionalize 800V bus segment." },
  utilityOutage: { label: "Utility outage", color: "#f5c766", layers: ["power"], action: "Transfer to BESS bridge; start standby generation sequence." },
  generatorFail: { label: "Generator start fail", color: "#dd3f32", layers: ["power"], action: "Retry black-start; dispatch field crew to genset yard." },
  hotRack: { label: "Hot rack", color: "#dd7344", layers: ["compute", "cooling"], action: "Drain workload; inspect cold-plate QD and rack flow path." },
  networkDegrade: { label: "Network degradation", color: "#7c6dff", layers: ["network"], action: "Fail traffic to redundant spine; inspect fiber tray and TOR links." }
};

const costBenchmarks = {
  estimateClass: "Class 4 planning",
  rangePct: 30,
  siliconValleyFacilityMPerMw: 13.3,
  globalFacilityMPerMw: 11.3,
  liquidCoolingPremiumPct: 8.5,
  gpuCardSharePct: 68,
  aiFitoutMPerItMw: {
    gb300: 22,
    gb200: 20,
    rubin: 25,
    mi355: 18,
    tpu6e: 17,
    gaudi3: 15,
    trainium3: 17,
    custom: 14
  },
  sources: [
    {
      label: "Silicon Valley / $13.3M per MW",
      publisher: "Turner & Townsend 2025",
      url: "https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/data-centre-cost-trends"
    },
    {
      label: "Global shell + core / $11.3M per MW",
      publisher: "JLL 2026 Outlook",
      url: "https://www.jll.com/content/dam/jllcom/en/global/documents/reports/research-reports/26-research-global-data-center-outlook-new.pdf"
    },
    {
      label: "US modular / 5% cost + 30% schedule",
      publisher: "NIBS / USDOE study",
      url: "https://nibs.org/the-opportunities-and-challenges-of-modular-construction/"
    },
    {
      label: "Industrialized construction range",
      publisher: "US Department of Energy",
      url: "https://www.energy.gov/sites/default/files/2024-02/bto-abc-industrialized-construction-022624.pdf"
    },
    {
      label: "Installed BESS cost methodology",
      publisher: "NLR 2024 ATB",
      url: "https://atb.nlr.gov/electricity/2024/utility-scale_battery_storage"
    }
  ]
};

const procurementEvidence = [
  { id: "incoterms", publisher: "ICC", label: "Incoterms 2020 cost / risk transfer", url: "https://library.iccwbo.org/content/clp/Others/incoterms_2020_checklist_2024-update.pdf" },
  { id: "hts", publisher: "USITC", label: "2026 Harmonized Tariff Schedule", url: "https://hts.usitc.gov/" },
  { id: "ppi", publisher: "US BLS", label: "PPI contract escalation guide", url: "https://www.bls.gov/ppi/publications/price-adjustment-guide-for-contracting-parties.htm" },
  { id: "scrm", publisher: "NIST", label: "Supplier due diligence and SCRM", url: "https://csrc.nist.gov/pubs/sp/1326/final" }
];

function sourcingOption(supplier, origin, incoterm, quoteFactor, freightPct, dutyPct, localContentPct, leadOffsetWeeks, allocation, paymentTerms = "Net 45") {
  return { supplier, origin, incoterm, quoteFactor, freightPct, dutyPct, localContentPct, leadOffsetWeeks, allocation, paymentTerms, currency: "USD", validityWeeks: 12 };
}

const procurementPackageCatalog = {
  civil: {
    code: "PKG-01", label: "Civil + foundations", nodeId: "steel", owner: "Construction", status: "Budgetary", coveragePct: 68,
    ppiSeries: "BLS construction inputs proxy", escalationAnnualPct: 4, riskBasePct: 0.8, htsFamily: "Domestic service",
    componentIds: ["site-prep", "foundation"],
    options: {
      balanced: sourcingOption("California civil JV", "California", "Domestic / site", 1, 0, 0, 100, 0, "100% primary"),
      resilient: sourcingOption("Dual civil workfronts", "California", "Domestic / site", 1.01, 0, 0, 100, -1, "60 / 40 split"),
      localized: sourcingOption("Bay Area civil trade partners", "California", "Domestic / site", 0.99, 0, 0, 100, 0, "100% US")
    }
  },
  steel: {
    code: "PKG-02", label: "Steel modules + envelope", nodeId: "steel", owner: "Modular delivery", status: "Budgetary", coveragePct: 62,
    ppiSeries: "BLS fabricated structural metal proxy", escalationAnnualPct: 3.5, riskBasePct: 1, htsFamily: "HTS classification gate if imported",
    componentIds: ["steel", "envelope", "fire", "containment", "architectural", "factory-integration", "freight-crane"],
    options: {
      balanced: sourcingOption("Western US module fabricator", "US West", "FCA fabrication yard", 1, 1.5, 0, 90, 0, "100% primary"),
      resilient: sourcingOption("Two western fabrication cells", "US West", "FCA fabrication yards", 1.03, 1.4, 0, 96, -2, "60 / 40 split"),
      localized: sourcingOption("California / Nevada steel cells", "California + Nevada", "DAP site", 1.04, 0.8, 0, 100, -1, "100% US")
    }
  },
  mvPower: {
    code: "PKG-03", label: "Transformer + MV switchgear", nodeId: "transformer", owner: "Electrical", status: "RFQ pending", coveragePct: 38,
    ppiSeries: "BLS power transformer proxy", escalationAnnualPct: 5, riskBasePct: 1.8, htsFamily: "HTS classification gate",
    componentIds: ["mv-interconnect", "transformer-switchgear"],
    options: {
      balanced: sourcingOption("Hitachi Energy / Siemens class", "US + Europe", "DAP site", 0.99, 2, 1, 45, 0, "100% best source"),
      resilient: sourcingOption("Two reserved transformer slots", "US + Europe", "DAP site", 1.04, 1.8, 1, 58, -4, "70 / 30 split"),
      localized: sourcingOption("US transformer program", "United States", "FCA US plant", 1.1, 0.8, 0.2, 86, -2, "85% US")
    }
  },
  dcPower: {
    code: "PKG-04", label: "800V conversion + distribution", nodeId: "power800", owner: "Electrical", status: "Budgetary", coveragePct: 52,
    ppiSeries: "BLS switchgear / power conversion proxy", escalationAnnualPct: 4.5, riskBasePct: 1.5, htsFamily: "HTS classification gate",
    componentIds: ["rectifier", "busway", "sidecar", "electrical-install"],
    options: {
      balanced: sourcingOption("Electrical profile A / Electrical profile C / Cooling profile B class", "US + Europe", "DAP site", 1, 2.5, 1.5, 38, 0, "100% primary"),
      resilient: sourcingOption("Dual 800V interface suppliers", "US + Europe", "DAP site", 1.05, 2.1, 1.2, 52, -3, "70 / 30 split"),
      localized: sourcingOption("US 800V assembly program", "United States", "FCA US plant", 1.11, 0.9, 0.2, 74, -1, "75% US")
    }
  },
  cooling: {
    code: "PKG-05", label: "Liquid cooling plant", nodeId: "cooling", owner: "Mechanical", status: "Budgetary", coveragePct: 58,
    ppiSeries: "BLS pump / heat exchanger proxy", escalationAnnualPct: 4, riskBasePct: 1.2, htsFamily: "HTS classification gate",
    componentIds: ["heat-rejection", "cdu", "pumps", "headers", "rack-liquid", "cooling-controls"],
    options: {
      balanced: sourcingOption("Electrical profile A / Cooling profile B / Delta class", "US + EU + Asia", "DAP site", 0.99, 3, 1.5, 36, 0, "100% best source"),
      resilient: sourcingOption("Dual OCP-compatible cooling train", "US + Europe", "DAP site", 1.04, 2.4, 1.1, 54, -3, "65 / 35 split"),
      localized: sourcingOption("US-integrated DLC skids", "United States", "FCA US plant", 1.08, 1, 0.2, 68, -1, "70% US")
    }
  },
  controls: {
    code: "PKG-06", label: "Controls + security", nodeId: "controls", owner: "Controls", status: "Benchmark", coveragePct: 46,
    ppiSeries: "BLS controls / software services proxy", escalationAnnualPct: 3, riskBasePct: 1, htsFamily: "Software / domestic integration",
    componentIds: ["bms", "security", "backup-controls"],
    options: {
      balanced: sourcingOption("Open DCIM / controls integrator", "North America", "Domestic / site", 1, 0.4, 0, 58, 0, "100% primary"),
      resilient: sourcingOption("Dual controls integrators", "North America", "Domestic / site", 1.03, 0.4, 0, 70, -2, "70 / 30 split"),
      localized: sourcingOption("US controls and cybersecurity team", "United States", "Domestic / site", 1.06, 0.2, 0, 92, -1, "95% US")
    }
  },
  field: {
    code: "PKG-07", label: "Field delivery + professional services", nodeId: "steel", owner: "Project controls", status: "Should-cost", coveragePct: 34,
    ppiSeries: "BLS construction labor / services proxy", escalationAnnualPct: 4, riskBasePct: 0.8, htsFamily: "Domestic service",
    componentIds: ["general-conditions", "field-tie", "ist", "design", "permits", "owner", "contingency"],
    options: {
      balanced: sourcingOption("California EPCM trade stack", "California", "Domestic / site", 1, 0, 0, 100, 0, "100% local"),
      resilient: sourcingOption("Parallel EPCM + commissioning teams", "US West", "Domestic / site", 1.02, 0, 0, 100, -2, "70 / 30 split"),
      localized: sourcingOption("California professional services", "California", "Domestic / site", 1.01, 0, 0, 100, 0, "100% US")
    }
  },
  bess: {
    code: "PKG-08", label: "BESS + PCS", nodeId: "bess", owner: "Resilience", status: "Budgetary", coveragePct: 61,
    ppiSeries: "BLS storage battery / import price proxy", escalationAnnualPct: 5, riskBasePct: 1.5, htsFamily: "HTS classification gate",
    componentIds: ["backup-storage", "backup-yard"],
    options: {
      balanced: sourcingOption("Global LFP + US PCS integrator", "Asia + United States", "CIF Oakland", 0.98, 4, 3, 32, 0, "100% primary"),
      resilient: sourcingOption("Dual cell source + US PCS", "Asia + United States", "CIF Oakland", 1.05, 3.2, 2.5, 48, -3, "70 / 30 cells"),
      localized: sourcingOption("US BESS assembly program", "United States", "FCA US plant", 1.12, 1.2, 0.5, 72, -1, "75% US")
    }
  },
  standby: {
    code: "PKG-09", label: "Standby generation + fuel", nodeId: "standby", owner: "Resilience", status: "Budgetary", coveragePct: 64,
    ppiSeries: "BLS generator set proxy", escalationAnnualPct: 4, riskBasePct: 1.2, htsFamily: "HTS classification gate",
    componentIds: ["backup-generation", "backup-fuel"],
    options: {
      balanced: sourcingOption("mtu / Standby generation reference / Caterpillar class", "US + Europe", "DAP site", 1, 2.2, 1, 56, 0, "100% primary"),
      resilient: sourcingOption("Dual genset families + fuel lanes", "US + Europe", "DAP site", 1.04, 1.8, 0.8, 68, -3, "70 / 30 split"),
      localized: sourcingOption("US-assembled standby plant", "United States", "FCA US plant", 1.08, 0.8, 0.2, 86, -1, "90% US")
    }
  },
  rack: {
    code: "PKG-10", label: "Rack systems excluding accelerators", nodeId: "rack", owner: "Compute", status: "Budgetary", coveragePct: 48,
    ppiSeries: "BLS computer systems / import price proxy", escalationAnnualPct: 6, riskBasePct: 1.8, htsFamily: "HTS classification gate",
    componentIds: ["it-rackSystems"],
    options: {
      balanced: sourcingOption("QCT / Foxconn / Wistron class", "Taiwan + global plants", "FOB Asian port", 0.98, 3.5, 1, 22, 0, "100% primary ODM"),
      resilient: sourcingOption("Two MGX rack integrators", "Taiwan + Mexico + US", "FCA integrator", 1.05, 2.8, 0.8, 36, -4, "60 / 40 split"),
      localized: sourcingOption("US final rack integration", "United States + global ODM", "FCA US integrator", 1.12, 1.5, 0.3, 62, -2, "65% US value")
    }
  },
  network: {
    code: "PKG-11", label: "Fabric + optics", nodeId: "network", owner: "Network", status: "Budgetary", coveragePct: 43,
    ppiSeries: "BLS communications equipment / import price proxy", escalationAnnualPct: 6, riskBasePct: 2, htsFamily: "HTS classification gate",
    componentIds: ["it-network"],
    options: {
      balanced: sourcingOption("NVIDIA + optical ecosystem", "Taiwan + United States", "FOB Asian port", 0.98, 2.5, 1, 16, 0, "100% primary fabric"),
      resilient: sourcingOption("NVLink + qualified Ethernet fallback", "Taiwan + United States", "FCA integrator", 1.07, 2.1, 0.8, 28, -3, "Primary + fallback BOM"),
      localized: sourcingOption("US fabric integration + global optics", "United States + APAC", "FCA US integrator", 1.14, 1.2, 0.3, 46, -1, "50% US value")
    }
  },
  integration: {
    code: "PKG-12", label: "Rack integration + initial spares", nodeId: "controls", owner: "Compute", status: "Should-cost", coveragePct: 38,
    ppiSeries: "BLS technical services proxy", escalationAnnualPct: 3, riskBasePct: 1, htsFamily: "Domestic service / imported spares gate",
    componentIds: ["it-integration"],
    options: {
      balanced: sourcingOption("OEM integration services", "North America", "Domestic / site", 0.99, 0.8, 0.2, 72, 0, "100% primary"),
      resilient: sourcingOption("OEM + independent burn-in lab", "North America", "Domestic / site", 1.03, 0.7, 0.2, 84, -2, "80 / 20 split"),
      localized: sourcingOption("US rack acceptance program", "United States", "Domestic / site", 1.04, 0.4, 0.1, 96, -1, "100% US service")
    }
  },
  gpu: {
    code: "PKG-13", label: "Accelerator cards (excluded)", nodeId: "silicon", owner: "Compute", status: "Excluded", coveragePct: 0,
    ppiSeries: "BLS semiconductor import price proxy", escalationAnnualPct: 8, riskBasePct: 2.5, htsFamily: "HTS classification gate",
    componentIds: ["it-gpuCards"],
    options: {
      balanced: sourcingOption("Accelerator OEM allocation", "Taiwan + United States", "FCA OEM hub", 0.98, 1.8, 0.5, 12, 0, "Allocation dependent"),
      resilient: sourcingOption("Reserved OEM + packaging capacity", "Taiwan + Arizona ramp", "FCA OEM hub", 1.08, 1.6, 0.4, 20, -2, "Reserved allocation"),
      localized: sourcingOption("US packaging ramp + global wafer", "United States + Taiwan", "FCA OEM hub", 1.12, 1.2, 0.3, 32, 2, "US packaging target")
    }
  }
};

const procurementPackageByComponent = Object.fromEntries(
  Object.entries(procurementPackageCatalog).flatMap(([packageKey, item]) => item.componentIds.map((componentId) => [componentId, packageKey]))
);

const constructionMethodProfiles = {
  conventional: {
    code: "M0",
    label: "Conventional",
    shortLabel: "Field-built",
    costFactor: 1,
    scheduleFactor: 1,
    prefabPct: 35,
    crewCount: 4,
    description: "Sequential site construction with field-installed MEP."
  },
  hybrid: {
    code: "M1",
    label: "Hybrid modular",
    shortLabel: "Skids + field shell",
    costFactor: 0.98,
    scheduleFactor: 0.84,
    prefabPct: 58,
    crewCount: 4,
    description: "Factory power and cooling skids with site-built enclosure."
  },
  highPrefab: {
    code: "M2",
    label: "High-prefab",
    shortLabel: "Steel pods + MEP skids",
    costFactor: 0.95,
    scheduleFactor: 0.7,
    prefabPct: 75,
    crewCount: 5,
    description: "Parallel sitework and factory-built steel/MEP modules."
  }
};

const costComponentFilters = {
  all: "All",
  construction: "Build",
  power: "Power",
  cooling: "Cooling",
  backup: "Backup",
  it: "IT infra"
};

const procurementPackageFilters = {
  all: "All",
  rfq: "Open RFQ",
  import: "Import gate",
  risk: "Lead risk",
  us: "US-heavy"
};

const globalSupplyNodes = [
  {
    id: "silicon",
    lane: "Compute",
    component: "AI silicon + CoWoS",
    primary: "TSMC / advanced packaging",
    region: "APAC",
    country: "Taiwan + Arizona ramp",
    leadWeeks: 42,
    risk: 88,
    spendWeight: 24,
    dualReady: false,
    qualifiable: false,
    localizable: false,
    alternate: "Arizona + Amkor qualification",
    source: "TSMC 2025 Annual Report",
    sourceUrl: "https://investor.tsmc.com/static/annualReports/2025/english/index.html"
  },
  {
    id: "hbm",
    lane: "Compute",
    component: "HBM4 memory",
    primary: "SK hynix",
    region: "APAC",
    country: "Korea",
    leadWeeks: 40,
    risk: 84,
    spendWeight: 17,
    dualReady: false,
    qualifiable: true,
    localizable: false,
    alternate: "Samsung / Micron qualification",
    source: "SK hynix HBM4",
    sourceUrl: "https://news.skhynix.com/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/"
  },
  {
    id: "rack",
    lane: "Compute",
    component: "MGX rack integration",
    primary: "QCT / Foxconn / Wistron class",
    region: "APAC",
    country: "Taiwan + global plants",
    leadWeeks: 24,
    risk: 62,
    spendWeight: 10,
    dualReady: true,
    qualifiable: true,
    localizable: true,
    alternate: "50+ NVIDIA MGX partners",
    source: "NVIDIA MGX ecosystem",
    sourceUrl: "https://www.nvidia.com/en-us/data-center/products/mgx/"
  },
  {
    id: "network",
    lane: "Network",
    component: "NVLink / optics / spine",
    primary: "NVIDIA + optical ecosystem",
    region: "APAC",
    country: "Taiwan / US",
    leadWeeks: 32,
    risk: 71,
    spendWeight: 8,
    dualReady: false,
    qualifiable: true,
    localizable: false,
    alternate: "Ethernet fabric design path",
    source: "NVIDIA MGX ecosystem",
    sourceUrl: "https://www.nvidia.com/en-us/data-center/products/mgx/"
  },
  {
    id: "transformer",
    lane: "Power",
    component: "Power transformer + switchgear",
    primary: "Hitachi Energy / ABB / Siemens",
    region: "North America",
    country: "US + Europe",
    leadWeeks: 72,
    risk: 91,
    spendWeight: 9,
    dualReady: false,
    qualifiable: true,
    localizable: true,
    alternate: "Reserve two factory slots",
    source: "Hitachi Energy transformer expansion",
    sourceUrl: "https://www.hitachienergy.com/us/en/news-and-events/press-releases/2025/03/hitachi-energy-invests-additional-250-million-usd-to-address-global-transformer-shortage"
  },
  {
    id: "power800",
    lane: "Power",
    component: "800V sidecar / busway",
    primary: "Electrical profile A / Electrical profile C / Cooling profile B",
    region: "North America",
    country: "US + Europe",
    leadWeeks: 36,
    risk: 68,
    spendWeight: 8,
    dualReady: false,
    qualifiable: true,
    localizable: true,
    alternate: "Open 800V interface package",
    source: "NVIDIA 800V ecosystem",
    sourceUrl: "https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin/"
  },
  {
    id: "cooling",
    lane: "Cooling",
    component: "CDU / pump / manifold",
    primary: "Electrical profile A / Cooling profile B / Delta",
    region: "Europe",
    country: "EU + US + Asia",
    leadWeeks: 28,
    risk: 55,
    spendWeight: 7,
    dualReady: true,
    qualifiable: true,
    localizable: true,
    alternate: "OCP ACS interface",
    source: "OCP Advanced Cooling",
    sourceUrl: "https://www.opencompute.org/wiki/Cooling_Environments_Advanced_Cooling_Solutions"
  },
  {
    id: "bess",
    lane: "Resilience",
    component: "LFP BESS + controls",
    primary: "Standby generation reference / Electrical profile C / Electrical profile A",
    region: "North America",
    country: "US + global cells",
    leadWeeks: 26,
    risk: 57,
    spendWeight: 6,
    dualReady: true,
    qualifiable: true,
    localizable: true,
    alternate: "UL-listed container alternates",
    source: "Standby generation reference BESS",
    sourceUrl: "https://www.cummins.com/en-na/news/2025/06/03/cummins-launches-containerised-bess-product-line"
  },
  {
    id: "standby",
    lane: "Resilience",
    component: "Standby generator + fuel",
    primary: "mtu / Standby generation reference / Caterpillar",
    region: "Europe",
    country: "Germany + US",
    leadWeeks: 32,
    risk: 52,
    spendWeight: 4,
    dualReady: true,
    qualifiable: true,
    localizable: true,
    alternate: "HVO / gas engine families",
    source: "Rolls-Royce data center power",
    sourceUrl: "https://www.rolls-royce.com/media/our-stories/discover/2025/powering-data-centres-through-the-energy-transition.aspx"
  },
  {
    id: "steel",
    lane: "Structure",
    component: "Steel pod + MEP skid",
    primary: "Western US fabricators",
    region: "California",
    country: "US West",
    leadWeeks: 16,
    risk: 34,
    spendWeight: 5,
    dualReady: true,
    qualifiable: true,
    localizable: true,
    alternate: "Two regional fabrication cells",
    source: "VDC / MEP coordination",
    sourceUrl: "https://itc.scix.net/pdfs/w78-2007-032-107-Khanzode.pdf"
  },
  {
    id: "controls",
    lane: "Controls",
    component: "Microgrid / DCIM controls",
    primary: "Standby generation reference / Electrical profile A / Electrical profile C",
    region: "North America",
    country: "US",
    leadWeeks: 20,
    risk: 43,
    spendWeight: 2,
    dualReady: true,
    qualifiable: true,
    localizable: true,
    alternate: "Modbus / open telemetry contract",
    source: "Standby generation reference microgrid control",
    sourceUrl: "https://www.cummins.com/en-na/generators/products/microgrid-control"
  }
];

const modularSupplyProfiles = {
  ocp: {
    label: "OCP open reference",
    vendor: "Open Compute Project",
    delivery: "Open multi-vendor reference",
    rackStandard: "ORv3 48V busbar",
    coolingInterface: "ACS blind-mate manifold / QD",
    powerPath: "48V shelf today / 800V facility adapter",
    readiness: "Open baseline",
    openFit: 100,
    cduBlockMw: 1.2,
    sourceUrl: "https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns"
  },
  schneider: {
    label: "Electrical integration profile",
    vendor: "Electrical integration reference",
    delivery: "Prefab pod + power module",
    rackStandard: "OCP-inspired MGX / NVL72",
    coolingInterface: "Direct liquid pod headers",
    powerPath: "800V sidecar / live-swap storage",
    readiness: "800V-forward",
    openFit: 84,
    cduBlockMw: 1.2,
    sourceUrl: "https://www.se.com/ww/en/about-us/newsroom/news/press-releases/schneider-electric-accelerates-the-development-and-deployment-of-ai-factories-at-scale-with-nvidia-68432d51b96642343f0f890b/"
  },
  vertiv: {
    label: "Liquid-cooled modular profile",
    vendor: "Cooling profile B",
    delivery: "Liquid-cooled prefabricated module",
    rackStandard: "High-density GPU racks",
    coolingInterface: "Direct-to-chip CoolChip loop",
    powerPath: "Modular AC / 800V-ready platform",
    readiness: "Prefab liquid",
    openFit: 76,
    cduBlockMw: 1,
    sourceUrl: "https://www.vertiv.com/en-ca/about/news-and-events/corporate-news/vertiv-launches-high-density-prefabricated-modular-data-center-solution--to-accelerate-global-deployment-of-ai-compute/"
  },
  eatonSiemens: {
    label: "Electrical profile C + Generation profile D",
    vendor: "Electrical profile C / Generation profile D",
    delivery: "Grid-to-chip + onsite power blocks",
    rackStandard: "ORv3 busbar / GPU containment",
    coolingInterface: "Partner DLC module interface",
    powerPath: "Onsite gas + 800V grid-to-chip",
    readiness: "Power-led modular",
    openFit: 78,
    cduBlockMw: 1.2,
    sourceUrl: "https://www.siemens-energy.com/global/en/home/products-services/product/modular-onsite-power-generation-data-center.html"
  },
  rittal: {
    label: "Rack profile E RiMatrix",
    vendor: "Rack profile E",
    delivery: "Modular room / rack infrastructure",
    rackStandard: "RiMatrix / OCP ORv3",
    coolingInterface: "In-row CDU / single-phase DLC",
    powerPath: "Open rack busbar integration",
    readiness: "ORv3-aligned",
    openFit: 92,
    cduBlockMw: 1,
    sourceUrl: "https://www.rittal.com/uk-en/products/RiMatrix"
  },
  delta: {
    label: "Power conversion modular AI DC",
    vendor: "Power conversion profile",
    delivery: "Modular data center + microgrid",
    rackStandard: "GPU rack / 800V ecosystem",
    coolingInterface: "DLC skid + controls",
    powerPath: "Utility / solar / storage / generator microgrid",
    readiness: "Microgrid-native",
    openFit: 82,
    cduBlockMw: 1.2,
    sourceUrl: "https://www.delta-americas.com/en-US/landing/GTC-2026"
  }
};

const gpuInternalLayers = {
  all: { label: "All", color: "#f7f3ea" },
  power: { label: "Power", color: "#ff8a3d" },
  cooling: { label: "Cooling", color: "#36d7c8" },
  compute: { label: "Compute", color: "#2d6bff" },
  network: { label: "Network", color: "#7c6dff" },
  safety: { label: "Safety", color: "#dd3f32" },
  structure: { label: "Structure", color: "#8b939d" },
  foundation: { label: "Foundation", color: "#a89278" },
  construction: { label: "Construction", color: "#f5c766" },
  telemetry: { label: "Telemetry", color: "#2aa876" }
};

const gpuInternalLayerKeys = Object.keys(gpuInternalLayers);
const gpuDetailLayerKeys = gpuInternalLayerKeys.filter((layer) => layer !== "all");

const softwareStacks = {
  cudaRunai: {
    label: "CUDA / Run:ai",
    scheduler: "Run:ai + K8s",
    runtime: "CUDA-X / TensorRT",
    observability: "DCGM + Mission Control",
    security: "MIG / Confidential",
    controlScore: 88,
    runtimeScore: 94,
    observabilityScore: 92,
    securityScore: 88,
    portabilityScore: 62,
    compat: { cuda: 96, rocm: 38, jax: 64, gaudi: 42, neuron: 56, mixed: 72 },
    sourceUrl: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/"
  },
  rocmK8s: {
    label: "ROCm / K8s",
    scheduler: "K8s + Slurm",
    runtime: "ROCm / vLLM",
    observability: "Prometheus + ROCm SMI",
    security: "Namespace isolation",
    controlScore: 82,
    runtimeScore: 88,
    observabilityScore: 78,
    securityScore: 74,
    portabilityScore: 84,
    compat: { cuda: 42, rocm: 94, jax: 58, gaudi: 50, neuron: 48, mixed: 70 },
    sourceUrl: "https://www.amd.com/en/products/accelerators/instinct/mi350.html"
  },
  jaxPathways: {
    label: "JAX / Pathways",
    scheduler: "Pathways + GKE",
    runtime: "JAX / XLA",
    observability: "Cloud TPU metrics",
    security: "IAM + VPC-SC",
    controlScore: 80,
    runtimeScore: 94,
    observabilityScore: 86,
    securityScore: 90,
    portabilityScore: 58,
    compat: { cuda: 56, rocm: 48, jax: 96, gaudi: 46, neuron: 70, mixed: 62 },
    sourceUrl: "https://docs.cloud.google.com/tpu/docs/v6e"
  },
  gaudiOpen: {
    label: "Gaudi / PyTorch",
    scheduler: "K8s + Ethernet fabric",
    runtime: "Gaudi SW / PyTorch",
    observability: "Habana telemetry + Prometheus",
    security: "Open Ethernet segmentation",
    controlScore: 76,
    runtimeScore: 84,
    observabilityScore: 72,
    securityScore: 72,
    portabilityScore: 88,
    compat: { cuda: 44, rocm: 52, jax: 48, gaudi: 94, neuron: 50, mixed: 76 },
    sourceUrl: "https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi.html"
  },
  neuronEks: {
    label: "Neuron / EKS",
    scheduler: "EKS + Ray + Batch",
    runtime: "AWS Neuron SDK",
    observability: "Neuron Monitor",
    security: "Nitro / IAM / EFA encryption",
    controlScore: 88,
    runtimeScore: 90,
    observabilityScore: 84,
    securityScore: 92,
    portabilityScore: 66,
    compat: { cuda: 52, rocm: 46, jax: 78, gaudi: 48, neuron: 96, mixed: 72 },
    sourceUrl: "https://aws.amazon.com/ai/machine-learning/trainium/"
  },
  hybridOps: {
    label: "Hybrid AI OS",
    scheduler: "K8s + Slurm + Ray",
    runtime: "vLLM / Triton / XLA",
    observability: "OpenTelemetry",
    security: "Policy + attestation",
    controlScore: 86,
    runtimeScore: 82,
    observabilityScore: 90,
    securityScore: 82,
    portabilityScore: 94,
    compat: { cuda: 82, rocm: 82, jax: 78, gaudi: 78, neuron: 76, mixed: 88 },
    sourceUrl: "https://github.com/NVIDIA/physicsnemo"
  }
};

const softwarePolicies = {
  throughput: {
    label: "Throughput",
    placement: "max tokens / MW",
    queueBias: 0.82,
    reliabilityBias: 0.86,
    energyFlex: 0.62,
    releaseBias: 4
  },
  resilience: {
    label: "Resilience",
    placement: "N+1 domains",
    queueBias: 1.05,
    reliabilityBias: 1.08,
    energyFlex: 0.76,
    releaseBias: 6
  },
  cost: {
    label: "Cost",
    placement: "spot / flex queues",
    queueBias: 1.18,
    reliabilityBias: 0.82,
    energyFlex: 0.88,
    releaseBias: 1
  },
  carbonFlex: {
    label: "Grid flex",
    placement: "carbon-aware load",
    queueBias: 1.12,
    reliabilityBias: 0.9,
    energyFlex: 1.08,
    releaseBias: 3
  }
};

const workloadProfiles = {
  training: { label: "Training", powerFactor: 1.08, memoryFactor: 1.12, fabricNeed: 92, coolingBias: 1.08 },
  inference: { label: "Inference", powerFactor: 0.82, memoryFactor: 1.28, fabricNeed: 72, coolingBias: 0.9 },
  mixed: { label: "Mixed AI", powerFactor: 0.96, memoryFactor: 1, fabricNeed: 82, coolingBias: 1 },
  hpc: { label: "AI + HPC", powerFactor: 1.02, memoryFactor: 0.88, fabricNeed: 88, coolingBias: 1.04 }
};

const state = {
  selectedId: "A-03",
  tab: "twin",
  twinMode: "design",
  costScope: "exGpu",
  costBasis: "perMw",
  costMethod: "hybrid",
  costFilter: "all",
  procurementFilter: "all",
  internalLayer: "all",
  cutaway: true,
  exploded: false,
  opsFailure: "none",
  engine: {
    program: "aiPod",
    site: "bayMud",
    tier: "enhanced",
    compute: "gb200",
    rack: "nvl72",
    stack: "cudaRunai",
    workload: "mixed",
    policy: "throughput",
    powerSource: "grid",
    powerMw: 40,
    reservePct: 15,
    turbineModel: "lm2500Xpress",
    turbineUnitMw: 34.5,
    turbineEfficiencyPct: 39.4,
    turbineAmbientC: 35,
    turbineAltitudeM: 20,
    reliability: "nPlus1",
    backup: "bess2h",
    supplier: "ocp",
    supplyStrategy: "balanced",
    supplyShock: "base"
  },
  scenario: "baseline",
  week: 14,
  crew: 4,
  prefab: 58,
  bridge: false,
  resolvedDeltas: new Set()
};

const el = {
  mwReady: document.getElementById("mwReady"),
  ttp: document.getElementById("ttp"),
  criticalPath: document.getElementById("criticalPath"),
  weekRange: document.getElementById("weekRange"),
  weekLabel: document.getElementById("weekLabel"),
  constructionTimeline: document.getElementById("constructionTimeline"),
  constructionTimelinePhase: document.getElementById("constructionTimelinePhase"),
  constructionTimelineWeek: document.getElementById("constructionTimelineWeek"),
  constructionTimelineMeta: document.getElementById("constructionTimelineMeta"),
  constructionMilestones: document.getElementById("constructionMilestones"),
  constructionScrubber: document.getElementById("constructionScrubber"),
  constructionTimelineRange: document.getElementById("constructionTimelineRange"),
  crewRange: document.getElementById("crewRange"),
  crewLabel: document.getElementById("crewLabel"),
  prefabRange: document.getElementById("prefabRange"),
  prefabLabel: document.getElementById("prefabLabel"),
  bridgeToggle: document.getElementById("bridgeToggle"),
  blockList: document.getElementById("blockList"),
  moduleMap: document.getElementById("moduleMap"),
  threeViewport: document.getElementById("threeViewport"),
  twin3d: document.getElementById("twin3d"),
  knowledgeMap: document.getElementById("knowledgeMap"),
  stageTitle: document.getElementById("stageTitle"),
  heroBlock: document.getElementById("heroBlock"),
  heroStatus: document.getElementById("heroStatus"),
  heroCompute: document.getElementById("heroCompute"),
  heroPower: document.getElementById("heroPower"),
  heroCooling: document.getElementById("heroCooling"),
  heroStructure: document.getElementById("heroStructure"),
  coolingHud: document.getElementById("coolingHud"),
  coolingHudModule: document.getElementById("coolingHudModule"),
  coolingHudSupply: document.getElementById("coolingHudSupply"),
  coolingHudReturn: document.getElementById("coolingHudReturn"),
  coolingHudRackFlow: document.getElementById("coolingHudRackFlow"),
  coolingHudTopology: document.getElementById("coolingHudTopology"),
  powerHud: document.getElementById("powerHud"),
  powerHudSource: document.getElementById("powerHudSource"),
  powerHudMw: document.getElementById("powerHudMw"),
  powerHudTopology: document.getElementById("powerHudTopology"),
  powerHudBackup: document.getElementById("powerHudBackup"),
  selectedTitle: document.getElementById("selectedTitle"),
  selectedBadge: document.getElementById("selectedBadge"),
  blockMw: document.getElementById("blockMw"),
  blockSteelBay: document.getElementById("blockSteelBay"),
  blockFeeder: document.getElementById("blockFeeder"),
  blockRectifier: document.getElementById("blockRectifier"),
  twinEyebrow: document.getElementById("twinEyebrow"),
  twinHeadline: document.getElementById("twinHeadline"),
  twinCopy: document.getElementById("twinCopy"),
  designEngine: document.getElementById("designEngine"),
  intelSummary: document.getElementById("intelSummary"),
  backendEngine: document.getElementById("backendEngine"),
  knowledgeBase: document.getElementById("knowledgeBase"),
  intelOptimizer: document.getElementById("intelOptimizer"),
  intelConstraints: document.getElementById("intelConstraints"),
  intelPortfolio: document.getElementById("intelPortfolio"),
  intelCapital: document.getElementById("intelCapital"),
  intelPeers: document.getElementById("intelPeers"),
  intelSignals: document.getElementById("intelSignals"),
  intelReadout: document.getElementById("intelReadout"),
  supplyControls: document.getElementById("supplyControls"),
  supplySummary: document.getElementById("supplySummary"),
  supplyExposure: document.getElementById("supplyExposure"),
  supplyProcurement: document.getElementById("supplyProcurement"),
  supplyActions: document.getElementById("supplyActions"),
  costControls: document.getElementById("costControls"),
  costMethod: document.getElementById("costMethod"),
  costHeadline: document.getElementById("costHeadline"),
  costKpis: document.getElementById("costKpis"),
  costProcurement: document.getElementById("costProcurement"),
  costBreakdown: document.getElementById("costBreakdown"),
  costComponents: document.getElementById("costComponents"),
  costCashflow: document.getElementById("costCashflow"),
  costBackup: document.getElementById("costBackup"),
  costAssumptions: document.getElementById("costAssumptions"),
  omniverseSummary: document.getElementById("omniverseSummary"),
  omniverseLayers: document.getElementById("omniverseLayers"),
  omniverseGraph: document.getElementById("omniverseGraph"),
  omniverseTelemetry: document.getElementById("omniverseTelemetry"),
  omniverseActions: document.getElementById("omniverseActions"),
  twinKpis: document.getElementById("twinKpis"),
  twinFlow: document.getElementById("twinFlow"),
  internalDetails: document.getElementById("internalDetails"),
  gpuLayerControls: document.getElementById("gpuLayerControls"),
  cutawayToggle: document.getElementById("cutawayToggle"),
  explodedToggle: document.getElementById("explodedToggle"),
  opsFailureControls: document.getElementById("opsFailureControls"),
  stageList: document.getElementById("stageList"),
  nextAction: document.getElementById("nextAction"),
  powerCanvas: document.getElementById("powerCanvas"),
  powerReadout: document.getElementById("powerReadout"),
  scanStack: document.getElementById("scanStack"),
  resolveScan: document.getElementById("resolveScan"),
  pilotChecklist: document.getElementById("pilotChecklist"),
  saveTwin: document.getElementById("saveTwin"),
  backendStatus: document.getElementById("backendStatus"),
  toast: document.getElementById("toast")
};

const colorByStatus = {
  loaded: "#2aa876",
  energized: "#2d6bff",
  "power-hold": "#dd7344",
  build: "#d9a441",
  procure: "#8b939d",
  design: "#68717a"
};

const validTabs = ["twin", "power", "field", "supply", "cost", "intel", "omniverse", "pilot"];
const validTwinModes = ["design", "mechanics", "energy", "fluid", "thermal", "physics", "compute", "software", "ops"];
const validInternalLayers = gpuInternalLayerKeys;
const validScenarios = ["baseline", "utilitySlip", "accelerated"];
const validCostScopes = ["allIn", "exGpu", "facility"];
const validCostBases = ["perMw", "total"];
const validCostMethods = Object.keys(constructionMethodProfiles);
const initialParams = new URLSearchParams(window.location.search);
const publicationDemo = ["publish", "1", "true"].includes((initialParams.get("demo") || "").toLowerCase());
const hasRouteTab = validTabs.includes(initialParams.get("tab"));
const hasRouteMode = validTwinModes.includes(initialParams.get("mode"));
const hasRouteBlock = modules.some((block) => block.id === initialParams.get("block"));
const hasRouteLayer = validInternalLayers.includes(initialParams.get("layer"));
const hasRouteCutaway = initialParams.has("cutaway");
const hasRouteScenario = validScenarios.includes(initialParams.get("scenario"));
const hasRouteWeek = initialParams.has("week") && Number.isFinite(Number(initialParams.get("week")));
const hasRouteCostScope = validCostScopes.includes(initialParams.get("costscope"));
const hasRouteCostBasis = validCostBases.includes(initialParams.get("costunit"));
const hasRouteCostMethod = validCostMethods.includes(initialParams.get("build"));
if (publicationDemo) {
  state.selectedId = "A-03";
  state.internalLayer = "all";
  state.cutaway = true;
  state.engine = {
    program: "aiPod",
    site: "bayMud",
    tier: "enhanced",
    compute: "rubin",
    rack: "mgx800",
    stack: "cudaRunai",
    workload: "training",
    policy: "resilience",
    powerSource: "grid",
    powerMw: 40,
    reservePct: 15,
    turbineModel: "lm6000Pf",
    turbineUnitMw: 56.9,
    turbineEfficiencyPct: 41,
    turbineAmbientC: 35,
    turbineAltitudeM: 20,
    reliability: "nPlus1",
    backup: "hvo48",
    supplier: "schneider",
    supplyStrategy: "resilient",
    supplyShock: "base"
  };
  state.scenario = "accelerated";
  state.costScope = "exGpu";
  state.costBasis = "perMw";
  state.costMethod = "highPrefab";
  state.week = 14;
  state.crew = 5;
  state.prefab = 75;
  state.bridge = true;
  state.resolvedDeltas = new Set();
  document.body.classList.add("publication-demo");
}
if (hasRouteTab) state.tab = initialParams.get("tab");
if (hasRouteMode) state.twinMode = initialParams.get("mode");
if (hasRouteBlock) state.selectedId = initialParams.get("block");
if (hasRouteLayer) state.internalLayer = initialParams.get("layer");
if (hasRouteCutaway) state.cutaway = !["0", "false", "off", "no"].includes((initialParams.get("cutaway") || "").toLowerCase());
if (hasRouteScenario) state.scenario = initialParams.get("scenario");
if (hasRouteCostScope) state.costScope = initialParams.get("costscope");
if (hasRouteCostBasis) state.costBasis = initialParams.get("costunit");
if (hasRouteCostMethod) {
  state.costMethod = initialParams.get("build");
  state.prefab = constructionMethodProfiles[state.costMethod].prefabPct;
  state.crew = constructionMethodProfiles[state.costMethod].crewCount;
}
if (powerSourceProfiles[initialParams.get("source")]) state.engine.powerSource = initialParams.get("source");
if (gasTurbineModels[initialParams.get("gtmodel")]) state.engine.turbineModel = initialParams.get("gtmodel");
if (reliabilityProfiles[initialParams.get("reliability")]) state.engine.reliability = initialParams.get("reliability");
if (backupProfiles[initialParams.get("backup")]) state.engine.backup = initialParams.get("backup");
if (modularSupplyProfiles[initialParams.get("supplier")]) state.engine.supplier = initialParams.get("supplier");
if (supplyStrategies[initialParams.get("supply")]) state.engine.supplyStrategy = initialParams.get("supply");
if (supplyShockProfiles[initialParams.get("shock")]) state.engine.supplyShock = initialParams.get("shock");
if (initialParams.has("mw") && Number.isFinite(Number(initialParams.get("mw")))) state.engine.powerMw = clamp(Number(initialParams.get("mw")), 5, 250);
if (initialParams.has("reserve") && Number.isFinite(Number(initialParams.get("reserve")))) state.engine.reservePct = clamp(Number(initialParams.get("reserve")), 5, 30);
if (initialParams.has("gtunit") && Number.isFinite(Number(initialParams.get("gtunit")))) state.engine.turbineUnitMw = clamp(Number(initialParams.get("gtunit")), 5, 100);
if (initialParams.has("gteff") && Number.isFinite(Number(initialParams.get("gteff")))) state.engine.turbineEfficiencyPct = clamp(Number(initialParams.get("gteff")), 20, 65);
if (initialParams.has("gtambient") && Number.isFinite(Number(initialParams.get("gtambient")))) state.engine.turbineAmbientC = clamp(Number(initialParams.get("gtambient")), -20, 55);
if (initialParams.has("gtalt") && Number.isFinite(Number(initialParams.get("gtalt")))) state.engine.turbineAltitudeM = clamp(Number(initialParams.get("gtalt")), 0, 3000);
if (initialParams.has("week") && Number.isFinite(Number(initialParams.get("week")))) state.week = clamp(Number(initialParams.get("week")), 0, 30);
state.bridge = state.engine.backup !== "none";

const backend = {
  available: false,
  project: null,
  lastSimulation: null,
  designEngine: null,
  knowledge: null,
  saveTimer: null,
  savePromise: null,
  pendingSave: null,
  failureCount: 0
};

const threeState = {
  enabled: Boolean(window.THREE && el.twin3d),
  renderer: null,
  scene: null,
  camera: null,
  root: null,
  siteSteelGroup: null,
  coolingSite: null,
  powerSupply: null,
  raycaster: null,
  pointer: null,
  moduleMeshes: new Map(),
  fanMeshes: [],
  pulseMeshes: [],
  coolingFlowMeshes: [],
  orbit: { azimuth: -0.82, elevation: 0.58, distance: 12.2 },
  focus: { x: 0, y: 0.48, z: 0 },
  drag: { active: false, moved: false, x: 0, y: 0 },
  viewport: { width: 0, height: 0 },
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  lastTime: 0,
  lastRenderAt: 0,
  frameId: null,
  inViewport: true,
  observer: null,
  pixelRatio: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function expandCashDraw(base, count) {
  if (count <= 0) return [];
  if (count === base.length) return base;
  if (count === 1) return [1];
  const expanded = [];
  for (let index = 0; index < count; index += 1) {
    const position = index / (count - 1) * (base.length - 1);
    const lower = Math.floor(position);
    const upper = Math.min(lower + 1, base.length - 1);
    const weight = position - lower;
    expanded.push(base[lower] * (1 - weight) + base[upper] * weight);
  }
  const total = expanded.reduce((sum, value) => sum + value, 0) || 1;
  return expanded.map((value) => value / total);
}

function applyRouteState(params = new URLSearchParams(window.location.search)) {
  const tab = params.get("tab");
  const mode = params.get("mode");
  const block = params.get("block");
  const layer = params.get("layer");
  const scenario = params.get("scenario");
  const costScope = params.get("costscope");
  const costBasis = params.get("costunit");
  const costMethod = params.get("build");
  if (validTabs.includes(tab)) state.tab = tab;
  if (validTwinModes.includes(mode)) state.twinMode = mode;
  if (modules.some((item) => item.id === block)) state.selectedId = block;
  if (validInternalLayers.includes(layer)) state.internalLayer = layer;
  if (validScenarios.includes(scenario)) state.scenario = scenario;
  if (validCostScopes.includes(costScope)) state.costScope = costScope;
  if (validCostBases.includes(costBasis)) state.costBasis = costBasis;
  if (validCostMethods.includes(costMethod)) {
    state.costMethod = costMethod;
    state.prefab = constructionMethodProfiles[costMethod].prefabPct;
    state.crew = constructionMethodProfiles[costMethod].crewCount;
  }
  if (powerSourceProfiles[params.get("source")]) state.engine.powerSource = params.get("source");
  if (gasTurbineModels[params.get("gtmodel")]) state.engine.turbineModel = params.get("gtmodel");
  if (reliabilityProfiles[params.get("reliability")]) state.engine.reliability = params.get("reliability");
  if (backupProfiles[params.get("backup")]) state.engine.backup = params.get("backup");
  if (modularSupplyProfiles[params.get("supplier")]) state.engine.supplier = params.get("supplier");
  if (supplyStrategies[params.get("supply")]) state.engine.supplyStrategy = params.get("supply");
  if (supplyShockProfiles[params.get("shock")]) state.engine.supplyShock = params.get("shock");
  if (params.has("mw") && Number.isFinite(Number(params.get("mw")))) state.engine.powerMw = clamp(Number(params.get("mw")), 5, 250);
  if (params.has("reserve") && Number.isFinite(Number(params.get("reserve")))) state.engine.reservePct = clamp(Number(params.get("reserve")), 5, 30);
  if (params.has("gtunit") && Number.isFinite(Number(params.get("gtunit")))) state.engine.turbineUnitMw = clamp(Number(params.get("gtunit")), 5, 100);
  if (params.has("gteff") && Number.isFinite(Number(params.get("gteff")))) state.engine.turbineEfficiencyPct = clamp(Number(params.get("gteff")), 20, 65);
  if (params.has("gtambient") && Number.isFinite(Number(params.get("gtambient")))) state.engine.turbineAmbientC = clamp(Number(params.get("gtambient")), -20, 55);
  if (params.has("gtalt") && Number.isFinite(Number(params.get("gtalt")))) state.engine.turbineAltitudeM = clamp(Number(params.get("gtalt")), 0, 3000);
  if (params.has("week") && Number.isFinite(Number(params.get("week")))) state.week = clamp(Number(params.get("week")), 0, 30);
  state.bridge = state.engine.backup !== "none";
  if (params.has("cutaway")) {
    state.cutaway = !["0", "false", "off", "no"].includes((params.get("cutaway") || "").toLowerCase());
  }
  if (params.has("exploded")) {
    state.exploded = !["0", "false", "off", "no"].includes((params.get("exploded") || "").toLowerCase());
  }
  if (opsFailureProfiles[params.get("failure")]) state.opsFailure = params.get("failure");
}

function syncRouteState() {
  if (!window.history?.replaceState) return;
  const url = new URL(window.location.href);
  url.searchParams.set("tab", state.tab);
  url.searchParams.set("mode", state.twinMode);
  url.searchParams.set("block", state.selectedId);
  url.searchParams.set("layer", state.internalLayer);
  url.searchParams.set("cutaway", state.cutaway === false ? "0" : "1");
  url.searchParams.set("exploded", state.exploded ? "1" : "0");
  url.searchParams.set("failure", state.opsFailure);
  url.searchParams.set("scenario", state.scenario);
  url.searchParams.set("costscope", state.costScope);
  url.searchParams.set("costunit", state.costBasis);
  url.searchParams.set("build", state.costMethod);
  url.searchParams.set("source", state.engine.powerSource);
  url.searchParams.set("mw", String(Math.round(state.engine.powerMw)));
  url.searchParams.set("reserve", String(Math.round(state.engine.reservePct)));
  url.searchParams.set("gtmodel", state.engine.turbineModel);
  url.searchParams.set("gtunit", Number(state.engine.turbineUnitMw).toFixed(1));
  url.searchParams.set("gteff", Number(state.engine.turbineEfficiencyPct).toFixed(1));
  url.searchParams.set("gtambient", String(Math.round(state.engine.turbineAmbientC)));
  url.searchParams.set("gtalt", String(Math.round(state.engine.turbineAltitudeM)));
  url.searchParams.set("week", String(Math.round(state.week)));
  url.searchParams.set("reliability", state.engine.reliability);
  url.searchParams.set("backup", state.engine.backup);
  url.searchParams.set("supplier", state.engine.supplier);
  url.searchParams.set("supply", state.engine.supplyStrategy);
  url.searchParams.set("shock", state.engine.supplyShock);
  window.history.replaceState({ powerTwinRoute: true }, "", url);
}

function beginRouteTransition() {
  if (!window.history?.pushState) return;
  window.history.pushState({ powerTwinRoute: true }, "", window.location.href);
}

function scenarioValues() {
  const values = {
    baseline: { utilityDelay: 0, factoryBoost: 0, name: "Baseline" },
    utilitySlip: { utilityDelay: 5, factoryBoost: 0, name: "Utility slip" },
    accelerated: { utilityDelay: 0, factoryBoost: 3, name: "Fast track" }
  };
  return values[state.scenario];
}

function datesForConfiguration(block, crew = state.crew, prefab = state.prefab) {
  const s = scenarioValues();
  const crewBoost = Math.max(0, crew - 3);
  const prefabBoost = Math.floor((prefab - 35) / 16);
  const deliveryBoost = s.factoryBoost + Math.floor((crewBoost + prefabBoost) / 2);
  const designDone = block.design + 4;
  const procureDone = block.procure + 6 - Math.floor(s.factoryBoost / 2);
  const buildDone = block.build + 7 - deliveryBoost;
  const feederReady = feeders[block.feeder].base + s.utilityDelay + block.offset;
  const powerReady = state.bridge ? feederReady - 2 : feederReady;
  const energize = Math.max(buildDone, powerReady);
  const load = energize + (state.bridge ? 1 : 2);

  return { designDone, procureDone, buildDone, feederReady, powerReady, energize, load };
}

function datesFor(block) {
  return datesForConfiguration(block);
}

function statusFor(block) {
  const d = datesFor(block);
  if (state.week >= d.load) return "loaded";
  if (state.week >= d.energize) return "energized";
  if (state.week >= d.buildDone && state.week < d.powerReady) return "power-hold";
  if (state.week >= block.build) return "build";
  if (state.week >= block.procure) return "procure";
  return "design";
}

function statusLabel(status) {
  return {
    loaded: "Loaded",
    energized: "Energized",
    "power-hold": "Power hold",
    build: "Build",
    procure: "Procure",
    design: "Design"
  }[status];
}

function statusColor(status) {
  return colorByStatus[status] || "#8b939d";
}

function buildConstructionStages(block) {
  const d = datesFor(block);
  const startWeek = Math.max(0, block.design);
  const endWeek = Math.max(startWeek + 13, d.load);
  const defs = [
    ["designFreeze", "setout", "Design freeze", "IFC package"],
    ["sitePrep", "setout", "Site prep", "Grading + SWPPP"],
    ["foundation", "foundation", "Foundations", "Anchor survey"],
    ["steelFab", "foundation", "Steel fab", "Shop release"],
    ["moduleAssembly", "assembly", "Module assembly", "QA release"],
    ["moduleDelivery", "assembly", "Module delivery", "Crane window"],
    ["structErect", "assembly", "Struct erection", "Steel torque"],
    ["mepInstall", "mep", "Elec + cooling", "800V + liquid close"],
    ["fitOut", "mep", "Data-hall fit-out", "Containment"],
    ["energize", "mep", "Energization", "DC close"],
    ["commission", "commissioning", "Commissioning", "IST + load bank"],
    ["gpuInstall", "commissioning", "GPU install", "Rack energize"],
    ["rfs", "commissioning", "Ready for service", "Handover"]
  ];
  const span = endWeek - startWeek;
  return defs.map(([key, visualKey, label, gate], index) => {
    const start = startWeek + Math.floor((index * span) / defs.length);
    const end = startWeek + Math.floor(((index + 1) * span) / defs.length);
    return {
      key,
      visualKey,
      label,
      gate,
      start: clamp(start, 0, 30),
      end: clamp(Math.max(start + 1, end), 1, 30)
    };
  });
}

function constructionValues(block) {
  const dates = datesFor(block);
  const startWeek = Math.max(0, block.design);
  const stages = buildConstructionStages(block);
  const complete = state.week >= dates.load;
  let activeStageIndex = stages.findIndex((stage) => state.week < stage.end);
  if (activeStageIndex < 0) activeStageIndex = stages.length - 1;
  const activeStageRaw = stages[activeStageIndex];
  const activeStage = { ...activeStageRaw, key: activeStageRaw.visualKey };
  const stageProgressPct = complete
    ? 100
    : clamp(((state.week - activeStageRaw.start) / Math.max(1, activeStageRaw.end - activeStageRaw.start)) * 100, 0, 100);
  const progressPct = clamp(((state.week - startWeek) / Math.max(1, dates.load - startWeek)) * 100, 0, 100);
  return {
    stages,
    activeStageIndex,
    activeStage,
    activeStageRaw,
    complete,
    progressPct,
    stageProgressPct,
    readyWeek: dates.load,
    liftWeek: block.build + 1,
    crewCount: state.crew,
    prefabPct: state.prefab,
    nextGate: complete ? "As-built handover" : activeStageRaw.gate,
    installMethod: state.prefab >= 70 ? "High-prefab crane set" : state.prefab >= 50 ? "Hybrid prefab set" : "Field-intensive assembly"
  };
}

function modulePosition(block) {
  const col = Number(block.id.split("-")[1]) - 1;
  const rowIndex = block.row - 1;
  return {
    x: -4.65 + col * 3.1,
    y: 0.42,
    z: -2.55 + rowIndex * 2.25
  };
}

function makeMaterial(color, options = {}) {
  const THREE = window.THREE;
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.62,
    metalness: options.metalness ?? 0.34,
    emissive: options.emissive ?? "#000000",
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    wireframe: options.wireframe ?? false
  });
}

function makeBox(width, height, depth, material, position, blockId) {
  const THREE = window.THREE;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(position.x, position.y, position.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (blockId) mesh.userData.blockId = blockId;
  return mesh;
}

function makeLine(points, color, opacity = 1) {
  const THREE = window.THREE;
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
  const material = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
  return new THREE.Line(geometry, material);
}

function makePipe(start, end, color, radius = 0.035) {
  const THREE = window.THREE;
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const direction = b.clone().sub(a);
  const pipe = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 16),
    makeMaterial(color, { emissive: color, emissiveIntensity: 0.18, metalness: 0.1, roughness: 0.38 })
  );
  pipe.position.copy(mid);
  pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return pipe;
}

function tagInternalLayer(object, blockId, layer) {
  if (!object) return object;
  if (blockId) object.userData.blockId = blockId;
  object.userData.internalLayer = layer;
  return object;
}

function markModeControlled(object) {
  if (object) object.userData.modeControlled = true;
  return object;
}

function addSteelFrame(group, blockId) {
  const steel = makeMaterial("#7f878d", { metalness: 0.72, roughness: 0.28 });
  const nodeSteel = makeMaterial("#a3aab0", { metalness: 0.8, roughness: 0.2 });
  const connector = makeMaterial("#d9a441", { emissive: "#d9a441", emissiveIntensity: 0.16, metalness: 0.68, roughness: 0.2 });
  const brace = "#9aa3aa";
  const beam = (width, height, depth, position) => {
    group.add(makeBox(width, height, depth, steel, position, blockId));
  };

  [-1.32, 1.32].forEach((x) => {
    [-0.92, 0.92].forEach((z) => {
      beam(0.08, 1.55, 0.08, { x, y: 0.88, z });
      group.add(makeBox(0.22, 0.035, 0.22, nodeSteel, { x, y: 0.1, z }, blockId));
      group.add(makeBox(0.16, 0.12, 0.16, connector, { x, y: 1.69, z }, blockId));
    });
  });

  [-0.92, 0.92].forEach((z) => {
    beam(2.72, 0.08, 0.08, { x: 0, y: 1.68, z });
    beam(2.72, 0.08, 0.08, { x: 0, y: 0.15, z });
  });

  [-1.32, 1.32].forEach((x) => {
    beam(0.08, 0.08, 1.92, { x, y: 1.68, z: 0 });
    beam(0.08, 0.08, 1.92, { x, y: 0.15, z: 0 });
  });

  [-0.66, 0, 0.66].forEach((x) => beam(0.045, 0.045, 1.88, { x, y: 1.66, z: 0 }));
  [-1.18, 1.18].forEach((x) => {
    [-0.965, 0.965].forEach((z) => {
      group.add(makeBox(0.2, 0.2, 0.024, nodeSteel, { x, y: 1.52, z }, blockId));
    });
  });

  group.add(makePipe([-1.32, 0.2, 0.94], [1.32, 1.62, 0.94], brace, 0.025));
  group.add(makePipe([1.32, 0.2, -0.94], [-1.32, 1.62, -0.94], brace, 0.025));
  group.add(makePipe([-1.34, 0.2, -0.92], [-1.34, 1.62, 0.92], brace, 0.022));
  group.add(makePipe([1.34, 0.2, 0.92], [1.34, 1.62, -0.92], brace, 0.022));
}

function addConstructionDetails(group, block) {
  const THREE = window.THREE;
  const constructionGroup = new THREE.Group();
  constructionGroup.userData.blockId = block.id;
  const stageObjects = {
    setout: [],
    foundation: [],
    assembly: [],
    mep: [],
    commissioning: []
  };
  const add = (object, stage, role = stage, layer = "construction") => {
    tagInternalLayer(object, block.id, layer);
    markModeControlled(object);
    object.userData.constructionStage = stage;
    object.userData.constructionRole = role;
    stageObjects[stage].push(object);
    constructionGroup.add(object);
    return object;
  };
  const yellow = "#f5c766";
  const amber = "#dd9d3f";

  const surveyLines = [
    [[-1.48, 0.045, -1.08], [1.48, 0.045, -1.08], [1.48, 0.045, 1.08], [-1.48, 0.045, 1.08], [-1.48, 0.045, -1.08]],
    [[-1.48, 0.047, 0], [1.48, 0.047, 0]],
    [[0, 0.047, -1.08], [0, 0.047, 1.08]]
  ];
  surveyLines.forEach((points) => add(makeLine(points, yellow, 0.82), "setout", "survey-grid"));
  add(makeBox(
    0.86,
    0.035,
    1.48,
    makeMaterial(yellow, { transparent: true, opacity: 0.18, emissive: yellow, emissiveIntensity: 0.2, roughness: 0.72 }),
    { x: -1.86, y: 0.035, z: 0 },
    block.id
  ), "setout", "laydown-zone");

  [-1.18, 1.18].forEach((x) => {
    [-0.78, 0.78].forEach((z) => {
      const cage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.54, 10, 1, true),
        makeMaterial(yellow, { transparent: true, opacity: 0.7, emissive: yellow, emissiveIntensity: 0.34, metalness: 0.46, roughness: 0.28, wireframe: true })
      );
      cage.position.set(x, -0.12, z);
      add(cage, "foundation", "anchor-cage");
      add(makePipe([x - 0.13, 0.08, z], [x + 0.13, 0.08, z], yellow, 0.012), "foundation", "anchor-datum");
      add(makePipe([x, 0.08, z - 0.13], [x, 0.08, z + 0.13], yellow, 0.012), "foundation", "anchor-datum");
    });
  });

  [
    [[-1.34, 0.18, 1.02], [-0.54, 1.58, 1.02]],
    [[1.34, 0.18, 1.02], [0.54, 1.58, 1.02]],
    [[-1.34, 0.18, -1.02], [-0.54, 1.58, -1.02]],
    [[1.34, 0.18, -1.02], [0.54, 1.58, -1.02]]
  ].forEach(([start, end]) => add(makePipe(start, end, amber, 0.024), "assembly", "temporary-brace"));
  [-1.08, 1.08].forEach((x) => {
    [-0.72, 0.72].forEach((z) => {
      const lug = new THREE.Mesh(
        new THREE.TorusGeometry(0.065, 0.014, 8, 24),
        makeMaterial(yellow, { emissive: yellow, emissiveIntensity: 0.58, metalness: 0.62, roughness: 0.2 })
      );
      lug.rotation.x = Math.PI / 2;
      lug.position.set(x, 1.82, z);
      add(lug, "assembly", "lifting-lug");
    });
  });
  add(makeBox(0.34, 0.08, 0.34, makeMaterial("#6d747d", { metalness: 0.54, roughness: 0.36 }), { x: 1.82, y: 0.08, z: -1.24 }, block.id), "assembly", "crane-base");
  add(makePipe([1.82, 0.12, -1.24], [1.82, 2.86, -1.24], yellow, 0.052), "assembly", "crane-mast");
  add(makePipe([1.82, 2.83, -1.24], [-0.48, 2.83, -0.08], yellow, 0.038), "assembly", "crane-boom");
  add(makePipe([-0.05, 2.61, -0.29], [-0.05, 2.08, -0.29], "#d9dde0", 0.009), "assembly", "crane-cable");
  const hookBlock = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 14, 14),
    makeMaterial(amber, { emissive: amber, emissiveIntensity: 0.64, metalness: 0.54, roughness: 0.24 })
  );
  hookBlock.position.set(-0.05, 2.02, -0.29);
  hookBlock.userData.baseY = 2.02;
  add(hookBlock, "assembly", "crane-hook");
  const liftGhost = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.38, 0.54, 1.58)),
    new THREE.LineBasicMaterial({ color: yellow, transparent: true, opacity: 0.5 })
  );
  liftGhost.position.set(-0.05, 2.02, -0.29);
  liftGhost.userData.baseY = 2.02;
  add(liftGhost, "assembly", "lifted-module");

  add(makePipe([-1.58, 0.2, -0.56], [-1.14, 0.2, -0.56], "#ff8a3d", 0.038), "mep", "800v-pull");
  add(makePipe([-1.58, 0.28, 0.56], [-1.14, 0.28, 0.56], "#36d7c8", 0.032), "mep", "liquid-connect");
  const cableReel = new THREE.Mesh(
    new THREE.TorusGeometry(0.19, 0.035, 10, 28),
    makeMaterial("#ff8a3d", { emissive: "#ff8a3d", emissiveIntensity: 0.38, metalness: 0.5, roughness: 0.28 })
  );
  cableReel.rotation.y = Math.PI / 2;
  cableReel.position.set(-1.68, 0.23, -0.56);
  add(cableReel, "mep", "cable-reel");

  add(makeBox(
    0.72,
    0.62,
    0.46,
    makeMaterial("#263036", { emissive: "#dd7344", emissiveIntensity: 0.36, metalness: 0.48, roughness: 0.3 }),
    { x: 1.72, y: 0.35, z: 0.52 },
    block.id
  ), "commissioning", "load-bank");
  [-0.9, -0.3, 0.3, 0.9].forEach((x) => {
    add(makePipe([x, 0.06, 1.1], [x, 0.48, 1.1], yellow, 0.018), "commissioning", "barricade-post");
  });
  add(makePipe([-0.9, 0.42, 1.1], [0.9, 0.42, 1.1], yellow, 0.014), "commissioning", "barricade-rail");
  const testBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 14, 14),
    makeMaterial("#2aa876", { emissive: "#2aa876", emissiveIntensity: 1.25, metalness: 0.08, roughness: 0.24 })
  );
  testBeacon.position.set(1.72, 0.72, 0.52);
  add(testBeacon, "commissioning", "test-beacon");

  constructionGroup.visible = false;
  group.add(constructionGroup);
  return { group: constructionGroup, stageObjects, liftGhost, hookBlock, testBeacon };
}

function addRackCabinet(group, x, z, blockId, rackVisualIndex) {
  const childStart = group.children.length;
  const rack = tagInternalLayer(makeBox(0.42, 1.02, 0.56, makeMaterial("#141a1f", { metalness: 0.48, roughness: 0.36 }), { x, y: 0.72, z }, blockId), blockId, "structure");
  const front = tagInternalLayer(makeBox(0.34, 0.74, 0.035, makeMaterial("#071217", { emissive: "#2d6bff", emissiveIntensity: 0.42, metalness: 0.1 }), { x, y: 0.72, z: z + 0.298 }, blockId), blockId, "compute");
  const powerShelf = tagInternalLayer(makeBox(0.32, 0.1, 0.045, makeMaterial("#dd7344", { emissive: "#dd7344", emissiveIntensity: 0.5, metalness: 0.25 }), { x, y: 1.1, z: z + 0.322 }, blockId), blockId, "power");
  const rearDcSidecar = tagInternalLayer(makeBox(0.34, 0.68, 0.045, makeMaterial("#28150c", { emissive: "#ff8a3d", emissiveIntensity: 0.36, metalness: 0.22 }), { x, y: 0.74, z: z - 0.302 }, blockId), blockId, "power");
  const coldPlateBus = tagInternalLayer(makeBox(0.03, 0.82, 0.034, makeMaterial("#36d7c8", { emissive: "#36d7c8", emissiveIntensity: 0.45, metalness: 0.12 }), { x: x - 0.16, y: 0.74, z: z + 0.324 }, blockId), blockId, "cooling");
  const fiberPort = tagInternalLayer(makeBox(0.2, 0.06, 0.04, makeMaterial("#7c6dff", { emissive: "#7c6dff", emissiveIntensity: 0.62, metalness: 0.05 }), { x, y: 0.42, z: z + 0.326 }, blockId), blockId, "network");
  group.add(rack);
  group.add(front);
  group.add(powerShelf);
  group.add(rearDcSidecar);
  group.add(coldPlateBus);
  group.add(fiberPort);

  const railMaterial = makeMaterial("#77828a", { metalness: 0.68, roughness: 0.24 });
  const handleMaterial = makeMaterial("#a9b0b5", { metalness: 0.74, roughness: 0.18 });
  const trayMaterials = [
    makeMaterial("#26343e", { emissive: "#2d6bff", emissiveIntensity: 0.17, metalness: 0.28, roughness: 0.3 }),
    makeMaterial("#293b3d", { emissive: "#36d7c8", emissiveIntensity: 0.15, metalness: 0.28, roughness: 0.3 })
  ];
  const ledMaterials = [
    makeMaterial("#2aa876", { emissive: "#2aa876", emissiveIntensity: 0.9, metalness: 0.05 }),
    makeMaterial("#d9a441", { emissive: "#d9a441", emissiveIntensity: 0.9, metalness: 0.05 })
  ];
  const breakerMaterial = makeMaterial("#5b321b", { emissive: "#ff8a3d", emissiveIntensity: 0.24, metalness: 0.42, roughness: 0.26 });
  [-0.17, 0.17].forEach((dx) => {
    group.add(tagInternalLayer(makeBox(0.018, 0.86, 0.025, railMaterial, { x: x + dx, y: 0.73, z: z + 0.34 }, blockId), blockId, "structure"));
  });
  group.add(tagInternalLayer(makeBox(0.25, 0.055, 0.026, makeMaterial("#14252b", { emissive: "#2aa876", emissiveIntensity: 0.28 }), { x, y: 1.15, z: z + 0.342 }, blockId), blockId, "telemetry"));

  for (let i = 0; i < 8; i += 1) {
    const y = 0.32 + i * 0.105;
    group.add(tagInternalLayer(makeBox(0.31, 0.052, 0.028, trayMaterials[i % 2], { x, y, z: z + 0.337 }, blockId), blockId, "compute"));
    group.add(tagInternalLayer(makeBox(0.11, 0.008, 0.012, handleMaterial, { x: x + 0.03, y, z: z + 0.358 }, blockId), blockId, "compute"));
    group.add(tagInternalLayer(makeBox(0.014, 0.014, 0.014, ledMaterials[i % 3 ? 0 : 1], { x: x - 0.125, y, z: z + 0.359 }, blockId), blockId, "telemetry"));
  }

  for (let i = 0; i < 4; i += 1) {
    const y = 0.46 + i * 0.16;
    group.add(tagInternalLayer(makeBox(0.25, 0.025, 0.018, breakerMaterial, { x, y, z: z - 0.334 }, blockId), blockId, "power"));
  }
  return group.children.slice(childStart).map((object) => {
    object.userData.rackVisualIndex = rackVisualIndex;
    return object;
  });
}

function addInternalDataCenterDetails(group, blockId) {
  const THREE = window.THREE;
  const interiorGroup = new THREE.Group();
  interiorGroup.userData.blockId = blockId;
  const layerObjects = Object.fromEntries(gpuDetailLayerKeys.map((layer) => [layer, []]));
  const add = (object, layer) => {
    tagInternalLayer(object, blockId, layer);
    layerObjects[layer]?.push(object);
    interiorGroup.add(object);
    return object;
  };
  const addPipe = (start, end, color, radius, layer) => add(makePipe(start, end, color, radius), layer);
  const addSphere = (x, y, z, color, radius, layer, options = {}) => {
    const sensor = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 14, 14),
      makeMaterial(color, {
        transparent: true,
        opacity: options.opacity ?? 0.86,
        emissive: color,
        emissiveIntensity: options.emissiveIntensity ?? 0.9,
        metalness: options.metalness ?? 0.08,
        roughness: options.roughness ?? 0.3
      })
    );
    sensor.position.set(x, y, z);
    return add(sensor, layer);
  };
  const addCoolingCoupling = (x, y, z, color, axis = "y", scale = 1) => {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032 * scale, 0.032 * scale, 0.09 * scale, 18),
      makeMaterial(color, { emissive: color, emissiveIntensity: 0.5, metalness: 0.54, roughness: 0.2 })
    );
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.04 * scale, 0.009 * scale, 8, 24),
      makeMaterial("#d9a441", { emissive: "#d9a441", emissiveIntensity: 0.22, metalness: 0.78, roughness: 0.18 })
    );
    if (axis === "x") {
      body.rotation.z = Math.PI / 2;
      collar.rotation.y = Math.PI / 2;
    } else if (axis === "z") {
      body.rotation.x = Math.PI / 2;
    } else {
      collar.rotation.x = Math.PI / 2;
    }
    body.position.set(x, y, z);
    collar.position.set(x, y, z);
    body.userData.coolingRole = "quick-connect";
    collar.userData.coolingRole = "quick-connect";
    add(body, "cooling");
    add(collar, "cooling");
    return [body, collar];
  };
  const coolingFlowMarkers = [];
  const addCoolingFlowMarker = (start, end, color, offset) => {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.036, 14, 14),
      makeMaterial(color, { transparent: true, opacity: 0, emissive: color, emissiveIntensity: 1.35, metalness: 0.04, roughness: 0.2 })
    );
    marker.position.set(...start);
    marker.userData.flowStart = new THREE.Vector3(...start);
    marker.userData.flowEnd = new THREE.Vector3(...end);
    marker.userData.flowOffset = offset;
    markModeControlled(marker);
    add(marker, "cooling");
    coolingFlowMarkers.push(marker);
    return marker;
  };

  const coldAisle = makeBox(
    2.52,
    0.012,
    0.42,
    makeMaterial("#123548", { transparent: true, opacity: 0.42, emissive: "#36d7c8", emissiveIntensity: 0.18, metalness: 0.02 }),
    { x: 0, y: 0.116, z: 0.42 },
    blockId
  );
  tagInternalLayer(coldAisle, blockId, "cooling");
  const hotAisle = makeBox(
    2.52,
    0.012,
    0.42,
    makeMaterial("#412012", { transparent: true, opacity: 0.42, emissive: "#ff8a3d", emissiveIntensity: 0.18, metalness: 0.02 }),
    { x: 0, y: 0.118, z: -0.48 },
    blockId
  );
  tagInternalLayer(hotAisle, blockId, "cooling");
  const serviceWalk = makeBox(
    0.36,
    0.014,
    1.86,
    makeMaterial("#2c3034", { transparent: true, opacity: 0.55, metalness: 0.04, roughness: 0.7 }),
    { x: 1.12, y: 0.12, z: 0 },
    blockId
  );
  tagInternalLayer(serviceWalk, blockId, "structure");
  add(coldAisle, "cooling");
  add(hotAisle, "cooling");
  add(serviceWalk, "structure");

  const containmentPanels = [];
  [-0.98, 0.98].forEach((x) => {
    const panel = makeBox(
      0.035,
      1.18,
      1.34,
      makeMaterial("#84d8ff", { transparent: true, opacity: 0.16, emissive: "#2d6bff", emissiveIntensity: 0.12, metalness: 0.01, roughness: 0.24 }),
      { x, y: 0.82, z: 0.14 },
      blockId
    );
    add(panel, "cooling");
    containmentPanels.push(panel);
  });

  const buswayTaps = [];
  const powerShelves = [];
  const rectifierTap = add(makeBox(
    0.46,
    0.34,
    0.24,
    makeMaterial("#26150b", { emissive: "#ff8a3d", emissiveIntensity: 0.34, metalness: 0.42, roughness: 0.3 }),
    { x: -1.08, y: 1.14, z: -0.72 },
    blockId
  ), "power");
  powerShelves.push(rectifierTap);
  const rear800vBus = add(makeBox(
    2.22,
    0.07,
    0.08,
    makeMaterial("#ff8a3d", { emissive: "#ff8a3d", emissiveIntensity: 0.55, metalness: 0.34, roughness: 0.22 }),
    { x: 0, y: 1.43, z: -0.82 },
    blockId
  ), "power");
  powerShelves.push(rear800vBus);
  addPipe([-1.24, 1.88, -0.92], [-1.08, 1.3, -0.72], "#d9a441", 0.028, "power");
  [0.72, 0.92, 1.12, 1.32].forEach((y, index) => {
    const cell = add(makeBox(
      0.16,
      0.12,
      0.18,
      makeMaterial(index % 2 ? "#1b3024" : "#17251f", { emissive: "#2aa876", emissiveIntensity: 0.26, metalness: 0.18, roughness: 0.34 }),
      { x: 1.12, y, z: -0.74 },
      blockId
    ), "power");
    powerShelves.push(cell);
  });
  [-0.72, -0.24, 0.24, 0.72].forEach((x) => {
    const sidecarTap = addPipe([x, 1.74, -0.78], [x, 1.1, -0.42], "#ff8a3d", 0.022, "power");
    [-0.07, 0.07].forEach((dx) => {
      const breaker = add(makeBox(
        0.06,
        0.11,
        0.045,
        makeMaterial("#30170a", { emissive: "#ff8a3d", emissiveIntensity: 0.42, metalness: 0.24, roughness: 0.28 }),
        { x: x + dx, y: 1.24, z: -0.55 },
        blockId
      ), "power");
      powerShelves.push(breaker);
    });
    const liveSwapHandle = add(makeBox(
      0.16,
      0.025,
      0.035,
      makeMaterial("#f5c766", { emissive: "#d9a441", emissiveIntensity: 0.36, metalness: 0.52, roughness: 0.18 }),
      { x, y: 0.48, z: -0.61 },
      blockId
    ), "power");
    powerShelves.push(liveSwapHandle);
    buswayTaps.push(sidecarTap);
  });

  const cableTray = makeBox(
    2.42,
    0.045,
    0.18,
    makeMaterial("#6d747d", { transparent: true, opacity: 0.78, metalness: 0.58, roughness: 0.28 }),
    { x: 0, y: 1.9, z: 0.18 },
    blockId
  );
  add(cableTray, "network");
  [-1.04, -0.7, -0.36, -0.02, 0.32, 0.66, 1].forEach((x) => {
    add(makeBox(0.035, 0.04, 0.26, makeMaterial("#8b939d", { metalness: 0.45, roughness: 0.32 }), { x, y: 1.93, z: 0.18 }, blockId), "network");
  });

  const fiberLines = [];
  [-0.09, 0.02, 0.13].forEach((z, index) => {
    const fiber = addPipe([-1.1, 1.96, z], [1.1, 1.96, z + 0.08], index === 1 ? "#7c6dff" : "#2d6bff", 0.012, "network");
    fiberLines.push(fiber);
  });

  const cduSkid = makeBox(
    0.48,
    0.66,
    0.62,
    makeMaterial("#172126", { emissive: "#36d7c8", emissiveIntensity: 0.16, metalness: 0.42, roughness: 0.36 }),
    { x: -1.1, y: 0.5, z: 0.72 },
    blockId
  );
  add(cduSkid, "cooling");
  const cduDetails = [];
  const cduDripTray = add(makeBox(
    0.56,
    0.025,
    0.68,
    makeMaterial("#607078", { metalness: 0.7, roughness: 0.24 }),
    { x: -1.1, y: 0.17, z: 0.72 },
    blockId
  ), "cooling");
  cduDetails.push(cduDripTray);
  for (let plate = 0; plate < 7; plate += 1) {
    cduDetails.push(add(makeBox(
      0.3,
      0.022,
      0.028,
      makeMaterial(plate % 2 ? "#93a6ad" : "#5d727a", { metalness: 0.72, roughness: 0.22 }),
      { x: -1.1, y: 0.3 + plate * 0.065, z: 0.395 },
      blockId
    ), "cooling"));
  }
  const expansionTank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.085, 0.34, 20),
    makeMaterial("#315f63", { emissive: "#36d7c8", emissiveIntensity: 0.2, metalness: 0.48, roughness: 0.28 })
  );
  expansionTank.position.set(-0.92, 0.61, 0.75);
  add(expansionTank, "cooling");
  cduDetails.push(expansionTank);
  [-1.2, -1.04].forEach((x, index) => {
    const gauge = addSphere(x, 0.76, 0.395, index ? "#2d6bff" : "#36d7c8", 0.036, "cooling", { emissiveIntensity: 0.5, metalness: 0.3 });
    gauge.scale.set(1, 1, 0.38);
    cduDetails.push(gauge);
  });
  const cduPumps = [];
  [-1.22, -1.08].forEach((x, index) => {
    const pump = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.28, 18),
      makeMaterial("#36d7c8", { transparent: true, opacity: 0.82, emissive: "#36d7c8", emissiveIntensity: 0.62, metalness: 0.22 })
    );
    pump.rotation.z = Math.PI / 2;
    pump.position.set(x, 0.48 + index * 0.12, 0.72);
    add(pump, "cooling");
    cduPumps.push(pump);
  });

  const coolingDock = [];
  coolingDock.push(add(makeBox(
    0.045,
    0.44,
    0.34,
    makeMaterial("#5e6970", { metalness: 0.74, roughness: 0.23 }),
    { x: -1.315, y: 0.66, z: 0.72 },
    blockId
  ), "cooling"));
  coolingDock.push(...addCoolingCoupling(-1.35, 0.76, 0.8, "#36d7c8", "x", 1.12));
  coolingDock.push(...addCoolingCoupling(-1.35, 0.56, 0.64, "#2d6bff", "x", 1.12));
  coolingDock.push(addPipe([-1.34, 0.76, 0.8], [-1.12, 0.76, 0.8], "#36d7c8", 0.022, "cooling"));
  coolingDock.push(addPipe([-1.34, 0.56, 0.64], [-1.12, 0.56, 0.64], "#2d6bff", 0.022, "cooling"));

  const supplyManifold = addPipe([-1.12, 1.02, 0.72], [1.08, 1.02, 0.72], "#36d7c8", 0.026, "cooling");
  const returnManifold = addPipe([-1.12, 0.92, 0.58], [1.08, 0.92, 0.58], "#2d6bff", 0.024, "cooling");
  addPipe([-1.12, 0.76, 0.8], [-1.12, 1.02, 0.72], "#36d7c8", 0.022, "cooling");
  addPipe([-1.12, 0.56, 0.64], [-1.12, 0.92, 0.58], "#2d6bff", 0.022, "cooling");
  addCoolingFlowMarker([-1.04, 1.02, 0.72], [1.02, 1.02, 0.72], "#36d7c8", 0.08);
  addCoolingFlowMarker([1.02, 0.92, 0.58], [-1.04, 0.92, 0.58], "#2d6bff", 0.58);

  const gpuTrayMeshes = [];
  const nvlinkSpines = [];
  const networkNodes = [];
  const coolingRails = [supplyManifold, returnManifold];
  [-0.72, -0.24, 0.24, 0.72].forEach((x, rackIndex) => {
    const graceCpu = add(makeBox(
      0.13,
      0.055,
      0.032,
      makeMaterial("#52e6c7", { emissive: "#36d7c8", emissiveIntensity: 0.8, metalness: 0.32, roughness: 0.16 }),
      { x, y: 1.18, z: 0.18 },
      blockId
    ), "compute");
    gpuTrayMeshes.push(graceCpu);

    const nvSwitch = add(makeBox(
      0.045,
      0.74,
      0.034,
      makeMaterial("#7c6dff", { emissive: "#7c6dff", emissiveIntensity: 0.78, metalness: 0.18, roughness: 0.24 }),
      { x: x + 0.17, y: 0.76, z: 0.18 },
      blockId
    ), "network");
    nvlinkSpines.push(nvSwitch);

    const torSwitch = add(makeBox(
      0.32,
      0.055,
      0.055,
      makeMaterial("#191833", { emissive: "#7c6dff", emissiveIntensity: 0.6, metalness: 0.18, roughness: 0.28 }),
      { x, y: 1.33, z: 0.24 },
      blockId
    ), "network");
    networkNodes.push(torSwitch);

    const nicDpu = add(makeBox(
      0.18,
      0.04,
      0.04,
      makeMaterial("#27204a", { emissive: "#7c6dff", emissiveIntensity: 0.56, metalness: 0.16, roughness: 0.24 }),
      { x, y: 0.3, z: 0.24 },
      blockId
    ), "network");
    networkNodes.push(nicDpu);

    const rackSupply = addPipe([x - 0.18, 1.02, 0.66], [x - 0.18, 0.32, 0.24], "#36d7c8", 0.012, "cooling");
    const rackReturn = addPipe([x - 0.11, 0.92, 0.55], [x - 0.11, 0.32, 0.13], "#2d6bff", 0.011, "cooling");
    addCoolingCoupling(x - 0.18, 0.98, 0.66, "#36d7c8", "y", 0.72);
    addCoolingCoupling(x - 0.11, 0.88, 0.55, "#2d6bff", "y", 0.68);
    coolingRails.push(rackSupply, rackReturn);

    for (let tray = 0; tray < 6; tray += 1) {
      const y = 0.38 + tray * 0.12;
      const sled = add(makeBox(
        0.31,
        0.018,
        0.13,
        makeMaterial("#202b34", { emissive: tray % 2 ? "#2d6bff" : "#36d7c8", emissiveIntensity: 0.18, metalness: 0.32, roughness: 0.24 }),
        { x, y, z: 0.12 },
        blockId
      ), "compute");
      gpuTrayMeshes.push(sled);

      [-0.08, 0.04].forEach((dx, lane) => {
        const gpu = add(makeBox(
          0.065,
          0.03,
          0.022,
          makeMaterial("#2d6bff", { emissive: "#2d6bff", emissiveIntensity: 0.74, metalness: 0.34, roughness: 0.16 }),
          { x: x + dx, y: y + 0.026, z: 0.19 },
          blockId
        ), "compute");
        gpu.userData.flowOffset = (rackIndex + tray + lane) / 12;
        gpuTrayMeshes.push(gpu);
        [-0.035, 0.035].forEach((hbmDx) => {
          gpuTrayMeshes.push(add(makeBox(
            0.018,
            0.018,
            0.012,
            makeMaterial("#36d7c8", { emissive: "#36d7c8", emissiveIntensity: 0.55, metalness: 0.26, roughness: 0.18 }),
            { x: x + dx + hbmDx, y: y + 0.055, z: 0.204 },
            blockId
          ), "compute"));
        });
      });

      const coldPlate = add(makeBox(
        0.25,
        0.012,
        0.018,
        makeMaterial("#36d7c8", { transparent: true, opacity: 0.72, emissive: "#36d7c8", emissiveIntensity: 0.58, metalness: 0.16, roughness: 0.18 }),
        { x: x - 0.025, y: y + 0.07, z: 0.22 },
        blockId
      ), "cooling");
      coolingRails.push(coldPlate);
    }
  });

  const sensorNodes = [];
  [
    [-1.22, 1.48, 0.82, "#36d7c8"],
    [1.18, 1.48, 0.82, "#36d7c8"],
    [-1.18, 1.48, -0.82, "#d9a441"],
    [1.18, 1.48, -0.82, "#d9a441"],
    [0, 1.86, 0.18, "#7c6dff"]
  ].forEach(([x, y, z, color]) => {
    const sensor = addSphere(x, y, z, color, 0.045, "telemetry");
    sensorNodes.push(sensor);
  });
  const bmsPanel = add(makeBox(
    0.24,
    0.42,
    0.05,
    makeMaterial("#10241e", { emissive: "#2aa876", emissiveIntensity: 0.34, metalness: 0.18, roughness: 0.28 }),
    { x: 1.23, y: 1.18, z: -0.58 },
    blockId
  ), "telemetry");
  sensorNodes.push(bmsPanel);
  addPipe([1.1, 1.38, -0.58], [-1.1, 1.38, -0.58], "#2aa876", 0.01, "telemetry");
  [-0.78, -0.26, 0.26, 0.78].forEach((x) => sensorNodes.push(addSphere(x, 0.21, -0.56, "#2aa876", 0.026, "telemetry", { emissiveIntensity: 0.74 })));

  const safetyPipe = addPipe([-1.24, 1.84, 0.92], [1.24, 1.84, 0.92], "#dd3f32", 0.017, "safety");
  const safetyNozzles = [];
  [-0.84, -0.28, 0.28, 0.84].forEach((x) => {
    const nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.11, 16),
      makeMaterial("#dd3f32", { transparent: true, opacity: 0.88, emissive: "#dd3f32", emissiveIntensity: 0.4, metalness: 0.25 })
    );
    nozzle.rotation.x = Math.PI;
    nozzle.position.set(x, 1.77, 0.92);
    add(nozzle, "safety");
    safetyNozzles.push(nozzle);
  });
  const vesdaRail = addPipe([-1.18, 1.82, -0.84], [1.18, 1.82, -0.84], "#dd3f32", 0.011, "safety");
  safetyNozzles.push(vesdaRail);

  const accessDoor = add(makeBox(0.34, 0.72, 0.035, makeMaterial("#0d1115", { emissive: "#2aa876", emissiveIntensity: 0.2, metalness: 0.28 }), { x: 1.38, y: 0.68, z: 0.48 }, blockId), "safety");
  const badgeReader = add(makeBox(0.055, 0.12, 0.045, makeMaterial("#2aa876", { emissive: "#2aa876", emissiveIntensity: 0.9, metalness: 0.05 }), { x: 1.36, y: 0.76, z: 0.28 }, blockId), "safety");
  const eStop = add(makeBox(0.055, 0.055, 0.045, makeMaterial("#dd3f32", { emissive: "#dd3f32", emissiveIntensity: 1.1, metalness: 0.06 }), { x: 1.36, y: 0.58, z: 0.28 }, blockId), "safety");
  safetyNozzles.push(accessDoor, badgeReader, eStop);

  const groundingBus = add(makeBox(2.28, 0.035, 0.035, makeMaterial("#2aa876", { emissive: "#2aa876", emissiveIntensity: 0.34, metalness: 0.58 }), { x: 0, y: 0.22, z: -0.94 }, blockId), "structure");
  const structureTies = [groundingBus];
  [-1.18, -0.39, 0.39, 1.18].forEach((x) => {
    structureTies.push(add(makeBox(
      0.18,
      0.026,
      0.18,
      makeMaterial("#8b939d", { emissive: "#8b939d", emissiveIntensity: 0.16, metalness: 0.62, roughness: 0.24 }),
      { x, y: 0.145, z: -0.82 },
      blockId
    ), "structure"));
    structureTies.push(addPipe([x, 0.17, -0.82], [x, -0.2, -0.82], "#8b939d", 0.018, "structure"));
  });
  addPipe([-1.28, 0.18, 0.92], [1.28, 0.18, 0.92], "#8b939d", 0.02, "structure");
  addPipe([-1.28, 0.18, -0.92], [1.28, 0.18, -0.92], "#8b939d", 0.02, "structure");

  group.add(interiorGroup);
  return {
    group: interiorGroup,
    layerObjects,
    containmentPanels,
    buswayTaps,
    powerShelves,
    fiberLines,
    gpuTrayMeshes,
    nvlinkSpines,
    networkNodes,
    cduPumps,
    cduDetails,
    coolingDock,
    coolingFlowMarkers,
    coolingRails,
    sensorNodes,
    safetyNozzles,
    structureTies
  };
}

function createModule3D(block) {
  const THREE = window.THREE;
  const group = new THREE.Group();
  const pos = modulePosition(block);
  group.position.set(pos.x, 0, pos.z);
  group.userData.blockId = block.id;

  addSteelFrame(group, block.id);
  const steelFrameObjects = [...group.children];

  const body = makeBox(
    2.62,
    0.08,
    1.86,
    makeMaterial("#202a31", { transparent: true, opacity: 0.38, emissive: "#202a31", emissiveIntensity: 0.12 }),
    { x: 0, y: 0.2, z: 0 },
    block.id
  );
  group.add(body);

  const skidPlate = makeBox(2.76, 0.08, 1.98, makeMaterial("#272d32", { metalness: 0.55, roughness: 0.34 }), { x: 0, y: 0.06, z: 0 }, block.id);
  group.add(skidPlate);

  const foundationMat = makeBox(
    2.88,
    0.14,
    2.08,
    makeMaterial("#6d6458", { metalness: 0.22, roughness: 0.78, emissive: "#a89278", emissiveIntensity: 0.08 }),
    { x: 0, y: -0.04, z: 0 },
    block.id
  );
  tagInternalLayer(foundationMat, block.id, "foundation");
  markModeControlled(foundationMat);
  group.add(foundationMat);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.78, 1.72, 2.02)),
    new THREE.LineBasicMaterial({ color: "#b9c3cb", transparent: true, opacity: 0.42 })
  );
  edge.position.set(0, 0.86, 0);
  edge.userData.blockId = block.id;
  group.add(edge);

  const cutawayPanels = [];
  const addShellPanel = (width, height, depth, position, cutawayHide = false) => {
    const panel = makeBox(
      width,
      height,
      depth,
      makeMaterial("#101820", { transparent: true, opacity: 0.14, emissive: "#2d6bff", emissiveIntensity: 0.08, metalness: 0.2, roughness: 0.34 }),
      position,
      block.id
    );
    panel.userData.cutawayHide = cutawayHide;
    tagInternalLayer(panel, block.id, "structure");
    group.add(panel);
    cutawayPanels.push(panel);
  };
  addShellPanel(2.64, 0.045, 1.9, { x: 0, y: 1.72, z: 0 }, true);
  addShellPanel(2.64, 1.34, 0.038, { x: 0, y: 0.88, z: -0.96 }, false);
  addShellPanel(0.038, 1.34, 1.9, { x: -1.34, y: 0.88, z: 0 }, true);
  addShellPanel(0.038, 1.34, 1.9, { x: 1.34, y: 0.88, z: 0 }, false);

  const rackVisuals = [];
  [-0.72, -0.24, 0.24, 0.72].forEach((x, rackVisualIndex) => {
    rackVisuals.push(...addRackCabinet(group, x, -0.1, block.id, rackVisualIndex));
  });
  const internalDetails = addInternalDataCenterDetails(group, block.id);
  const constructionDetails = addConstructionDetails(group, block);

  const chipTiles = [];
  [-0.72, -0.24, 0.24, 0.72].forEach((x) => {
    [0.55, 0.75, 0.95].forEach((y) => {
      const chip = makeBox(
        0.09,
        0.075,
        0.022,
        makeMaterial("#36d7c8", { transparent: true, opacity: 0, emissive: "#36d7c8", emissiveIntensity: 1.1, metalness: 0.35, roughness: 0.18 }),
        { x, y, z: 0.234 },
        block.id
      );
      tagInternalLayer(chip, block.id, "compute");
      markModeControlled(chip);
      group.add(chip);
      chipTiles.push(chip);
    });
  });

  const dcBusway = makePipe([-1.08, 1.78, -0.78], [1.08, 1.78, -0.78], "#ff8a3d", 0.055);
  tagInternalLayer(dcBusway, block.id, "power");
  dcBusway.userData.baseY = dcBusway.position.y;
  group.add(dcBusway);

  const coolingHeader = makePipe([-1.08, 1.22, 0.88], [1.08, 1.22, 0.88], "#36d7c8", 0.038);
  tagInternalLayer(coolingHeader, block.id, "cooling");
  coolingHeader.userData.baseY = coolingHeader.position.y;
  group.add(coolingHeader);

  const fluidBeads = [];
  [-0.72, 0, 0.72].forEach((x, index) => {
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 18, 18),
      makeMaterial("#36d7c8", { transparent: true, opacity: 0, emissive: "#36d7c8", emissiveIntensity: 1.3, metalness: 0.05, roughness: 0.22 })
    );
    bead.position.set(x, 1.22, 0.88);
    tagInternalLayer(bead, block.id, "cooling");
    markModeControlled(bead);
    bead.userData.flowOffset = index / 3;
    group.add(bead);
    fluidBeads.push(bead);
  });

  [-0.72, -0.24, 0.24, 0.72].forEach((x) => {
    group.add(tagInternalLayer(makePipe([x, 1.73, -0.78], [x, 1.17, -0.18], "#ff8a3d", 0.018), block.id, "power"));
    group.add(tagInternalLayer(makePipe([x, 1.18, 0.86], [x, 0.72, 0.22], "#36d7c8", 0.014), block.id, "cooling"));
  });

  const fanMeshes = [];
  [-0.52, 0, 0.52].forEach((x) => {
    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.04, 28),
      makeMaterial("#11171c", { metalness: 0.6, roughness: 0.35 })
    );
    fan.rotation.x = Math.PI / 2;
    fan.position.set(x, 1.74, 0.34);
    tagInternalLayer(fan, block.id, "cooling");
    group.add(fan);
    fanMeshes.push(fan);
  });

  const selectedFrame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.96, 1.9, 2.16)),
    new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0 })
  );
  selectedFrame.position.set(0, 0.92, 0);
  selectedFrame.userData.blockId = block.id;
  group.add(selectedFrame);

  const designPad = makeBox(
    2.94,
    0.028,
    2.12,
    makeMaterial("#36d7c8", { transparent: true, opacity: 0.14, emissive: "#36d7c8", emissiveIntensity: 0.22, metalness: 0.08 }),
    { x: 0, y: 0.025, z: 0 },
    block.id
  );
  group.add(designPad);

  const designGhost = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.04, 0.2, 2.22)),
    new THREE.LineBasicMaterial({ color: "#36d7c8", transparent: true, opacity: 0.28 })
  );
  designGhost.position.set(0, 0.12, 0);
  designGhost.userData.blockId = block.id;
  group.add(designGhost);

  const anchorMarkers = [];
  [-1.18, 1.18].forEach((x) => {
    [-0.78, 0.78].forEach((z) => {
      const anchor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.09, 14),
        makeMaterial("#f7f3ea", { emissive: "#36d7c8", emissiveIntensity: 0.45, metalness: 0.62, roughness: 0.24 })
      );
      anchor.position.set(x, 0.13, z);
      tagInternalLayer(anchor, block.id, "structure");
      markModeControlled(anchor);
      group.add(anchor);
      anchorMarkers.push(anchor);
    });
  });

  const heatPlumeMaterial = makeMaterial("#dd7344", {
    transparent: true,
    opacity: 0,
    emissive: "#dd7344",
    emissiveIntensity: 0.55,
    metalness: 0,
    roughness: 0.82
  });
  heatPlumeMaterial.side = THREE.DoubleSide;
  const heatPlume = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.72, 1.45, 28, 1, true), heatPlumeMaterial);
  heatPlume.position.set(0, 2.25, 0.34);
  tagInternalLayer(heatPlume, block.id, "cooling");
  markModeControlled(heatPlume);
  group.add(heatPlume);

  const thermalSkin = makeBox(
    2.5,
    1.16,
    0.045,
    makeMaterial("#dd7344", { transparent: true, opacity: 0, emissive: "#dd7344", emissiveIntensity: 0.62, metalness: 0.02, roughness: 0.7 }),
    { x: 0, y: 0.88, z: 0.62 },
    block.id
  );
  tagInternalLayer(thermalSkin, block.id, "cooling");
  markModeControlled(thermalSkin);
  group.add(thermalSkin);

  const opsRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.026, 10, 84),
    makeMaterial("#2aa876", { transparent: true, opacity: 0, emissive: "#2aa876", emissiveIntensity: 0.7, metalness: 0.16, roughness: 0.34 })
  );
  opsRing.rotation.x = Math.PI / 2;
  opsRing.position.set(0, 0.16, 0);
  tagInternalLayer(opsRing, block.id, "telemetry");
  markModeControlled(opsRing);
  group.add(opsRing);

  const mechanicsPad = makeBox(
    3.12,
    0.04,
    2.32,
    makeMaterial("#d9a441", { transparent: true, opacity: 0, emissive: "#d9a441", emissiveIntensity: 0.4, metalness: 0.05, roughness: 0.78 }),
    { x: 0, y: -0.035, z: 0 },
    block.id
  );
  tagInternalLayer(mechanicsPad, block.id, "structure");
  markModeControlled(mechanicsPad);
  group.add(mechanicsPad);

  const pileMeshes = [];
  const loadArrows = [];
  const pilePositions = [];
  [-1.28, 1.28].forEach((x) => {
    [-0.88, 0.88].forEach((z) => pilePositions.push({ x, z }));
  });
  const pileGeometry = new THREE.CylinderGeometry(0.075, 0.1, 0.62, 12);
  const pileMaterial = makeMaterial("#6d747d", { transparent: true, opacity: 0, metalness: 0.45, roughness: 0.42 });
  const instancedPiles = new THREE.InstancedMesh(pileGeometry, pileMaterial, pilePositions.length);
  instancedPiles.userData.blockId = block.id;
  tagInternalLayer(instancedPiles, block.id, "foundation");
  markModeControlled(instancedPiles);
  const pileMatrix = new THREE.Matrix4();
  pilePositions.forEach(({ x, z }, index) => {
    pileMatrix.setPosition(x, -0.34, z);
    instancedPiles.setMatrixAt(index, pileMatrix);
  });
  instancedPiles.instanceMatrix.needsUpdate = true;
  group.add(instancedPiles);
  pileMeshes.push(instancedPiles);

  pilePositions.forEach(({ x, z }) => {
      const shaft = makePipe([x, 1.52, z], [x, 0.2, z], "#dd7344", 0.027);
      shaft.material.opacity = 0;
      shaft.material.transparent = true;
      tagInternalLayer(shaft, block.id, "foundation");
      markModeControlled(shaft);
      const head = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.2, 18),
        makeMaterial("#dd7344", { transparent: true, opacity: 0, emissive: "#dd7344", emissiveIntensity: 0.55, metalness: 0.1, roughness: 0.34 })
      );
      head.rotation.x = Math.PI;
      head.position.set(x, 0.14, z);
      tagInternalLayer(head, block.id, "foundation");
      markModeControlled(head);
      group.add(shaft);
      group.add(head);
      loadArrows.push(shaft, head);
  });

  const deflectionLine = makeLine(
    [
      [-1.26, 1.86, 1.06],
      [-0.42, 1.79, 1.06],
      [0.42, 1.79, 1.06],
      [1.26, 1.86, 1.06]
    ],
    "#f5c766",
    0
  );
  tagInternalLayer(deflectionLine, block.id, "structure");
  markModeControlled(deflectionLine);
  group.add(deflectionLine);

  threeState.fanMeshes.push(...fanMeshes);
  return {
    group,
    steelFrameObjects,
    rackVisuals,
    body,
    skidPlate,
    edge,
    cutawayPanels,
    selectedFrame,
    fanMeshes,
    designPad,
    designGhost,
    anchorMarkers,
    chipTiles,
    dcBusway,
    coolingHeader,
    fluidBeads,
    heatPlume,
    thermalSkin,
    opsRing,
    mechanicsPad,
    foundationMat,
    pileMeshes,
    loadArrows,
    deflectionLine,
    internalDetails,
    constructionDetails
  };
}

function createUtilityYard() {
  const THREE = window.THREE;
  const yard = new THREE.Group();
  const concrete = makeBox(3.35, 0.06, 2.2, makeMaterial("#333a3f", { roughness: 0.8, metalness: 0.08 }), { x: -6.05, y: 0.04, z: 3.4 });
  yard.add(concrete);

  const sst = makeBox(0.9, 0.8, 0.72, makeMaterial("#737a7d", { metalness: 0.52, roughness: 0.34 }), { x: -6.75, y: 0.48, z: 3.38 });
  yard.add(sst);

  [-0.34, 0, 0.34].forEach((x) => {
    const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.52, 14), makeMaterial("#c2c7c9", { metalness: 0.35, roughness: 0.24 }));
    bushing.position.set(-6.75 + x, 1.12, 3.38);
    yard.add(bushing);
  });

  for (let i = 0; i < 6; i += 1) {
    const rectifier = makeBox(0.26, 0.86, 0.5, makeMaterial("#20272d", { emissive: "#ff8a3d", emissiveIntensity: 0.28 }), { x: -5.68 + i * 0.27, y: 0.5, z: 3.95 });
    rectifier.userData.capacityIndex = i;
    yard.add(rectifier);
  }

  const battery = makeBox(1.8, 0.64, 0.52, makeMaterial("#151d22", { emissive: "#2aa876", emissiveIntensity: 0.16 }), { x: -5.6, y: 0.42, z: 2.76 });
  yard.add(battery);

  return yard;
}

function createGasPowerYard() {
  const THREE = window.THREE;
  const yard = new THREE.Group();
  yard.add(makeBox(3.35, 0.06, 2.2, makeMaterial("#333a3f", { roughness: 0.8, metalness: 0.08 }), { x: -6.05, y: 0.04, z: 3.4 }));
  const gasHeader = makePipe([-7.35, 0.18, 2.68], [-4.72, 0.18, 2.68], "#f5c766", 0.035);
  gasHeader.material.emissiveIntensity = 0.42;
  yard.add(gasHeader);
  for (let index = 0; index < 8; index += 1) {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = -7.02 + col * 0.66;
    const z = 3.1 + row * 0.82;
    const module = new THREE.Group();
    module.userData.capacityIndex = index;
    module.add(makeBox(0.56, 0.54, 0.68, makeMaterial("#20282d", { emissive: "#f5c766", emissiveIntensity: 0.18, metalness: 0.58, roughness: 0.3 }), { x, y: 0.34, z }));
    module.add(makeBox(0.42, 0.1, 0.72, makeMaterial("#59636b", { metalness: 0.62, roughness: 0.26 }), { x, y: 0.67, z }));
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.052, 0.48, 14), makeMaterial("#8b939d", { metalness: 0.72, roughness: 0.24 }));
    exhaust.position.set(x + 0.18, 0.9, z - 0.16);
    module.add(exhaust);
    module.add(makePipe([x, 0.2, z - 0.32], [x, 0.2, 2.68], "#f5c766", 0.018));
    yard.add(module);
  }
  const switchgear = makeBox(0.52, 0.82, 1.55, makeMaterial("#1b242a", { emissive: "#ff8a3d", emissiveIntensity: 0.24, metalness: 0.46, roughness: 0.3 }), { x: -4.72, y: 0.46, z: 3.48 });
  yard.add(switchgear);
  return yard;
}

function createGasTurbinePowerYard() {
  const THREE = window.THREE;
  const yard = new THREE.Group();
  yard.add(makeBox(3.35, 0.06, 2.2, makeMaterial("#34393d", { roughness: 0.82, metalness: 0.08 }), { x: -6.05, y: 0.04, z: 3.4 }));

  const gasHeader = makePipe([-7.42, 0.16, 2.56], [-4.62, 0.16, 2.56], "#f5c766", 0.038);
  gasHeader.material.emissiveIntensity = 0.48;
  yard.add(gasHeader);

  for (let index = 0; index < 4; index += 1) {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = -6.92 + col * 1.52;
    const z = 3.02 + row * 1.02;
    const module = new THREE.Group();
    module.userData.capacityIndex = index;

    const skid = makeBox(1.3, 0.06, 0.62, makeMaterial("#4d5459", { metalness: 0.62, roughness: 0.3 }), { x, y: 0.15, z });
    const inlet = makeBox(0.3, 0.78, 0.56, makeMaterial("#899197", { metalness: 0.48, roughness: 0.34 }), { x: x - 0.48, y: 0.56, z });
    const turbine = makeBox(0.62, 0.4, 0.48, makeMaterial("#20282d", { emissive: "#ff9b5a", emissiveIntensity: 0.34, metalness: 0.64, roughness: 0.24 }), { x: x - 0.02, y: 0.39, z });
    const generator = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.38, 20), makeMaterial("#c2c7c9", { metalness: 0.72, roughness: 0.22 }));
    generator.rotation.z = Math.PI / 2;
    generator.position.set(x + 0.42, 0.39, z);
    const scr = makeBox(0.28, 0.58, 0.52, makeMaterial("#59636b", { emissive: "#ff8a3d", emissiveIntensity: 0.2, metalness: 0.56, roughness: 0.28 }), { x: x + 0.62, y: 0.48, z });
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 1.18, 18), makeMaterial("#747d82", { metalness: 0.72, roughness: 0.24 }));
    stack.position.set(x + 0.7, 1.18, z);
    const stackBand = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.08, 18), makeMaterial("#ff9b5a", { emissive: "#ff9b5a", emissiveIntensity: 0.4, metalness: 0.52, roughness: 0.22 }));
    stackBand.position.set(x + 0.7, 1.58, z);

    module.add(skid, inlet, turbine, generator, scr, stack, stackBand);
    module.add(makePipe([x - 0.06, 0.2, z - 0.26], [x - 0.06, 0.2, 2.56], "#f5c766", 0.02));
    yard.add(module);
  }

  const switchgear = makeBox(0.45, 0.86, 1.72, makeMaterial("#192229", { emissive: "#ff8a3d", emissiveIntensity: 0.3, metalness: 0.48, roughness: 0.28 }), { x: -4.58, y: 0.49, z: 3.52 });
  const controls = makeBox(0.32, 0.48, 0.48, makeMaterial("#15262d", { emissive: "#4e8cff", emissiveIntensity: 0.38, metalness: 0.38, roughness: 0.28 }), { x: -4.98, y: 0.3, z: 4.14 });
  yard.add(switchgear, controls);
  return yard;
}

function createSolarPowerYard() {
  const THREE = window.THREE;
  const yard = new THREE.Group();
  yard.add(makeBox(3.35, 0.06, 2.2, makeMaterial("#30383b", { roughness: 0.86, metalness: 0.05 }), { x: -6.05, y: 0.04, z: 3.4 }));
  for (let index = 0; index < 12; index += 1) {
    const col = index % 6;
    const row = Math.floor(index / 6);
    const panel = makeBox(
      0.42,
      0.025,
      0.52,
      makeMaterial("#18333d", { emissive: "#36d7c8", emissiveIntensity: 0.18, metalness: 0.38, roughness: 0.18 }),
      { x: -7.22 + col * 0.48, y: 0.38 + row * 0.08, z: 2.96 + row * 0.66 }
    );
    panel.rotation.x = -0.24;
    panel.userData.capacityIndex = index;
    yard.add(panel);
    const post = makeBox(0.025, 0.36, 0.025, makeMaterial("#7d878d", { metalness: 0.7, roughness: 0.26 }), { x: panel.position.x, y: 0.2, z: panel.position.z });
    post.userData.capacityIndex = index;
    yard.add(post);
  }
  for (let index = 0; index < 4; index += 1) {
    const inverter = makeBox(0.36, 0.72, 0.42, makeMaterial("#17252a", { emissive: "#36d7c8", emissiveIntensity: 0.34, metalness: 0.44, roughness: 0.28 }), { x: -6.68 + index * 0.48, y: 0.42, z: 4.08 });
    inverter.userData.capacityIndex = index * 3;
    yard.add(inverter);
  }
  const dcCombiner = makePipe([-7.25, 0.16, 4.28], [-4.72, 0.16, 4.28], "#36d7c8", 0.032);
  dcCombiner.material.emissiveIntensity = 0.66;
  yard.add(dcCombiner);
  return yard;
}

function createBackupPowerYard() {
  const THREE = window.THREE;
  const yard = new THREE.Group();
  yard.add(makeBox(4.6, 0.055, 1.85, makeMaterial("#30363a", { roughness: 0.82, metalness: 0.1 }), { x: -5.55, y: 0.035, z: -3.5 }));

  for (let index = 0; index < 6; index += 1) {
    const cabinet = makeBox(0.36, 0.68, 0.58, makeMaterial("#142125", { emissive: "#2aa876", emissiveIntensity: 0.32, metalness: 0.44, roughness: 0.3 }), { x: -7.42 + index * 0.42, y: 0.39, z: -3.98 });
    cabinet.userData.capacityIndex = index;
    cabinet.userData.backupKind = "battery";
    yard.add(cabinet);
  }

  for (let index = 0; index < 5; index += 1) {
    const x = -7.34 + index * 0.72;
    const generator = new THREE.Group();
    generator.userData.capacityIndex = index;
    generator.userData.backupKind = "generator";
    const enclosure = makeBox(0.62, 0.56, 0.64, makeMaterial("#242b2e", { emissive: "#f5c766", emissiveIntensity: 0.18, metalness: 0.5, roughness: 0.32 }), { x, y: 0.33, z: -3.12 });
    const radiator = makeBox(0.5, 0.08, 0.68, makeMaterial("#737d82", { metalness: 0.66, roughness: 0.24 }), { x, y: 0.65, z: -3.12 });
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.4, 14), makeMaterial("#9aa3a8", { metalness: 0.72, roughness: 0.22 }));
    exhaust.position.set(x + 0.18, 0.88, -3.28);
    enclosure.userData.backupKind = "generatorSurface";
    radiator.userData.backupKind = "generatorSurface";
    exhaust.userData.backupKind = "generatorSurface";
    generator.add(enclosure, radiator, exhaust);
    yard.add(generator);
  }

  for (let index = 0; index < 2; index += 1) {
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.88, 24),
      makeMaterial("#59636b", { emissive: "#36d7c8", emissiveIntensity: 0.08, metalness: 0.62, roughness: 0.28 })
    );
    tank.rotation.z = Math.PI / 2;
    tank.position.set(-4.12, 0.3, -3.7 + index * 0.58);
    tank.userData.capacityIndex = index;
    tank.userData.backupKind = "fuel";
    yard.add(tank);
  }

  const fuelHeader = makePipe([-4.58, 0.16, -3.12], [-7.62, 0.16, -3.12], "#36d7c8", 0.022);
  fuelHeader.userData.backupKind = "fuelHeader";
  yard.add(fuelHeader);
  const gasHeader = makePipe([-4.58, 0.2, -3.32], [-7.62, 0.2, -3.32], "#f5c766", 0.022);
  gasHeader.userData.backupKind = "gasHeader";
  yard.add(gasHeader);
  const breaker = makeBox(0.38, 0.78, 0.56, makeMaterial("#232a2f", { emissive: "#ff8a3d", emissiveIntensity: 0.26 }), { x: -3.52, y: 0.44, z: -3.12 });
  breaker.userData.backupKind = "controls";
  yard.add(breaker);
  const controller = makeBox(0.34, 0.5, 0.48, makeMaterial("#14252a", { emissive: "#4e8cff", emissiveIntensity: 0.36 }), { x: -3.52, y: 0.3, z: -3.86 });
  controller.userData.backupKind = "controls";
  yard.add(controller);
  const planHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.45, 0.026, 10, 72),
    makeMaterial("#2aa876", { transparent: true, opacity: 0.52, emissive: "#2aa876", emissiveIntensity: 0.72, metalness: 0.18, roughness: 0.3 })
  );
  planHalo.rotation.x = Math.PI / 2;
  planHalo.position.set(-5.55, 0.1, -3.5);
  planHalo.userData.backupKind = "planHalo";
  yard.add(planHalo);
  return yard;
}

function createPowerSupplySystems() {
  return {
    grid: createUtilityYard(),
    btmGas: createGasPowerYard(),
    gasTurbine: createGasTurbinePowerYard(),
    btmSolar: createSolarPowerYard(),
    backup: createBackupPowerYard()
  };
}

function createSiteCoolingSystem() {
  const THREE = window.THREE;
  const group = new THREE.Group();
  const equipment = [];
  const pipes = [];
  const couplings = [];
  const flowMarkers = [];
  const cduModules = [];
  const valveWheels = [];
  const leakSensors = [];
  const cduModulePositions = [4.68, 5.03, 5.38, 5.73, 6.08, 6.43, 6.78];
  const addObject = (object, bucket = equipment) => {
    tagInternalLayer(object, null, "cooling");
    group.add(object);
    bucket.push(object);
    return object;
  };
  const addSitePipe = (start, end, color, radius = 0.035) => addObject(makePipe(start, end, color, radius), pipes);
  const addFlow = (start, end, color, offset) => {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      makeMaterial(color, { transparent: true, opacity: 0, emissive: color, emissiveIntensity: 1.5, metalness: 0.06, roughness: 0.2 })
    );
    marker.position.set(...start);
    marker.userData.flowStart = new THREE.Vector3(...start);
    marker.userData.flowEnd = new THREE.Vector3(...end);
    marker.userData.flowOffset = offset;
    addObject(marker, flowMarkers);
    return marker;
  };

  addObject(makeBox(
    3.05,
    0.07,
    1.82,
    makeMaterial("#343b3f", { roughness: 0.78, metalness: 0.12 }),
    { x: 5.92, y: 0.04, z: 3.47 }
  ));

  cduModulePositions.forEach((x, skidIndex) => {
    const body = addObject(makeBox(
      0.31,
      0.72,
      0.64,
      makeMaterial("#253238", { emissive: "#36d7c8", emissiveIntensity: 0.14, metalness: 0.52, roughness: 0.3 }),
      { x, y: 0.46, z: 3.54 }
    ));
    body.userData.cduIndex = skidIndex;
    cduModules.push(body);
    for (let plate = 0; plate < 6; plate += 1) {
      const plateMesh = addObject(makeBox(
        0.22,
        0.018,
        0.026,
        makeMaterial(plate % 2 ? "#71858d" : "#9aabb0", { metalness: 0.7, roughness: 0.2 }),
        { x, y: 0.24 + plate * 0.078, z: 3.185 }
      ));
      plateMesh.userData.cduIndex = skidIndex;
      cduModules.push(plateMesh);
    }
    const pump = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.22, 20),
      makeMaterial(skidIndex ? "#2d6bff" : "#36d7c8", { emissive: skidIndex ? "#2d6bff" : "#36d7c8", emissiveIntensity: 0.46, metalness: 0.34, roughness: 0.25 })
    );
    pump.rotation.z = Math.PI / 2;
    pump.position.set(x, 0.28, 3.86);
    pump.userData.cduIndex = skidIndex;
    addObject(pump);
    cduModules.push(pump);
    const valve = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.012, 8, 24),
      makeMaterial("#ff8a3d", { emissive: "#ff8a3d", emissiveIntensity: 0.42, metalness: 0.48, roughness: 0.24 })
    );
    valve.rotation.x = Math.PI / 2;
    valve.position.set(x, 0.58, 3.2);
    valve.userData.cduIndex = skidIndex;
    addObject(valve, valveWheels);
    cduModules.push(valve);
  });

  const bufferTank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 1.04, 28),
    makeMaterial("#344f56", { emissive: "#2aa876", emissiveIntensity: 0.14, metalness: 0.56, roughness: 0.28 })
  );
  bufferTank.position.set(7.2, 0.61, 3.5);
  addObject(bufferTank);

  [5.08, 5.8, 6.52].forEach((x, index) => {
    const sensor = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      makeMaterial("#2aa876", { emissive: "#2aa876", emissiveIntensity: 0.9, metalness: 0.16, roughness: 0.24 })
    );
    sensor.position.set(x, 0.12, 3.12 + (index % 2) * 0.18);
    addObject(sensor, leakSensors);
  });

  [5.05, 5.62, 6.19].forEach((x) => {
    addObject(makeBox(
      0.48,
      0.24,
      0.66,
      makeMaterial("#68757b", { metalness: 0.66, roughness: 0.26 }),
      { x, y: 1.03, z: 3.5 }
    ));
    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.035, 28),
      makeMaterial("#172126", { metalness: 0.5, roughness: 0.34 })
    );
    fan.position.set(x, 1.17, 3.5);
    addObject(fan);
  });

  addSitePipe([4.5, 0.22, 3.02], [6.92, 0.22, 3.02], "#36d7c8", 0.055);
  addSitePipe([4.5, 0.31, 3.18], [6.92, 0.31, 3.18], "#2d6bff", 0.05);
  addSitePipe([5.7, 0.22, -1.52], [5.7, 0.22, 3.02], "#36d7c8", 0.05);
  addSitePipe([5.88, 0.31, -1.37], [5.88, 0.31, 3.18], "#2d6bff", 0.045);

  [-2.55, -0.3, 1.95].forEach((rowZ, rowIndex) => {
    const supplyZ = rowZ + 1.03;
    const returnZ = rowZ + 1.18;
    addSitePipe([5.7, 0.22, supplyZ], [-5.78, 0.22, supplyZ], "#36d7c8", 0.042);
    addSitePipe([-5.78, 0.31, returnZ], [5.88, 0.31, returnZ], "#2d6bff", 0.038);
    addFlow([5.46, 0.25, supplyZ], [-5.5, 0.25, supplyZ], "#36d7c8", rowIndex * 0.21);
    addFlow([-5.5, 0.34, returnZ], [5.62, 0.34, returnZ], "#2d6bff", 0.44 + rowIndex * 0.17);

    modules.filter((block) => block.row === rowIndex + 1).forEach((block) => {
      const position = modulePosition(block);
      const dockX = position.x - 1.35;
      addSitePipe([dockX, 0.22, supplyZ], [dockX, 0.76, rowZ + 0.8], "#36d7c8", 0.022);
      addSitePipe([dockX, 0.56, rowZ + 0.64], [dockX, 0.31, returnZ], "#2d6bff", 0.02);
      const supplyCoupling = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 16, 16),
        makeMaterial("#36d7c8", { emissive: "#36d7c8", emissiveIntensity: 0.68, metalness: 0.35, roughness: 0.18 })
      );
      supplyCoupling.position.set(dockX, 0.76, rowZ + 0.8);
      addObject(supplyCoupling, couplings);
      const returnCoupling = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        makeMaterial("#2d6bff", { emissive: "#2d6bff", emissiveIntensity: 0.66, metalness: 0.35, roughness: 0.18 })
      );
      returnCoupling.position.set(dockX, 0.56, rowZ + 0.64);
      addObject(returnCoupling, couplings);
    });
  });

  return {
    group,
    equipment,
    pipes,
    couplings,
    flowMarkers,
    cduModules,
    valveWheels,
    leakSensors,
    maxCduSlots: cduModulePositions.length
  };
}

function addSiteSteelFrame(root) {
  const steel = makeMaterial("#59636b", { metalness: 0.78, roughness: 0.25 });
  const beam = (width, height, depth, position) => root.add(makeBox(width, height, depth, steel, position));
  const xLines = [-5.85, -2.75, 0.35, 3.45, 6.55];
  const zLines = [-3.55, -1.3, 0.95, 3.2];

  xLines.forEach((x) => {
    zLines.forEach((z) => {
      beam(0.09, 2.55, 0.09, { x, y: 1.25, z });
    });
  });

  zLines.forEach((z) => {
    beam(12.5, 0.1, 0.1, { x: 0.35, y: 2.58, z });
  });

  xLines.forEach((x) => {
    beam(0.1, 0.1, 6.75, { x, y: 2.58, z: -0.18 });
  });

  [-5.85, -2.75, 0.35, 3.45].forEach((x) => {
    root.add(makePipe([x, 0.18, -3.55], [x + 3.1, 2.45, -3.55], "#7f878d", 0.024));
    root.add(makePipe([x + 3.1, 0.18, 3.2], [x, 2.45, 3.2], "#7f878d", 0.024));
  });
}

function createPointCloud() {
  const THREE = window.THREE;
  const count = 520;
  const positions = new Float32Array(count * 3);
  let seed = 0x4d475055;
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < count; i += 1) {
    const side = i % 2 === 0 ? 1 : -1;
    positions[i * 3] = side * (4.1 + random() * 2.5);
    positions[i * 3 + 1] = 0.25 + random() * 2.8;
    positions[i * 3 + 2] = -3.2 + random() * 6.4;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: "#52e6c7", size: 0.026, transparent: true, opacity: 0.42 })
  );
}

function preferredThreePixelRatio() {
  const mobile = window.matchMedia?.("(max-width: 560px)")?.matches === true;
  return Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
}

function requestThreeFrame() {
  if (!threeState.renderer || threeState.frameId !== null || document.hidden || !threeState.inViewport) return;
  threeState.frameId = window.requestAnimationFrame(animateThreeScene);
}

function handleThreeVisibility() {
  if (!document.hidden) {
    threeState.lastTime = 0;
    requestThreeFrame();
  }
}

function initThreeScene() {
  if (!threeState.enabled || threeState.renderer) return;

  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas: el.twin3d, antialias: true, alpha: false, powerPreference: "high-performance" });
  threeState.pixelRatio = preferredThreePixelRatio();
  renderer.setPixelRatio(threeState.pixelRatio);
  renderer.setClearColor("#070a0d", 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#070a0d", 12, 25);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  const root = new THREE.Group();
  scene.add(root);

  scene.add(new THREE.AmbientLight("#d8e4ff", 0.28));
  scene.add(new THREE.HemisphereLight("#b9d7ee", "#11161a", 0.58));
  const sun = new THREE.DirectionalLight("#ffffff", 2.4);
  sun.position.set(4.5, 7.5, 5.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 32;
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  scene.add(sun);
  const tealLight = new THREE.PointLight("#2aa876", 2.3, 14);
  tealLight.position.set(3, 2.2, -3.4);
  scene.add(tealLight);
  const orangeLight = new THREE.PointLight("#dd7344", 1.7, 10);
  orangeLight.position.set(-5.8, 1.5, 3.5);
  scene.add(orangeLight);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(14.8, 0.08, 9.6),
    makeMaterial("#14191d", { roughness: 0.78, metalness: 0.22 })
  );
  floor.position.y = -0.05;
  floor.receiveShadow = true;
  root.add(floor);

  const grid = new THREE.GridHelper(14, 28, "#3a4148", "#252b30");
  grid.position.y = 0.02;
  root.add(grid);

  const siteSteelGroup = new THREE.Group();
  addSiteSteelFrame(siteSteelGroup);
  root.add(siteSteelGroup);
  const powerSupply = createPowerSupplySystems();
  Object.values(powerSupply).forEach((group) => root.add(group));
  const coolingSite = createSiteCoolingSystem();
  root.add(coolingSite.group);
  root.add(createPointCloud());

  modules.forEach((block) => {
    const created = createModule3D(block);
    threeState.moduleMeshes.set(block.id, created);
    root.add(created.group);
  });

  const feederRows = [
    ["800V DC Bus A", -2.55, "#ff8a3d"],
    ["800V DC Bus B", -0.3, "#2aa876"],
    ["800V DC Bus C", 1.95, "#2d6bff"]
  ];

  feederRows.forEach(([name, z, color], index) => {
    const feeder = makePipe([-6.2, 0.13, 3.35], [-5.7, 0.13, z], color, 0.04);
    root.add(feeder);
    const trunk = makePipe([-5.7, 0.13, z], [5.5, 0.13, z], color, 0.035);
    root.add(trunk);
    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 18, 18),
      makeMaterial(color, { emissive: color, emissiveIntensity: 1.8, metalness: 0.1, roughness: 0.18 })
    );
    pulse.position.set(-4.4 + index, 0.2, z);
    root.add(pulse);
    threeState.pulseMeshes.push({ mesh: pulse, z, offset: index * 1.9, color, feeder: name });
  });

  threeState.renderer = renderer;
  threeState.scene = scene;
  threeState.camera = camera;
  threeState.root = root;
  threeState.siteSteelGroup = siteSteelGroup;
  threeState.coolingSite = coolingSite;
  threeState.powerSupply = powerSupply;
  threeState.coolingFlowMeshes.push(...coolingSite.flowMarkers);
  threeState.raycaster = new THREE.Raycaster();
  threeState.pointer = new THREE.Vector2();

  el.twin3d.addEventListener("pointerdown", handleThreePointerDown);
  el.twin3d.addEventListener("pointermove", handleThreePointerMove);
  window.addEventListener("pointerup", handleThreePointerUp);
  el.twin3d.addEventListener("wheel", handleThreeWheel, { passive: false });
  el.twin3d.addEventListener("keydown", handleThreeKeydown);
  document.addEventListener("visibilitychange", handleThreeVisibility);
  if ("IntersectionObserver" in window) {
    threeState.observer = new IntersectionObserver(([entry]) => {
      threeState.inViewport = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0);
      if (threeState.inViewport) {
        threeState.lastTime = 0;
        requestThreeFrame();
      }
    }, { threshold: 0.01 });
    threeState.observer.observe(el.threeViewport);
  }

  resizeThreeScene();
  updateThreeCamera();
}

function updateThreeCamera(immediate = false) {
  if (!threeState.camera) return;
  const { azimuth, elevation, distance } = threeState.orbit;
  const selected = modules.find((block) => block.id === state.selectedId) || modules[0];
  const selectedPosition = modulePosition(selected);
  const energyFocus = state.twinMode === "energy" || state.tab === "power";
  const coolingFocus = state.twinMode === "fluid" || state.twinMode === "thermal";
  const target = state.twinMode === "physics"
    ? { x: 0, y: 0.62, z: 0.44 }
    : energyFocus
      ? { x: (selectedPosition.x - 6.05) / 2, y: 0.54, z: (selectedPosition.z + 3.4) / 2 }
      : coolingFocus
        ? { x: (selectedPosition.x + 5.92) / 2, y: 0.54, z: (selectedPosition.z + 3.47) / 2 }
        : { x: selectedPosition.x * 0.34, y: 0.5, z: selectedPosition.z * 0.34 };
  const blend = immediate ? 1 : 0.075;
  threeState.focus.x += (target.x - threeState.focus.x) * blend;
  threeState.focus.y += (target.y - threeState.focus.y) * blend;
  threeState.focus.z += (target.z - threeState.focus.z) * blend;
  const x = Math.sin(azimuth) * Math.cos(elevation) * distance;
  const y = Math.sin(elevation) * distance;
  const z = Math.cos(azimuth) * Math.cos(elevation) * distance;
  threeState.camera.position.set(threeState.focus.x + x, y, threeState.focus.z + z);
  threeState.camera.lookAt(threeState.focus.x, threeState.focus.y, threeState.focus.z);
}

function resizeThreeScene() {
  if (!threeState.renderer) return;
  const pixelRatio = preferredThreePixelRatio();
  if (pixelRatio !== threeState.pixelRatio) {
    threeState.pixelRatio = pixelRatio;
    threeState.renderer.setPixelRatio(pixelRatio);
  }
  const rect = el.threeViewport.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  if (width === threeState.viewport.width && height === threeState.viewport.height) return;
  threeState.viewport.width = width;
  threeState.viewport.height = height;
  threeState.renderer.setSize(width, height, false);
  threeState.camera.aspect = width / height;
  threeState.camera.updateProjectionMatrix();
  requestThreeFrame();
}

function handleThreePointerDown(event) {
  threeState.drag.active = true;
  threeState.drag.moved = false;
  threeState.drag.x = event.clientX;
  threeState.drag.y = event.clientY;
  el.twin3d.setPointerCapture?.(event.pointerId);
}

function handleThreePointerMove(event) {
  if (!threeState.drag.active) return;
  const dx = event.clientX - threeState.drag.x;
  const dy = event.clientY - threeState.drag.y;
  if (Math.abs(dx) + Math.abs(dy) > 4) threeState.drag.moved = true;
  threeState.drag.x = event.clientX;
  threeState.drag.y = event.clientY;
  threeState.orbit.azimuth -= dx * 0.006;
  threeState.orbit.elevation = clamp(threeState.orbit.elevation - dy * 0.004, 0.22, 1.15);
  updateThreeCamera();
  requestThreeFrame();
}

function handleThreePointerUp(event) {
  if (!threeState.drag.active) return;
  const wasClick = !threeState.drag.moved;
  threeState.drag.active = false;
  if (!wasClick || !threeState.renderer) return;

  const rect = el.twin3d.getBoundingClientRect();
  threeState.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  threeState.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  threeState.raycaster.setFromCamera(threeState.pointer, threeState.camera);
  const objects = [...threeState.moduleMeshes.values()].flatMap((entry) => entry.group.children);
  const hit = threeState.raycaster.intersectObjects(objects, false).find((item) => item.object.userData.blockId);
  if (hit && hit.object.userData.blockId !== state.selectedId) {
    beginRouteTransition();
    state.selectedId = hit.object.userData.blockId;
    render();
    scheduleBackendSync("select_3d_module");
  }
}

function handleThreeWheel(event) {
  event.preventDefault();
  threeState.orbit.distance = clamp(threeState.orbit.distance + Math.sign(event.deltaY) * 0.8, 7.2, 18);
  updateThreeCamera();
  requestThreeFrame();
}

function handleThreeKeydown(event) {
  const keyActions = {
    ArrowLeft: () => { threeState.orbit.azimuth += 0.09; },
    ArrowRight: () => { threeState.orbit.azimuth -= 0.09; },
    ArrowUp: () => { threeState.orbit.elevation = clamp(threeState.orbit.elevation + 0.06, 0.22, 1.15); },
    ArrowDown: () => { threeState.orbit.elevation = clamp(threeState.orbit.elevation - 0.06, 0.22, 1.15); },
    "+": () => { threeState.orbit.distance = clamp(threeState.orbit.distance - 0.8, 7.2, 18); },
    "=": () => { threeState.orbit.distance = clamp(threeState.orbit.distance - 0.8, 7.2, 18); },
    "-": () => { threeState.orbit.distance = clamp(threeState.orbit.distance + 0.8, 7.2, 18); }
  };
  const action = keyActions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
  updateThreeCamera();
  requestThreeFrame();
}

function feederDesignDemand(feederName) {
  return modules.reduce((sum, block) => sum + (block.feeder === feederName ? block.mw : 0), 0);
}

function feederHeadroomMw(feederName) {
  return feeders[feederName].capacity - feederDesignDemand(feederName);
}

function liveLoadFactorFor(block) {
  const status = statusFor(block);
  if (status === "loaded") return clamp(0.78 + ((state.week + block.offset) % 5) * 0.035, 0.72, 0.96);
  if (status === "energized") return 0.42;
  if (status === "power-hold") return 0.08;
  if (status === "build") return 0.02;
  return 0;
}

function feederLiveDemand(feederName) {
  return modules.reduce((sum, block) => {
    return sum + (block.feeder === feederName ? block.mw * liveLoadFactorFor(block) : 0);
  }, 0);
}

function operationsTwinValues(block) {
  const feeder = feeders[block.feeder];
  const loadFactor = liveLoadFactorFor(block);
  const liveMw = block.mw * loadFactor;
  const dcUtilPct = clamp((feederLiveDemand(block.feeder) / feeder.capacity) * 100, 0, 112);
  const scanPenalty = block.scan === "hold" ? 3.5 : block.scan === "delta" ? 1.5 : 0;
  const failure = opsFailureProfiles[state.opsFailure] || opsFailureProfiles.none;
  const failureActive = state.opsFailure !== "none";
  let thermalMargin = clamp(22 - liveMw * 3.4 + (state.prefab - 62) * 0.05 - scanPenalty, 3, 24);
  let riskScore = clamp(
    dcUtilPct * 0.52 + (24 - thermalMargin) * 1.9 + (block.scan === "hold" ? 14 : block.scan === "delta" ? 8 : 0) + (state.scenario === "utilitySlip" ? 5 : 0),
    0,
    99
  );
  if (failureActive) {
    if (state.opsFailure === "cduFailure" || state.opsFailure === "pumpFailure" || state.opsFailure === "hotRack") thermalMargin -= 8;
    if (state.opsFailure === "buswayFault" || state.opsFailure === "utilityOutage" || state.opsFailure === "generatorFail") riskScore += 18;
    if (state.opsFailure === "networkDegrade") riskScore += 10;
    riskScore = clamp(riskScore, 0, 99);
    thermalMargin = clamp(thermalMargin, 1, 24);
  }
  const riskColor = failureActive ? failure.color : riskScore > 74 ? "#dd7344" : riskScore > 58 ? "#d9a441" : "#2aa876";
  const health = failureActive ? failure.label : riskScore > 74 ? "Hot" : riskScore > 58 ? "Watch" : "Nominal";
  return { loadFactor, liveMw, dcUtilPct, thermalMargin, riskScore, riskColor, health, failure, failureActive };
}

function mechanicsColor(utilizationPct) {
  if (utilizationPct > 92) return "#dd7344";
  if (utilizationPct > 72) return "#d9a441";
  return "#2aa876";
}

function activeProgram() {
  return dataCenterPresets[state.engine.program] || dataCenterPresets.aiPod;
}

function activeSite() {
  return californiaSitePresets[state.engine.site] || californiaSitePresets.bayMud;
}

function activeSeismicTier() {
  return seismicTierPresets[state.engine.tier] || seismicTierPresets.enhanced;
}

function activeComputePlatform() {
  return computePlatforms[state.engine.compute] || computePlatforms.gb200;
}

function activeRackProfile() {
  return rackProfiles[state.engine.rack] || rackProfiles.nvl72;
}

function activeSoftwareStack() {
  return softwareStacks[state.engine.stack] || softwareStacks.cudaRunai;
}

function activeWorkloadProfile() {
  return workloadProfiles[state.engine.workload] || workloadProfiles.mixed;
}

function activeSoftwarePolicy() {
  return softwarePolicies[state.engine.policy] || softwarePolicies.throughput;
}

function activePowerSource() {
  const profile = powerSourceProfiles[state.engine.powerSource] || powerSourceProfiles.grid;
  if (state.engine.powerSource !== "gasTurbine") return profile;
  const model = gasTurbineModels[state.engine.turbineModel] || gasTurbineModels.lm2500Xpress;
  const unitMw = clamp(Number(state.engine.turbineUnitMw) || model.unitMw, 5, 100);
  const efficiencyPct = clamp(Number(state.engine.turbineEfficiencyPct) || model.efficiencyPct, 20, 65);
  return {
    ...profile,
    ...model,
    unitMw,
    conversionEfficiency: efficiencyPct / 100,
    moduleLabel: `${unitMw.toFixed(1)} MW turbine package`
  };
}

function gasTurbineSiteScreen(source) {
  const ambientC = clamp(Number(state.engine.turbineAmbientC) || 15, -20, 55);
  const altitudeM = clamp(Number(state.engine.turbineAltitudeM) || 0, 0, 3000);
  const kelvinRatio = 288.15 / (ambientC + 273.15);
  const pressureRatio = Math.exp(-altitudeM / 8434.5);
  const correctionFactor = clamp(kelvinRatio * pressureRatio, 0.65, 1.05);
  const siteUnitMw = source.unitMw * correctionFactor;
  return { ambientC, altitudeM, correctionFactor, siteUnitMw };
}

function activeReliabilityProfile() {
  return reliabilityProfiles[state.engine.reliability] || reliabilityProfiles.nPlus1;
}

function activeBackupProfile() {
  return backupProfiles[state.engine.backup] || backupProfiles.bess2h;
}

function backupProfileResilienceScore(profile) {
  if (!profile || profile.visualMode === "none") return 0;
  return Math.round(clamp(
    profile.transferSuccess * 45
      + Math.min(1, profile.autonomyHours / 48) * 35
      + (profile.blackStart ? 12 : 0)
      + (profile.generatorUnitMw > 0 || profile.batteryHours >= 2 ? 8 : 0),
    0,
    100
  ));
}

function activeModularSupply() {
  return modularSupplyProfiles[state.engine.supplier] || modularSupplyProfiles.ocp;
}

function activeSupplyStrategy() {
  return supplyStrategies[state.engine.supplyStrategy] || supplyStrategies.balanced;
}

function activeSupplyShock() {
  return supplyShockProfiles[state.engine.supplyShock] || supplyShockProfiles.base;
}

function combinations(n, k) {
  const m = Math.min(k, n - k);
  let value = 1;
  for (let index = 1; index <= m; index += 1) value = value * (n - m + index) / index;
  return value;
}

function atLeastNAvailability(required, installed, unitAvailability) {
  let probability = 0;
  for (let online = required; online <= installed; online += 1) {
    probability += combinations(installed, online) * unitAvailability ** online * (1 - unitAvailability) ** (installed - online);
  }
  return clamp(probability, 0, 1);
}

function powerSystemForTarget(targetMw) {
  const source = activePowerSource();
  const reliability = activeReliabilityProfile();
  const backup = activeBackupProfile();
  const selectedMw = clamp(Number(targetMw) || 40, 5, 250);
  const turbineSite = state.engine.powerSource === "gasTurbine" ? gasTurbineSiteScreen(source) : null;
  const effectiveUnitMw = turbineSite ? turbineSite.siteUnitMw : source.unitMw;
  const requiredUnits = Math.max(1, Math.ceil(selectedMw / effectiveUnitMw));
  const unitsPerPath = requiredUnits + reliability.spareUnits;
  const topologyUnits = reliability.pathCount === 2 ? requiredUnits * 2 : unitsPerPath;
  const equipmentAvailability = atLeastNAvailability(requiredUnits, unitsPerPath, source.moduleAvailability);
  const downstreamAvailability = 0.9994 * 0.9996 * 0.9997;
  const pathAvailability = equipmentAvailability * downstreamAvailability;
  const topologyAvailability = reliability.pathCount === 2
    ? (1 - (1 - pathAvailability) ** 2) * reliability.commonModeFactor
    : pathAvailability * reliability.commonModeFactor;
  const screenedAvailability = clamp(topologyAvailability + (1 - topologyAvailability) * backup.transferSuccess, 0, 0.9999999);
  const outageMinutesYear = (1 - screenedAvailability) * 525600;
  const batteryUsableMwh = selectedMw * backup.batteryHours;
  const storageDerate = Math.max(0.01, (backup.usableSoc || 1) * (backup.dischargeEfficiency || 1) * (1 - (backup.degradationReservePct || 0)));
  const batteryNameplateMwh = batteryUsableMwh / storageDerate;
  const bessContainers = batteryNameplateMwh > 0 ? Math.ceil(batteryNameplateMwh / 5) : 0;
  const generatorActive = backup.generatorUnitMw > 0 ? Math.ceil(selectedMw / backup.generatorUnitMw) : 0;
  const generatorInstalled = generatorActive > 0 ? generatorActive + 1 : 0;
  const generatorNameplateMw = generatorInstalled * (backup.generatorUnitMw || 0);
  const fuelLiters = backup.fuelLitersPerKwh > 0
    ? selectedMw * 1000 * backup.autonomyHours * backup.fuelLitersPerKwh
    : 0;
  const fuelTankModules = fuelLiters > 0 ? Math.ceil(fuelLiters / 50000) : 0;
  const backupFootprintM2 = state.engine.backup === "none"
    ? 0
    : Math.round(
      bessContainers * 38
        + generatorInstalled * 55
        + fuelTankModules * 32
        + (backup.generatorFuel === "Pipeline gas" ? 80 : 0)
        + 96
    );
  const backupResilienceScore = backupProfileResilienceScore(backup);
  const rechargeMw = batteryNameplateMwh > 0 ? Math.min(selectedMw * 0.25, Math.max(1, batteryNameplateMwh / 8)) : 0;
  const rechargeHours = rechargeMw > 0 ? batteryNameplateMwh / rechargeMw : 0;
  const pvNameplateMw = source.requiresFirming ? selectedMw / source.capacityFactor : 0;
  const sourceUnits = source.requiresFirming ? Math.ceil(pvNameplateMw / source.unitMw) : topologyUnits;
  const sourceFuelInputMwth = source.fuelType ? selectedMw / Math.max(0.01, source.conversionEfficiency) : 0;
  const sourceWasteHeatMw = Math.max(0, sourceFuelInputMwth - selectedMw);
  const sourceGasFlowMmscfd = source.fuelType === "Pipeline natural gas"
    ? sourceFuelInputMwth * 86400 / 37.3 * 35.3147 / 1e6
    : 0;
  const sourcePackageFootprintM2 = (source.packageLengthM || 0) * (source.packageWidthM || 0);
  const sourceYardEnvelopeM2 = sourcePackageFootprintM2 > 0
    ? Math.ceil(sourceUnits * sourcePackageFootprintM2 * 3.5)
    : 0;
  const pipelineGasPrimary = source.fuelType === "Pipeline natural gas";
  const firmingStatus = source.requiresFirming
    ? backup.generatorUnitMw > 0
      ? "Hybrid reserve / dispatch study required"
      : backup.batteryHours >= 2
      ? "Storage-coupled / dispatch study required"
      : "Not 24/7 firm"
    : "Firm source screen";
  const warning = source.requiresFirming && backup.batteryHours < 2 && generatorActive === 0
    ? "Solar alone cannot carry the critical load; add storage and grid-forming controls."
    : pipelineGasPrimary && backup.generatorFuel === "Pipeline gas"
      ? "Primary and standby gas share a fuel common mode; diversify the reserve path."
      : state.engine.backup === "none"
        ? "No ride-through or long-duration source is installed."
        : state.engine.powerSource === "gasTurbine"
          ? "Validate firm gas transport, air permit, SCR, islanding controls and turbine-foundation dynamics."
        : backup.generatorUnitMw === 0 && backup.autonomyHours < 4
          ? `${backup.shortLabel} does not cover a long-duration utility outage.`
          : backup.generatorFuel === "HVO"
            ? "Validate air permit, HVO delivery contract, tank fire code and quarterly black-start test."
            : "Screening result; validate utility, fuel, protection and controls studies.";
  const reliabilityState = outageMinutesYear <= 5 ? "Resilient" : outageMinutesYear <= 60 ? "Review" : "Exposed";
  const backupSequence = [
    { window: "0-20 ms", source: "Rack DC-link", duty: "GPU ride-through", state: "Clear" },
    ...(state.engine.backup === "none" ? [] : [
      { window: "20 ms-10 s", source: "800V sidecar / supercap", duty: "Fast-cycle transient", state: "Clear" }
    ]),
    ...(batteryUsableMwh > 0 ? [
      { window: `10 s-${Math.round(backup.batteryHours * 60)} min`, source: backup.storageLabel, duty: `${batteryUsableMwh.toFixed(1)} MWh usable bridge`, state: "Clear" }
    ] : []),
    ...(generatorActive > 0 ? [
      { window: `${backup.generatorStartSeconds} s-${backup.autonomyHours} h`, source: `${backup.generatorFuel} gensets`, duty: `${generatorActive}+1 x ${backup.generatorUnitMw.toFixed(1)} MW`, state: "Clear" }
    ] : [])
  ];
  const backupGates = [
    { label: "Ride-through", state: state.engine.backup === "none" ? "Gate" : "Clear", detail: state.engine.backup === "none" ? "No bridge source." : `${backup.batteryHours * 60} min battery bridge.` },
    { label: "Long duration", state: backup.autonomyHours >= 24 ? "Clear" : backup.autonomyHours >= 2 ? "Watch" : "Gate", detail: `${backup.autonomyHours.toFixed(1)} h modeled autonomy.` },
    { label: "Black start", state: backup.blackStart ? "Clear" : "Gate", detail: backup.blackStart ? "Controller and DC bus restart path included." : "No black-start path." },
    { label: "Fuel diversity", state: pipelineGasPrimary && backup.generatorFuel === "Pipeline gas" ? "Gate" : generatorActive > 0 ? "Clear" : "Watch", detail: generatorActive > 0 ? `${backup.generatorFuel} standby path.` : "Battery-only reserve." },
    { label: "Recharge", state: rechargeHours > 12 ? "Watch" : batteryNameplateMwh > 0 ? "Clear" : "Watch", detail: batteryNameplateMwh > 0 ? `${rechargeMw.toFixed(1)} MW / ${rechargeHours.toFixed(1)} h recovery.` : "No storage recharge plan." }
  ];
  return {
    source,
    sourceKey: state.engine.powerSource,
    reliability,
    reliabilityKey: state.engine.reliability,
    backup,
    backupKey: state.engine.backup,
    selectedMw,
    requiredUnits,
    topologyUnits,
    sourceUnits,
    sourceNameplateMw: source.requiresFirming ? pvNameplateMw : topologyUnits * source.unitMw,
    sourceSiteNameplateMw: source.requiresFirming ? pvNameplateMw : topologyUnits * effectiveUnitMw,
    sourceUnitLoadPct: clamp(selectedMw / Math.max(effectiveUnitMw * requiredUnits, 0.01) * 100, 0, 120),
    turbineSite,
    sourceFuelInputMwth,
    sourceWasteHeatMw,
    sourceGasFlowMmscfd,
    sourcePackageFootprintM2,
    sourceYardEnvelopeM2,
    batteryMwh: batteryNameplateMwh,
    batteryUsableMwh,
    batteryNameplateMwh,
    storageDerate,
    bessContainers,
    generatorActive,
    generatorInstalled,
    generatorNameplateMw,
    fuelLiters,
    fuelTankModules,
    backupFootprintM2,
    backupResilienceScore,
    rechargeMw,
    rechargeHours,
    backupSequence,
    backupGates,
    pathAvailability,
    screenedAvailability,
    availabilityPct: screenedAvailability * 100,
    outageMinutesYear,
    reliabilityState,
    firmingStatus,
    warning,
    basis: "Reliability screen, not Uptime Tier certification"
  };
}

function computeValues(block) {
  const program = activeProgram();
  const platform = activeComputePlatform();
  const rack = activeRackProfile();
  const stack = activeSoftwareStack();
  const workload = activeWorkloadProfile();
  const rackKw = (platform.ratedRackKw || program.rackKw * platform.powerFactor) * rack.densityFactor * workload.powerFactor;
  const computeMw = (rackKw * block.racks) / 1000;
  const acceleratorsPerRack = platform.acceleratorsPerRack;
  const accelerators = block.racks * acceleratorsPerRack;
  const memoryTb = (accelerators * platform.memoryGb * workload.memoryFactor) / 1024;
  const fabricTbps = platform.fabricTbps * Math.max(1, block.racks / 8) * rack.fabricFactor;
  const softwareFit = clamp(stack.compat[platform.softwareFamily] ?? stack.compat.mixed ?? 70, 0, 100);
  const fabricFit = clamp(100 - Math.max(0, workload.fabricNeed - fabricTbps / Math.max(1, block.racks)) * 0.65, 28, 100);
  const rackService = rack.serviceability;
  const siliconRisk = platform.vendor === "Semi-custom" ? 18 : platform.vendor === "Google" ? 10 : 6;
  const deployRisk = clamp(100 - (softwareFit * 0.35 + fabricFit * 0.28 + rackService * 0.22) + siliconRisk, 0, 100);
  const tokensPerMwIndex = clamp(Math.round((softwareFit * 0.34 + fabricFit * 0.28 + rackService * 0.16 + (100 - deployRisk) * 0.22)), 0, 100);
  const color = deployRisk > 54 ? "#dd7344" : deployRisk > 34 ? "#d9a441" : "#2aa876";
  const stateLabel = deployRisk > 54 ? "Re-architect" : deployRisk > 34 ? "Integrate" : "Ready";
  return {
    program,
    platform,
    rack,
    stack,
    workload,
    rackKw,
    computeMw,
    acceleratorsPerRack,
    accelerators,
    memoryTb,
    fabricTbps,
    softwareFit,
    fabricFit,
    rackService,
    deployRisk,
    tokensPerMwIndex,
    color,
    stateLabel
  };
}

function softwareValues(block) {
  const compute = computeValues(block);
  const policy = activeSoftwarePolicy();
  const ops = operationsTwinValues(block);
  const mismatchPenalty = Math.max(0, 70 - compute.softwareFit);
  const dataPlaneScore = clamp(compute.stack.runtimeScore * 0.34 + compute.fabricFit * 0.24 + compute.softwareFit * 0.42 - mismatchPenalty * 0.18, 0, 100);
  const controlPlaneScore = clamp(compute.stack.controlScore * 0.72 + compute.rackService * 0.18 + policy.releaseBias, 0, 100);
  const observabilityScore = clamp(compute.stack.observabilityScore + (state.prefab >= 72 ? 4 : 0) - (block.scan === "hold" ? 8 : block.scan === "delta" ? 4 : 0), 0, 100);
  const securityScore = clamp(compute.stack.securityScore + (compute.platform.vendor === "AWS" || compute.platform.vendor === "Google" ? 4 : 0), 0, 100);
  const portabilityScore = clamp(compute.stack.portabilityScore - (compute.platform.vendor === "NVIDIA" && compute.stack.label !== "CUDA / Run:ai" ? 4 : 0), 0, 100);
  const queueP95Min = clamp((18 + compute.deployRisk * 0.42 + Math.max(0, 82 - compute.fabricFit) * 0.28) * policy.queueBias, 4, 90);
  const rollbackMin = clamp(12 + (100 - observabilityScore) * 0.32 + (100 - securityScore) * 0.18, 8, 48);
  const gridFlexScore = clamp(energyValues(block).transientScore * 0.45 + policy.energyFlex * 46 + (state.bridge ? 8 : 0), 0, 100);
  const releaseScore = clamp(Math.round(
    dataPlaneScore * 0.23 +
    controlPlaneScore * 0.2 +
    observabilityScore * 0.18 +
    securityScore * 0.16 +
    portabilityScore * 0.1 +
    gridFlexScore * 0.13 -
    mismatchPenalty * 0.45 -
    Math.max(0, ops.riskScore - 62) * 0.18
  ), 0, 100);
  const color = releaseScore < 58 || compute.softwareFit < 55 ? "#dd7344" : releaseScore < 74 || compute.softwareFit < 72 ? "#d9a441" : "#2aa876";
  const stateLabel = color === "#dd7344" ? "Block" : color === "#d9a441" ? "Harden" : "Release";
  const planes = [
    ["Control", compute.stack.scheduler, controlPlaneScore],
    ["Runtime", compute.stack.runtime, dataPlaneScore],
    ["Data", `${compute.memoryTb.toFixed(1)} TB HBM pool`, portabilityScore],
    ["Telemetry", compute.stack.observability, observabilityScore],
    ["Security", compute.stack.security, securityScore],
    ["Policy", policy.placement, gridFlexScore]
  ];
  return {
    compute,
    policy,
    ops,
    dataPlaneScore,
    controlPlaneScore,
    observabilityScore,
    securityScore,
    portabilityScore,
    queueP95Min,
    rollbackMin,
    gridFlexScore,
    releaseScore,
    color,
    stateLabel,
    planes
  };
}

function energyValues(block) {
  const compute = computeValues(block);
  const fluid = fluidValues(block);
  const feeder = feeders[block.feeder];
  const demandMw = Math.max(block.mw, compute.computeMw);
  const facilityMw = demandMw * (1.035 + fluid.pumpKw / Math.max(1, demandMw * 1000));
  const busCurrentA = (facilityMw * 1000000) / 800;
  const feederUsePct = clamp((feederLiveDemand(block.feeder) + facilityMw * 0.35) / feeder.capacity * 100, 0, 140);
  const powerSystem = powerSystemForTarget(state.engine.powerMw);
  const conversionLossKw = facilityMw * 1000 * (1 - powerSystem.source.conversionEfficiency);
  const bridgeKwh = facilityMw * 1000 * powerSystem.backup.batteryHours;
  const currentReductionPct = clamp(100 - 54 / 800 * 100, 0, 100);
  const transientScore = clamp(100 - Math.max(0, compute.deployRisk - 20) * 0.8 + (state.bridge ? 12 : -10), 0, 100);
  const color = feederUsePct > 92 || transientScore < 54 ? "#dd7344" : feederUsePct > 74 || transientScore < 70 ? "#d9a441" : "#2aa876";
  const stateLabel = color === "#dd7344" ? "Constrain" : color === "#d9a441" ? "Buffer" : "Ready";
  return {
    compute,
    fluid,
    feeder,
    demandMw,
    facilityMw,
    busCurrentA,
    feederUsePct,
    conversionLossKw,
    bridgeKwh,
    currentReductionPct,
    transientScore,
    powerSystem,
    color,
    stateLabel
  };
}

function foundationTypeFor(site, program, allowableBearingKpa) {
  if (site.liquefaction === "High" || allowableBearingKpa < 100) return site.foundationHint;
  if (program.loadMultiplier > 1.2 && allowableBearingKpa < 170) return "Rigid mat + grade beams";
  if (allowableBearingKpa > 240 && site.liquefaction === "Low") return "Spread footings + equipment mat";
  return site.foundationHint;
}

function deriveFoundationAssumption(block) {
  const program = activeProgram();
  const site = activeSite();
  const tier = activeSeismicTier();
  const liquefactionFactor = site.liquefaction === "High" ? 0.78 : site.liquefaction === "Med" ? 0.9 : 1;
  const allowableBearingKpa = Math.round(site.allowableBearingKpa * liquefactionFactor);
  const footprintM2 = Math.round(program.footprintM2 + block.racks * 0.65);
  const matThicknessM = Number((0.36 + program.loadMultiplier * 0.14 + (site.liquefaction === "High" ? 0.18 : 0) + tier.matBonusM).toFixed(2));
  const gradeBeamDepthM = Number((0.68 + program.loadMultiplier * 0.18 + (site.siteClass === "E" ? 0.24 : 0.08)).toFixed(2));
  const anchorCount = program.anchorCount + tier.anchorBonus;
  const seismicG = Number((site.seismicG * tier.gMultiplier).toFixed(2));
  const settlementLimitMm = Math.min(site.settlementLimitMm, program.settlementLimitMm);
  const type = foundationTypeFor(site, program, allowableBearingKpa);
  return {
    type,
    program,
    site,
    tier,
    footprintM2,
    matThicknessM,
    gradeBeamDepthM,
    allowableBearingKpa,
    settlementLimitMm,
    seismicG,
    anchorCount,
    pileDepthM: type.includes("Pile") || type.includes("piles") ? site.pileDepthM : 0,
    liquefaction: site.liquefaction,
    groundwater: site.groundwater,
    siteClass: site.siteClass
  };
}

function mechanicsValues(block) {
  const foundation = deriveFoundationAssumption(block);
  const compute = computeValues(block);
  const software = softwareValues(block);
  const status = statusFor(block);
  const constructionLoad = status === "build" ? 1.08 : status === "loaded" ? 1.18 : status === "energized" ? 1.1 : 0.92;
  const scaledMw = Math.max(block.mw * foundation.program.loadMultiplier, compute.computeMw);
  const rackMassTon = block.racks * (1.4 + foundation.program.rackKw / 360 + compute.rack.rackMassTon * 0.16);
  const equipmentMassTon = scaledMw * (foundation.program.electricalTonPerMw + foundation.program.coolingTonPerMw);
  const podMassTon = 32 + foundation.program.structuralTonAdd + rackMassTon + equipmentMassTon + foundation.program.batteryTon;
  const serviceMassTon = podMassTon * constructionLoad;
  const sitePenaltyKpa = foundation.liquefaction === "High" ? 18 : foundation.liquefaction === "Med" ? 9 : 0;
  const superimposedKpa = 42 + block.racks * 0.8 + scaledMw * 2.8 + sitePenaltyKpa;
  const bearingKpa = (serviceMassTon * 9.81) / foundation.footprintM2 + superimposedKpa;
  const bearingUtilPct = clamp((bearingKpa / foundation.allowableBearingKpa) * 100, 0, 160);
  const settlementMultiplier = foundation.liquefaction === "High" ? 1.28 : foundation.liquefaction === "Med" ? 1.12 : 0.82;
  const settlementMm = clamp((2.8 + bearingUtilPct * 0.065 + (block.scan === "hold" ? 2.2 : block.scan === "delta" ? 0.9 : 0)) * settlementMultiplier, 2, 24);
  const seismicBaseShearKn = serviceMassTon * 9.81 * foundation.seismicG;
  const anchorTensionKn = seismicBaseShearKn * 1.35 / foundation.anchorCount;
  const frameDriftMm = clamp(2.4 + foundation.seismicG * 12 + (block.scan === "hold" ? 2.4 : 0.6), 2, 14);
  const governingRatio = Math.max(bearingUtilPct, (settlementMm / foundation.settlementLimitMm) * 100);
  const color = mechanicsColor(governingRatio);
  const stateLabel = governingRatio > 92 ? "Redesign" : governingRatio > 72 ? "Watch" : "OK";
  return {
    foundation,
    scaledMw,
    rackMassTon,
    equipmentMassTon,
    podMassTon,
    serviceMassTon,
    bearingKpa,
    bearingUtilPct,
    settlementMm,
    seismicBaseShearKn,
    anchorTensionKn,
    frameDriftMm,
    governingRatio,
    color,
    stateLabel,
    compute
  };
}

function fluidValues(block) {
  const foundation = deriveFoundationAssumption(block);
  const compute = computeValues(block);
  const ops = operationsTwinValues(block);
  const designMw = Number(Math.max(block.mw * foundation.program.loadMultiplier, compute.computeMw).toFixed(2));
  const activeMw = Math.max(ops.liveMw, Math.min(designMw, block.mw));
  const heatKw = activeMw * 1000;
  const deltaTC = foundation.program.loadMultiplier > 1.2 ? 9 : foundation.program.loadMultiplier < 0.9 ? 12 : compute.rack.coolingFactor > 1 ? 9 : 10;
  const cpKjKgK = 4.186;
  const densityKgM3 = 997;
  const dynamicViscosity = 0.00072;
  const massFlowKgS = heatKw / (cpKjKgK * deltaTC);
  const flowLpm = massFlowKgS * 60;
  const designMassFlowKgS = designMw * 1000 / (cpKjKgK * deltaTC);
  const designFlowLpm = designMassFlowKgS * 60;
  const targetHeaderVelocityMs = 2.1;
  const requiredDiameterM = Math.sqrt((4 * (designMassFlowKgS / densityKgM3)) / (Math.PI * targetHeaderVelocityMs));
  const nominalDiametersM = [0.1, 0.125, 0.15, 0.2, 0.25, 0.3, 0.35];
  const pipeDiameterM = nominalDiametersM.find((diameter) => diameter >= requiredDiameterM) || nominalDiametersM.at(-1);
  const areaM2 = Math.PI * (pipeDiameterM / 2) ** 2;
  const velocityMs = (massFlowKgS / densityKgM3) / areaM2;
  const reynolds = (densityKgM3 * velocityMs * pipeDiameterM) / dynamicViscosity;
  const frictionFactor = reynolds > 4000 ? 0.3164 / Math.pow(reynolds, 0.25) : 64 / Math.max(1, reynolds);
  const loopLengthM = 34 + block.racks * 2.8;
  const pressureDropKpa = (frictionFactor * (loopLengthM / pipeDiameterM) * densityKgM3 * velocityMs ** 2 / 2) / 1000 + 32 + block.racks * 2.2;
  const pumpKw = (pressureDropKpa * 1000 * (massFlowKgS / densityKgM3)) / (0.72 * 1000);
  const flowUtilPct = clamp(Math.max((velocityMs / 2.4) * 100, (pressureDropKpa / 95) * 100), 0, 160);
  const color = mechanicsColor(flowUtilPct);
  const stateLabel = flowUtilPct > 92 ? "Rebalance" : flowUtilPct > 72 ? "Watch" : "OK";
  return {
    foundation,
    ops,
    designMw,
    activeMw,
    heatKw,
    deltaTC,
    massFlowKgS,
    flowLpm,
    designMassFlowKgS,
    designFlowLpm,
    rackFlowLpm: flowLpm / block.racks,
    pipeDiameterM,
    velocityMs,
    reynolds,
    pressureDropKpa,
    pumpKw,
    flowUtilPct,
    color,
    stateLabel,
    compute
  };
}

function thermalValues(block) {
  const fluid = fluidValues(block);
  const program = fluid.foundation.program;
  const rackKw = fluid.compute.rackKw;
  const isWarmWaterRack = fluid.compute.platform.cooling.includes("45C");
  const supplyC = isWarmWaterRack ? 36 : program.loadMultiplier > 1.2 || fluid.compute.rack.coolingFactor > 1 ? 30 : 32;
  const returnC = supplyC + fluid.deltaTC;
  const heatFluxKwM2 = rackKw / (block.racks >= 8 ? 2.4 : 2.1);
  const thermalLimitC = isWarmWaterRack ? 58 : 48;
  const coldPlateC = returnC + 3.2 + fluid.velocityMs * 0.55 + (fluid.compute.workload.coolingBias - 1) * 7 + (block.scan === "hold" ? 3 : block.scan === "delta" ? 1.2 : 0);
  const coolantApproachC = coldPlateC - supplyC;
  const heatReuseKw = fluid.heatKw * (state.bridge ? 0.16 : 0.08);
  const thermalMarginC = clamp(thermalLimitC - coldPlateC + (state.prefab - 62) * 0.04, 0, 24);
  const pueProxy = 1.04 + fluid.pumpKw / Math.max(1, fluid.heatKw) + (thermalMarginC < 8 ? 0.035 : 0.012);
  const thermalUtilPct = clamp(Math.max((coldPlateC / thermalLimitC) * 100, (fluid.heatKw / Math.max(1, block.racks * rackKw)) * 100), 0, 160);
  const color = thermalUtilPct > 92 || thermalMarginC < 5 ? "#dd7344" : thermalUtilPct > 74 || thermalMarginC < 10 ? "#d9a441" : "#2aa876";
  const stateLabel = color === "#dd7344" ? "Hot" : color === "#d9a441" ? "Watch" : "Stable";
  return {
    fluid,
    rackKw,
    supplyC,
    returnC,
    thermalLimitC,
    heatFluxKwM2,
    coldPlateC,
    coolantApproachC,
    heatReuseKw,
    pueProxy,
    thermalMarginC,
    thermalUtilPct,
    color,
    stateLabel
  };
}

function coolingArchitectureValues(block) {
  const supplier = activeModularSupply();
  const compute = computeValues(block);
  const fluid = fluidValues(block);
  const thermal = thermalValues(block);
  const cduBlockMw = supplier.cduBlockMw;
  const activeCduUnits = Math.max(1, Math.ceil(fluid.designMw / cduBlockMw));
  const installedCduUnits = activeCduUnits + 1;
  const activePumps = Math.max(1, Math.ceil(fluid.designFlowLpm / 3000));
  const installedPumps = activePumps + 1;
  const rowManifolds = Math.max(1, Math.ceil(block.racks / 4));
  const cpuPerRack = compute.platform.cpuPerRack || Math.max(8, Math.round(compute.acceleratorsPerRack / 4));
  const coldPlateCircuits = block.racks * (compute.acceleratorsPerRack + cpuPerRack);
  const installedCapacityMw = installedCduUnits * cduBlockMw;
  const designMarginPct = Math.max(0, (installedCapacityMw / Math.max(0.01, fluid.designMw) - 1) * 100);
  return {
    supplier,
    compute,
    fluid,
    thermal,
    cduBlockMw,
    activeCduUnits,
    installedCduUnits,
    activePumps,
    installedPumps,
    rowManifolds,
    rackQdPairs: block.racks,
    quickDisconnects: block.racks * 2,
    coldPlateCircuits,
    leakZones: Math.ceil(block.racks / 2) + 1,
    installedCapacityMw,
    designMarginPct,
    topology: "FWS > plate HX > N+1 CDU pumps > row manifold > rack QD > GPU / CPU cold plates",
    controls: "DP reset / conductivity / leak rope / supply-return temperature / rack flow"
  };
}

function capacityPlanValues(block) {
  const compute = computeValues(block);
  const fluid = fluidValues(block);
  const thermal = thermalValues(block);
  const cooling = coolingArchitectureValues(block);
  const foundation = deriveFoundationAssumption(block);
  const power = powerSystemForTarget(state.engine.powerMw);
  const reservePct = clamp(Number(state.engine.reservePct) || 15, 5, 30);
  const designPue = clamp(thermal.pueProxy, 1.01, 1.4);
  const usableFacilityMw = power.selectedMw * (1 - reservePct / 100);
  const siteItBudgetMw = usableFacilityMw / designPue;
  const deployableRacks = Math.max(1, Math.floor(siteItBudgetMw * 1000 / compute.rackKw));
  const rackSlotsPerPod = block.racks;
  const requiredPods = Math.ceil(deployableRacks / rackSlotsPerPod);
  const fullPods = Math.floor(deployableRacks / rackSlotsPerPod);
  const partialPodRacks = deployableRacks % rackSlotsPerPod;
  const modeledRackSlots = modules.reduce((sum, item) => sum + item.racks, 0);
  const siteItMw = deployableRacks * compute.rackKw / 1000;
  const siteFacilityMw = siteItMw * designPue;
  const headroomMw = Math.max(0, power.selectedMw - siteFacilityMw);
  const siteUtilizationPct = siteFacilityMw / Math.max(0.01, power.selectedMw) * 100;
  const siteAccelerators = deployableRacks * compute.acceleratorsPerRack;
  const poweredRacks = Math.min(block.racks, Math.max(0, Math.floor(block.mw * 1000 / compute.rackKw)));
  const stagedRacks = Math.max(0, block.racks - poweredRacks);
  const energizedAccelerators = poweredRacks * compute.acceleratorsPerRack;
  const podRequiredItMw = compute.computeMw;
  const podCapacityGapMw = Math.max(0, podRequiredItMw - block.mw);
  const podFitPct = clamp(block.mw / Math.max(0.01, podRequiredItMw) * 100, 0, 100);
  const topologyInstalled = (active) => power.reliabilityKey === "twoN"
    ? active * 2
    : power.reliabilityKey === "nPlus1"
      ? active + 1
      : active;
  const activeRectifierBlocks = Math.max(1, Math.ceil(power.selectedMw / 10));
  const installedRectifierBlocks = topologyInstalled(activeRectifierBlocks);
  const activeSourceUnits = power.source.requiresFirming ? power.sourceUnits : power.requiredUnits;
  const siteCduActive = Math.max(1, Math.ceil(siteItMw / cooling.cduBlockMw));
  const siteCduInstalled = siteCduActive + 1;
  const flowPerItMw = fluid.designFlowLpm / Math.max(0.01, fluid.designMw);
  const siteDesignFlowLpm = siteItMw * flowPerItMw;
  const sitePumpActive = Math.max(1, Math.ceil(siteDesignFlowLpm / 3000));
  const sitePumpInstalled = sitePumpActive + 1;
  const bessContainers = power.bessContainers;
  const networkSpines = Math.max(2, Math.ceil(deployableRacks / 32) * 2);
  const anchors = requiredPods * foundation.anchorCount;
  const equipmentSchedule = [
    {
      id: "primary",
      system: power.source.moduleLabel,
      duty: activeSourceUnits,
      installed: power.sourceUnits,
      unit: "blocks",
      basis: `${power.sourceNameplateMw.toFixed(0)} MW nameplate / ${power.reliability.label}`
    },
    {
      id: "conversion",
      system: "10 MW SST / rectifier",
      duty: activeRectifierBlocks,
      installed: installedRectifierBlocks,
      unit: "skids",
      basis: "Critical bus conversion topology"
    },
    {
      id: "pods",
      system: "Steel compute pod",
      duty: requiredPods,
      installed: requiredPods,
      unit: "pods",
      basis: `${rackSlotsPerPod} rack slots per pod`
    },
    {
      id: "racks",
      system: compute.platform.label,
      duty: deployableRacks,
      installed: deployableRacks,
      unit: "racks",
      basis: `${compute.rackKw.toFixed(0)} kW/rack / ${siteAccelerators.toLocaleString()} accelerators`
    },
    {
      id: "cooling",
      system: `${cooling.cduBlockMw.toFixed(1)} MW modular CDU`,
      duty: siteCduActive,
      installed: siteCduInstalled,
      unit: "CDUs",
      basis: `${Math.round(siteDesignFlowLpm).toLocaleString()} L/min site design flow`
    },
    {
      id: "pumps",
      system: "DLC pump module",
      duty: sitePumpActive,
      installed: sitePumpInstalled,
      unit: "pumps",
      basis: "3,000 L/min duty per pump"
    },
    {
      id: "backup",
      system: "5 MWh BESS container",
      duty: bessContainers,
      installed: bessContainers,
      unit: "containers",
      basis: `${power.batteryUsableMwh.toFixed(1)} MWh usable / ${power.batteryNameplateMwh.toFixed(1)} MWh nameplate`
    },
    ...(power.generatorInstalled ? [{
      id: "standby",
      system: `${power.backup.generatorUnitMw.toFixed(1)} MW ${power.backup.generatorFuel} genset`,
      duty: power.generatorActive,
      installed: power.generatorInstalled,
      unit: "gensets",
      basis: `${power.backup.generatorStartSeconds} s start / ${power.backup.autonomyHours} h autonomy`
    }] : []),
    ...(power.fuelTankModules ? [{
      id: "fuel",
      system: "50,000 L protected fuel tank",
      duty: power.fuelTankModules,
      installed: power.fuelTankModules,
      unit: "tanks",
      basis: `${Math.round(power.fuelLiters).toLocaleString()} L ${power.backup.generatorFuel} planning screen`
    }] : []),
    {
      id: "network",
      system: "Dual-fabric spine pair",
      duty: networkSpines,
      installed: networkSpines,
      unit: "spines",
      basis: "One redundant pair per 32 racks"
    }
  ];
  const gates = [
    {
      label: "Pod power fit",
      state: stagedRacks > 0 ? "Gate" : "Clear",
      detail: stagedRacks > 0
        ? `${poweredRacks}/${block.racks} racks energizable; add ${podCapacityGapMw.toFixed(2)} MW or phase ${stagedRacks} racks.`
        : `${block.racks}/${block.racks} racks fit the ${block.mw.toFixed(1)} MW allocation.`
    },
    {
      label: "Modeled site fit",
      state: requiredPods > modules.length ? "Gate" : "Clear",
      detail: requiredPods > modules.length
        ? `${requiredPods} pods required; current 3D site has ${modules.length}.`
        : `${requiredPods}/${modules.length} pods and ${deployableRacks}/${modeledRackSlots} rack slots used.`
    },
    {
      label: "Capacity reserve",
      state: headroomMw + 0.01 >= power.selectedMw * reservePct / 100 ? "Clear" : "Watch",
      detail: `${headroomMw.toFixed(2)} MW headroom / ${reservePct.toFixed(0)}% target.`
    },
    {
      label: "Cooling train",
      state: cooling.designMarginPct < 10 ? "Gate" : cooling.designMarginPct < 18 ? "Watch" : "Clear",
      detail: `${cooling.activeCduUnits}+1 pod CDU / ${cooling.designMarginPct.toFixed(0)}% installed margin.`
    },
    {
      label: "Primary + reserve",
      state: power.source.requiresFirming && power.backup.batteryHours < 2 && power.generatorActive === 0
        ? "Gate"
        : power.reliabilityState === "Exposed"
          ? "Gate"
          : power.reliabilityState === "Review"
            ? "Watch"
            : "Clear",
      detail: `${power.source.shortLabel} / ${power.backup.shortLabel} / ${power.availabilityPct.toFixed(5)}% screen.`
    },
    {
      label: "Foundation basis",
      state: foundation.liquefaction === "High" ? "Watch" : "Clear",
      detail: `${foundation.type} / ${foundation.anchorCount} anchors per pod / ${foundation.pileDepthM || 0} m piles.`
    }
  ];
  const gateCount = gates.filter((item) => item.state === "Gate").length;
  const watchCount = gates.filter((item) => item.state === "Watch").length;
  const releaseState = gateCount ? "Revise basis" : watchCount ? "Engineering review" : "Capacity fit";
  const nextDecision = stagedRacks > 0
    ? `Phase ${poweredRacks} energized racks per ${block.id} pod or increase the pod IT allocation to ${podRequiredItMw.toFixed(2)} MW.`
    : requiredPods > modules.length
      ? `Add ${requiredPods - modules.length} pod positions to the site layout.`
      : power.source.requiresFirming && power.backup.batteryHours < 2 && power.generatorActive === 0
        ? "Size storage and grid-forming controls before solar is treated as firm capacity."
        : "Freeze equipment counts and issue vendor RFQs with the stated design basis.";
  return {
    power,
    compute,
    fluid,
    thermal,
    cooling,
    foundation,
    reservePct,
    designPue,
    usableFacilityMw,
    siteItBudgetMw,
    siteItMw,
    siteFacilityMw,
    headroomMw,
    siteUtilizationPct,
    deployableRacks,
    siteAccelerators,
    requiredPods,
    fullPods,
    partialPodRacks,
    rackSlotsPerPod,
    modeledRackSlots,
    poweredRacks,
    stagedRacks,
    energizedAccelerators,
    podRequiredItMw,
    podCapacityGapMw,
    podFitPct,
    activeRectifierBlocks,
    installedRectifierBlocks,
    siteCduActive,
    siteCduInstalled,
    siteDesignFlowLpm,
    sitePumpActive,
    sitePumpInstalled,
    bessContainers,
    generatorActive: power.generatorActive,
    generatorInstalled: power.generatorInstalled,
    fuelLiters: power.fuelLiters,
    fuelTankModules: power.fuelTankModules,
    networkSpines,
    anchors,
    equipmentSchedule,
    gates,
    gateCount,
    watchCount,
    releaseState,
    nextDecision
  };
}

function supplyChainValues(block = selectedBlock(), strategyOverride = null, shockOverride = null) {
  const strategyKey = supplyStrategies[strategyOverride] ? strategyOverride : state.engine.supplyStrategy || "balanced";
  const shockKey = supplyShockProfiles[shockOverride] ? shockOverride : state.engine.supplyShock || "base";
  const strategy = supplyStrategies[strategyKey] || supplyStrategies.balanced;
  const shock = supplyShockProfiles[shockKey] || supplyShockProfiles.base;
  const capacity = capacityPlanValues(block);
  const quantityByNode = {
    silicon: `${capacity.siteAccelerators.toLocaleString()} GPU packages`,
    hbm: `${capacity.siteAccelerators.toLocaleString()} accelerator sets`,
    rack: `${capacity.deployableRacks} racks`,
    network: `${capacity.networkSpines} spines`,
    transformer: `${capacity.power.sourceUnits} source blocks`,
    power800: `${capacity.installedRectifierBlocks} conversion skids`,
    cooling: `${capacity.siteCduInstalled} CDUs`,
    bess: `${capacity.bessContainers} containers`,
    standby: `${capacity.generatorInstalled} gensets`,
    steel: `${capacity.requiredPods} pods`,
    controls: "2 redundant controllers"
  };
  const actionByNode = {
    silicon: "Reserve advanced-package capacity and approve the Arizona/Amkor qualification path.",
    hbm: "Qualify a second HBM source before accelerator configuration freeze.",
    rack: "Split rack integration across two MGX manufacturing partners.",
    network: "Freeze optical BOM and maintain an Ethernet fallback topology.",
    transformer: "Place transformer slot reservation before final utility design release.",
    power800: "Publish an open 800V interface and qualify a second sidecar supplier.",
    cooling: "Hold CDU alternates to the same OCP rack-manifold interface.",
    bess: "Qualify cell, PCS and fire-safety substitutions as separate packages.",
    standby: "Contract generator production and fuel logistics as independent workstreams.",
    steel: "Release two regional fabrication cells from one controlled model.",
    controls: "Lock Modbus, black-start and telemetry acceptance tests before FAT."
  };
  const nodes = globalSupplyNodes.map((node) => {
    const shockHit = shock.affected.includes(node.id);
    const strategyQualifies = node.qualifiable && strategyKey === "resilient";
    const localizedQualifies = node.localizable && strategyKey === "localized";
    const qualifiedAlternate = node.dualReady || strategyQualifies || localizedQualifies;
    const qualificationAdd = !node.dualReady && (strategyQualifies || localizedQualifies) ? strategy.qualificationWeeks : 0;
    const localizationReduction = localizedQualifies ? Math.min(8, Math.round(node.leadWeeks * 0.12)) : 0;
    const leadWeeks = Math.max(4, Math.ceil(
      node.leadWeeks * strategy.leadFactor +
      qualificationAdd +
      (shockHit ? shock.leadWeeks : 0) -
      localizationReduction
    ));
    const risk = clamp(Math.round(
      node.risk -
      strategy.riskRelief -
      (qualifiedAlternate ? 8 : 0) -
      (localizedQualifies ? 7 : 0) +
      (shockHit ? shock.riskAdd : 0)
    ), 8, 99);
    const status = risk >= 75 ? "Gate" : risk >= 55 ? "Watch" : "Clear";
    return {
      ...node,
      leadWeeks,
      risk,
      status,
      shockHit,
      qualifiedAlternate,
      quantity: quantityByNode[node.id] || "TBD",
      action: actionByNode[node.id]
    };
  });
  const totalWeight = nodes.reduce((sum, node) => sum + node.spendWeight, 0);
  const regions = ["APAC", "Europe", "North America", "California"].map((region) => {
    const regionNodes = nodes.filter((node) => node.region === region);
    return {
      region,
      exposurePct: Math.round(regionNodes.reduce((sum, node) => sum + node.spendWeight, 0) / totalWeight * 100),
      risk: regionNodes.length ? Math.round(regionNodes.reduce((sum, node) => sum + node.risk * node.spendWeight, 0) / regionNodes.reduce((sum, node) => sum + node.spendWeight, 0)) : 0,
      nodes: regionNodes
    };
  });
  const riskWeighted = nodes.reduce((sum, node) => sum + node.risk * node.spendWeight, 0) / totalWeight;
  const readiness = Math.round(clamp(100 - riskWeighted * 0.72, 0, 100));
  const criticalPath = [...nodes].sort((a, b) => b.leadWeeks - a.leadWeeks || b.risk - a.risk)[0];
  const singleSourceCount = nodes.filter((node) => !node.qualifiedAlternate).length;
  const dualSourceCoveragePct = Math.round((nodes.length - singleSourceCount) / nodes.length * 100);
  const gates = nodes.filter((node) => node.status === "Gate").length;
  const watches = nodes.filter((node) => node.status === "Watch").length;
  const releaseState = gates ? "Procurement gate" : watches ? "Controlled exposure" : "Release ready";
  const actions = [...nodes]
    .filter((node) => node.status !== "Clear" || !node.qualifiedAlternate)
    .sort((a, b) => b.risk - a.risk || b.leadWeeks - a.leadWeeks)
    .slice(0, 5)
    .map((node) => ({ id: node.id, label: node.component, state: node.status, action: node.action }));
  return {
    strategyKey,
    strategy,
    shockKey,
    shock,
    capacity,
    nodes,
    regions,
    readiness,
    criticalPath,
    singleSourceCount,
    dualSourceCoveragePct,
    localContentPct: strategy.localShare,
    costIndex: strategy.costIndex,
    gates,
    watches,
    releaseState,
    forecastReleaseWeek: state.week + criticalPath.leadWeeks,
    actions,
    basis: "Planning lead times and risk scores; replace with supplier RFQs and logistics commitments."
  };
}

function procurementScenarioValues(rawComponents, block, strategyKey, shockKey, selectedMw) {
  const chain = supplyChainValues(block, strategyKey, shockKey);
  const nodeById = Object.fromEntries(chain.nodes.map((node) => [node.id, node]));
  const components = rawComponents.map((item) => {
    const packageKey = procurementPackageByComponent[item.id] || "field";
    const packageProfile = procurementPackageCatalog[packageKey];
    const option = packageProfile.options[strategyKey] || packageProfile.options.balanced;
    const node = nodeById[packageProfile.nodeId] || { leadWeeks: 12, risk: 30, status: "Clear", qualifiedAlternate: true, shockHit: false };
    const shouldCostM = item.amountM;
    const baseQuoteM = roundCost(shouldCostM * option.quoteFactor);
    const freightM = roundCost(baseQuoteM * option.freightPct / 100);
    const dutyM = roundCost(baseQuoteM * option.dutyPct / 100);
    const leadWeeks = Math.max(4, node.leadWeeks + option.leadOffsetWeeks);
    const priceExposureWeeks = Math.max(0, leadWeeks - option.validityWeeks);
    const escalationPct = packageProfile.escalationAnnualPct * priceExposureWeeks / 52;
    const escalationM = roundCost(baseQuoteM * escalationPct / 100);
    const shockPremiumPct = node.shockHit ? chain.shock.costAddPct || 0 : 0;
    const shockPremiumM = roundCost(baseQuoteM * shockPremiumPct / 100);
    const landedCostM = roundCost(baseQuoteM + freightM + dutyM + escalationM + shockPremiumM);
    const riskReservePct = clamp(packageProfile.riskBasePct + node.risk * 0.025 - (node.qualifiedAlternate ? 0.8 : 0), 0.5, 6);
    const riskReserveM = roundCost(landedCostM * riskReservePct / 100);
    const riskAdjustedM = roundCost(landedCostM + riskReserveM);
    const quoteCoveragePct = item.included === false
      ? 0
      : clamp(
        packageProfile.coveragePct + (strategyKey === "resilient" ? 10 : strategyKey === "localized" ? 5 : 0) - (node.shockHit ? 8 : 0),
        0,
        100
      );
    const quoteStatus = item.included === false
      ? "Excluded"
      : quoteCoveragePct >= 70
        ? "Budgetary covered"
        : quoteCoveragePct >= 50
          ? "Budgetary"
          : "RFQ required";
    return {
      ...item,
      procurementPackage: packageKey,
      procurementCode: packageProfile.code,
      procurementLabel: packageProfile.label,
      procurementOwner: packageProfile.owner,
      supplier: option.supplier,
      origin: option.origin,
      allocation: option.allocation,
      incoterm: option.incoterm,
      currency: option.currency,
      paymentTerms: option.paymentTerms,
      validityWeeks: option.validityWeeks,
      htsFamily: packageProfile.htsFamily,
      ppiSeries: packageProfile.ppiSeries,
      quoteStatus,
      quoteCoveragePct,
      leadWeeks,
      supplyRisk: node.risk,
      supplyStatus: node.status,
      qualifiedAlternate: node.qualifiedAlternate,
      localContentPct: option.localContentPct,
      shouldCostM,
      baseQuoteM,
      freightM,
      dutyM,
      escalationPct: roundUnitCost(escalationPct),
      escalationM,
      shockPremiumPct,
      shockPremiumM,
      landedCostM,
      riskReservePct: roundUnitCost(riskReservePct),
      riskReserveM,
      riskAdjustedM,
      varianceM: roundCost(landedCostM - shouldCostM),
      amountM: landedCostM,
      shouldUnitCostM: item.unitCostM,
      unitCostM: roundUnitCost(landedCostM / Math.max(0.01, item.quantity)),
      amountPerMwM: roundPerMw(landedCostM, selectedMw),
      riskAdjustedPerMwM: roundPerMw(riskAdjustedM, selectedMw)
    };
  });
  const packageRows = Object.entries(procurementPackageCatalog).map(([packageKey, packageProfile]) => {
    const packageComponents = components.filter((item) => item.procurementPackage === packageKey);
    if (!packageComponents.length) return null;
    const includedComponents = packageComponents.filter((item) => item.included !== false);
    const sumField = (field, rows = packageComponents) => roundCost(rows.reduce((sum, item) => sum + (item[field] || 0), 0));
    const first = packageComponents[0];
    const amountM = sumField("amountM", includedComponents);
    const shouldCostM = sumField("shouldCostM", includedComponents);
    const riskAdjustedM = sumField("riskAdjustedM", includedComponents);
    return {
      key: packageKey,
      code: packageProfile.code,
      label: packageProfile.label,
      owner: packageProfile.owner,
      componentCount: packageComponents.length,
      included: includedComponents.length > 0,
      supplier: first.supplier,
      origin: first.origin,
      allocation: first.allocation,
      incoterm: first.incoterm,
      currency: first.currency,
      paymentTerms: first.paymentTerms,
      htsFamily: packageProfile.htsFamily,
      ppiSeries: packageProfile.ppiSeries,
      quoteStatus: first.quoteStatus,
      quoteCoveragePct: first.quoteCoveragePct,
      leadWeeks: first.leadWeeks,
      risk: first.supplyRisk,
      status: first.supplyStatus,
      qualifiedAlternate: first.qualifiedAlternate,
      localContentPct: first.localContentPct,
      shouldCostM,
      baseQuoteM: sumField("baseQuoteM", includedComponents),
      freightM: sumField("freightM", includedComponents),
      dutyM: sumField("dutyM", includedComponents),
      escalationM: sumField("escalationM", includedComponents),
      shockPremiumM: sumField("shockPremiumM", includedComponents),
      amountM,
      riskReserveM: sumField("riskReserveM", includedComponents),
      riskAdjustedM,
      varianceM: roundCost(amountM - shouldCostM),
      amountPerMwM: roundPerMw(amountM, selectedMw),
      riskAdjustedPerMwM: roundPerMw(riskAdjustedM, selectedMw)
    };
  }).filter(Boolean);
  const includedComponents = components.filter((item) => item.included !== false);
  const total = (field) => roundCost(includedComponents.reduce((sum, item) => sum + (item[field] || 0), 0));
  const landedCostM = total("amountM");
  const shouldCostM = total("shouldCostM");
  const riskReserveM = total("riskReserveM");
  const riskAdjustedM = total("riskAdjustedM");
  const weighted = (field) => landedCostM > 0
    ? Math.round(includedComponents.reduce((sum, item) => sum + (item[field] || 0) * item.amountM, 0) / landedCostM)
    : 0;
  const criticalPackage = [...packageRows]
    .filter((item) => item.included)
    .sort((a, b) => b.leadWeeks - a.leadWeeks || b.risk - a.risk || b.amountM - a.amountM)[0] || null;
  return {
    strategyKey,
    strategy: chain.strategy,
    shockKey,
    shock: chain.shock,
    chain,
    components,
    packages: packageRows,
    shouldCostM,
    baseQuoteM: total("baseQuoteM"),
    freightM: total("freightM"),
    dutyM: total("dutyM"),
    escalationM: total("escalationM"),
    shockPremiumM: total("shockPremiumM"),
    landedCostM,
    riskReserveM,
    riskAdjustedM,
    varianceM: roundCost(landedCostM - shouldCostM),
    savingsPct: shouldCostM > 0 ? roundUnitCost((shouldCostM - landedCostM) / shouldCostM * 100) : 0,
    quoteCoveragePct: weighted("quoteCoveragePct"),
    localContentPct: weighted("localContentPct"),
    singleSourceSpendPct: landedCostM > 0 ? Math.round(includedComponents.filter((item) => !item.qualifiedAlternate).reduce((sum, item) => sum + item.amountM, 0) / landedCostM * 100) : 0,
    openRfqCount: packageRows.filter((item) => item.included && item.quoteStatus === "RFQ required").length,
    htsGateCount: packageRows.filter((item) => item.included && item.dutyM > 0).length,
    criticalPackage,
    shouldCostPerMwM: roundPerMw(shouldCostM, selectedMw),
    landedCostPerMwM: roundPerMw(landedCostM, selectedMw),
    riskReservePerMwM: roundPerMw(riskReserveM, selectedMw),
    riskAdjustedPerMwM: roundPerMw(riskAdjustedM, selectedMw),
    evidence: procurementEvidence,
    basis: "Budgetary procurement forecast. Incoterms, freight, HTS duty screen, BLS escalation and supplier risk are explicit; replace with validated bids, broker classifications and executed terms."
  };
}

function sumCost(items) {
  return items.reduce((sum, item) => sum + item.amountM, 0);
}

function roundCost(value) {
  return Number(value.toFixed(1));
}

function roundUnitCost(value) {
  return Number(value.toFixed(value < 0.1 ? 3 : value < 1 ? 2 : 1));
}

function roundPerMw(valueM, denominatorMw) {
  return Number((valueM / Math.max(0.1, denominatorMw)).toFixed(2));
}

function formatCost(valueM) {
  if (valueM >= 1000) {
    const billions = valueM / 1000;
    return `$${billions.toFixed(billions >= 10 ? 1 : 2)}B`;
  }
  if (valueM >= 100) return `$${valueM.toFixed(0)}M`;
  return `$${valueM.toFixed(valueM >= 10 ? 1 : 2)}M`;
}

function formatUnitCost(valueM) {
  if (valueM < 1) return `$${Math.max(1, Math.round(valueM * 1000)).toLocaleString()}k`;
  return formatCost(valueM);
}

function formatCostDelta(valueM) {
  if (Math.abs(valueM) < 0.05) return "Current";
  return `${valueM > 0 ? "+" : "-"}${formatCost(Math.abs(valueM))}`;
}

function costBasisAmount(cost, totalM, perMwM) {
  return cost.displayBasis === "perMw" ? (perMwM ?? roundPerMw(totalM, cost.selectedMw)) : totalM;
}

function formatCostForBasis(cost, totalM, perMwM) {
  return formatCost(costBasisAmount(cost, totalM, perMwM));
}

function formatCompactCostForBasis(cost, totalM, perMwM) {
  const valueM = costBasisAmount(cost, totalM, perMwM);
  return valueM > 0 && valueM < 1 ? formatUnitCost(valueM) : formatCost(valueM);
}

function formatCostDeltaForBasis(cost, totalM, perMwM) {
  const valueM = costBasisAmount(cost, totalM, perMwM);
  return formatCostDelta(valueM);
}

function backupCostValues(backupKey, targetMw) {
  const profile = backupProfiles[backupKey] || backupProfiles.none;
  const selectedMw = clamp(Number(targetMw) || 40, 5, 250);
  const storageDerate = Math.max(0.01, (profile.usableSoc || 1) * (profile.dischargeEfficiency || 1) * (1 - (profile.degradationReservePct || 0)));
  const batteryUsableMwh = selectedMw * profile.batteryHours;
  const batteryNameplateMwh = batteryUsableMwh / storageDerate;
  const bessContainers = batteryNameplateMwh > 0 ? Math.ceil(batteryNameplateMwh / 5) : 0;
  const generatorActive = profile.generatorUnitMw > 0 ? Math.ceil(selectedMw / profile.generatorUnitMw) : 0;
  const generatorInstalled = generatorActive > 0 ? generatorActive + 1 : 0;
  const generatorNameplateMw = generatorInstalled * profile.generatorUnitMw;
  const fuelLiters = profile.fuelLitersPerKwh > 0
    ? selectedMw * 1000 * profile.autonomyHours * profile.fuelLitersPerKwh
    : 0;
  const fuelTankModules = fuelLiters > 0 ? Math.ceil(fuelLiters / 50000) : 0;
  const footprintM2 = backupKey === "none"
    ? 0
    : Math.round(
      bessContainers * 38
        + generatorInstalled * 55
        + fuelTankModules * 32
        + (profile.generatorFuel === "Pipeline gas" ? 80 : 0)
        + 96
    );
  const storageRateMPerMwh = profile.visualMode === "ups" ? 0.75 : profile.generatorUnitMw > 0 ? 0.55 : 0.45;
  const generatorRateMPerMw = profile.generatorFuel === "Pipeline gas" ? 0.95 : 0.8;
  const storageM = batteryNameplateMwh * storageRateMPerMwh;
  const generationM = generatorNameplateMw * generatorRateMPerMw;
  const fuelM = fuelTankModules * 0.25;
  const controlsM = backupKey === "none" ? 0 : 3.2 + selectedMw * 0.02;
  const siteWorksM = footprintM2 * 0.002;
  const lineItems = [
    {
      id: "backup-storage",
      system: "backup",
      component: profile.visualMode === "ups" ? "UPS / supercap + PCS" : "LFP BESS + PCS",
      quantity: batteryNameplateMwh,
      unit: "MWh",
      amountM: roundCost(storageM),
      basis: "NLR installed storage methodology / high-power allowance"
    },
    {
      id: "backup-generation",
      system: "backup",
      component: `${profile.generatorFuel} standby generators`,
      quantity: generatorInstalled,
      unit: `${profile.generatorUnitMw || 0} MW unit`,
      amountM: roundCost(generationM),
      basis: "US installed generator planning allowance"
    },
    {
      id: "backup-fuel",
      system: "backup",
      component: "Protected fuel tanks",
      quantity: fuelTankModules,
      unit: "50,000 L tank",
      amountM: roundCost(fuelM),
      basis: "Tank, fire separation and containment allowance"
    },
    {
      id: "backup-controls",
      system: "backup",
      component: "Microgrid controls + black start",
      quantity: backupKey === "none" ? 0 : 1,
      unit: "system",
      amountM: roundCost(controlsM),
      basis: "Controller, protection and commissioning allowance"
    },
    {
      id: "backup-yard",
      system: "backup",
      component: "Backup yard + site works",
      quantity: footprintM2,
      unit: "m2",
      amountM: roundCost(siteWorksM),
      basis: "California equipment yard planning allowance"
    }
  ].filter((item) => item.quantity > 0 && item.amountM > 0)
    .map((item) => ({
      ...item,
      unitCostM: roundUnitCost(item.amountM / item.quantity),
      color: profile.accent,
      costCategory: "backup"
    }));
  return {
    key: backupKey,
    planCode: profile.planCode,
    label: profile.label,
    shortLabel: profile.shortLabel,
    accent: profile.accent,
    amountM: roundCost(sumCost(lineItems)),
    batteryNameplateMwh: roundCost(batteryNameplateMwh),
    generatorNameplateMw: roundCost(generatorNameplateMw),
    fuelTankModules,
    footprintM2,
    lineItems
  };
}

function splitCostCategory(category, rows) {
  let allocatedM = 0;
  return rows.map((row, index) => {
    const amountM = index === rows.length - 1
      ? roundCost(category.amountM - allocatedM)
      : roundCost(category.amountM * row.share);
    allocatedM = roundCost(allocatedM + amountM);
    const quantity = Math.max(0.01, Number(row.quantity) || 1);
    return {
      id: row.id,
      system: row.system,
      component: row.component,
      quantity,
      unit: row.unit,
      amountM,
      unitCostM: roundUnitCost(amountM / quantity),
      basis: row.basis || "Allocated from US data center construction benchmark",
      color: category.color,
      costCategory: category.key
    };
  });
}

function costModelValues(block = selectedBlock()) {
  const capacity = capacityPlanValues(block);
  const construction = constructionValues(block);
  const chain = supplyChainValues(block);
  const constructionMethod = constructionMethodProfiles[state.costMethod] || constructionMethodProfiles.hybrid;
  const selectedMw = capacity.power.selectedMw;
  const baseFacilityM = selectedMw * costBenchmarks.siliconValleyFacilityMPerMw;
  const foundation = capacity.foundation;
  const sitePremium = clamp(
    foundation.pileDepthM * 0.003
      + (foundation.liquefaction === "High" ? 0.04 : foundation.liquefaction === "Med" ? 0.018 : 0)
      + (foundation.groundwater === "Shallow" ? 0.02 : foundation.groundwater === "Variable" ? 0.008 : 0),
    0,
    0.18
  );
  const reliabilityFactor = { n: 0.93, nPlus1: 1, twoN: 1.22 }[capacity.power.reliabilityKey] || 1;
  const sourceFactor = { grid: 1, btmGas: 1.08, gasTurbine: 1.16, btmSolar: 1.12 }[capacity.power.sourceKey] || 1;
  const scheduleFactor = { baseline: 1, utilitySlip: 1.05, accelerated: 1.045 }[state.scenario] || 1;
  const constructionMethodFactor = constructionMethod.costFactor;
  const facilityCategories = [
    {
      key: "civil",
      label: "Civil + steel",
      detail: `${capacity.requiredPods} modular pods / ${foundation.pileDepthM || 0}m pile screen`,
      color: "#68717a",
      scope: "facility",
      amountM: roundCost(baseFacilityM * 0.18 * (1 + sitePremium) * constructionMethodFactor)
    },
    {
      key: "power",
      label: "800V power",
      detail: `${capacity.power.source.shortLabel} / ${capacity.power.sourceUnits} source blocks / ${capacity.power.reliability.label}`,
      color: "#f08a4b",
      scope: "facility",
      amountM: roundCost(baseFacilityM * 0.31 * reliabilityFactor * sourceFactor * constructionMethodFactor)
    },
    {
      key: "cooling",
      label: "Liquid cooling",
      detail: `${capacity.siteCduActive}+1 CDUs / ${Math.round(capacity.siteDesignFlowLpm).toLocaleString()} L/min`,
      color: "#36d7c8",
      scope: "facility",
      amountM: roundCost(baseFacilityM * 0.18 * (1 + costBenchmarks.liquidCoolingPremiumPct / 100) * constructionMethodFactor)
    },
    {
      key: "building",
      label: "Building + safety",
      detail: "Containment / fire / controls",
      color: "#d9a441",
      scope: "facility",
      amountM: roundCost(baseFacilityM * 0.12 * (1 + sitePremium * 0.45) * scheduleFactor * constructionMethodFactor)
    },
    {
      key: "field",
      label: "Field + IST",
      detail: `${construction.installMethod} / W${construction.readyWeek}`,
      color: "#2aa876",
      scope: "facility",
      amountM: roundCost(baseFacilityM * 0.09 * scheduleFactor * constructionMethodFactor)
    },
    {
      key: "soft",
      label: "Design + contingency",
      detail: "Engineering / permits / Class 4 reserve",
      color: "#8b6fc0",
      scope: "facility",
      amountM: roundCost(baseFacilityM * 0.12 * (1 + (scheduleFactor - 1) * 0.5) * constructionMethodFactor)
    }
  ];
  const platformAllowance = costBenchmarks.aiFitoutMPerItMw[state.engine.compute] || 18;
  const aiBaseM = capacity.siteItMw * platformAllowance;
  const aiCategories = [
    {
      key: "gpuCards",
      label: "Accelerator cards",
      detail: `${capacity.siteAccelerators.toLocaleString()} GPU / XPU cards`,
      color: "#4e8cff",
      scope: "gpu",
      amountM: roundCost(aiBaseM * costBenchmarks.gpuCardSharePct / 100)
    },
    {
      key: "rackSystems",
      label: "Rack systems",
      detail: `${capacity.deployableRacks} racks / CPU + memory + storage + power shelves`,
      color: "#4f7f9f",
      scope: "it",
      amountM: roundCost(aiBaseM * 0.14)
    },
    {
      key: "network",
      label: "Fabric + network",
      detail: `${capacity.networkSpines} spines / scale-up + scale-out`,
      color: "#a86de0",
      scope: "it",
      amountM: roundCost(aiBaseM * 0.12)
    },
    {
      key: "integration",
      label: "Integration + spares",
      detail: "Rack burn-in / firmware / initial spares",
      color: "#2d6bff",
      scope: "it",
      amountM: roundCost(aiBaseM * 0.06)
    }
  ];
  const rawBackupAlternatives = Object.keys(backupProfiles).map((key) => backupCostValues(key, selectedMw));
  const rawBackup = rawBackupAlternatives.find((item) => item.key === state.engine.backup) || rawBackupAlternatives[0];
  const categoryByKey = Object.fromEntries(facilityCategories.map((item) => [item.key, item]));
  const benchmarkBasis = "Allocated from US data center construction benchmark";
  const facilityComponents = [
    ...splitCostCategory(categoryByKey.civil, [
      { id: "site-prep", system: "construction", component: "Site prep + onsite utilities", share: 0.18, quantity: selectedMw, unit: "site MW", basis: benchmarkBasis },
      { id: "foundation", system: "construction", component: "Pile-supported mats + anchors", share: 0.30, quantity: capacity.requiredPods, unit: "pod foundation", basis: `${foundation.pileDepthM || 0}m pile planning screen` },
      { id: "steel", system: "construction", component: "Structural steel pod frames", share: 0.32, quantity: capacity.requiredPods, unit: "steel pod", basis: constructionMethod.shortLabel },
      { id: "envelope", system: "construction", component: "Envelope + roof + weatherproofing", share: 0.20, quantity: capacity.requiredPods, unit: "pod", basis: benchmarkBasis }
    ]),
    ...splitCostCategory(categoryByKey.power, [
      { id: "mv-interconnect", system: "power", component: capacity.power.sourceKey === "grid" ? "Utility interconnect + source bay" : `${capacity.power.source.shortLabel} primary supply plant`, share: 0.16, quantity: capacity.power.sourceUnits, unit: "source block", basis: capacity.power.source.technology || capacity.power.source.path },
      { id: "transformer-switchgear", system: "power", component: "Transformers + MV switchgear", share: 0.21, quantity: capacity.power.sourceUnits, unit: "source block", basis: capacity.power.reliability.label },
      { id: "rectifier", system: "power", component: "SST / rectifier skids", share: 0.24, quantity: capacity.installedRectifierBlocks, unit: "10 MW skid", basis: "800V DC conversion" },
      { id: "busway", system: "power", component: "800V busway + taps", share: 0.17, quantity: capacity.requiredPods, unit: "pod bus", basis: "Dual-ended modular busway" },
      { id: "sidecar", system: "power", component: "Rack sidecars + DC protection", share: 0.12, quantity: capacity.deployableRacks, unit: "rack", basis: "Live-swap protection allowance" },
      { id: "electrical-install", system: "power", component: "Grounding + electrical installation", share: 0.10, quantity: selectedMw, unit: "site MW", basis: benchmarkBasis }
    ]),
    ...splitCostCategory(categoryByKey.cooling, [
      { id: "heat-rejection", system: "cooling", component: "Heat rejection plant", share: 0.26, quantity: capacity.siteItMw, unit: "IT MW", basis: "California liquid-cooled site allowance" },
      { id: "cdu", system: "cooling", component: "CDUs + plate heat exchangers", share: 0.23, quantity: capacity.siteCduInstalled, unit: "CDU", basis: `${capacity.siteCduActive}+1 installed` },
      { id: "pumps", system: "cooling", component: "Pump modules", share: 0.13, quantity: capacity.sitePumpInstalled, unit: "pump", basis: `${capacity.sitePumpActive}+1 installed` },
      { id: "headers", system: "cooling", component: "Site headers + pod manifolds", share: 0.18, quantity: capacity.requiredPods, unit: "pod loop", basis: `${Math.round(capacity.siteDesignFlowLpm).toLocaleString()} L/min` },
      { id: "rack-liquid", system: "cooling", component: "Rack manifolds + quick disconnects", share: 0.12, quantity: capacity.deployableRacks, unit: "rack", basis: "Supply/return rack kit" },
      { id: "cooling-controls", system: "cooling", component: "Leak detection + water controls", share: 0.08, quantity: 1, unit: "system", basis: "Conductivity, DP and leak rope" }
    ]),
    ...splitCostCategory(categoryByKey.building, [
      { id: "fire", system: "construction", component: "Fire detection + suppression", share: 0.25, quantity: capacity.requiredPods, unit: "pod", basis: "VESDA + suppression allowance" },
      { id: "containment", system: "construction", component: "White-space + aisle containment", share: 0.26, quantity: capacity.requiredPods, unit: "pod", basis: benchmarkBasis },
      { id: "bms", system: "construction", component: "BMS / DCIM / telemetry", share: 0.18, quantity: 1, unit: "system", basis: "Redundant controls platform" },
      { id: "security", system: "construction", component: "Physical security + access", share: 0.08, quantity: 1, unit: "system", basis: "Perimeter, badge and CCTV" },
      { id: "architectural", system: "construction", component: "Architectural + ancillary MEP", share: 0.23, quantity: capacity.requiredPods, unit: "pod", basis: benchmarkBasis }
    ]),
    ...splitCostCategory(categoryByKey.field, [
      { id: "general-conditions", system: "construction", component: "General conditions + site supervision", share: 0.34, quantity: 1, unit: "project", basis: constructionMethod.label },
      { id: "factory-integration", system: "construction", component: "Factory integration + QA", share: 0.20, quantity: capacity.requiredPods, unit: "pod", basis: `${constructionMethod.prefabPct}% offsite target` },
      { id: "freight-crane", system: "construction", component: "Module freight + crane set", share: 0.16, quantity: capacity.requiredPods, unit: "pod", basis: constructionMethod.shortLabel },
      { id: "field-tie", system: "construction", component: "Field MEP connections", share: 0.16, quantity: capacity.requiredPods, unit: "pod", basis: "800V + liquid tie-in" },
      { id: "ist", system: "construction", component: "Commissioning + IST", share: 0.14, quantity: selectedMw, unit: "site MW", basis: "Load bank and integrated systems test" }
    ]),
    ...splitCostCategory(categoryByKey.soft, [
      { id: "design", system: "construction", component: "Design + engineering", share: 0.30, quantity: 1, unit: "project", basis: "Planning allowance beyond benchmark boundary" },
      { id: "permits", system: "construction", component: "Permits + agency review", share: 0.12, quantity: 1, unit: "project", basis: capacity.power.sourceKey === "gasTurbine" ? "California stationary-source + air-district allowance" : "California entitlement allowance" },
      { id: "owner", system: "construction", component: "Owner PM + insurance", share: 0.18, quantity: 1, unit: "project", basis: "Owner-side delivery allowance" },
      { id: "contingency", system: "construction", component: "Design contingency", share: 0.40, quantity: 1, unit: "project", basis: `${costBenchmarks.estimateClass} reserve` }
    ])
  ];
  const itComponents = aiCategories.map((category) => {
    const quantity = category.key === "gpuCards"
      ? capacity.siteAccelerators
      : category.key === "network"
        ? capacity.networkSpines
        : capacity.deployableRacks;
    const unit = category.key === "gpuCards" ? "accelerator card" : category.key === "network" ? "spine" : "rack";
    return {
      id: `it-${category.key}`,
      system: "it",
      component: category.label,
      quantity,
      unit,
      amountM: category.amountM,
      unitCostM: roundUnitCost(category.amountM / Math.max(1, quantity)),
      basis: category.key === "gpuCards" ? "Explicitly excluded from Ex-GPU scope" : "AI fit-out planning allocation",
      color: category.color,
      costCategory: category.key,
      scopeGroup: category.scope
    };
  });
  const rawComponents = [...facilityComponents, ...rawBackup.lineItems, ...itComponents].map((item) => ({
    ...item,
    amountPerMwM: roundPerMw(item.amountM, selectedMw),
    included: item.system !== "it"
      ? true
      : item.scopeGroup === "gpu"
        ? state.costScope === "allIn"
        : state.costScope !== "facility"
  }));
  const procurementCases = Object.keys(supplyStrategies).map((strategyKey) => (
    procurementScenarioValues(rawComponents, block, strategyKey, state.engine.supplyShock, selectedMw)
  ));
  const selectedProcurement = procurementCases.find((item) => item.strategyKey === state.engine.supplyStrategy) || procurementCases[0];
  const procurement = {
    ...selectedProcurement,
    scenarioCases: procurementCases.map((item) => ({
      strategyKey: item.strategyKey,
      strategy: item.strategy,
      shouldCostM: item.shouldCostM,
      landedCostM: item.landedCostM,
      landedCostPerMwM: item.landedCostPerMwM,
      riskReserveM: item.riskReserveM,
      riskAdjustedM: item.riskAdjustedM,
      riskAdjustedPerMwM: item.riskAdjustedPerMwM,
      varianceM: item.varianceM,
      quoteCoveragePct: item.quoteCoveragePct,
      localContentPct: item.localContentPct,
      singleSourceSpendPct: item.singleSourceSpendPct,
      openRfqCount: item.openRfqCount,
      criticalPackage: item.criticalPackage
    }))
  };
  const components = procurement.components;
  const priceBackupPlan = (plan) => {
    const priced = procurementScenarioValues(
      plan.lineItems.map((item) => ({ ...item, included: true })),
      block,
      state.engine.supplyStrategy,
      state.engine.supplyShock,
      selectedMw
    );
    return {
      ...plan,
      shouldCostM: plan.amountM,
      amountM: priced.landedCostM,
      riskAdjustedM: priced.riskAdjustedM,
      amountPerMwM: priced.landedCostPerMwM,
      riskAdjustedPerMwM: priced.riskAdjustedPerMwM,
      lineItems: priced.components,
      procurement: {
        freightM: priced.freightM,
        dutyM: priced.dutyM,
        escalationM: priced.escalationM,
        shockPremiumM: priced.shockPremiumM,
        riskReserveM: priced.riskReserveM
      }
    };
  };
  const backupAlternatives = rawBackupAlternatives.map(priceBackupPlan);
  const pricedBackup = backupAlternatives.find((item) => item.key === state.engine.backup) || backupAlternatives[0];
  const activeBackupRows = components.filter((item) => item.system === "backup");
  const backup = {
    ...pricedBackup,
    amountM: roundCost(sumCost(activeBackupRows)),
    amountPerMwM: roundPerMw(sumCost(activeBackupRows), selectedMw),
    riskAdjustedM: roundCost(activeBackupRows.reduce((sum, item) => sum + item.riskAdjustedM, 0)),
    riskAdjustedPerMwM: roundPerMw(activeBackupRows.reduce((sum, item) => sum + item.riskAdjustedM, 0), selectedMw),
    lineItems: activeBackupRows
  };
  const categoryRows = (key) => components.filter((item) => item.costCategory === key);
  const priceCategory = (category) => {
    const rows = categoryRows(category.key);
    const amountM = roundCost(sumCost(rows));
    const riskAdjustedM = roundCost(rows.reduce((sum, item) => sum + item.riskAdjustedM, 0));
    return {
      ...category,
      shouldCostM: category.amountM,
      amountM,
      amountPerMwM: roundPerMw(amountM, selectedMw),
      riskAdjustedM,
      riskAdjustedPerMwM: roundPerMw(riskAdjustedM, selectedMw)
    };
  };
  const pricedFacilityCategories = facilityCategories.map(priceCategory);
  const pricedAiCategories = aiCategories.map(priceCategory);
  const backupCategory = {
    key: "backup",
    label: "Backup power",
    detail: `${backup.planCode} / ${backup.shortLabel} / ${backup.footprintM2.toLocaleString()} m2 yard`,
    color: backup.accent,
    scope: "backup",
    shouldCostM: rawBackup.amountM,
    amountM: backup.amountM,
    amountPerMwM: backup.amountPerMwM,
    riskAdjustedM: backup.riskAdjustedM,
    riskAdjustedPerMwM: backup.riskAdjustedPerMwM
  };
  const facilityM = roundCost(sumCost(pricedFacilityCategories));
  const aiFitoutM = roundCost(sumCost(pricedAiCategories));
  const gpuCardsM = pricedAiCategories.find((item) => item.scope === "gpu")?.amountM || 0;
  const nonGpuFitoutM = roundCost(sumCost(pricedAiCategories.filter((item) => item.scope === "it")));
  const facilityScopeM = roundCost(facilityM + backup.amountM);
  const exGpuM = roundCost(facilityScopeM + nonGpuFitoutM);
  const allInM = roundCost(facilityScopeM + aiFitoutM);
  const scopeTotalM = state.costScope === "facility" ? facilityScopeM : state.costScope === "exGpu" ? exGpuM : allInM;
  const categories = [
    ...pricedFacilityCategories,
    backupCategory,
    ...(state.costScope === "facility" ? [] : pricedAiCategories.filter((item) => item.scope === "it")),
    ...(state.costScope === "allIn" ? pricedAiCategories.filter((item) => item.scope === "gpu") : [])
  ].filter((item) => item.amountM > 0);
  const methodBaseFacilityM = facilityM / constructionMethod.costFactor;
  const methodCases = Object.entries(constructionMethodProfiles).map(([key, profile]) => {
    const methodDates = datesForConfiguration(block, profile.crewCount, profile.prefabPct);
    const methodExGpuM = roundCost(methodBaseFacilityM * profile.costFactor + backup.amountM + nonGpuFitoutM);
    return {
      key,
      ...profile,
      facilityM: roundCost(methodBaseFacilityM * profile.costFactor),
      facilityPerMwM: roundPerMw(methodBaseFacilityM * profile.costFactor, selectedMw),
      exGpuM: methodExGpuM,
      exGpuPerMwM: roundPerMw(methodExGpuM, selectedMw),
      readyWeek: methodDates.load,
      durationWeeks: Math.max(1, methodDates.load - block.design),
      deltaM: roundCost(methodExGpuM - exGpuM),
      deltaPerMwM: roundPerMw(methodExGpuM - exGpuM, selectedMw)
    };
  });
  const facilityDraw = [0.03, 0.05, 0.10, 0.06, 0.08, 0.08, 0.08, 0.14, 0.12, 0.10, 0.06, 0.06, 0.04];
  const backupDraw = [0.01, 0.01, 0.04, 0.04, 0.08, 0.10, 0.10, 0.16, 0.14, 0.12, 0.08, 0.08, 0.04];
  const aiDraw = [0.00, 0.01, 0.01, 0.01, 0.02, 0.02, 0.04, 0.08, 0.08, 0.12, 0.20, 0.28, 0.13];
  const includedItM = state.costScope === "facility" ? 0 : nonGpuFitoutM;
  const includedGpuM = state.costScope === "allIn" ? gpuCardsM : 0;
  let cumulativeM = 0;
  const cashFlow = construction.stages.map((stage, index) => {
    const amountM = facilityM * facilityDraw[index]
      + backup.amountM * backupDraw[index]
      + (includedItM + includedGpuM) * aiDraw[index];
    cumulativeM += amountM;
    return {
      key: stage.key,
      label: stage.label,
      weeks: `W${stage.start}-${stage.end}`,
      amountM: roundCost(amountM),
      amountPerMwM: roundPerMw(amountM, selectedMw),
      cumulativeM: roundCost(cumulativeM),
      cumulativePerMwM: roundPerMw(cumulativeM, selectedMw),
      cumulativePct: roundCost(cumulativeM / scopeTotalM * 100)
    };
  });
  return {
    estimateClass: costBenchmarks.estimateClass,
    rangePct: costBenchmarks.rangePct,
    selectedMw,
    siteItMw: capacity.siteItMw,
    scope: state.costScope,
    displayBasis: state.costBasis,
    scopeLabel: state.costScope === "facility" ? "Facility" : state.costScope === "exGpu" ? "Ex-GPU" : "All-in",
    constructionMethod: { key: state.costMethod, ...constructionMethod },
    methodCases,
    facilityM,
    facilityPerMwM: roundPerMw(facilityM, selectedMw),
    aiFitoutM,
    aiFitoutPerMwM: roundPerMw(aiFitoutM, selectedMw),
    gpuCardsM,
    gpuCardsPerMwM: roundPerMw(gpuCardsM, selectedMw),
    nonGpuFitoutM,
    nonGpuFitoutPerMwM: roundPerMw(nonGpuFitoutM, selectedMw),
    backup,
    backupAlternatives,
    facilityScopeM,
    facilityScopePerMwM: roundPerMw(facilityScopeM, selectedMw),
    exGpuM,
    exGpuPerMwM: roundPerMw(exGpuM, selectedMw),
    allInM,
    allInPerMwM: roundPerMw(allInM, selectedMw),
    scopeTotalM,
    scopePerMwM: roundPerMw(scopeTotalM, selectedMw),
    lowM: roundCost(scopeTotalM * (1 - costBenchmarks.rangePct / 100)),
    lowPerMwM: roundPerMw(scopeTotalM * (1 - costBenchmarks.rangePct / 100), selectedMw),
    highM: roundCost(scopeTotalM * (1 + costBenchmarks.rangePct / 100)),
    highPerMwM: roundPerMw(scopeTotalM * (1 + costBenchmarks.rangePct / 100), selectedMw),
    costPerMwM: roundPerMw(scopeTotalM, selectedMw),
    categories,
    components,
    procurement,
    cashFlow,
    drivers: {
      siliconValleyMPerMw: costBenchmarks.siliconValleyFacilityMPerMw,
      globalMPerMw: costBenchmarks.globalFacilityMPerMw,
      aiAllowanceMPerItMw: platformAllowance,
      liquidPremiumPct: costBenchmarks.liquidCoolingPremiumPct,
      sitePremiumPct: roundCost(sitePremium * 100),
      supplyIndex: chain.costIndex,
      procurementVariancePct: procurement.shouldCostM > 0
        ? roundUnitCost(procurement.varianceM / procurement.shouldCostM * 100)
        : 0,
      quoteCoveragePct: procurement.quoteCoveragePct,
      localContentPct: procurement.localContentPct,
      methodSavingsPct: roundCost((1 - constructionMethod.costFactor) * 100),
      scheduleReductionPct: roundCost((1 - constructionMethod.scheduleFactor) * 100),
      gpuExcludedM: gpuCardsM
    },
    sources: costBenchmarks.sources,
    basis: "US 2026 USD budgetary procurement forecast, not an executed vendor quote. Per-MW values use selected critical facility MW. Ex-GPU excludes accelerator cards; land, finance, tax and off-property utility works are excluded."
  };
}

function physicsLedgerValues(block) {
  const energy = energyValues(block);
  const fluid = fluidValues(block);
  const mechanics = mechanicsValues(block);
  const power = energy.powerSystem;
  const sourceMw = energy.facilityMw + energy.conversionLossKw / 1000;
  const electricalMw = 800 * energy.busCurrentA / 1000000;
  const thermalKw = fluid.massFlowKgS * 4.186 * fluid.deltaTC;
  const flowM3s = fluid.massFlowKgS / 997;
  const pumpKw = fluid.pressureDropKpa * 1000 * flowM3s / 0.72 / 1000;
  const baseShearKn = mechanics.serviceMassTon * 9.81 * mechanics.foundation.seismicG;
  const closure = (modeled, calculated) => Math.abs(modeled - calculated) / Math.max(1, Math.abs(modeled)) * 100;
  return {
    sourceMw,
    entries: [
      {
        domain: "Energy",
        equation: "Psource = PIT + Pcool + Ploss + dEstorage/dt",
        value: `${sourceMw.toFixed(2)} MW source / ${(energy.conversionLossKw / 1000).toFixed(2)} MW loss`,
        residualPct: 0,
        source: physicsSources.energy
      },
      {
        domain: "Circuits",
        equation: "P = VI; Ploss = I2R; sum I = 0",
        value: `${Math.round(energy.busCurrentA).toLocaleString()} A at 800V`,
        residualPct: closure(energy.facilityMw, electricalMw),
        source: physicsSources.circuits
      },
      {
        domain: "Thermal",
        equation: "Qdot = mdot cp deltaT",
        value: `${thermalKw.toFixed(0)} kW / ${fluid.deltaTC} C rise`,
        residualPct: closure(fluid.heatKw, thermalKw),
        source: physicsSources.thermal
      },
      {
        domain: "Fluid",
        equation: "mdot = rho A v; Ppump = deltaP Q / eta",
        value: `${fluid.velocityMs.toFixed(2)} m/s / ${pumpKw.toFixed(1)} kW pump`,
        residualPct: closure(fluid.pumpKw, pumpKw),
        source: physicsSources.nvidia
      },
      {
        domain: "Mechanics",
        equation: "F = ma; stress = F / A",
        value: `${baseShearKn.toFixed(0)} kN seismic / ${mechanics.bearingKpa.toFixed(0)} kPa soil`,
        residualPct: closure(mechanics.seismicBaseShearKn, baseShearKn),
        source: physicsSources.mechanics
      },
      {
        domain: "Reliability",
        equation: power.reliability.pathCount === 2 ? "A2N = 1 - (1 - Apath)2" : "AN+1 = P(at least N units online)",
        value: `${power.availabilityPct.toFixed(5)}% / ${power.outageMinutesYear.toFixed(1)} min/yr screen`,
        residualPct: null,
        source: { source: "Topology probability screen", sourceUrl: "https://journal.uptimeinstitute.com/explaining-uptime-institutes-tier-classification-system/" }
      }
    ]
  };
}

function averageMarketPressure() {
  return Math.round(marketSignals.reduce((sum, item) => sum + item.pressure, 0) / marketSignals.length);
}

function marketFitScore(block) {
  const mechanics = mechanicsValues(block);
  const foundation = mechanics.foundation;
  const compute = computeValues(block);
  const software = softwareValues(block);
  const feeder = feeders[block.feeder];
  const demand = feederDesignDemand(block.feeder);
  const headroom = feeder.capacity - demand;
  const reservePct = (headroom / feeder.capacity) * 100;
  const powerReadiness = clamp(63 + reservePct * 1.35 + (state.bridge ? 10 : 0), 0, 100);
  const prefabReadiness = clamp(38 + (state.prefab - 35) * 1.15 + (state.crew - 3) * 4 + (state.scenario === "accelerated" ? 4 : 0), 0, 100);
  const liquefactionPenalty = foundation.liquefaction === "High" ? 18 : foundation.liquefaction === "Med" ? 8 : 0;
  const groundwaterPenalty = foundation.groundwater === "Shallow" ? 8 : foundation.groundwater === "Variable" ? 4 : 0;
  const siteClassPenalty = foundation.siteClass.includes("E") ? 6 : 0;
  const caSiteReadiness = clamp(
    100 - Math.max(0, mechanics.governingRatio - 58) * 1.05 - liquefactionPenalty - groundwaterPenalty - siteClassPenalty,
    12,
    100
  );
  const marketPull = averageMarketPressure();
  const computeReadiness = clamp(
    compute.softwareFit * 0.26 +
    compute.fabricFit * 0.22 +
    compute.rackService * 0.14 +
    (100 - compute.deployRisk) * 0.12 +
    software.releaseScore * 0.26,
    0,
    100
  );
  const score = clamp(Math.round(
    powerReadiness * 0.24 +
    prefabReadiness * 0.18 +
    caSiteReadiness * 0.2 +
    marketPull * 0.2 +
    computeReadiness * 0.18
  ), 0, 100);
  const gate = mechanics.stateLabel === "Redesign"
    ? "Geotech gate"
    : compute.deployRisk > 58
      ? "Compute gate"
    : powerReadiness < 72
      ? "Power gate"
      : score > 82
        ? "Backable pilot"
        : "Design proof";
  return {
    score,
    gate,
    powerReadiness,
    prefabReadiness,
    caSiteReadiness,
    marketPull,
    computeReadiness,
    demand,
    headroom,
    mechanics,
    foundation,
    compute,
    software
  };
}

function intelMoves(block, fit = marketFitScore(block)) {
  const moves = [];
  if (fit.compute.deployRisk > 48) {
    moves.push(["Compute", `Align ${fit.compute.platform.label} with ${fit.compute.stack.label} and rack service model.`]);
  }
  if (fit.foundation.liquefaction === "High") {
    moves.push(["Civil", "Run EQ Zapp, CPT/borings, pile-mat package before module release."]);
  }
  if (fit.mechanics.governingRatio > 92) {
    moves.push(["Structure", "Shift steel pod to pile-supported mat and retune anchor kit."]);
  }
  if (!state.bridge) {
    moves.push(["Power", "Add short-duration 800V DC bridge for rack transients and commissioning."]);
  }
  if (state.prefab < 72) {
    moves.push(["Factory", "Raise DC skid prefab above 72% before committing field schedule."]);
  }
  if (fit.powerReadiness < 76) {
    moves.push(["Busway", "Reserve feeder headroom and lock DC protection study."]);
  }
  if (fit.foundation.program.loadMultiplier > 1.2) {
    moves.push(["Cooling", "Pair liquid loop headers with power sidecar layout for megawatt racks."]);
  }
  if (moves.length < 4) {
    moves.push(["Pilot", "Package one steel bay, rectifier skid, busway and scan workflow as the paid proof."]);
  }
  return moves.slice(0, 4);
}

function constraintGate(score) {
  if (score >= 80) return "Clear";
  if (score >= 60) return "Watch";
  return "Gate";
}

function constraintColor(score) {
  if (score >= 80) return "#2aa876";
  if (score >= 60) return "#d9a441";
  return "#dd7344";
}

function constraintStack(block, fit = marketFitScore(block)) {
  const foundation = fit.foundation;
  const program = foundation.program;
  const compute = fit.compute;
  const software = fit.software;
  const highDensity = program.loadMultiplier > 1.2;
  const utilityPenalty = state.scenario === "utilitySlip" ? 12 : 0;
  const groundwaterPenalty = foundation.groundwater === "Shallow" ? 10 : foundation.groundwater === "Variable" ? 5 : 0;
  const scanPenalty = block.scan === "hold" ? 22 : block.scan === "delta" ? 10 : 0;
  const gridScore = clamp(fit.powerReadiness + (state.bridge ? 8 : 0) - utilityPenalty, 0, 100);
  const geotechScore = clamp(
    100 - Math.max(0, fit.mechanics.governingRatio - 58) * 1.08 - (foundation.liquefaction === "High" ? 18 : foundation.liquefaction === "Med" ? 8 : 0),
    0,
    100
  );
  const waterScore = clamp(
    96 - program.coolingTonPerMw * 7 - groundwaterPenalty - (foundation.liquefaction === "High" ? 4 : 0) + (state.prefab >= 72 ? 4 : 0),
    0,
    100
  );
  const airScore = clamp(
    88 - (highDensity ? 10 : 3) + (state.bridge ? 8 : -4) - utilityPenalty * 0.35,
    0,
    100
  );
  const supplyScore = clamp(
    42 + state.prefab * 0.58 + (state.bridge ? 4 : 0) - (highDensity ? 8 : 0) + averageMarketPressure() * 0.08,
    0,
    100
  );
  const fieldScore = clamp(96 - scanPenalty - Math.max(0, fit.mechanics.frameDriftMm - 8) * 3 + (state.crew >= 5 ? 4 : 0), 0, 100);
  const computeScore = clamp(compute.tokensPerMwIndex - Math.max(0, compute.deployRisk - 38) * 0.52, 0, 100);
  const softwareScore = clamp(
    software.releaseScore * 0.52 +
    software.observabilityScore * 0.18 +
    software.securityScore * 0.16 +
    software.portabilityScore * 0.14,
    0,
    100
  );
  const items = [
    {
      id: "grid",
      label: "Grid",
      score: Math.round(gridScore),
      action: state.bridge ? "Flex-ready power path" : "Add bridge storage",
      ...constraintSources.grid
    },
    {
      id: "geotech",
      label: "Geotech",
      score: Math.round(geotechScore),
      action: foundation.pileDepthM ? `${foundation.pileDepthM}m pile screen` : "Shallow foundation screen",
      ...constraintSources.geotech
    },
    {
      id: "water",
      label: "Water",
      score: Math.round(waterScore),
      action: "CGP / stormwater path",
      ...constraintSources.water
    },
    {
      id: "air",
      label: "Air",
      score: Math.round(airScore),
      action: "Engine permit strategy",
      ...constraintSources.air
    },
    {
      id: "supply",
      label: "Supply",
      score: Math.round(supplyScore),
      action: `${state.prefab}% prefab / 800V kit`,
      ...constraintSources.supply
    },
    {
      id: "field",
      label: "Field",
      score: Math.round(fieldScore),
      action: block.scan === "clear" ? "Scan matched" : "Resolve scan delta",
      ...constraintSources.field
    },
    {
      id: "compute",
      label: "Compute",
      score: Math.round(computeScore),
      action: `${compute.platform.label} / ${compute.rack.label}`,
      source: compute.platform.source,
      sourceUrl: compute.platform.sourceUrl
    },
    {
      id: "software",
      label: "Software",
      score: Math.round(softwareScore),
      action: `${software.policy.label} / ${compute.stack.scheduler}`,
      ...constraintSources.software
    }
  ].map((item) => ({
    ...item,
    gate: constraintGate(item.score),
    color: constraintColor(item.score)
  }));
  const clearance = Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
  const blockers = items.filter((item) => item.gate === "Gate").length;
  const watches = items.filter((item) => item.gate === "Watch").length;
  return { clearance, blockers, watches, items };
}

function omniverseLayerState(score) {
  if (score >= 82) return "synced";
  if (score >= 64) return "review";
  return "blocked";
}

function omniverseTwin(block) {
  const status = statusFor(block);
  const dates = datesFor(block);
  const mechanics = mechanicsValues(block);
  const fluid = fluidValues(block);
  const thermal = thermalValues(block);
  const energy = energyValues(block);
  const compute = computeValues(block);
  const software = softwareValues(block);
  const construction = constructionValues(block);
  const fit = marketFitScore(block);
  const constraints = constraintStack(block, fit);
  const layerInputs = [
    ["site.usd", "Site / permit", fit.caSiteReadiness, "CGS / parcel / utility context"],
    ["civil.usd", "Foundation / soil", 100 - mechanics.governingRatio * 0.42, mechanics.foundation.type],
    ["foundation_tie.usd", "Foundation anchors", 100 - Math.max(0, mechanics.settlementMm - 7) * 8, `${mechanics.foundation.anchorCount} anchors`],
    ["steel_module.usd", "Modular frame", 100 - Math.max(0, mechanics.frameDriftMm - 5) * 6, `${block.steelBay} steel pod`],
    ["construction_sequence.usd", "Construction sequence", Math.max(58, construction.progressPct), `${construction.activeStage.label} / W${construction.readyWeek}`],
    ["power_800v.usd", "800V DC", 100 - Math.max(0, energy.feederUsePct - 72) * 1.1, `${Math.round(energy.busCurrentA).toLocaleString()}A bus`],
    ["power_sidecar.usd", "Sidecar + protection", energy.transientScore, `${energy.bridgeKwh.toFixed(0)} kWh bridge`],
    ["liquid_loop.usd", "Liquid cooling", 100 - Math.max(0, fluid.flowUtilPct - 74) * 0.9, `${fluid.flowLpm.toFixed(0)} L/min`],
    ["rack_compute.usd", "Rack + chips", compute.tokensPerMwIndex, compute.platform.label],
    ["network_fabric.usd", "Network fabric", compute.fabricFit, `${compute.fabricTbps.toFixed(0)} TB/s`],
    ["safety_access.usd", "Safety / access", constraints.clearance, "VESDA / E-stop / badge"],
    ["software_ops.usd", "AI factory OS", software.releaseScore, software.compute.stack.label],
    ["telemetry.live", "Telemetry", constraints.clearance, `${omniverseBlueprint.layers.length} namespaces`]
  ].map(([file, label, rawScore, note], index) => {
    const score = clamp(Math.round(rawScore), 0, 100);
    return {
      file,
      label,
      score,
      note,
      state: omniverseLayerState(score),
      color: constraintColor(score),
      path: `/World/PowerTwin/${block.id.replace("-", "_")}/${file.replace(/\W/g, "_")}`,
      rev: `r${String(42 + index + block.row).padStart(2, "0")}`
    };
  });

  const nodes = [
    ["World", "/World/PowerTwin", "Stage root", 100, "#2d6bff"],
    ["Site", `/World/PowerTwin/Site/${mechanics.foundation.site.label.replace(/\W/g, "_")}`, mechanics.foundation.siteClass, fit.caSiteReadiness, "#8b939d"],
    ["Module", `/World/PowerTwin/Modules/${block.id.replace("-", "_")}`, statusLabel(status), 100 - Math.max(0, mechanics.governingRatio - 68), mechanics.color],
    ["Power", `/World/PowerTwin/Power/${block.feeder.replace(/\W/g, "_")}`, `${energy.facilityMw.toFixed(2)} MW`, 100 - Math.max(0, energy.feederUsePct - 70), energy.color],
    ["Cooling", `/World/PowerTwin/Liquid/${block.id.replace("-", "_")}`, `${thermal.coldPlateC.toFixed(1)}C plate`, 100 - thermal.thermalUtilPct * 0.56, thermal.color],
    ["Compute", `/World/PowerTwin/Compute/${compute.platform.vendor}`, `${compute.accelerators} accelerators`, compute.tokensPerMwIndex, compute.color],
    ["Software", `/World/PowerTwin/Software/${compute.stack.label.replace(/\W/g, "_")}`, `${software.releaseScore} release`, software.releaseScore, software.color]
  ].map(([kind, path, note, score, color]) => ({ kind, path, note, score: clamp(Math.round(score), 0, 100), color }));

  const telemetry = [
    ["Power", `${energy.facilityMw.toFixed(2)} MW`, 100 - Math.max(0, energy.feederUsePct - 70), energy.color],
    ["Coolant", `${fluid.pressureDropKpa.toFixed(1)} kPa`, 100 - Math.max(0, fluid.flowUtilPct - 70), fluid.color],
    ["Thermal", `${thermal.coldPlateC.toFixed(1)} C`, 100 - Math.max(0, thermal.thermalUtilPct - 72), thermal.color],
    ["Structure", `${mechanics.settlementMm.toFixed(1)} mm`, 100 - Math.max(0, mechanics.governingRatio - 62), mechanics.color],
    ["Compute", `${compute.rackKw.toFixed(0)} kW/rack`, compute.tokensPerMwIndex, compute.color],
    ["Software", `${software.releaseScore} release`, software.releaseScore, software.color]
  ].map(([label, value, score, color]) => ({ label, value, score: clamp(Math.round(score), 0, 100), color }));

  const actions = [
    mechanics.stateLabel === "Redesign" ? ["Foundation sim", "Run pile-mat variant before SimReady release.", mechanics.governingRatio, mechanics.color] : null,
    fluid.flowUtilPct > 92 ? ["Cooling sim", "Increase header diameter or split loop namespace.", fluid.flowUtilPct, fluid.color] : null,
    thermal.thermalMarginC < 6 ? ["Thermal sim", "Retune cold-plate approach and return-water setpoint.", 100 - thermal.thermalMarginC * 10, thermal.color] : null,
    energy.feederUsePct > 82 ? ["Power sim", "Reserve 800V feeder headroom and bridge storage.", energy.feederUsePct, energy.color] : null,
    software.stateLabel === "Block" ? ["Software sim", "Fix chip/runtime mismatch before rack release.", 100 - software.releaseScore, software.color] : null,
    block.scan !== "clear" && !state.resolvedDeltas.size ? ["Reality capture", "Resolve field scan delta and update USD layer.", block.scan === "hold" ? 88 : 68, "#dd7344"] : null
  ].filter(Boolean).slice(0, 5).map(([label, detail, score, color]) => ({
    label,
    detail,
    score: clamp(Math.round(score), 0, 100),
    color
  }));
  if (!actions.length) {
    actions.push({ label: "Stage publish", detail: "Package USD manifest and telemetry contract for pilot.", score: 92, color: "#2aa876" });
  }

  const layerScore = Math.round(layerInputs.reduce((sum, item) => sum + item.score, 0) / layerInputs.length);
  const telemetryScore = Math.round(telemetry.reduce((sum, item) => sum + item.score, 0) / telemetry.length);
  const simReadiness = clamp(Math.round(layerScore * 0.34 + telemetryScore * 0.28 + constraints.clearance * 0.2 + software.releaseScore * 0.18), 0, 100);
  const health = simReadiness > 80 ? "SimReady" : simReadiness > 64 ? "Calibrate" : "Blocked";
  return {
    health,
    simReadiness,
    layerScore,
    telemetryScore,
    layers: layerInputs,
    nodes,
    telemetry,
    actions,
    rootPath: `/World/PowerTwin/${block.id.replace("-", "_")}`,
    liveStage: `W${state.week} -> W${dates.load}`,
    source: omniverseBlueprint
  };
}

function captureDesignState() {
  return {
    engine: { ...state.engine },
    scenario: state.scenario,
    crew: state.crew,
    prefab: state.prefab,
    bridge: state.bridge
  };
}

function restoreDesignState(snapshot) {
  state.engine = { ...snapshot.engine };
  state.scenario = snapshot.scenario;
  state.crew = snapshot.crew;
  state.prefab = snapshot.prefab;
  state.bridge = snapshot.bridge;
}

function candidateKey(candidate) {
  return [
    candidate.program,
    candidate.site,
    candidate.tier,
    candidate.scenario,
    candidate.crew,
    candidate.prefab,
    candidate.bridge ? "bridge" : "direct"
  ].join(":");
}

function withCandidate(candidate, fn) {
  const snapshot = captureDesignState();
  try {
    state.engine = {
      ...snapshot.engine,
      program: candidate.program,
      site: candidate.site,
      tier: candidate.tier
    };
    state.scenario = candidate.scenario;
    state.crew = candidate.crew;
    state.prefab = candidate.prefab;
    state.bridge = candidate.bridge;
    return fn();
  } finally {
    restoreDesignState(snapshot);
  }
}

function foundationCostIndex(foundation) {
  const pileCost = foundation.pileDepthM ? foundation.pileDepthM * 1.35 : 0;
  const soilCost = foundation.liquefaction === "High" ? 20 : foundation.liquefaction === "Med" ? 9 : 0;
  const matCost = foundation.matThicknessM * 18 + foundation.gradeBeamDepthM * 8;
  const missionCost = foundation.tier.label === "Mission critical" ? 8 : foundation.tier.label === "Enhanced" ? 4 : 0;
  return clamp(Math.round(18 + pileCost + soilCost + matCost + missionCost), 0, 100);
}

function evaluateCandidate(block, candidate) {
  return withCandidate(candidate, () => {
    const fit = marketFitScore(block);
    const d = datesFor(block);
    const foundation = fit.foundation;
    const constraints = constraintStack(block, fit);
    const timeToPower = Math.max(0, d.load - state.week);
    const capexIndex = foundationCostIndex(foundation) + (state.bridge ? 7 : 0) + Math.max(0, state.prefab - 72) * 0.28;
    const gridFlex = clamp(fit.powerReadiness + (state.bridge ? 8 : 0) + (state.scenario === "accelerated" ? 3 : 0), 0, 100);
    const constructability = clamp(100 - fit.mechanics.governingRatio * 0.72 - capexIndex * 0.18 + state.prefab * 0.22, 0, 100);
    const riskPenalty = fit.mechanics.stateLabel === "Redesign" ? 13 : fit.mechanics.stateLabel === "Watch" ? 5 : 0;
    const objective = Math.round(
      fit.score * 1.14 +
      gridFlex * 0.18 +
      constructability * 0.2 +
      constraints.clearance * 0.2 -
      constraints.blockers * 5 -
      constraints.watches * 1.8 -
      timeToPower * 0.72 -
      capexIndex * 0.18 -
      riskPenalty
    );
    return {
      ...candidate,
      key: candidateKey(candidate),
      fit,
      dates: d,
      objective,
      timeToPower,
      capexIndex: Math.round(capexIndex),
      gridFlex: Math.round(gridFlex),
      constructability: Math.round(constructability),
      constraints
    };
  });
}

function optimizerCandidates(block) {
  const crewLevels = [...new Set([state.crew, 5, 6])].filter((value) => value >= 2 && value <= 7);
  const prefabLevels = [...new Set([state.prefab, 72, 82])].filter((value) => value >= 35 && value <= 85);
  const scenarios = [...new Set([state.scenario, "baseline", "accelerated"])];
  const candidates = [];
  Object.keys(dataCenterPresets).forEach((program) => {
    Object.keys(californiaSitePresets).forEach((site) => {
      Object.keys(seismicTierPresets).forEach((tier) => {
        scenarios.forEach((scenario) => {
          crewLevels.forEach((crew) => {
            prefabLevels.forEach((prefab) => {
              [false, true].forEach((bridge) => {
                candidates.push(evaluateCandidate(block, { program, site, tier, scenario, crew, prefab, bridge }));
              });
            });
          });
        });
      });
    });
  });
  return candidates;
}

function currentCandidate() {
  return {
    program: state.engine.program,
    site: state.engine.site,
    tier: state.engine.tier,
    scenario: state.scenario,
    crew: state.crew,
    prefab: state.prefab,
    bridge: state.bridge
  };
}

function optimizerResult(block) {
  const current = evaluateCandidate(block, currentCandidate());
  const seen = new Set();
  const sorted = optimizerCandidates(block)
    .filter((candidate) => {
      if (seen.has(candidate.key)) return false;
      seen.add(candidate.key);
      return true;
    })
    .sort((a, b) => b.objective - a.objective || b.fit.score - a.fit.score || a.timeToPower - b.timeToPower);
  const familySeen = new Set();
  const ranked = [];
  sorted.forEach((candidate) => {
    const family = `${candidate.program}:${candidate.site}`;
    if (familySeen.has(family)) return;
    familySeen.add(family);
    ranked.push(candidate);
  });
  sorted.forEach((candidate) => {
    if (ranked.length >= 4) return;
    if (!ranked.some((item) => item.key === candidate.key)) ranked.push(candidate);
  });
  return {
    current,
    best: sorted[0] || current,
    ranked: ranked.slice(0, 4)
  };
}

function sitePortfolio(block) {
  const candidates = optimizerCandidates(block);
  return Object.entries(californiaSitePresets).map(([site, info]) => {
    const ranked = candidates
      .filter((candidate) => candidate.site === site)
      .sort((a, b) => b.objective - a.objective || b.fit.score - a.fit.score || a.timeToPower - b.timeToPower);
    const best = ranked[0];
    return {
      site,
      label: info.label,
      candidate: best,
      fit: best.fit.score,
      clearance: best.constraints.clearance,
      ttp: best.timeToPower,
      foundation: best.fit.foundation.type,
      gate: best.constraints.blockers ? `${best.constraints.blockers} gate` : best.constraints.watches ? `${best.constraints.watches} watch` : "Clear"
    };
  }).sort((a, b) => b.candidate.objective - a.candidate.objective);
}

function competitiveWedge(block, opt = optimizerResult(block)) {
  const currentConstraints = constraintStack(block, marketFitScore(block));
  const best = opt.best;
  const designSpace = Object.keys(dataCenterPresets).length *
    Object.keys(californiaSitePresets).length *
    Object.keys(seismicTierPresets).length *
    3 * 3 * 2;
  return [
    ["4D design space", `${designSpace} paths`, "Site, structure, power, prefab, schedule."],
    ["CA gate lift", `+${best.constraints.clearance - currentConstraints.clearance}`, "Turns geotech/grid/water/air into scored gates."],
    ["Time-to-power", `${Math.max(0, opt.current.timeToPower - best.timeToPower)}w saved`, "Optimizes power bridge, prefab and crew sequence."],
    ["800V readiness", `${best.fit.powerReadiness.toFixed(0)}`, "Benchmarked to supplier-side 800V DC movement."]
  ];
}

function fundingVerdict(score) {
  if (score >= 84) return "Term-sheet ready";
  if (score >= 70) return "Pilot financeable";
  if (score >= 56) return "Needs diligence";
  return "Hold";
}

function capitalCase(block, opt = optimizerResult(block)) {
  const currentConstraints = constraintStack(block, marketFitScore(block));
  const best = opt.best;
  const compute = computeValues(block);
  const totalMw = modules.reduce((sum, item) => sum + item.mw, 0);
  const clearanceGain = best.constraints.clearance - currentConstraints.clearance;
  const fitGain = best.fit.score - opt.current.fit.score;
  const weeksSaved = Math.max(0, opt.current.timeToPower - best.timeToPower);
  const mwWeeks = Number((weeksSaved * block.mw).toFixed(1));
  const capexPressure = clamp(100 - best.capexIndex, 0, 100);
  const fundability = clamp(Math.round(
    best.fit.score * 0.34 +
    best.constraints.clearance * 0.28 +
    best.gridFlex * 0.16 +
    capexPressure * 0.12 +
    Math.max(0, 100 - best.timeToPower * 12) * 0.1
  ), 0, 100);
  const openGates = best.constraints.items.filter((item) => item.gate !== "Clear");
  const gates = openGates.length
    ? openGates.slice(0, 2).map((item) => item.label).join(" / ")
    : "No hard gates";
  return {
    fundability,
    verdict: fundingVerdict(fundability),
    metrics: [
      ["Fundability", fundability],
      ["Fit lift", `+${fitGain}`],
      ["MW-weeks", mwWeeks.toFixed(1)],
      ["Capex index", best.capexIndex]
    ],
    rows: [
      ["Pilot scope", `${block.mw.toFixed(1)} MW / ${block.racks} racks / ${block.steelBay}`],
      ["Use of capital", "800V bridge, prefab skid, geotech close"],
      ["Compute stack", `${compute.platform.label} / ${compute.stack.label}`],
      ["Diligence", gates],
      ["Scale option", `${totalMw.toFixed(1)} MW across 12 pods`]
    ]
  };
}

function peerMatrix(block, opt = optimizerResult(block), capital = capitalCase(block, opt)) {
  const powerTwinScore = clamp(Math.round(
    opt.best.fit.score * 0.32 +
    opt.best.constraints.clearance * 0.3 +
    capital.fundability * 0.24 +
    Math.min(100, opt.best.objective) * 0.14
  ), 0, 100);
  const rows = [
    {
      name: "PowerTwin 4D",
      lane: "Design engine",
      signal: "3D + 800V + CA gates + schedule + capital case.",
      gap: "Pilot data needed.",
      score: powerTwinScore,
      sourceUrl: "#"
    },
    ...peerBenchmarks
  ].sort((a, b) => b.score - a.score);
  const nearest = rows.find((row) => row.name !== "PowerTwin 4D") || peerBenchmarks[0];
  return {
    rows,
    lead: powerTwinScore - nearest.score,
    verified: "Verified Jul 4 2026",
    sourceCount: peerBenchmarks.length + marketSignals.length
  };
}

function candidateName(candidate) {
  return `${dataCenterPresets[candidate.program].label} / ${californiaSitePresets[candidate.site].label}`;
}

function applyOptimizerCandidate(candidate) {
  beginRouteTransition();
  state.engine = {
    ...state.engine,
    program: candidate.program,
    site: candidate.site,
    tier: candidate.tier
  };
  state.scenario = candidate.scenario;
  state.crew = candidate.crew;
  state.prefab = candidate.prefab;
  state.bridge = candidate.bridge;
  state.twinMode = "mechanics";
  state.tab = "intel";
  render();
  scheduleBackendSync("optimizer");
  showToast("Optimized design applied.");
}

function setObjectOpacity(object, opacity) {
  if (!object.material) return;
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  materials.forEach((material) => {
    if (!material) return;
    material.transparent = true;
    material.opacity = clamp(opacity, 0, 1);
  });
}

function setObjectEmissiveIntensity(object, intensity) {
  if (!object.material) return;
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  materials.forEach((material) => {
    if (!material?.emissive) return;
    material.emissiveIntensity = clamp(intensity, 0, 2.4);
  });
}

function applyInternalLayerVisibility(entry, selected) {
  const activeLayer = validInternalLayers.includes(state.internalLayer) ? state.internalLayer : "all";
  const focused = activeLayer !== "all";
  const cutaway = state.cutaway !== false;
  entry.group.traverse((object) => {
    const layer = object.userData?.internalLayer;
    if (!layer || !gpuInternalLayers[layer] || object.userData.cutawayHide !== undefined || object.userData.modeControlled) return;
    const layerActive = activeLayer === "all" || activeLayer === layer;
    const reference = layer === "structure";
    const showSelected = activeLayer === "all" || layerActive || reference;
    const showDimmed = activeLayer === "all"
      ? reference || layer === "power" || layer === "cooling"
      : reference || layerActive;
    object.visible = selected ? showSelected : showDimmed;
    if (!object.visible) return;
    const opacity = selected
      ? layerActive
        ? cutaway ? 0.92 : 0.52
        : reference ? 0.38 : 0.1
      : layerActive
        ? focused ? 0.24 : 0.18
        : reference ? 0.16 : 0.07;
    setObjectOpacity(object, opacity);
    const intensity = selected
      ? layerActive ? (focused ? 0.95 : 0.46) : 0.12
      : layerActive ? 0.18 : 0.05;
    setObjectEmissiveIntensity(object, intensity);
  });

  entry.cutawayPanels?.forEach((panel) => {
    const removed = selected && cutaway && panel.userData.cutawayHide;
    panel.visible = !removed;
    setObjectOpacity(panel, selected ? (cutaway ? 0.07 : 0.26) : (cutaway ? 0.06 : 0.14));
    setObjectEmissiveIntensity(panel, selected ? 0.08 : 0.03);
  });
}

function updateThreeSceneState() {
  if (!threeState.renderer) return;
  modules.forEach((block) => {
    const entry = threeState.moduleMeshes.get(block.id);
    if (!entry) return;
    const status = statusFor(block);
    const ops = operationsTwinValues(block);
    const mechanics = mechanicsValues(block);
    const fluid = fluidValues(block);
    const thermal = thermalValues(block);
    const energy = energyValues(block);
    const compute = computeValues(block);
    const software = softwareValues(block);
    const construction = constructionValues(block);
    const usdMode = state.tab === "omniverse";
    const designMode = state.twinMode === "design";
    const physicsMode = state.twinMode === "physics";
    const mechanicsMode = state.twinMode === "mechanics" || physicsMode;
    const energyMode = state.twinMode === "energy" || physicsMode;
    const fluidMode = state.twinMode === "fluid" || physicsMode;
    const thermalMode = state.twinMode === "thermal";
    const computeMode = state.twinMode === "compute";
    const softwareMode = state.twinMode === "software";
    const opsMode = state.twinMode === "ops";
    const constructionFocus = state.internalLayer === "construction";
    const layerVisible = (layer) => state.internalLayer === "all" || state.internalLayer === layer;
    const color = physicsMode
      ? "#36d7c8"
      : mechanicsMode
      ? mechanics.color
      : energyMode
        ? energy.color
        : fluidMode
          ? fluid.color
            : thermalMode
              ? thermal.color
              : computeMode
                ? compute.color
                : softwareMode
                  ? software.color
                  : usdMode
                    ? omniverseTwin(block).actions[0]?.color || "#36d7c8"
                    : opsMode
                    ? ops.riskColor
                    : statusColor(status);
    const selected = block.id === state.selectedId;
    entry.body.material.color.set(color);
    entry.body.material.emissive.set(status === "loaded" || status === "energized" || status === "power-hold" ? color : "#000000");
    entry.body.material.emissiveIntensity = opsMode ? 0.18 + ops.loadFactor * 0.48 : status === "power-hold" ? 0.42 : selected ? 0.32 : 0.16;
    entry.skidPlate.material.emissive.set(color);
    entry.skidPlate.material.emissiveIntensity = selected ? 0.22 : 0.08;
    entry.group.position.y = selected ? 0.055 : 0;
    entry.group.scale.setScalar(selected ? 1.018 : 1);
    const coolingFocus = state.internalLayer === "cooling" || fluidMode || thermalMode;
    const frameOverlayFocus = coolingFocus || constructionFocus;
    entry.steelFrameObjects.forEach((object) => {
      setObjectOpacity(object, selected ? (constructionFocus ? 0.62 : coolingFocus ? 0.54 : 0.92) : (frameOverlayFocus ? 0.12 : 0.34));
      setObjectEmissiveIntensity(object, selected ? (constructionFocus ? 0.12 : coolingFocus ? 0.08 : 0.18) : 0.03);
    });
    entry.selectedFrame.material.color.set(constructionFocus ? gpuInternalLayers.construction.color : coolingFocus ? "#36d7c8" : color);
    entry.selectedFrame.material.opacity = selected ? 0.96 : 0;
    entry.edge.material.color.set(coolingFocus ? "#36d7c8" : "#b9c3cb");
    entry.edge.material.opacity = selected ? (coolingFocus ? 0.92 : 0.78) : (coolingFocus ? 0.18 : 0.34);
    if (entry.internalDetails?.group) {
      entry.internalDetails.group.visible = true;
      entry.internalDetails.group.traverse((object) => {
        if (!object.material) return;
        if (object.material.transparent) {
          object.material.opacity = selected ? Math.max(object.material.opacity, 0.42) : Math.min(object.material.opacity, 0.34);
        }
        if (object.material.emissive) {
          object.material.emissiveIntensity = selected ? Math.max(object.material.emissiveIntensity || 0, 0.18) : Math.min(object.material.emissiveIntensity || 0, 0.18);
        }
      });
      entry.internalDetails.containmentPanels.forEach((panel) => {
        panel.visible = designMode || thermalMode || opsMode || selected || usdMode;
        panel.material.opacity = thermalMode && selected ? 0.26 : selected ? 0.18 : 0.1;
      });
      entry.internalDetails.buswayTaps.forEach((tap) => {
        tap.visible = energyMode || designMode || selected || usdMode;
        tap.material.opacity = selected ? 0.92 : 0.34;
        tap.material.emissiveIntensity = energyMode && selected ? 1.05 : selected ? 0.46 : 0.18;
      });
      entry.internalDetails.fiberLines.forEach((fiber) => {
        fiber.visible = computeMode || softwareMode || designMode || selected || usdMode;
        fiber.material.opacity = selected ? 0.92 : 0.34;
        fiber.material.emissiveIntensity = (computeMode || softwareMode) && selected ? 0.86 : selected ? 0.42 : 0.18;
      });
      entry.internalDetails.cduPumps.forEach((pump) => {
        pump.visible = fluidMode || thermalMode || designMode || selected || usdMode;
        pump.material.opacity = selected ? 0.88 : 0.34;
        pump.material.emissiveIntensity = (fluidMode || thermalMode) && selected ? 1.05 : selected ? 0.5 : 0.18;
      });
      entry.internalDetails.coolingFlowMarkers.forEach((marker) => {
        marker.visible = layerVisible("cooling") && selected && (fluidMode || thermalMode || state.internalLayer === "cooling");
        marker.material.opacity = marker.visible ? 0.94 : 0;
        marker.material.emissiveIntensity = fluidMode || thermalMode ? 1.7 : 1.25;
        marker.scale.setScalar(clamp(0.8 + fluid.velocityMs * 0.12, 0.82, 1.18));
      });
      entry.internalDetails.sensorNodes.forEach((sensor) => {
        sensor.visible = opsMode || softwareMode || selected || usdMode;
        sensor.material.opacity = selected ? 0.9 : 0.34;
        sensor.material.emissiveIntensity = opsMode && selected ? 1.25 : selected ? 0.62 : 0.24;
      });
      entry.internalDetails.safetyNozzles.forEach((nozzle) => {
        nozzle.visible = opsMode || designMode || selected || usdMode;
        nozzle.material.opacity = selected ? 0.88 : 0.34;
        nozzle.material.emissiveIntensity = opsMode && selected ? 0.72 : 0.28;
      });
    }
    if (entry.constructionDetails?.group) {
      const previewActiveStage = state.internalLayer === "all" && designMode && !construction.complete;
      const showConstruction = constructionFocus || previewActiveStage;
      entry.constructionDetails.group.visible = showConstruction;
      construction.stages.forEach((stage, stageIndex) => {
        const current = !construction.complete && stageIndex === construction.activeStageIndex;
        const completed = construction.complete || stageIndex < construction.activeStageIndex;
        entry.constructionDetails.stageObjects[stage.visualKey || stage.key]?.forEach((object) => {
          const craneObject = ["crane-base", "crane-mast", "crane-boom", "crane-cable", "crane-hook", "lifted-module"].includes(object.userData.constructionRole);
          const selectedLayerSequence = constructionFocus && selected;
          object.visible = showConstruction
            && (selectedLayerSequence || current)
            && (!craneObject || selected);
          if (!object.visible) return;
          const opacity = constructionFocus
            ? selected
              ? current ? 0.96 : completed ? 0.42 : 0.16
              : 0.2
            : selected ? 0.68 : 0.22;
          setObjectOpacity(object, opacity);
          setObjectEmissiveIntensity(object, current ? (selected ? 0.92 : 0.34) : selected ? 0.22 : 0.08);
        });
      });
    }
    entry.designPad.visible = designMode || usdMode;
    entry.designPad.material.opacity = selected ? 0.28 : 0.1;
    entry.designGhost.visible = designMode || usdMode;
    entry.designGhost.material.opacity = usdMode ? (selected ? 0.92 : 0.3) : selected ? 0.86 : 0.22;
    const explode = state.exploded ? 1 : 0;
    if (entry.internalDetails?.group) {
      entry.internalDetails.group.position.y = explode * (selected ? 0.45 : 0.2);
      entry.internalDetails.group.position.z = explode * (selected ? 0.18 : 0.08);
    }
    if (entry.dcBusway) entry.dcBusway.position.y = (entry.dcBusway.userData.baseY ?? 1.78) + explode * 0.52;
    if (entry.coolingHeader) entry.coolingHeader.position.y = (entry.coolingHeader.userData.baseY ?? 1.22) + explode * 0.38;
    const foundationFocus = state.internalLayer === "foundation";
    if (entry.foundationMat) {
      entry.foundationMat.visible = layerVisible("foundation") || layerVisible("structure") || designMode || mechanicsMode || foundationFocus;
      setObjectOpacity(entry.foundationMat, selected ? (foundationFocus ? 0.92 : 0.62) : 0.28);
    }
    entry.anchorMarkers.forEach((anchor) => {
      anchor.visible = (layerVisible("structure") || layerVisible("foundation")) && designMode && selected;
    });
    entry.dcBusway.material.emissive.set("#ff8a3d");
    entry.dcBusway.material.emissiveIntensity = energyMode ? (selected ? 1.15 : 0.52) : 0.18;
    entry.dcBusway.scale.setScalar(energyMode && selected ? 1.18 : 1);
    entry.coolingHeader.material.emissive.set("#36d7c8");
    entry.coolingHeader.material.emissiveIntensity = fluidMode || thermalMode ? (selected ? 0.82 : 0.34) : 0.18;
    entry.chipTiles.forEach((chip, index) => {
      chip.visible = layerVisible("compute") && (computeMode || softwareMode || designMode || usdMode);
      const chipColor = softwareMode || usdMode ? software.color : compute.color;
      chip.material.color.set(chipColor);
      chip.material.emissive.set(chipColor);
      chip.material.opacity = computeMode || softwareMode || usdMode ? (selected ? 0.95 : 0.42) : selected ? 0.28 : 0.08;
      chip.userData.baseIntensity = computeMode || softwareMode || usdMode ? (selected ? 1.9 : 0.78) : 0.35;
      chip.material.emissiveIntensity = chip.userData.baseIntensity;
      chip.scale.setScalar(computeMode || softwareMode ? clamp(0.86 + (softwareMode ? software.releaseScore : compute.tokensPerMwIndex) / 180 + (index % 3) * 0.03, 0.9, 1.48) : 1);
    });
    entry.fluidBeads.forEach((bead) => {
      bead.visible = layerVisible("cooling") && (fluidMode || (usdMode && selected));
      bead.material.opacity = selected ? 0.9 : 0.36;
      bead.material.emissiveIntensity = selected ? 1.6 : 0.72;
      bead.scale.setScalar(clamp(0.72 + fluid.velocityMs * 0.18, 0.7, 1.35));
    });
    entry.heatPlume.visible = layerVisible("cooling") && ((opsMode && ops.liveMw > 0.1) || thermalMode || (usdMode && selected));
    entry.heatPlume.material.color.set(thermalMode || usdMode ? thermal.color : ops.riskColor);
    entry.heatPlume.material.emissive.set(thermalMode || usdMode ? thermal.color : ops.riskColor);
    entry.heatPlume.material.opacity = thermalMode || usdMode ? (selected ? 0.26 : 0.11) : selected ? 0.16 + ops.loadFactor * 0.18 : 0.06 + ops.loadFactor * 0.08;
    entry.heatPlume.scale.set(1 + (thermalMode ? thermal.thermalUtilPct / 220 : ops.loadFactor * 0.18), 0.62 + (thermalMode ? thermal.thermalUtilPct / 90 : ops.loadFactor * 0.85), 1 + (thermalMode ? thermal.thermalUtilPct / 220 : ops.loadFactor * 0.18));
    entry.thermalSkin.visible = layerVisible("cooling") && thermalMode;
    entry.thermalSkin.material.color.set(thermal.color);
    entry.thermalSkin.material.emissive.set(thermal.color);
    entry.thermalSkin.material.opacity = selected ? 0.38 : 0.13;
    entry.opsRing.visible = layerVisible("telemetry") && (opsMode || softwareMode || usdMode);
    entry.opsRing.material.color.set(softwareMode || usdMode ? software.color : ops.riskColor);
    entry.opsRing.material.emissive.set(softwareMode || usdMode ? software.color : ops.riskColor);
    entry.opsRing.material.opacity = selected ? 0.88 : 0.22;
    entry.mechanicsPad.visible = layerVisible("structure") && (mechanicsMode || usdMode);
    entry.mechanicsPad.material.color.set(mechanics.color);
    entry.mechanicsPad.material.emissive.set(mechanics.color);
    entry.mechanicsPad.material.opacity = selected ? 0.36 : 0.12;
    entry.mechanicsPad.scale.y = 1 + mechanics.bearingUtilPct / 120;
    entry.pileMeshes.forEach((pile) => {
      pile.visible = (layerVisible("foundation") || layerVisible("structure")) && mechanicsMode;
      pile.material.opacity = selected ? 0.78 : 0.22;
      pile.material.emissive.set(mechanics.color);
      pile.material.emissiveIntensity = selected ? 0.18 : 0.04;
      if (!pile.isInstancedMesh) {
        pile.scale.y = mechanics.foundation.pileDepthM ? 1.24 : 0.42;
        pile.position.y = mechanics.foundation.pileDepthM ? -0.34 : -0.16;
      }
    });
    entry.loadArrows.forEach((arrow) => {
      arrow.visible = (layerVisible("foundation") || layerVisible("structure")) && mechanicsMode;
      arrow.material.color.set(mechanics.color);
      arrow.material.emissive?.set(mechanics.color);
      arrow.material.opacity = selected ? 0.86 : 0.2;
    });
    entry.deflectionLine.visible = layerVisible("structure") && mechanicsMode;
    entry.deflectionLine.material.color.set(mechanics.color);
    entry.deflectionLine.material.opacity = selected ? 0.92 : 0.22;
    entry.deflectionLine.scale.y = 1 + mechanics.frameDriftMm / 14;
    applyInternalLayerVisibility(entry, selected);
    if (ops.failureActive && opsMode && selected) {
      entry.group.traverse((object) => {
        const layer = object.userData?.internalLayer;
        if (!layer || ops.failure.layers.includes(layer) || layer === "safety" || layer === "telemetry") return;
        setObjectOpacity(object, 0.07);
        setObjectEmissiveIntensity(object, 0.02);
      });
    }
    const poweredRacks = Math.min(block.racks, Math.max(0, Math.floor(block.mw * 1000 / compute.rackKw)));
    const activeRackVisuals = Math.ceil(poweredRacks / Math.max(1, block.racks) * 4);
    entry.rackVisuals?.forEach((object) => {
      if ((object.userData.rackVisualIndex ?? 0) < activeRackVisuals) return;
      setObjectOpacity(object, selected ? 0.1 : 0.04);
      setObjectEmissiveIntensity(object, selected ? 0.04 : 0.01);
    });
  });

  const powerSystem = powerSystemForTarget(state.engine.powerMw);
  const powerLayerVisible = state.internalLayer === "all" || state.internalLayer === "power";
  const powerFocused = state.internalLayer === "power" || state.twinMode === "energy" || state.twinMode === "physics" || state.tab === "power";
  if (threeState.powerSupply) {
    const sourceCompression = { btmGas: 4, btmSolar: 6, gasTurbine: 1 }[powerSystem.sourceKey] || 1;
    const visualUnits = clamp(Math.ceil(powerSystem.sourceUnits / sourceCompression), 1, 12);
    Object.entries(threeState.powerSupply).forEach(([key, group]) => {
      if (key === "backup") return;
      group.visible = powerLayerVisible && key === powerSystem.sourceKey;
      group.traverse((object) => {
        if (object.userData?.capacityIndex !== undefined) object.visible = object.userData.capacityIndex < visualUnits;
        if (!object.material) return;
        setObjectOpacity(object, powerFocused ? 0.94 : 0.34);
        setObjectEmissiveIntensity(object, powerFocused ? Math.max(object.material.emissiveIntensity || 0, 0.52) : 0.14);
      });
    });
    const batteryVisualUnits = Math.min(6, powerSystem.bessContainers);
    const generatorVisualUnits = powerSystem.generatorInstalled ? Math.min(5, Math.ceil(powerSystem.generatorInstalled / 3)) : 0;
    const fuelVisualUnits = powerSystem.fuelTankModules ? Math.min(2, Math.ceil(powerSystem.fuelTankModules / 5)) : 0;
    threeState.powerSupply.backup.visible = powerLayerVisible && powerSystem.backupKey !== "none";
    threeState.powerSupply.backup.traverse((object) => {
      const kind = object.userData?.backupKind;
      if (object.userData?.capacityIndex !== undefined) {
        const limit = kind === "generator" ? generatorVisualUnits : kind === "fuel" ? fuelVisualUnits : batteryVisualUnits;
        object.visible = object.userData.capacityIndex < limit;
      }
      if (kind === "fuelHeader") object.visible = powerSystem.backup.generatorFuel === "HVO";
      if (kind === "gasHeader") object.visible = powerSystem.backup.generatorFuel === "Pipeline gas";
      if (kind === "controls") object.visible = powerSystem.backupKey !== "none";
      if (kind === "planHalo") object.visible = powerSystem.backupKey !== "none";
      if (!object.material) return;
      if (kind === "battery" || kind === "planHalo") {
        object.material.color.set(powerSystem.backup.accent);
        object.material.emissive?.set(powerSystem.backup.accent);
      }
      if (kind === "generatorSurface") {
        const generatorColor = powerSystem.backup.generatorFuel === "HVO"
          ? "#36d7c8"
          : powerSystem.backup.generatorFuel === "Hydrogen FC"
            ? "#7c6dff"
            : "#f5c766";
        object.material.emissive?.set(generatorColor);
      }
      setObjectOpacity(object, powerFocused ? 0.92 : 0.3);
      setObjectEmissiveIntensity(object, powerFocused ? Math.max(object.material.emissiveIntensity || 0, 0.58) : 0.14);
    });
  }

  const siteCoolingVisible = state.internalLayer === "all" || state.internalLayer === "cooling";
  const siteCoolingFocused = state.internalLayer === "cooling" || state.twinMode === "fluid" || state.twinMode === "thermal" || state.twinMode === "physics";
  if (threeState.coolingSite) {
    const coolingArchitecture = coolingArchitectureValues(selectedBlock());
    threeState.coolingSite.group.visible = siteCoolingVisible;
    threeState.coolingSite.cduModules?.forEach((object) => {
      object.visible = (object.userData.cduIndex ?? 0) < Math.min(threeState.coolingSite.maxCduSlots, coolingArchitecture.installedCduUnits);
    });
    threeState.coolingSite.equipment.forEach((object) => setObjectOpacity(object, siteCoolingFocused ? 0.88 : 0.3));
    threeState.coolingSite.pipes.forEach((object) => {
      setObjectOpacity(object, siteCoolingFocused ? 0.92 : 0.24);
      setObjectEmissiveIntensity(object, siteCoolingFocused ? 0.72 : 0.12);
    });
    threeState.coolingSite.couplings.forEach((object) => {
      setObjectOpacity(object, siteCoolingFocused ? 0.98 : 0.34);
      setObjectEmissiveIntensity(object, siteCoolingFocused ? 1.05 : 0.2);
    });
    threeState.coolingSite.valveWheels?.forEach((object) => {
      setObjectOpacity(object, siteCoolingFocused ? 0.96 : 0.28);
      setObjectEmissiveIntensity(object, siteCoolingFocused ? 0.88 : 0.16);
    });
    threeState.coolingSite.leakSensors?.forEach((object) => {
      object.visible = siteCoolingVisible;
      setObjectOpacity(object, siteCoolingFocused ? 0.96 : 0.3);
      setObjectEmissiveIntensity(object, siteCoolingFocused ? 1.2 : 0.24);
    });
    threeState.coolingSite.flowMarkers.forEach((marker) => {
      marker.visible = siteCoolingVisible && siteCoolingFocused;
      marker.material.opacity = marker.visible ? 0.94 : 0;
      marker.material.emissiveIntensity = marker.visible ? 1.65 : 0;
    });
  }
  const constructionLayerFocused = state.internalLayer === "construction";
  threeState.siteSteelGroup?.traverse((object) => {
    if (!object.material) return;
    setObjectOpacity(object, constructionLayerFocused ? 0.38 : siteCoolingFocused || powerFocused ? 0.1 : state.internalLayer === "all" ? 0.62 : 0.24);
  });
}

function animateThreeScene(time = 0) {
  threeState.frameId = null;
  if (!threeState.renderer || document.hidden || !threeState.inViewport) return;
  const activeTwin = state.tab === "twin" || state.tab === "omniverse";
  const frameInterval = threeState.reducedMotion ? 1000 / 12 : activeTwin ? 1000 / 30 : 1000 / 15;
  if (threeState.lastRenderAt && time - threeState.lastRenderAt < frameInterval) {
    requestThreeFrame();
    return;
  }
  threeState.lastRenderAt = time;
  const delta = Math.min(40, time - threeState.lastTime || 16);
  threeState.lastTime = time;

  if (!threeState.reducedMotion && !threeState.drag.active) {
    threeState.root.rotation.y += 0.000035 * delta;
  }
  updateThreeCamera(false);
  threeState.fanMeshes.forEach((fan) => {
    fan.rotation.z += 0.03 * (delta / 16);
  });
  threeState.pulseMeshes.forEach((pulse) => {
    const ready = state.engine.powerSource !== "grid" || feeders[pulse.feeder].base + scenarioValues().utilityDelay <= state.week;
    pulse.mesh.visible = ready || state.bridge;
    const t = ((time * 0.001 + pulse.offset) % 4) / 4;
    pulse.mesh.position.x = -5.25 + t * 10.55;
    pulse.mesh.position.y = 0.22 + Math.sin(time * 0.004 + pulse.offset) * 0.025;
  });
  threeState.coolingFlowMeshes.forEach((marker) => {
    if (!marker.visible) return;
    const t = (time * 0.00022 + marker.userData.flowOffset) % 1;
    marker.position.lerpVectors(marker.userData.flowStart, marker.userData.flowEnd, t);
  });
  threeState.moduleMeshes.forEach((entry) => {
    if (entry.heatPlume.visible) entry.heatPlume.rotation.y += 0.006 * (delta / 16);
    if (entry.opsRing.visible) entry.opsRing.rotation.z += 0.01 * (delta / 16);
    entry.fluidBeads.forEach((bead) => {
      if (!bead.visible) return;
      const t = (time * 0.0012 + bead.userData.flowOffset) % 1;
      bead.position.x = -1.05 + t * 2.1;
    });
    entry.chipTiles.forEach((chip, index) => {
      if (!chip.visible) return;
      chip.material.emissiveIntensity = (chip.userData.baseIntensity || 0.4) + Math.sin(time * 0.004 + index * 0.7) * 0.12;
    });
    entry.internalDetails?.cduPumps.forEach((pump, index) => {
      if (!pump.visible) return;
      pump.rotation.x += 0.018 * (delta / 16) * (index + 1);
    });
    entry.internalDetails?.coolingFlowMarkers.forEach((marker) => {
      if (!marker.visible) return;
      const t = (time * 0.00072 + marker.userData.flowOffset) % 1;
      marker.position.lerpVectors(marker.userData.flowStart, marker.userData.flowEnd, t);
    });
    entry.internalDetails?.sensorNodes.forEach((sensor, index) => {
      if (!sensor.visible) return;
      sensor.scale.setScalar(1 + Math.sin(time * 0.006 + index) * 0.14);
      sensor.material.emissiveIntensity = 0.62 + Math.sin(time * 0.006 + index) * 0.22;
    });
    entry.internalDetails?.fiberLines.forEach((fiber, index) => {
      if (!fiber.visible) return;
      fiber.material.emissiveIntensity = 0.34 + Math.sin(time * 0.005 + index) * 0.16;
    });
    if (entry.constructionDetails?.group.visible) {
      const liftGhost = entry.constructionDetails.liftGhost;
      if (liftGhost.visible) {
        liftGhost.position.y = liftGhost.userData.baseY + Math.sin(time * 0.0016) * 0.045;
        liftGhost.rotation.y = Math.sin(time * 0.0011) * 0.018;
      }
      const hook = entry.constructionDetails.hookBlock;
      if (hook.visible) hook.scale.setScalar(1 + Math.sin(time * 0.004) * 0.08);
      const beacon = entry.constructionDetails.testBeacon;
      if (beacon.visible) beacon.material.emissiveIntensity = 0.85 + Math.sin(time * 0.008) * 0.4;
    }
  });

  resizeThreeScene();
  threeState.renderer.render(threeState.scene, threeState.camera);
  requestThreeFrame();
}

function stageProgress(block) {
  const d = datesFor(block);
  return [
    ["Design", block.design, d.designDone, "#8b939d"],
    ["Procure", block.procure, d.procureDone, "#d9a441"],
    ["Build", block.build, d.buildDone, "#2d6bff"],
    ["Energize", d.powerReady, d.energize + 1, "#dd7344"],
    ["Load", d.energize, d.load, "#2aa876"]
  ].map(([name, start, end, color]) => {
    const progress = clamp(((state.week - start) / Math.max(1, end - start)) * 100, 0, 100);
    return { name, start, end, color, progress };
  });
}

function renderConstructionTimeline(block) {
  if (!el.constructionTimeline || !el.constructionMilestones || !el.constructionTimelineRange) return;
  const construction = constructionValues(block);
  const maxWeek = Number(el.constructionTimelineRange.max) || 30;
  const timelineProgress = clamp(state.week / maxWeek * 100, 0, 100);
  const focused = state.tab === "twin" && state.internalLayer === "construction";
  el.constructionTimeline.classList.toggle("is-focused", focused);
  el.constructionTimeline.dataset.state = construction.complete ? "complete" : construction.activeStage.key;
  el.constructionTimeline.style.setProperty("--timeline-progress", `${timelineProgress.toFixed(2)}%`);
  el.constructionTimelinePhase.textContent = construction.complete
    ? "As-built handover"
    : `${construction.activeStage.label} / ${construction.stageProgressPct.toFixed(0)}%`;
  el.constructionTimelineWeek.textContent = state.week;
  el.constructionTimelineMeta.textContent = `${block.id} / W${construction.readyWeek} handover / ${construction.prefabPct}% prefab`;
  el.constructionTimelineRange.value = state.week;
  el.constructionMilestones.style.gridTemplateColumns = construction.stages
    .map((stage) => `${Math.max(1, stage.end - stage.start)}fr`)
    .join(" ");
  el.constructionMilestones.innerHTML = construction.stages.map((stage, index) => {
    const complete = construction.complete || index < construction.activeStageIndex;
    const active = !construction.complete && index === construction.activeStageIndex;
    const progress = complete ? 100 : active ? construction.stageProgressPct : 0;
    const stateClass = complete ? "is-complete" : active ? "is-active" : "is-future";
    return `
      <button
        class="construction-stage ${stateClass}"
        type="button"
        data-construction-week="${clamp(stage.start, 0, maxWeek)}"
        data-construction-stage="${stage.key}"
        ${active ? 'aria-current="step"' : ""}
        style="--stage-progress:${progress.toFixed(0)}%"
      >
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${stage.label}</strong>
        <em>W${stage.start}-${stage.end}</em>
        <span class="construction-stage-progress" aria-hidden="true"><i></i></span>
      </button>
    `;
  }).join("");
}

function selectedBlock() {
  return modules.find((block) => block.id === state.selectedId) || modules[0];
}

function nextActionFor(block) {
  const status = statusFor(block);
  const d = datesFor(block);
  const compute = computeValues(block);
  if (compute.deployRisk > 58) return `Retune ${compute.platform.label} with ${compute.stack.label} before release.`;
  if (status === "loaded") return "Repeat the steel bay and 800V DC bus kit.";
  if (status === "energized") return "Release rack shelf commissioning and load-bank window.";
  if (status === "power-hold") return "Lock rectifier skid witness test and DC breaker close.";
  if (d.buildDone > d.powerReady) return "Add steel crew coverage to pull bay erection ahead.";
  if (status === "procure") return "Confirm SST, rectifier skid, busway and DC breaker ship dates.";
  return "Freeze steel frame geometry and release rack/busway prefab kit.";
}

function criticalPathFor(block) {
  const d = datesFor(block);
  if (state.week >= d.load) return "Next pod";
  if (d.powerReady >= d.buildDone + 2) return "800V DC";
  if (d.buildDone > d.powerReady) return "Steel";
  return "Rack shelf";
}

function designTwinModel(block, d) {
  const plan = capacityPlanValues(block);
  const scanState = block.scan === "clear" || state.resolvedDeltas.size > 0 ? "Matched" : "Delta";
  return {
    eyebrow: "Capacity basis",
    headline: `${plan.releaseState}: ${plan.poweredRacks}/${block.racks} pod racks energizable.`,
    copy: `${plan.power.selectedMw.toFixed(0)} MW critical facility capacity yields ${plan.deployableRacks} ${plan.compute.platform.label} racks across ${plan.requiredPods} pods at ${plan.reservePct.toFixed(0)}% reserve.`,
    kpis: [
      ["Buildable IT", `${plan.siteItMw.toFixed(2)} MW`],
      ["Rack deployment", `${plan.deployableRacks}`],
      ["Steel pods", `${plan.requiredPods}`],
      ["Headroom", `${plan.headroomMw.toFixed(2)} MW`]
    ],
    flow: [
      ["Pod allocation", `${block.mw.toFixed(1)} MW`, plan.stagedRacks ? "#dd7344" : "#2aa876"],
      ["Primary", `${plan.power.sourceUnits} blocks`, plan.power.source.color],
      ["Site CDU", `${plan.siteCduActive}+1`, "#36d7c8"],
      ["Field basis", `${scanState} / W${d.load}`, scanState === "Matched" ? "#2aa876" : "#d9a441"]
    ]
  };
}

function operationsTwinModel(block) {
  const ops = operationsTwinValues(block);
  const maintenance = block.scan === "hold" ? "Open WO" : block.scan === "delta" && !state.resolvedDeltas.size ? "Scan delta" : "Clear";
  const failureRow = ops.failureActive
    ? ["Failure sim", ops.failure.label, ops.failure.color]
    : ["Failure sim", "Nominal", "#2aa876"];
  const actionRow = ops.failureActive
    ? ["Operator action", ops.failure.action.slice(0, 48) + (ops.failure.action.length > 48 ? "…" : ""), ops.failure.color]
    : ["Operator action", "Continue monitoring", "#8b939d"];
  return {
    eyebrow: "Operations twin",
    headline: `${ops.health} load state.`,
    copy: ops.failureActive
      ? `Injected ${ops.failure.label.toLowerCase()} — affected systems highlighted; recommended operator response shown below.`
      : "Live load, thermal margin, 800V DC utilization and work orders run on the same model.",
    kpis: [
      ["Live IT load", `${ops.liveMw.toFixed(1)} MW`],
      ["DC bus use", `${ops.dcUtilPct.toFixed(0)}%`],
      ["Cooling margin", `${ops.thermalMargin.toFixed(0)} C`],
      ["Risk score", `${ops.riskScore.toFixed(0)}`]
    ],
    flow: [
      failureRow,
      ["Telemetry", ops.liveMw > 0 ? "Live" : "Waiting", ops.liveMw > 0 ? "#2aa876" : "#8b939d"],
      ["Thermal", `${ops.thermalMargin.toFixed(0)} C`, ops.thermalMargin < 9 ? "#dd7344" : "#2aa876"],
      ["Power", `${ops.dcUtilPct.toFixed(0)}%`, ops.dcUtilPct > 82 ? "#d9a441" : "#2d6bff"],
      actionRow,
      ["Work order", maintenance, maintenance === "Clear" ? "#2aa876" : "#dd7344"]
    ]
  };
}

function mechanicsTwinModel(block) {
  const m = mechanicsValues(block);
  const foundation = m.foundation;
  const assumption = `${foundation.program.label} / ${foundation.site.label} / ${foundation.tier.label}`;
  return {
    eyebrow: "California design engine",
    headline: `${m.stateLabel} foundation load path.`,
    copy: `Engine output: ${assumption}. Site ${foundation.siteClass}, ${foundation.liquefaction} liquefaction, ${foundation.seismicG.toFixed(2)}g screen.`,
    kpis: [
      ["Bearing", `${m.bearingKpa.toFixed(0)} kPa`],
      ["Settlement", `${m.settlementMm.toFixed(1)} mm`],
      ["Base shear", `${m.seismicBaseShearKn.toFixed(0)} kN`],
      ["Anchor tension", `${m.anchorTensionKn.toFixed(1)} kN`]
    ],
    flow: [
      ["Pod mass", `${m.serviceMassTon.toFixed(0)} t`, "#8b939d"],
      ["Soil use", `${m.bearingUtilPct.toFixed(0)}%`, m.color],
      ["Limit", `${foundation.settlementLimitMm} mm`, m.settlementMm > foundation.settlementLimitMm ? "#dd7344" : "#2aa876"],
      ["Foundation", foundation.type, "#36d7c8"]
    ]
  };
}

function fluidTwinModel(block) {
  const f = fluidValues(block);
  const cooling = coolingArchitectureValues(block);
  const plan = capacityPlanValues(block);
  return {
    eyebrow: "Fluid physics",
    headline: `${plan.siteCduInstalled} site CDUs / ${cooling.installedCduUnits} per full-build pod.`,
    copy: `${cooling.supplier.label}: ${Math.round(plan.siteDesignFlowLpm).toLocaleString()} L/min site design flow with N+1 CDU and pump modules; the selected pod remains sized for all ${block.racks} rack slots.`,
    kpis: [
      ["Site flow", `${Math.round(plan.siteDesignFlowLpm).toLocaleString()} L/min`],
      ["Site CDU", `${plan.siteCduActive}+1`],
      ["Pod CDU", `${cooling.activeCduUnits}+1`],
      ["Pod rack QDs", `${cooling.quickDisconnects}`]
    ],
    flow: [
      ["FWS / HX", `${f.designFlowLpm.toFixed(0)} L/min`, "#36d7c8"],
      ["CDU pumps", `${cooling.activePumps}+1`, "#2aa876"],
      ["Manifolds", `${cooling.rowManifolds} zones`, "#2d6bff"],
      ["Cold plates", `${cooling.thermal.coldPlateC.toFixed(1)} C`, f.color]
    ]
  };
}

function energyTwinModel(block) {
  const e = energyValues(block);
  const power = e.powerSystem;
  const plan = capacityPlanValues(block);
  return {
    eyebrow: "Energy system",
    headline: `${power.source.shortLabel}: ${plan.deployableRacks} racks from ${power.selectedMw.toFixed(0)} MW critical.`,
    copy: `${power.source.path}. ${plan.reservePct.toFixed(0)}% operating reserve and PUE ${plan.designPue.toFixed(3)} leave ${plan.headroomMw.toFixed(2)} MW headroom; reliability remains a probability screen, not Tier certification.`,
    kpis: [
      ["Critical power", `${power.selectedMw.toFixed(0)} MW`],
      ["Buildable IT", `${plan.siteItMw.toFixed(2)} MW`],
      ["Rack deployment", `${plan.deployableRacks}`],
      ["Headroom", `${plan.headroomMw.toFixed(2)} MW`]
    ],
    flow: [
      ["Primary", power.source.shortLabel, power.source.color],
      ["Topology", power.reliability.label, "#d9a441"],
      ["800V bus", `${Math.round(e.busCurrentA).toLocaleString()} A`, e.color],
      ["Reserve", power.backup.shortLabel, power.backupKey === "none" ? "#dd7344" : "#2aa876"]
    ]
  };
}

function physicsTwinModel(block) {
  const ledger = physicsLedgerValues(block);
  const closed = ledger.entries.filter((entry) => entry.residualPct !== null && entry.residualPct <= 0.1).length;
  return {
    eyebrow: "First-principles ledger",
    headline: `${closed}/5 physical closures pass.`,
    copy: "Energy, circuits, thermodynamics, fluid flow and mechanics close against one design state; reliability remains an explicit probabilistic screen.",
    kpis: [
      ["Source power", `${ledger.sourceMw.toFixed(2)} MW`],
      ["Physical closures", `${closed}/5`],
      ["Domains", `${ledger.entries.length}`],
      ["Basis", "Feynman + OCP"]
    ],
    flow: ledger.entries.slice(0, 4).map((entry) => [entry.domain, entry.residualPct === null ? "screen" : `${entry.residualPct.toFixed(2)}% residual`, entry.residualPct !== null && entry.residualPct <= 0.1 ? "#2aa876" : "#d9a441"])
  };
}

function thermalTwinModel(block) {
  const t = thermalValues(block);
  return {
    eyebrow: "Thermal physics",
    headline: `${t.stateLabel} heat path.`,
    copy: "Heat load, coolant return, cold-plate approach and PUE proxy are calculated from the same 4D twin.",
    kpis: [
      ["Heat load", `${t.fluid.heatKw.toFixed(0)} kW`],
      ["Return temp", `${t.returnC.toFixed(0)} C`],
      ["Cold plate", `${t.coldPlateC.toFixed(1)} C`],
      ["PUE proxy", `${t.pueProxy.toFixed(3)}`]
    ],
    flow: [
      ["Heat flux", `${t.heatFluxKwM2.toFixed(0)} kW/m2`, t.color],
      ["Margin", `${t.thermalMarginC.toFixed(1)} C`, t.thermalMarginC < 6 ? "#dd7344" : "#2aa876"],
      ["Reuse", `${t.heatReuseKw.toFixed(0)} kW`, "#d9a441"],
      ["Model", "Thermal RC screen", "#2d6bff"]
    ]
  };
}

function computeTwinModel(block) {
  const c = computeValues(block);
  const plan = capacityPlanValues(block);
  return {
    eyebrow: "Compute stack",
    headline: `${plan.poweredRacks}/${block.racks} racks fit the current pod allocation.`,
    copy: `${c.platform.vendor} ${c.platform.silicon} at ${c.rackKw.toFixed(0)} kW/rack; full pod population requires ${plan.podRequiredItMw.toFixed(2)} MW while ${block.mw.toFixed(1)} MW is allocated.`,
    kpis: [
      ["Energizable GPUs", `${plan.energizedAccelerators}`],
      ["Rack IT", `${c.rackKw.toFixed(0)} kW/rack`],
      ["Full-build GPUs", `${c.accelerators}`],
      ["Pod gap", `${plan.podCapacityGapMw.toFixed(2)} MW`]
    ],
    flow: [
      ["Chip", c.platform.silicon, c.color],
      ["Fabric", `${c.fabricTbps.toFixed(0)} TB/s`, c.fabricFit < 70 ? "#dd7344" : "#2d6bff"],
      ["Runtime", c.stack.runtime, "#36d7c8"],
      ["Scheduler", c.stack.scheduler, "#d9a441"]
    ]
  };
}

function softwareTwinModel(block) {
  const s = softwareValues(block);
  return {
    eyebrow: "Software architecture",
    headline: `${s.stateLabel} AI factory OS.`,
    copy: `${s.compute.stack.label} runs ${s.compute.platform.label}; policy, runtime, telemetry and security are scored before rack release.`,
    kpis: [
      ["Release score", `${s.releaseScore}`],
      ["Queue p95", `${s.queueP95Min.toFixed(0)} min`],
      ["Rollback", `${s.rollbackMin.toFixed(0)} min`],
      ["Grid flex", `${s.gridFlexScore.toFixed(0)}`]
    ],
    flow: [
      ["Control", `${s.controlPlaneScore.toFixed(0)}`, s.controlPlaneScore < 70 ? "#dd7344" : "#2aa876"],
      ["Runtime", `${s.dataPlaneScore.toFixed(0)}`, s.dataPlaneScore < 70 ? "#dd7344" : "#2d6bff"],
      ["Telemetry", `${s.observabilityScore.toFixed(0)}`, s.observabilityScore < 70 ? "#d9a441" : "#36d7c8"],
      ["Security", `${s.securityScore.toFixed(0)}`, s.securityScore < 70 ? "#dd7344" : "#2aa876"]
    ]
  };
}

function internalDetailRows(block) {
  const d = datesFor(block);
  const compute = computeValues(block);
  const energy = energyValues(block);
  const fluid = fluidValues(block);
  const thermal = thermalValues(block);
  const mechanics = mechanicsValues(block);
  const software = softwareValues(block);
  const ops = operationsTwinValues(block);
  const cooling = coolingArchitectureValues(block);
  const power = energy.powerSystem;
  const plan = capacityPlanValues(block);
  const construction = constructionValues(block);
  return [
    ["Rack row", `${plan.poweredRacks}/${block.racks} racks energized`, `${plan.stagedRacks} staged / ${compute.acceleratorsPerRack} accelerators per rack`, plan.stagedRacks ? "#d9a441" : "#2aa876"],
    ["Compute sleds", compute.platform.label, `${compute.rackKw.toFixed(0)} kW/rack / ${compute.rack.label}`, compute.color],
    ["Pod allocation", `${block.mw.toFixed(1)} MW available`, `${plan.podRequiredItMw.toFixed(2)} MW full-build / ${plan.podCapacityGapMw.toFixed(2)} MW gap`, plan.stagedRacks ? "#dd7344" : "#2aa876"],
    ["Site capacity", `${plan.deployableRacks} racks / ${plan.requiredPods} pods`, `${plan.siteItMw.toFixed(2)} MW IT / ${plan.headroomMw.toFixed(2)} MW headroom`, plan.requiredPods > modules.length ? "#dd7344" : "#2aa876"],
    ["Construction phase", construction.complete ? "Handover complete" : `${construction.activeStage.label} / ${construction.stageProgressPct.toFixed(0)}%`, `W${state.week} / overall ${construction.progressPct.toFixed(0)}%`, gpuInternalLayers.construction.color],
    ["Module set", `${construction.prefabPct}% prefab / ${construction.crewCount} crews`, `${construction.installMethod} / lift W${construction.liftWeek}`, gpuInternalLayers.construction.color],
    ["Field release", construction.nextGate, `Target load W${construction.readyWeek} / ${mechanics.foundation.anchorCount} anchor points`, construction.complete ? "#2aa876" : gpuInternalLayers.construction.color],
    ["Primary power", `${power.source.shortLabel} / ${power.selectedMw.toFixed(0)} MW`, `${power.sourceUnits} ${power.source.moduleLabel} modules`, power.source.color],
    ["Source plant", power.source.technology || power.source.label, power.sourceYardEnvelopeM2 ? `${power.source.fuelType} / ${power.sourceYardEnvelopeM2.toLocaleString()} m2 yard` : power.source.path, power.source.color],
    ["Reliability", `${power.reliability.label} / ${power.reliabilityState}`, `${power.availabilityPct.toFixed(5)}% screen / ${power.outageMinutesYear.toFixed(1)} min/yr`, power.reliabilityState === "Exposed" ? "#dd7344" : "#2aa876"],
    ["Backup", `${power.backup.planCode} / ${power.backup.shortLabel}`, `${power.backupResilienceScore}/100 resilience / ${power.backupFootprintM2.toLocaleString()} m2 yard`, power.backupKey === "none" ? "#dd7344" : power.backup.accent],
    ["800V sidecar", `${Math.round(energy.busCurrentA).toLocaleString()} A bus`, `${energy.bridgeKwh.toFixed(0)} kWh bridge / ${energy.conversionLossKw.toFixed(0)} kW loss`, energy.color],
    ["DC protection", `${energy.feederUsePct.toFixed(0)}% feeder`, `${energy.transientScore.toFixed(0)} transient score`, energy.color],
    ["Modular supply", cooling.supplier.label, `${cooling.supplier.delivery} / open fit ${cooling.supplier.openFit}`, "#7c6dff"],
    ["CDU + manifold", `${cooling.activeCduUnits}+1 CDU / ${cooling.activePumps}+1 pumps`, `${fluid.designFlowLpm.toFixed(0)} L/min / ${(fluid.pipeDiameterM * 1000).toFixed(0)} mm header`, fluid.color],
    ["Rack liquid interface", `${cooling.rowManifolds} manifolds / ${cooling.quickDisconnects} QDs`, `${cooling.supplier.coolingInterface}`, "#36d7c8"],
    ["Cold plates", `${cooling.coldPlateCircuits} circuits / ${thermal.coldPlateC.toFixed(1)} C`, `${thermal.thermalMarginC.toFixed(1)} C margin / ${cooling.leakZones} leak zones`, thermal.color],
    ["Containment", "Cold / hot aisle", `${thermal.supplyC.toFixed(0)}C supply / ${thermal.returnC.toFixed(0)}C return`, thermal.color],
    ["Cable tray", `${compute.fabricTbps.toFixed(0)} TB/s fabric`, `${compute.stack.scheduler} / ${compute.stack.runtime}`, software.color],
    ["Sensors", `${ops.health} ops`, `${ops.riskScore.toFixed(0)} risk / ${block.scan === "clear" ? "scan matched" : "scan delta"}`, ops.riskColor],
    ["Safety + access", "VESDA / E-stop / badge", `${mechanics.foundation.anchorCount} anchors / W${d.load} load`, mechanics.color],
    ["Foundation tie", mechanics.foundation.type, `${mechanics.bearingKpa.toFixed(0)} kPa / ${mechanics.settlementMm.toFixed(1)} mm`, mechanics.color],
    ["Telemetry", software.stateLabel, `${software.releaseScore} release / ${software.observabilityScore.toFixed(0)} observability`, software.color]
  ];
}

function gpuRackInternalRows(block) {
  const compute = computeValues(block);
  const energy = energyValues(block);
  const fluid = fluidValues(block);
  const thermal = thermalValues(block);
  const software = softwareValues(block);
  const ops = operationsTwinValues(block);
  const power = energy.powerSystem;
  const cooling = coolingArchitectureValues(block);
  const plan = capacityPlanValues(block);
  const construction = constructionValues(block);
  return [
    ["Primary source", `${power.source.shortLabel} / ${power.selectedMw.toFixed(0)} MW`],
    ["Source plant", `${power.source.technology || power.source.label}${power.sourceYardEnvelopeM2 ? ` / ${power.sourceYardEnvelopeM2.toLocaleString()} m2` : ""}`],
    ["Reliability", `${power.reliability.label} / ${power.availabilityPct.toFixed(5)}%`],
    ["Backup", `${power.backup.planCode} / ${power.backup.shortLabel} / ${power.backupResilienceScore}`],
    ["Backup yard", `${power.backupFootprintM2.toLocaleString()} m2 / ${power.backup.permitClass}`],
    ["Construction release", `${construction.activeStage.label} / W${construction.readyWeek}`],
    ["Rack power", `${compute.rackKw.toFixed(0)} kW/rack`],
    ["Pod IT allocation", `${block.mw.toFixed(2)} MW`],
    ["Full-build IT", `${compute.computeMw.toFixed(2)} MW`],
    ["Energizable racks", `${plan.poweredRacks} / ${block.racks}`],
    ["Energizable GPUs", `${plan.energizedAccelerators}`],
    ["Design GPUs", `${compute.accelerators} / ${compute.acceleratorsPerRack} per rack`],
    ["Fabric", `${compute.fabricTbps.toFixed(0)} TB/s`],
    ["800V bus", `${Math.round(energy.busCurrentA).toLocaleString()} A`],
    ["Coolant", `${fluid.flowLpm.toFixed(0)} L/min / ${fluid.rackFlowLpm.toFixed(0)} per rack`],
    ["CDU train", `${cooling.activeCduUnits}+1 / ${cooling.designMarginPct.toFixed(0)}% installed margin`],
    ["Liquid interfaces", `${cooling.quickDisconnects} QDs / ${cooling.coldPlateCircuits} cold plates`],
    ["Cold plate", `${thermal.coldPlateC.toFixed(1)} C`],
    ["Sidecar", `${energy.stateLabel} / ${state.bridge ? "bridge" : "direct"}`],
    ["Telemetry", `${ops.health} / ${software.observabilityScore.toFixed(0)}`]
  ];
}

function internalLegendRows() {
  return [
    ["Power", gpuInternalLayers.power.color],
    ["Liquid", gpuInternalLayers.cooling.color],
    ["Compute", gpuInternalLayers.compute.color],
    ["Network", gpuInternalLayers.network.color],
    ["Telemetry", gpuInternalLayers.telemetry.color],
    ["Structure", gpuInternalLayers.structure.color],
    ["Foundation", gpuInternalLayers.foundation.color],
    ["Construction", gpuInternalLayers.construction.color],
    ["Safety", gpuInternalLayers.safety.color]
  ];
}

function renderGpuLayerControls() {
  if (!el.gpuLayerControls) return;
  document.querySelectorAll("[data-internal-layer]").forEach((button) => {
    const active = button.dataset.internalLayer === state.internalLayer;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (el.cutawayToggle) {
    el.cutawayToggle.classList.toggle("is-active", state.cutaway !== false);
    el.cutawayToggle.setAttribute("aria-pressed", String(state.cutaway !== false));
  }
  if (el.explodedToggle) {
    el.explodedToggle.classList.toggle("is-active", state.exploded === true);
    el.explodedToggle.setAttribute("aria-pressed", String(state.exploded === true));
  }
}

function renderOpsFailureControls() {
  if (!el.opsFailureControls) return;
  const visible = state.tab === "twin" && state.twinMode === "ops";
  el.opsFailureControls.hidden = !visible;
  if (!visible) return;
  el.opsFailureControls.innerHTML = `
    <header><span>Failure simulation</span><strong>${opsFailureProfiles[state.opsFailure]?.label || "Nominal"}</strong></header>
    <div class="ops-failure-grid" role="group" aria-label="Inject operational failure">
      ${Object.entries(opsFailureProfiles).map(([key, profile]) => `
        <button
          type="button"
          class="ops-failure-btn${state.opsFailure === key ? " is-active" : ""}"
          data-ops-failure="${key}"
          aria-pressed="${state.opsFailure === key}"
          style="--failure-color:${profile.color}"
        >${profile.label}</button>
      `).join("")}
    </div>
    <p class="ops-failure-action">${opsFailureProfiles[state.opsFailure]?.action || ""}</p>
  `;
}

function renderInternalDetails(block) {
  if (!el.internalDetails) return;
  const layerRowLabels = {
    power: ["Primary power", "Source plant", "Reliability", "Backup", "800V sidecar", "DC protection", "Modular supply"],
    cooling: ["Modular supply", "CDU + manifold", "Rack liquid interface", "Cold plates", "Containment", "Sensors"],
    compute: ["Rack row", "Compute sleds", "Pod allocation", "Site capacity"],
    network: ["Cable tray", "Telemetry"],
    safety: ["Safety + access", "Sensors"],
    structure: ["Foundation tie", "Safety + access"],
    foundation: ["Foundation tie", "Construction phase", "Safety + access"],
    construction: ["Construction phase", "Module set", "Field release", "Foundation tie", "Safety + access"],
    telemetry: ["Sensors", "Telemetry"]
  };
  const layerRackLabels = {
    power: ["Primary source", "Source plant", "Reliability", "Backup", "Backup yard", "Rack power", "Pod IT allocation", "Full-build IT", "Energizable racks", "800V bus", "Sidecar"],
    cooling: ["Rack power", "Full-build IT", "Energizable racks", "Coolant", "CDU train", "Liquid interfaces", "Cold plate", "Telemetry"],
    compute: ["Rack power", "Pod IT allocation", "Full-build IT", "Energizable racks", "Energizable GPUs", "Design GPUs", "Fabric"],
    network: ["Fabric", "Telemetry"],
    safety: ["Sidecar", "Telemetry"],
    structure: ["Rack power", "Energizable racks", "Design GPUs"],
    foundation: ["Rack power", "Energizable racks", "Construction release"],
    construction: ["Construction release", "Pod IT allocation", "Energizable racks", "Sidecar"],
    telemetry: ["Telemetry", "Coolant", "Cold plate"]
  };
  const activeDetailLabels = layerRowLabels[state.internalLayer];
  const activeRackLabels = layerRackLabels[state.internalLayer];
  const rows = internalDetailRows(block).filter(([label]) => !activeDetailLabels || activeDetailLabels.includes(label));
  const rackRows = gpuRackInternalRows(block).filter(([label]) => !activeRackLabels || activeRackLabels.includes(label));
  const legendRows = internalLegendRows();
  el.internalDetails.innerHTML = `
    <div class="internal-head">
      <div>
        <span>Internal systems</span>
        <strong>${block.id} full-stack module</strong>
      </div>
      <em>${state.internalLayer === "all" ? "all" : gpuInternalLayers[state.internalLayer]?.label || "all"} / ${state.cutaway !== false ? "cutaway" : "closed"}</em>
    </div>
    <div class="gpu-rack-table" aria-label="GPU rack internals">
      ${rackRows.map(([label, value]) => `
        <div>
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `).join("")}
    </div>
    <div class="internal-legend" aria-label="3D layer legend">
      ${legendRows.map(([label, color]) => `
        <span style="--legend-color:${color}"><i aria-hidden="true"></i>${label}</span>
      `).join("")}
    </div>
    <div class="internal-grid">
      ${rows.map(([label, value, detail, color]) => `
        <article style="--detail-color:${color}">
          <span>${label}</span>
          <strong>${value}</strong>
          <em>${detail}</em>
        </article>
      `).join("")}
    </div>
  `;
}

function engineButtonGroup(title, key, options) {
  return `
    <div class="engine-group">
      <span>${title}</span>
      <div class="engine-options">
        ${Object.entries(options).map(([value, option]) => `
          <button class="engine-chip${state.engine[key] === value ? " is-active" : ""}" type="button" data-engine-key="${key}" data-engine-value="${value}">
            ${option.label}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function backupPlanSelector() {
  const active = activeBackupProfile();
  return `
    <section class="backup-plan-selector" aria-label="Backup power plan selector">
      <header>
        <div><span>Backup plan</span><strong>${active.strategy}</strong></div>
        <em>${active.planCode} / ${active.siteImpact} site impact</em>
      </header>
      <div class="backup-plan-grid">
        ${Object.entries(backupProfiles).map(([value, option]) => {
          const score = backupProfileResilienceScore(option);
          return `
            <button
              class="backup-plan-card${state.engine.backup === value ? " is-active" : ""}"
              type="button"
              data-engine-key="backup"
              data-engine-value="${value}"
              aria-pressed="${state.engine.backup === value}"
              style="--plan-color:${option.accent};--plan-score:${score}%"
            >
              <span><b>${option.planCode}</b><i>${score}</i></span>
              <strong>${option.strategy}</strong>
              <em>${option.shortLabel}</em>
              <span class="backup-plan-meter" aria-hidden="true"><i></i></span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function enginePowerRange() {
  return `
    <div class="engine-range-group">
      <div><span>Critical facility power</span><strong data-power-mw-value>${Math.round(state.engine.powerMw)} MW</strong></div>
      <input class="engine-range" type="range" min="5" max="250" step="5" value="${Math.round(state.engine.powerMw)}" data-engine-range="powerMw" aria-label="Critical facility power in megawatts" />
      <footer><span>5 MW</span><span>250 MW</span></footer>
    </div>
  `;
}

function engineReserveRange() {
  return `
    <div class="engine-range-group">
      <div><span>Operating reserve</span><strong data-reserve-pct-value>${Math.round(state.engine.reservePct)}%</strong></div>
      <input class="engine-range" type="range" min="5" max="30" step="1" value="${Math.round(state.engine.reservePct)}" data-engine-range="reservePct" aria-label="Operating reserve percent" />
      <footer><span>5%</span><span>30%</span></footer>
    </div>
  `;
}

function supplierSpec(supplier = activeModularSupply()) {
  return `
    <div class="supplier-spec">
      <header><span>Module supply</span><strong>${supplier.vendor}</strong><em>${supplier.readiness}</em></header>
      <div><span>Delivery</span><strong>${supplier.delivery}</strong></div>
      <div><span>Rack</span><strong>${supplier.rackStandard}</strong></div>
      <div><span>Liquid</span><strong>${supplier.coolingInterface}</strong></div>
      <div><span>Power</span><strong>${supplier.powerPath}</strong></div>
      <footer><span>Open fit</span><strong>${supplier.openFit}</strong><a href="${supplier.sourceUrl}" target="_blank" rel="noreferrer">Source</a></footer>
    </div>
  `;
}

function coolingModuleStack(cooling) {
  const steps = [
    ["FWS / HX", `${cooling.fluid.designFlowLpm.toFixed(0)} L/min`],
    ["CDU", `${cooling.activeCduUnits}+1 x ${cooling.cduBlockMw.toFixed(1)} MW`],
    ["Pumps", `${cooling.activePumps}+1`],
    ["Manifolds", `${cooling.rowManifolds}`],
    ["Rack QD", `${cooling.quickDisconnects}`],
    ["Cold plates", `${cooling.coldPlateCircuits}`]
  ];
  return `
    <div class="cooling-module-stack" aria-label="Modular cooling chain">
      ${steps.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
    </div>
  `;
}

function capacityPlanMarkup(block) {
  const plan = capacityPlanValues(block);
  const statusClass = (value) => value.toLowerCase();
  return `
    <section class="capacity-plan" aria-label="Buildable capacity plan">
      <header>
        <div><span>Buildable capacity</span><strong>${plan.releaseState}</strong></div>
        <em>${plan.gateCount} gates / ${plan.watchCount} watch</em>
      </header>
      <div class="capacity-ledger">
        <div><span>Critical power</span><strong>${plan.power.selectedMw.toFixed(0)} MW</strong></div>
        <div><span>Usable IT</span><strong>${plan.siteItMw.toFixed(2)} MW</strong></div>
        <div><span>Rack deployment</span><strong>${plan.deployableRacks}</strong></div>
        <div><span>Steel pods</span><strong>${plan.requiredPods}</strong></div>
        <div><span>Accelerators</span><strong>${plan.siteAccelerators.toLocaleString()}</strong></div>
        <div><span>Headroom</span><strong>${plan.headroomMw.toFixed(2)} MW</strong></div>
      </div>
      <div class="pod-fit${plan.stagedRacks ? " has-gate" : ""}">
        <div><span>${block.id} power fit</span><strong>${plan.poweredRacks}/${block.racks} racks energizable</strong></div>
        <em>${plan.stagedRacks ? `${plan.stagedRacks} rack positions staged / +${plan.podCapacityGapMw.toFixed(2)} MW for full population` : "Full rack population fits the IT allocation"}</em>
      </div>
      <div class="equipment-schedule" aria-label="Equipment schedule">
        <header><span>Equipment schedule</span><strong>Duty</strong><strong>Installed</strong></header>
        ${plan.equipmentSchedule.map((item) => `
          <div>
            <span><strong>${item.system}</strong><em>${item.basis}</em></span>
            <b>${item.duty}</b>
            <b>${item.installed}</b>
          </div>
        `).join("")}
      </div>
      <div class="engineering-gates" aria-label="Engineering gates">
        ${plan.gates.map((gate) => `
          <div class="is-${statusClass(gate.state)}">
            <span><i aria-hidden="true"></i>${gate.label}</span>
            <strong>${gate.state}</strong>
            <em>${gate.detail}</em>
          </div>
        `).join("")}
      </div>
      <footer><span>Next decision</span><strong>${plan.nextDecision}</strong></footer>
    </section>
  `;
}

function backupArchitectureMarkup(power) {
  const gallons = power.fuelLiters / 3.78541;
  const reserveMedium = power.fuelLiters
    ? `${Math.round(gallons / 1000).toLocaleString()}k gal onsite`
    : power.generatorInstalled
      ? power.backup.generatorFuel
      : power.backup.storageLabel;
  return `
    <section class="backup-architecture" aria-label="Backup power architecture">
      <header>
        <div><span>${power.backup.planCode} continuity stack</span><strong>${power.backup.label}</strong></div>
        <em>${power.backup.blackStart ? "Black-start" : "No black-start"}</em>
      </header>
      <div class="backup-sequence">
        ${power.backupSequence.map((step) => `
          <div>
            <span>${step.window}</span>
            <strong>${step.source}</strong>
            <em>${step.duty}</em>
          </div>
        `).join("")}
      </div>
      <div class="backup-metrics">
        <div><span>Usable bridge</span><strong>${power.batteryUsableMwh.toFixed(1)} MWh</strong></div>
        <div><span>Autonomy</span><strong>${power.backup.autonomyHours.toFixed(1)} h</strong></div>
        <div><span>Standby generation</span><strong>${power.generatorInstalled ? `${power.generatorActive}+1 x ${power.backup.generatorUnitMw.toFixed(1)} MW` : "None"}</strong></div>
        <div><span>Reserve medium</span><strong>${reserveMedium}</strong></div>
        <div><span>Yard envelope</span><strong>${power.backupFootprintM2.toLocaleString()} m2</strong></div>
        <div><span>Resilience screen</span><strong>${power.backupResilienceScore}/100</strong></div>
      </div>
      <div class="backup-gates">
        ${power.backupGates.map((gate) => `
          <div class="is-${gate.state.toLowerCase()}">
            <span><i aria-hidden="true"></i>${gate.label}</span>
            <strong>${gate.state}</strong>
            <em>${gate.detail}</em>
          </div>
        `).join("")}
      </div>
      <footer><span>${power.warning}</span><a href="${power.backup.sourceUrl}" target="_blank" rel="noreferrer">Source</a></footer>
    </section>
  `;
}

function primarySourceArchitectureMarkup(power) {
  if (power.sourceKey !== "gasTurbine") return "";
  const source = power.source;
  const path = [
    ["01", "Firm gas", "Meter + pressure control"],
    ["02", "DLE turbine", `${source.unitMw.toFixed(1)} MW modular package`],
    ["03", "MV generator", "Protection + islanding"],
    ["04", "800V DC", "Switchgear + rectifier"]
  ];
  return `
    <section class="turbine-architecture" aria-label="Aeroderivative gas turbine primary power architecture" style="--turbine-color:${source.color}">
      <header>
        <div><span>P-GT / primary plant</span><strong>${source.technology}</strong></div>
        <em>${power.requiredUnits} duty / ${power.sourceUnits} installed</em>
      </header>
      <div class="turbine-path">
        ${path.map(([index, label, detail]) => `
          <div><span>${index}</span><strong>${label}</strong><em>${detail}</em></div>
        `).join("")}
      </div>
      <div class="turbine-metrics">
        <div><span>Unit net</span><strong>${source.unitMw.toFixed(1)} MW</strong></div>
        <div><span>Plant nameplate</span><strong>${power.sourceNameplateMw.toFixed(1)} MW</strong></div>
        <div><span>LHV efficiency</span><strong>${(source.conversionEfficiency * 100).toFixed(1)}%</strong></div>
        <div><span>Fast start</span><strong>${source.startupMinutes} min</strong></div>
        <div><span>Fuel input</span><strong>${power.sourceFuelInputMwth.toFixed(1)} MWth</strong></div>
        <div><span>Reject heat</span><strong>${power.sourceWasteHeatMw.toFixed(1)} MW</strong></div>
        <div><span>Yard envelope</span><strong>${power.sourceYardEnvelopeM2.toLocaleString()} m2</strong></div>
        <div><span>Largest lift</span><strong>${source.largestLiftTon} t</strong></div>
      </div>
      <footer>
        <span>${source.noxPpm} ppm NOx DLE basis. Validate SCR, acoustics, ambient derate, firm transport and the seismic turbine-generator mat.</span>
        <a href="${source.sourceUrl}" target="_blank" rel="noreferrer">GE basis</a>
      </footer>
    </section>
  `;
}

function physicsLedgerMarkup(block) {
  const ledger = physicsLedgerValues(block);
  return `
    <div class="physics-ledger">
      ${ledger.entries.map((entry) => `
        <article>
          <header><span>${entry.domain}</span><strong>${entry.residualPct === null ? "SCREEN" : entry.residualPct <= 0.1 ? "CLOSED" : "CHECK"}</strong></header>
          <code>${entry.equation}</code>
          <p>${entry.value}</p>
          <a href="${entry.source.sourceUrl}" target="_blank" rel="noreferrer">${entry.source.source}</a>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDesignEngine(block) {
  if (!["design", "mechanics", "energy", "fluid", "thermal", "physics", "compute", "software"].includes(state.twinMode)) {
    el.designEngine.classList.remove("is-visible");
    el.designEngine.innerHTML = "";
    return;
  }
  el.designEngine.classList.add("is-visible");
  if (state.twinMode === "design") {
    const energy = energyValues(block);
    const power = energy.powerSystem;
    const cooling = coolingArchitectureValues(block);
    const plan = capacityPlanValues(block);
    el.designEngine.innerHTML = `
      ${engineButtonGroup("Primary supply", "powerSource", powerSourceProfiles)}
      ${enginePowerRange()}
      ${engineReserveRange()}
      ${engineButtonGroup("Reliability topology", "reliability", reliabilityProfiles)}
      ${backupPlanSelector()}
      ${engineButtonGroup("Accelerator", "compute", computePlatforms)}
      ${engineButtonGroup("Modular supplier", "supplier", modularSupplyProfiles)}
      <div class="engine-output">
        <div><span>Primary source</span><strong>${power.source.shortLabel}</strong></div>
        <div><span>Source blocks</span><strong>${power.requiredUnits} duty / ${power.sourceUnits} installed</strong></div>
        <div><span>Design PUE</span><strong>${plan.designPue.toFixed(3)}</strong></div>
        <div><span>Operating reserve</span><strong>${plan.reservePct.toFixed(0)}%</strong></div>
        <div><span>Rack density</span><strong>${energy.compute.rackKw.toFixed(0)} kW/rack</strong></div>
        <div><span>Pod CDU</span><strong>${cooling.activeCduUnits}+1 / ${cooling.designMarginPct.toFixed(0)}% margin</strong></div>
      </div>
      ${primarySourceArchitectureMarkup(power)}
      ${backupArchitectureMarkup(power)}
      ${capacityPlanMarkup(block)}
      ${supplierSpec(cooling.supplier)}
    `;
    return;
  }
  if (state.twinMode === "physics") {
    const power = powerSystemForTarget(state.engine.powerMw);
    el.designEngine.innerHTML = `
      ${engineButtonGroup("Primary supply", "powerSource", powerSourceProfiles)}
      ${enginePowerRange()}
      ${engineButtonGroup("Reliability topology", "reliability", reliabilityProfiles)}
      ${backupPlanSelector()}
      ${primarySourceArchitectureMarkup(power)}
      ${physicsLedgerMarkup(block)}
    `;
    return;
  }
  if (state.twinMode === "software") {
    const s = softwareValues(block);
    el.designEngine.innerHTML = `
      ${engineButtonGroup("Chip platform", "compute", computePlatforms)}
      ${engineButtonGroup("Software stack", "stack", softwareStacks)}
      ${engineButtonGroup("Workload", "workload", workloadProfiles)}
      ${engineButtonGroup("Placement policy", "policy", softwarePolicies)}
      <div class="engine-output">
        <div><span>Control plane</span><strong>${s.compute.stack.scheduler}</strong></div>
        <div><span>Runtime</span><strong>${s.compute.stack.runtime}</strong></div>
        <div><span>Telemetry</span><strong>${s.compute.stack.observability}</strong></div>
        <div><span>Security</span><strong>${s.compute.stack.security}</strong></div>
        <div><span>Queue p95</span><strong>${s.queueP95Min.toFixed(0)} min</strong></div>
        <div><span>Release</span><strong>${s.releaseScore} / ${s.stateLabel}</strong></div>
      </div>
      <div class="software-plane-grid">
        ${s.planes.map(([label, value, score]) => `
          <div style="--plane-score:${score.toFixed(0)}%; --plane-color:${score < 62 ? "#dd7344" : score < 74 ? "#d9a441" : "#2aa876"}">
            <span>${label}</span>
            <strong>${value}</strong>
            <em>${score.toFixed(0)}</em>
            <i aria-hidden="true"></i>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }
  if (state.twinMode === "compute") {
    const c = computeValues(block);
    const plan = capacityPlanValues(block);
    el.designEngine.innerHTML = `
      ${engineButtonGroup("Chip platform", "compute", computePlatforms)}
      ${engineButtonGroup("Rack profile", "rack", rackProfiles)}
      ${engineButtonGroup("Software stack", "stack", softwareStacks)}
      ${engineButtonGroup("Workload", "workload", workloadProfiles)}
      <div class="engine-output">
        <div><span>Rack IT</span><strong>${c.rackKw.toFixed(0)} kW</strong></div>
        <div><span>Pod rack slots</span><strong>${block.racks}</strong></div>
        <div><span>Energizable racks</span><strong>${plan.poweredRacks}</strong></div>
        <div><span>Design accelerators</span><strong>${c.accelerators}</strong></div>
        <div><span>Energizable accelerators</span><strong>${plan.energizedAccelerators}</strong></div>
        <div><span>Memory pool</span><strong>${c.memoryTb.toFixed(1)} TB</strong></div>
        <div><span>Fabric</span><strong>${c.fabricTbps.toFixed(0)} TB/s</strong></div>
        <div><span>Software</span><strong>${c.stack.runtime}</strong></div>
        <div><span>Source</span><strong>${c.platform.source}</strong></div>
      </div>
    `;
    return;
  }
  if (state.twinMode === "energy") {
    const e = energyValues(block);
    const power = e.powerSystem;
    const plan = capacityPlanValues(block);
    el.designEngine.innerHTML = `
      ${engineButtonGroup("Primary supply", "powerSource", powerSourceProfiles)}
      ${enginePowerRange()}
      ${engineReserveRange()}
      ${engineButtonGroup("Reliability topology", "reliability", reliabilityProfiles)}
      ${backupPlanSelector()}
      ${engineButtonGroup("Chip platform", "compute", computePlatforms)}
      ${engineButtonGroup("Rack profile", "rack", rackProfiles)}
      <div class="engine-output">
        <div><span>Critical target</span><strong>${power.selectedMw.toFixed(0)} MW</strong></div>
        <div><span>Buildable IT</span><strong>${plan.siteItMw.toFixed(2)} MW</strong></div>
        <div><span>Deployable racks</span><strong>${plan.deployableRacks} / ${plan.requiredPods} pods</strong></div>
        <div><span>Facility headroom</span><strong>${plan.headroomMw.toFixed(2)} MW</strong></div>
        <div><span>Source blocks</span><strong>${power.sourceUnits}</strong></div>
        <div><span>Topology</span><strong>${power.reliability.label} / ${power.reliabilityState}</strong></div>
        <div><span>Availability screen</span><strong>${power.availabilityPct.toFixed(5)}%</strong></div>
        <div><span>Outage screen</span><strong>${power.outageMinutesYear.toFixed(1)} min/yr</strong></div>
        <div><span>Reserve</span><strong>${power.backup.shortLabel} / ${power.batteryMwh.toFixed(1)} MWh</strong></div>
        <div><span>Block load</span><strong>${e.facilityMw.toFixed(2)} MW</strong></div>
        <div><span>Bus current</span><strong>${Math.round(e.busCurrentA).toLocaleString()} A</strong></div>
        <div><span>Loss</span><strong>${e.conversionLossKw.toFixed(0)} kW</strong></div>
        <div><span>Current reduction</span><strong>${e.currentReductionPct.toFixed(0)}% vs 54V</strong></div>
      </div>
      ${primarySourceArchitectureMarkup(power)}
      ${backupArchitectureMarkup(power)}
      <div class="engine-warning${power.reliabilityState === "Exposed" || (power.source.requiresFirming && power.backup.batteryHours < 2 && power.generatorActive === 0) ? " is-critical" : ""}">
        <strong>${power.firmingStatus}</strong><span>${power.warning}</span><em>${power.basis}</em>
      </div>
    `;
    return;
  }
  if (state.twinMode === "fluid") {
    const f = fluidValues(block);
    const cooling = coolingArchitectureValues(block);
    const plan = capacityPlanValues(block);
    el.designEngine.innerHTML = `
      ${engineButtonGroup("Modular supplier", "supplier", modularSupplyProfiles)}
      ${engineButtonGroup("Chip platform", "compute", computePlatforms)}
      ${engineButtonGroup("Rack profile", "rack", rackProfiles)}
      ${engineButtonGroup("Workload", "workload", workloadProfiles)}
      <div class="engine-output">
        <div><span>Pod CDU modules</span><strong>${cooling.activeCduUnits}+1 x ${cooling.cduBlockMw.toFixed(1)} MW</strong></div>
        <div><span>Pod pumps</span><strong>${cooling.activePumps}+1</strong></div>
        <div><span>Site CDU modules</span><strong>${plan.siteCduActive}+1</strong></div>
        <div><span>Site design flow</span><strong>${Math.round(plan.siteDesignFlowLpm).toLocaleString()} L/min</strong></div>
        <div><span>Mass flow</span><strong>${f.massFlowKgS.toFixed(1)} kg/s</strong></div>
        <div><span>Header dia.</span><strong>${(f.pipeDiameterM * 1000).toFixed(0)} mm</strong></div>
        <div><span>Pressure</span><strong>${f.pressureDropKpa.toFixed(1)} kPa</strong></div>
        <div><span>Design margin</span><strong>${cooling.designMarginPct.toFixed(0)}%</strong></div>
        <div><span>Rack interfaces</span><strong>${cooling.quickDisconnects} QDs</strong></div>
        <div><span>Cold-plate loops</span><strong>${cooling.coldPlateCircuits}</strong></div>
      </div>
      ${coolingModuleStack(cooling)}
      ${supplierSpec(cooling.supplier)}
    `;
    return;
  }
  if (state.twinMode === "thermal") {
    const t = thermalValues(block);
    el.designEngine.innerHTML = `
      ${engineButtonGroup("Program", "program", dataCenterPresets)}
      ${engineButtonGroup("Chip platform", "compute", computePlatforms)}
      ${engineButtonGroup("Workload", "workload", workloadProfiles)}
      <div class="engine-output">
        <div><span>Supply / return</span><strong>${t.supplyC.toFixed(0)}C / ${t.returnC.toFixed(0)}C</strong></div>
        <div><span>Approach</span><strong>${t.coolantApproachC.toFixed(1)} C</strong></div>
        <div><span>Thermal use</span><strong>${t.thermalUtilPct.toFixed(0)}%</strong></div>
        <div><span>Heat reuse</span><strong>${t.heatReuseKw.toFixed(0)} kW</strong></div>
        <div><span>Model</span><strong>Heat-transfer RC screen</strong></div>
        <div><span>Reference</span><strong>${physicsSources.nvidia.source}</strong></div>
      </div>
    `;
    return;
  }
  const m = mechanicsValues(block);
  const f = m.foundation;
  el.designEngine.innerHTML = `
    ${engineButtonGroup("Program", "program", dataCenterPresets)}
    ${engineButtonGroup("California site", "site", californiaSitePresets)}
    ${engineButtonGroup("Seismic tier", "tier", seismicTierPresets)}
    ${engineButtonGroup("Rack profile", "rack", rackProfiles)}
    <div class="engine-output">
      <div><span>Foundation</span><strong>${f.type}</strong></div>
      <div><span>Mat / beam</span><strong>${f.matThicknessM.toFixed(2)}m / ${f.gradeBeamDepthM.toFixed(2)}m</strong></div>
      <div><span>Allowable soil</span><strong>${f.allowableBearingKpa} kPa</strong></div>
      <div><span>Groundwater</span><strong>${f.groundwater}</strong></div>
      <div><span>Pile depth</span><strong>${f.pileDepthM ? `${f.pileDepthM}m screen` : "Not triggered"}</strong></div>
      <div><span>Basis</span><strong>Screening only</strong></div>
    </div>
  `;
}

function renderDigitalTwin(block, d) {
  const model = state.twinMode === "ops"
    ? operationsTwinModel(block)
    : state.twinMode === "compute"
      ? computeTwinModel(block)
      : state.twinMode === "software"
        ? softwareTwinModel(block)
        : state.twinMode === "physics"
          ? physicsTwinModel(block)
        : state.twinMode === "thermal"
          ? thermalTwinModel(block)
          : state.twinMode === "fluid"
            ? fluidTwinModel(block)
            : state.twinMode === "energy"
              ? energyTwinModel(block)
              : state.twinMode === "mechanics"
                ? mechanicsTwinModel(block)
                : designTwinModel(block, d);
  document.querySelectorAll(".twin-mode-btn").forEach((button) => {
    const active = button.dataset.twinMode === state.twinMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  el.twinEyebrow.textContent = model.eyebrow;
  el.twinHeadline.textContent = model.headline;
  el.twinCopy.textContent = model.copy;
  renderGpuLayerControls();
  renderOpsFailureControls();
  renderDesignEngine(block);
  el.twinKpis.innerHTML = model.kpis.map(([label, value]) => `
    <div class="twin-kpi">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
  el.twinFlow.innerHTML = model.flow.map(([label, value, color]) => `
    <div class="twin-flow-step" style="--flow-color:${color}">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
  renderInternalDetails(block);
}

function renderControls() {
  el.weekLabel.textContent = state.week;
  el.crewLabel.textContent = state.crew;
  el.prefabLabel.textContent = `${state.prefab}%`;
  el.bridgeToggle.checked = state.bridge;
  el.weekRange.value = state.week;
  el.crewRange.value = state.crew;
  el.prefabRange.value = state.prefab;
  document.querySelectorAll(".scenario-chip").forEach((button) => {
    const active = button.dataset.scenario === state.scenario;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderMetrics() {
  const readyMw = modules.reduce((sum, block) => {
    const status = statusFor(block);
    return sum + (status === "loaded" || status === "energized" ? block.mw : 0);
  }, 0);
  const block = selectedBlock();
  const d = datesFor(block);
  el.mwReady.textContent = readyMw.toFixed(1);
  el.ttp.textContent = `${Math.max(0, d.load - state.week)}w`;
  el.criticalPath.textContent = criticalPathFor(block);
}

function renderBlocks() {
  el.blockList.innerHTML = "";
  modules.forEach((block) => {
    const status = statusFor(block);
    const d = datesFor(block);
    const row = document.createElement("button");
    row.type = "button";
    row.className = `block-row${block.id === state.selectedId ? " is-selected" : ""}`;
    row.dataset.state = status;
    row.setAttribute("aria-pressed", String(block.id === state.selectedId));
    row.setAttribute("aria-label", `${block.id}, bay ${block.steelBay}, ${block.racks} rack slots, ${block.mw.toFixed(1)} megawatts IT allocation, ${statusLabel(status)}, ready week ${d.load}`);
    row.innerHTML = `
      <span class="mini" aria-hidden="true"></span>
      <span class="label"><strong>${block.id}</strong><span>Bay ${block.steelBay} / ${block.racks} racks / ${block.mw.toFixed(1)} MW</span></span>
      <span class="eta">W${d.load}</span>
    `;
    row.addEventListener("click", () => {
      if (block.id === state.selectedId) return;
      beginRouteTransition();
      state.selectedId = block.id;
      render();
      scheduleBackendSync("select_module");
    });
    el.blockList.appendChild(row);
  });
}

function renderMap() {
  el.moduleMap.innerHTML = "";
  modules.forEach((block) => {
    const status = statusFor(block);
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `module-tile${block.id === state.selectedId ? " is-selected" : ""}`;
    tile.dataset.state = status;
    tile.title = `${block.id}: ${statusLabel(status)} / ${block.feeder}`;
    tile.setAttribute("aria-pressed", String(block.id === state.selectedId));
    tile.setAttribute("aria-label", `${block.id}, bay ${block.steelBay}, ${statusLabel(status)}, ${block.feeder}`);
    tile.innerHTML = `<strong>${block.id}</strong><span>${block.steelBay} / ${statusLabel(status)}</span>`;
    tile.addEventListener("click", () => {
      if (block.id === state.selectedId) return;
      beginRouteTransition();
      state.selectedId = block.id;
      render();
      scheduleBackendSync("select_module_map");
    });
    el.moduleMap.appendChild(tile);
  });
}

function renderKnowledgeMap() {
  if (!el.knowledgeMap || !el.threeViewport) return;
  const active = state.tab === "intel" || state.tab === "supply";
  el.threeViewport.classList.toggle("is-knowledge", active);
  el.threeViewport.classList.toggle("is-supply", state.tab === "supply");
  el.knowledgeMap.setAttribute("aria-hidden", String(!active));
  if (!active) return;
  if (state.tab === "supply") {
    const chain = supplyChainValues();
    el.knowledgeMap.innerHTML = `
      <div class="supply-map-head">
        <div>
          <span>Global procurement twin</span>
          <strong>${chain.releaseState}.</strong>
        </div>
        <div>
          <span>Critical path</span>
          <strong>${chain.criticalPath.component}</strong>
          <em>${chain.criticalPath.leadWeeks} weeks / ${chain.criticalPath.country}</em>
        </div>
      </div>
      <div class="supply-world" aria-label="Regional supply chain exposure">
        ${chain.regions.map((region) => `
          <article data-region="${region.region.toLowerCase().replace(/\s+/g, "-")}">
            <header><span>${region.region}</span><strong>${region.exposurePct}%</strong></header>
            <div>
              ${region.nodes.map((node) => `
                <span class="supply-map-node is-${node.status.toLowerCase()}${node.id === chain.criticalPath.id ? " is-critical" : ""}" title="${node.primary} / ${node.leadWeeks} weeks">
                  <i aria-hidden="true"></i>${node.component}
                </span>
              `).join("")}
            </div>
            <footer><span>Risk</span><strong>${region.risk}</strong></footer>
          </article>
        `).join("")}
      </div>
      <div class="supply-map-footer">
        <span><i class="is-gate" aria-hidden="true"></i>${chain.gates} gates</span>
        <span><i class="is-watch" aria-hidden="true"></i>${chain.watches} watch</span>
        <span><i class="is-clear" aria-hidden="true"></i>${chain.dualSourceCoveragePct}% dual-source coverage</span>
        <em>${chain.strategy.label} / ${chain.shock.shortLabel}</em>
      </div>
    `;
    return;
  }
  const kb = backend.knowledge;
  const stages = (kb?.construction_process || [
    { name: "Land + grid", stage: "01", decision: "Screen power, parcel, permit and logistics gates." },
    { name: "Foundation", stage: "02", decision: "Calculate bearing, settlement and seismic package." },
    { name: "Steel pods", stage: "03", decision: "Repeatable frame with power and cooling interfaces." },
    { name: "800V DC", stage: "04", decision: "Model SST/rectifier, busway and bridge storage." },
    { name: "Ops twin", stage: "05", decision: "Keep telemetry and scan deltas live after handoff." }
  ]).slice(0, 7);
  const stageNotes = [
    "Power + permit gate",
    "Soil load to pile/mat",
    "Repeatable steel bay",
    "SST + busway + bridge",
    "Flow + thermal margin",
    "Rack + AI OS release",
    "Telemetry + scan ops"
  ];
  const tiers = (kb?.supply_chain?.tiers || []).slice(0, 6);
  el.knowledgeMap.innerHTML = `
    <div class="knowledge-map-head">
      <span>4D model + supply chain intelligence</span>
      <strong>Build AI capacity at software speed.</strong>
      <em>${kb?.sources?.length || marketSignals.length} sources / ${stages.length} construction states / ${tiers.length || 4} supply layers</em>
    </div>
    <div class="knowledge-process">
      ${stages.map((stage, index) => `
        <article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${stage.name}</strong>
          <em>${stageNotes[index] || stage.decision}</em>
        </article>
      `).join("")}
    </div>
    <div class="knowledge-supply-map">
      ${(tiers.length ? tiers : [
        { label: "Compute", role: "Rack platform selects power and cooling load." },
        { label: "Power", role: "800V DC components and protection." },
        { label: "Factory", role: "Prefab steel, skids, busway and cooling." },
        { label: "Twin", role: "OpenUSD scene graph and telemetry." }
      ]).map((tier) => `
        <div>
          <span>${tier.label}</span>
          <strong>${tier.role}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCoolingHud(block) {
  if (!el.coolingHud) return;
  const fluid = fluidValues(block);
  const thermal = thermalValues(block);
  const cooling = coolingArchitectureValues(block);
  const coolingLayerVisible = state.internalLayer === "all" || state.internalLayer === "cooling";
  const visible = state.tab === "twin" && coolingLayerVisible && (state.internalLayer === "cooling" || state.twinMode === "fluid" || state.twinMode === "thermal");
  el.coolingHud.classList.toggle("is-visible", visible);
  el.coolingHud.setAttribute("aria-hidden", String(!visible));
  el.threeViewport?.classList.toggle("is-cooling", visible);
  el.coolingHudModule.textContent = `${block.id} / CDU-${block.steelBay}`;
  el.coolingHudSupply.textContent = `${thermal.supplyC.toFixed(0)}C`;
  el.coolingHudReturn.textContent = `${thermal.returnC.toFixed(0)}C`;
  el.coolingHudRackFlow.textContent = fluid.rackFlowLpm.toFixed(0);
  if (el.coolingHudTopology) el.coolingHudTopology.textContent = `${cooling.activeCduUnits}+1 CDU / ${cooling.rowManifolds} manifolds / ${cooling.quickDisconnects} rack QDs`;
}

function renderPowerHud(block) {
  if (!el.powerHud) return;
  const power = energyValues(block).powerSystem;
  const powerLayerVisible = state.internalLayer === "all" || state.internalLayer === "power";
  const visible = state.tab === "twin" && powerLayerVisible && ["design", "energy", "physics"].includes(state.twinMode);
  el.powerHud.classList.toggle("is-visible", visible);
  el.powerHud.setAttribute("aria-hidden", String(!visible));
  el.powerHudSource.textContent = power.source.shortLabel;
  el.powerHudMw.textContent = `${power.selectedMw.toFixed(0)} MW`;
  el.powerHudTopology.textContent = power.reliability.label;
  el.powerHudBackup.textContent = power.backup.shortLabel;
}

function renderTwin() {
  const block = selectedBlock();
  const status = statusFor(block);
  const d = datesFor(block);
  const thermal = thermalValues(block);
  const mechanics = mechanicsValues(block);
  renderKnowledgeMap();
  if (state.tab === "omniverse") {
    el.stageTitle.textContent = "OpenUSD operations twin.";
  } else if (state.tab === "supply") {
    el.stageTitle.textContent = "Global supply chain control tower.";
  } else if (state.tab === "cost") {
    el.stageTitle.textContent = "AI factory capital model.";
  } else if (state.tab === "intel") {
    el.stageTitle.textContent = "AI factory design engine.";
  } else if (state.twinMode === "design") {
    el.stageTitle.textContent = "GPU AI factory twin.";
  } else if (state.twinMode === "mechanics") {
    el.stageTitle.textContent = "California foundation engine.";
  } else if (state.twinMode === "energy") {
    el.stageTitle.textContent = "800V DC power path.";
  } else if (state.twinMode === "fluid") {
    el.stageTitle.textContent = "Direct liquid cooling twin.";
  } else if (state.twinMode === "thermal") {
    el.stageTitle.textContent = "Rack-scale thermal twin.";
  } else if (state.twinMode === "physics") {
    el.stageTitle.textContent = "First-principles design ledger.";
  } else if (state.twinMode === "compute") {
    el.stageTitle.textContent = "NVL72 rack-scale compute.";
  } else if (state.twinMode === "software") {
    el.stageTitle.textContent = "AI factory control plane.";
  } else {
    el.stageTitle.textContent = status === "power-hold" ? "Power-constrained operations." : "Live AI factory operations.";
  }
  el.heroBlock.textContent = block.id;
  el.heroStatus.textContent = statusLabel(status);
  el.heroStatus.dataset.state = status;
  el.heroCompute.textContent = activeComputePlatform().label.replace(/^NVIDIA\s+/, "");
  const power = energyValues(block).powerSystem;
  el.heroPower.textContent = `${power.source.shortLabel} / ${power.selectedMw.toFixed(0)} MW / ${power.reliability.label}`;
  el.heroCooling.textContent = `DLC ${thermal.supplyC.toFixed(0)} / ${thermal.returnC.toFixed(0)}C`;
  el.heroStructure.textContent = mechanics.foundation.pileDepthM ? "Steel + pile foundation" : "Steel + mat foundation";
  el.selectedTitle.textContent = block.id;
  el.selectedBadge.textContent = statusLabel(status);
  el.selectedBadge.dataset.state = status;
  el.blockMw.textContent = `${block.mw.toFixed(1)} MW`;
  el.blockSteelBay.textContent = block.steelBay;
  el.blockFeeder.textContent = block.feeder.replace("800V DC ", "");
  el.blockRectifier.textContent = block.rectifier;
  el.nextAction.textContent = nextActionFor(block);
  renderCoolingHud(block);
  renderPowerHud(block);
  renderDigitalTwin(block, d);

  el.stageList.innerHTML = stageProgress(block)
    .map((stage) => `
      <article class="stage-item">
        <header><strong>${stage.name}</strong><span>W${stage.start} - W${stage.end}</span></header>
        <div class="bar"><span style="--progress:${stage.progress.toFixed(0)}%; --bar-color:${stage.color}"></span></div>
      </article>
    `)
    .join("");
}

function drawPower() {
  const canvas = el.powerCanvas;
  const powerSystem = powerSystemForTarget(state.engine.powerMw);
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const w = rect.width;
  const h = rect.height;
  const compact = w < 430;
  ctx.fillStyle = "#0d1115";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = `${compact ? 9 : 10}px Inter, sans-serif`;
  ctx.fillText(`${powerSystem.source.shortLabel.toUpperCase()} / ${powerSystem.selectedMw.toFixed(0)} MW / ${powerSystem.reliability.label}`, 20, 24);

  const sub = { x: compact ? 42 : 50, y: h / 2 };
  const rectNode = { x: compact ? 116 : 132, y: h / 2 };
  const dcBreaker = { x: compact ? 188 : 214, y: h / 2 };
  const loops = [
    { name: "800V DC Bus A", y: h * 0.28 },
    { name: "800V DC Bus B", y: h * 0.5 },
    { name: "800V DC Bus C", y: h * 0.72 }
  ];

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let x = 20; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.lineTo(x, h - 18);
    ctx.stroke();
  }

  ctx.fillStyle = powerSystem.source.color;
  ctx.fillRect(sub.x - 24, sub.y - 38, 48, 76);
  ctx.fillStyle = "#0d1115";
  ctx.font = `${compact ? 10 : 11}px Inter, sans-serif`;
  const sourceLines = powerSystem.sourceKey === "grid"
    ? ["GRID", "MVAC"]
    : powerSystem.sourceKey === "gasTurbine"
      ? ["AERO", "GT"]
      : powerSystem.sourceKey === "btmGas"
        ? ["BTM", "GAS"]
        : ["PV", "DC"];
  ctx.fillText(sourceLines[0], sub.x - 13, sub.y - 4);
  ctx.fillText(sourceLines[1], sub.x - 14, sub.y + 12);

  ctx.fillStyle = "#ff8a3d";
  ctx.fillRect(rectNode.x - 26, rectNode.y - 34, 52, 68);
  ctx.fillStyle = "#0d1115";
  const conversionLines = powerSystem.sourceKey === "btmSolar"
    ? ["GFM", "INV"]
    : ["btmGas", "gasTurbine"].includes(powerSystem.sourceKey)
      ? ["SWGR", "RECT"]
      : ["SST", "RECT"];
  ctx.fillText(conversionLines[0], rectNode.x - 14, rectNode.y - 4);
  ctx.fillText(conversionLines[1], rectNode.x - 13, rectNode.y + 12);

  ctx.fillStyle = "#d7d2c7";
  ctx.fillRect(dcBreaker.x - 22, dcBreaker.y - 30, 44, 60);
  ctx.fillStyle = "#0d1115";
  ctx.fillText("DC", dcBreaker.x - 8, dcBreaker.y - 4);
  ctx.fillText("BRK", dcBreaker.x - 11, dcBreaker.y + 12);

  ctx.strokeStyle = "#ff8a3d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sub.x + 25, sub.y);
  ctx.lineTo(rectNode.x - 26, rectNode.y);
  ctx.moveTo(rectNode.x + 26, rectNode.y);
  ctx.lineTo(dcBreaker.x - 22, dcBreaker.y);
  ctx.stroke();

  if (powerSystem.backupKey !== "none") {
    const reserveY = Math.min(h - 48, rectNode.y + 96);
    ctx.strokeStyle = "#2aa876";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rectNode.x, rectNode.y + 34);
    ctx.lineTo(rectNode.x, reserveY - 20);
    ctx.stroke();
    ctx.fillStyle = "#173229";
    ctx.fillRect(rectNode.x - 30, reserveY - 20, 60, 40);
    ctx.strokeRect(rectNode.x - 30, reserveY - 20, 60, 40);
    ctx.fillStyle = "#f7f3ea";
    ctx.font = `${compact ? 8 : 9}px Inter, sans-serif`;
    ctx.fillText("BESS BRIDGE", rectNode.x - 25, reserveY + 3);
    if (powerSystem.generatorInstalled) {
      const standbyX = rectNode.x + (compact ? 72 : 86);
      ctx.strokeStyle = powerSystem.backup.generatorFuel === "HVO" ? "#36d7c8" : "#f5c766";
      ctx.beginPath();
      ctx.moveTo(rectNode.x + 30, reserveY);
      ctx.lineTo(standbyX - 32, reserveY);
      ctx.stroke();
      ctx.fillStyle = "#232b2e";
      ctx.fillRect(standbyX - 32, reserveY - 20, 64, 40);
      ctx.strokeRect(standbyX - 32, reserveY - 20, 64, 40);
      ctx.fillStyle = "#f7f3ea";
      ctx.fillText(`${powerSystem.backup.generatorFuel} N+1`, standbyX - 25, reserveY - 2);
      ctx.fillStyle = "#9aa3aa";
      ctx.fillText(`${powerSystem.backup.autonomyHours}H`, standbyX - 10, reserveY + 11);
    }
  }

  loops.forEach((loop) => {
    const feeder = feeders[loop.name];
    const ready = feeder.base + scenarioValues().utilityDelay <= state.week;
    ctx.strokeStyle = ready ? feeder.color : "rgba(255,255,255,0.22)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const busStart = compact ? 226 : 270;
    ctx.moveTo(dcBreaker.x + 24, dcBreaker.y);
    ctx.lineTo(busStart, loop.y);
    ctx.lineTo(w - 22, loop.y);
    ctx.stroke();

    ctx.fillStyle = ready ? feeder.color : "#6d747d";
    ctx.font = `${compact ? 10 : 12}px Inter, sans-serif`;
    ctx.fillText(loop.name.replace("800V DC Bus ", "Bus "), busStart + 4, loop.y - 10);
  });

  modules.forEach((block, index) => {
    const loopIndex = block.row - 1;
    const loop = loops[loopIndex];
    const col = index % 4;
    const gridStart = compact ? Math.max(248, w - 104) : 330;
    const gridSpan = compact ? 78 : w - 390;
    const x = gridStart + col * (gridSpan / 3);
    const y = loop.y + (compact ? (col % 2 === 0 ? 16 : -18) : (col % 2 === 0 ? 22 : -38));
    const status = statusFor(block);
    const color = status === "loaded" ? "#2aa876" : status === "energized" ? "#2d6bff" : status === "power-hold" ? "#dd7344" : "#8b939d";

    ctx.strokeStyle = color;
    ctx.lineWidth = block.id === state.selectedId ? 3 : 1.5;
    ctx.fillStyle = block.id === state.selectedId ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.roundRect(x - (compact ? 18 : 36), y - (compact ? 12 : 18), compact ? 36 : 72, compact ? 24 : 36, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f7f3ea";
    ctx.font = `${compact ? 9 : 11}px Inter, sans-serif`;
    ctx.fillText(block.id, x - (compact ? 12 : 18), y + (compact ? 3 : -1));
    if (!compact) {
      ctx.fillStyle = "#9aa3aa";
      ctx.font = "9px Inter, sans-serif";
      ctx.fillText("rack shelf", x - 22, y + 11);
    }
  });
}

function renderPower() {
  const block = selectedBlock();
  const d = datesFor(block);
  const energy = energyValues(block);
  const power = energy.powerSystem;
  drawPower();
  el.powerReadout.innerHTML = [
    ["Primary supply", `${power.source.shortLabel} / ${power.selectedMw.toFixed(0)} MW`],
    ["Capacity blocks", `${power.sourceUnits} / ${power.sourceNameplateMw.toFixed(0)} MW nameplate`],
    ["Reliability topology", `${power.reliability.label} / ${power.availabilityPct.toFixed(5)}% screen`],
    ["Continuity stack", `${power.backup.shortLabel} / black-start ${power.backup.blackStart ? "ready" : "open"}`],
    ["Battery bridge", `${power.batteryUsableMwh.toFixed(1)} MWh usable / ${power.batteryNameplateMwh.toFixed(1)} MWh nameplate`],
    ["Standby plant", power.generatorInstalled ? `${power.generatorActive}+1 x ${power.backup.generatorUnitMw.toFixed(1)} MW ${power.backup.generatorFuel}` : "Not installed"],
    ["Onsite autonomy", power.fuelLiters ? `${power.backup.autonomyHours} h / ${Math.round(power.fuelLiters).toLocaleString()} L` : `${power.backup.autonomyHours.toFixed(1)} h`],
    ["Rack load allowed", `W${d.load}`],
    ["Modeled bus current", `${Math.round(energy.busCurrentA).toLocaleString()} A`],
    ["Chip platform", energy.compute.platform.label]
  ].map(([label, value]) => `<div class="readout-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function renderField() {
  const block = selectedBlock();
  const baseRows = [
    { name: "Steel bay plumbness", detail: block.scan === "hold" ? "+18 mm column drift" : "within tolerance", severity: block.scan === "hold" ? "High" : "OK" },
    { name: "800V busway elevation", detail: block.scan === "delta" ? "hanger delta" : "matched", severity: block.scan === "delta" ? "Med" : "OK" },
    { name: "Rack liquid loop tie-in", detail: state.prefab > 70 ? "prefab cleared" : "pending prefab check", severity: state.prefab > 70 ? "OK" : "Med" }
  ].filter((row) => !state.resolvedDeltas.has(`${block.id}:${row.name}`));

  el.scanStack.innerHTML = baseRows.map((row) => `
    <div class="scan-row">
      <strong>${row.name}<br><span>${row.detail}</span></strong>
      <span>${row.severity}</span>
    </div>
  `).join("");
  el.resolveScan.disabled = baseRows.length === 0;
}

function renderSupply() {
  if (!el.supplyControls) return;
  const chain = supplyChainValues();
  const cost = costModelValues();
  const procurement = cost.procurement;
  el.supplyControls.innerHTML = `
    <div class="supply-control-group">
      <span>Procurement strategy</span>
      <div role="group" aria-label="Procurement strategy">
        ${Object.entries(supplyStrategies).map(([key, profile]) => `
          <button type="button" data-supply-strategy="${key}" class="supply-control-btn${key === chain.strategyKey ? " is-active" : ""}" aria-pressed="${key === chain.strategyKey}">${profile.label}</button>
        `).join("")}
      </div>
    </div>
    <div class="supply-control-group">
      <span>Stress test</span>
      <div role="group" aria-label="Supply chain stress test">
        ${Object.entries(supplyShockProfiles).map(([key, profile]) => `
          <button type="button" data-supply-shock="${key}" class="supply-control-btn${key === chain.shockKey ? " is-active" : ""}" aria-pressed="${key === chain.shockKey}">${profile.label}</button>
        `).join("")}
      </div>
    </div>
  `;
  el.supplySummary.innerHTML = `
    <header class="supply-release is-${chain.gates ? "gate" : chain.watches ? "watch" : "clear"}">
      <div><span>Release state</span><strong>${chain.releaseState}</strong></div>
      <em>${chain.readiness}<small>/100</small></em>
    </header>
    <div class="supply-summary-grid">
      <div><span>Critical lead</span><strong>${chain.criticalPath.leadWeeks}w</strong><em>${chain.criticalPath.component}</em></div>
      <div><span>Dual source</span><strong>${chain.dualSourceCoveragePct}%</strong><em>${chain.singleSourceCount} open paths</em></div>
      <div><span>US content</span><strong>${procurement.localContentPct}%</strong><em>spend weighted</em></div>
      <div><span>Landed / MW</span><strong>${formatCost(procurement.landedCostPerMwM)}</strong><em>${cost.scopeLabel} / ${formatCost(procurement.landedCostM)}</em></div>
    </div>
  `;
  el.supplyExposure.innerHTML = `
    <header><span>Regional exposure</span><strong>Weighted BOM</strong></header>
    ${chain.regions.map((region) => `
      <div class="supply-exposure-row" style="--exposure:${region.exposurePct}%; --risk:${region.risk}%">
        <span>${region.region}</span>
        <i aria-hidden="true"><b></b></i>
        <strong>${region.exposurePct}%</strong>
        <em>R${region.risk}</em>
      </div>
    `).join("")}
  `;
  el.supplyProcurement.innerHTML = `
    <header><span>Package / source</span><strong>Lead</strong><strong>Risk</strong></header>
    ${chain.nodes.map((node) => `
      <article class="is-${node.status.toLowerCase()}${node.id === chain.criticalPath.id ? " is-critical" : ""}">
        <div>
          <span>${node.lane} / ${node.country}</span>
          <a href="${node.sourceUrl}" target="_blank" rel="noreferrer">${node.component}</a>
          <em>${node.quantity} / ${node.qualifiedAlternate ? `Alt: ${node.alternate}` : "Single-source path"}</em>
        </div>
        <strong>${node.leadWeeks}w</strong>
        <b>${node.risk}</b>
      </article>
    `).join("")}
  `;
  el.supplyActions.innerHTML = `
    <header><span>Release actions</span><strong>Forecast W${chain.forecastReleaseWeek}</strong></header>
    ${chain.actions.map((item, index) => `
      <div class="is-${item.state.toLowerCase()}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <p><strong>${item.label}</strong><em>${item.action}</em></p>
      </div>
    `).join("")}
    <footer>${chain.basis}</footer>
  `;
}

function renderCost() {
  if (!el.costHeadline) return;
  const cost = costModelValues();
  const perMw = cost.displayBasis === "perMw";
  const basisSuffix = perMw ? "/MW" : "";
  const basisLabel = perMw ? "per site MW" : "project total";
  const maxCategory = Math.max(...cost.categories.map((item) => item.amountM), 1);
  const maxDraw = Math.max(...cost.cashFlow.map((item) => item.amountM), 1);
  const visibleComponents = cost.components.filter((item) => state.costFilter === "all" || item.system === state.costFilter);
  const procurement = cost.procurement;
  const visibleProcurementPackages = procurement.packages.filter((item) => {
    if (!item.included) return state.procurementFilter === "all";
    if (state.procurementFilter === "rfq") return item.quoteStatus === "RFQ required";
    if (state.procurementFilter === "import") return item.dutyM > 0;
    if (state.procurementFilter === "risk") return item.status !== "Clear" || item.leadWeeks >= 40;
    if (state.procurementFilter === "us") return item.localContentPct >= 70;
    return true;
  });
  el.costControls.innerHTML = `
    <div class="cost-control-groups">
      <div class="cost-scope" role="group" aria-label="Cost estimate scope">
        ${[
          ["allIn", "All-in"],
          ["exGpu", "Ex-GPU"],
          ["facility", "Facility"]
        ].map(([key, label]) => `
          <button type="button" data-cost-scope="${key}" class="cost-scope-btn${cost.scope === key ? " is-active" : ""}" aria-pressed="${cost.scope === key}">${label}</button>
        `).join("")}
      </div>
      <div class="cost-basis" role="group" aria-label="Cost display basis">
        ${[["total", "Total"], ["perMw", "Per MW"]].map(([key, label]) => `
          <button type="button" data-cost-basis="${key}" class="cost-basis-btn${cost.displayBasis === key ? " is-active" : ""}" aria-pressed="${cost.displayBasis === key}">${label}</button>
        `).join("")}
      </div>
    </div>
    <span>Denominator: ${cost.selectedMw.toFixed(0)} MW critical facility / ${cost.siteItMw.toFixed(1)} MW IT</span>
  `;
  el.costMethod.innerHTML = `
    <header><span>US delivery method</span><strong>${cost.constructionMethod.label}</strong></header>
    <div class="cost-method-grid" role="group" aria-label="US construction delivery method">
      ${cost.methodCases.map((method) => `
        <button type="button" data-cost-method="${method.key}" class="cost-method-btn${method.key === cost.constructionMethod.key ? " is-active" : ""}" aria-pressed="${method.key === cost.constructionMethod.key}">
          <span>${method.code}</span>
          <strong>${method.label}</strong>
          <em>${formatCostForBasis(cost, method.exGpuM, method.exGpuPerMwM)}${basisSuffix} / W${method.readyWeek}</em>
          <small>${method.key === cost.constructionMethod.key ? "Current" : `${formatCostDeltaForBasis(cost, method.deltaM, method.deltaPerMwM)}${basisSuffix}`}</small>
        </button>
      `).join("")}
    </div>
  `;
  el.costHeadline.innerHTML = `
    <div>
      <span>${cost.scopeLabel} CAPEX / ${basisLabel}</span>
      <strong>${formatCostForBasis(cost, cost.scopeTotalM, cost.scopePerMwM)}</strong>
      <em>${perMw ? `/MW / ${formatCost(cost.scopeTotalM)} project total` : `${cost.estimateClass} / ${formatCost(cost.scopePerMwM)}/MW`}</em>
    </div>
    <aside>
      <span>Planning range</span>
      <strong>${formatCostForBasis(cost, cost.lowM, cost.lowPerMwM)}-${formatCostForBasis(cost, cost.highM, cost.highPerMwM)}</strong>
      <em>${basisLabel} / +/-${cost.rangePct}%</em>
    </aside>
  `;
  el.costKpis.innerHTML = `
    <div><span>Facility</span><strong>${formatCostForBasis(cost, cost.facilityM, cost.facilityPerMwM)}</strong><em>${perMw ? `/MW / ${formatCost(cost.facilityM)} total` : `${formatCost(cost.facilityPerMwM)}/MW`}</em></div>
    <div><span>Non-GPU IT</span><strong>${formatCostForBasis(cost, cost.nonGpuFitoutM, cost.nonGpuFitoutPerMwM)}</strong><em>${perMw ? `/MW / ${formatCost(cost.nonGpuFitoutM)} total` : `${formatCost(cost.nonGpuFitoutPerMwM)}/MW`}</em></div>
    <div class="is-excluded"><span>Accelerator cards</span><strong>${formatCostForBasis(cost, cost.gpuCardsM, cost.gpuCardsPerMwM)}</strong><em>${cost.scope === "allIn" ? "included" : "excluded"} / ${perMw ? `${formatCost(cost.gpuCardsM)} total` : `${formatCost(cost.gpuCardsPerMwM)}/MW`}</em></div>
    <div><span>Backup</span><strong>${formatCostForBasis(cost, cost.backup.amountM, cost.backup.amountPerMwM)}</strong><em>${perMw ? `/MW / ${formatCost(cost.backup.amountM)} total` : `${formatCost(cost.backup.amountPerMwM)}/MW`} / ${cost.backup.planCode}</em></div>
  `;
  el.costProcurement.innerHTML = `
    <header class="procurement-title">
      <div><span>Procurement forecast</span><strong>${procurement.strategy.label}</strong></div>
      <em>${procurement.packages.filter((item) => item.included).length} active packages / ${procurement.openRfqCount} RFQ gates</em>
    </header>
    <div class="procurement-scenario-grid" role="group" aria-label="Procurement sourcing scenario">
      ${procurement.scenarioCases.map((scenarioCase) => `
        <button type="button" data-cost-strategy="${scenarioCase.strategyKey}" class="procurement-scenario${scenarioCase.strategyKey === procurement.strategyKey ? " is-active" : ""}" aria-pressed="${scenarioCase.strategyKey === procurement.strategyKey}">
          <span>${scenarioCase.strategy.label}</span>
          <strong>${formatCostForBasis(cost, scenarioCase.landedCostM, scenarioCase.landedCostPerMwM)}${basisSuffix}</strong>
          <em>Risk ${formatCostForBasis(cost, scenarioCase.riskAdjustedM, scenarioCase.riskAdjustedPerMwM)}${basisSuffix}</em>
          <small>${scenarioCase.localContentPct}% US / ${scenarioCase.quoteCoveragePct}% quote</small>
        </button>
      `).join("")}
    </div>
    <div class="procurement-waterfall" aria-label="Landed cost build-up">
      <div><span>Should-cost</span><strong>${formatCostForBasis(cost, procurement.shouldCostM, procurement.shouldCostPerMwM)}${basisSuffix}</strong></div>
      <i aria-hidden="true"></i>
      <div><span>Freight + duty</span><strong>+${formatCompactCostForBasis(cost, procurement.freightM + procurement.dutyM)}${basisSuffix}</strong></div>
      <i aria-hidden="true"></i>
      <div><span>Escalation + shock</span><strong>+${formatCompactCostForBasis(cost, procurement.escalationM + procurement.shockPremiumM)}${basisSuffix}</strong></div>
      <i aria-hidden="true"></i>
      <div class="is-landed"><span>Landed</span><strong>${formatCostForBasis(cost, procurement.landedCostM, procurement.landedCostPerMwM)}${basisSuffix}</strong></div>
      <i aria-hidden="true"></i>
      <div class="is-risk"><span>Risk reserve</span><strong>+${formatCompactCostForBasis(cost, procurement.riskReserveM, procurement.riskReservePerMwM)}${basisSuffix}</strong></div>
    </div>
    <div class="procurement-kpis">
      <div><span>Quote coverage</span><strong>${procurement.quoteCoveragePct}%</strong><em>budgetary weighted</em></div>
      <div><span>US content</span><strong>${procurement.localContentPct}%</strong><em>spend weighted</em></div>
      <div><span>Single source</span><strong>${procurement.singleSourceSpendPct}%</strong><em>of included spend</em></div>
      <div><span>Critical lead</span><strong>${procurement.criticalPackage?.leadWeeks || 0}w</strong><em>${procurement.criticalPackage?.code || "-"}</em></div>
    </div>
    <div class="procurement-filter-row" role="group" aria-label="Procurement package filter">
      ${Object.entries(procurementPackageFilters).map(([key, label]) => `
        <button type="button" data-procurement-filter="${key}" class="procurement-filter${state.procurementFilter === key ? " is-active" : ""}" aria-pressed="${state.procurementFilter === key}">${label}</button>
      `).join("")}
    </div>
    <div class="procurement-package-head"><span>Package / source / terms</span><span>Lead</span><span>${perMw ? "Landed / MW" : "Landed"}</span><span>Exposure</span></div>
    <div class="procurement-package-list">
      ${visibleProcurementPackages.length ? visibleProcurementPackages.map((item) => `
        <article class="${item.included ? "" : "is-excluded"} is-${item.status.toLowerCase()}">
          <div>
            <span>${item.code} / ${item.quoteStatus} / ${item.quoteCoveragePct}% covered</span>
            <strong>${item.label}</strong>
            <em>${item.supplier} / ${item.origin}</em>
            <small>${item.allocation} / ${item.incoterm} / ${item.paymentTerms}</small>
          </div>
          <b>${item.leadWeeks}w<small>R${item.risk}</small></b>
          <u>${item.included ? `${formatCostForBasis(cost, item.amountM, item.amountPerMwM)}${basisSuffix}` : "Excluded"}<small>${item.localContentPct}% US</small></u>
          <i>${item.included ? `${formatCostForBasis(cost, item.riskAdjustedM, item.riskAdjustedPerMwM)}${basisSuffix}` : "-"}<small>${item.included ? (Math.abs(item.varianceM) < 0.05 ? "At should-cost" : `${formatCostDeltaForBasis(cost, item.varianceM)}${basisSuffix} vs should`) : "Out of scope"}</small></i>
        </article>
      `).join("") : `<p class="procurement-empty">No packages match this filter.</p>`}
    </div>
    <footer>${procurement.basis}</footer>
  `;
  el.costBreakdown.innerHTML = `
    <header><span>Capital stack</span><strong>${cost.categories.length} packages</strong></header>
    <div class="cost-stack" aria-label="Capital stack by package">
      ${cost.categories.map((item) => `<i style="--cost-color:${item.color}; --cost-share:${item.amountM / cost.scopeTotalM * 100}%" title="${item.label}: ${formatCostForBasis(cost, item.amountM, item.amountPerMwM)}${basisSuffix}"></i>`).join("")}
    </div>
    <div class="cost-ledger">
      ${cost.categories.map((item) => `
        <article style="--cost-color:${item.color}; --cost-width:${item.amountM / maxCategory * 100}%">
          <i aria-hidden="true"></i>
          <div><span>${item.label}</span><em>${item.detail}</em></div>
          <b aria-hidden="true"><u></u></b>
          <strong>${formatCostForBasis(cost, item.amountM, item.amountPerMwM)}<small>${basisSuffix || "total"} / ${(item.amountM / cost.scopeTotalM * 100).toFixed(0)}%</small></strong>
        </article>
      `).join("")}
    </div>
  `;
  el.costComponents.innerHTML = `
    <header>
      <div><span>Component procurement register</span><strong>${cost.components.filter((item) => item.included).length} included / ${cost.components.length} line items</strong></div>
      <em>Landed USD / sourcing trace</em>
    </header>
    <div class="cost-component-filters" role="group" aria-label="Cost component system filter">
      ${Object.entries(costComponentFilters).map(([key, label]) => `
        <button type="button" data-cost-filter="${key}" class="cost-filter-btn${state.costFilter === key ? " is-active" : ""}" aria-pressed="${state.costFilter === key}">${label}</button>
      `).join("")}
    </div>
    <div class="cost-component-head"><span>Package / quantity</span><span>Unit rate</span><span>${perMw ? "Per MW" : "Total"}</span></div>
    <div class="cost-component-list">
      ${visibleComponents.map((item) => `
        <article class="${item.included ? "" : "is-excluded"}" style="--cost-color:${item.color}">
          <i aria-hidden="true"></i>
          <div>
            <span>${item.procurementCode} / ${item.quoteStatus} / ${costComponentFilters[item.system] || "IT infra"}</span>
            <strong>${item.component}</strong>
            <em>${Number(item.quantity).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${item.unit} / ${item.supplier}</em>
            <small>${item.origin} / ${item.incoterm} / ${item.leadWeeks}w / ${item.basis}</small>
          </div>
          <b>${formatUnitCost(item.unitCostM)}<small>/${item.unit}</small></b>
          <u>${item.included ? formatCostForBasis(cost, item.amountM, item.amountPerMwM) : "Excluded"}</u>
        </article>
      `).join("")}
    </div>
  `;
  el.costCashflow.innerHTML = `
    <header><span>Construction draw / ${basisLabel}</span><strong>Cash follows 4D sequence</strong></header>
    <div class="cost-cash-bars">
      ${cost.cashFlow.map((item) => `
        <article style="--draw-height:${Math.max(6, item.amountM / maxDraw * 100)}%">
          <strong>${formatCostForBasis(cost, item.amountM, item.amountPerMwM)}${basisSuffix}</strong>
          <i aria-hidden="true"><b></b></i>
          <span>${item.label}</span>
          <em>${item.weeks} / ${item.cumulativePct.toFixed(0)}%</em>
        </article>
      `).join("")}
    </div>
  `;
  el.costBackup.innerHTML = `
    <header><span>Backup cost / ${basisLabel}</span><strong>${cost.backup.label}</strong></header>
    <div class="cost-backup-grid" role="group" aria-label="Backup power cost plans">
      ${cost.backupAlternatives.map((plan) => `
        <button type="button" data-cost-backup="${plan.key}" class="cost-backup-btn${plan.key === cost.backup.key ? " is-active" : ""}" style="--plan-color:${plan.accent}" aria-pressed="${plan.key === cost.backup.key}" aria-label="${plan.planCode}, ${plan.label}, ${formatCostForBasis(cost, plan.amountM, plan.amountPerMwM)}${basisSuffix}">
          <span>${plan.planCode}</span>
          <strong>${formatCostForBasis(cost, plan.amountM, plan.amountPerMwM)}</strong>
          <em>${plan.shortLabel}</em>
        </button>
      `).join("")}
    </div>
  `;
  el.costAssumptions.innerHTML = `
    <header><span>Model basis</span><strong>2026 USD</strong></header>
    <div class="cost-driver-grid">
      <div><span>SV facility</span><strong>$${cost.drivers.siliconValleyMPerMw.toFixed(1)}M/MW</strong></div>
      <div><span>Landed delta</span><strong>${cost.drivers.procurementVariancePct >= 0 ? "+" : ""}${cost.drivers.procurementVariancePct.toFixed(1)}%</strong></div>
      <div><span>Quote coverage</span><strong>${cost.drivers.quoteCoveragePct}%</strong></div>
      <div><span>US content</span><strong>${cost.drivers.localContentPct}%</strong></div>
    </div>
    <div class="cost-source-row">
      ${cost.sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${source.publisher}</span><strong>${source.label}</strong></a>`).join("")}
      ${cost.procurement.evidence.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${source.publisher}</span><strong>${source.label}</strong></a>`).join("")}
    </div>
    <footer>${cost.basis}</footer>
  `;
}

function renderPilot() {
  const block = selectedBlock();
  const d = datesFor(block);
  const rows = [
    ["Site access", state.week >= 2 ? "Done" : "Open"],
    ["800V DC path data", d.powerReady - state.week <= 8 ? "Active" : "Open"],
    ["Weekly scan", block.scan === "clear" || state.resolvedDeltas.size > 0 ? "Active" : "Delta"],
    ["Rack load metric", Math.max(0, d.load - state.week) <= 4 ? "Near" : "Open"]
  ];
  el.pilotChecklist.innerHTML = rows.map(([label, status]) => `
    <div class="check-row"><span>${label}</span><strong>${status}</strong></div>
  `).join("");
}

function renderKnowledgeBase() {
  if (!el.knowledgeBase) return;
  const kb = backend.knowledge;
  if (!kb) {
    el.knowledgeBase.innerHTML = `
      <div class="knowledge-head">
        <div><span>Knowledge base</span><strong>Loading evidence layer</strong></div>
        <em>4D / DC / supply</em>
      </div>
    `;
    return;
  }
  const sources = new Map((kb.sources || []).map((source) => [source.id, source]));
  const papers = (kb.research_papers || []).slice(0, 4);
  const stages = (kb.construction_process || []).slice(0, 4);
  const tiers = (kb.supply_chain?.tiers || []).slice(0, 3);
  const sourceLink = (id) => {
    const source = sources.get(id);
    if (!source) return "";
    return `<a href="${source.sourceUrl}" target="_blank" rel="noreferrer">${source.year || ""}</a>`;
  };
  el.knowledgeBase.innerHTML = `
    <div class="knowledge-head">
      <div>
        <span>Knowledge base</span>
        <strong>${kb.metadata?.name || "PowerTwin 4D"}</strong>
      </div>
      <em>${(kb.sources || []).length} sources / ${(kb.construction_process || []).length} stages</em>
    </div>
    <div class="knowledge-grid">
      ${papers.map((item) => `
        <article class="knowledge-card">
          <span>${item.label}</span>
          <strong>${item.productUse}</strong>
          <p>${item.thesis}</p>
          <footer>${(item.evidence || []).map(sourceLink).join("")}</footer>
        </article>
      `).join("")}
    </div>
    <div class="kb-stage-list">
      ${stages.map((item) => `
        <article class="kb-stage">
          <span>${item.stage.replace(/_/g, ".")}</span>
          <strong>${item.name}</strong>
          <em>${item.decision}</em>
        </article>
      `).join("")}
    </div>
    <div class="kb-supply">
      <strong>Diversified intelligent supply chain</strong>
      ${tiers.map((item) => `
        <div>
          <span>${item.label}</span>
          <em>${item.role}</em>
        </div>
      `).join("")}
    </div>
  `;
}

function renderBackendEngine() {
  if (!el.backendEngine) return;
  const engine = backend.designEngine;
  if (!backend.available || !engine) {
    el.backendEngine.innerHTML = "";
    return;
  }
  const gate = engine.capital?.gate || "Design proof";
  const verdict = engine.capital?.verdict || "Needs diligence";
  const capacity = engine.capacityPlan || engine.internalSystems?.capacityPlan || {};
  el.backendEngine.innerHTML = `
    <div class="backend-engine-head">
      <div>
        <span>Backend design engine</span>
        <strong>${verdict}</strong>
      </div>
      <em>${engine.id?.replace("engine-", "run ") || "live"}</em>
    </div>
    <div class="backend-engine-grid">
      <div><span>Capacity fit</span><strong>${capacity.releaseState || "--"}</strong><em>${capacity.gateCount ?? "--"} gates / ${capacity.watchCount ?? "--"} watch</em></div>
      <div><span>Buildable IT</span><strong>${capacity.siteItMw ?? "--"} MW</strong><em>${capacity.deployableRacks ?? "--"} racks / ${capacity.requiredPods ?? "--"} pods</em></div>
      <div><span>Selected pod</span><strong>${capacity.poweredRacks ?? "--"}/${engine.block?.racks ?? "--"}</strong><em>${capacity.podCapacityGapMw ?? "--"} MW full-build gap</em></div>
      <div><span>Facility basis</span><strong>${engine.powerSystem?.selectedMw ?? "--"} MW</strong><em>${capacity.reservePct ?? "--"}% reserve / PUE ${capacity.designPue ?? "--"}</em></div>
      <div><span>Fit</span><strong>${engine.capital?.marketFit ?? "--"}</strong><em>${gate}</em></div>
      <div><span>Fund</span><strong>${engine.capital?.fundability ?? "--"}</strong><em>${engine.schedule?.timeToPowerWeeks ?? "--"}w TTP</em></div>
      <div><span>Foundation</span><strong>${engine.mechanics?.governingRatio ?? "--"}</strong><em>${engine.foundation?.type || "--"}</em></div>
      <div><span>800V DC</span><strong>${engine.energy?.feederUsePct ?? "--"}%</strong><em>${engine.energy?.busCurrentA?.toLocaleString?.() || engine.energy?.busCurrentA || "--"} A</em></div>
      <div><span>Liquid</span><strong>${engine.liquid?.flowUtilPct ?? "--"}</strong><em>${engine.liquid?.pressureDropKpa ?? "--"} kPa</em></div>
      <div><span>Software</span><strong>${engine.software?.releaseScore ?? "--"}</strong><em>${engine.compute?.stack || "--"}</em></div>
      <div><span>GPU rack</span><strong>${engine.internalSystems?.rackCompute?.accelerators ?? "--"}</strong><em>${engine.internalSystems?.rackCompute?.rackKw ?? "--"} kW/rack</em></div>
      <div><span>Sidecar</span><strong>${engine.internalSystems?.powerPath?.sidecarState || "--"}</strong><em>${engine.internalSystems?.powerPath?.protection || "--"}</em></div>
      <div><span>Primary</span><strong>${engine.powerSystem?.source?.shortLabel || "--"}</strong><em>${engine.powerSystem?.selectedMw ?? "--"} MW / ${engine.powerSystem?.sourceUnits ?? "--"} blocks</em></div>
      <div><span>Reliability</span><strong>${engine.powerSystem?.reliability?.label || "--"}</strong><em>${engine.powerSystem?.availabilityPct ?? "--"}% screen</em></div>
      <div><span>CDU train</span><strong>${engine.coolingArchitecture?.activeCduUnits ?? "--"}+1</strong><em>${engine.coolingArchitecture?.quickDisconnects ?? "--"} QDs</em></div>
      <div><span>Module supply</span><strong>${engine.coolingArchitecture?.supplier?.vendor || "--"}</strong><em>${engine.coolingArchitecture?.supplier?.readiness || "--"}</em></div>
    </div>
  `;
}

function renderIntel() {
  const block = selectedBlock();
  const fit = marketFitScore(block);
  const moves = intelMoves(block, fit);
  const constraints = constraintStack(block, fit);
  const opt = optimizerResult(block);
  const best = opt.best;
  const portfolio = sitePortfolio(block);
  const wedge = competitiveWedge(block, opt);
  const capital = capitalCase(block, opt);
  const peers = peerMatrix(block, opt, capital);
  const deltaScore = best.fit.score - opt.current.fit.score;
  const savedWeeks = opt.current.timeToPower - best.timeToPower;
  const scoreLabel = fit.score >= 82 ? "Fundable" : fit.score >= 58 ? "Prove" : "Redesign";
  el.intelSummary.innerHTML = `
    <div class="intel-score" style="--score:${fit.score}%">
      <span>Market fit</span>
      <strong>${fit.score}</strong>
      <em>${scoreLabel} / ${fit.gate}</em>
      <div class="fit-meter" aria-hidden="true"><i></i></div>
    </div>
    <div class="intel-metrics">
      <div><span>800V readiness</span><strong>${fit.powerReadiness.toFixed(0)}</strong></div>
      <div><span>Prefab engine</span><strong>${fit.prefabReadiness.toFixed(0)}</strong></div>
      <div><span>CA site fit</span><strong>${fit.caSiteReadiness.toFixed(0)}</strong></div>
      <div><span>Chip / software</span><strong>${fit.computeReadiness.toFixed(0)}</strong></div>
      <div><span>Market pull</span><strong>${fit.marketPull}</strong></div>
    </div>
  `;
  renderBackendEngine();
  renderKnowledgeBase();
  el.intelOptimizer.innerHTML = `
    <div class="optimizer-head">
      <div>
        <span>Optimization engine</span>
        <strong>${best.objective} objective</strong>
      </div>
      <button class="optimizer-apply" type="button" data-optimizer-key="${best.key}">Apply</button>
    </div>
    <div class="optimizer-result">
      <div>
        <span>Recommended</span>
        <strong>${candidateName(best)}</strong>
        <small>${seismicTierPresets[best.tier].label} / ${best.bridge ? "DC bridge" : "Direct DC"} / ${best.prefab}% prefab</small>
      </div>
      <div class="optimizer-delta">
        <span>Fit</span><strong>${best.fit.score}</strong><em>${deltaScore >= 0 ? "+" : ""}${deltaScore}</em>
        <span>TTP</span><strong>${best.timeToPower}w</strong><em>${savedWeeks > 0 ? `-${savedWeeks}w` : "base"}</em>
      </div>
    </div>
    <div class="optimizer-bars">
      <span style="--bar:${best.fit.powerReadiness}%"><i></i><b>800V</b></span>
      <span style="--bar:${best.constructability}%"><i></i><b>Build</b></span>
      <span style="--bar:${best.gridFlex}%"><i></i><b>Flex</b></span>
      <span style="--bar:${best.constraints.clearance}%"><i></i><b>Gate</b></span>
    </div>
    <div class="optimizer-rank">
      ${opt.ranked.slice(0, 3).map((candidate, index) => `
        <button type="button" data-optimizer-key="${candidate.key}">
          <span>0${index + 1}</span>
          <strong>${candidate.fit.score}</strong>
          <em>${candidate.timeToPower}w / ${dataCenterPresets[candidate.program].label} / ${californiaSitePresets[candidate.site].label}</em>
        </button>
      `).join("")}
    </div>
  `;
  el.intelConstraints.innerHTML = `
    <div class="constraint-head">
      <div>
        <span>Constraint clearance</span>
        <strong>${constraints.clearance}</strong>
      </div>
      <em>${constraints.blockers} gates / ${constraints.watches} watch</em>
    </div>
    <div class="constraint-grid">
      ${constraints.items.map((item) => `
        <a class="constraint-row" href="${item.sourceUrl}" target="_blank" rel="noreferrer" style="--constraint-color:${item.color}; --constraint-score:${item.score}%">
          <span>${item.label}</span>
          <strong>${item.score}</strong>
          <em>${item.gate}</em>
          <small>${item.action}</small>
          <i aria-hidden="true"></i>
        </a>
      `).join("")}
    </div>
  `;
  el.intelPortfolio.innerHTML = `
    <div class="portfolio-head">
      <div>
        <span>California site portfolio</span>
        <strong>${portfolio[0].label}</strong>
      </div>
      <em>${portfolio[0].fit} fit / ${portfolio[0].ttp}w</em>
    </div>
    <div class="portfolio-list">
      ${portfolio.map((item, index) => `
        <article class="portfolio-row${item.site === state.engine.site ? " is-current" : ""}">
          <span>0${index + 1}</span>
          <strong>${item.label}</strong>
          <em>${item.fit} fit / ${item.clearance} gate / ${item.ttp}w</em>
          <small>${item.foundation}</small>
        </article>
      `).join("")}
    </div>
    <div class="wedge-grid">
      ${wedge.map(([label, value, note]) => `
        <div>
          <span>${label}</span>
          <strong>${value}</strong>
          <small>${note}</small>
        </div>
      `).join("")}
    </div>
  `;
  el.intelCapital.innerHTML = `
    <div class="capital-head">
      <div>
        <span>Capital case</span>
        <strong>${capital.verdict}</strong>
      </div>
      <em>${capital.fundability}</em>
    </div>
    <div class="capital-metrics">
      ${capital.metrics.map(([label, value]) => `
        <div><span>${label}</span><strong>${value}</strong></div>
      `).join("")}
    </div>
    <div class="capital-rows">
      ${capital.rows.map(([label, value]) => `
        <div><span>${label}</span><strong>${value}</strong></div>
      `).join("")}
    </div>
  `;
  el.intelPeers.innerHTML = `
    <div class="peer-head">
      <div>
        <span>Peer matrix</span>
        <strong>PowerTwin lead +${peers.lead}</strong>
      </div>
      <em>${peers.verified}</em>
    </div>
    <div class="peer-list">
      ${peers.rows.map((item) => `
        <a class="peer-row${item.name === "PowerTwin 4D" ? " is-us" : ""}" href="${item.sourceUrl}" target="${item.sourceUrl === "#" ? "_self" : "_blank"}" rel="noreferrer" style="--peer-score:${item.score}%">
          <span>${item.lane}</span>
          <strong>${item.name}</strong>
          <em>${item.score}</em>
          <small>${item.gap}</small>
          <i aria-hidden="true"></i>
        </a>
      `).join("")}
    </div>
  `;
  el.intelSignals.innerHTML = marketSignals.map((item) => `
    <article class="intel-card">
      <header>
        <span>${item.type}</span>
        <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">Source</a>
      </header>
      <strong>${item.source}</strong>
      <p>${item.signal}</p>
      <small>${item.implication}</small>
    </article>
  `).join("");
  el.intelReadout.innerHTML = `
    <header><span>Design moves</span><strong>${block.id}</strong></header>
    ${moves.map(([label, value]) => `
      <div class="readout-row"><span>${label}</span><strong>${value}</strong></div>
    `).join("")}
  `;
}

function renderOmniverse() {
  const block = selectedBlock();
  const twin = omniverseTwin(block);
  if (!el.omniverseSummary) return;
  el.omniverseSummary.innerHTML = `
    <div class="omniverse-hero">
      <span>Omniverse-inspired / OpenUSD stage</span>
      <strong>${twin.health} AI factory twin.</strong>
      <p>${twin.source.dsxSignal}</p>
    </div>
    <div class="omniverse-metrics">
      <div><span>Sim readiness</span><strong>${twin.simReadiness}</strong></div>
      <div><span>Root prim</span><strong>${twin.rootPath}</strong></div>
      <div><span>Live stage</span><strong>${twin.liveStage}</strong></div>
    </div>
  `;
  el.omniverseLayers.innerHTML = `
    <div class="panel-heading compact-heading">
      <div><div class="section-kicker">USD layers</div><h2>Composed stage</h2></div>
      <span>${twin.layerScore}</span>
    </div>
    <div class="usd-layer-list">
      ${twin.layers.map((layer) => `
        <article class="usd-layer" style="--layer-color:${layer.color}">
          <div>
            <span>${layer.label} / ${layer.state}</span>
            <strong>${layer.file}</strong>
            <span>${layer.note}</span>
          </div>
          <em>${layer.rev}<br>${layer.score}</em>
        </article>
      `).join("")}
    </div>
  `;
  el.omniverseGraph.innerHTML = `
    <div class="panel-heading compact-heading">
      <div><div class="section-kicker">Scene graph</div><h2>Prim hierarchy</h2></div>
      <span>${twin.nodes.length}</span>
    </div>
    <div class="usd-node-list">
      ${twin.nodes.map((node) => `
        <article class="usd-node" style="--node-color:${node.color}">
          <i aria-hidden="true"></i>
          <div>
            <span>${node.kind}</span>
            <strong>${node.path}</strong>
            <span>${node.note}</span>
          </div>
          <em>${node.score}</em>
        </article>
      `).join("")}
    </div>
  `;
  el.omniverseTelemetry.innerHTML = `
    <div class="panel-heading compact-heading">
      <div><div class="section-kicker">Live telemetry</div><h2>Simulation streams</h2></div>
      <span>${twin.telemetryScore}</span>
    </div>
    <div class="telemetry-grid">
      ${twin.telemetry.map((item) => `
        <article class="telemetry-row" style="--metric-color:${item.color}; --metric-score:${item.score}%">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <em>${item.score}</em>
        </article>
      `).join("")}
    </div>
  `;
  el.omniverseActions.innerHTML = `
    <div class="panel-heading compact-heading">
      <div><div class="section-kicker">Sim actions</div><h2>Human approval queue</h2></div>
      <span>${twin.actions.length}</span>
    </div>
    <div class="sim-action-list">
      ${twin.actions.map((item) => `
        <article class="sim-action" style="--metric-color:${item.color}; --metric-score:${item.score}%">
          <span>${item.label}</span>
          <strong>${item.detail}</strong>
          <em>${item.score}</em>
        </article>
      `).join("")}
    </div>
  `;
}

function renderTabs() {
  document.body.dataset.activeTab = state.tab;
  document.querySelectorAll(".tab-btn").forEach((button) => {
    const active = button.dataset.tab === state.tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    const active = panel.id === `tab${state.tab[0].toUpperCase()}${state.tab.slice(1)}`;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

function render() {
  renderControls();
  renderMetrics();
  renderBlocks();
  renderMap();
  renderConstructionTimeline(selectedBlock());
  renderTwin();
  updateThreeSceneState();
  renderPower();
  renderField();
  renderSupply();
  renderCost();
  renderPilot();
  renderIntel();
  renderOmniverse();
  renderTabs();
  syncRouteState();
  requestThreeFrame();
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("is-visible");
  window.setTimeout(() => el.toast.classList.remove("is-visible"), 2200);
}

function setBackendStatus(label, status = "offline") {
  if (!el.backendStatus) return;
  el.backendStatus.textContent = label;
  el.backendStatus.dataset.state = status;
}

function serializableState() {
  return {
    selectedId: state.selectedId,
    tab: state.tab,
    twinMode: state.twinMode,
    costScope: state.costScope,
    costBasis: state.costBasis,
    costMethod: state.costMethod,
    costFilter: state.costFilter,
    procurementFilter: state.procurementFilter,
    internalLayer: state.internalLayer,
    cutaway: state.cutaway,
    exploded: state.exploded,
    opsFailure: state.opsFailure,
    engine: { ...state.engine },
    scenario: state.scenario,
    week: state.week,
    crew: state.crew,
    prefab: state.prefab,
    bridge: state.bridge,
    resolvedDeltas: [...state.resolvedDeltas]
  };
}

function applySavedState(saved = {}) {
  if (!hasRouteBlock && typeof saved.selectedId === "string" && modules.some((block) => block.id === saved.selectedId)) {
    state.selectedId = saved.selectedId;
  }
  if (!hasRouteTab && validTabs.includes(saved.tab)) state.tab = saved.tab;
  if (!hasRouteMode && validTwinModes.includes(saved.twinMode)) state.twinMode = saved.twinMode;
  if (!hasRouteCostScope && validCostScopes.includes(saved.costScope)) state.costScope = saved.costScope;
  if (!hasRouteCostBasis && validCostBases.includes(saved.costBasis)) state.costBasis = saved.costBasis;
  if (!hasRouteCostMethod && validCostMethods.includes(saved.costMethod)) state.costMethod = saved.costMethod;
  if (costComponentFilters[saved.costFilter]) state.costFilter = saved.costFilter;
  if (procurementPackageFilters[saved.procurementFilter]) state.procurementFilter = saved.procurementFilter;
  if (!hasRouteLayer && validInternalLayers.includes(saved.internalLayer)) state.internalLayer = saved.internalLayer;
  if (!hasRouteCutaway && typeof saved.cutaway === "boolean") state.cutaway = saved.cutaway;
  if (typeof saved.exploded === "boolean") state.exploded = saved.exploded;
  if (opsFailureProfiles[saved.opsFailure]) state.opsFailure = saved.opsFailure;
  if (!hasRouteScenario && validScenarios.includes(saved.scenario)) state.scenario = saved.scenario;
  if (!hasRouteWeek && Number.isFinite(Number(saved.week))) state.week = clamp(Number(saved.week), 0, 30);
  if (Number.isFinite(Number(saved.crew))) state.crew = clamp(Number(saved.crew), 2, 7);
  if (Number.isFinite(Number(saved.prefab))) state.prefab = clamp(Number(saved.prefab), 35, 85);
  if (typeof saved.bridge === "boolean") state.bridge = saved.bridge;
  if (Array.isArray(saved.resolvedDeltas)) state.resolvedDeltas = new Set(saved.resolvedDeltas);

  const engine = saved.engine && typeof saved.engine === "object" ? saved.engine : {};
  const engineGuards = {
    program: dataCenterPresets,
    site: californiaSitePresets,
    tier: seismicTierPresets,
    compute: computePlatforms,
    rack: rackProfiles,
    stack: softwareStacks,
    workload: workloadProfiles,
    policy: softwarePolicies,
    powerSource: powerSourceProfiles,
    reliability: reliabilityProfiles,
    backup: backupProfiles,
    supplier: modularSupplyProfiles,
    supplyStrategy: supplyStrategies,
    supplyShock: supplyShockProfiles
  };
  Object.entries(engineGuards).forEach(([key, guard]) => {
    if (engine[key] && guard[engine[key]]) state.engine[key] = engine[key];
  });
  if (Number.isFinite(Number(engine.powerMw))) state.engine.powerMw = clamp(Number(engine.powerMw), 5, 250);
  if (Number.isFinite(Number(engine.reservePct))) state.engine.reservePct = clamp(Number(engine.reservePct), 5, 30);
  if (!engine.backup && typeof saved.bridge === "boolean") state.engine.backup = saved.bridge ? "bess2h" : "none";
  state.bridge = state.engine.backup !== "none";
}

function backendClientMetrics() {
  const block = selectedBlock();
  const d = datesFor(block);
  const energy = energyValues(block);
  const mechanics = mechanicsValues(block);
  const fluid = fluidValues(block);
  return {
    selectedId: block.id,
    tab: state.tab,
    twinMode: state.twinMode,
    status: statusFor(block),
    readyWeek: d.load,
    facilityMw: Number(energy.facilityMw.toFixed(2)),
    feederUsePct: Number(energy.feederUsePct.toFixed(0)),
    bearingKpa: Number(mechanics.bearingKpa.toFixed(0)),
    settlementMm: Number(mechanics.settlementMm.toFixed(1)),
    liquidPressureKpa: Number(fluid.pressureDropKpa.toFixed(1)),
    capturedAt: new Date().toISOString()
  };
}

async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `API ${response.status}`);
  }
  return payload;
}

async function loadKnowledgeBase() {
  const paths = backend.available ? ["/api/knowledge", "./knowledge/knowledge_base.json"] : ["./knowledge/knowledge_base.json"];
  for (const path of paths) {
    try {
      const payload = path.startsWith("/api")
        ? await apiFetch(path)
        : await (await fetch(path)).json();
      backend.knowledge = payload;
      renderKnowledgeBase();
      renderKnowledgeMap();
      return payload;
    } catch (error) {
      console.warn(`PowerTwin knowledge load failed from ${path}`, error);
    }
  }
  return null;
}

async function loadBackendDesignEngine(silent = true) {
  if (!backend.available) {
    renderBackendEngine();
    return null;
  }
  try {
    const payload = await apiFetch("/api/design/engine", {
      method: "POST",
      body: JSON.stringify({ state: serializableState() })
    });
    backend.designEngine = payload.designEngine || null;
    renderBackendEngine();
    return backend.designEngine;
  } catch (error) {
    console.warn("PowerTwin design engine API failed", error);
    if (!silent) showToast("Design engine API failed.");
    renderBackendEngine();
    return null;
  }
}

async function initBackend() {
  // This personal project runs entirely on static hosting. No server API is used.
  setBackendStatus("Browser demo", "offline");
  await loadKnowledgeBase();
}

async function performBackendSave(reason, silent) {
  setBackendStatus("Syncing", "syncing");
  try {
    const payload = {
      state: serializableState(),
      snapshot: snapshotText(),
      clientMetrics: backendClientMetrics()
    };
    const saved = await apiFetch("/api/projects/default/state", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    const viewOnlyReasons = new Set(["tab", "twin_mode", "internal_layer", "cutaway"]);
    const shouldSimulate = !viewOnlyReasons.has(reason) || !backend.lastSimulation;
    const simulated = shouldSimulate
      ? await apiFetch("/api/projects/default/simulate", {
          method: "POST",
          body: JSON.stringify({ state: payload.state })
        })
      : { simulation: backend.lastSimulation, designEngine: backend.designEngine };
    backend.project = saved.project;
    backend.lastSimulation = simulated.simulation;
    backend.designEngine = simulated.designEngine || saved.project?.lastDesignEngine || backend.designEngine;
    renderBackendEngine();
    apiFetch("/api/projects/default/events", {
      method: "POST",
      body: JSON.stringify({
        type: "state_saved",
        reason,
        selectedId: state.selectedId,
        readiness: simulated.simulation.readiness
      })
    }).catch((eventError) => {
      console.warn("PowerTwin event log failed", eventError);
    });
    backend.failureCount = 0;
    setBackendStatus(`API ${simulated.simulation.readiness}`, "online");
    if (!silent) showToast("Twin saved and simulated.");
    return simulated.simulation;
  } catch (error) {
    console.warn("PowerTwin save failed", error);
    backend.failureCount += 1;
    setBackendStatus("Retry ready", "error");
    if (!silent) showToast("Save interrupted. Your changes remain local.");
    return null;
  }
}

function saveBackendState(reason = "manual", silent = false) {
  if (!backend.available) {
    if (!silent) showToast("Open through backend server first.");
    return Promise.resolve(null);
  }
  if (backend.savePromise) {
    backend.pendingSave = {
      reason,
      silent: silent && (backend.pendingSave?.silent ?? true)
    };
    setBackendStatus("Queued", "syncing");
    return backend.savePromise;
  }
  const currentSave = performBackendSave(reason, silent).finally(() => {
    backend.savePromise = null;
    const pending = backend.pendingSave;
    backend.pendingSave = null;
    if (pending) saveBackendState(pending.reason, pending.silent);
  });
  backend.savePromise = currentSave;
  return currentSave;
}

function scheduleBackendSync(reason = "auto") {
  if (!backend.available) return;
  window.clearTimeout(backend.saveTimer);
  setBackendStatus("Unsaved", "syncing");
  backend.saveTimer = window.setTimeout(() => saveBackendState(reason, true), 900);
}

function snapshotText() {
  const block = selectedBlock();
  const d = datesFor(block);
  const ops = operationsTwinValues(block);
  const mechanics = mechanicsValues(block);
  const fluid = fluidValues(block);
  const thermal = thermalValues(block);
  const energy = energyValues(block);
  const power = energy.powerSystem;
  const cooling = coolingArchitectureValues(block);
  const capacity = capacityPlanValues(block);
  const supply = supplyChainValues(block);
  const cost = costModelValues(block);
  const physics = physicsLedgerValues(block);
  const compute = computeValues(block);
  const software = softwareValues(block);
  const foundation = mechanics.foundation;
  const fit = marketFitScore(block);
  const constraints = constraintStack(block, fit);
  const opt = optimizerResult(block);
  const portfolio = sitePortfolio(block);
  const capital = capitalCase(block, opt);
  const peers = peerMatrix(block, opt, capital);
  const ov = omniverseTwin(block);
  return [
    `PowerTwin 4D snapshot`,
    `Scenario: ${scenarioValues().name}`,
    `Week: ${state.week}`,
    `Twin mode: ${state.twinMode === "ops" ? "Operations" : state.twinMode === "software" ? "Software" : state.twinMode === "compute" ? "Compute" : state.twinMode === "physics" ? "Physics" : state.twinMode === "thermal" ? "Thermal" : state.twinMode === "fluid" ? "Liquid" : state.twinMode === "energy" ? "Energy" : state.twinMode === "mechanics" ? "Structure" : "Design"}`,
    `GPU internal layer: ${gpuInternalLayers[state.internalLayer]?.label || "All"} / ${state.cutaway !== false ? "cutaway" : "closed shell"}`,
    `Block: ${block.id}`,
    `Status: ${statusLabel(statusFor(block))}`,
    `Steel bay: ${block.steelBay}`,
    `Pod IT allocation: ${block.mw.toFixed(1)} MW / ${block.racks} physical rack slots`,
    `800V DC bus: ${block.feeder}`,
    `Rectifier skid: ${block.rectifier}`,
    `Primary supply: ${power.source.shortLabel}, ${power.selectedMw.toFixed(0)} MW, ${power.sourceUnits} source blocks, ${power.sourceNameplateMw.toFixed(0)} MW nameplate`,
    `Primary plant: ${power.source.technology || power.source.label}, ${power.source.fuelType || "utility interface"}${power.sourceYardEnvelopeM2 ? `, ${power.sourceYardEnvelopeM2.toLocaleString()} m2 yard` : ""}`,
    `Reliability: ${power.reliability.label}, ${power.availabilityPct.toFixed(5)}% probability screen, ${power.outageMinutesYear.toFixed(1)} min/year screen, not Tier certification`,
    `Backup: ${power.backup.shortLabel}, ${power.batteryUsableMwh.toFixed(1)} MWh usable / ${power.batteryNameplateMwh.toFixed(1)} MWh nameplate, ${power.firmingStatus}`,
    `Standby plant: ${power.generatorInstalled ? `${power.generatorActive}+1 x ${power.backup.generatorUnitMw.toFixed(1)} MW ${power.backup.generatorFuel}` : "none"}, ${power.fuelLiters ? `${Math.round(power.fuelLiters).toLocaleString()} L onsite fuel / ${power.backup.autonomyHours} h` : "no onsite fuel"}`,
    `Buildable capacity: ${capacity.siteItMw.toFixed(2)} MW IT / ${capacity.deployableRacks} racks / ${capacity.requiredPods} pods / ${capacity.siteAccelerators} accelerators`,
    `Capacity basis: ${capacity.reservePct.toFixed(0)}% reserve / PUE ${capacity.designPue.toFixed(3)} / ${capacity.headroomMw.toFixed(2)} MW headroom`,
    `Pod power fit: ${capacity.poweredRacks}/${block.racks} racks energizable / ${capacity.podCapacityGapMw.toFixed(2)} MW full-build gap`,
    `Site equipment: ${capacity.activeRectifierBlocks}/${capacity.installedRectifierBlocks} rectifier duty/installed, ${capacity.siteCduActive}/${capacity.siteCduInstalled} CDU duty/installed, ${capacity.sitePumpActive}/${capacity.sitePumpInstalled} pumps duty/installed, ${capacity.bessContainers} BESS containers, ${capacity.generatorInstalled} standby gensets, ${capacity.fuelTankModules} fuel tanks`,
    `Supply chain: ${supply.strategy.label}, ${supply.shock.shortLabel}, readiness ${supply.readiness}, ${supply.dualSourceCoveragePct}% dual-source coverage`,
    `Supply critical path: ${supply.criticalPath.component}, ${supply.criticalPath.leadWeeks} weeks, ${supply.criticalPath.country}`,
    `Project CAPEX: ${formatCost(cost.exGpuPerMwM)}/MW Ex-GPU (${formatCost(cost.exGpuM)} total) / ${formatCost(cost.facilityScopePerMwM)}/MW facility + backup / ${formatCost(cost.gpuCardsPerMwM)}/MW accelerator cards excluded`,
    `Cost range: ${formatCost(cost.lowPerMwM)}-${formatCost(cost.highPerMwM)}/MW / ${cost.estimateClass} / ${cost.constructionMethod.code} ${cost.constructionMethod.label} / ${cost.backup.planCode} ${cost.backup.shortLabel}`,
    `Chip platform: ${compute.platform.label} / ${compute.platform.silicon}`,
    `Rack profile: ${compute.rack.label}, ${compute.rackKw.toFixed(0)} kW/rack, ${compute.accelerators} accelerators`,
    `Software stack: ${compute.stack.label}, ${compute.stack.scheduler}, ${compute.stack.runtime}`,
    `Workload: ${compute.workload.label}, software fit ${compute.softwareFit.toFixed(0)}, deploy risk ${compute.deployRisk.toFixed(0)}`,
    `Software architecture: release ${software.releaseScore}, policy ${software.policy.label}, queue p95 ${software.queueP95Min.toFixed(0)} min, rollback ${software.rollbackMin.toFixed(0)} min`,
    `Software planes: control ${software.controlPlaneScore.toFixed(0)}, runtime ${software.dataPlaneScore.toFixed(0)}, telemetry ${software.observabilityScore.toFixed(0)}, security ${software.securityScore.toFixed(0)}`,
    `OpenUSD twin: ${ov.health}, readiness ${ov.simReadiness}, root ${ov.rootPath}`,
    `USD layers: ${ov.layers.map((layer) => `${layer.file}:${layer.state}`).join(", ")}`,
    `Telemetry streams: ${ov.telemetry.map((item) => `${item.label} ${item.value}`).join(" / ")}`,
    `DC headroom: ${feederHeadroomMw(block.feeder).toFixed(1)} MW`,
    `Energy check: ${energy.facilityMw.toFixed(2)} MW facility / ${Math.round(energy.busCurrentA).toLocaleString()} A bus / ${energy.currentReductionPct.toFixed(1)}% current reduction vs 54V / ${energy.conversionLossKw.toFixed(0)} kW loss / ${energy.bridgeKwh.toFixed(0)} kWh buffer`,
    `Operations risk: ${ops.riskScore.toFixed(0)} / ${ops.health}`,
    `Design engine: ${foundation.program.label} / ${foundation.site.label} / ${foundation.tier.label}`,
    `Foundation output: ${foundation.type}, ${foundation.matThicknessM.toFixed(2)}m mat, ${foundation.allowableBearingKpa} kPa bearing, Site ${foundation.siteClass}`,
    `Mechanics check: ${mechanics.bearingKpa.toFixed(0)} kPa / ${mechanics.settlementMm.toFixed(1)} mm / ${mechanics.seismicBaseShearKn.toFixed(0)} kN base shear`,
    `Fluid check: ${fluid.flowLpm.toFixed(0)} L/min / ${fluid.velocityMs.toFixed(2)} m/s / ${fluid.pressureDropKpa.toFixed(1)} kPa pressure drop`,
    `Cooling modules: ${cooling.activeCduUnits}+1 CDU, ${cooling.activePumps}+1 pumps, ${cooling.rowManifolds} manifolds, ${cooling.quickDisconnects} QDs, ${cooling.coldPlateCircuits} cold-plate circuits`,
    `Modular supply: ${cooling.supplier.label}, ${cooling.supplier.rackStandard}, ${cooling.supplier.coolingInterface}`,
    `Physics ledger: ${physics.entries.filter((entry) => entry.residualPct !== null && entry.residualPct <= 0.1).length}/5 physical closures pass`,
    `Thermal check: ${thermal.fluid.heatKw.toFixed(0)} kW heat / ${thermal.coldPlateC.toFixed(1)} C cold plate / ${thermal.pueProxy.toFixed(3)} PUE proxy`,
    `Market fit: ${fit.score} / ${fit.gate}`,
    `Constraint clearance: ${constraints.clearance}, gates ${constraints.blockers}, watch ${constraints.watches}`,
    `Intel basis: ${marketSignals.length} current industry and California site signals`,
    `Best California site: ${portfolio[0].label}, fit ${portfolio[0].fit}, clearance ${portfolio[0].clearance}, TTP ${portfolio[0].ttp}w`,
    `Capital case: ${capital.verdict}, fundability ${capital.fundability}, pilot ${block.mw.toFixed(1)} MW`,
    `Peer matrix: PowerTwin lead +${peers.lead}, ${peers.verified}`,
    `Optimizer recommendation: ${candidateName(opt.best)} / ${seismicTierPresets[opt.best.tier].label} / ${opt.best.bridge ? "800V DC bridge" : "Direct DC"} / ${opt.best.prefab}% prefab / objective ${opt.best.objective}`,
    `Ready week: ${d.load}`,
    `Critical path: ${criticalPathFor(block)}`,
    `Capacity decision: ${capacity.nextDecision}`,
    `Next action: ${nextActionFor(block)}`
  ].join("\n");
}

async function exportBrief() {
  const text = snapshotText();
  let persisted = false;
  if (backend.available) {
    try {
      setBackendStatus("Exporting", "syncing");
      await apiFetch("/api/projects/default/export", {
        method: "POST",
        body: JSON.stringify({
          name: `powertwin-${state.selectedId.toLowerCase()}-pilot-brief`,
          snapshot: text
        })
      });
      persisted = true;
      setBackendStatus("Exported", "online");
    } catch (error) {
      console.warn("PowerTwin export API failed", error);
      setBackendStatus("Export local", "error");
    }
  }
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `powertwin-${state.selectedId.toLowerCase()}-pilot-brief.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(persisted ? "Pilot brief exported and saved." : "Pilot brief exported.");
}

function setConstructionWeek(value, reason = "week") {
  state.week = clamp(Number(value) || 0, 0, 30);
  render();
  scheduleBackendSync(reason);
}

el.weekRange.addEventListener("input", (event) => {
  setConstructionWeek(event.target.value, "week");
});

el.constructionTimelineRange?.addEventListener("input", (event) => {
  setConstructionWeek(event.target.value, "construction_timeline");
});

el.constructionMilestones?.addEventListener("click", (event) => {
  const milestone = event.target.closest("[data-construction-week]");
  if (!milestone) return;
  beginRouteTransition();
  state.week = clamp(Number(milestone.dataset.constructionWeek) || 0, 0, 30);
  state.tab = "twin";
  state.twinMode = "design";
  state.internalLayer = "construction";
  state.cutaway = true;
  render();
  scheduleBackendSync("construction_milestone");
});

el.crewRange.addEventListener("input", (event) => {
  state.crew = Number(event.target.value);
  render();
  scheduleBackendSync("crew");
});

el.prefabRange.addEventListener("input", (event) => {
  state.prefab = Number(event.target.value);
  state.costMethod = state.prefab >= 70 ? "highPrefab" : state.prefab >= 50 ? "hybrid" : "conventional";
  render();
  scheduleBackendSync("prefab");
});

el.bridgeToggle.addEventListener("change", (event) => {
  state.bridge = event.target.checked;
  state.engine.backup = state.bridge ? (state.engine.backup === "none" ? "bess2h" : state.engine.backup) : "none";
  render();
  scheduleBackendSync("bridge");
});

document.querySelectorAll(".scenario-chip").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.scenario === state.scenario) return;
    beginRouteTransition();
    state.scenario = button.dataset.scenario;
    if (state.scenario === "utilitySlip") {
      state.bridge = false;
      state.engine.backup = "none";
    }
    if (state.scenario === "accelerated") {
      state.crew = Math.max(state.crew, 5);
      state.prefab = Math.max(state.prefab, 72);
      state.costMethod = "highPrefab";
    }
    render();
    scheduleBackendSync("scenario");
  });
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.tab === state.tab) return;
    beginRouteTransition();
    state.tab = button.dataset.tab;
    render();
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll(".tab-btn")];
    const currentIndex = tabs.indexOf(button);
    const targetIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[targetIndex].focus();
    tabs[targetIndex].click();
  });
});

document.querySelectorAll(".twin-mode-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.twinMode === state.twinMode && state.tab === "twin") return;
    beginRouteTransition();
    state.twinMode = button.dataset.twinMode;
    state.tab = "twin";
    render();
  });
});

if (el.gpuLayerControls) {
  el.gpuLayerControls.addEventListener("click", (event) => {
    const layerButton = event.target.closest("[data-internal-layer]");
    if (layerButton) {
      const layer = layerButton.dataset.internalLayer;
      if (validInternalLayers.includes(layer)) {
        if (layer === state.internalLayer && state.tab === "twin") return;
        beginRouteTransition();
        state.internalLayer = layer;
        state.tab = "twin";
        render();
      }
      return;
    }
    if (event.target.closest("#cutawayToggle")) {
      beginRouteTransition();
      state.cutaway = state.cutaway === false;
      state.tab = "twin";
      render();
      return;
    }
    if (event.target.closest("#explodedToggle")) {
      beginRouteTransition();
      state.exploded = !state.exploded;
      state.tab = "twin";
      render();
    }
  });
}

if (el.opsFailureControls) {
  el.opsFailureControls.addEventListener("click", (event) => {
    const failureButton = event.target.closest("[data-ops-failure]");
    if (!failureButton || !opsFailureProfiles[failureButton.dataset.opsFailure]) return;
    beginRouteTransition();
    state.opsFailure = failureButton.dataset.opsFailure;
    state.twinMode = "ops";
    state.tab = "twin";
    render();
  });
}

if (el.supplyControls) {
  el.supplyControls.addEventListener("click", (event) => {
    const strategyButton = event.target.closest("[data-supply-strategy]");
    const shockButton = event.target.closest("[data-supply-shock]");
    if (!strategyButton && !shockButton) return;
    beginRouteTransition();
    if (strategyButton && supplyStrategies[strategyButton.dataset.supplyStrategy]) {
      state.engine.supplyStrategy = strategyButton.dataset.supplyStrategy;
    }
    if (shockButton && supplyShockProfiles[shockButton.dataset.supplyShock]) {
      state.engine.supplyShock = shockButton.dataset.supplyShock;
    }
    state.tab = "supply";
    render();
    scheduleBackendSync(strategyButton ? "supply_strategy" : "supply_shock");
  });
}

document.getElementById("tabCost")?.addEventListener("click", (event) => {
  const scopeButton = event.target.closest("[data-cost-scope]");
  const basisButton = event.target.closest("[data-cost-basis]");
  const backupButton = event.target.closest("[data-cost-backup]");
  const methodButton = event.target.closest("[data-cost-method]");
  const filterButton = event.target.closest("[data-cost-filter]");
  const strategyButton = event.target.closest("[data-cost-strategy]");
  const procurementFilterButton = event.target.closest("[data-procurement-filter]");
  if (!scopeButton && !basisButton && !backupButton && !methodButton && !filterButton && !strategyButton && !procurementFilterButton) return;
  beginRouteTransition();
  if (scopeButton && validCostScopes.includes(scopeButton.dataset.costScope)) {
    state.costScope = scopeButton.dataset.costScope;
  }
  if (basisButton && validCostBases.includes(basisButton.dataset.costBasis)) {
    state.costBasis = basisButton.dataset.costBasis;
  }
  if (backupButton && backupProfiles[backupButton.dataset.costBackup]) {
    state.engine.backup = backupButton.dataset.costBackup;
    state.bridge = state.engine.backup !== "none";
  }
  if (methodButton && constructionMethodProfiles[methodButton.dataset.costMethod]) {
    state.costMethod = methodButton.dataset.costMethod;
    state.prefab = constructionMethodProfiles[state.costMethod].prefabPct;
    state.crew = constructionMethodProfiles[state.costMethod].crewCount;
  }
  if (filterButton && costComponentFilters[filterButton.dataset.costFilter]) {
    state.costFilter = filterButton.dataset.costFilter;
  }
  if (strategyButton && supplyStrategies[strategyButton.dataset.costStrategy]) {
    state.engine.supplyStrategy = strategyButton.dataset.costStrategy;
  }
  if (procurementFilterButton && procurementPackageFilters[procurementFilterButton.dataset.procurementFilter]) {
    state.procurementFilter = procurementFilterButton.dataset.procurementFilter;
  }
  state.tab = "cost";
  render();
  scheduleBackendSync(
    backupButton
      ? "cost_backup"
      : methodButton
        ? "cost_method"
        : strategyButton
          ? "cost_supply_strategy"
          : procurementFilterButton
            ? "cost_procurement_filter"
            : filterButton
              ? "cost_filter"
              : basisButton
                ? "cost_basis"
                : "cost_scope"
  );
});

el.designEngine.addEventListener("click", (event) => {
  const chip = event.target.closest("[data-engine-key]");
  if (!chip) return;
  if (state.engine[chip.dataset.engineKey] === chip.dataset.engineValue && state.tab === "twin") return;
  beginRouteTransition();
  const mode = state.twinMode;
  state.engine[chip.dataset.engineKey] = chip.dataset.engineValue;
  if (chip.dataset.engineKey === "backup") state.bridge = chip.dataset.engineValue !== "none";
  state.twinMode = ["design", "mechanics", "energy", "fluid", "thermal", "physics", "compute", "software"].includes(mode) ? mode : "design";
  state.tab = "twin";
  render();
  scheduleBackendSync("design_engine");
});

el.designEngine.addEventListener("input", (event) => {
  const range = event.target.closest("[data-engine-range]");
  if (!range) return;
  if (range.dataset.engineRange === "powerMw") {
    state.engine.powerMw = clamp(Number(range.value), 5, 250);
    el.designEngine.querySelectorAll("[data-power-mw-value]").forEach((label) => {
      label.textContent = `${Math.round(state.engine.powerMw)} MW`;
    });
  } else if (range.dataset.engineRange === "reservePct") {
    state.engine.reservePct = clamp(Number(range.value), 5, 30);
    el.designEngine.querySelectorAll("[data-reserve-pct-value]").forEach((label) => {
      label.textContent = `${Math.round(state.engine.reservePct)}%`;
    });
  } else {
    return;
  }
  renderPowerHud(selectedBlock());
  updateThreeSceneState();
  requestThreeFrame();
});

el.designEngine.addEventListener("change", (event) => {
  const range = event.target.closest("[data-engine-range]");
  if (!range) return;
  beginRouteTransition();
  if (range.dataset.engineRange === "powerMw") {
    state.engine.powerMw = clamp(Number(range.value), 5, 250);
  } else if (range.dataset.engineRange === "reservePct") {
    state.engine.reservePct = clamp(Number(range.value), 5, 30);
  } else {
    return;
  }
  render();
  scheduleBackendSync(range.dataset.engineRange === "powerMw" ? "power_scale" : "reserve_scale");
});

el.intelOptimizer.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-optimizer-key]");
  if (!trigger) return;
  const key = trigger.dataset.optimizerKey;
  const candidate = optimizerResult(selectedBlock()).ranked.find((item) => item.key === key);
  if (candidate) applyOptimizerCandidate(candidate);
});

el.resolveScan.addEventListener("click", () => {
  const block = selectedBlock();
  const first = el.scanStack.querySelector(".scan-row strong");
  if (first) {
    const name = first.childNodes[0].textContent;
    state.resolvedDeltas.add(`${block.id}:${name}`);
    render();
    scheduleBackendSync("scan_resolved");
    showToast("Field delta marked resolved.");
  }
});

document.getElementById("exportBrief").addEventListener("click", exportBrief);

if (el.saveTwin) {
  el.saveTwin.addEventListener("click", () => saveBackendState("manual"));
}

document.getElementById("copySnapshot").addEventListener("click", async () => {
  const text = snapshotText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("Snapshot copied.");
  } catch {
    showToast("Snapshot ready in export brief.");
  }
});

window.addEventListener("resize", () => {
  resizeThreeScene();
  if (state.tab === "power") drawPower();
});

window.addEventListener("popstate", () => {
  applyRouteState();
  render();
});

try {
  initThreeScene();
} catch (error) {
  threeState.enabled = false;
  threeState.renderer = null;
  console.error("PowerTwin 3D init failed", error);
  const fallback = document.createElement("div");
  fallback.className = "three-fallback";
  const fallbackImage = document.createElement("img");
  fallbackImage.src = "./assets/powertwin-site-preview.png";
  fallbackImage.alt = "Modular GPU data center power, cooling, and compute reference model";
  fallback.appendChild(fallbackImage);
  el.threeViewport.appendChild(fallback);
}
render();
initBackend();
if (threeState.renderer) requestThreeFrame();

// Optional structured access to the visible prototype state.
if(document.modelContext?.registerTool){
 const lifecycle = new AbortController();
 Promise.resolve(document.modelContext.registerTool({name:"read_power_twin_summary",title:"Read power twin summary",description:"Read the current visible capacity and time-to-power planning summary. No changes.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input!=="object"||Object.keys(input).length)throw new Error("Expected an empty object");return {mwReady:document.getElementById("mwReady")?.textContent,timeToPower:document.getElementById("ttp")?.textContent,criticalPath:document.getElementById("criticalPath")?.textContent,basis:"Illustrative research model; browser-only preview"}}},{signal:lifecycle.signal})).catch(()=>{});
 window.addEventListener("pagehide",()=>lifecycle.abort(),{once:true});
}
