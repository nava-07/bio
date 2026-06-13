import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 100 },
  icon: { type: String },
  category: { type: String } // e.g., 'Frontend', 'Backend', 'Tools'
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
