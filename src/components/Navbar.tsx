"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Stethoscope, Scissors, RotateCcw } from "lucide-react";
import { useVet } from "@/context/VetContext";

export default function Navbar() {
  const pathname = usePathname();
  const { kpis, resetVetData } = useVet();

  return (
    <nav className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b border-orange-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-600" />
            <span className="text-xl font-bold text-stone-800">VetHospital OS</span>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                pathname === "/"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-stone-700 hover:bg-rose-100"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              TRIAGE
            </Link>
            <Link
              href="/surgery/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                pathname === "/surgery/"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-stone-700 hover:bg-rose-100"
              }`}
            >
              <Scissors className="w-4 h-4" />
              SURGERY
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-sm">
            <div className="bg-white px-3 py-1.5 rounded-lg border border-orange-200 shadow-sm">
              <span className="text-stone-600">Patients:</span>{" "}
              <span className="font-bold text-stone-900">{kpis.totalPatients}</span>
            </div>
            <div className="bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-300 shadow-sm">
              <span className="text-rose-700">Critical:</span>{" "}
              <span className="font-bold text-rose-900">{kpis.criticalCount}</span>
            </div>
            <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-300 shadow-sm">
              <span className="text-blue-700">Active OR:</span>{" "}
              <span className="font-bold text-blue-900">{kpis.activeSurgeries}</span>
            </div>
          </div>

          <button
            onClick={resetVetData}
            className="flex items-center gap-2 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </nav>
  );
}
