"use client";

import React, { useState, useEffect } from "react";
import { DBService, Submission, Cluster } from "@/services/db";
import { translateTextWithSarvam, speakText } from "@/services/sarvam";
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Search,
  Layers,
  Sparkles,
  AlertTriangle,
  Languages,
  Volume2,
  VolumeX,
  Loader2
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "All", "Roads", "Water", "Healthcare", "Education", "Sanitation", 
  "Street Lights", "Employment", "Agriculture", "Public Safety", "Environment"
];

export default function SuggestionsFeed() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [downvotes, setDownvotes] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({});

  // Active language and translate/speech states
  const [activeLang, setActiveLang] = useState("en");
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});
  const [speakingIds, setSpeakingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadLang = () => {
      setActiveLang(localStorage.getItem("civicpulse_lang") || "en");
    };
    loadLang();
    window.addEventListener("language-change", loadLang);
    return () => {
      window.removeEventListener("language-change", loadLang);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subsData = await DBService.getSubmissions();
        const clustersData = await DBService.getClusters();
        setSubmissions(subsData);
        setClusters(clustersData);

        // Load vote counts
        const storedUpvotes = localStorage.getItem("civicpulse_upvotes_counts");
        const storedDownvotes = localStorage.getItem("civicpulse_downvotes_counts");
        
        const ups = storedUpvotes ? JSON.parse(storedUpvotes) : {};
        const downs = storedDownvotes ? JSON.parse(storedDownvotes) : {};
        
        subsData.forEach(s => {
          if (ups[s.submissionId] === undefined) {
            ups[s.submissionId] = Math.floor(Math.random() * 12) + 5;
          }
          if (downs[s.submissionId] === undefined) {
            downs[s.submissionId] = Math.floor(Math.random() * 4);
          }
        });
        localStorage.setItem("civicpulse_upvotes_counts", JSON.stringify(ups));
        localStorage.setItem("civicpulse_downvotes_counts", JSON.stringify(downs));
        setUpvotes(ups);
        setDownvotes(downs);

        // Load user vote choices
        const storedUserVotes = localStorage.getItem("civicpulse_uservotes");
        const userVotesObj = storedUserVotes ? JSON.parse(storedUserVotes) : {};
        setUserVotes(userVotesObj);

      } catch (err) {
        console.error("Error fetching suggestions data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTranslateCard = async (sub: Submission) => {
    const langMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      te: "Telugu",
      ta: "Tamil"
    };
    const targetLangName = langMap[activeLang] || "English";
    if (activeLang === "en") return;

    setTranslatingIds((prev) => ({ ...prev, [sub.submissionId]: true }));
    try {
      const textToTranslate = `Grievance category: ${sub.category} in ${sub.villageName}. Details: ${sub.translatedText || sub.text}`;
      const result = await translateTextWithSarvam(textToTranslate, "English", targetLangName);
      setTranslatedTexts((prev) => ({ ...prev, [sub.submissionId]: result }));
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setTranslatingIds((prev) => ({ ...prev, [sub.submissionId]: false }));
    }
  };

  const handleSpeakCard = async (sub: Submission) => {
    const langMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      te: "Telugu",
      ta: "Tamil"
    };
    const targetLangName = langMap[activeLang] || "English";

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
        targetLangName,
        () => {}, // onStart
        () => setSpeakingIds((prev) => ({ ...prev, [sub.submissionId]: false })) // onEnd
      );
    } catch (err) {
      console.error("Speak error:", err);
      setSpeakingIds((prev) => ({ ...prev, [sub.submissionId]: false }));
    }
  };

  const handleVote = (id: string, direction: "up" | "down") => {
    const currentVote = userVotes[id] || null;

    let upDiff = 0;
    let downDiff = 0;
    let nextVote: "up" | "down" | null = direction;

    if (currentVote === direction) {
      // Undo current vote
      if (direction === "up") {
        upDiff = -1;
      } else {
        downDiff = -1;
      }
      nextVote = null;
    } else {
      // Placing new vote or changing direction
      if (direction === "up") {
        upDiff = 1;
        if (currentVote === "down") {
          downDiff = -1; // remove downvote
        }
      } else {
        downDiff = 1;
        if (currentVote === "up") {
          upDiff = -1; // remove upvote
        }
      }
    }

    setUpvotes(prev => {
      const nextUps = { ...prev, [id]: Math.max(0, (prev[id] || 0) + upDiff) };
      localStorage.setItem("civicpulse_upvotes_counts", JSON.stringify(nextUps));
      return nextUps;
    });

    setDownvotes(prev => {
      const nextDowns = { ...prev, [id]: Math.max(0, (prev[id] || 0) + downDiff) };
      localStorage.setItem("civicpulse_downvotes_counts", JSON.stringify(nextDowns));
      return nextDowns;
    });

    setUserVotes(prevUserVotes => {
      const nextUserVotes = { ...prevUserVotes, [id]: nextVote };
      localStorage.setItem("civicpulse_uservotes", JSON.stringify(nextUserVotes));
      return nextUserVotes;
    });
  };

  // Filter logic for submissions
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.villageName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === "All" || 
      s.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-slate-800 flex items-center gap-2">
              <span>Constituency Suggestion Feed</span>
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-150 font-bold uppercase tracking-wider">
                Public Transparency
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 break-words">
              Browse, search, and support infrastructure requests submitted by other citizens in Visakhapatnam (AP-04).
            </p>
          </div>
          <Link
            href="/citizen/newsubmit"
            className="w-full sm:w-auto self-start md:self-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 text-center"
          >
            File New Grievance
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name, village, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            {/* Total Indicator */}
            <div className="flex items-center justify-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500">
              Showing {filteredSubmissions.length} of {submissions.length} suggestions
            </div>
          </div>

          {/* Category Badges Filter */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Filter by Topic:</span>
            <div className="flex overflow-x-auto pb-1 flex-nowrap sm:flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two-Column Layout (Left: Suggestions Feed, Right: Priority Rankings) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Grievances list (7 cols) */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-500">Retrieving public feed...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-700">No suggestions match your filters</h3>
                <p className="text-xs text-slate-400 mt-1">Try resetting the topic filter or typing a different search query.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSubmissions.map((sub) => {
                  const formattedDate = new Date(sub.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  const userVoteState = userVotes[sub.submissionId] || null;

                  return (
                    <div 
                      key={sub.submissionId}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-800">{sub.userName}</p>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {formattedDate}
                            </p>
                          </div>
                          
                          <span className="text-[9px] font-extrabold bg-blue-50 border border-blue-150 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {sub.category}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-slate-600 text-xs leading-relaxed font-medium">
                            {sub.text}
                          </p>
                          {sub.translatedText && sub.translatedText !== sub.text && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1 mt-2">
                              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Translated (UK English)
                              </span>
                              <p className="text-[11px] italic text-slate-505 leading-relaxed">
                                "{sub.translatedText}"
                              </p>
                            </div>
                          )}
                          {sub.audioUrl && (
                            <div className="mt-3">
                              <span className="text-[10px] font-bold text-slate-500 block mb-1">Original Voice Recording</span>
                              <audio controls src={sub.audioUrl} className="w-full h-8" />
                            </div>
                          )}

                          {/* Back-Translation View */}
                          {translatedTexts[sub.submissionId] && (
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mt-2">
                              <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                                <Languages className="w-2.5 h-2.5" /> translation ({activeLang.toUpperCase()})
                              </span>
                              <p className="text-[11px] font-medium text-purple-950">
                                {translatedTexts[sub.submissionId]}
                              </p>
                            </div>
                          )}

                          {/* Translate & listen controls */}
                          {activeLang !== "en" && (
                            <div className="flex gap-2 pt-2 border-t border-slate-100/50 mt-3">
                              <button
                                onClick={() => handleTranslateCard(sub)}
                                disabled={translatingIds[sub.submissionId]}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-purple-700 text-[10px] font-bold transition-all disabled:opacity-50"
                              >
                                {translatingIds[sub.submissionId] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Languages className="w-3 h-3" />
                                )}
                                Translate ({activeLang.toUpperCase()})
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
                          <div className="relative h-36 sm:h-44 w-full rounded-xl overflow-hidden border border-slate-200 mt-2">
                            <img 
                              src={sub.imageUrl} 
                              alt="Submited defect evidence" 
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                            />
                          </div>
                        )}
                      </div>

                      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-slate-500 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sub.villageName}</span>
                        </div>

                        {/* Interactive Upvote/Downvote Pill */}
                        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-2.5 py-0.5 shadow-sm">
                          {/* Upvote Button & Count */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVote(sub.submissionId, "up")}
                              className={`p-1.5 rounded-lg transition-all ${
                                userVoteState === "up"
                                  ? "text-emerald-600 bg-emerald-50 scale-105"
                                  : "text-slate-400 hover:text-emerald-600 hover:bg-slate-50"
                              }`}
                              title="Upvote"
                            >
                              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <span className={`text-[10px] font-extrabold ${userVoteState === "up" ? "text-emerald-600" : "text-slate-500"}`}>
                              {upvotes[sub.submissionId] || 0}
                            </span>
                          </div>

                          <div className="h-3.5 w-px bg-slate-200" />

                          {/* Downvote Button & Count */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVote(sub.submissionId, "down")}
                              className={`p-1.5 rounded-lg transition-all ${
                                userVoteState === "down"
                                  ? "text-red-500 bg-red-50 scale-105"
                                  : "text-slate-400 hover:text-red-500 hover:bg-slate-50"
                              }`}
                              title="Downvote"
                            >
                              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <span className={`text-[10px] font-extrabold ${userVoteState === "down" ? "text-red-500" : "text-slate-500"}`}>
                              {downvotes[sub.submissionId] || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Priority rankings (5 cols) */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-800 font-outfit">AI Priority Rankings</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Public View</span>
              </div>
              
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Gemini automatically groups individual citizen reports into collective issues and ranks them based on local infrastructure gaps, community size, and necessity index.
              </p>

              {loading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {clusters.slice(0, 5).map((c, index) => {
                    let level = "Medium";
                    let progressColor = "bg-amber-500";
                    let badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                    
                    if (c.priorityScore >= 90) {
                      level = "Critical";
                      progressColor = "bg-red-500 animate-pulse";
                      badgeColor = "bg-red-50 text-red-700 border-red-100";
                    } else if (c.priorityScore >= 80) {
                      level = "High";
                      progressColor = "bg-orange-500";
                      badgeColor = "bg-orange-50 text-orange-700 border-orange-100";
                    }

                    return (
                      <div 
                        key={c.clusterId} 
                        className="border border-slate-150 rounded-xl p-4 space-y-3 hover:border-slate-350 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">RANK #{index + 1}</span>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                          </div>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${badgeColor}`}>
                            {level}
                          </span>
                        </div>

                        {/* Priority Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                            <span>Emergency Score:</span>
                            <span className="font-extrabold text-slate-800">{c.priorityScore}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${progressColor}`} 
                              style={{ width: `${c.priorityScore}%` }} 
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100/50">
                          <span className="flex items-center gap-1 font-semibold text-slate-500">
                            👥 {c.citizenCount} votes
                          </span>
                          <span className="bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            {c.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
