// Geographic coordinates for Solapur wards, hospitals, and outbreak hotspots

export const SOLAPUR_CENTER: [number, number] = [17.6599, 75.9064];

export interface WardGeo {
  name: string;
  shortName: string;
  center: [number, number];
  // Simplified polygon boundary (lat/lng pairs)
  boundary: [number, number][];
}

export const WARD_GEO: WardGeo[] = [
  {
    name: "Ward 1 - Akkalkot Road",
    shortName: "W1",
    center: [17.6750, 75.9250],
    boundary: [
      [17.6800, 75.9150], [17.6820, 75.9350],
      [17.6700, 75.9380], [17.6680, 75.9170],
    ],
  },
  {
    name: "Ward 2 - Vijapur Road",
    shortName: "W2",
    center: [17.6680, 75.8850],
    boundary: [
      [17.6730, 75.8750], [17.6750, 75.8960],
      [17.6630, 75.8970], [17.6610, 75.8770],
    ],
  },
  {
    name: "Ward 3 - Hotgi Road",
    shortName: "W3",
    center: [17.6480, 75.9200],
    boundary: [
      [17.6540, 75.9100], [17.6560, 75.9310],
      [17.6430, 75.9330], [17.6410, 75.9120],
    ],
  },
  {
    name: "Ward 4 - Jule Solapur",
    shortName: "W4",
    center: [17.6550, 75.8700],
    boundary: [
      [17.6610, 75.8600], [17.6630, 75.8810],
      [17.6490, 75.8830], [17.6470, 75.8620],
    ],
  },
  {
    name: "Ward 5 - Degaon",
    shortName: "W5",
    center: [17.6850, 75.8950],
    boundary: [
      [17.6910, 75.8850], [17.6920, 75.9060],
      [17.6790, 75.9070], [17.6780, 75.8870],
    ],
  },
  {
    name: "Ward 6 - Kumatha Nagar",
    shortName: "W6",
    center: [17.6420, 75.8900],
    boundary: [
      [17.6480, 75.8800], [17.6500, 75.9010],
      [17.6370, 75.9020], [17.6350, 75.8820],
    ],
  },
  {
    name: "Ward 7 - Murarji Peth",
    shortName: "W7",
    center: [17.6620, 75.9100],
    boundary: [
      [17.6670, 75.9010], [17.6690, 75.9200],
      [17.6570, 75.9220], [17.6550, 75.9030],
    ],
  },
  {
    name: "Ward 8 - Budhwar Peth",
    shortName: "W8",
    center: [17.6580, 75.9050],
    boundary: [
      [17.6630, 75.8960], [17.6640, 75.9140],
      [17.6530, 75.9160], [17.6520, 75.8980],
    ],
  },
  {
    name: "Ward 9 - Saat Rasta",
    shortName: "W9",
    center: [17.6700, 75.9050],
    boundary: [
      [17.6750, 75.8960], [17.6770, 75.9150],
      [17.6650, 75.9170], [17.6630, 75.8980],
    ],
  },
  {
    name: "Ward 10 - Sakhar Peth",
    shortName: "W10",
    center: [17.6530, 75.9150],
    boundary: [
      [17.6580, 75.9060], [17.6600, 75.9250],
      [17.6480, 75.9270], [17.6460, 75.9080],
    ],
  },
];

export interface HospitalGeo {
  id: string;
  name: string;
  ward: string;
  coords: [number, number];
  beds: number;
  availableBeds: number;
}

export const HOSPITAL_GEO: HospitalGeo[] = [
  { id: "h1", name: "SMC Civil Hospital", ward: "Ward 1", coords: [17.6760, 75.9270], beds: 195, availableBeds: 57 },
  { id: "h2", name: "Siddheshwar Hospital", ward: "Ward 3", coords: [17.6490, 75.9220], beds: 110, availableBeds: 29 },
  { id: "h3", name: "District Hospital Solapur", ward: "Ward 9", coords: [17.6710, 75.9070], beds: 305, availableBeds: 75 },
  { id: "h4", name: "PHC Jule Solapur", ward: "Ward 4", coords: [17.6560, 75.8720], beds: 30, availableBeds: 14 },
  { id: "h5", name: "Maternity Home Ward 5", ward: "Ward 5", coords: [17.6860, 75.8970], beds: 40, availableBeds: 18 },
  { id: "h6", name: "SMC Dispensary Kumatha", ward: "Ward 6", coords: [17.6430, 75.8920], beds: 15, availableBeds: 8 },
];

export interface OutbreakHotspot {
  id: string;
  disease: string;
  ward: string;
  coords: [number, number];
  cases: number;
  riskLevel: "critical" | "high" | "moderate" | "low";
  radius: number; // meters
}

// Generated dynamically from report data — these are sample hotspots
export const OUTBREAK_HOTSPOTS: OutbreakHotspot[] = [
  { id: "ob1", disease: "Dengue", ward: "W1", coords: [17.6740, 75.9240], cases: 42, riskLevel: "critical", radius: 600 },
  { id: "ob2", disease: "Malaria", ward: "W3", coords: [17.6470, 75.9180], cases: 28, riskLevel: "high", radius: 500 },
  { id: "ob3", disease: "Gastroenteritis", ward: "W7", coords: [17.6610, 75.9090], cases: 35, riskLevel: "high", radius: 450 },
  { id: "ob4", disease: "Typhoid", ward: "W4", coords: [17.6540, 75.8690], cases: 18, riskLevel: "moderate", radius: 350 },
  { id: "ob5", disease: "COVID-19", ward: "W9", coords: [17.6690, 75.9040], cases: 12, riskLevel: "moderate", radius: 400 },
  { id: "ob6", disease: "Chikungunya", ward: "W6", coords: [17.6410, 75.8890], cases: 8, riskLevel: "low", radius: 250 },
  { id: "ob7", disease: "Dengue", ward: "W5", coords: [17.6840, 75.8940], cases: 22, riskLevel: "high", radius: 500 },
  { id: "ob8", disease: "Influenza", ward: "W10", coords: [17.6520, 75.9140], cases: 6, riskLevel: "low", radius: 200 },
];

export const RISK_COLORS: Record<string, string> = {
  critical: "#dc2626",
  high: "#ea580c",
  moderate: "#2563eb",
  low: "#6b7280",
};
