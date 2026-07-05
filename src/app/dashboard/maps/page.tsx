"use client";

import React, { useState, useEffect, useRef } from "react";
import { DBService, Cluster, Submission } from "@/services/db";
import { 
  MapPin, 
  Sparkles, 
  Layers, 
  Users, 
  TrendingUp, 
  Map as MapIcon, 
  Info,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoConfig } from "@/components/DemoConfigContext";
import Link from "next/link";

export default function MapsPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [loading, setLoading] = useState(true);
  const { mapsKey } = useDemoConfig();
  const mapIframeRef = useRef<HTMLIFrameElement>(null);

  const syncClustersToMap = () => {
    if (mapIframeRef.current?.contentWindow && clusters.length > 0) {
      mapIframeRef.current.contentWindow.postMessage({
        type: "init",
        mode: "display"
      }, "*");
      mapIframeRef.current.contentWindow.postMessage({
        type: "update-clusters",
        clusters: clusters,
        selectedId: selectedCluster?.clusterId || null
      }, "*");
    }
  };

  // Sync state changes (like selecting a new cluster) to map iframe
  useEffect(() => {
    if (mapIframeRef.current?.contentWindow && clusters.length > 0) {
      mapIframeRef.current.contentWindow.postMessage({
        type: "update-clusters",
        clusters: clusters,
        selectedId: selectedCluster?.clusterId || null
      }, "*");
    }
  }, [selectedCluster, clusters]);

  // Listen to cluster selection events from map iframe markers
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.type === "select-cluster") {
        const found = clusters.find(c => c.clusterId === data.clusterId);
        if (found) {
          setSelectedCluster(found);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [clusters]);

  useEffect(() => {
    const loadData = async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        const cls = await DBService.getClusters();
        const subs = await DBService.getSubmissions();
        setClusters(cls);
        setSubmissions(subs);
        
        // Auto-select the highest priority cluster on mount for display (only if none is active)
        if (cls.length > 0 && !selectedCluster) {
          setSelectedCluster(cls[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };
    loadData();

    const interval = setInterval(() => {
      loadData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedCluster]);

  const getPriorityColorClass = (score: number) => {
    if (score >= 90) return { bg: "bg-red-500", text: "text-red-700", border: "border-red-200", badge: "bg-red-50 text-red-700 border-red-100", hex: "#ef4444" };
    if (score >= 80) return { bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-50 text-orange-700 border-orange-100", hex: "#f97316" };
    if (score >= 70) return { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-50 text-amber-700 border-amber-100", hex: "#f59e0b" };
    return { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-700 border-emerald-100", hex: "#10b981" };
  };

  // Convert coordinate maps relative to constituency viewport
  // Lng range: 78.5 -> 0%, 79.0 -> 100%
  // Lat range: 13.4 -> 0%, 12.5 -> 100%
  const getMapCoords = (lat: number, lng: number) => {
    // Visakhapatnam bounds (83.1 to 83.5 longitude, 18.0 to 17.6 latitude)
    const x = ((lng - 83.1) / 0.4) * 100;
    const y = ((18.0 - lat) / 0.4) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const constituencyVillages = [
    { name: "Bhimili", lat: 17.8860, lng: 83.4470 },
    { name: "Gajuwaka", lat: 17.6890, lng: 83.2080 },
    { name: "Srungavarapukota", lat: 17.9280, lng: 83.1440 },
    { name: "Visakhapatnam East", lat: 17.7280, lng: 83.3320 }
  ];

  const selectedClusterSubmissions = selectedCluster
    ? submissions.filter(s => s.clusterId === selectedCluster.clusterId)
    : [];

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">Geo-Spatial Demand Heatmap</h1>
        <p className="text-slate-500 text-sm mt-1">
          Geographic clustering of citizen grievances color-coded by AI-prioritization scores.
        </p>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* 1. Map Panel */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-[500px] relative flex flex-col">
            
            {/* Header info */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold font-outfit">MP Constituency Heatmap</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Critical (≥90)</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> High (80-89)</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium (70-79)</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Low (&lt;70)</span>
              </div>
            </div>

            {/* Leaflet OSM Interactive Map */}
            <div className="flex-1 relative overflow-hidden bg-slate-100">
              <iframe
                ref={mapIframeRef}
                src="/map.html"
                className="w-full h-full border-0"
                onLoad={syncClustersToMap}
              />
            </div>
          </div>

          {/* 2. Slide Panel / Details */}
          <div className="lg:col-span-4 flex flex-col h-[500px]">
            <AnimatePresence mode="wait">
              {selectedCluster ? (
                <motion.div
                  key={selectedCluster.clusterId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full overflow-y-auto"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-block border px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          getPriorityColorClass(selectedCluster.priorityScore).badge
                        }`}>
                          Priority: {selectedCluster.priorityScore}/100
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {selectedCluster.category}
                        </span>
                      </div>
                      <h3 className="font-outfit font-extrabold text-slate-800 text-sm mt-2 leading-snug">
                        {selectedCluster.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        Constituency sector: {selectedCluster.villagesAffected.join(", ")}
                      </p>
                    </div>

                    {/* AI explanation block */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Explanation</span>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                        "{selectedCluster.explanation.split("\n")[0]}" {/* Short summary line */}
                      </p>
                    </div>

                    {/* Submissions citation */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Citizen Citations ({selectedClusterSubmissions.length})
                      </span>
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                        {selectedClusterSubmissions.map((s) => (
                          <div key={s.submissionId} className="p-2.5 border border-slate-100 rounded-lg bg-white shadow-inner-sm text-[11px] leading-snug text-slate-600">
                            <strong>{s.userName}:</strong> "{s.text}"
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Supporting Images */}
                    {selectedCluster.images.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hotspot visual evidence</span>
                        <div className="flex gap-2">
                          {selectedCluster.images.map((img, i) => (
                            <img key={i} src={img} alt="defect" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    <Link
                      href={`/dashboard/clusters`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-[10px] transition-colors text-center shadow flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details Board
                    </Link>
                    <Link
                      href="/dashboard/priorities"
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-[10px] transition-colors text-center flex items-center justify-center gap-1"
                    >
                      Priority Engine <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-center h-full text-slate-400 text-xs text-center font-medium">
                  Select a hotspot pulsar on the map to inspect AI priorities.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
