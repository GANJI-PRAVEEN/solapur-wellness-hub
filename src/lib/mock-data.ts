export const WARDS = [
  "Ward 1 - Akkalkot Road", "Ward 2 - Vijapur Road", "Ward 3 - Hotgi Road",
  "Ward 4 - Jule Solapur", "Ward 5 - Degaon", "Ward 6 - Kumatha Nagar",
  "Ward 7 - Murarji Peth", "Ward 8 - Budhwar Peth", "Ward 9 - Saat Rasta",
  "Ward 10 - Sakhar Peth"
];

export const SPECIALTIES = [
  "General Medicine", "Pediatrics", "Orthopedics", "Gynecology", "Dermatology",
  "ENT", "Ophthalmology", "Cardiology", "Neurology", "Dentistry"
];

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  ward: string;
  available: boolean;
  slots: string[];
  rating: number;
  experience: number;
}

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Anand Kulkarni", specialty: "General Medicine", hospital: "SMC Civil Hospital", ward: "Ward 1 - Akkalkot Road", available: true, slots: ["09:00", "10:00", "11:00", "14:00", "15:00"], rating: 4.5, experience: 15 },
  { id: "d2", name: "Dr. Meena Patil", specialty: "Pediatrics", hospital: "Siddheshwar Hospital", ward: "Ward 3 - Hotgi Road", available: true, slots: ["10:00", "11:00", "16:00"], rating: 4.8, experience: 12 },
  { id: "d3", name: "Dr. Suresh Jagtap", specialty: "Orthopedics", hospital: "SMC Civil Hospital", ward: "Ward 1 - Akkalkot Road", available: true, slots: ["09:00", "10:00", "14:00"], rating: 4.2, experience: 20 },
  { id: "d4", name: "Dr. Sunita Deshpande", specialty: "Gynecology", hospital: "Maternity Home Ward 5", ward: "Ward 5 - Degaon", available: true, slots: ["09:00", "11:00", "15:00", "16:00"], rating: 4.7, experience: 18 },
  { id: "d5", name: "Dr. Rahul Bhosle", specialty: "Dermatology", hospital: "SMC Dispensary Kumatha", ward: "Ward 6 - Kumatha Nagar", available: false, slots: [], rating: 4.0, experience: 8 },
  { id: "d6", name: "Dr. Kavita Mane", specialty: "ENT", hospital: "District Hospital Solapur", ward: "Ward 9 - Saat Rasta", available: true, slots: ["10:00", "11:00", "14:00"], rating: 4.4, experience: 10 },
  { id: "d7", name: "Dr. Avinash Gaikwad", specialty: "Cardiology", hospital: "SMC Civil Hospital", ward: "Ward 1 - Akkalkot Road", available: true, slots: ["09:00", "10:00"], rating: 4.9, experience: 25 },
  { id: "d8", name: "Dr. Priya Ingale", specialty: "General Medicine", hospital: "PHC Jule Solapur", ward: "Ward 4 - Jule Solapur", available: true, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"], rating: 4.3, experience: 6 },
];

export interface Hospital {
  id: string;
  name: string;
  ward: string;
  beds: { type: string; total: number; available: number }[];
  machinery: { name: string; available: boolean; waitTime?: string }[];
}

export const HOSPITALS: Hospital[] = [
  {
    id: "h1", name: "SMC Civil Hospital", ward: "Ward 1 - Akkalkot Road",
    beds: [
      { type: "General", total: 120, available: 34 },
      { type: "ICU", total: 20, available: 3 },
      { type: "Pediatric", total: 30, available: 12 },
      { type: "Maternity", total: 25, available: 8 },
    ],
    machinery: [
      { name: "X-Ray", available: true },
      { name: "CT Scan", available: true, waitTime: "30 min" },
      { name: "MRI", available: false, waitTime: "2 hours" },
      { name: "Ultrasound", available: true },
      { name: "Ventilator", available: true },
    ],
  },
  {
    id: "h2", name: "Siddheshwar Hospital", ward: "Ward 3 - Hotgi Road",
    beds: [
      { type: "General", total: 80, available: 22 },
      { type: "ICU", total: 10, available: 1 },
      { type: "Pediatric", total: 20, available: 6 },
    ],
    machinery: [
      { name: "X-Ray", available: true },
      { name: "Ultrasound", available: true },
      { name: "ECG", available: true },
    ],
  },
  {
    id: "h3", name: "District Hospital Solapur", ward: "Ward 9 - Saat Rasta",
    beds: [
      { type: "General", total: 200, available: 45 },
      { type: "ICU", total: 30, available: 5 },
      { type: "Pediatric", total: 40, available: 15 },
      { type: "Maternity", total: 35, available: 10 },
    ],
    machinery: [
      { name: "X-Ray", available: true },
      { name: "CT Scan", available: true },
      { name: "MRI", available: true, waitTime: "1 hour" },
      { name: "Ultrasound", available: true },
      { name: "Lab (Blood/Urine)", available: true },
    ],
  },
];

export interface Medicine {
  id: string;
  name: string;
  dispensary: string;
  ward: string;
  stock: number;
  unit: string;
}

