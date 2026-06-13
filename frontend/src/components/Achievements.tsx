"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/achievements`);
        setAchievements(res.data);
      } catch (err) {
        console.error("Failed to fetch achievements", err);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative overflow-hidden" id="achievements">
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#bd00ff]/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Milestones</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">Achievements</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-space">
            My proudest professional accomplishments and certifications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 2xl:gap-10">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 rounded-2xl group relative overflow-hidden flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] transition-all duration-300 border border-white/5 hover:border-[#00f0ff]/30"
            >

              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00f0ff]/0 group-hover:bg-[#00f0ff]/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />
              
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#bd00ff]/20 text-white flex items-center justify-center mb-6 shadow-inner border border-white/10">
                <Trophy className="w-6 h-6 text-[#00f0ff]" />
              </div>
              
              <h3 className="text-xl font-bold font-orbitron mb-2 tracking-wide group-hover:text-[#00f0ff] transition-colors duration-300">
                {achievement.title}
              </h3>
              {achievement.date && (
                <p className="text-xs text-[#bd00ff] font-orbitron uppercase tracking-widest mb-4">
                  {achievement.date}
                </p>
              )}
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                {achievement.shortDescription}
              </p>
              
              <Link href={`/achievements/${achievement._id}`} className="mt-auto">
                <button className="w-full py-3 rounded-lg border border-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#00f0ff]/10 transition-all duration-300">
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No achievements listed yet.
          </div>
        )}
      </div>
    </section>
  );
}
