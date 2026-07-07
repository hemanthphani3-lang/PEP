"use client";

import React, { useState, useEffect, useRef } from "react";
import { DBService, Submission } from "@/services/db";
import { translateTextWithSarvam, speakText } from "@/services/sarvam";
import { AudioPlayer } from "@/components/AudioPlayer";
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Sparkles, 
  MessageSquare,
  AlertCircle,
  Languages,
  Volume2,
  VolumeX,
  Loader2,
  X,
  CheckCircle2,
  Map,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicData, setPublicData] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const mapIframeRef = useRef<HTMLIFrameElement>(null);

  // Sarvam Translation and Speech states
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});
  const [speakingIds, setSpeakingIds] = useState<Record<string, boolean>>({});
  const [activeLang, setActiveLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveLang(localStorage.getItem("civicpulse_lang") || "en");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const phone = localStorage.getItem("civicpulse_citizen_phone");
      if (phone) {
        const data = await DBService.getSubmissionsByPhone(phone);
        setSubmissions(data);
      }
      const pd = await DBService.getPublicData();
      setPublicData(pd);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleTranslateCard = async (sub: Submission) => {
    const targetLang = sub.language || "Telugu";
    if (targetLang.toLowerCase() === "english") return;

    setTranslatingIds((prev) => ({ ...prev, [sub.submissionId]: true }));
    try {
      const textToTranslate = `Grievance regarding ${sub.category} in ${sub.villageName} is currently Under Review. Details: ${sub.translatedText || sub.text}`;
      const result = await translateTextWithSarvam(textToTranslate, "English", targetLang);
      setTranslatedTexts((prev) => ({ ...prev, [sub.submissionId]: result }));
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setTranslatingIds((prev) => ({ ...prev, [sub.submissionId]: false }));
    }
  };

  const handleSpeakCard = async (sub: Submission) => {
    const targetLang = sub.language || "Telugu";
    
    // Stop if already speaking
    if (speakingIds[sub.submissionId]) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingIds((prev) => ({ ...prev, [sub.submissionId]: false }));
      return;
    }

    const textToSpeak = translatedTexts[sub.submissionId] || sub.text || sub.translatedText;
    
    setSpeakingIds((prev) => ({ ...prev, [sub.submissionId]: true }));
    try {
      await speakText(
        textToSpeak,
        targetLang,
        () => {}, // onStart
        () => setSpeakingIds((prev) => ({ ...prev, [sub.submissionId]: false })) // onEnd
      );
    } catch (err) {
      console.error("Speak error:", err);
      setSpeakingIds((prev) => ({ ...prev, [sub.submissionId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Find village demographics for the details drawer
  const selectedVillageStats = publicData.find(
    (d) => d.villageName === selectedSub?.villageName
  );

  // Stepper timeline configurations
  const timelineSteps = [
    { title: "Grievance Logged", desc: "Submitted by citizen and recorded in public register.", done: true },
    { title: "AI Categorization & Context Check", desc: `Categorized under ${selectedSub?.category} in ${selectedSub?.villageName}. Severity analyzed.`, done: true },
    { title: "Verification Process", desc: "Under review by the MP administrative office.", done: true, active: true },
    { title: "Constituency Fund Allocation", desc: "Reviewing local developmental budgets.", done: false },
    { title: "Resolution & Inspection", desc: "Work completion check and resolution signed.", done: false }
  ];

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-outfit tracking-tight">
          My Submissions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the status of your reported grievances.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No submissions yet</h3>
          <p className="text-sm text-slate-500 mt-2">
            You haven't submitted any local issues. Make your voice heard!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((sub) => {
            const dateStr = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            }) : 'Unknown Date';

            return (
              <div 
                key={sub.submissionId}
                onClick={() => setSelectedSub(sub)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
              >
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] font-extrabold bg-blue-50 border border-blue-150 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> {sub.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {dateStr}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm font-medium mb-3 line-clamp-3">
                    {sub.text}
                  </p>

                  {sub.translatedText && sub.translatedText !== sub.text && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-3">
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <Sparkles className="w-2.5 h-2.5" /> AI Translation (English)
                      </span>
                      <p className="text-[11px] italic text-slate-600 line-clamp-2">
                        "{sub.translatedText}"
                      </p>
                    </div>
                  )}

                  {/* Back-Translation View */}
                  {translatedTexts[sub.submissionId] && (
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mb-3">
                      <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <Languages className="w-2.5 h-2.5" /> Voice Lang Review ({sub.language})
                      </span>
                      <p className="text-[11px] font-medium text-purple-950 line-clamp-2">
                        {translatedTexts[sub.submissionId]}
                      </p>
                    </div>
                  )}

                  {sub.audioUrl && (
                    <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                      <AudioPlayer src={sub.audioUrl} />
                    </div>
                  )}

                  {/* Translate & listen controls */}
                  {sub.language && sub.language.toLowerCase() !== "english" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTranslateCard(sub);
                        }}
                        disabled={translatingIds[sub.submissionId]}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-purple-700 text-[10px] font-bold transition-all disabled:opacity-50"
                        title={`Translate card details back into ${sub.language}`}
                      >
                        {translatingIds[sub.submissionId] ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Languages className="w-3 h-3" />
                        )}
                        Translate ({sub.language})
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakCard(sub);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                          speakingIds[sub.submissionId]
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {speakingIds[sub.submissionId] ? (
                          <>
                            <VolumeX className="w-3 h-3 animate-pulse" /> Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" /> Listen
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {sub.imageUrl && (
                  <div className="h-40 w-full border-t border-slate-100 overflow-hidden relative">
                    <img 
                      src={sub.imageUrl} 
                      alt="Defect" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {sub.villageName}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded-md uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Under Review
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sliding Details Drawer */}
      <AnimatePresence>
        {selectedSub && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end"
            onClick={() => setSelectedSub(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md h-full bg-white shadow-2xl overflow-y-auto flex flex-col border-l border-slate-200 relative"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-extrabold bg-blue-50 border border-blue-150 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 w-fit mb-1">
                    <Tag className="w-2.5 h-2.5" /> {selectedSub.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">Grievance Details</h3>
                </div>
                <button 
                  onClick={() => setSelectedSub(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 flex-grow">
                {/* Photo */}
                {selectedSub.imageUrl && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                    <img src={selectedSub.imageUrl} alt="Defect" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Submitter info & Date */}
                <div className="flex items-center justify-between p-3 border border-slate-150 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                      {selectedSub.userName.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">{selectedSub.userName}</h4>
                      <p className="text-[9px] text-slate-400 font-medium">Verified Citizen</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(selectedSub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Main grievance text */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Original Text Description</span>
                  <p className="text-slate-800 text-sm font-medium bg-slate-50 p-4 border border-slate-200/50 rounded-2xl leading-relaxed">
                    "{selectedSub.text}"
                  </p>
                </div>

                {/* AI Summary Callout */}
                {selectedSub.summary && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 space-y-2">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Priority Summary
                    </span>
                    <p className="text-[11px] font-semibold text-slate-750 leading-relaxed italic">
                      "{selectedSub.summary}"
                    </p>
                  </div>
                )}

                {/* Stepper Timeline */}
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Live Status Timeline</span>
                  <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6 py-2">
                    {timelineSteps.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                          step.active 
                            ? "bg-amber-500 border-amber-200 animate-pulse scale-110" 
                            : step.done 
                              ? "bg-emerald-500 border-emerald-200" 
                              : "bg-slate-200 border-white"
                        } flex items-center justify-center`}>
                          {step.done && !step.active && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${step.active ? "text-amber-600" : step.done ? "text-slate-800" : "text-slate-400"}`}>
                            {step.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Details & Geotag */}
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Geotag Coordinates</span>
                  
                  {/* Real Leaflet Map iframe */}
                  <div className="w-full h-44 rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-slate-100 relative">
                    <iframe
                      ref={mapIframeRef}
                      src="/map.html"
                      className="w-full h-full border-0"
                      onLoad={() => {
                        if (mapIframeRef.current?.contentWindow) {
                          mapIframeRef.current.contentWindow.postMessage({
                            type: "init",
                            mode: "pick",
                            lat: selectedSub.latitude,
                            lng: selectedSub.longitude
                          }, "*");
                        }
                      }}
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-150/70 flex items-center justify-between text-[9px] font-bold font-mono text-slate-600 shadow-sm pointer-events-none z-[1000]">
                      <span className="flex items-center gap-0.5"><Map className="w-3 h-3 text-slate-400" /> Lat: {selectedSub.latitude.toFixed(4)}</span>
                      <span>Lng: {selectedSub.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Village Context Demographics */}
                {selectedVillageStats && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Constituency Context ({selectedSub.villageName})</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-slate-150 rounded-xl bg-slate-50/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Village Population</span>
                        <span className="text-xs font-extrabold text-slate-700">{selectedVillageStats.population.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="p-3 border border-slate-150 rounded-xl bg-slate-50/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Water Purity Index</span>
                        <span className="text-xs font-extrabold text-emerald-600">{selectedVillageStats.waterPurityIndex}/100</span>
                      </div>
                      <div className="p-3 border border-slate-150 rounded-xl bg-slate-50/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Local Schools</span>
                        <span className="text-xs font-extrabold text-slate-700">{selectedVillageStats.schools} schools</span>
                      </div>
                      <div className="p-3 border border-slate-150 rounded-xl bg-slate-50/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Nearest Hospital</span>
                        <span className="text-xs font-extrabold text-slate-700">{selectedVillageStats.distanceToNearestHospitalKm} km</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
