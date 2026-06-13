"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, FolderKanban, Code, User, FileText, Settings, MessageSquare, Upload, Check, Trash2, Edit3, Plus, X, Briefcase, Star, GraduationCap, Zap } from "lucide-react";
import axios from "axios";
import SecretButton from "@/components/SecretButton";

const API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

export default function AdminDashboard() {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Settings State
  const [settingsData, setSettingsData] = useState({ 
    name: "", heroText: "", aboutText: "", photoUrl: "", resumeUrl: "",
    contactEmail: "", contactPhone: "", contactAddress: "", linkedin: "", twitter: "", facebook: "", instagram: "",
    aboutTitle: "", aboutDescription: "", skillsTitle: "", skillsDescription: "", projectsTitle: "", projectsDescription: "",
    educationTitle: "", educationDescription: "", experienceTitle: "", experienceDescription: "", servicesTitle: "", servicesDescription: "", contactTitle: "", contactDescription: "",
    yearsExp: "", projectsCount: "", achievementsCount: "", frontendSkills: "", backendSkills: "", databaseSkills: "", designSkills: "",
    stickyNoteEnabled: true, stickyNoteText: ""
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingForm, setSavingForm] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Generic CRUD states
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const info = localStorage.getItem("adminInfo");
    if (!info) { router.push("/admin/login"); } 
    else { setAdminInfo(JSON.parse(info)); }
  }, [router]);

  useEffect(() => {
    if (!adminInfo) return;
    const fetchData = async () => {
      try {
        if (activeTab === "Settings") {
          const res = await axios.get(`${API}/settings`);
          if (res.data) setSettingsData(res.data);
        } else if (activeTab === "Projects") {
          const res = await axios.get(`${API}/projects`);
          setProjects(res.data);
        } else if (activeTab === "Skills") {
          const res = await axios.get(`${API}/skills`);
          setSkills(res.data);
        } else if (activeTab === "Experience") {
          const res = await axios.get(`${API}/experiences`);
          setExperiences(res.data);
        } else if (activeTab === "Blogs") {
          const res = await axios.get(`${API}/blogs`);
          setBlogs(res.data);
        } else if (activeTab === "Education") {
          const res = await axios.get(`${API}/education`);
          setEducations(res.data);
        } else if (activeTab === "Achievements") {
          const res = await axios.get(`${API}/achievements`);
          setAchievements(res.data);
        } else if (activeTab === "Technologies") {
          const res = await axios.get(`${API}/services`);
          setServices(res.data);
        } else if (activeTab === "Messages") {
          const res = await axios.get(`${API}/contacts`, { withCredentials: true });
          setContacts(res.data);
        }
      } catch (err) { console.error("Fetch error", err); }
    };
    fetchData();
    setShowForm(false);
    setEditItem(null);
  }, [activeTab, adminInfo]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("adminInfo");
      router.push("/admin/login");
    } catch (error) { console.error("Logout failed", error); }
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Projects", icon: FolderKanban },
    { name: "Skills", icon: Code },
    { name: "Experience", icon: Briefcase },
    { name: "Technologies", icon: Zap },
    { name: "Education", icon: GraduationCap },
    { name: "Achievements", icon: Star },
    { name: "About Me", icon: User },
    { name: "Sticky Note", icon: FileText },
    { name: "Blogs", icon: FileText },
    { name: "Messages", icon: MessageSquare },
    { name: "Settings", icon: Settings },
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    setUploading(true);
    try {
      const res = await axios.post(`${API}/upload`, fd, { 
        withCredentials: true, 
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });
      const newSettings = { ...settingsData, photoUrl: res.data };
      setSettingsData(newSettings);
      
      // Auto-save to DB
      setSaving(true);
      await axios.put(`${API}/settings`, newSettings, { withCredentials: true });
      showMsg("Photo Uploaded and Saved!");
    } catch (err) { showMsg("Upload failed."); }
    finally { setUploading(false); setUploadProgress(null); setSaving(false); }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file); // Backend expects "image" field for all uploads
    setUploading(true);
    try {
      const res = await axios.post(`${API}/upload`, fd, { 
        withCredentials: true, 
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });
      const newSettings = { ...settingsData, resumeUrl: res.data };
      setSettingsData(newSettings);

      // Auto-save to DB
      setSaving(true);
      await axios.put(`${API}/settings`, newSettings, { withCredentials: true });
      showMsg("Resume Uploaded and Saved!");
    } catch (err) { showMsg("Upload failed."); }
    finally { setUploading(false); setUploadProgress(null); setSaving(false); }
  };

  const handleDeleteFile = async (field: 'photoUrl' | 'resumeUrl') => {
    const fileUrl = (settingsData as any)[field];
    if (!fileUrl) return;
    
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    
    setSaving(true);
    try {
      await axios.delete(`${API}/upload`, { 
        data: { filePath: fileUrl },
        withCredentials: true 
      });
      
      const newSettings = { ...settingsData, [field]: "" };
      setSettingsData(newSettings);
      await axios.put(`${API}/settings`, newSettings, { withCredentials: true });
      showMsg(`${field === 'photoUrl' ? 'Photo' : 'Resume'} deleted!`);
    } catch (err) {
      console.error(err);
      showMsg("Failed to delete file.");
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/settings`, settingsData, { withCredentials: true });
      showMsg("Settings saved!");
    } catch (err) { showMsg("Save failed."); }
    finally { setSaving(false); }
  };

  const showMsg = (m: string) => { setMessage(m); setTimeout(() => setMessage(""), 3000); };

  // Generic CRUD helpers
  const handleCreate = async (endpoint: string, dataOverride?: any) => {
    setSavingForm(true);
    try {
      await axios.post(`${API}/${endpoint}`, dataOverride || formData, { withCredentials: true });
      showMsg("Created!"); setShowForm(false); setFormData({});
      // refetch
      const res = await axios.get(`${API}/${endpoint}`);
      if (endpoint === "projects") setProjects(res.data);
      if (endpoint === "skills") setSkills(res.data);
      if (endpoint === "experiences") setExperiences(res.data);
      if (endpoint === "blogs") setBlogs(res.data);
      if (endpoint === "achievements") setAchievements(res.data);
      if (endpoint === "education") setEducations(res.data);
      if (endpoint === "services") setServices(res.data);
    } catch (err: any) { 
      console.error(err);
      showMsg(err.response?.data?.message || "Create failed."); 
    }
    finally { setSavingForm(false); }
  };

  const handleUpdate = async (endpoint: string, id: string, dataOverride?: any) => {
    setSavingForm(true);
    try {
      await axios.put(`${API}/${endpoint}/${id}`, dataOverride || formData, { withCredentials: true });
      showMsg("Updated!"); setShowForm(false); setEditItem(null); setFormData({});
      const res = await axios.get(`${API}/${endpoint}`);
      if (endpoint === "projects") setProjects(res.data);
      if (endpoint === "skills") setSkills(res.data);
      if (endpoint === "experiences") setExperiences(res.data);
      if (endpoint === "blogs") setBlogs(res.data);
      if (endpoint === "achievements") setAchievements(res.data);
      if (endpoint === "education") setEducations(res.data);
      if (endpoint === "services") setServices(res.data);
    } catch (err: any) { 
      console.error(err);
      showMsg(err.response?.data?.message || "Update failed."); 
    }
    finally { setSavingForm(false); }
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API}/${endpoint}/${id}`, { withCredentials: true });
      showMsg("Deleted!");
      const res = await axios.get(`${API}/${endpoint}`);
      if (endpoint === "projects") setProjects(res.data);
      if (endpoint === "skills") setSkills(res.data);
      if (endpoint === "experiences") setExperiences(res.data);
      if (endpoint === "blogs") setBlogs(res.data);
      if (endpoint === "achievements") setAchievements(res.data);
      if (endpoint === "education") setEducations(res.data);
      if (endpoint === "services") setServices(res.data);
      if (endpoint === "contacts") setContacts(res.data);
    } catch (err) { showMsg("Delete failed."); }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await axios.delete(`${API}/contacts/${id}`, { withCredentials: true });
      showMsg("Deleted!");
      const res = await axios.get(`${API}/contacts`, { withCredentials: true });
      setContacts(res.data);
    } catch (err) { showMsg("Delete failed."); }
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setFormData({});
    setShowForm(true);
  };

  // Fetch dashboard stats on mount
  useEffect(() => {
    if (!adminInfo) return;
    const fetchStats = async () => {
      try {
        const [p, s, c, b] = await Promise.all([
          axios.get(`${API}/projects`),
          axios.get(`${API}/skills`),
          axios.get(`${API}/contacts`, { withCredentials: true }).catch(() => ({ data: [] })),
          axios.get(`${API}/blogs`),
        ]);
        setProjects(p.data); setSkills(s.data); setContacts(c.data); setBlogs(b.data);
      } catch {}
    };
    if (activeTab === "Dashboard") fetchStats();
  }, [activeTab, adminInfo]);

  if (!adminInfo) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "Sticky Note":
        return (
          <div className="glass-panel rounded-xl border border-white/5 p-8 max-w-2xl">
            <h2 className="text-xl font-bold font-orbitron mb-6 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00f0ff]" /> Sticky Note Configuration
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <h3 className="text-sm font-semibold text-white">Enable Sticky Note</h3>
                  <p className="text-xs text-gray-400 mt-1">Show a popup note to visitors for 6 seconds upon entry.</p>
                </div>
                <button 
                  onClick={() => setSettingsData({...settingsData, stickyNoteEnabled: !settingsData.stickyNoteEnabled})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settingsData.stickyNoteEnabled ? 'bg-[#00f0ff]' : 'bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settingsData.stickyNoteEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Sticky Note Content</label>
                <textarea rows={4} value={settingsData.stickyNoteText} onChange={(e) => setSettingsData({...settingsData, stickyNoteText: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none resize-none" 
                  placeholder="Enter message to show in the sticky note..."
                  disabled={!settingsData.stickyNoteEnabled}
                />
              </div>

              <div className="pt-4">
                <button onClick={saveSettings} disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black rounded-lg font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        );

      case "About Me":
        return (
          <div className="glass-panel rounded-xl border border-white/5 p-8 max-w-4xl">
            <h2 className="text-xl font-bold font-orbitron mb-6 uppercase tracking-wider">About Me & Statistics</h2>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">About Text</label>
                <textarea rows={5} value={settingsData.aboutText} onChange={(e) => setSettingsData({...settingsData, aboutText: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Resume Document (Any Format)</label>
                <div className="flex items-center gap-4">
                  <input type="file" ref={resumeInputRef} onChange={handleResumeUpload} className="hidden" />
                  <button onClick={() => resumeInputRef.current?.click()} disabled={uploading}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors text-xs">
                    <Upload className="w-3.5 h-3.5" /> {uploading ? (uploadProgress !== null ? `Uploading ${uploadProgress}%` : "Uploading...") : "Upload Resume"}
                  </button>
                  {settingsData.resumeUrl && (
                    <>
                      <a href={settingsData.resumeUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${settingsData.resumeUrl}` : settingsData.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-[#00f0ff] hover:underline">
                        View Current Resume
                      </a>
                      <button onClick={() => handleDeleteFile('resumeUrl')} disabled={saving} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete Resume">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold font-orbitron mt-8 mb-4 border-t border-white/10 pt-6">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Years Exp.</label>
                  <input type="text" value={settingsData.yearsExp} onChange={(e) => setSettingsData({...settingsData, yearsExp: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Projects Count</label>
                  <input type="text" value={settingsData.projectsCount} onChange={(e) => setSettingsData({...settingsData, projectsCount: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Achievements Count</label>
                  <input type="text" value={settingsData.achievementsCount} onChange={(e) => setSettingsData({...settingsData, achievementsCount: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
              </div>

              <h3 className="text-lg font-bold font-orbitron mt-8 mb-4 border-t border-white/10 pt-6">Tech Stack Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Frontend Skills</label>
                  <input type="text" value={settingsData.frontendSkills} onChange={(e) => setSettingsData({...settingsData, frontendSkills: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Backend Skills</label>
                  <input type="text" value={settingsData.backendSkills} onChange={(e) => setSettingsData({...settingsData, backendSkills: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Database Skills</label>
                  <input type="text" value={settingsData.databaseSkills} onChange={(e) => setSettingsData({...settingsData, databaseSkills: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Design Skills</label>
                  <input type="text" value={settingsData.designSkills} onChange={(e) => setSettingsData({...settingsData, designSkills: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
              </div>

              <div className="pt-6">
                <button onClick={saveSettings} disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black rounded-lg font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        );

      case "Settings":
        return (
          <div className="glass-panel rounded-xl border border-white/5 p-8 max-w-4xl">
            <h2 className="text-xl font-bold font-orbitron mb-6 uppercase tracking-wider">General Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative flex-shrink-0">
                  {settingsData.photoUrl ? (
                    <img src={settingsData.photoUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${settingsData.photoUrl}` : settingsData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (<div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Photo</div>)}
                  {uploading && (<div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center"><div className="w-5 h-5 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin mb-1" />{uploadProgress !== null && <span className="text-[10px] text-[#00f0ff] font-orbitron">{uploadProgress}%</span>}</div>)}
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Profile Photo</h3>
                  <div className="flex items-center gap-3">
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors text-xs">
                      <Upload className="w-3.5 h-3.5" /> {uploading ? (uploadProgress !== null ? `Uploading ${uploadProgress}%` : "Uploading...") : "Upload"}
                    </button>
                    {settingsData.photoUrl && (
                      <button onClick={() => handleDeleteFile('photoUrl')} disabled={saving} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete Photo">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Display Name</label>
                  <input type="text" value={settingsData.name} onChange={(e) => setSettingsData({...settingsData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Hero Subtitle</label>
                  <input type="text" value={settingsData.heroText} onChange={(e) => setSettingsData({...settingsData, heroText: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
              </div>

              
              <h3 className="text-lg font-bold font-orbitron mt-8 mb-4 border-t border-white/10 pt-6">Contact & Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Email Address</label>
                  <input type="text" value={settingsData.contactEmail} onChange={(e) => setSettingsData({...settingsData, contactEmail: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Phone Number</label>
                  <input type="text" value={settingsData.contactPhone} onChange={(e) => setSettingsData({...settingsData, contactPhone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Address/Location</label>
                  <input type="text" value={settingsData.contactAddress} onChange={(e) => setSettingsData({...settingsData, contactAddress: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">LinkedIn URL</label>
                  <input type="text" value={settingsData.linkedin} onChange={(e) => setSettingsData({...settingsData, linkedin: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Twitter URL</label>
                  <input type="text" value={settingsData.twitter} onChange={(e) => setSettingsData({...settingsData, twitter: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Facebook URL</label>
                  <input type="text" value={settingsData.facebook} onChange={(e) => setSettingsData({...settingsData, facebook: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Instagram URL</label>
                  <input type="text" value={settingsData.instagram} onChange={(e) => setSettingsData({...settingsData, instagram: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold font-orbitron mt-8 mb-4 border-t border-white/10 pt-6">Section Headers & Descriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "About", prefix: "about" },
                  { label: "Skills", prefix: "skills" },
                  { label: "Projects", prefix: "projects" },
                  { label: "Education", prefix: "education" },
                  { label: "Experience", prefix: "experience" },
                  { label: "Technologies", prefix: "services" },
                  { label: "Contact", prefix: "contact" }
                ].map(sec => (
                  <div key={sec.prefix} className="glass-panel p-4 rounded-xl border border-white/5 space-y-4">
                    <h4 className="font-orbitron font-bold text-sm text-[#00f0ff] uppercase tracking-wider">{sec.label} Section</h4>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Title</label>
                      <input type="text" value={(settingsData as any)[`${sec.prefix}Title`]} onChange={(e) => setSettingsData({...settingsData, [`${sec.prefix}Title`]: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">Description</label>
                      <input type="text" value={(settingsData as any)[`${sec.prefix}Description`]} onChange={(e) => setSettingsData({...settingsData, [`${sec.prefix}Description`]: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button onClick={saveSettings} disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black rounded-lg font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
            </div>
          </div>
        );

      case "Projects":
        return renderCRUD("Projects", projects, "projects", [
          { label: "Title", name: "title" },
          { label: "Description", name: "description", type: "textarea" },
          { label: "Image", name: "image", type: "file" },
          { label: "GitHub URL", name: "githubUrl" },
          { label: "Live Demo URL", name: "liveDemoUrl" },
          { label: "Detailed Description", name: "detailedDescription", type: "textarea" },
          { label: "Additional Images (comma sep URLs)", name: "additionalImages" },
          { label: "Categories (comma sep)", name: "categories" },
          { label: "Technologies (comma sep)", name: "technologies" },
        ], (p: any) => (
          <div>
            <h4 className="font-bold text-sm">{p.title}</h4>
            <p className="text-gray-500 text-xs line-clamp-1">{p.description}</p>
            <div className="flex gap-1 mt-1">{p.technologies?.slice(0,3).map((t: string, i: number) => <span key={i} className="text-[9px] px-1.5 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] rounded">{t}</span>)}</div>
          </div>
        ), (item: any) => ({
          ...item,
          categories: item.categories?.join(", ") || "",
          technologies: item.technologies?.join(", ") || "",
          additionalImages: item.additionalImages?.join(", ") || ""
        }), (fd: any) => ({
          ...fd,
          categories: typeof fd.categories === "string" ? fd.categories.split(",").map((s: string) => s.trim()).filter((s: string) => s) : fd.categories,
          technologies: typeof fd.technologies === "string" ? fd.technologies.split(",").map((s: string) => s.trim()).filter((s: string) => s) : fd.technologies,
          additionalImages: typeof fd.additionalImages === "string" ? fd.additionalImages.split(",").map((s: string) => s.trim()).filter((s: string) => s) : fd.additionalImages,
        }));

      case "Skills":
        return renderCRUD("Skills", skills, "skills", [
          { label: "Name", name: "name" },
          { label: "Level (1-100)", name: "level", type: "number" },
          { label: "Category", name: "category", placeholder: "Frontend, Backend, Database, Tools" },
          { label: "Icon", name: "icon", placeholder: "lucide icon name" },
        ], (s: any) => (
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">{s.name}</h4>
              <span className="text-[10px] text-gray-500">{s.category}</span>
            </div>
            <span className="text-xs font-orbitron text-[#00f0ff]">{s.level}%</span>
          </div>
        ));

      case "Experience":
        return renderCRUD("Experience", experiences, "experiences", [
          { label: "Title", name: "title" },
          { label: "Company", name: "company" },
          { label: "Start Date", name: "startDate" },
          { label: "End Date", name: "endDate", placeholder: "Present" },
          { label: "Description", name: "description", type: "textarea" },
        ], (e: any) => (
          <div>
            <h4 className="font-bold text-sm">{e.title}</h4>
            <span className="text-[10px] text-gray-500">{e.company} • {e.startDate} — {e.endDate || "Present"}</span>
          </div>
        ), undefined, (fd: any) => ({ ...fd, type: 'work' }));

      case "Technologies":
        return renderCRUD("Technologies", services, "services", [
          { label: "Title", name: "title" },
          { label: "Description", name: "description", type: "textarea" },
          { label: "Icon Name", name: "icon", placeholder: "E.g., Globe, Code2" },
        ], (s: any) => (
          <div>
            <h4 className="font-bold text-sm">{s.title}</h4>
            <p className="text-gray-500 text-xs">{s.description}</p>
          </div>
        ));

      case "Education":
        return renderCRUD("Education", educations, "education", [
          { label: "Institution", name: "institution" },
          { label: "Degree", name: "degree" },
          { label: "Duration", name: "duration" },
          { label: "Description", name: "description", type: "textarea" },
          { label: "Grade", name: "grade" },
        ], (e: any) => (
          <div>
            <h4 className="font-bold text-sm">{e.degree}</h4>
            <p className="text-gray-500 text-xs">{e.institution} | {e.duration}</p>
          </div>
        ), (item: any) => item);

      case "Blogs":
        return renderCRUD("Blogs", blogs, "blogs", [
          { label: "Title", name: "title" },
          { label: "Content", name: "content", type: "textarea" },
          { label: "Image", name: "image", type: "file" },
          { label: "Tags (comma sep)", name: "tags" },
        ], (b: any) => (
          <div>
            <h4 className="font-bold text-sm">{b.title}</h4>
            <div className="flex gap-1 mt-1">{b.tags?.slice(0,3).map((t: string, i: number) => <span key={i} className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded">{t}</span>)}</div>
          </div>
        ), (item: any) => ({
          ...item,
          tags: item.tags?.join(", ") || ""
        }), (fd: any) => ({
          ...fd,
          tags: typeof fd.tags === "string" ? fd.tags.split(",").map((s: string) => s.trim()) : fd.tags,
        }));

      case "Achievements":
        return renderCRUD("Achievements", achievements, "achievements", [
          { label: "Title", name: "title" },
          { label: "Date", name: "date" },
          { label: "Short Description", name: "shortDescription", type: "textarea" },
          { label: "Detailed Description", name: "detailedDescription", type: "textarea" },
          { label: "Certificate Image", name: "certificateImage", type: "file" },
          { label: "Additional Images (comma sep URLs)", name: "images" },
        ], (a: any) => (
          <div>
            <h4 className="font-bold text-sm">{a.title}</h4>
            <p className="text-gray-500 text-xs">{a.date}</p>
          </div>
        ), (item: any) => ({
          ...item,
          images: item.images?.join(", ") || ""
        }), (fd: any) => ({
          ...fd,
          images: typeof fd.images === "string" ? fd.images.split(",").map((s: string) => s.trim()).filter((s:string) => s) : fd.images,
        }));

      case "Messages":
        return (
          <div>
            <h2 className="text-xl font-bold font-orbitron mb-6 uppercase tracking-wider">Inbox ({contacts.length})</h2>
            {message && <div className="mb-4 p-3 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> {message}</div>}
            {contacts.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-gray-500">No messages yet.</div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c: any) => (
                  <div key={c._id} className={`glass-panel rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${!c.read ? "border-l-2 border-[#00f0ff]" : ""}`}>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm">{c.name}</h4>
                        <span className="text-[10px] text-gray-600">{c.email}</span>
                        {!c.read && <span className="text-[8px] px-1.5 py-0.5 bg-[#00f0ff]/20 text-[#00f0ff] rounded font-orbitron">NEW</span>}
                        {c.rating > 0 && (
                          <div className="flex items-center gap-0.5">
                            {[...Array(c.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{c.message}</p>
                      <span className="text-[10px] text-gray-600 mt-1 block">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => handleDeleteContact(c._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default: // Dashboard
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[
                { label: "Projects", value: projects.length || "—", color: "#00f0ff" },
                { label: "Skills", value: skills.length || "—", color: "#bd00ff" },
                { label: "Messages", value: contacts.length || "—", color: "#ff0055" },
                { label: "Blogs", value: blogs.length || "—", color: "#00ff88" },
              ].map((stat, i) => (
                <div key={i} className="glass-panel rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -mr-8 -mt-8" style={{ background: stat.color + "15" }} />
                  <p className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold font-orbitron" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="glass-panel rounded-xl p-8 text-center">
              <LayoutDashboard className="w-12 h-12 text-gray-700 mb-3 mx-auto" />
              <h3 className="text-lg font-bold font-orbitron mb-2 text-gray-400">Command Center Active</h3>
              <p className="text-gray-600 text-sm">Select a section from the sidebar to manage your portfolio content.</p>
            </div>
          </div>
        );
    }
  };

  function renderCRUD(
    title: string, items: any[], endpoint: string, fields: any[], 
    renderItem: (item: any) => any,
    prepareEdit?: (item: any) => any,
    prepareSubmit?: (fd: any) => any
  ) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-orbitron uppercase tracking-wider">{title} ({items.length})</h2>
          <button onClick={openCreate}
            className="px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>

        {showForm && (
          <div className="glass-panel rounded-xl p-6 mb-6 border border-[#00f0ff]/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold font-orbitron uppercase tracking-wider">{editItem ? "Edit" : "Create New"} {title.slice(0, -1)}</h3>
              <button onClick={() => { setShowForm(false); setEditItem(null); }} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((f: any) => (
                <div key={f.name} className="space-y-1.5">
                  <label className="text-[10px] font-orbitron uppercase tracking-widest text-gray-500">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={4} value={formData[f.name] || ""} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none resize-none" placeholder={f.placeholder} />
                  ) : f.type === "select" ? (
                    <select value={formData[f.name] || ""} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none">
                      <option value="">Select...</option>
                      <option value="work">Work</option>
                      <option value="education">Education</option>
                    </select>
                  ) : f.type === "file" ? (
                    <div>
                      <input type="file" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if(!file) return;
                        const fd = new FormData();
                        fd.append("image", file);
                        setUploading(true);
                        try {
                          const res = await axios.post(`${API}/upload`, fd, { 
                            withCredentials: true, 
                            headers: { "Content-Type": "multipart/form-data" },
                            onUploadProgress: (progressEvent) => {
                              if (progressEvent.total) {
                                setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                              }
                            }
                          });
                          setFormData({...formData, [f.name]: res.data});
                        } catch(err) { showMsg("Upload failed."); }
                        finally { setUploading(false); setUploadProgress(null); }
                      }} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-[#00f0ff]/40 text-gray-400 outline-none" />
                      {formData[f.name] && <span className="text-xs text-[#00f0ff] mt-1 block truncate">Uploaded: {formData[f.name]}</span>}
                      {uploading && <span className="text-xs text-yellow-400 mt-1 block">Uploading{uploadProgress !== null ? ` ${uploadProgress}%` : "..."}</span>}
                    </div>
                  ) : (
                    <input type={f.type || "text"} value={formData[f.name] || ""} onChange={(e) => setFormData({ ...formData, [f.name]: f.type === "number" ? parseInt(e.target.value) : e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:border-[#00f0ff]/40 outline-none" placeholder={f.placeholder} />
                  )}
                </div>
              ))}
            </div>
            <button
              disabled={savingForm}
              onClick={() => {
                if (savingForm) return;
                const data = prepareSubmit ? prepareSubmit(formData) : formData;
                editItem ? handleUpdate(endpoint, editItem._id, data) : handleCreate(endpoint, data);
              }}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] text-black rounded-lg font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingForm ? "Saving to Database..." : (editItem ? "Save Changes" : "Create Item")}
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-gray-500">No {title.toLowerCase()} yet. Click "Add New" to get started.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item._id} className="glass-panel rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1">{renderItem(item)}</div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(prepareEdit ? prepareEdit(item) : item)}
                    className="p-2 text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(endpoint, item._id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex font-space">
      {/* Mobile Sidebar Toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden p-2 glass-panel rounded-lg">
        {sidebarOpen ? <X className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:sticky top-0 left-0 w-64 border-r border-white/5 p-6 flex flex-col h-screen z-50 bg-[#030303] transition-transform duration-300`}>
        <div className="mb-10">
          <h2 className="text-lg font-bold font-orbitron tracking-widest"
            style={{ background: "linear-gradient(135deg, #00f0ff, #bd00ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SYSTEM.ADMIN
          </h2>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveTab(item.name); setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all text-left text-sm ${
                activeTab === item.name 
                  ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all mt-auto text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Terminate Session</span>
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen md:ml-0">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-bold font-orbitron">Welcome Back, Commander</h1>
            <p className="text-gray-600 text-sm">Manage your portfolio content dynamically.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] font-bold font-orbitron text-sm">
              {adminInfo.name?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{adminInfo.name}</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-orbitron">{adminInfo.role}</p>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Secret N button to open Hacker Terminal on Admin Panel Only */}
      <SecretButton />

      {/* Global Toast Notification */}
      {message && (
        <div className="fixed bottom-10 right-10 z-[10000] p-4 rounded-xl bg-black border border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)] text-[#00f0ff] flex items-center gap-3 text-sm font-semibold tracking-wide animate-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-[#00f0ff]/20 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          {message}
        </div>
      )}
    </div>
  );
}
