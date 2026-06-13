"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Globe, Smartphone, Database, Zap } from "lucide-react";
import axios from "axios";

const iconMap: { [key: string]: any } = {
  Globe: <Globe className="w-7 h-7" />,
  Palette: <Palette className="w-7 h-7" />,
  Database: <Database className="w-7 h-7" />,
  Smartphone: <Smartphone className="w-7 h-7" />,
  Code2: <Code2 className="w-7 h-7" />,
  Zap: <Zap className="w-7 h-7" />,
};

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon?: string;
}

export default function Technologies() {
  const [technologies, setTechnologies] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<any>({});

  const defaultServices = [
    { _id: "1", title: "Web Development", description: "Building fast, responsive, and robust websites using the latest technologies like Next.js and React.", icon: "Globe" },
    { _id: "2", title: "UI/UX Design", description: "Crafting beautiful, intuitive interfaces with a focus on user experience and modern design trends.", icon: "Palette" },
    { _id: "3", title: "Backend APIs", description: "Developing secure and scalable RESTful APIs using Node.js, Express, and MongoDB.", icon: "Database" },
    { _id: "4", title: "Mobile App Development", description: "Creating cross-platform mobile applications that provide native-like experiences.", icon: "Smartphone" },
    { _id: "5", title: "Frontend Architecture", description: "Structuring complex applications for maintainability, scalability, and high performance.", icon: "Code2" },
    { _id: "6", title: "Performance Optimization", description: "Speeding up web applications, improving SEO, and ensuring perfect Lighthouse scores.", icon: "Zap" },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.data) setSettings(res.data);
      } catch (err) {}
    };
    fetchSettings();

    const fetchTechnologies = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/services`);
        if (res.data && res.data.length > 0) {
          setTechnologies(res.data);
        } else {
          setTechnologies(defaultServices);
        }
      } catch (err) {
        setTechnologies(defaultServices);
      }
    };
    fetchTechnologies();
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative" id="technologies">
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Offerings</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">{settings.servicesTitle || "Technologies"}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-space">
            {settings.servicesDescription || "What I can do for you."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 2xl:gap-10">
          {technologies.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-7 rounded-2xl group hover:-translate-y-1 transition-all duration-300 hover:border-[#00f0ff]/20 relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00f0ff]/0 group-hover:bg-[#00f0ff]/5 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />
              
              <div className="w-14 h-14 rounded-xl bg-[#00f0ff]/5 text-[#00f0ff] flex items-center justify-center mb-6 group-hover:bg-[#00f0ff]/15 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300 border border-[#00f0ff]/10">
                {iconMap[service.icon || "Globe"] || <Globe className="w-7 h-7" />}
              </div>
              <h3 className="text-base font-bold font-orbitron mb-3 group-hover:text-[#00f0ff] transition-colors uppercase tracking-wider">{service.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
