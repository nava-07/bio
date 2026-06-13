"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X } from "lucide-react";
import CyberSnake from "./CyberSnake";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success";
}

export default function HackerTerminal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "NAVANEETH SECURITY LOGINS v4.0", type: "success" },
    { text: "ENTER PASSCODE SEQUENCE TO PROCEED.", type: "output" },
    { text: "TYPE 'help' FOR A LIST OF AVAILABLE COMMANDS.", type: "output" }
  ]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [activeGame, setActiveGame] = useState<"snake" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim().toLowerCase();
    
    if (!cleanInput) return;

    const newHistory = [...history, { text: `user@system:~$ ${inputValue}`, type: "input" as const }];

    if (cleanInput === "012345") {
      setAccessGranted(true);
      newHistory.push({ text: "CRITICAL DECRYPTION KEY ACCEPTED.", type: "success" });
      newHistory.push({ text: "REDIRECTING TO COGNITIVE WORKSPACE IN 1.5S...", type: "success" });
      setHistory(newHistory);
      setInputValue("");
      
      setTimeout(() => {
        onClose();
        router.push("/admin/login");
      }, 1500);
      return;
    }

    switch (cleanInput) {
      case "close":
        onClose();
        setInputValue("");
        return;

      case "exit":
        onClose();
        setInputValue("");
        router.push("/");
        return;

      case "game7":
        setActiveGame("snake");
        setInputValue("");
        return;

      case "help":
        newHistory.push({ text: "AVAILABLE COMMANDS:", type: "output" });
        newHistory.push({ text: "  help    - Show this message", type: "output" });
        newHistory.push({ text: "  ls      - List system directories", type: "output" });
        newHistory.push({ text: "  whoami  - Display current user privileges", type: "output" });
        newHistory.push({ text: "  clear   - Clear terminal output", type: "output" });
        newHistory.push({ text: "  reboot  - Restart cognitive subsystems", type: "output" });
        newHistory.push({ text: "  game7   - Launch CYBER_SNAKE.EXE", type: "output" });
        newHistory.push({ text: "  close   - Hide terminal overlay", type: "output" });
        newHistory.push({ text: "  exit    - Terminate session and return to root", type: "output" });
        break;

      case "clear":
        setHistory([
          { text: "TERMINAL CLEARED.", type: "success" }
        ]);
        setInputValue("");
        return;

      case "ls":
      case "dir":
        newHistory.push({ text: "SYSTEM FILES:", type: "output" });
        newHistory.push({ text: "-rw-r--r--  projects.sys", type: "output" });
        newHistory.push({ text: "-rw-r--r--  about.dat", type: "output" });
        newHistory.push({ text: "-rw-r--r--  contact.sh", type: "output" });
        newHistory.push({ text: "-rwxr-xr-x  game7.exe", type: "output" });
        break;

      case "whoami":
        newHistory.push({ text: "GUEST_USER - SECURITY CLEARANCE LEVEL 0", type: "output" });
        newHistory.push({ text: "ELEVATION REQUIRED FOR ADMIN ACTIONS.", type: "error" });
        break;

      case "sudo":
      case "su":
        setGlitchActive(true);
        newHistory.push({ text: "NICE TRY. THIS INCIDENT HAS BEEN LOGGED.", type: "error" });
        setTimeout(() => setGlitchActive(false), 800);
        break;

      case "reboot":
        newHistory.push({ text: "INITIATING SYSTEM REBOOT...", type: "output" });
        newHistory.push({ text: "UNMOUNTING VIRTUAL DRIVES... OK", type: "success" });
        newHistory.push({ text: "CLEARING MEMORY REGISTERS... OK", type: "success" });
        newHistory.push({ text: "SYSTEM RESTART ABORTED: GUEST PRIVILEGES.", type: "error" });
        break;

      default:
        setGlitchActive(true);
        newHistory.push({ text: "ACCESS DENIED - INTEGRITY VIOLATION DETECTED.", type: "error" });
        setTimeout(() => setGlitchActive(false), 800);
        break;
    }

    setHistory(newHistory);
    setInputValue("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-xl glass-panel border rounded-lg overflow-hidden flex flex-col h-[400px] shadow-neon-primary relative ${
          glitchActive ? "border-red-500 shadow-neon-secondary bg-red-950/15" : "border-[#00f0ff]/20"
        }`}
      >
        {activeGame === "snake" ? (
          <CyberSnake onExit={() => setActiveGame(null)} />
        ) : (
          <>
            {/* Terminal Header */}
            <div className={`flex justify-between items-center p-3 border-b ${
          glitchActive ? "border-red-500 bg-red-950/20" : "border-white/10 bg-[#07070a]/90"
        }`}>
          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 ${glitchActive ? "text-red-500 animate-bounce" : "text-[#00f0ff]"}`} />
            <span className={`text-xs uppercase font-orbitron tracking-wider ${glitchActive ? "text-red-500 glow-secondary" : "text-[#00f0ff]"}`}>
              {glitchActive ? "SECURITY BREACH DETECTED" : "SECURE_TERMINAL_NODE"}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors duration-200"
            disabled={accessGranted}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll screen logs */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto space-y-2 text-xs hologram-overlay flex flex-col"
        >
          {history.map((line, index) => (
            <div 
              key={index}
              className={`leading-relaxed ${
                line.type === "input" ? "text-white" :
                line.type === "error" ? "text-red-500 custom-glitch font-bold" :
                line.type === "success" ? "text-[#00f0ff] font-semibold glow-primary" : "text-gray-400"
              }`}
            >
              {line.text}
            </div>
          ))}
          
          {glitchActive && (
            <div className="text-red-500 font-bold custom-glitch text-[14px] text-center my-auto">
              *** ACCESS DENIED ***
            </div>
          )}
        </div>

        {/* Form input line */}
        <form 
          onSubmit={handleCommandSubmit}
          className={`flex items-center gap-2 p-3 border-t bg-[#040406]/90 ${
            glitchActive ? "border-red-500" : "border-white/10"
          }`}
        >
          <span className={`text-xs ${glitchActive ? "text-red-500" : "text-purple-500"}`}>
            user@system:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            disabled={accessGranted}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white outline-none border-none caret-[#00f0ff] selection:bg-[#00f0ff]/30"
            placeholder={accessGranted ? "REDIRECT SEQUENCE INITIATED..." : "ENTER AUTH SEQUENCE..."}
            autoComplete="off"
            autoFocus
          />
          <button 
            type="submit" 
            disabled={accessGranted || !inputValue.trim()}
            className={`px-3 py-1.5 ml-2 rounded text-[10px] font-orbitron uppercase tracking-widest transition-all ${
              inputValue.trim() 
                ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 hover:bg-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]" 
                : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
            }`}
          >
            ENTER
          </button>
        </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
