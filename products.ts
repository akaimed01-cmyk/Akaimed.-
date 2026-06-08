export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  brand: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  specifications: ProductSpec[];
  features: string[];
  pdfBrochure?: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "nicu",
    name: "NICU Equipment",
    description: "Neonatal Intensive Care Unit equipment for newborn care",
    icon: "🍼",
  },
  {
    id: "icu",
    name: "ICU Solutions",
    description: "Intensive Care Unit monitoring and life support systems",
    icon: "🏥",
  },
  {
    id: "operating-room",
    name: "Operating Room",
    description: "Surgical tables, lights and OR equipment",
    icon: "⚕️",
  },
  {
    id: "monitoring",
    name: "Patient Monitoring",
    description: "Advanced patient vital signs monitoring systems",
    icon: "📊",
  },
];

export const initialProducts: Product[] = [
  {
    id: "inf-inc-001",
    name: "Infant Incubator Pro",
    category: "NICU Equipment",
    categoryId: "nicu",
    brand: "Akai-Med",
    shortDescription: "Advanced closed infant incubator for premature and critically ill newborns.",
    description:
      "The Infant Incubator Pro is a state-of-the-art neonatal care system designed to provide a controlled environment for premature and critically ill newborns. Featuring precision temperature and humidity control, it ensures optimal conditions for neonatal recovery and growth.",
    image: "/images/nicu-incubator.jpg",
    gallery: ["/images/nicu-incubator.jpg"],
    specifications: [
      { label: "Temperature Range", value: "25°C – 37°C" },
      { label: "Humidity Control", value: "40% – 90% RH" },
      { label: "Oxygen Concentration", value: "21% – 65%" },
      { label: "Noise Level", value: "< 45 dB" },
      { label: "Display", value: "8-inch Color TFT" },
      { label: "Power Supply", value: "100–240V AC, 50/60Hz" },
    ],
    features: [
      "Servo-controlled temperature regulation",
      "Double-walled canopy for thermal insulation",
      "Integrated weighing system",
      "Phototherapy compatible",
      "Alarm system with visual and audible alerts",
      "Easy-access side ports",
    ],
    tags: ["nicu", "incubator", "neonatal", "newborn"],
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "inf-warm-001",
    name: "Radiant Infant Warmer",
    category: "NICU Equipment",
    categoryId: "nicu",
    brand: "Akai-Med",
    shortDescription: "Open-care radiant warmer for neonatal resuscitation and care.",
    description:
      "The Radiant Infant Warmer provides an open care environment with precise radiant heat for neonatal resuscitation and immediate newborn care. Its design allows full clinical access to the newborn while maintaining optimal thermal protection.",
    image: "/images/nicu-incubator.jpg",
    gallery: ["/images/nicu-incubator.jpg"],
    specifications: [
      { label: "Heating Mode", value: "Manual / Servo / Pre-warm" },
      { label: "Temperature Range", value: "25°C – 37°C (skin)" },
      { label: "Heater Power", value: "650W Ceramic IR" },
      { label: "Timer", value: "0–120 min" },
      { label: "Platform Size", value: "600 × 450 mm" },
      { label: "Power Supply", value: "220V AC, 50Hz" },
    ],
    features: [
      "Overhead radiant heat source",
      "Servo-skin temperature control",
      "Integrated resuscitation timer",
      "Adjustable canopy height",
      "Emergency manual mode",
      "X-ray permeable mattress",
    ],
    tags: ["nicu", "warmer", "radiant", "resuscitation"],
    featured: true,
    createdAt: "2024-01-20",
  },
  {
    id: "vent-001",
    name: "ICU Ventilator V5",
    category: "ICU Solutions",
    categoryId: "icu",
    brand: "Akai-Med",
    shortDescription: "High-performance ICU ventilator with advanced ventilation modes.",
    description:
      "The ICU Ventilator V5 is a sophisticated critical care ventilator offering comprehensive ventilation modes for adult and pediatric patients. Its intuitive touchscreen interface and advanced monitoring capabilities make it ideal for intensive care units.",
    image: "/images/ventilator.jpg",
    gallery: ["/images/ventilator.jpg"],
    specifications: [
      { label: "Tidal Volume", value: "20 – 2000 mL" },
      { label: "Respiratory Rate", value: "1 – 80 bpm" },
      { label: "FiO2", value: "21% – 100%" },
      { label: "PEEP Range", value: "0 – 30 cmH₂O" },
      { label: "Display", value: "12-inch Color Touch" },
      { label: "Battery Backup", value: "4 hours" },
    ],
    features: [
      "Volume Control Ventilation (VCV)",
      "Pressure Control Ventilation (PCV)",
      "SIMV, CPAP, BiPAP modes",
      "Automatic leak compensation",
      "Comprehensive waveform display",
      "Integrated O2 cell",
    ],
    tags: ["icu", "ventilator", "breathing", "critical care"],
    featured: true,
    createdAt: "2024-02-01",
  },
  {
    id: "mon-001",
    name: "Patient Monitor PM-12",
    category: "Patient Monitoring",
    categoryId: "monitoring",
    brand: "Akai-Med",
    shortDescription: "Multi-parameter patient monitor for ICU and general ward.",
    description:
      "The Patient Monitor PM-12 is a versatile multi-parameter monitoring solution suitable for ICU, emergency, and general ward environments. It offers real-time monitoring of all vital signs with a large, clear display and comprehensive alarm management.",
    image: "/images/patient-monitor.jpg",
    gallery: ["/images/patient-monitor.jpg"],
    specifications: [
      { label: "Display", value: "15.6-inch TFT Color LCD" },
      { label: "Parameters", value: "ECG, SpO2, NIBP, Temp, RR, EtCO2" },
      { label: "ECG Leads", value: "3/5/12 leads" },
      { label: "Memory", value: "72 hours waveform storage" },
      { label: "Connectivity", value: "Wi-Fi, Ethernet, USB" },
      { label: "Battery", value: "Li-ion, 6+ hours" },
    ],
    features: [
      "12-lead ECG analysis",
      "ST segment analysis",
      "Arrhythmia detection",
      "Nurse call integration",
      "Central monitoring system compatible",
      "Drug dose calculator",
    ],
    tags: ["monitoring", "patient monitor", "ecg", "vital signs"],
    featured: true,
    createdAt: "2024-02-10",
  },
  {
    id: "surg-table-001",
    name: "Electric Surgical Table ST-100",
    category: "Operating Room",
    categoryId: "operating-room",
    brand: "Akai-Med",
    shortDescription: "Fully electric modular surgical table for all surgical disciplines.",
    description:
      "The Electric Surgical Table ST-100 is a premium, fully electric modular operating table designed to meet the requirements of all surgical disciplines. Its advanced electro-hydraulic system enables precise positioning with smooth, quiet operation.",
    image: "/images/surgical-table.jpg",
    gallery: ["/images/surgical-table.jpg"],
    specifications: [
      { label: "Load Capacity", value: "300 kg" },
      { label: "Table Length", value: "1950 – 2100 mm (adj.)" },
      { label: "Table Width", value: "500 mm" },
      { label: "Height Range", value: "620 – 960 mm" },
      { label: "Trendelenburg", value: "± 30°" },
      { label: "Lateral Tilt", value: "± 20°" },
    ],
    features: [
      "Electro-hydraulic operation",
      "Carbon fiber table top (X-ray permeable)",
      "Wireless remote control",
      "Modular interchangeable sections",
      "Battery backup for positioning",
      "Anti-static surface",
    ],
    tags: ["operating room", "surgical table", "surgery", "OR"],
    featured: true,
    createdAt: "2024-02-15",
  },
  {
    id: "surg-light-001",
    name: "LED Surgical Light SL-200",
    category: "Operating Room",
    categoryId: "operating-room",
    brand: "Akai-Med",
    shortDescription: "Advanced LED surgical light with shadow-free illumination.",
    description:
      "The LED Surgical Light SL-200 delivers exceptional shadow-free illumination for all surgical procedures. With its advanced multi-LED array and precise color rendering, it provides consistent, fatigue-free lighting for surgical teams.",
    image: "/images/surgical-light.jpg",
    gallery: ["/images/surgical-light.jpg"],
    specifications: [
      { label: "Illuminance", value: "160,000 lux (center)" },
      { label: "Color Temperature", value: "3,500 – 5,000 K (adj.)" },
      { label: "CRI", value: "> 95" },
      { label: "LED Lifespan", value: "> 50,000 hours" },
      { label: "Field Diameter", value: "180 – 345 mm" },
      { label: "Depth of Illumination", value: "700 – 1400 mm" },
    ],
    features: [
      "Shadow-free LED array technology",
      "Adjustable color temperature",
      "Touch-free handle sterilizable",
      "Integrated camera option",
      "Emergency power supply",
      "360° rotation capability",
    ],
    tags: ["operating room", "surgical light", "LED", "OR lighting"],
    featured: false,
    createdAt: "2024-03-01",
  },
];
