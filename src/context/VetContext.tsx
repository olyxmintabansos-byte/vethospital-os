"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  VetPatient,
  SurgicalCase,
  VetKpi,
  PatientStatus,
  SurgeryStatus,
  RadiologyStudy,
  DischargePassport,
} from "@/types/vet";

interface VetContextType {
  patients: VetPatient[];
  surgeries: SurgicalCase[];
  kpis: VetKpi;
  admitPatient: (patient: Omit<VetPatient, "id" | "arrivalTimestamp">) => void;
  updatePatientStatus: (id: string, status: PatientStatus) => void;
  scheduleSurgery: (surgery: Omit<SurgicalCase, "id" | "actualStart">) => void;
  advanceSurgeryStatus: (id: string) => void;
  adjustVitalSign: (id: string, key: keyof SurgicalCase, value: number) => void;
  studies: RadiologyStudy[];
  addStudy: (study: Omit<RadiologyStudy, "id" | "capturedTimestamp">) => void;
  advanceStudyStatus: (id: string) => void;
  adjustExposure: (id: string, deltaKvp: number, deltaMas: number) => void;
  passports: DischargePassport[];
  selectedPassportId: string;
  setSelectedPassportId: (id: string) => void;
  resetVetData: () => void;
}

const INITIAL_PATIENTS: VetPatient[] = [
  {
    id: "PAT-01",
    petName: "Milo",
    species: "CANINE",
    breed: "Golden Retriever",
    ageYears: 4,
    weightKg: 31.5,
    ownerName: "Sarah Wijaya",
    chiefComplaint: "Acute Cruciate Ligament Rupture (TPLO Scheduled)",
    triagePriority: "URGENT",
    heartRateBpm: 120,
    respiratoryRate: 28,
    temperatureC: 38.6,
    capillaryRefillTimeSec: 1.5,
    painScore: 3,
    status: "SURGERY",
    arrivalTimestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "PAT-02",
    petName: "Luna",
    species: "FELINE",
    breed: "British Shorthair",
    ageYears: 2,
    weightKg: 4.2,
    ownerName: "Budi Santoso",
    chiefComplaint: "FLUTD Lower Urinary Tract Obstruction",
    triagePriority: "CRITICAL",
    heartRateBpm: 190,
    respiratoryRate: 44,
    temperatureC: 37.4,
    capillaryRefillTimeSec: 2.2,
    painScore: 4,
    status: "TRIAGE",
    arrivalTimestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "PAT-03",
    petName: "Kiwi",
    species: "AVIAN",
    breed: "Blue and Gold Macaw",
    ageYears: 3,
    weightKg: 1.1,
    ownerName: "Dr. Hendra Gunawan",
    chiefComplaint: "Routine Beak Trimming & Radiographic Bone Density",
    triagePriority: "ROUTINE",
    heartRateBpm: 260,
    respiratoryRate: 36,
    temperatureC: 41.2,
    capillaryRefillTimeSec: 1.0,
    painScore: 0,
    status: "EXAMINATION",
    arrivalTimestamp: new Date(Date.now() - 5400000).toISOString(),
  },
];

const INITIAL_SURGERIES: SurgicalCase[] = [
  {
    id: "SUR-01",
    patientId: "PAT-01",
    petName: "Milo",
    species: "CANINE",
    surgeryType: "ORTHOPEDIC",
    anesthesiaProtocol: "PROPOFOL_ISOFLURANE",
    surgeon: "Dr. drh. Rian Pratama, M.Sc",
    anesthetist: "drh. Anita Wardani",
    scheduledStart: "09:00",
    actualStart: new Date(Date.now() - 2400000).toISOString(),
    durationMinutes: 75,
    status: "IN_PROGRESS",
    spo2Percent: 98,
    etco2Mmhg: 38,
    isofluraneMac: 1.8,
    notes: "TPLO Left Stifle Plate fixation in progress. Hemodynamics stable.",
  },
];

