// ─── TYPES ────────────────────────────────────────────────────────────────────

export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";
export type VehicleStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE";
export type TripStatus =
  | "SCHEDULED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type TripType = "IN" | "OUT";
export type MaintenanceType =
  | "oil-change"
  | "inspection"
  | "repair"
  | "service"
  | "tire-replacement"
  | "brake-service";
export type UserRole = "DRIVER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: DriverStatus;
  vehicle?: string;
  totalTrips: number;
  totalKm: number;
  rating: number;
  department?: string;
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  DRIVER?: string;
  capacity: number;
  kmUsage: number;
  status: VehicleStatus;
  lastMaintenance: string;
  monthlyRent: number;
  salik: number;
  owner?: string;
}

export interface Trip {
  id: string;
  date: string;
  time: string;
  agency: string;
  hotel: string;
  destination: string;
  DRIVER: string;
  vehicle: string;
  pax: number;
  kmStart: number;
  kmEnd: number;
  status: TripStatus;
  type: TripType;
  notes?: string;
}

export interface Agency {
  id: string;
  name: string;
  contact: string;
  phone: string;
  totalTrips: number;
  totalPax: number;
  revenue: number;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  phone: string;
  totalTrips: number;
  totalPax: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: MaintenanceType;
  cost: number;
  description: string;
  notes?: string;
  nextDueDate?: string;
}

export interface TripImage {
  id: string;
  tripId: string;
  url: string;
  caption?: string;
  uploadedAt: string;
  type: "before" | "after" | "during" | "documentation";
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  assignedVehicle?: string;
  avatar?: string;
  department?: string;
  createdAt: string;
  lastLogin: string;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

export const drivers: Driver[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    phone: "+212 6 12 34 56 78",
    email: "ahmed@transithub.com",
    status: "AVAILABLE",
    vehicle: "HY-2025-A",
    totalTrips: 156,
    totalKm: 4200,
    rating: 4.8,
    department: "Operations",
  },
  {
    id: "2",
    name: "Fatima Zahra",
    phone: "+212 6 98 76 54 32",
    email: "fatima@transithub.com",
    status: "ON_TRIP",
    vehicle: "MB-2024-B",
    totalTrips: 142,
    totalKm: 3850,
    rating: 4.9,
    department: "Operations",
  },
  {
    id: "3",
    name: "Mohammed Ali",
    phone: "+212 6 11 22 33 44",
    email: "mohammed@transithub.com",
    status: "OFF_DUTY",
    totalTrips: 168,
    totalKm: 4500,
    rating: 4.7,
    department: "Operations",
  },
  {
    id: "4",
    name: "Karim Benali",
    phone: "+212 6 55 66 77 88",
    email: "karim@transithub.com",
    status: "AVAILABLE",
    vehicle: "TY-2024-C",
    totalTrips: 98,
    totalKm: 2600,
    rating: 4.6,
    department: "Fleet",
  },
  {
    id: "5",
    name: "Youssef Alaoui",
    phone: "+212 6 33 44 55 66",
    email: "youssef@transithub.com",
    status: "OFF_DUTY",
    totalTrips: 45,
    totalKm: 1200,
    rating: 4.3,
    department: "Operations",
  },
];

export const vehicles: Vehicle[] = [
  {
    id: "1",
    model: "Hyundai Starex",
    plate: "HY-2025-A",
    DRIVER: "Ahmed Hassan",
    capacity: 8,
    kmUsage: 4200,
    status: "AVAILABLE",
    lastMaintenance: "2026-02-15",
    monthlyRent: 6200,
    salik: 1850,
    owner: "MUZA RENT",
  },
  {
    id: "2",
    model: "Mercedes V-Class",
    plate: "MB-2024-B",
    DRIVER: "Fatima Zahra",
    capacity: 7,
    kmUsage: 3850,
    status: "IN_USE",
    lastMaintenance: "2026-02-01",
    monthlyRent: 7200,
    salik: 2032,
    owner: "AJAB RENT",
  },
  {
    id: "3",
    model: "Hyundai Starex",
    plate: "HY-2023-C",
    capacity: 8,
    kmUsage: 5100,
    status: "MAINTENANCE",
    lastMaintenance: "2026-02-10",
    monthlyRent: 6200,
    salik: 1980,
    owner: "NASCITA",
  },
  {
    id: "4",
    model: "Toyota Yaris",
    plate: "TY-2024-C",
    DRIVER: "Karim Benali",
    capacity: 4,
    kmUsage: 2600,
    status: "AVAILABLE",
    lastMaintenance: "2026-02-05",
    monthlyRent: 1500,
    salik: 1110,
    owner: "ADNAN RENT",
  },
  {
    id: "5",
    model: "KIA Carnival",
    plate: "KA-2025-D",
    capacity: 7,
    kmUsage: 1800,
    status: "AVAILABLE",
    lastMaintenance: "2026-02-08",
    monthlyRent: 6750,
    salik: 2200,
    owner: "SPRING RENT",
  },
];

