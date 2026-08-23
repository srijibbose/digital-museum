import {
  jetEngineContentSchema,
  type JetProfileId,
  type JetStationId,
  type JetViewId,
} from "@/lib/jet-engine/jet-engine-schema";

export const jetEngine = jetEngineContentSchema.parse({
  title: "The Engine Is a River",
  subtitle: "A three-dimensional flow laboratory for the high-bypass turbofan",
  thesis:
    "A modern turbofan is not a fire tube that pushes an aircraft forward. It is a carefully balanced machine that splits one intake flow into two coupled rivers: a large, cooler bypass stream that produces much of the propulsive effect, and a smaller core stream that supplies the work needed to keep the fan and compressors turning.",
  visitorPromise:
    "Move station by station, change operating condition, and leave able to explain where pressure rises, where heat enters, why temperature falls through the turbine, and how both exhaust streams contribute to net thrust.",
  reconstructionNotice:
    "The central machine is an artist-authored CC BY 4.0 turbofan reconstruction by blenderbirb. Loupe maps NASA station conventions and cycle-linked overlays onto it. The geometry is generalized: it is not a scan, manufacturing drawing, or dimensionally exact representation of a particular production engine.",
  modelNotice:
    "Readouts come from a transparent, idealized zero-dimensional cycle using a standard atmosphere and fixed component properties. They show coherent trends for four representative conditions; they do not resolve internal duct velocity and are not certified performance data, live telemetry, or a design tool.",
  stations: [
    {
      id: "0",
      number: "0",
      shortLabel: "Free stream",
      label: "Undisturbed atmosphere",
      stream: "shared",
      x: 48,
      evidence: "reference-convention",
      summary:
        "Station 0 describes the air before the engine has disturbed it. Altitude and flight Mach number establish the ambient pressure, temperature, density, and approach velocity used by the cycle model.",
      transformation:
        "No engine work has occurred. This is the reference state against which inlet recovery and exhaust momentum are measured.",
      interpretation:
        "Changing flight profile changes the atmosphere before it changes the engine: cruise begins with colder, thinner, faster-moving air than takeoff.",
      sourceIds: ["nasa-stations", "nasa-engine-theory"],
    },
    {
      id: "2",
      number: "2",
      shortLabel: "Fan face",
      label: "Inlet exit and fan face",
      stream: "shared",
      x: 250,
      evidence: "reference-convention",
      summary:
        "The inlet slows and conditions the approaching air before it reaches the fan. In NASA's station convention, station 2 is the inlet exit and the beginning of compression.",
      transformation:
        "Velocity is traded for a useful rise in total conditions while a small inlet pressure loss is retained in the model.",
      interpretation:
        "The inlet is not decorative casing. Its job is to deliver an even, recoverable flow to the rotating machinery across a wide flight envelope.",
      sourceIds: ["nasa-stations", "nasa-engine-theory"],
    },
    {
      id: "f",
      number: "f",
      shortLabel: "Bypass exit",
      label: "Fan stream exit",
      stream: "bypass",
      x: 1048,
      evidence: "modelled-cycle",
      summary:
        "Most of the intake air in this representative high-bypass architecture passes around the hot core. NASA denotes this branch as fan flow and its exit as station f in the turbofan thrust relationship.",
      transformation:
        "The fan gives a large mass of air a comparatively modest velocity increase before it leaves through the bypass nozzle.",
      interpretation:
        "Efficient transport propulsion favors moving more air by a smaller velocity increment instead of relying only on a small, very fast core jet.",
      sourceIds: ["nasa-turbofan", "faa-turbofan", "nasa-cfd-visualization"],
    },
    {
      id: "3",
      number: "3",
      shortLabel: "Compressor exit",
      label: "Compressor exit and burner entry",
      stream: "core",
      x: 538,
      evidence: "modelled-cycle",
      summary:
        "Alternating rotor and stator rows add work to the core stream. Station 3 is the compressor exit, where total pressure is highest and compression has also raised total temperature.",
      transformation:
        "Shaft work becomes pressure rise. The model applies the selected overall pressure ratio with a stated compressor efficiency.",
      interpretation:
        "Compression prepares a dense, high-pressure stream for combustion; it is the principal mechanical load the turbine must later repay.",
      sourceIds: ["nasa-stations", "nasa-enginesim", "nasa-engine-theory", "nasa-ge90-flow"],
    },
    {
      id: "4",
      number: "4",
      shortLabel: "Turbine inlet",
      label: "Burner exit and turbine inlet",
      stream: "core",
      x: 706,
      evidence: "modelled-cycle",
      summary:
        "Fuel releases chemical energy in the combustor between stations 3 and 4. The dominant cycle change is a large rise in total temperature, accompanied by a modeled combustor pressure loss.",
      transformation:
        "Heat is added at nearly constant pressure; the selected profile sets a representative turbine-inlet temperature for the cycle.",
      interpretation:
        "The hottest station is not the nozzle. It is the turbine inlet, where cooled high-pressure turbine hardware must survive the energy just added.",
      sourceIds: ["nasa-stations", "nasa-enginesim", "nasa-engine-theory"],
    },
    {
      id: "5",
      number: "5",
      shortLabel: "Turbine exit",
      label: "Turbine exit",
      stream: "core",
      x: 892,
      evidence: "modelled-cycle",
      summary:
        "The turbine expands the hot core flow and extracts work through concentric shafts. In this model, that work balances the compressor and the fan before the remaining gas reaches the core nozzle.",
      transformation:
        "Total temperature and pressure fall as gas energy is converted to shaft work for the upstream rotating machinery.",
      interpretation:
        "A turbine is not powered merely to spin itself: it closes the engine's energy loop by driving the compressor and the large fan.",
      sourceIds: ["nasa-stations", "nasa-parts", "nasa-engine-theory"],
    },
    {
      id: "8",
      number: "8",
      shortLabel: "Core nozzle",
      label: "Core nozzle throat",
      stream: "core",
      x: 1096,
      evidence: "modelled-cycle",
      summary:
        "Station 8 is the core nozzle throat in NASA's convention. The nozzle converts remaining total pressure and temperature into exhaust velocity; the fan and core momentum changes then combine to produce net thrust.",
      transformation:
        "Expansion accelerates the remaining core flow. The exhibit assumes ideal expansion toward ambient pressure with a stated nozzle efficiency.",
      interpretation:
        "The nozzle finishes the conversion rather than creating energy. Net thrust depends on both exit streams and on the momentum already carried by the incoming air.",
      sourceIds: ["nasa-stations", "nasa-turbofan", "nasa-engine-theory"],
    },
  ],
  profiles: [
    {
      id: "ground-idle",
      label: "Ground idle",
      context: "Apron · stabilized idle",
      altitudeM: 0,
      mach: 0.02,
      turbineInletTemperatureK: 1_050,
      overallPressureRatio: 10,
      fanPressureRatio: 1.16,
      throttlePercent: 28,
      assumption:
        "A low-power educational condition with reduced pressure ratios; it represents a stabilized engine, not a start sequence or a named engine idle schedule.",
    },
    {
      id: "takeoff",
      label: "Takeoff",
      context: "Sea level · initial acceleration",
      altitudeM: 0,
      mach: 0.25,
      turbineInletTemperatureK: 1_700,
      overallPressureRatio: 34,
      fanPressureRatio: 1.55,
      throttlePercent: 100,
      assumption:
        "A high-power sea-level model point selected to expose maximum cycle contrasts. It is representative and is not a certified takeoff rating.",
    },
    {
      id: "climb",
      label: "Climb",
      context: "3,000 m · Mach 0.45",
      altitudeM: 3_000,
      mach: 0.45,
      turbineInletTemperatureK: 1_580,
      overallPressureRatio: 30,
      fanPressureRatio: 1.48,
      throttlePercent: 86,
      assumption:
        "A representative climb condition between sea-level takeoff and cruise; no aircraft drag model or engine control schedule is implied.",
    },
    {
      id: "cruise",
      label: "Cruise",
      context: "10,668 m · Mach 0.78",
      altitudeM: 10_668,
      mach: 0.78,
      turbineInletTemperatureK: 1_450,
      overallPressureRatio: 28,
      fanPressureRatio: 1.42,
      throttlePercent: 72,
      assumption:
        "A representative transport cruise point at 35,000 feet. Level-flight thrust, fuel burn, and a particular aircraft installation are outside this model.",
    },
  ],
  views: [
    {
      id: "section",
      label: "Section",
      evidence: "explanatory-reconstruction",
      description: "Read the architecture and the mechanical relationship between fan, core, shafts, and nozzles.",
    },
    {
      id: "airflow",
      label: "Airflow",
      evidence: "explanatory-reconstruction",
      description: "Trace a qualitative 3D seeded-particle field as the shared intake divides into cooler bypass and smaller hot-core streams; motion is illustrative, not CFD.",
    },
    {
      id: "pressure",
      label: "Pressure",
      evidence: "modelled-cycle",
      description: "Orbit a cycle-linked 3D total-pressure field referenced to ambient pressure at station 0 for the selected profile.",
    },
    {
      id: "thermal",
      label: "Thermal",
      evidence: "modelled-cycle",
      description: "Orbit a cycle-linked 3D total-temperature field through compression, heat addition, turbine work extraction, and expansion.",
    },
    {
      id: "shafts",
      label: "Shaft work",
      evidence: "explanatory-reconstruction",
      description: "Isolate the concentric mechanical paths that connect turbine stages to the core compressor and fan.",
    },
  ],
  sources: [
    {
      id: "nasa-stations",
      title: "Gas Turbine Schematic and Station Numbers",
      organization: "NASA Glenn Research Center",
      url: "https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html",
      kind: "primary-reference",
      use: "Defines stations 0 through 8 and the functional boundaries used throughout the exhibit.",
      accessed: "2026-08-23",
    },
    {
      id: "nasa-turbofan",
      title: "Turbofan Thrust",
      organization: "NASA Glenn Research Center",
      url: "https://www.grc.nasa.gov/www/k-12/airplane/turbfan.html",
      kind: "primary-reference",
      use: "Defines core and fan flow, bypass ratio, and the two-stream turbofan thrust relationship.",
      accessed: "2026-08-23",
    },
    {
      id: "nasa-enginesim",
      title: "EngineSim 1.7a — Engine Simulator",
      organization: "NASA Glenn Research Center",
      url: "https://www.grc.nasa.gov/WWW/k-12/BGP/ngnsim.html",
      kind: "primary-reference",
      use: "Establishes the educational cycle inputs and component variables represented by the profile model.",
      accessed: "2026-08-23",
    },
    {
      id: "nasa-engine-theory",
      title: "Beginner's Guide to Propulsion: Engine Theory",
      organization: "NASA Glenn Research Center",
      url: "https://www.grc.nasa.gov/www/k-12/airplane/EngineTheory.pdf",
      kind: "technical-report",
      use: "Supplies the thermodynamic station relationships and idealized component equations used by the cycle model.",
      accessed: "2026-08-23",
    },
    {
      id: "nasa-parts",
      title: "Gas Turbine Parts",
      organization: "NASA Glenn Research Center",
      url: "https://www.grc.nasa.gov/WWW/K-12/BGP/enex.html",
      kind: "primary-reference",
      use: "Supports the rotor, stator, turbine, compressor, and shaft relationships shown in the reconstruction.",
      accessed: "2026-08-23",
    },
    {
      id: "faa-turbofan",
      title: "Airplane Flying Handbook, Chapter 16 — Turbofan Engine",
      organization: "Federal Aviation Administration",
      url: "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/17_afh_ch16.pdf",
      kind: "technical-handbook",
      use: "Supports the overall sectional arrangement and the distinction between bypass and core airflow.",
      accessed: "2026-08-23",
    },
    {
      id: "nasa-ge90-flow",
      title: "Full Engine Three-Dimensional Flow Simulations of the GE90 Turbofan Engine",
      organization: "NASA Technical Reports Server",
      url: "https://ntrs.nasa.gov/citations/20000034013",
      kind: "technical-report",
      use: "Establishes the distinction between whole-engine three-dimensional flow simulation and this exhibit's deliberately qualitative real-time particle seeding.",
      accessed: "2026-08-23",
    },
    {
      id: "nasa-cfd-visualization",
      title: "Time-Accurate Turbofan Simulation and Blade-Wake Visualization",
      organization: "NASA Advanced Supercomputing Division",
      url: "https://www.nas.nasa.gov/SC23/research/project4.html",
      kind: "primary-reference",
      use: "Informs the use of seeded particles as a flow-visualization language while preventing the real-time exhibit from being misrepresented as a CFD solution.",
      accessed: "2026-08-23",
    },
  ],
});

export function getJetStation(id: JetStationId) {
  const station = jetEngine.stations.find((item) => item.id === id);
  if (!station) throw new Error(`Unknown jet-engine station: ${id}`);
  return station;
}

export function getJetProfile(id: JetProfileId) {
  const profile = jetEngine.profiles.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown jet-engine profile: ${id}`);
  return profile;
}

export function getJetView(id: JetViewId) {
  const view = jetEngine.views.find((item) => item.id === id);
  if (!view) throw new Error(`Unknown jet-engine view: ${id}`);
  return view;
}
