"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle, AlertTriangle, User, Star } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import axios from "axios";
import { useEffect } from "react";

export default function Contact() {
  const [settings, setSettings] = useState<any>({});
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contacts`, { ...formData, rating });
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setRating(0);
      setRatingSubmitted(false);
    } catch (error) {
      setStatus("error");
    }
    
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative overflow-hidden" id="contact">
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-[#00f0ff]">Connect</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">{settings.contactTitle || "Let's Connect"}</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] mx-auto rounded-full" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/3 space-y-6"
          >
            <h3 className="text-xl font-bold font-orbitron mb-4">Contact</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {settings.contactDescription || "Whether you have a question, a project idea, or just want to say hi, my inbox is always open."}
            </p>

            <div className="space-y-5">
              {[
                { icon: <User className="w-5 h-5" />, title: "Name", value: settings.name || "Navaneeth", href: null },
                { icon: <Mail className="w-5 h-5" />, title: "Email", value: settings.contactEmail || "navaneeth9788@gmail.com", href: `mailto:${settings.contactEmail}` },
                { icon: <MapPin className="w-5 h-5" />, title: "Location", value: settings.contactAddress || "India", href: null },
                { icon: <Phone className="w-5 h-5" />, title: "Phone", value: settings.contactPhone || "Available on request", href: `tel:${settings.contactPhone}` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="p-2.5 bg-[#00f0ff]/5 text-[#00f0ff] rounded-lg border border-[#00f0ff]/10 group-hover:bg-[#00f0ff]/15 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm font-orbitron uppercase tracking-wider">{item.title}</h4>
                    {item.href ? (
                      <a href={item.href} className="text-gray-500 text-sm hover:text-[#00f0ff] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-gray-500 text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3">
              {[
                { name: "Github", url: settings.github, icon: <FaGithub className="w-4 h-4 mr-2" /> },
                { name: "LinkedIn", url: settings.linkedin, icon: <FaLinkedin className="w-4 h-4 mr-2" /> },
                { name: "Twitter", url: settings.twitter, icon: <FaTwitter className="w-4 h-4 mr-2" /> },
                { name: "Facebook", url: settings.facebook, icon: <FaFacebook className="w-4 h-4 mr-2" /> },
                { name: "Instagram", url: settings.instagram, icon: <FaInstagram className="w-4 h-4 mr-2" /> },
              ].map((social, i) => social.url && social.url !== "#" && (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 transition-all duration-300 font-orbitron text-[10px] font-bold uppercase tracking-widest"
                >
                  {social.icon}
                  {social.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-2/3 glass-panel p-8 rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#00f0ff]/40 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#00f0ff]/40 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#00f0ff]/40 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all resize-none"
                  placeholder="How can I help you?"
                />
              </div>

              {/* Profile Rating - right under the message with a small gap */}
              <div className="mt-3 flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-[10px] font-orbitron uppercase tracking-widest text-gray-400">Profile Rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => { setRating(star); setRatingSubmitted(false); }}
                        onMouseEnter={() => setRatingHover(star)}
                        onMouseLeave={() => setRatingHover(0)}
                        className={`transition-all duration-200 transform hover:scale-125 ${
                          (ratingHover || rating) >= star ? "text-yellow-400 scale-110" : "text-gray-600"
                        }`}
                      >
                        <Star className="w-5 h-5" fill={(ratingHover || rating) >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col min-w-[60px]">
                    {rating > 0 && (
                      <span className="text-yellow-400/90 text-[10px] font-orbitron text-right">
                        {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Great" : "Super!"}
                      </span>
                    )}
                  </div>
                </div>
              </div>


              {status === "success" && (
                <div className="p-3 bg-green-500/10 text-green-400 rounded-lg flex items-center gap-2 text-sm border border-green-500/20">
                  <CheckCircle className="w-4 h-4" /> Message sent successfully!
                </div>
              )}
              {status === "error" && (
                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 text-sm border border-red-500/20">
                  <AlertTriangle className="w-4 h-4" /> Failed to send message. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="px-8 py-3.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black rounded-lg font-semibold text-sm uppercase tracking-widest hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-orbitron">
          © 2026 Navaneeth. Designed & Built with Precision.
        </p>
      </div>
    </section>
  );
}
