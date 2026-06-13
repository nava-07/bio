import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
  {
    name: { type: String, required: true, default: 'Navaneeth' },
    heroText: { type: String, default: 'Full-Stack Developer & UI/UX Enthusiast' },
    aboutText: { type: String, default: 'I am a passionate Full-Stack Developer specializing in building exceptional digital experiences. With a strong foundation in modern web technologies, I bridge the gap between design and engineering to create intuitive, highly interactive applications.' },
    photoUrl: { type: String, default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop' },
    contactEmail: { type: String, default: 'navaneeth9788@gmail.com' },
    resumeUrl: { type: String, default: '' },
    contactPhone: { type: String, default: '+91 XXXXX XXXXX' },
    contactAddress: { type: String, default: 'India' },
    linkedin: { type: String, default: '#' },
    facebook: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    twitter: { type: String, default: '#' },

    // About Me Dynamic Fields
    yearsExp: { type: String, default: '5+' },
    projectsCount: { type: String, default: '30+' },
    achievementsCount: { type: String, default: '20+' },
    frontendSkills: { type: String, default: 'Next.js, React' },
    backendSkills: { type: String, default: 'Node.js, Express' },
    databaseSkills: { type: String, default: 'MongoDB, Redis' },
    designSkills: { type: String, default: 'Tailwind, Framer' },

    // Sticky Note Fields
    stickyNoteEnabled: { type: Boolean, default: true },
    stickyNoteText: { type: String, default: 'Welcome to my portfolio! Check out my latest projects below.' },

    // Section Titles and Descriptions
    aboutTitle: { type: String, default: 'About Me' },
    aboutDescription: { type: String, default: 'My background and journey.' },
    skillsTitle: { type: String, default: 'Skills & Tech' },
    skillsDescription: { type: String, default: 'Technologies I work with.' },
    projectsTitle: { type: String, default: 'Featured Work' },
    projectsDescription: { type: String, default: 'Some of my recent projects.' },
    educationTitle: { type: String, default: 'Education' },
    educationDescription: { type: String, default: 'My academic background.' },
    experienceTitle: { type: String, default: 'Experience' },
    experienceDescription: { type: String, default: 'My professional journey.' },
    servicesTitle: { type: String, default: 'Services' },
    servicesDescription: { type: String, default: 'What I can do for you.' },
    contactTitle: { type: String, default: 'Get in Touch' },
    contactDescription: { type: String, default: "Let's work together." },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
