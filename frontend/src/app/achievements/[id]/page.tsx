"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function AchievementDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [achievement, setAchievement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/achievements/${id}`);
        setAchievement(res.data);
      } catch (err) {
        setError("Failed to load achievement details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAchievement();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-[#00f0ff] font-orbitron animate-pulse">LOADING_ACHIEVEMENT_DATA...</div>
      </div>
    );
  }

  if (error || !achievement) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-orbitron text-xl">ERROR: 404_ACHIEVEMENT_NOT_FOUND</div>
        <Link href="/#achievements" className="text-[#00f0ff] hover:underline font-space">
          Return to Achievements
        </Link>
      </div>
    );
  }

  const imageSrc = achievement.certificateImage?.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${achievement.certificateImage}` 
    : achievement.certificateImage;

  return (
    <div className="min-h-screen bg-[#030303] text-gray-300 font-space py-20 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#bd00ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <Link 
          href="/#achievements"
          className="flex items-center gap-2 text-gray-500 hover:text-[#00f0ff] transition-colors mb-10 group w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-orbitron tracking-widest text-sm uppercase">Back to Achievements</span>
        </Link>

        {imageSrc && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-1 border border-white/10 rounded-2xl overflow-hidden mb-12 shadow-[0_0_30px_rgba(189,0,255,0.05)]"
          >
            <div className="w-full bg-gray-900 relative flex justify-center items-center p-4">
              <img src={imageSrc} alt={achievement.title} className="max-w-full max-h-[60vh] object-contain opacity-90 rounded-xl" />
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#bd00ff]/20 flex items-center justify-center border border-white/10">
              <Trophy className="w-6 h-6 text-[#00f0ff]" />
            </div>
            {achievement.date && (
              <span className="text-[#bd00ff] font-orbitron tracking-widest uppercase text-sm border border-[#bd00ff]/30 px-3 py-1 rounded-full bg-[#bd00ff]/5">
                {achievement.date}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-8 uppercase tracking-wider">{achievement.title}</h1>
          
          <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-headings:font-orbitron max-w-none bg-white/5 p-8 rounded-2xl border border-white/5 shadow-inner">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-[#00f0ff]">Achievement Details</h2>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{achievement.detailedDescription || achievement.shortDescription}</p>
          </div>

          {achievement.images && achievement.images.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold font-orbitron text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {achievement.images.map((img: string, index: number) => {
                  const src = img.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img}` : img;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="glass-panel p-1 rounded-xl border border-white/10 overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.05)] group cursor-pointer"
                    >
                      <img src={src} alt={`Achievement Gallery ${index + 1}`} className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
