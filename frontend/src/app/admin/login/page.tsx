"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        email,
        password,
      }, { withCredentials: true });

      if (res.data) {
        localStorage.setItem("adminInfo", JSON.stringify(res.data));
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Unauthorized access is forbidden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] relative overflow-hidden font-space">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00f0ff]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#bd00ff]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 glass-panel rounded-2xl z-10 mx-4 relative"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 flex items-center justify-center shadow-neon-primary">
            <ShieldAlert className="w-7 h-7 text-[#00f0ff]" />
          </div>
          <h1 className="text-2xl font-bold font-orbitron text-white tracking-widest uppercase mb-2">System Admin</h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">Enter credentials to access terminal</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center custom-glitch">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">Email Sequence</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00f0ff]/40 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
                placeholder="admin@system.io"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00f0ff]/40 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black rounded-lg py-3 font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Initialize Access"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => router.push('/')} className="text-[10px] text-gray-600 hover:text-[#00f0ff] transition-colors uppercase tracking-widest font-orbitron">
            Return to public interface
          </button>
        </div>
      </motion.div>
    </div>
  );
}