const INITIAL_STUDIES: RadiologyStudy[] = [
  {
    id: "RAD-2026-081",
    patientId: "PAT-01",
    petName: "Milo",
    species: "CANINE",
    modality: "DIGITAL_XRAY",
    anatomyRegion: "Left Stifle (Caudocranial & Mediolateral)",
    radiologistFinding: "Complete tear of Cranial Cruciate Ligament (CCL) confirmed. Mild periarticular osteophytes observed. Tibial plateau angle calculated at 28°.",
    exposureKvp: 68,
    exposureMas: 4.5,
    status: "FINALIZED",
    capturedTimestamp: "27 September 2026 09:30 WIB",
  },
  {
    id: "RAD-2026-082",
    patientId: "PAT-02",
    petName: "Luna",
    species: "FELINE",
    modality: "ULTRASOUND_DOPPLER",
    anatomyRegion: "Urinary Bladder & Renal Doppler",
    radiologistFinding: "Marked distension of urinary bladder with hyperechoic particulate matrix (struvite microcalculi). Bilateral renal pelvis normal.",
    exposureKvp: 55,
    exposureMas: 2.0,
    status: "RADIOLOGIST_REVIEW",
    capturedTimestamp: "27 September 2026 10:45 WIB",
  },
  {
    id: "RAD-2026-083",
    patientId: "PAT-03",
    petName: "Kiwi",
    species: "AVIAN",
    modality: "DIGITAL_XRAY",
    anatomyRegion: "Whole Body Ventrodorsal (Avian Micro-Focus)",
    radiologistFinding: "Pneumatized long bones intact. Proventriculus normal size, no radiopaque foreign body observed in gizzard.",
    exposureKvp: 44,
    exposureMas: 1.2,
    status: "FINALIZED",
    capturedTimestamp: "27 September 2026 11:15 WIB",
  },
];

const INITIAL_PASSPORTS: DischargePassport[] = [
  {
    passportId: "VET-DIS-2026-0941",
    patientId: "PAT-01",
    petName: "Milo",
    species: "CANINE",
    breed: "Golden Retriever",
    ownerName: "Sarah Wijaya",
    contactPhone: "+62 812-9844-1122",
    dischargeDate: "27 September 2026",
    attendingVeterinarian: "Dr. drh. Rian Pratama, M.Sc (Surg)",
    veterinaryLicenseNo: "SIP: VET-JKT-2026/092",
    finalDiagnosis: "Post-Operative Left Stifle Tibial Plateau Leveling Osteotomy (TPLO)",
    prognosis: "FAVORABLE",
    prescriptions: [
      {
        drugName: "Carprofen (Rimadyl) 75mg",
        dosage: "1 tablet",
        frequency: "Every 12 hours (with meals)",
        durationDays: 10,
        route: "Oral (PO)",
      },
      {
        drugName: "Cephalexin 500mg",
        dosage: "1 capsule",
        frequency: "Every 12 hours",
        durationDays: 7,
        route: "Oral (PO)",
      },
      {
        drugName: "Gabapentin 100mg",
        dosage: "1-2 capsules",
        frequency: "Every 8 hours as needed for pain",
        durationDays: 5,
        route: "Oral (PO)",
      },
    ],
    homeCareInstructions: [
      "Strict cage confinement or small room restriction for 6 weeks.",
      "Leash walks only for short bathroom breaks (max 5 minutes).",
      "Keep Elizabethan / cone collar on at all times to prevent licking surgical incision.",
      "Cold compress on surgical site for 10 minutes twice daily for first 72 hours.",
    ],
    followUpDate: "11 Oktober 2026 (Suture Removal & Radiographic Check)",
  },
  {
    passportId: "VET-DIS-2026-0942",
    patientId: "PAT-02",
    petName: "Luna",
    species: "FELINE",
    breed: "British Shorthair",
    ownerName: "Budi Santoso",
    contactPhone: "+62 813-4412-8890",
    dischargeDate: "27 September 2026",
    attendingVeterinarian: "drh. Anita Wardani (Internal Medicine)",
    veterinaryLicenseNo: "SIP: VET-JKT-2026/104",
    finalDiagnosis: "Feline Idiopathic Cystitis with Obstructive Struvite Urolithiasis (Decompressed)",
    prognosis: "FAVORABLE",
    prescriptions: [
      {
        drugName: "Prazosin 0.5mg",
        dosage: "1/2 capsule",
        frequency: "Every 12 hours (urethral antispasmodic)",
        durationDays: 7,
        route: "Oral (PO)",
      },
      {
        drugName: "Buprenorphine 0.3mg/mL",
        dosage: "0.2 mL",
        frequency: "Every 8 hours transmucosal",
        durationDays: 3,
        route: "Oral Transmucosal (OTM)",
      },
    ],
    homeCareInstructions: [
      "Switch exclusively to wet prescription urinary dissolution diet (Urinary S/O).",
      "Provide multiple fresh water sources and cat water fountain.",
      "Monitor urination stream daily; seek emergency care immediately if straining recurs.",
    ],
    followUpDate: "04 Oktober 2026 (Urinalysis & Ultrasound Repeat)",
  },
];

const VetContext = createContext<VetContextType | undefined>(undefined);

