import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  githubUrl: { type: String },
  liveDemoUrl: { type: String },
  categories: [{ type: String }],
  technologies: [{ type: String }],
  detailedDescription: { type: String },
  additionalImages: [{ type: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
