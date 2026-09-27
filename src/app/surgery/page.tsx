"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useVet } from "@/context/VetContext";
import {
  Scissors,
  Plus,
  Activity,
  Heart,
  Wind,
  Thermometer,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { SurgeryType, AnesthesiaProtocol, SurgeryStatus } from "@/types/vet";

export default function SurgeryPage() {
  const { patients, surgeries, scheduleSurgery, advanceSurgeryStatus, adjustVitalSign } = useVet();
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const eligiblePatients = patients.filter((p) => p.status === "SURGERY");

  const [formData, setFormData] = useState({
    patientId: "",
    petName: "",
    species: "CANINE" as any,
    surgeryType: "SPAY_NEUTER" as SurgeryType,
    anesthesiaProtocol: "PROPOFOL_ISOFLURANE" as AnesthesiaProtocol,
    surgeon: "",
    anesthetist: "",
    scheduledStart: "",
    durationMinutes: 60,
    status: "SCHEDULED" as SurgeryStatus,
    spo2Percent: 98,
    etco2Mmhg: 35,
    isofluraneMac: 1.2,
    notes: "",
  });

  const handleSchedule = () => {
    const patient = patients.find((p) => p.id === formData.patientId);
    if (!patient) return;

    scheduleSurgery({
      ...formData,
      petName: patient.petName,
      species: patient.species,
    });
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setShowScheduleModal(false);
    setFormData({
      patientId: "",
      petName: "",
      species: "CANINE",
      surgeryType: "SPAY_NEUTER",
      anesthesiaProtocol: "PROPOFOL_ISOFLURANE",
      surgeon: "",
      anesthetist: "",
      scheduledStart: "",
      durationMinutes: 60,
      status: "SCHEDULED",
      spo2Percent: 98,
      etco2Mmhg: 35,
      isofluraneMac: 1.2,
      notes: "",
    });
  };

  const getStatusColor = (status: SurgeryStatus) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-slate-100 text-slate-800";
      case "PREP":
        return "bg-amber-100 text-amber-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 animate-pulse";
      case "RECOVERY":
        return "bg-indigo-100 text-indigo-800";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-stone-800">Surgical Schedule</h1>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            disabled={eligiblePatients.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white rounded-xl shadow-md transition-colors font-medium disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Schedule Surgery
          </button>
        </div>

        {surgeries.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-stone-300 text-center">
            <Scissors className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-600 text-lg">No surgeries scheduled. Add a surgical case to begin.</p>
          </div>
        )}

        <div className="space-y-4">
          {surgeries.map((surgery) => (
            <div key={surgery.id} className="bg-white p-6 rounded-2xl border-2 border-indigo-200 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                    <Scissors className="w-6 h-6 text-indigo-600" />
                    {surgery.petName}
                  </h3>
                  <p className="text-sm text-stone-600 mt-1">
                    {surgery.species} • {surgery.surgeryType.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-stone-600">
                    Surgeon: {surgery.surgeon} • Anesthetist: {surgery.anesthetist}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                      surgery.status
                    )}`}
                  >
                    {surgery.status}
                  </span>
                  <p className="text-xs text-stone-600 mt-2 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {new Date(surgery.scheduledStart).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-stone-600">Anesthesia Protocol:</span>{" "}
                    <span className="font-semibold text-stone-800">
                      {surgery.anesthesiaProtocol.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-600">Duration:</span>{" "}
                    <span className="font-semibold text-stone-800">{surgery.durationMinutes} min</span>
                  </div>
                </div>
                {surgery.notes && (
                  <p className="text-sm text-stone-700 mt-2">
                    <span className="font-semibold">Notes:</span> {surgery.notes}
                  </p>
                )}
              </div>

              {surgery.status === "IN_PROGRESS" && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl border-2 border-blue-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-blue-700" />
                      <span className="text-sm font-semibold text-blue-900">SpO₂</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{surgery.spo2Percent}%</p>
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => adjustVitalSign(surgery.id, "spo2Percent", surgery.spo2Percent - 1)}
                        className="flex-1 px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded text-xs font-medium text-blue-900 transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustVitalSign(surgery.id, "spo2Percent", surgery.spo2Percent + 1)}
                        className="flex-1 px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded text-xs font-medium text-blue-900 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl border-2 border-green-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-green-700" />
                      <span className="text-sm font-semibold text-green-900">ETCO₂</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{surgery.etco2Mmhg} mmHg</p>
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => adjustVitalSign(surgery.id, "etco2Mmhg", surgery.etco2Mmhg - 1)}
                        className="flex-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded text-xs font-medium text-green-900 transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustVitalSign(surgery.id, "etco2Mmhg", surgery.etco2Mmhg + 1)}
                        className="flex-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded text-xs font-medium text-green-900 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl border-2 border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-5 h-5 text-purple-700" />
                      <span className="text-sm font-semibold text-purple-900">Isoflurane</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-900">{surgery.isofluraneMac.toFixed(1)} MAC</p>
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() =>
                          adjustVitalSign(surgery.id, "isofluraneMac", Math.max(0.5, surgery.isofluraneMac - 0.1))
                        }
                        className="flex-1 px-2 py-1 bg-purple-200 hover:bg-purple-300 rounded text-xs font-medium text-purple-900 transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          adjustVitalSign(surgery.id, "isofluraneMac", Math.min(3.0, surgery.isofluraneMac + 0.1))
                        }
                        className="flex-1 px-2 py-1 bg-purple-200 hover:bg-purple-300 rounded text-xs font-medium text-purple-900 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  advanceSurgeryStatus(surgery.id);
                  if (surgery.status === "RECOVERY") {
                    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                  }
                }}
                disabled={surgery.status === "COMPLETED"}
                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white rounded-xl transition-colors font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {surgery.status === "COMPLETED" ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Surgery Completed
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Advance to Next Stage
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-indigo-600" />
              Schedule Surgery
            </h2>

            {eligiblePatients.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="text-stone-600">No patients available for surgery.</p>
                <p className="text-sm text-stone-500 mt-1">Patients must be in SURGERY status to schedule.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Select Patient</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select a patient --</option>
                    {eligiblePatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.petName} ({p.species}) - {p.ownerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Surgery Type</label>
                    <select
                      value={formData.surgeryType}
                      onChange={(e) => setFormData({ ...formData, surgeryType: e.target.value as SurgeryType })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="SPAY_NEUTER">Spay/Neuter</option>
                      <option value="ORTHOPEDIC">Orthopedic</option>
                      <option value="SOFT_TISSUE">Soft Tissue</option>
                      <option value="DENTAL">Dental</option>
                      <option value="EMERGENCY_LAPAROTOMY">Emergency Laparotomy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Anesthesia Protocol</label>
                  <select
                    value={formData.anesthesiaProtocol}
                    onChange={(e) =>
                      setFormData({ ...formData, anesthesiaProtocol: e.target.value as AnesthesiaProtocol })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="PROPOFOL_ISOFLURANE">Propofol + Isoflurane</option>
                    <option value="KETAMINE_DEXMEDETOMIDINE">Ketamine + Dexmedetomidine</option>
                    <option value="ALFAXALONE_SEVOFLURANE">Alfaxalone + Sevoflurane</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Surgeon</label>
                    <input
                      type="text"
                      value={formData.surgeon}
                      onChange={(e) => setFormData({ ...formData, surgeon: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Anesthetist</label>
                    <input
                      type="text"
                      value={formData.anesthetist}
                      onChange={(e) => setFormData({ ...formData, anesthetist: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Scheduled Start</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledStart}
                    onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!formData.patientId}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
              >
                Schedule Surgery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
