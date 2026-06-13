import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Rich text
  image: { type: String },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
