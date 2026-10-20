import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, TrendingUp, Search, PlusCircle, Heart, Share2, 
  MessageCircle, X, Send, Sparkles, CheckCircle2, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getForumThreads, createForumThread, addForumComment, toggleForumLike } from '../services/api';

const TRENDING_TOPICS = [
  '#ZeroWasteLiving', 
  '#SolarPower', 
  '#SustainableFashion', 
  '#CompostingTips', 
  '#EVReviews', 
  '#RightToRepair'
];

const CommunityForumPage = () => {
  const { mode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.auth);
  const isDark = mode === 'dark';

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  // Modals
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  
  // New topic form
  const [newTopic, setNewTopic] = useState({
    title: '',
    author: '',
    tags: '',
    content: ''
  });

  // Reply form
  const [replyText, setReplyText] = useState('');

  const fetchThreads = async () => {
    try {
      const { data } = await getForumThreads();
      if (data.data) {
        setThreads(data.data);
      }
    } catch (err) {
      console.error('Failed to load forum threads from database', err);
      toast.error('Failed to load forum discussions from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Filtering
  const filteredThreads = threads.filter(thread => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      thread.title?.toLowerCase().includes(q) ||
      thread.author?.toLowerCase().includes(q) ||
      thread.tags?.some(tag => tag.toLowerCase().includes(q)) ||
      thread.content?.toLowerCase().includes(q);
    
    const matchesTag = selectedTag ? 
      thread.tags?.some(t => t.toLowerCase() === selectedTag.replace('#', '').toLowerCase()) ||
      thread.title?.toLowerCase().includes(selectedTag.replace('#', '').toLowerCase())
      : true;

    return matchesSearch && matchesTag;
  });

  // Toggle like
  const handleToggleLike = async (e, thread) => {
    e.stopPropagation();
    const threadId = thread._id || thread.id;
    try {
      const { data } = await toggleForumLike(threadId);
      const updatedThread = data.data;

      setThreads(prev => prev.map(t => (t._id || t.id) === threadId ? { ...t, likes: updatedThread.likes, likedBy: updatedThread.likedBy, isLiked: data.isLiked } : t));

      if (activeDiscussion && (activeDiscussion._id || activeDiscussion.id) === threadId) {
        setActiveDiscussion(prev => ({
          ...prev,
          likes: updatedThread.likes,
          likedBy: updatedThread.likedBy,
          isLiked: data.isLiked
        }));
      }
    } catch {
      toast.error('Failed to update reaction');
    }
  };

  // Share
  const handleShare = (e, thread) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out this topic on EcoChain: "${thread.title}"`);
      toast.success('Discussion link copied to clipboard!');
    } else {
      toast.success('Shared discussion!');
    }
  };

  // Create new topic
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.title.trim()) {
      toast.error('Please enter a topic title');
      return;
    }
    if (!newTopic.content.trim()) {
      toast.error('Please write some content for the topic');
      return;
    }

    const tagList = newTopic.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      const authorName = newTopic.author.trim() || user?.name || 'EcoWarrior';
      const payload = {
        title: newTopic.title.trim(),
        content: newTopic.content.trim(),
        author: authorName,
        avatar: authorName[0]?.toUpperCase() || 'E',
        tags: tagList.length > 0 ? tagList : ['Discussion']
      };

      const { data } = await createForumThread(payload);
      if (data.data) {
        setThreads([data.data, ...threads]);
        setIsNewTopicOpen(false);
        setNewTopic({ title: '', author: '', tags: '', content: '' });
        toast.success('New topic published to database! 🌿');
      }
    } catch {
      toast.error('Failed to publish discussion topic');
    }
  };

  // Add comment / reply
  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeDiscussion) return;

    const threadId = activeDiscussion._id || activeDiscussion.id;
    try {
      const authorName = user?.name || 'You';
      const payload = {
        text: replyText.trim(),
        author: authorName,
        avatar: authorName[0]?.toUpperCase() || 'Y'
      };

      const { data } = await addForumComment(threadId, payload);
      if (data.data) {
        setActiveDiscussion(data.data);
        setThreads(prev => prev.map(t => (t._id || t.id) === threadId ? data.data : t));
        setReplyText('');
        toast.success('Reply saved to database!');
      }
    } catch {
      toast.error('Failed to post reply');
    }
  };

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Hero Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-emerald-950/70 via-slate-900 to-teal-950/70' : 'from-emerald-600 via-teal-600 to-green-600'}`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-2xl rounded-full mix-blend-overlay transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Eco-Community Forum
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight drop-shadow-md">
              Community Forum 🌍
            </h1>
            <p className="text-white/90 font-medium max-w-md drop-shadow text-sm leading-relaxed">
              Connect with like-minded eco-warriors. Share sustainable tips, repair guides, and build a zero-waste future together.
            </p>
          </div>
          <button 
            onClick={() => setIsNewTopicOpen(true)}
            className="group flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3 rounded-full font-bold transition-all shadow-xl hover:scale-105 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600 group-hover:rotate-90 transition-transform" />
            <span>New Topic</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Thread List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {selectedTag ? `Topics tagged "${selectedTag}"` : 'Recent Discussions'}
              </h2>
              {selectedTag && (
                <button 
                  onClick={() => setSelectedTag('')}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                >
                  Clear filter ✕
                </button>
              )}
            </div>

            {/* Search Box */}
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 focus-within:border-eco-500/60' 
                : 'bg-white border-slate-200 focus-within:border-emerald-500 shadow-sm'
            }`}>
              <Search className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, tags..." 
                className={`bg-transparent text-sm outline-none w-36 sm:w-56 ${
                  isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                }`} 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Tag Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                !selectedTag
                  ? 'bg-emerald-600 text-white shadow-eco'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Topics
            </button>
            {['Recommendations', 'Recycling', 'Energy', 'Repair', 'Cleaning', 'Smartphones'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedTag.toLowerCase() === tag.toLowerCase()
                    ? 'bg-emerald-600 text-white shadow-eco'
                    : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Thread Cards */}
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
              Loading discussions from database...
            </div>
          ) : filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => {
              const threadId = thread._id || thread.id;
              const replyCount = thread.comments?.length || thread.replies || 0;
              const hasLiked = thread.likedBy?.includes(user?._id) || thread.isLiked;

              return (
                <motion.div 
                  key={threadId} 
                  variants={itemVariants} 
                  whileHover={{ y: -2 }} 
                  onClick={() => setActiveDiscussion(thread)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    isDark 
                      ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-emerald-500/50' 
                      : 'bg-white border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                      {thread.avatar || (thread.author ? thread.author[0]?.toUpperCase() : 'E')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-bold text-base md:text-lg leading-tight transition-colors ${
                          isDark ? 'text-slate-100 hover:text-emerald-400' : 'text-slate-900 hover:text-emerald-600'
                        }`}>
                          {thread.title}
                        </h3>
                        <span className={`text-xs whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {thread.createdAt ? formatTime(thread.createdAt) : thread.time || 'Recent'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          Posted by <span className="text-emerald-600 dark:text-emerald-400">@{thread.author}</span>
                        </span>
                      </div>

                      <p className={`text-sm mb-3 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {thread.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {thread.tags?.map(tag => (
                          <span 
                            key={tag} 
                            onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                            className={`px-2.5 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                              isDark 
                                ? 'bg-slate-700/70 text-emerald-400 hover:bg-slate-700' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700/50">
                        <button 
                          onClick={(e) => handleToggleLike(e, thread)} 
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors py-1 px-2.5 rounded-lg ${
                            hasLiked
                              ? 'bg-red-500/10 text-red-500 dark:text-red-400'
                              : isDark ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700/50' : 'text-slate-600 hover:text-red-500 hover:bg-slate-100'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={hasLiked ? 'currentColor' : 'none'} />
                          <span>{thread.likes || 0}</span>
                        </button>

                        <button 
                          onClick={() => setActiveDiscussion(thread)}
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors py-1 px-2.5 rounded-lg ${
                            isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-700/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" /> 
                          <span>{replyCount} Replies</span>
                        </button>

                        <button 
                          onClick={(e) => handleShare(e, thread)}
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors py-1 px-2.5 rounded-lg ml-auto ${
                            isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Share2 className="w-4 h-4" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className={`text-center py-16 rounded-2xl border border-dashed ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
              <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No discussions found</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try searching for a different keyword or start a new topic!</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <motion.div variants={itemVariants} className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Trending Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTag(topic)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    selectedTag === topic
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isDark
                        ? 'border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400'
                        : 'border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Guidelines */}
          <motion.div variants={itemVariants} className={`p-6 rounded-3xl border ${isDark ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-emerald-50/70 border-emerald-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className={`font-bold text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>
                Community Guidelines
              </h4>
            </div>
            <ul className={`text-xs space-y-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>• Share verified sustainable recycling & repair recommendations.</li>
              <li>• Be respectful and support newcomers on their zero-waste journey.</li>
              <li>• Avoid unsolicited commercial marketing or greenwashing.</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* New Topic Modal */}
      <AnimatePresence>
        {isNewTopicOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsNewTopicOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg rounded-3xl p-6 border shadow-2xl z-10 ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-500" /> Create New Topic
                </h3>
                <button 
                  onClick={() => setIsNewTopicOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-600 dark:text-slate-400">
                    Topic Title *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newTopic.title}
                    onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Best solar chargers for camping?"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-600 dark:text-slate-400">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      value={newTopic.author}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, author: e.target.value }))}
                      placeholder={user?.name || "e.g. GreenLife"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-600 dark:text-slate-400">
                      Tags (comma-separated)
                    </label>
                    <input 
                      type="text" 
                      value={newTopic.tags}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Solar, Energy, Travel"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-600 dark:text-slate-400">
                    Content *
                  </label>
                  <textarea 
                    rows="4" 
                    required
                    value={newTopic.content}
                    onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience, tips, questions or guide with the eco-community..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsNewTopicOpen(false)}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary text-xs px-6 py-2 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish Topic
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discussion Detail Modal */}
      <AnimatePresence>
        {activeDiscussion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setActiveDiscussion(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl z-10 overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      Discussion
                    </span>
                    <span className="text-xs text-slate-400">
                      {activeDiscussion.createdAt ? formatTime(activeDiscussion.createdAt) : activeDiscussion.time || 'Recent'}
                    </span>
                  </div>
                  <h2 className="text-xl font-black leading-snug">{activeDiscussion.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Started by <span className="font-semibold text-emerald-600 dark:text-emerald-400">@{activeDiscussion.author}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setActiveDiscussion(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{activeDiscussion.content}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {activeDiscussion.tags?.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Likes / Meta */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleToggleLike(e, activeDiscussion)}
                    className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border transition-all ${
                      (activeDiscussion.likedBy?.includes(user?._id) || activeDiscussion.isLiked)
                        ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                        : isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={(activeDiscussion.likedBy?.includes(user?._id) || activeDiscussion.isLiked) ? 'currentColor' : 'none'} />
                    <span>{activeDiscussion.likes || 0} Likes</span>
                  </button>

                  <button 
                    onClick={(e) => handleShare(e, activeDiscussion)}
                    className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>

                {/* Replies list */}
                <div>
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    Replies ({activeDiscussion.comments?.length || 0})
                  </h3>

                  <div className="space-y-3">
                    {activeDiscussion.comments && activeDiscussion.comments.length > 0 ? (
                      activeDiscussion.comments.map((c, i) => (
                        <div 
                          key={c._id || c.id || i} 
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                            isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="text-emerald-600 dark:text-emerald-400">@{c.author}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {c.createdAt ? formatTime(c.createdAt) : c.time || 'Recent'}
                            </span>
                          </div>
                          <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>{c.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No replies yet. Be the first to chime in!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Input Bar */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <form onSubmit={handleAddReply} className="flex gap-2">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a helpful response..." 
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500' 
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500'
                    }`}
                  />
                  <button 
                    type="submit" 
                    disabled={!replyText.trim()}
                    className="btn-primary text-xs px-4 py-2.5 disabled:opacity-40"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommunityForumPage;
