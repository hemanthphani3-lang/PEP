"use client";

import React, { useState, useEffect } from "react";
import { DBService, PublicData, Cluster } from "@/services/db";
import { 
  Database, 
  MapPin, 
  Users, 
  GraduationCap, 
  HeartPulse, 
  Droplet, 
  Milestone,
  Sparkles,
  ArrowRight,
  TrendingUp,
  LineChart
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EvidencePage() {
  const [publicData, setPublicData] = useState<PublicData[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<string>("dharmapuri");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pData = await DBService.getPublicData();
        const cls = await DBService.getClusters();
        setPublicData(pData);
        setClusters(cls);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activeVillage = publicData.find(d => d.regionId === selectedVillageId) || publicData[0];

  // Filter clusters affecting the selected village
  const villageClusters = selectedVillageId 
    ? clusters.filter(c => c.villagesAffected.some(v => 
        v.toLowerCase().includes(selectedVillageId) || 
        selectedVillageId.includes(v.toLowerCase().replace(/[^a-z]/g, ""))
      ))
    : [];

  const getWaterPurityColor = (index: number) => {
    if (index >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (index >= 60) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  const getDistanceSeverityColor = (km: number) => {
    if (km >= 15) return "text-red-600 bg-red-50 border-red-100";
    if (km >= 8) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">Public Data Evidence</h1>
          <p className="text-slate-500 text-sm mt-1">
            Constituency census fact sheets used to validate citizen claims and justify prioritization decisions.
          </p>
        </div>
        <Link
          href="/dashboard/reports"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow flex items-center gap-1 self-start"
        >
          Draft briefing briefing <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Village Selector tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
            {publicData.map((village) => (
              <button
                key={village.regionId}
                onClick={() => setSelectedVillageId(village.regionId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 duration-300 ${
                  selectedVillageId === village.regionId
                    ? "bg-slate-800 text-white shadow-md shadow-slate-200"
                    : "bg-white hover:bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {village.villageName}
              </button>
            ))}
          </div>

          {activeVillage && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Fact Sheets */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Population and general */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Population</span>
                      <p className="text-xl font-extrabold text-slate-800 font-outfit mt-0.5">{activeVillage.population.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <Milestone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Road Connection</span>
                      <p className="text-xs font-bold text-slate-800 mt-1 capitalize leading-snug">{activeVillage.roads.split(",")[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Water Sources</span>
                      <p className="text-xs font-bold text-slate-800 mt-1 capitalize leading-snug">{activeVillage.waterFacilities.split("(")[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Infrastructure indicators grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Education specs */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 font-outfit flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" /> Educational Access
                    </h3>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Local Schools:</span>
                        <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded">{activeVillage.schools} Primary</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Distance to Secondary School:</span>
                        <span className={`font-bold px-2 py-0.5 rounded border ${
                          getDistanceSeverityColor(activeVillage.distanceToNearestSchoolKm)
                        }`}>{activeVillage.distanceToNearestSchoolKm} km</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Enrollment Growth (3Yr):</span>
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                          <TrendingUp className="w-3.5 h-3.5" /> +{activeVillage.enrollmentGrowthRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Healthcare specs */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 font-outfit flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-red-500" /> Healthcare Access
                    </h3>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Primary Health Clinics:</span>
                        <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded">{activeVillage.healthCenters} units</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Distance to Clinic Hospital:</span>
                        <span className={`font-bold px-2 py-0.5 rounded border ${
                          getDistanceSeverityColor(activeVillage.distanceToNearestHospitalKm)
                        }`}>{activeVillage.distanceToNearestHospitalKm} km</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Water Purity Index:</span>
                        <span className={`font-bold px-2 py-0.5 rounded border ${
                          getWaterPurityColor(activeVillage.waterPurityIndex)
                        }`}>{activeVillage.waterPurityIndex}% purity</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Census raw logs cards */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 font-outfit flex items-center gap-1.5">
                    <Database className="w-5 h-5 text-slate-500" /> Official Public Records Transcript
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50/50 p-4 border border-slate-150 rounded-2xl space-y-2">
                      <span className="font-bold text-slate-700 block">Road Link Integrity</span>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        "{activeVillage.roads}."
                      </p>
                    </div>
                    <div className="bg-slate-50/50 p-4 border border-slate-150 rounded-2xl space-y-2">
                      <span className="font-bold text-slate-700 block">Water Facilities Details</span>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        "{activeVillage.waterFacilities}. Local purification plants report an active safety index of {activeVillage.waterPurityIndex}%."
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Correlated Demands */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 font-outfit flex items-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-blue-600 animate-pulse" /> AI Demand Validation
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Matching citizen claims to official statistics</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Local Demands</span>
                    <p className="text-sm font-bold text-slate-700 mt-1 font-outfit">
                      {villageClusters.length} distinct project clusters identified in {activeVillage.villageName}
                    </p>
                  </div>

                  {/* Ranked list of affecting clusters */}
                  <div className="space-y-3">
                    {villageClusters.map((c) => (
                      <div key={c.clusterId} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {c.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-800">Priority: {c.priorityScore}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-snug line-clamp-1">
                          {c.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium flex justify-between">
                          <span>Verified citizen votes:</span>
                          <strong className="text-slate-600 font-semibold">{c.citizenCount}</strong>
                        </p>
                      </div>
                    ))}
                    {villageClusters.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6 font-medium">
                        No active clusters flagged for this village sector yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150">
                  <Link
                    href="/dashboard/priorities"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1 shadow-sm transition-colors"
                  >
                    View priority decisions <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
