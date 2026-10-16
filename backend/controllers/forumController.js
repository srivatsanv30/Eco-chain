import ForumThread from '../models/ForumThread.js';

export const getThreads = async (req, res) => {
  try {
    const { tag, search } = req.query;
    let query = {};
    if (tag && tag !== 'All') {
      query.tags = { $in: [tag] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    const threads = await ForumThread.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createThread = async (req, res) => {
  try {
    const { title, content, tags, author, avatar } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    const thread = await ForumThread.create({
      title,
      content,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      author: author || req.user?.name || 'EcoMember',
      avatar: avatar || req.user?.avatar || (author ? author.charAt(0).toUpperCase() : 'E'),
      likes: 0,
      likedBy: [],
      comments: []
    });
    res.status(201).json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text, author, avatar } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }
    const thread = await ForumThread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    const comment = {
      author: author || req.user?.name || 'EcoMember',
      avatar: avatar || req.user?.avatar || (author ? author.charAt(0).toUpperCase() : 'E'),
      text,
      createdAt: new Date()
    };
    thread.comments.push(comment);
    await thread.save();
    res.status(201).json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }
    const userId = req.user ? req.user._id.toString() : 'guest_' + (req.ip || 'anon');
    const hasLiked = thread.likedBy.includes(userId);
    if (hasLiked) {
      thread.likedBy = thread.likedBy.filter(id => id !== userId);
      thread.likes = Math.max(0, thread.likes - 1);
    } else {
      thread.likedBy.push(userId);
      thread.likes += 1;
    }
    await thread.save();
    res.json({ success: true, data: thread, isLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