export const VetProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<VetPatient[]>(INITIAL_PATIENTS);
  const [surgeries, setSurgeries] = useState<SurgicalCase[]>(INITIAL_SURGERIES);
  const [studies, setStudies] = useState<RadiologyStudy[]>(INITIAL_STUDIES);
  const [passports] = useState<DischargePassport[]>(INITIAL_PASSPORTS);
  const [selectedPassportId, setSelectedPassportId] = useState<string>("VET-DIS-2026-0941");

  const [kpis, setKpis] = useState<VetKpi>({
    totalPatients: 3,
    criticalCount: 1,
    activeSurgeries: 1,
    avgWaitTimeMinutes: 12,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vethospital_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.patients) setPatients(parsed.patients);
        if (parsed.surgeries) setSurgeries(parsed.surgeries);
        if (parsed.studies) setStudies(parsed.studies);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("vethospital_state", JSON.stringify({ patients, surgeries, studies }));
    } catch {}

    const totalPatients = patients.length;
    const criticalCount = patients.filter((p) => p.triagePriority === "CRITICAL").length;
    const activeSurgeries = surgeries.filter((s) => s.status === "IN_PROGRESS").length;
    setKpis({ totalPatients, criticalCount, activeSurgeries, avgWaitTimeMinutes: 12 });
  }, [patients, surgeries, studies]);

  const admitPatient = (patient: Omit<VetPatient, "id" | "arrivalTimestamp">) => {
    const newPatient: VetPatient = {
      ...patient,
      id: `PAT-0${patients.length + 1}`,
      arrivalTimestamp: new Date().toISOString(),
    };
    setPatients([newPatient, ...patients]);
  };

  const updatePatientStatus = (id: string, status: PatientStatus) => {
    setPatients(patients.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const scheduleSurgery = (surgery: Omit<SurgicalCase, "id" | "actualStart">) => {
    const newSurgery: SurgicalCase = {
      ...surgery,
      id: `SUR-0${surgeries.length + 1}`,
      actualStart: null,
    };
    setSurgeries([newSurgery, ...surgeries]);
  };

  const advanceSurgeryStatus = (id: string) => {
    setSurgeries(
      surgeries.map((s) => {
        if (s.id !== id) return s;
        const statusFlow: SurgeryStatus[] = ["SCHEDULED", "PREP", "IN_PROGRESS", "RECOVERY", "COMPLETED"];
        const currentIndex = statusFlow.indexOf(s.status);
        const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];
        return {
          ...s,
          status: nextStatus,
          actualStart: nextStatus === "IN_PROGRESS" && !s.actualStart ? new Date().toISOString() : s.actualStart,
        };
      })
    );
  };

  const adjustVitalSign = (id: string, key: keyof SurgicalCase, value: number) => {
    setSurgeries(surgeries.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  const addStudy = (study: Omit<RadiologyStudy, "id" | "capturedTimestamp">) => {
    const newStudy: RadiologyStudy = {
      ...study,
      id: `RAD-2026-0${studies.length + 80}`,
      capturedTimestamp: "Baru saja",
    };
    setStudies([newStudy, ...studies]);
  };

  const advanceStudyStatus = (id: string) => {
    setStudies(
      studies.map((st) => {
        if (st.id === id) {
          const next =
            st.status === "CAPTURED"
              ? ("RADIOLOGIST_REVIEW" as const)
              : st.status === "RADIOLOGIST_REVIEW"
              ? ("FINALIZED" as const)
              : ("CAPTURED" as const);
          return { ...st, status: next };
        }
        return st;
      })
    );
  };

  const adjustExposure = (id: string, deltaKvp: number, deltaMas: number) => {
    setStudies(
      studies.map((st) => {
        if (st.id === id) {
          return {
            ...st,
            exposureKvp: Math.max(30, Math.min(120, st.exposureKvp + deltaKvp)),
            exposureMas: Number(Math.max(0.5, Math.min(25.0, st.exposureMas + deltaMas)).toFixed(1)),
          };
        }
        return st;
      })
    );
  };

  const resetVetData = () => {
    setPatients(INITIAL_PATIENTS);
    setSurgeries(INITIAL_SURGERIES);
    setStudies(INITIAL_STUDIES);
    setSelectedPassportId("VET-DIS-2026-0941");
  };

  return (
    <VetContext.Provider
      value={{
        patients,
        surgeries,
        kpis,
        admitPatient,
        updatePatientStatus,
        scheduleSurgery,
        advanceSurgeryStatus,
        adjustVitalSign,
        studies,
        addStudy,
        advanceStudyStatus,
        adjustExposure,
        passports,
        selectedPassportId,
        setSelectedPassportId,
        resetVetData,
      }}
    >
      {children}
    </VetContext.Provider>
  );
};

export const useVet = () => {
  const context = useContext(VetContext);
  if (!context) throw new Error("useVet must be used within a VetProvider");
  return context;
};
