"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, GitBranch, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const defaultProjects = [
    {
      _id: "1",
      title: "Quantum E-Commerce",
      description: "A next-gen e-commerce platform built with Next.js and Stripe, featuring 3D product previews.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
      githubUrl: "#",
      liveDemoUrl: "#",
      categories: ["Full Stack", "React"],
      technologies: ["Next.js", "MongoDB", "Stripe", "Three.js"]
    },
    {
      _id: "2",
      title: "Neon Task Manager",
      description: "A beautiful, futuristic task manager with real-time collaboration features.",
      image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1000&auto=format&fit=crop",
      githubUrl: "#",
      liveDemoUrl: "#",
      categories: ["Full Stack", "React"],
      technologies: ["React", "Node.js", "Socket.io", "Tailwind"]
    },
    {
      _id: "3",
      title: "AI Image Generator",
      description: "Generate stunning images using stable diffusion API right from this sleek dashboard.",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
      githubUrl: "#",
      liveDemoUrl: "#",
      categories: ["AI", "React"],
      technologies: ["React", "Python", "FastAPI", "OpenAI"]
    }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.data) setSettings(res.data);
      } catch (err) {}
    };
    fetchSettings();

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`);
        if (res.data && res.data.length > 0) {
          setProjects(res.data);
        } else {
          setProjects(defaultProjects);
        }
      } catch (error) {
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.flatMap(p => p.categories || [])))];
  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.categories?.includes(filter));

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative" id="projects">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Portfolio</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">{settings.projectsTitle || "Featured Projects"}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-space mb-10">
            {settings.projectsDescription || "A selection of my recent projects and experiments."}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-lg text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                  filter === cat 
                    ? "bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]" 
                    : "border border-white/10 text-gray-500 hover:border-[#00f0ff]/30 hover:text-[#00f0ff]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(0,240,255,0.3)]" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 2xl:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project._id}
                  className="group relative overflow-hidden rounded-2xl glass-panel hover:-translate-y-1 transition-all duration-300 hover:border-[#00f0ff]/20"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        {/* Overlay Action Buttons */}
                        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
                               className="p-3 rounded-lg bg-white/10 hover:bg-[#00f0ff]/20 backdrop-blur-md transition-all text-white border border-white/10 hover:border-[#00f0ff]/40">
                              <GitBranch className="w-5 h-5" />
                            </a>
                          )}
                          {project.liveDemoUrl && (
                            <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" 
                               className="p-3 rounded-lg bg-white/10 hover:bg-[#bd00ff]/20 backdrop-blur-md transition-all text-white border border-white/10 hover:border-[#bd00ff]/40">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold font-orbitron mb-2 group-hover:text-[#00f0ff] transition-colors">{project.title}</h3>
                        <p className="text-gray-500 mb-4 line-clamp-2 text-sm leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                          {project.technologies?.map((tech: string, i: number) => (
                            <span key={i} className="text-[10px] font-medium px-2.5 py-1 bg-[#00f0ff]/5 text-[#00f0ff] rounded-md border border-[#00f0ff]/10 uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <Link href={`/projects/${project._id}`} className="mt-auto block">
                          <button className="w-full py-2.5 rounded-lg border border-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#00f0ff]/10 transition-all duration-300">
                            View Details
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
