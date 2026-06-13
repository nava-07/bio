"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    const fetchProject = async () => {
      // Check if it's a default project first
      const defaultProj = defaultProjects.find(p => p._id === id);
      if (defaultProj) {
        setProject(defaultProj);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-[#00f0ff] font-orbitron animate-pulse">LOADING_PROJECT_DATA...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-orbitron text-xl">ERROR: 404_PROJECT_NOT_FOUND</div>
        <Link href="/#projects" className="text-[#00f0ff] hover:underline font-space">
          Return to Projects
        </Link>
      </div>
    );
  }

  const imageSrc = project.image?.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${project.image}` 
    : project.image;

  return (
    <div className="min-h-screen bg-[#030303] text-gray-300 font-space py-20 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#bd00ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <Link 
          href="/#projects"
          className="flex items-center gap-2 text-gray-500 hover:text-[#00f0ff] transition-colors mb-10 group w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-orbitron tracking-widest text-sm uppercase">Back to Projects</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-1 border border-white/10 rounded-2xl overflow-hidden mb-12 shadow-[0_0_30px_rgba(0,240,255,0.05)]"
        >
          <div className="w-full h-64 md:h-96 bg-gray-900 relative">
            {imageSrc ? (
              <img src={imageSrc} alt={project.title} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-700 font-orbitron">NO_IMAGE_DATA</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-6 uppercase tracking-wider">{project.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-8">
            {project.technologies?.map((tech: string, i: number) => (
              <span key={i} className="text-xs font-medium px-3 py-1.5 bg-[#00f0ff]/5 text-[#00f0ff] rounded-md border border-[#00f0ff]/20 uppercase tracking-widest">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <GitBranch className="w-5 h-5 text-gray-400" />
                <span className="font-orbitron text-sm uppercase tracking-widest">Repository</span>
              </a>
            )}
          </div>

          <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-headings:font-orbitron max-w-none">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-[#00f0ff]">Project Overview</h2>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{project.detailedDescription || project.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
