import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  avatar: { type: String, default: '' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const forumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  avatar: { type: String, default: '' },
  content: { type: String, required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  comments: [commentSchema]
}, { timestamps: true });

const ForumThread = mongoose.model('ForumThread', forumThreadSchema);
export default ForumThread;
