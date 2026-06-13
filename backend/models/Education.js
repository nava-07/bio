import mongoose from 'mongoose';

const educationSchema = mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    grade: { type: String },
  },
  {
    timestamps: true,
  }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;
