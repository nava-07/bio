import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
