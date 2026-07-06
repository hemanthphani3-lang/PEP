"use client";

import React, { useState, useEffect } from "react";
import { DBService, Submission } from "@/services/db";
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Sparkles, 
  MessageSquare,
  AlertCircle
} from "lucide-react";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

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
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1">
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
                        <Sparkles className="w-2.5 h-2.5" /> AI Translation
                      </span>
                      <p className="text-[11px] italic text-slate-505">
                        "{sub.translatedText}"
                      </p>
                    </div>
                  )}

                  {sub.audioUrl && (
                    <div className="mb-3">
                      <audio controls src={sub.audioUrl} className="w-full h-8" />
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