export const trips: Trip[] = [
  {
    id: "1",
    date: "2026-02-19",
    time: "08:00",
    agency: "Maroc Tours",
    hotel: "Riad Marrakech",
    destination: "Atlas Mountains",
    DRIVER: "Ahmed Hassan",
    vehicle: "HY-2025-A",
    pax: 6,
    kmStart: 4200,
    kmEnd: 4250,
    status: "COMPLETED",
    type: "OUT",
  },
  {
    id: "2",
    date: "2026-02-19",
    time: "10:30",
    agency: "Desert Dreams",
    hotel: "Hotel Atlas",
    destination: "Sahara Desert",
    DRIVER: "Fatima Zahra",
    vehicle: "MB-2024-B",
    pax: 5,
    kmStart: 3850,
    kmEnd: 3920,
    status: "IN_PROGRESS",
    type: "IN",
  },
  {
    id: "3",
    date: "2026-02-19",
    time: "14:00",
    agency: "City Guides",
    hotel: "Grand Hotel",
    destination: "Medina Tour",
    DRIVER: "Mohammed Ali",
    vehicle: "HY-2023-C",
    pax: 8,
    kmStart: 5100,
    kmEnd: 5120,
    status: "SCHEDULED",
    type: "OUT",
  },
  {
    id: "4",
    date: "2026-02-20",
    time: "09:00",
    agency: "Maroc Tours",
    hotel: "Riad Fes",
    destination: "Fes Medina",
    DRIVER: "Ahmed Hassan",
    vehicle: "HY-2025-A",
    pax: 4,
    kmStart: 4250,
    kmEnd: 4310,
    status: "SCHEDULED",
    type: "OUT",
  },
  {
    id: "5",
    date: "2026-02-20",
    time: "11:00",
    agency: "Desert Dreams",
    hotel: "Palais Namaskar",
    destination: "Ourika Valley",
    DRIVER: "Karim Benali",
    vehicle: "TY-2024-C",
    pax: 3,
    kmStart: 2600,
    kmEnd: 2680,
    status: "ASSIGNED",
    type: "IN",
  },
  {
    id: "6",
    date: "2026-02-18",
    time: "08:00",
    agency: "City Guides",
    hotel: "Hotel Mamounia",
    destination: "Agafay Desert",
    DRIVER: "Fatima Zahra",
    vehicle: "MB-2024-B",
    pax: 6,
    kmStart: 3780,
    kmEnd: 3850,
    status: "COMPLETED",
    type: "OUT",
  },
  {
    id: "7",
    date: "2026-02-18",
    time: "15:00",
    agency: "Maroc Tours",
    hotel: "Riad Kniza",
    destination: "Essaouira Day",
    DRIVER: "Mohammed Ali",
    vehicle: "HY-2023-C",
    pax: 7,
    kmStart: 5020,
    kmEnd: 5100,
    status: "COMPLETED",
    type: "IN",
  },
  {
    id: "8",
    date: "2026-02-17",
    time: "09:30",
    agency: "City Guides",
    hotel: "Sofitel Marrakech",
    destination: "Ouzoud Falls",
    DRIVER: "Ahmed Hassan",
    vehicle: "HY-2025-A",
    pax: 5,
    kmStart: 4120,
    kmEnd: 4200,
    status: "COMPLETED",
    type: "OUT",
  },
  {
    id: "9",
    date: "2026-02-17",
    time: "14:00",
    agency: "Desert Dreams",
    hotel: "La Mamounia",
    destination: "Toubkal Trek",
    DRIVER: "Karim Benali",
    vehicle: "TY-2024-C",
    pax: 2,
    kmStart: 2520,
    kmEnd: 2600,
    status: "COMPLETED",
    type: "OUT",
  },
];

