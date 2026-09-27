"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useVet } from "@/context/VetContext";
import {
  Activity,
  Plus,
  Minus,
  Maximize2,
  ZoomIn,
  Sun,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function RadiologyPacsPage() {
  const { studies, advanceStudyStatus, adjustExposure } = useVet();
  const [selectedStudyId, setSelectedStudyId] = useState<string>("RAD-2026-081");
  const [isInverted, setIsInverted] = useState<boolean>(false);

  const currentStudy = studies.find((s) => s.id === selectedStudyId) || studies[0];

  const handleAdvance = (id: string) => {
    advanceStudyStatus(id);
    confetti({
      particleCount: 25,
      spread: 50,
      colors: ["#E11D48", "#F97316", "#0D9488"],
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-stone-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Clay Header */}
        <section className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.04),_inset_3px_3px_6px_rgba(255,255,255,0.9),_8px_8px_25px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-mono font-bold shadow-sm">
              <Activity className="w-3.5 h-3.5 text-rose-600" />
              <span>DICOM VETERINARY PACS & DIGITAL RADIOGRAPHY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Diagnostic Imaging & <span className="text-rose-600">Ultrasound Doppler</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
              Pemeriksaan radiografi digital resolusi tinggi, evaluasi fraktur ortopedi, densitas tulang, dan ultrasonografi Doppler organ abdomen hewan.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm text-stone-700 font-bold">
              {studies.length} IMAGING STUDIES
            </span>
          </div>
        </section>

        {/* 2-Column: Left PACS Viewer, Right Study Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PACS Darkroom Viewer */}
          <div className="lg:col-span-2 bg-stone-900 text-stone-100 rounded-[2.5rem] p-6 shadow-2xl border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold">
                  {currentStudy.modality}
                </span>
                <span className="text-stone-300 font-bold">{currentStudy.anatomyRegion}</span>
              </div>
              <span className="text-stone-400">PATIENT: {currentStudy.petName} ({currentStudy.species})</span>
            </div>

            {/* Simulated X-Ray Canvas */}
            <div
              className={`h-80 sm:h-96 rounded-2xl flex items-center justify-center p-6 border-2 border-stone-800 transition-all ${
                isInverted
                  ? "bg-slate-100 text-stone-900"
                  : "bg-radial from-stone-800 via-stone-900 to-black text-stone-200"
              }`}
            >
              <div className="text-center space-y-3 font-mono">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-dashed border-stone-500/40 flex items-center justify-center animate-pulse">
                  <Activity className="w-10 h-10 text-rose-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm uppercase tracking-widest">
                    {currentStudy.modality} // {currentStudy.id}
                  </h4>
                  <p className="text-xs text-stone-400 max-w-sm">
                    Exposure: {currentStudy.exposureKvp} kVp • {currentStudy.exposureMas} mAs • Matrix 2048x2048 DICOM
                  </p>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-stone-800/80 text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                  DIAGNOSTIC CONTRAST CALIBRATED
                </div>
              </div>
            </div>

            {/* Viewer Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInverted(!isInverted)}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition-colors"
                >
                  <Sun className="w-3.5 h-3.5" />
                  {isInverted ? "Normal Black" : "Invert White"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-400">kVp:</span>
                <button
                  onClick={() => adjustExposure(currentStudy.id, -2, 0)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-rose-400">{currentStudy.exposureKvp}</span>
                <button
                  onClick={() => adjustExposure(currentStudy.id, 2, 0)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Radiologist Findings Card */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-md border border-slate-100 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">
                  RADIOLOGY STUDY REPORT:
                </span>
                <h3 className="text-lg font-bold text-stone-900">{currentStudy.id}</h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">{currentStudy.capturedTimestamp}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">STATUS AUDIT:</span>
                  <span className="font-bold text-rose-600">{currentStudy.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">REGION:</span>
                  <span className="font-bold text-stone-800">{currentStudy.anatomyRegion}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-700 uppercase block mb-1">
                  TEMUAN RADIOLOGIS (FINDINGS):
                </span>
                <p className="text-xs text-stone-600 leading-relaxed p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 font-mono">
                  {currentStudy.radiologistFinding}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAdvance(currentStudy.id)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs font-mono shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>ADVANCE STUDY STATUS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Study Selector Matrix */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-stone-900 font-sans">
            ALL PATIENT RADIOGRAPHIC STUDIES ({studies.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
            {studies.map((st) => {
              const isSelected = st.id === currentStudy.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudyId(st.id)}
                  className={`cursor-pointer rounded-3xl p-5 border transition-all ${
                    isSelected
                      ? "bg-white border-2 border-rose-500 shadow-md ring-2 ring-rose-500/20"
                      : "bg-white border-slate-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-rose-600">{st.id}</span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-bold">
                      {st.modality}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900">{st.petName} ({st.species})</h4>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{st.anatomyRegion}</p>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex justify-between text-[11px] text-stone-400">
                    <span>{st.exposureKvp} kVp • {st.exposureMas} mAs</span>
                    <span className="font-bold text-teal-700">{st.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
