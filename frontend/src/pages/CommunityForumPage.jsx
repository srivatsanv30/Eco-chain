import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MessageSquare, Users, TrendingUp, Search, PlusCircle, Heart, Share2, MessageCircle } from 'lucide-react';

const MOCK_THREADS = [
  {
    id: 1,
    title: 'Best eco-friendly laundry detergents?',
    author: 'SarahGreen',
    avatar: 'S',
    replies: 42,
    likes: 128,
    tags: ['Cleaning', 'Recommendations'],
    time: '2h ago'
  },
  {
    id: 2,
    title: 'How to properly recycle old batteries',
    author: 'EcoWarrior',
    avatar: 'E',
    replies: 15,
    likes: 89,
    tags: ['Recycling', 'Guide'],
    time: '5h ago'
  },
  {
    id: 3,
    title: 'Solar panel installation costs in 2024 - My experience',
    author: 'SunPower',
    avatar: 'S',
    replies: 104,
    likes: 342,
    tags: ['Energy', 'Solar'],
    time: '1d ago'
  }
];

const CommunityForumPage = () => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Hero Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-green-900/40 via-slate-900 to-emerald-900/40' : 'from-eco-400 via-green-400 to-teal-500'}`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-2xl rounded-full mix-blend-overlay transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight drop-shadow-md">
              Community Forum 🌍
            </h1>
            <p className="text-white/80 font-medium max-w-md drop-shadow">
              Connect with like-minded eco-warriors. Share tips, ask questions, and build a sustainable future together.
            </p>
          </div>
          <button className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl border border-white/30">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>New Topic</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Thread List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Discussions</h2>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Search className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input type="text" placeholder="Search topics..." className={`bg-transparent text-sm outline-none w-32 sm:w-48 ${isDark ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'}`} />
            </div>
          </div>

          {MOCK_THREADS.map((thread) => (
            <motion.div key={thread.id} variants={itemVariants} whileHover={{ scale: 1.01 }} className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${isDark ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-eco-500/50' : 'bg-white border-slate-200 hover:border-eco-400'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center text-white font-bold shrink-0">
                  {thread.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-bold text-lg leading-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{thread.title}</h3>
                    <span className={`text-xs whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{thread.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{thread.author}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {thread.tags.map(tag => (
                      <span key={tag} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isDark ? 'bg-slate-700 text-eco-400' : 'bg-eco-50 text-eco-600'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <button className={`flex items-center gap-1.5 text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-eco-400' : 'text-slate-500 hover:text-eco-600'}`}>
                      <Heart className="w-4 h-4" /> <span>{thread.likes}</span>
                    </button>
                    <button className={`flex items-center gap-1.5 text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'}`}>
                      <MessageCircle className="w-4 h-4" /> <span>{thread.replies} Replies</span>
                    </button>
                    <button className={`flex items-center gap-1.5 text-sm transition-colors ml-auto ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
                      <Share2 className="w-4 h-4" /> <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <motion.div variants={itemVariants} className={`p-6 rounded-3xl border shadow-lg ${isDark ? 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-extrabold text-lg mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Community Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-700/50 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Members</p>
                  <p className={`font-bold text-xl ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>12,450</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-700/50 text-eco-400' : 'bg-eco-50 text-eco-600'}`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Posts</p>
                  <p className={`font-bold text-xl ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>84.2k</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trending Topics */}
          <motion.div variants={itemVariants} className={`p-6 rounded-3xl border shadow-lg ${isDark ? 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-eco-500" />
              <h3 className={`font-extrabold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Trending Topics</h3>
            </div>
            <div className="space-y-3">
              {['#ZeroWasteLiving', '#SolarPower', '#SustainableFashion', '#CompostingTips', '#EVReviews'].map((topic, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{topic}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{120 - i * 15} posts</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityForumPage;