export const agencies: Agency[] = [
  {
    id: "1",
    name: "Maroc Tours",
    contact: "Hassan El Alaoui",
    phone: "+212 5 24 12 34 56",
    totalTrips: 234,
    totalPax: 1560,
    revenue: 18500,
  },
  {
    id: "2",
    name: "Desert Dreams",
    contact: "Karim Benabdessalem",
    phone: "+212 5 24 98 76 54",
    totalTrips: 156,
    totalPax: 980,
    revenue: 12400,
  },
  {
    id: "3",
    name: "City Guides",
    contact: "Zainab Khilani",
    phone: "+212 5 24 55 66 77",
    totalTrips: 189,
    totalPax: 1134,
    revenue: 14200,
  },
];

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "Riad Marrakech",
    address: "Medina, Marrakech",
    phone: "+212 5 24 11 22 33",
    totalTrips: 145,
    totalPax: 920,
  },
  {
    id: "2",
    name: "Hotel Atlas",
    address: "Gueliz, Marrakech",
    phone: "+212 5 24 44 55 66",
    totalTrips: 120,
    totalPax: 750,
  },
  {
    id: "3",
    name: "Grand Hotel",
    address: "Downtown, Marrakech",
    phone: "+212 5 24 77 88 99",
    totalTrips: 98,
    totalPax: 620,
  },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "M1",
    vehicleId: "1",
    date: "2026-02-15",
    type: "oil-change",
    cost: 250,
    description: "Oil and filter change",
    notes: "Used synthetic oil",
    nextDueDate: "2026-05-15",
  },
  {
    id: "M2",
    vehicleId: "1",
    date: "2026-01-20",
    type: "inspection",
    cost: 150,
    description: "Regular safety inspection",
    notes: "All checks passed",
  },
  {
    id: "M3",
    vehicleId: "1",
    date: "2025-12-10",
    type: "tire-replacement",
    cost: 1200,
    description: "All 4 tires replaced",
    notes: "Michelin Agilis tires",
  },
  {
    id: "M4",
    vehicleId: "2",
    date: "2026-02-10",
    type: "service",
    cost: 450,
    description: "General vehicle service",
    notes: "Filter replacements and fluid checks",
    nextDueDate: "2026-05-10",
  },
  {
    id: "M5",
    vehicleId: "2",
    date: "2026-01-15",
    type: "brake-service",
    cost: 800,
    description: "Brake pads and rotor replacement",
    notes: "Front and rear brakes serviced",
  },
  {
    id: "M6",
    vehicleId: "2",
    date: "2025-11-20",
    type: "repair",
    cost: 550,
    description: "AC system repair",
    notes: "Refrigerant refill and compressor check",
  },
  {
    id: "M7",
    vehicleId: "3",
    date: "2026-02-01",
    type: "inspection",
    cost: 150,
    description: "Pre-trip safety check",
    notes: "All systems functional",
  },
  {
    id: "M8",
    vehicleId: "3",
    date: "2025-12-20",
    type: "oil-change",
    cost: 250,
    description: "Oil and filter change",
    notes: "Standard MAINTENANCE",
    nextDueDate: "2026-03-20",
  },
  {
    id: "M9",
    vehicleId: "4",
    date: "2026-02-05",
    type: "service",
    cost: 400,
    description: "Routine MAINTENANCE service",
    notes: "Filter changes and fluid top-ups",
    nextDueDate: "2026-05-05",
  },
  {
    id: "M10",
    vehicleId: "4",
    date: "2025-10-15",
    type: "repair",
    cost: 600,
    description: "Transmission fluid service",
    notes: "Fluid drained and replaced",
  },
  {
    id: "M11",
    vehicleId: "5",
    date: "2026-02-08",
    type: "inspection",
    cost: 150,
    description: "Regular inspection",
    notes: "Passed all safety checks",
  },
  {
    id: "M12",
    vehicleId: "5",
    date: "2025-12-01",
    type: "tire-replacement",
    cost: 1000,
    description: "Front tire replacement",
    notes: "Bridgestone tires installed",
  },
];

