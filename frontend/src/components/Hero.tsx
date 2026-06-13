"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Hero() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [settings, setSettings] = useState<any>({
    name: "Navaneeth",
    heroText: "Full-Stack Developer & UI/UX Enthusiast",
    photoUrl: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.data) setSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings.heroText) return;
    setIsTyping(true);
    setText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < settings.heroText.length) {
        setText(settings.heroText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [settings.heroText]);


  // Secret Admin Shortcut (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        router.push('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const photoSrc = settings.photoUrl
    ? (settings.photoUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${settings.photoUrl}` : settings.photoUrl)
    : null;

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" id="home">
      {/* Ambient gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#bd00ff]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
              <span className="text-[10px] md:text-xs font-orbitron uppercase tracking-[0.3em] text-[#00f0ff]">
                System Online • Neural Link Active
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold font-orbitron mb-6 tracking-tight leading-[1.1]">
              <span className="text-gray-400 text-lg sm:text-xl md:text-2xl 2xl:text-3xl font-space block mb-2 font-light tracking-normal">Hello, I&apos;m</span>
              <span 
                className="glitch-text inline-block"
                style={{
                  background: "linear-gradient(135deg, #00f0ff 0%, #bd00ff 50%, #ff0055 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {settings.name}
              </span>
            </h1>

            <div className="h-8 md:h-12 2xl:h-16 mb-8">
              <p className="text-base md:text-xl lg:text-2xl 2xl:text-3xl font-light text-gray-500 font-space inline-flex items-center">
                {text}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className={`ml-1 w-[2px] md:w-[3px] h-4 md:h-6 bg-[#00f0ff] inline-block ${isTyping ? 'opacity-100' : ''}`}
                />
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#projects"
                className="group px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black font-semibold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300"
              >
                Explore Projects
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-lg border border-white/10 font-medium text-sm uppercase tracking-widest text-gray-400 hover:border-[#00f0ff]/40 hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300"
              >
                Contact Me
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Holographic Avatar Frame */}
          {photoSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
              className="flex-shrink-0 relative hidden lg:block"
            >
              <div className="relative w-72 h-72 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96">
                {/* Outer animated ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#00f0ff]/20 animate-spin" style={{ animationDuration: '15s' }} />
                <div className="absolute inset-3 rounded-full border border-[#bd00ff]/15" />
                
                {/* Photo container */}
                <div className="absolute inset-6 rounded-full overflow-hidden border-2 border-[#00f0ff]/30 shadow-neon-primary group">
                  <div className="absolute inset-0 bg-[#00f0ff]/10 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay" />
                  <img 
                    src={photoSrc} 
                    alt={settings.name}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                  />
                </div>

                {/* Floating indicator dots */}
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                <div className="absolute bottom-8 left-2 w-2 h-2 bg-[#bd00ff] rounded-full animate-pulse shadow-[0_0_8px_rgba(189,0,255,0.6)]" style={{ animationDelay: '0.5s' }} />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Secret Invisible Button as a fallback */}
      <button 
        onClick={() => router.push('/admin/login')}
        className="absolute top-0 left-0 w-10 h-10 opacity-0 cursor-default"
        aria-hidden="true"
        title="Secret Admin Login"
      />

      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-gray-600 hover:text-[#00f0ff] transition-colors">
          <span className="text-[9px] uppercase tracking-[0.3em] font-orbitron">Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
