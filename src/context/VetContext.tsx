"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { VetPatient, SurgicalCase, VetKpi, PatientStatus, SurgeryStatus } from "@/types/vet";

interface VetContextType {
  patients: VetPatient[];
  surgeries: SurgicalCase[];
  kpis: VetKpi;
  admitPatient: (patient: Omit<VetPatient, "id" | "arrivalTimestamp">) => void;
  updatePatientStatus: (id: string, status: PatientStatus) => void;
  scheduleSurgery: (surgery: Omit<SurgicalCase, "id" | "actualStart">) => void;
  advanceSurgeryStatus: (id: string) => void;
  adjustVitalSign: (id: string, key: keyof SurgicalCase, value: number) => void;
  resetVetData: () => void;
}

const VetContext = createContext<VetContextType | undefined>(undefined);

export const VetProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<VetPatient[]>([]);
  const [surgeries, setSurgeries] = useState<SurgicalCase[]>([]);
  const [kpis, setKpis] = useState<VetKpi>({
    totalPatients: 0,
    criticalCount: 0,
    activeSurgeries: 0,
    avgWaitTimeMinutes: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem("vethospital_state");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPatients(parsed.patients || []);
      setSurgeries(parsed.surgeries || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vethospital_state", JSON.stringify({ patients, surgeries }));
    
    const totalPatients = patients.length;
    const criticalCount = patients.filter((p) => p.triagePriority === "CRITICAL").length;
    const activeSurgeries = surgeries.filter((s) => s.status === "IN_PROGRESS").length;
    
    const now = new Date();
    const waitTimes = patients
      .filter((p) => p.status === "TRIAGE")
      .map((p) => (now.getTime() - new Date(p.arrivalTimestamp).getTime()) / 60000);
    const avgWaitTimeMinutes = waitTimes.length > 0
      ? Math.round(waitTimes.reduce((sum, t) => sum + t, 0) / waitTimes.length)
      : 0;

    setKpis({ totalPatients, criticalCount, activeSurgeries, avgWaitTimeMinutes });
  }, [patients, surgeries]);

  const admitPatient = (patient: Omit<VetPatient, "id" | "arrivalTimestamp">) => {
    const newPatient: VetPatient = {
      ...patient,
      id: `PAT-${Date.now()}`,
      arrivalTimestamp: new Date().toISOString(),
    };
    setPatients([...patients, newPatient]);
  };

  const updatePatientStatus = (id: string, status: PatientStatus) => {
    setPatients(patients.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const scheduleSurgery = (surgery: Omit<SurgicalCase, "id" | "actualStart">) => {
    const newSurgery: SurgicalCase = {
      ...surgery,
      id: `SUR-${Date.now()}`,
      actualStart: null,
    };
    setSurgeries([...surgeries, newSurgery]);
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
    setSurgeries(
      surgeries.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const resetVetData = () => {
    setPatients([]);
    setSurgeries([]);
    localStorage.removeItem("vethospital_state");
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
        resetVetData,
      }}
    >
      {children}
    </VetContext.Provider>
  );
};

export const useVet = () => {
  const context = useContext(VetContext);
  if (!context) throw new Error("useVet must be used within VetProvider");
  return context;
};