export const tripImages: TripImage[] = [
  {
    id: "ti1",
    tripId: "1",
    url: "/images/trip-before-1.jpg",
    caption: "Vehicle condition at start of trip",
    uploadedAt: "2026-02-19 08:00",
    type: "before",
  },
  {
    id: "ti2",
    tripId: "1",
    url: "/images/trip-after-1.jpg",
    caption: "Vehicle condition at end of trip",
    uploadedAt: "2026-02-19 12:30",
    type: "after",
  },
  {
    id: "ti3",
    tripId: "2",
    url: "/images/trip-before-2.jpg",
    caption: "Pre-trip inspection photo",
    uploadedAt: "2026-02-19 06:15",
    type: "before",
  },
  {
    id: "ti4",
    tripId: "2",
    url: "/images/trip-documentation-1.jpg",
    caption: "Passenger manifest documentation",
    uploadedAt: "2026-02-19 07:45",
    type: "documentation",
  },
];

export const users: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "ADMIN@transithub.com",
    password: "password123",
    phone: "+1-555-0101",
    role: "ADMIN",
    status: "ACTIVE",
    department: "Operations",
    createdAt: "2025-01-15",
    lastLogin: "2026-02-21",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "superadmin@transithub.com",
    password: "password123",
    phone: "+1-555-0102",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    department: "Management",
    createdAt: "2024-01-01",
    lastLogin: "2026-02-21",
  },
  {
    id: "3",
    name: "David Wilson",
    email: "MANAGER@transithub.com",
    password: "password123",
    phone: "+1-555-0103",
    role: "MANAGER",
    status: "ACTIVE",
    department: "Operations",
    createdAt: "2025-03-10",
    lastLogin: "2026-02-20",
  },
  {
    id: "4",
    name: "Ahmed Hassan",
    email: "driver1@transithub.com",
    password: "password123",
    phone: "+212 6 12 34 56 78",
    role: "DRIVER",
    status: "ACTIVE",
    assignedVehicle: "HY-2025-A",
    createdAt: "2024-06-01",
    lastLogin: "2026-02-19",
  },
  {
    id: "5",
    name: "Fatima Zahra",
    email: "driver2@transithub.com",
    password: "password123",
    phone: "+212 6 98 76 54 32",
    role: "DRIVER",
    status: "ACTIVE",
    assignedVehicle: "MB-2024-B",
    createdAt: "2024-07-12",
    lastLogin: "2026-02-19",
  },
  {
    id: "6",
    name: "Mohammed Ali",
    email: "driver3@transithub.com",
    password: "password123",
    phone: "+212 6 11 22 33 44",
    role: "DRIVER",
    status: "ACTIVE",
    createdAt: "2024-08-20",
    lastLogin: "2026-02-18",
  },
  {
    id: "7",
    name: "Karim Benali",
    email: "driver4@transithub.com",
    password: "password123",
    phone: "+212 6 55 66 77 88",
    role: "DRIVER",
    status: "ACTIVE",
    assignedVehicle: "TY-2024-C",
    createdAt: "2024-09-01",
    lastLogin: "2026-02-17",
  },
  {
    id: "8",
    name: "Leila Moroccan",
    email: "manager2@transithub.com",
    password: "password123",
    phone: "+212 6 22 33 44 55",
    role: "MANAGER",
    status: "ACTIVE",
    department: "Fleet Management",
    createdAt: "2025-02-01",
    lastLogin: "2026-02-21",
  },
  {
    id: "9",
    name: "Hassan Boudiab",
    email: "admin2@transithub.com",
    password: "password123",
    phone: "+212 6 77 88 99 00",
    role: "ADMIN",
    status: "ACTIVE",
    department: "Administration",
    createdAt: "2025-01-20",
    lastLogin: "2026-02-19",
  },
  {
    id: "10",
    name: "Youssef Alaoui",
    email: "driver5@transithub.com",
    password: "password123",
    phone: "+212 6 33 44 55 66",
    role: "DRIVER",
    status: "INACTIVE",
    createdAt: "2024-10-15",
    lastLogin: "2026-01-20",
  },
];

export const demoAccounts = {
  superAdmin: { email: "superadmin@transithub.com", password: "password123" },
  ADMIN: { email: "ADMIN@transithub.com", password: "password123" },
  MANAGER: { email: "MANAGER@transithub.com", password: "password123" },
  DRIVER: { email: "driver1@transithub.com", password: "password123" },
};
