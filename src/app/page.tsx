"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useVet } from "@/context/VetContext";
import {
  Stethoscope,
  Plus,
  Heart,
  Activity,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Clock,
  PawPrint,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { SpeciesType, TriagePriority, PatientStatus } from "@/types/vet";

export default function TriagePage() {
  const { patients, kpis, admitPatient, updatePatientStatus } = useVet();
  const [showAdmitModal, setShowAdmitModal] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: "",
    petName: "",
    species: "CANINE" as SpeciesType,
    breed: "",
    ageYears: 3,
    weightKg: 15,
    chiefComplaint: "",
    triagePriority: "ROUTINE" as TriagePriority,
    heartRateBpm: 90,
    respiratoryRate: 20,
    temperatureC: 38.5,
    capillaryRefillTimeSec: 2,
    painScore: 0,
    status: "TRIAGE" as PatientStatus,
  });

  const handleAdmit = () => {
    admitPatient(formData);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setShowAdmitModal(false);
    setFormData({
      ownerName: "",
      petName: "",
      species: "CANINE",
      breed: "",
      ageYears: 3,
      weightKg: 15,
      chiefComplaint: "",
      triagePriority: "ROUTINE",
      heartRateBpm: 90,
      respiratoryRate: 20,
      temperatureC: 38.5,
      capillaryRefillTimeSec: 2,
      painScore: 0,
      status: "TRIAGE",
    });
  };

  const getPriorityColor = (priority: TriagePriority) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-rose-100 border-rose-500 text-rose-900";
      case "URGENT":
        return "bg-orange-100 border-orange-500 text-orange-900";
      case "STABLE":
        return "bg-yellow-100 border-yellow-500 text-yellow-900";
      case "ROUTINE":
        return "bg-emerald-100 border-emerald-500 text-emerald-900";
    }
  };

  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "TRIAGE":
        return "bg-amber-100 text-amber-800";
      case "EXAMINATION":
        return "bg-blue-100 text-blue-800";
      case "SURGERY":
        return "bg-purple-100 text-purple-800";
      case "RECOVERY":
        return "bg-indigo-100 text-indigo-800";
      case "DISCHARGED":
        return "bg-emerald-100 text-emerald-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-rose-600" />
            <h1 className="text-3xl font-bold text-stone-800">Patient Triage</h1>
          </div>
          <button
            onClick={() => setShowAdmitModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Admit Patient
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-rose-600" />
              <h3 className="font-bold text-stone-800">Total Patients</h3>
            </div>
            <p className="text-4xl font-bold text-stone-900">{kpis.totalPatients}</p>
          </div>

          <div className="bg-gradient-to-br from-rose-100 to-rose-200 p-5 rounded-2xl border-2 border-rose-400 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-rose-800" />
              <h3 className="font-bold text-rose-900">Critical Cases</h3>
            </div>
            <p className="text-4xl font-bold text-rose-900">{kpis.criticalCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-amber-600" />
              <h3 className="font-bold text-stone-800">Avg Wait Time</h3>
            </div>
            <p className="text-4xl font-bold text-stone-900">{kpis.avgWaitTimeMinutes} min</p>
          </div>
        </div>

        <div className="space-y-4">
          {patients.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-stone-300 text-center">
              <PawPrint className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 text-lg">No patients in triage. Admit your first patient to begin.</p>
            </div>
          )}

          {patients.map((patient) => (
            <div
              key={patient.id}
              className={`p-6 rounded-2xl border-2 shadow-lg ${getPriorityColor(patient.triagePriority)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <PawPrint className="w-6 h-6" />
                    {patient.petName}
                  </h3>
                  <p className="text-sm opacity-80">
                    Owner: {patient.ownerName} • {patient.species} • {patient.breed}
                  </p>
                  <p className="text-sm opacity-80 mt-1">
                    Age: {patient.ageYears}y • Weight: {patient.weightKg}kg
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                  <p className="text-xs opacity-70 mt-2">
                    Arrived: {new Date(patient.arrivalTimestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="bg-white/50 p-4 rounded-xl mb-4">
                <p className="font-semibold mb-1">Chief Complaint:</p>
                <p className="text-sm">{patient.chiefComplaint}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/50 p-3 rounded-lg text-center">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                  <p className="text-xs opacity-70">HR</p>
                  <p className="font-bold">{patient.heartRateBpm} bpm</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg text-center">
                  <Activity className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs opacity-70">RR</p>
                  <p className="font-bold">{patient.respiratoryRate} /min</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg text-center">
                  <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                  <p className="text-xs opacity-70">Temp</p>
                  <p className="font-bold">{patient.temperatureC}°C</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg text-center">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <p className="text-xs opacity-70">Pain</p>
                  <p className="font-bold">{patient.painScore}/10</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updatePatientStatus(patient.id, "EXAMINATION");
                    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
                  }}
                  disabled={patient.status !== "TRIAGE"}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                >
                  To Exam
                </button>
                <button
                  onClick={() => {
                    updatePatientStatus(patient.id, "SURGERY");
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                  }}
                  disabled={patient.status !== "EXAMINATION"}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-stone-300 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                >
                  To Surgery
                </button>
                <button
                  onClick={() => {
                    updatePatientStatus(patient.id, "DISCHARGED");
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                  }}
                  disabled={patient.status === "DISCHARGED"}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Discharge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-rose-600" />
              Admit New Patient
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Pet Name</label>
                  <input
                    type="text"
                    value={formData.petName}
                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Species</label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value as SpeciesType })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="CANINE">Canine</option>
                    <option value="FELINE">Feline</option>
                    <option value="AVIAN">Avian</option>
                    <option value="REPTILE">Reptile</option>
                    <option value="EXOTIC">Exotic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Age (years)</label>
                  <input
                    type="number"
                    value={formData.ageYears}
                    onChange={(e) => setFormData({ ...formData, ageYears: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Breed</label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Chief Complaint</label>
                <textarea
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Triage Priority</label>
                <select
                  value={formData.triagePriority}
                  onChange={(e) => setFormData({ ...formData, triagePriority: e.target.value as TriagePriority })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="URGENT">Urgent</option>
                  <option value="STABLE">Stable</option>
                  <option value="ROUTINE">Routine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={formData.heartRateBpm}
                    onChange={(e) => setFormData({ ...formData, heartRateBpm: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Respiratory Rate (/min)</label>
                  <input
                    type="number"
                    value={formData.respiratoryRate}
                    onChange={(e) => setFormData({ ...formData, respiratoryRate: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperatureC}
                    onChange={(e) => setFormData({ ...formData, temperatureC: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Pain Score (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.painScore}
                    onChange={(e) => setFormData({ ...formData, painScore: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdmitModal(false)}
                className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdmit}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium"
              >
                Admit Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
