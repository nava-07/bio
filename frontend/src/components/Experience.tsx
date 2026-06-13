"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import axios from "axios";

interface ExperienceItem {
  _id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.data) setSettings(res.data);
      } catch (err) {}
    };
    fetchSettings();

    const fetchExperiences = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/experiences`);
        if (res.data && res.data.length > 0) {
          setExperiences(res.data);
        } else {
          setExperiences(defaultExperiences);
        }
      } catch (err) {
        setExperiences(defaultExperiences);
      }
    };
    fetchExperiences();
  }, []);

  const defaultExperiences: ExperienceItem[] = [
    {
      _id: "1",
      title: "Senior Full-Stack Engineer",
      company: "TechNova Solutions",
      startDate: "2022",
      endDate: "Present",
      description: "Led the development of scalable microservices and highly interactive frontend applications using Next.js and Node.js.",
    },
    {
      _id: "2",
      title: "Frontend Developer",
      company: "Creative Web Agency",
      startDate: "2019",
      endDate: "2022",
      description: "Built award-winning marketing websites and web apps with React, Three.js, and Framer Motion.",
    }
  ];



  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative" id="experience">
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-[#bd00ff]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Timeline</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">{settings.experienceTitle || "Journey"}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-space">
            {settings.experienceDescription || "My professional journey."}
          </p>
        </motion.div>

        <div className="relative pl-8 md:pl-0">
          {/* Vertical timeline line */}
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00f0ff]/30 via-[#bd00ff]/20 to-transparent md:-translate-x-px" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center justify-between ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full bg-[#030303] border-2 border-[#00f0ff]/50 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  <Briefcase className="w-3 h-3 text-[#00f0ff]" />
                </div>

                <div className="w-full md:w-5/12 glass-panel p-6 rounded-xl ml-10 md:ml-0 hover:border-[#00f0ff]/20 transition-all duration-300 group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-orbitron text-[#00f0ff] uppercase tracking-widest glow-primary">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-orbitron group-hover:text-[#00f0ff] transition-colors">{exp.title}</h3>
                  <h4 className="text-sm text-gray-500 font-medium mb-3">{exp.company}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                </div>
                
                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
