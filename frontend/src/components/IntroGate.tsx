"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Power } from "lucide-react";

export default function IntroGate({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div 
      className="fixed inset-0 bg-[#030305] z-[9999] flex flex-col items-center justify-center overflow-hidden font-mono"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.15,
        filter: "blur(20px)",
        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Background cybernetics */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
      <div className="absolute inset-0 hologram-overlay opacity-20 pointer-events-none" />
      
      {/* Dynamic light orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#00f0ff]/5 to-[#bd00ff]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating HUD info frames */}
      <div className="absolute top-10 left-10 text-[10px] text-[#00f0ff]/40 space-y-1 hidden md:block">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>SYS.STATUS: CONNECTED</span>
        </div>
        <div>ENCRYPTION: SHIELD_PRO_v22.4</div>
        <div>MATRIX ADDRESS: LOCALHOST://5000</div>
      </div>

      <div className="absolute top-10 right-10 text-[10px] text-purple-500/40 text-right space-y-1 hidden md:block">
        <div className="flex items-center justify-end gap-2">
          <span>IDENTITY ACCESS CODES: ACTIVE</span>
          <ShieldCheck className="w-3.5 h-3.5 text-green-500/50" />
        </div>
        <div>CORE SECTOR: DEVELOPMENT</div>
        <div>DISPLAY SEQUENCE: REDIRECT_GATE</div>
      </div>

      {/* Center Hologram Gate */}
      <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-xs uppercase tracking-[0.35em] text-[#00f0ff] font-orbitron mb-3 glow-primary">
            Digital Identity Decrypted
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-orbitron tracking-tight mb-2 uppercase select-none">
            NAVANEETH
          </h1>
          <p className="text-sm tracking-[0.2em] text-gray-500 uppercase max-w-sm mx-auto">
            Full-Stack Creative Architect & Software Engineer
          </p>
        </motion.div>

        {/* Enter Vault button */}
        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="relative group w-36 h-36 flex items-center justify-center cursor-pointer rounded-full border border-[#00f0ff]/30 shadow-neon-primary bg-black/40 backdrop-blur-md"
        >
          {/* Radial animated ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#00f0ff]/40 group-hover:rotate-45 transition-transform duration-500" />
          
          {/* Inner ring overlay */}
          <div className="absolute w-28 h-28 rounded-full border border-purple-500/30 group-hover:border-[#00f0ff]/60 transition-colors duration-300" />

          {/* Central Power button */}
          <div className="flex flex-col items-center gap-1.5 z-20 text-[#00f0ff] group-hover:text-purple-400 transition-colors duration-300">
            <Power className="w-8 h-8 animate-pulse" />
            <span className="text-[10px] tracking-widest font-orbitron uppercase">LAUNCH</span>
          </div>
          
          {/* Neon particle specs around */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-8 text-xs text-gray-600 dark:text-gray-400 tracking-[0.1em]"
        >
          CLICK LOGO KEY TO CONNECT NEURAL DATA NODE
        </motion.p>
      </div>

      <div className="absolute bottom-10 text-[9px] text-gray-500 uppercase tracking-widest">
        © 2026 NAVANEETH SYSTEMS INC. ALL RIGHTS RESERVED
      </div>
    </motion.div>
  );
}
