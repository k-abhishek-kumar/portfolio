/**
 * Garage content.
 *
 * `hotspot` is the vehicle's bounding box on the hero image, in % of the image
 * (x/y = top-left corner). The cinematic camera frames this box, so adjust it if
 * the hero image changes.
 */
export const overviewHud = {
  telemetry: 'CAM_01 // 35mm ANAMORPHIC // WIDE // 3 UNITS ON STAGE',
  coordinates: 'LOC: HANGAR-04 // ALL UNITS',
  optic: 'OPTIC: 35mm T1.5 CINE PRIME',
}

export const vehicles = [
  {
    id: 're',
    unit: '01',
    badge: 'UNIT // 01',
    shortName: 'RE CLASSIC 350',
    name: 'ROYAL ENFIELD CLASSIC 350',
    category: 'HERITAGE CRUISE // ANALOG CADENCE',
    colorway: 'REDDITCH RED // GLOSS BLACK & CHROME',
    hotspot: { x: 4, y: 38, w: 33, h: 46 },
    tilt: -1.2,
    hud: {
      telemetry: 'FOCAL_TARGET: UNIT_01 // LENS: 85mm T1.8',
      coordinates: 'LOC: 28.5355° N, 77.3910° E',
      optic: 'OPTIC: 85mm T1.8 PORTRAIT CINE',
    },
    stats: [
      { label: 'ENGINE ARCHITECTURE', main: '349 CC', sub: 'Air-Oil Cooled J-Series SOHC' },
      { label: 'PEAK OUTPUT', main: '20.2 BHP', sub: '@ 6,100 RPM', accent: true },
      { label: 'TORQUE CONTOUR', main: '27.0 NM', sub: '@ 4,000 RPM' },
      { label: 'CHASSIS CORE', main: 'TWIN DOWNTUBE', sub: 'Spine Frame with Stressed Engine' },
    ],
    features: [
      'Dual seat configuration wrapped in all-weather heavy-grain black upholstery',
      'Clean teardrop fuel tank in Redditch Red finish entirely without tank pads',
      'Dual-channel ABS with 300mm front & 270mm rear disc brake calibration',
      'Low-RPM counterbalanced crank producing trademark acoustic thumping rhythm',
      '5-speed constant mesh gearbox with wet multi-plate clutch assembly',
      'Classic rotary ignition dials with analog sweep speedometer and digital LCD trip',
    ],
    role: 'Soulful morning cruises, nostalgic mechanical meditation, and timeless industrial aesthetics. Built for sensory cadence rather than rush.',
    footnote: 'COLOR: REDDITCH RED // GLOSS BLACK & CHROME',
  },
  {
    id: 'honda',
    unit: '02',
    badge: 'UNIT // 02',
    shortName: 'DREAM YUGA 110',
    name: 'HONDA DREAM YUGA',
    category: 'URBAN WORKHORSE // UNBREAKABLE COMMUTE',
    colorway: 'GLOSS BLACK & RED GRAPHICS // 110CC',
    hotspot: { x: 36, y: 39, w: 30, h: 45 },
    tilt: 0.8,
    hud: {
      telemetry: 'FOCAL_TARGET: UNIT_02 // LENS: 50mm T1.4',
      coordinates: 'LOC: 19.0760° N, 72.8777° E',
      optic: 'OPTIC: 50mm T1.4 NATURAL PRIME',
    },
    stats: [
      { label: 'ENGINE ARCHITECTURE', main: '109.2 CC', sub: 'Air-Cooled 4-Stroke SI, HET' },
      { label: 'PEAK OUTPUT', main: '8.25 BHP', sub: '@ 7,500 RPM', accent: true },
      { label: 'TORQUE CONTOUR', main: '8.63 NM', sub: '@ 5,500 RPM' },
      { label: 'CHASSIS CORE', main: 'DIAMOND TYPE', sub: 'High-Tensile Tubular Steel' },
    ],
    features: [
      'Honda Eco Technology (HET) maximizing combustion chamber fuel atomization',
      'Sharp Radiant Red / Black dual-tone graphics with sleek aerodynamic bikini cowl',
      'Lightweight 18-inch 6-spoke alloy wheels with puncture-resistant tubeless tires',
      'Ultra-reliable primary kick + self start electric ignition motor',
      'Real-world verified 72+ kmpl fuel economy index for non-stop city commuting',
      'Longitudinal upright ergonomics designed for prolonged congested traffic transit',
    ],
    role: 'Daily grit, high-efficiency city navigation, and indestructible utilitarian stamina. The uncompromising backbone of daily transit.',
    footnote: 'COLOR: GLOSS BLACK & RED GRAPHICS // 110CC',
  },
  {
    id: 'ducati',
    unit: '03',
    badge: 'UNIT // 03',
    shortName: '2026 PANIGALE V2',
    name: 'DUCATI PANIGALE V2',
    category: 'BOLOGNA TRACK WEAPON // CIRCUIT DOMINANCE',
    colorway: 'DUCATI RED // 2026 MODEL',
    hotspot: { x: 64, y: 38, w: 31, h: 46 },
    tilt: 1.2,
    hud: {
      telemetry: 'FOCAL_TARGET: UNIT_03 // LENS: 100mm MACRO CINE',
      coordinates: 'LOC: 44.5165° N, 11.2708° E',
      optic: 'OPTIC: 100mm T2.0 TELEPHOTO PRIME',
    },
    stats: [
      { label: 'ENGINE ARCHITECTURE', main: '890 CC', sub: '90° V2 with variable intake valve timing' },
      { label: 'PEAK OUTPUT', main: '120 HP', sub: '@ 10,750 RPM', accent: true },
      { label: 'TORQUE CONTOUR', main: '93 NM', sub: '69 lb-ft @ 8,250 RPM' },
      { label: 'CHASSIS CORE', main: 'MONOCOQUE', sub: 'Aluminum · 179 kg wet, no fuel' },
    ],
    features: [
      'Aluminum monocoque chassis, with the 890 cc V2 engine ~10 kg lighter than the previous 955 cc unit',
      'Six-speed transmission with bidirectional quick shifter as standard',
      'Hydraulic multiplate wet assist-and-slipper clutch',
      'Electronic fuel injection with full ride-by-wire and one injector per cylinder',
      'Dual relocated under-tail mufflers in a 2-1-2 exhaust with catalytic converter',
      'No winglets: a clean fairing with the exhausts moved under the rear frame',
    ],
    role: 'Lighter, leaner and more focused: an approachable 120 hp sportbike that sits below the Panigale V4, built for track days and fast road riding.',
    footnote: 'EXHAUST: 2-1-2 UNDER-TAIL // SEAT HEIGHT: 837 MM // WET WEIGHT: 179 KG',
  },
]
