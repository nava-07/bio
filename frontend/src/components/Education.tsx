"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import axios from "axios";

interface EducationItem {
  _id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
  grade?: string;
}

export default function Education() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.data) setSettings(res.data);
      } catch (err) {}
    };
    fetchSettings();

    const fetchEducation = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/education`);
        if (res.data && res.data.length > 0) {
          setEducations(res.data);
        } else {
          setEducations(defaultEducations);
        }
      } catch (err) {
        setEducations(defaultEducations);
      }
    };
    fetchEducation();
  }, []);

  const defaultEducations: EducationItem[] = [
    {
      _id: "1",
      institution: "Tech University",
      degree: "M.S. in Computer Science",
      duration: "2017 — 2019",
      description: "Specialized in Artificial Intelligence and Human-Computer Interaction.",
      grade: "3.9 GPA"
    },
    {
      _id: "2",
      institution: "State College",
      degree: "B.S. in Software Engineering",
      duration: "2013 — 2017",
      description: "Foundational coursework in algorithms, data structures, and web development.",
      grade: "First Class"
    }
  ];



  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative" id="education">
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Academics</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">{settings.educationTitle || "Education"}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-space">
            {settings.educationDescription || "My academic background."}
          </p>
        </motion.div>

        <div className="space-y-6">
          {educations.map((edu, index) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-[#00f0ff]/20 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#bd00ff]/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-[#00f0ff]/10 transition-colors duration-500" />
              
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-black/40 border border-[#00f0ff]/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.1)] group-hover:border-[#00f0ff]/50 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                  <GraduationCap className="w-6 h-6 text-[#bd00ff] group-hover:text-[#00f0ff] transition-colors" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h3 className="text-xl font-bold font-orbitron group-hover:text-[#00f0ff] transition-colors">{edu.degree}</h3>
                    <span className="text-[10px] font-orbitron text-[#00f0ff] uppercase tracking-widest glow-primary bg-[#00f0ff]/10 px-3 py-1 rounded-full w-fit">
                      {edu.duration}
                    </span>
                  </div>
                  <h4 className="text-sm text-gray-400 font-medium mb-4">{edu.institution} {edu.grade && `• ${edu.grade}`}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{edu.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
