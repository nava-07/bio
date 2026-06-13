"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, Layout, Server } from "lucide-react";
import axios from "axios";

interface Skill {
  _id: string;
  name: string;
  level: number;
  icon?: string;
  category?: string;
}

export default function Skills() {
  const [dbSkills, setDbSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.data) setSettings(res.data);
      } catch (err) {}
    };
    fetchSettings();
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/skills`);
        if (res.data && res.data.length > 0) {
          setDbSkills(res.data);
        }
      } catch (err) {
        // Fallback to hardcoded if backend is down
      }
    };
    fetchSkills();
  }, []);

  // Use DB skills if available, otherwise fallback
  const skillCategories = dbSkills.length > 0
    ? (() => {
        const grouped: { [key: string]: Skill[] } = {};
        dbSkills.forEach(skill => {
          const cat = skill.category || "Other";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(skill);
        });
        const icons: { [key: string]: any } = {
          "Frontend": <Layout className="w-5 h-5" />,
          "Backend": <Server className="w-5 h-5" />,
          "Database": <Database className="w-5 h-5" />,
        };
        return Object.entries(grouped).map(([title, skills]) => ({
          title: title + " Development",
          icon: icons[title] || <Database className="w-5 h-5" />,
          skills: skills.map(s => ({ name: s.name, level: s.level }))
        }));
      })()
    : [
        {
          title: "Frontend Development",
          icon: <Layout className="w-5 h-5" />,
          skills: [
            { name: "React / Next.js", level: 95 },
            { name: "TypeScript", level: 90 },
            { name: "Tailwind CSS", level: 95 },
            { name: "Framer Motion", level: 85 },
            { name: "Three.js", level: 75 },
          ]
        },
        {
          title: "Backend Development",
          icon: <Server className="w-5 h-5" />,
          skills: [
            { name: "Node.js / Express", level: 90 },
            { name: "Python / FastAPI", level: 80 },
            { name: "REST APIs", level: 95 },
            { name: "GraphQL", level: 70 },
            { name: "WebSockets", level: 85 },
          ]
        },
        {
          title: "Database & Cloud",
          icon: <Database className="w-5 h-5" />,
          skills: [
            { name: "MongoDB", level: 90 },
            { name: "PostgreSQL", level: 85 },
            { name: "AWS / Vercel", level: 80 },
            { name: "Docker", level: 75 },
            { name: "Redis", level: 70 },
          ]
        }
      ];

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative" id="skills">
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Proficiency</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">{settings.skillsTitle || "Skills & Tech"}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-space">
            {settings.skillsDescription || "Here are the technologies and tools I work with to build robust, scalable applications."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 2xl:gap-8 relative z-10">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.15 }}
              className="glass-panel p-7 rounded-2xl group"
            >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="p-2.5 bg-[#00f0ff]/10 text-[#00f0ff] rounded-lg group-hover:bg-[#00f0ff]/20 transition-colors duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-base font-bold font-orbitron uppercase tracking-wider">{category.title}</h3>
                  </div>

                  <div className="space-y-5">
                    {category.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1.5">
                          <span className="font-medium text-xs text-gray-300 uppercase tracking-wider">{skill.name}</span>
                          <span className="text-xs text-[#00f0ff] font-orbitron">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: [0.25, 0.8, 0.25, 1] }}
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #00f0ff, #bd00ff)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
