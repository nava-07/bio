"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import CustomCursor from "@/components/CustomCursor";
import Background3D from "@/components/Background3D";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Technologies from "@/components/Technologies";
import Contact from "@/components/Contact";
import IntroGate from "@/components/IntroGate";
import StickyNote from "@/components/StickyNote";
import AudioPlayer from "@/components/AudioPlayer";

let gatePassed = false;

export default function MainSite() {
  const pathname = usePathname();
  const [showGate, setShowGate] = useState(!gatePassed);
  const [mounted, setMounted] = useState(false);

  // Ensure gate is bypassed when navigating deep
  useEffect(() => {
    if (pathname !== "/" || window.location.hash) {
      gatePassed = true;
      setShowGate(false);
    }
    setMounted(true);
  }, [pathname]);



  if (!mounted) return <div className="min-h-screen bg-[#030303]" />;

  const handleEnter = () => {
    gatePassed = true;
    setShowGate(false);
  };

  return (
    <main className="relative w-full min-h-screen bg-[#030303]">
      <CustomCursor />
      
      <AnimatePresence>
        {showGate && <IntroGate onEnter={handleEnter} />}
      </AnimatePresence>
      
      <div className={`relative z-10 transition-opacity duration-1000 ${showGate ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <Background3D />
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Experience />
        <Achievements />
        <Technologies />
        <Contact />
      </div>
      
      <StickyNote showGate={showGate} />
      {!showGate && <AudioPlayer />}
    </main>
  );
}
