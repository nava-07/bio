"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HackerTerminal from "./HackerTerminal";

export default function SecretButton() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle visibility when '7' is pressed
      if (e.key === '7') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 left-6 z-[999]">
          <motion.button
            onClick={() => setTerminalOpen(true)}
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl bg-black/60 backdrop-blur-md border border-[#00f0ff]/30 shadow-neon-primary text-[#00f0ff] hover:text-white hover:border-[#bd00ff] hover:shadow-neon-secondary transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              boxShadow: [
                "0 0 10px rgba(0, 240, 255, 0.3), inset 0 0 5px rgba(0, 240, 255, 0.3)",
                "0 0 20px rgba(0, 240, 255, 0.6), inset 0 0 10px rgba(0, 240, 255, 0.6)",
                "0 0 10px rgba(0, 240, 255, 0.3), inset 0 0 5px rgba(0, 240, 255, 0.3)"
              ]
            }}
            transition={{
              scale: { type: "spring", bounce: 0.5 },
              rotate: { type: "spring", bounce: 0.5 },
              boxShadow: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            title="Secure Terminal Node"
          >
            {/* Pulsating background ring */}
            <span className="absolute inset-0 rounded-xl border border-dashed border-[#00f0ff]/20 animate-spin" style={{ animationDuration: '10s' }} />

            {/* Letter N inside */}
            <span className="text-lg font-bold font-orbitron tracking-tighter">N</span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {terminalOpen && (
          <HackerTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
