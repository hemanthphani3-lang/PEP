"use client";

import React, { useState, useEffect } from "react";
import { DBService, Submission } from "@/services/db";
import { translateTextWithSarvam, speakText } from "@/services/sarvam";
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
  Loader2
} from "lucide-react";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Sarvam Translation and Speech states
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});
  const [speakingIds, setSpeakingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      const phone = localStorage.getItem("civicpulse_citizen_phone");
      if (phone) {
        const data = await DBService.getSubmissionsByPhone(phone);
        setSubmissions(data);
      }
      setLoading(false);
    };
    fetchSubmissions();
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
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
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

                  <p className="text-slate-700 text-sm font-medium mb-3">
                    {sub.text}
                  </p>

                  {sub.translatedText && sub.translatedText !== sub.text && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-3">
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <Sparkles className="w-2.5 h-2.5" /> AI Translation (English)
                      </span>
                      <p className="text-[11px] italic text-slate-600">
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
                      <p className="text-[11px] font-medium text-purple-950">
                        {translatedTexts[sub.submissionId]}
                      </p>
                    </div>
                  )}

                  {sub.audioUrl && (
                    <div className="mb-3">
                      <audio controls src={sub.audioUrl} className="w-full h-8" />
                    </div>
                  )}

                  {/* Translate & listen controls */}
                  {sub.language && sub.language.toLowerCase() !== "english" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleTranslateCard(sub)}
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
                        onClick={() => handleSpeakCard(sub)}
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {sub.villageName}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Under Review
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
