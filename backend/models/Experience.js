import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String }, // Can be 'Present'
  description: { type: String, required: true },
  type: { type: String, enum: ['work', 'education'], required: true }
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
