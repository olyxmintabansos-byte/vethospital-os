"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Stethoscope, Scissors, Activity, FileText, RotateCcw } from "lucide-react";
import { useVet } from "@/context/VetContext";

export default function Navbar() {
  const pathname = usePathname();
  const { kpis, resetVetData } = useVet();

  const navLinks = [
    { href: "/", label: "TRIAGE", icon: Stethoscope },
    { href: "/surgery/", label: "SURGERY", icon: Scissors },
    { href: "/radiology/", label: "VET PACS", icon: Activity },
    { href: "/discharge/", label: "DISCHARGE A4", icon: FileText },
  ];

  return (
    <nav className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b border-orange-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-600" />
            <div>
              <span className="text-xl font-bold text-stone-800">VetHospital OS</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-800 rounded-full">
                TITAN #35
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-rose-600 text-white shadow-md font-bold"
                      : "text-stone-700 hover:bg-rose-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-xs font-mono">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>
    </nav>
  );
}
