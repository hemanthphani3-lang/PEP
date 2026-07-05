"use client";

import React, { useState, useEffect } from "react";
import { DBService, Cluster, Submission } from "@/services/db";
import { 
  Layers, 
  MapPin, 
  Users, 
  ChevronRight, 
  FileText, 
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Eye,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CATEGORIES = [
  "Roads", "Water", "Healthcare", "Education", "Sanitation", 
  "Street Lights", "Employment", "Agriculture", "Public Safety", "Environment"
];

export default function DemandClusters() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [clusterSubmissions, setClusterSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const loadData = async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        const cls = await DBService.getClusters();
        const subs = await DBService.getSubmissions();
        setClusters(cls);
        setSubmissions(subs);
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
  }, []);

  // Fetch submissions for a specific cluster when selected
  const handleViewDetails = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    // Find all submissions matching this clusterId
    const matched = submissions.filter(s => s.clusterId === cluster.clusterId);
    setClusterSubmissions(matched);
  };

  // Quick PDF generator for hackathon wow-factor
  const handleExportPDF = (cluster: Cluster) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Draw header block
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("CivicPulse AI - Demand Briefing", 15, 18);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Local MP Constituency Portal`, 15, 30);

    // Draw Priority badge
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(155, 12, 40, 16, "F");
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("PRIORITY INDEX", 160, 18);
    doc.setFontSize(14);
    doc.text(`${cluster.priorityScore}/100`, 166, 24);

    // Main section
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text("Project Title:", 15, 55);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(cluster.title, 180), 15, 62);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Project Specifications", 15, 80);
    
    // Specifications table
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Development Category: ${cluster.category}`, 20, 90);
    doc.text(`Supporting Citizens: ${cluster.citizenCount} verified voters`, 20, 96);
    doc.text(`Sectors/Villages Affected: ${cluster.villagesAffected.join(", ")}`, 20, 102);
    doc.text(`Status: ${cluster.status}`, 20, 108);

    // AI Explanation
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("AI Priority Explanations", 15, 122);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    const splitExplanation = doc.splitTextToSize(cluster.explanation, 180);
    doc.text(splitExplanation, 15, 129);

    // Add a professional civic footer
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 270, 195, 270);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("CivicPulse AI Government Prioritization Dashboard. Google Hackathon 2026.", 15, 276);

    doc.save(`CivicPulse-Report-${cluster.clusterId}.pdf`);
  };

  const categories = ["All", ...CATEGORIES];

  // Filtering logic
  const filteredClusters = clusters.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.villagesAffected.some(v => v.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">Active Demand Clusters</h1>
          <p className="text-slate-500 text-sm mt-1">
            Grouped citizen demands representing local constituency infrastructure priorities.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/priorities"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-100 flex items-center gap-1"
          >
            Decisions Pipeline <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by cluster title or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 font-medium bg-slate-50/50"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider shrink-0 mr-1">Filter:</span>
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 duration-200 ${
                categoryFilter === cat
                  ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
          {categories.length > 7 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 p-1.5 rounded-lg font-semibold text-slate-600"
            >
              <option value="All">More...</option>
              {categories.slice(7).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Grid of Clusters */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredClusters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClusters.map((cluster) => {
            const isHighPriority = cluster.priorityScore >= 80;
            return (
              <motion.div
                layout
                key={cluster.clusterId}
                className={`bg-white rounded-2xl border ${
                  isHighPriority ? "border-amber-250 ring-1 ring-amber-100/50 shadow-amber-50" : "border-slate-200"
                } shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
              >
                {/* Image header if exists */}
                {cluster.images.length > 0 ? (
                  <div className="min-h-[9rem] relative">
                    <img src={cluster.images[0]} alt={cluster.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow">
                      {cluster.category}
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" /> {cluster.villagesAffected.join(", ")}
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {cluster.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                      <MapPin className="w-3.5 h-3.5" /> {cluster.villagesAffected.join(", ")}
                    </span>
                  </div>
                )}

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 font-outfit" title={cluster.title}>
                      {cluster.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 font-sans leading-relaxed">
                      {cluster.explanation.split("\n")[0]} {/* First line summary */}
                    </p>
                  </div>

                  {/* Metadata Indicators */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{cluster.citizenCount}</p>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase">Supporters</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isHighPriority ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{cluster.priorityScore}/100</p>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase">Priority</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    onClick={() => handleViewDetails(cluster)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-350 text-[10px] font-bold text-slate-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                  <button
                    onClick={() => handleExportPDF(cluster)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> Report
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-250 rounded-2xl p-10 text-center text-slate-500">
          No clusters found matching filter rules.
        </div>
      )}

      {/* Cluster Details Side Modal/Drawer */}
      <AnimatePresence>
        {selectedCluster && (
          <div 
            onClick={() => setSelectedCluster(null)}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: 450, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 450, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white shadow-2xl h-full p-6 sm:p-8 overflow-y-auto flex flex-col justify-between border-l border-slate-200"
            >
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="pb-4 border-b border-slate-150 flex items-center justify-between">
                  <div>
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                      {selectedCluster.category}
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 font-outfit mt-1.5 leading-snug">{selectedCluster.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedCluster(null)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Priority Highlight */}
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <div className="text-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Priority Index</span>
                    <p className="text-lg font-extrabold text-blue-600 mt-0.5">{selectedCluster.priorityScore}/100</p>
                  </div>
                  <div className="text-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Citizen Voices</span>
                    <p className="text-lg font-extrabold text-slate-800 mt-0.5">{selectedCluster.citizenCount}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sectors</span>
                    <p className="text-xs font-bold text-slate-700 truncate mt-1">{selectedCluster.villagesAffected.join(", ")}</p>
                  </div>
                </div>

                {/* Priority Explanation */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Priority Decision explanation</h3>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 text-slate-700 text-xs rounded-2xl leading-relaxed whitespace-pre-line font-medium shadow-inner">
                    {selectedCluster.explanation}
                  </div>
                </div>

                {/* Member Submissions List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Contributing Citizen Grievances</span>
                    <span className="text-slate-500 font-mono">({clusterSubmissions.length} posts)</span>
                  </h3>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {clusterSubmissions.map((sub) => (
                      <div key={sub.submissionId} className="p-3.5 border border-slate-150 rounded-xl bg-white space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-800">{sub.userName}</span>
                          <span className="text-slate-400 font-medium">{new Date(sub.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 italic">
                          "{sub.text}"
                        </p>
                        {sub.translatedText !== sub.text && (
                          <p className="text-[10px] text-slate-400">
                            <strong>English translation:</strong> {sub.translatedText}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Evidence Grid */}
                {selectedCluster.images.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual Attachments</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedCluster.images.map((imgUrl, i) => (
                        <div key={i} className="h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                          <img src={imgUrl} alt="defects" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-slate-150 flex gap-3">
                <button
                  onClick={() => handleExportPDF(selectedCluster)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow"
                >
                  <FileText className="w-4 h-4" /> Download PDF Report
                </button>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
                >
                  Close Drawer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
