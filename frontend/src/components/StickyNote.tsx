"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import axios from "axios";

interface StickyNoteProps {
  showGate: boolean;
}

export default function StickyNote({ showGate }: StickyNoteProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch settings to check if sticky note is enabled and get text
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch settings for sticky note", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // Only start logic when the intro gate is gone and settings are loaded
    // Ensure it only shows once per session across page reloads
    if (!showGate && settings?.stickyNoteEnabled) {
      const hasShown = sessionStorage.getItem("stickyShown");
      if (!hasShown) {
        const showTimer = setTimeout(() => setIsVisible(true), 100);
        sessionStorage.setItem("stickyShown", "true");

        // Hide after 6 seconds
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 6000);

        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [showGate, settings]);

  if (!settings?.stickyNoteEnabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5, rotateX: 45, rotateZ: 5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotateZ: 0 }}
          exit={{ opacity: 0, y: 100, scale: 0.8, rotateZ: -10 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.6 }}
          whileHover={{ scale: 1.02, translateY: -5 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[900] w-[90vw] max-w-xl"
        >
          <div className="relative bg-gradient-to-br from-[#111]/90 to-[#0a0a0a]/90 backdrop-blur-xl border border-[#00f0ff]/40 shadow-[0_0_40px_rgba(0,240,255,0.3)] rounded-2xl p-8 overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff]/20 blur-[60px] pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white hover:rotate-90 transition-all duration-300 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-start gap-4 relative z-10">
              <motion.div 
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-[#00f0ff]/10 flex items-center justify-center border border-[#00f0ff]/40 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                <Bell className="w-5 h-5" />
              </motion.div>
              <div className="pr-6">
                <h4 className="text-lg font-bold font-orbitron text-white mb-1.5 uppercase tracking-wider">Notice</h4>
                <p className="text-sm text-gray-300 font-space leading-relaxed">
                  {settings.stickyNoteText || "Welcome to my portfolio! Check out my latest projects below."}
                </p>
              </div>
            </div>

            {/* Timer Progress Bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#00f0ff] to-[#bd00ff]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
