import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ThumbsUp, MessageCircle, Clock, Tag, User, Search, Plus, X } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ForumPost } from '../types';

export const Forum: React.FC = () => {
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [posts] = useCollectionData(query(collection(db, 'posts'), orderBy('createdAt', 'desc'))) as [ForumPost[] | undefined, boolean, any];

  const handleCreatePost = async () => {
    if (!auth.currentUser || !newTitle || !newContent) return;
    try {
      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Learner',
        title: newTitle,
        content: newContent,
        tags: ['General'],
        likes: 0,
        createdAt: serverTimestamp()
      });
      setShowNewPost(false);
      setNewTitle('');
      setNewContent('');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'posts');
    }
  };

  return (
    <div id="forum-page" className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Forum</h1>
          <p className="text-zinc-500">Ask questions, share tips, and learn from other Linux learners.</p>
        </div>
        <button 
          onClick={() => setShowNewPost(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-5 h-5" />
          New Topic
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Feed */}
        <div className="lg:col-span-3 space-y-4">
          {posts?.length ? posts.map((post) => (
            <motion.div 
              key={post.id || Math.random()} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${post.userId}`} className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700" alt="avatar" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{post.userName}</span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                       <Clock className="w-3 h-3" />
                       {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors">{post.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4 leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-zinc-500 hover:text-emerald-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">12</span>
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-2">
                      {post.tags?.map(t => (
                        <span key={t} className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-700">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-20 text-center">
               <div className="inline-flex p-4 bg-zinc-900 rounded-full mb-4">
                 <MessageSquare className="w-8 h-8 text-zinc-700" />
               </div>
               <h4 className="text-white font-medium">No discussions yet</h4>
               <p className="text-zinc-600 text-sm">Be the first to start a conversation!</p>
            </div>
          )}
        </div>

        {/* Categories / Sidebar */}
        <div className="space-y-6">
           <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Beginner', 'Servers', 'Security', 'Shell', 'Networking', 'Vim', 'Arch'].map(tag => (
                  <button key={tag} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold rounded-full transition-colors">
                    #{tag}
                  </button>
                ))}
              </div>
           </div>

           <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Announcements</h3>
              <div className="space-y-4">
                 {[
                   { title: 'New Tutorial Series: Docker', date: '2 days ago' },
                   { title: 'Community Call: Q&A', date: 'May 15' }
                 ].map((ann, i) => (
                   <div key={i} className="border-l-2 border-emerald-500 pl-3">
                      <h4 className="text-xs font-bold text-zinc-300">{ann.title}</h4>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{ann.date}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 20, opacity: 0 }}
               className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative"
            >
              <button 
                onClick={() => setShowNewPost(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white"
              >
                <X />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-8">Start a Discussion</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. How to use grep for logs?" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Content</label>
                   <textarea 
                     rows={6}
                     placeholder="Share your question or knowledge..." 
                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all resize-none"
                     value={newContent}
                     onChange={(e) => setNewContent(e.target.value)}
                   />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                   <button 
                     onClick={() => setShowNewPost(false)}
                     className="px-6 py-2.5 text-zinc-400 hover:text-white font-bold"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleCreatePost}
                     className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all"
                   >
                     Publish Topic
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
