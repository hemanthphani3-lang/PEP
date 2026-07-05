"use client";

import React, { useState, useEffect } from "react";
import { DBService, Cluster, PublicData, Report } from "@/services/db";
import { 
  FileText, 
  Sparkles, 
  Download, 
  CheckCircle, 
  MapPin, 
  Database,
  Building,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function ReportsPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [publicData, setPublicData] = useState<PublicData[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cls = await DBService.getClusters();
        const pData = await DBService.getPublicData();
        const reps = await DBService.getReports();
        
        setClusters(cls);
        setPublicData(pData);
        setReports(reps);
        
        if (cls.length > 0) {
          setSelectedClusterId(cls[0].clusterId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activeCluster = clusters.find(c => c.clusterId === selectedClusterId) || clusters[0];

  const activePublicData = activeCluster
    ? publicData.find(d => d.villageName === activeCluster.villagesAffected[0]) || publicData[0]
    : publicData[0];

  // PDF Exporter
  const handleDownloadPDF = async () => {
    if (!activeCluster) return;
    setIsExporting(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Page background tint
      doc.setFillColor(252, 254, 255);
      doc.rect(0, 0, 210, 297, "F");

      // Draw official header banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 38, "F");

      // Draw gold decorative trim
      doc.setFillColor(217, 119, 6); // amber-600
      doc.rect(0, 38, 210, 2, "F");

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("OFFICIAL DEVELOPMENT PRIORITIZATION BRIEFING", 15, 16);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(156, 163, 175);
      doc.text("NATIONAL DEVELOPMENT TASKFORCE | CONSTITUENCY DEMAND INTELLIGENCE", 15, 28);

      // Priority score badge (Top Right)
      doc.setFillColor(30, 41, 59); // lighter dark
      doc.rect(155, 10, 42, 18, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(217, 119, 6);
      doc.text("AI PRIORITY SCORE", 160, 15);
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text(`${activeCluster.priorityScore} / 100`, 160, 23);

      // Metadata block
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.setFont("Helvetica", "bold");
      doc.text("REPORT ID:", 15, 50);
      doc.text("DATE GENERATED:", 100, 50);
      doc.text("DEVELOPMENT CLASS:", 15, 56);
      doc.text("TARGET SECTORS:", 100, 56);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`REP-${activeCluster.clusterId.toUpperCase()}`, 45, 50);
      doc.text(new Date().toLocaleDateString(), 138, 50);
      doc.text(`${activeCluster.category} Infrastructure`, 60, 56);
      doc.text(activeCluster.villagesAffected.join(", "), 138, 56);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 62, 195, 62);

      // Section 1: Executive demand summary
      doc.setTextColor(30, 41, 59);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("1. EXECUTIVE DEMAND SUMMARY", 15, 72);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      const summaryText = `This report compiles demand intelligence for the construction/repair project: "${activeCluster.title}". To date, the platform has aggregated and validated ${activeCluster.citizenCount} distinct citizen requests for this specific work, signaling extremely high community urgency in ${activeCluster.villagesAffected.join(", ")}.`;
      doc.text(doc.splitTextToSize(summaryText, 180), 15, 79);

      // Section 2: Geo-spatial indicators
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("2. GEO-SPATIAL HEATMAP METADATA", 15, 104);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Geographic Hotspot Coordinates: ${activeCluster.location.latitude.toFixed(5)}° N, ${activeCluster.location.longitude.toFixed(5)}° E`, 20, 112);
      doc.text(`Villages Directly Affected: ${activeCluster.villagesAffected.join(", ")}`, 20, 118);
      doc.text(`Geographical isolation rating: ${activePublicData.distanceToNearestHospitalKm > 12 ? "HIGH (Emergency services delay)" : "MEDIUM"}`, 20, 124);

      // Section 3: Public evidence validation
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("3. CENSUS & PUBLIC DATA EVIDENCE", 15, 138);

      // Table Headers
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 144, 180, 7, "F");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Census Metric", 18, 149);
      doc.text("Official Log Value", 75, 149);
      doc.text("AI Validation Level", 145, 149);

      // Table Rows
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      
      // Row 1
      doc.text("Regional Population", 18, 157);
      doc.text(`${activePublicData.population.toLocaleString()} citizens`, 75, 157);
      doc.text("High demand priority factor", 145, 157);
      doc.line(15, 160, 195, 160);

      // Row 2
      doc.text("Distance to nearest Hospital", 18, 165);
      doc.text(`${activePublicData.distanceToNearestHospitalKm} km`, 75, 165);
      doc.text(activePublicData.distanceToNearestHospitalKm > 10 ? "Severe gap warning" : "Valid gap", 145, 165);
      doc.line(15, 168, 195, 168);

      // Row 3
      doc.text("Current Roads Infrastructure", 18, 173);
      doc.text(doc.splitTextToSize(activePublicData.roads, 65), 75, 173);
      doc.text("Validated access delay", 145, 173);
      doc.line(15, 178, 195, 178);

      // Section 4: Explainable AI
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("4. EXPLAINABLE AI PRIORITY BREAKDOWN", 15, 192);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const splitExplanation = doc.splitTextToSize(activeCluster.explanation, 180);
      doc.text(splitExplanation, 15, 199);

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 270, 195, 270);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Briefing generated by CivicPulse AI Decision Engine. No budget allocation recommendations are made in this document.", 15, 276);

      // Download
      doc.save(`CivicPulse_Briefing_${activeCluster.clusterId}.pdf`);

      // Add to generated reports list
      const savedReport = await DBService.addReport({
        clusterId: activeCluster.clusterId,
        clusterTitle: activeCluster.title,
        summaryText: `Prioritized Briefing for ${activeCluster.category} infrastructure project with priority score ${activeCluster.priorityScore}/100. Target Village: ${activeCluster.villagesAffected.join(", ")}.`
      });

      // Update local state
      setReports(prev => [savedReport, ...prev]);

    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">Prioritized Briefing Builder</h1>
        <p className="text-slate-500 text-sm mt-1">
          Compile official development dossiers containing citizen statistics, heatmaps, and AI justifications.
        </p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Report Config & History */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 font-outfit flex items-center gap-1.5">
                <FileCheck className="w-5 h-5 text-blue-600" /> Compile Briefing
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Select Target Project Cluster</label>
                  <select
                    value={selectedClusterId}
                    onChange={(e) => setSelectedClusterId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 font-semibold"
                  >
                    {clusters.map((c) => (
                      <option key={c.clusterId} value={c.clusterId}>
                        ({c.priorityScore}/100) {c.category} - {c.villagesAffected.join(", ")}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isExporting || !selectedClusterId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-blue-150 transition-colors flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download PDF Report
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Briefing History Logs</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {reports.map((rep) => (
                  <div key={rep.reportId} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold uppercase">
                      <span>ID: {rep.reportId}</span>
                      <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {new Date(rep.generatedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 leading-snug line-clamp-1">{rep.clusterTitle}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{rep.summaryText}</p>
                  </div>
                ))}
                {reports.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6 font-medium">No reports downloaded yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right: On-screen preview */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Header info */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold font-outfit">Document Briefing Preview</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Preview Mode
              </span>
            </div>

            {/* On-screen paper preview */}
            <div className="p-8 bg-slate-50 flex-1 border-b border-slate-150 font-serif text-slate-800 space-y-6 text-sm">
              <div className="bg-white border border-slate-250 p-6 sm:p-10 shadow-lg rounded-xl space-y-6 relative overflow-hidden">
                {/* Official seal mock */}
                <div className="absolute top-8 right-8 border-4 border-amber-600/30 rounded-full h-16 w-16 flex items-center justify-center select-none rotate-12">
                  <span className="text-[9px] font-extrabold text-amber-600/40 text-center uppercase tracking-tighter">OFFICIAL<br />SEAL</span>
                </div>

                {/* Banner */}
                <div className="border-b-4 border-amber-600 pb-4 flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-black uppercase tracking-wider text-slate-900 font-sans">
                      Official Development Prioritization Briefing
                    </h2>
                    <p className="text-[10px] text-slate-500 font-sans font-semibold tracking-wide mt-1">
                      CONSTITUENCY DEMAND INTELLIGENCE BOARD | NATIONAL TASKFORCE
                    </p>
                  </div>
                  <div className="text-right font-sans">
                    <span className="text-[9px] font-bold text-amber-600 block">PRIORITY VALUE</span>
                    <strong className="text-2xl font-black text-slate-900 font-outfit">{activeCluster ? activeCluster.priorityScore : 92}/100</strong>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-600 border-b border-slate-100 pb-4">
                  <div>
                    <p><strong>REPORT ID:</strong> REP-{activeCluster ? activeCluster.clusterId.toUpperCase() : "N/A"}</p>
                    <p className="mt-1"><strong>DEVELOPMENT CATEGORY:</strong> {activeCluster ? activeCluster.category : "Roads"} Infrastructure</p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p><strong>DATE:</strong> {new Date().toLocaleDateString()}</p>
                    <p className="mt-1"><strong>AFFECTED REGIONS:</strong> {activeCluster ? activeCluster.villagesAffected.join(", ") : "Dharmapuri"}</p>
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  
                  {/* Executive Summary */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-950 uppercase font-sans tracking-wide">1. Executive Demand Analysis</h3>
                    <p className="text-xs leading-relaxed text-slate-700 italic">
                      "This report aggregates local priority metrics for target works under reference. The intelligence engine has verified a citizen consensus count of {activeCluster ? activeCluster.citizenCount : 0} votes. Direct local feedback tags key defects requiring immediate government interventions."
                    </p>
                  </div>

                  {/* Public Evidence */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-950 uppercase font-sans tracking-wide">2. Census Evidence Validation</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px] font-sans">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b border-slate-200 text-slate-600">
                            <th className="p-2">Public Metric</th>
                            <th className="p-2">Official Value</th>
                            <th className="p-2 text-right">Severity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          <tr>
                            <td className="p-2">Village Population Size</td>
                            <td className="p-2">{(activePublicData ? activePublicData.population : 8200).toLocaleString()}</td>
                            <td className="p-2 text-right">High Density Factor</td>
                          </tr>
                          <tr>
                            <td className="p-2">Travel Distance to Nearest Hospital</td>
                            <td className="p-2">{activePublicData ? activePublicData.distanceToNearestHospitalKm : 14.5} km</td>
                            <td className="p-2 text-right">{activePublicData && activePublicData.distanceToNearestHospitalKm > 10 ? "Severe Gap Warning" : "Standard Gap"}</td>
                          </tr>
                          <tr>
                            <td className="p-2">Primary Access Link Integrity</td>
                            <td className="p-2 truncate max-w-[200px]">{activePublicData ? activePublicData.roads : "Mud track"}</td>
                            <td className="p-2 text-right">Deficient infrastructure</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Explainable AI */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-slate-950 uppercase font-sans tracking-wide">3. Explainable Algorithmic Reasonings</h3>
                    <p className="text-xs leading-relaxed text-slate-700">
                      {activeCluster ? activeCluster.explanation : "Methodology reasoning details."}
                    </p>
                  </div>

                </div>

                {/* Sign-off */}
                <div className="pt-8 border-t border-slate-150 flex justify-between items-center text-[10px] font-sans text-slate-400">
                  <span>CivicPulse Decision briefing</span>
                  <span className="font-mono">Generated via Gemini 2.5 Flash</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
