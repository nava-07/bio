"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Download, ExternalLink } from "lucide-react";

export default function About() {
  const [settings, setSettings] = useState<any>({
    photoUrl: "",
    aboutText: "I am a passionate Full-Stack Developer specializing in building exceptional digital experiences. With a strong foundation in modern web technologies, I bridge the gap between design and engineering to create intuitive, highly interactive applications.\n\nMy approach combines technical excellence with aesthetic precision. Whether it's crafting complex frontend architectures using React and Next.js, or designing robust backend APIs with Node.js and MongoDB, I strive for clean, maintainable, and scalable code."
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

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!settings.resumeUrl) return;

    const url = settings.resumeUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${settings.resumeUrl}` : settings.resumeUrl;
    const filename = settings.resumeUrl.split('/').pop()?.split('-').slice(1).join('-') || 'Resume.pdf';

    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: (response.headers['content-type'] as string) || 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
  };

  const photoSrc = settings.photoUrl
    ? (settings.photoUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${settings.photoUrl}` : settings.photoUrl)
    : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";

  const stats = [
    { label: "Years Exp.", value: settings.yearsExp || "5+" },
    { label: "Projects", value: settings.projectsCount || "30+" },
    { label: "Achievements", value: settings.achievementsCount || "20+" },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative overflow-hidden" id="about">
      {/* Background ambient */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#00f0ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#bd00ff]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* Photo Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 relative"
          >
            <div className="relative w-full max-w-sm mx-auto aspect-square">
              {/* Decorative corner borders */}
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-[#00f0ff]/30 rounded-tl-xl" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-[#bd00ff]/30 rounded-br-xl" />
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/10 to-transparent group-hover:opacity-0 transition-opacity duration-500 z-10" />
                <img 
                  src={photoSrc} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                {/* Scanner line effect */}
                <div className="absolute inset-0 scanner-effect pointer-events-none z-20" />
              </div>
            </div>
            
            {/* Floating stats badges */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.5, ease: "easeInOut" }}
                  className="glass-panel px-4 py-3 rounded-xl text-center min-w-[80px]"
                >
                  <div className="text-lg font-bold font-orbitron text-[#00f0ff] glow-primary">{stat.value}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Text Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-7/12"
          >
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
              <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Discovery</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-6">{settings.aboutTitle || "About Me"}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mb-8" />
            
            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-gray-400 leading-relaxed font-space whitespace-pre-line text-sm md:text-base">
                {settings.aboutText || settings.aboutDescription}
              </p>
            </div>
            
            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Frontend", value: settings.frontendSkills || "Next.js, React" },
                { label: "Backend", value: settings.backendSkills || "Node.js, Express" },
                { label: "Database", value: settings.databaseSkills || "MongoDB, Redis" },
                { label: "Design", value: settings.designSkills || "Tailwind, Framer" },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-[#00f0ff]/30 pl-4 py-1 hover:border-[#00f0ff] transition-colors duration-300">
                  <p className="text-[10px] text-[#00f0ff] uppercase tracking-widest font-orbitron">{item.label}</p>
                  <p className="font-medium text-sm text-gray-300">{item.value}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleDownload}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-lg bg-[#00f0ff]/10 text-sm font-bold uppercase tracking-widest text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
