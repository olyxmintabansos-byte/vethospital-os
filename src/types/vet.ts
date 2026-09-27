export type SpeciesType = "CANINE" | "FELINE" | "AVIAN" | "REPTILE" | "EXOTIC";
export type TriagePriority = "CRITICAL" | "URGENT" | "STABLE" | "ROUTINE";
export type PatientStatus = "TRIAGE" | "EXAMINATION" | "SURGERY" | "RECOVERY" | "DISCHARGED";

export interface VetPatient {
  id: string;
  ownerName: string;
  petName: string;
  species: SpeciesType;
  breed: string;
  ageYears: number;
  weightKg: number;
  chiefComplaint: string;
  triagePriority: TriagePriority;
  heartRateBpm: number;
  respiratoryRate: number;
  temperatureC: number;
  capillaryRefillTimeSec: number;
  painScore: number;
  status: PatientStatus;
  arrivalTimestamp: string;
}

export type SurgeryType =
  | "SPAY_NEUTER"
  | "ORTHOPEDIC"
  | "SOFT_TISSUE"
  | "DENTAL"
  | "EMERGENCY_LAPAROTOMY";

export type AnesthesiaProtocol =
  | "PROPOFOL_ISOFLURANE"
  | "KETAMINE_DEXMEDETOMIDINE"
  | "ALFAXALONE_SEVOFLURANE";

export type SurgeryStatus = "SCHEDULED" | "PREP" | "IN_PROGRESS" | "RECOVERY" | "COMPLETED";

export interface SurgicalCase {
  id: string;
  patientId: string;
  petName: string;
  species: SpeciesType;
  surgeryType: SurgeryType;
  anesthesiaProtocol: AnesthesiaProtocol;
  surgeon: string;
  anesthetist: string;
  scheduledStart: string;
  actualStart: string | null;
  durationMinutes: number;
  status: SurgeryStatus;
  spo2Percent: number;
  etco2Mmhg: number;
  isofluraneMac: number;
  notes: string;
}

export interface VetKpi {
  totalPatients: number;
  criticalCount: number;
  activeSurgeries: number;
  avgWaitTimeMinutes: number;
}
