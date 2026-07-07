"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Sparkles } from "lucide-react";
import { DBService, PrajaChatMessage } from "@/services/db";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";

const TypewriterMarkdown = ({ content, speed = 10, animate = true }: { content: string, speed?: number, animate?: boolean }) => {
  const [displayed, setDisplayed] = useState(animate ? "" : content);

  useEffect(() => {
    if (!animate) {
      setDisplayed(content);
      return;
    }
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(content.substring(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [content, animate, speed]);

  return <ReactMarkdown>{displayed}</ReactMarkdown>;
};


export default function PrajaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<PrajaChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Holds the full DB history silently — used as AI context but never shown in UI after a refresh
  const dbHistoryRef = useRef<PrajaChatMessage[]>([]);

  // We assume a hardcoded user ID for the MP for this demo
  const MP_USER_ID = "mp_admin_1";

  // The greeting message shown fresh every time the chat is opened
  const GREETING: PrajaChatMessage = {
    id: "greeting",
    role: "assistant",
    content: "Hello sir, how can I assist u today",
    timestamp: new Date().toISOString()
  };

  useEffect(() => {
    if (!isOpen) return;
    const bootstrap = async () => {
      // Load full DB history silently for AI context
      const history = await DBService.getPrajaChatHistory(MP_USER_ID);
      if (history.length === 0) {
        // First ever open — save greeting
        await DBService.savePrajaChatMessage(MP_USER_ID, GREETING);
        dbHistoryRef.current = [GREETING];
      } else {
        dbHistoryRef.current = history;
      }
      // Always show only greeting in UI (clean slate on every refresh)
      setMessages([GREETING]);
    };
    bootstrap();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: PrajaChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    // Update visible UI messages
    const newVisibleMessages = [...messages, userMessage];
    setMessages(newVisibleMessages);
    setInput("");
    setIsLoading(true);

    // Append to DB history ref and persist
    dbHistoryRef.current = [...dbHistoryRef.current, userMessage];
    await DBService.savePrajaChatMessage(MP_USER_ID, userMessage);

    try {
      // Get context data (e.g. clusters and submissions count)
      const clusters = await DBService.getClusters();
      const contextData = {
        totalClusters: clusters.length,
        highPriorityClusters: clusters.filter(c => c.priorityScore >= 80).map(c => ({
          title: c.title,
          category: c.category,
          score: c.priorityScore,
          explanation: c.explanation
        })),
        allClustersSummary: clusters.map(c => ({ title: c.title, priority: c.priorityScore }))
      };

      // Send FULL DB history to API (for AI memory), not just visible UI messages
      const res = await fetch("/api/praja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: dbHistoryRef.current,
          contextData
        })
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      
      const assistantMessage: PrajaChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Sorry sir, I could not generate a response.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      // Also append to DB history ref and persist
      dbHistoryRef.current = [...dbHistoryRef.current, assistantMessage];
      await DBService.savePrajaChatMessage(MP_USER_ID, assistantMessage);

    } catch (error) {
      console.error(error);
      const errorMessage: PrajaChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry sir, I encountered an error connecting to my intelligence network.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        {!isOpen && (
          <div className="relative flex flex-col items-end group/fab">
            {/* Pop-up tooltip */}
            <div className="absolute -top-12 right-0 bg-white border border-slate-200 text-slate-700 text-xs font-bold font-outfit px-3 py-2 rounded-xl shadow-xl whitespace-nowrap mb-2 animate-bounce flex flex-col items-center">
              Try talk with Praja Prathinidhi
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
            </div>
            
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-2 border-white ring-4 ring-blue-100 group mt-4 bg-white"
            >
              <img 
                src="/praja_avatar.png" 
                alt="Praja Prathinidhi" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </button>
          </div>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 p-0.5 border border-white/30 overflow-hidden shadow-inner">
                  <img src="/praja_avatar.png" alt="Praja Prathinidhi" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold font-outfit text-sm leading-tight">Praja Prathinidhi</h3>
                  <p className="text-blue-100 text-[10px] font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online • AI Intelligence Aide
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-blue-100 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-sm shadow-md" 
                        : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm"
                    }`}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-slate max-w-none">
                          <TypewriterMarkdown 
                            content={msg.content} 
                            animate={idx === messages.length - 1} // Only animate the last message
                          />
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='try asking "what are the top priorities?"'
                  className="flex-1 bg-white border border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