export const MEDICINES: Medicine[] = [
  { id: "m1", name: "Paracetamol 500mg", dispensary: "SMC Civil Hospital Pharmacy", ward: "Ward 1", stock: 2400, unit: "tablets" },
  { id: "m2", name: "Amoxicillin 250mg", dispensary: "SMC Dispensary Kumatha", ward: "Ward 6", stock: 800, unit: "capsules" },
  { id: "m3", name: "ORS Packets", dispensary: "PHC Jule Solapur", ward: "Ward 4", stock: 340, unit: "packets" },
  { id: "m4", name: "Metformin 500mg", dispensary: "District Hospital Pharmacy", ward: "Ward 9", stock: 1200, unit: "tablets" },
  { id: "m5", name: "Cetirizine 10mg", dispensary: "SMC Civil Hospital Pharmacy", ward: "Ward 1", stock: 600, unit: "tablets" },
  { id: "m6", name: "Iron + Folic Acid", dispensary: "Maternity Home Ward 5", ward: "Ward 5", stock: 1800, unit: "tablets" },
  { id: "m7", name: "Azithromycin 500mg", dispensary: "Siddheshwar Hospital", ward: "Ward 3", stock: 150, unit: "tablets" },
  { id: "m8", name: "Insulin (Vial)", dispensary: "District Hospital Pharmacy", ward: "Ward 9", stock: 45, unit: "vials" },
];

export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: "vaccination" | "screening" | "awareness" | "drive";
  date: string;
  endDate?: string;
  time: string;
  location: string;
  ward: string;
  eligibility: string;
  registrations: number;
  capacity: number;
  status: "upcoming" | "ongoing" | "completed";
}

export const CAMPAIGNS: Campaign[] = [
  { id: "c1", title: "Pulse Polio Immunization Drive", description: "Free polio drops for children aged 0-5 years", type: "vaccination", date: "2026-03-28", time: "08:00 AM - 05:00 PM", location: "All SMC Health Centers", ward: "All Wards", eligibility: "Children 0-5 years", registrations: 1245, capacity: 5000, status: "upcoming" },
  { id: "c2", title: "Dengue Awareness & Fogging Campaign", description: "Ward-wise fogging and awareness on dengue prevention", type: "awareness", date: "2026-03-22", endDate: "2026-03-29", time: "06:00 AM - 10:00 AM", location: "Ward 3, 4, 5 areas", ward: "Ward 3 - Hotgi Road", eligibility: "All residents", registrations: 320, capacity: 2000, status: "ongoing" },
  { id: "c3", title: "Free Diabetes Screening Camp", description: "Blood sugar testing, HbA1c, diet counseling", type: "screening", date: "2026-04-05", time: "09:00 AM - 03:00 PM", location: "SMC Civil Hospital", ward: "Ward 1 - Akkalkot Road", eligibility: "Adults 30+ years", registrations: 189, capacity: 500, status: "upcoming" },
  { id: "c4", title: "COVID-19 Booster Dose Camp", description: "Free booster dose for eligible citizens", type: "vaccination", date: "2026-03-15", time: "09:00 AM - 04:00 PM", location: "District Hospital", ward: "Ward 9 - Saat Rasta", eligibility: "Adults 18+ (6 months after last dose)", registrations: 876, capacity: 1000, status: "completed" },
  { id: "c5", title: "Anemia Detection Drive – Women & Girls", description: "Free hemoglobin testing and iron supplement distribution", type: "drive", date: "2026-04-10", time: "10:00 AM - 02:00 PM", location: "Maternity Home Ward 5", ward: "Ward 5 - Degaon", eligibility: "Women & girls aged 12+", registrations: 94, capacity: 300, status: "upcoming" },
];

export interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  wards: string[];
  date: string;
  precautions: string[];
}

export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: "a1", title: "Dengue Cases Rising – Ward 3, 4, 5",
    description: "42 new dengue cases reported this week. Fogging underway. Citizens advised to take precautions.",
    severity: "high", wards: ["Ward 3 - Hotgi Road", "Ward 4 - Jule Solapur", "Ward 5 - Degaon"],
    date: "2026-03-20",
    precautions: ["Use mosquito nets and repellents", "Remove stagnant water around home", "Wear full-sleeve clothing", "Report fever with body ache immediately to nearest PHC"],
  },
  {
    id: "a2", title: "Gastroenteritis Outbreak – Ward 8",
    description: "15 cases of acute gastroenteritis linked to contaminated water supply in Budhwar Peth area.",
    severity: "high", wards: ["Ward 8 - Budhwar Peth"],
    date: "2026-03-19",
    precautions: ["Boil drinking water before use", "Avoid street food temporarily", "Use ORS if experiencing diarrhea", "Visit nearest SMC dispensary for free treatment"],
  },
  {
    id: "a3", title: "Air Quality Advisory – Moderate",
    description: "AQI levels elevated due to construction activity near Vijapur Road. Sensitive groups should limit outdoor exposure.",
    severity: "medium", wards: ["Ward 2 - Vijapur Road", "Ward 1 - Akkalkot Road"],
    date: "2026-03-21",
    precautions: ["Use N95 masks outdoors", "Keep windows closed during peak hours", "Avoid strenuous outdoor exercise"],
  },
];

export interface DailyReport {
  id: string;
  date: string;
  ward: string;
  disease: string;
  cases: number;
  deaths: number;
  recovered: number;
  reportedBy: string;
}

export const DAILY_REPORTS: DailyReport[] = Array.from({ length: 50 }, (_, i) => ({
  id: `r${i + 1}`,
  date: new Date(2026, 2, Math.floor(Math.random() * 21) + 1).toISOString().split("T")[0],
  ward: WARDS[Math.floor(Math.random() * WARDS.length)],
  disease: ["Dengue", "Malaria", "Typhoid", "Gastroenteritis", "COVID-19", "Tuberculosis", "Chikungunya", "Influenza"][Math.floor(Math.random() * 8)],
  cases: Math.floor(Math.random() * 20) + 1,
  deaths: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0,
  recovered: Math.floor(Math.random() * 15),
  reportedBy: ["Sunita Jadhav (ASHA)", "Rekha Thorat (ANM)", "Vijay Kale (Data Entry)", "Lakshmi Pawar (ASHA)"][Math.floor(Math.random() * 4)],
}));
