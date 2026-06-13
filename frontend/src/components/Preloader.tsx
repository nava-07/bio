"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "INITIALIZING SECURE QUANTUM CONNECTION...",
  "LOADING CORE NEURAL GRID PROTOCOLS...",
  "MOUNTING DATA SCHEMAS: PROJECTS, SKILLS, BLOGS...",
  "RESOLVING BRANDING: NAVANEETH...",
  "SYNCING BIOMETRICS AND DECRYPTING ARCHIVES...",
  "ESTABLISHING HANDSHAKE WITH PORT:5000 API...",
  "SYNAPSE ESTABLISHED. HOST ALIVE.",
  "READY FOR REVEAL."
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const activeLogIndex = Math.min(
    Math.floor((progress / 100) * BOOT_LOGS.length),
    BOOT_LOGS.length - 1
  );
  
  const logs = progress >= 100 ? BOOT_LOGS : BOOT_LOGS.slice(0, activeLogIndex + 1);

  useEffect(() => {
    // 1. Simulate Progress Count
    const duration = 2400; // 2.4 seconds total loading time
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Wait shortly after 100% to transition out
      const doneTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(doneTimer);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020203] z-[99999] flex flex-col items-center justify-center p-6 font-mono overflow-hidden select-none">
      {/* High-tech HUD background grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 hologram-overlay opacity-30 pointer-events-none" />
      
      <div className="w-full max-w-xl flex flex-col gap-8 relative z-10">
        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b border-[#00f0ff]/20 pb-2">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-[#00f0ff]/50 uppercase tracking-widest font-orbitron">SYSTEM_BOOT_SEQUENCE_v1.0</span>
        </div>

        {/* Loading Progress & Holographic ring */}
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Pulsating backdrop glow */}
            <div className="absolute w-24 h-24 bg-[#00f0ff]/10 rounded-full blur-xl animate-pulse" />
            
            {/* Rotating border dashes */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="rgba(0, 240, 255, 0.05)"
                strokeWidth="2"
                fill="transparent"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="64"
                stroke="#00f0ff"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="402"
                strokeDashoffset={402 - (402 * progress) / 100}
                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                transition={{ ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-orbitron text-[#00f0ff] glow-primary">
                {Math.round(progress)}%
              </span>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase">LOAD_LEVEL</span>
            </div>
          </div>
        </div>

        {/* Boot Logs Terminal */}
        <div className="bg-[#050508]/80 border border-white/5 rounded-lg p-4 h-48 overflow-y-auto flex flex-col gap-1 text-[11px] text-[#00f0ff]/80">
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`${
                  index === logs.length - 1 
                    ? "text-[#00f0ff] font-bold" 
                    : "text-[#00f0ff]/50"
                }`}
              >
                <span className="text-purple-500 mr-2">&gt;</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="w-1.5 h-3.5 bg-[#00f0ff] animate-pulse mt-1 ml-4" />
        </div>
      </div>
    </div>
  );
}
