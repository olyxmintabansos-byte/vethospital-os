"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useVet } from "@/context/VetContext";
import {
  FileText,
  Printer,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export default function DischargeSummaryPage() {
  const { passports, selectedPassportId, setSelectedPassportId } = useVet();
  const currentPassport =
    passports.find((p) => p.passportId === selectedPassportId) || passports[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-stone-800 flex flex-col font-sans print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
        {/* Action Header (Hidden on Print) */}
        <div className="print:hidden bg-white rounded-[2.5rem] p-6 shadow-md border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-mono font-bold text-rose-800 shadow-sm mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>VETERINARY MEDICAL DISCHARGE & PHARMACY PRESCRIPTION A4</span>
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              Discharge Certificate & <span className="text-rose-600">Home Care Protocol</span>
            </h1>
            <p className="text-xs text-stone-500">
              Surat keterangan rawat inap/operasi hewan, resep farmasi dan instruksi perawatan di rumah.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPassportId}
              onChange={(e) => setSelectedPassportId(e.target.value)}
              className="px-3.5 py-2.5 rounded-full bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 focus:outline-none focus:border-rose-600 shadow-sm"
            >
              {passports.map((p) => (
                <option key={p.passportId} value={p.passportId}>
                  {p.petName} // {p.passportId}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" /> CETAK RESEP A4
            </button>
          </div>
        </div>

        {/* Printable A4 Certificate Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 print:border-none print:shadow-none print:p-6 print:rounded-none text-stone-900 border border-stone-200">
          {/* Certificate Letterhead */}
          <div className="border-b-4 border-rose-600 pb-6 mb-6 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tight text-stone-900 font-sans uppercase">
                  VETHOSPITAL ANIMAL SPECIALIST CENTER
                </span>
              </div>
              <p className="text-xs font-mono text-stone-600 font-bold uppercase tracking-wider">
                RUMAH SAKIT HEWAN RUJUKAN BEDAH, TRIAGE & RAWAT INAP TERPADU
              </p>
              <p className="text-[11px] font-mono text-stone-400">
                Surat Izin Operasional Klinik No. 445/VET-HOSP/2026 • Organisasi olyxmintabansos-byte
              </p>
            </div>

            <div className="text-right font-mono">
              <div className="inline-block px-3 py-1 bg-rose-50 border border-rose-600 rounded-full font-bold text-xs text-rose-800">
                SURAT KELUAR RAWAT & RESEP
              </div>
              <p className="text-xs text-stone-500 mt-1 font-bold">NO: {currentPassport.passportId}</p>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-6 space-y-1">
            <h2 className="text-xl font-bold tracking-wider text-stone-900 uppercase font-sans">
              VETERINARY DISCHARGE SUMMARY & PHARMACY PRESCRIPTION
            </h2>
            <p className="text-xs italic text-stone-500">
              Dokumen Resmi Pemulangan Pasien Hewan & Terapi Farmakologi Lanjutan
            </p>
          </div>

          {/* Patient & Owner Identifiers Grid */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-3xl bg-stone-50 border border-stone-200 font-mono text-xs mb-6">
            <div>
              <span className="text-[10px] text-stone-400 uppercase block font-bold">
                PASIEN HEWAN (PATIENT):
              </span>
              <span className="text-base font-bold text-stone-900">{currentPassport.petName}</span>
              <p className="text-stone-600 text-[11px]">
                {currentPassport.species} • {currentPassport.breed}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 uppercase block font-bold">
                PEMILIK HEWAN (CLIENT):
              </span>
              <span className="text-base font-bold text-stone-900">{currentPassport.ownerName}</span>
              <p className="text-stone-600 text-[11px]">Kontak: {currentPassport.contactPhone}</p>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 uppercase block font-bold">
                DIAGNOSIS AKHIR:
              </span>
              <span className="font-bold text-rose-900">{currentPassport.finalDiagnosis}</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 uppercase block font-bold">
                PROGNOSIS & TANGGAL KELUAR:
              </span>
              <span className="font-bold text-teal-800">
                {currentPassport.prognosis} • {currentPassport.dischargeDate}
              </span>
            </div>
          </div>

          {/* Pharmacy Prescription Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2 font-sans flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              RESEP OBAT PULANG & ATURAN PAKAI (PRESCRIPTION SCHEDULE)
            </h3>

            <table className="w-full text-left font-mono text-xs border border-stone-200 rounded-2xl overflow-hidden">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-800 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-stone-200">NAMA OBAT & KEKUATAN</th>
                  <th className="p-2.5 border-r border-stone-200">DOSIS SEKALI PAKAI</th>
                  <th className="p-2.5 border-r border-stone-200">FREKUENSI & JADWAL</th>
                  <th className="p-2.5">DURASI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[11px]">
                {currentPassport.prescriptions.map((rx, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="p-2.5 border-r border-stone-200 font-bold text-stone-900">
                      {rx.drugName}
                    </td>
                    <td className="p-2.5 border-r border-stone-200 text-stone-700">
                      {rx.dosage} ({rx.route})
                    </td>
                    <td className="p-2.5 border-r border-stone-200 text-rose-900 font-bold">
                      {rx.frequency}
                    </td>
                    <td className="p-2.5 text-stone-800 font-bold">
                      {rx.durationDays} Hari
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Home Care Instructions */}
          <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 font-mono text-xs mb-6">
            <span className="font-bold text-amber-900 block mb-2 uppercase">
              INSTRUKSI PERAWATAN DI RUMAH (POST-DISCHARGE CARE):
            </span>
            <ul className="list-disc list-inside space-y-1 text-stone-700 text-[11px]">
              {currentPassport.homeCareInstructions.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </div>

          {/* Follow-up Note */}
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs font-mono text-teal-900 mb-8 flex items-center justify-between">
            <span>JADWAL KONTROL ULANG (FOLLOW-UP):</span>
            <span className="font-bold">{currentPassport.followUpDate}</span>
          </div>

          {/* Attending Veterinarian Signature Block */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-stone-200 font-mono text-xs">
            <div className="text-center space-y-12">
              <span className="text-[10px] text-stone-400 uppercase block font-bold">
                TANDA TANGAN PEMILIK HEWAN:
              </span>
              <div>
                <p className="font-bold underline text-stone-900">{currentPassport.ownerName}</p>
                <p className="text-[10px] text-stone-400">Telah menerima penjelasan & obat</p>
              </div>
            </div>

            <div className="text-center space-y-12">
              <span className="text-[10px] text-stone-400 uppercase block font-bold">
                DOKTER HEWAN PENANGGUNG JAWAB:
              </span>
              <div>
                <p className="font-bold underline text-stone-900">{currentPassport.attendingVeterinarian}</p>
                <p className="text-[10px] text-stone-500">{currentPassport.veterinaryLicenseNo}</p>
              </div>
            </div>
          </div>

          {/* Certificate Footer Notes */}
          <div className="mt-8 pt-3 border-t border-stone-200 flex justify-between items-center font-mono text-[10px] text-stone-400">
            <span>DOKUMEN RESMI VETHOSPITAL OS</span>
            <span>TITAN #35 FLEET // AAHA ACCREDITED</span>
          </div>
        </div>
      </main>
    </div>
  );
}
