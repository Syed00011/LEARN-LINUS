import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Target, BookOpen, ChevronRight, Zap, Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { UserProfile } from '../types';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userData] = useDocumentData(user ? doc(db, 'users', user.uid) : null) as [UserProfile | undefined, boolean, any];

  const stats = [
    { label: 'Level', value: userData?.level || 1, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10', span: 'col-span-12 md:col-span-3' },
    { label: 'XP', value: userData?.xp || 0, icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10', span: 'col-span-12 md:col-span-3' },
    { label: 'Streak', value: userData?.streak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', span: 'col-span-12 md:col-span-3' },
    { label: 'Badges', value: (userData?.badges?.length || 0), icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', span: 'col-span-12 md:col-span-3' },
  ];

  const [tutorInput, setTutorInput] = React.useState('');
  const [tutorMessages, setTutorMessages] = React.useState([
    { role: 'assistant', content: 'Need help with Linux? Ask me about commands, file systems, or security!' }
  ]);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const tutorEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    tutorEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorMessages]);

  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorInput.trim() || isAiLoading) return;
    
    const userMsg = { role: 'user', content: tutorInput };
    setTutorMessages(prev => [...prev, userMsg]);
    const currentInput = tutorInput;
    setTutorInput('');
    setIsAiLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...tutorMessages, userMsg].map(m => ({ 
          role: m.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: m.content }] 
        })),
        config: {
          systemInstruction: "You are SudoAI, a professional and helpful Linux tutor. You provide clear, concise explanations for Linux concepts, commands, and troubleshooting. Keep responses helpful and encouraging for beginners but technically accurate."
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that request.";
      setTutorMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setTutorMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to tutor. Please check your connection." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="dashboard-page" className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">System Status: Active</h1>
          <p className="text-slate-500 font-medium tracking-wide">Kernel version 5.15.0 - Welcome, {user?.displayName?.split(' ')[0] || 'Guest Learner'}</p>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Online</span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* Stats Section */}
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`${stat.span} bento-card bento-card-hover flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-bold">TOP 5% IN REGION</p>
            </div>
          </motion.div>
        ))}

        {/* Current Lesson - Large Cell */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-8 row-span-2 bento-card bento-card-hover border-l-4 border-l-emerald-500 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] bg-emerald-500/10 px-2.5 py-1 rounded-full">In Progress</span>
              <BookOpen className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-black text-[var(--text-primary)] mb-3 tracking-tight">Linux Architecture & File Hierarchy</h3>
              <p className="text-[var(--text-secondary)] max-w-md text-sm leading-relaxed mb-8">Understanding the Filesystem Hierarchy Standard (FHS) is the first step toward system mastery.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto pt-6 border-t border-[var(--card-border)]">
              <Link 
                to="/learn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                RESUME SESSION
                <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="flex-1 w-full">
                <div className="flex justify-between text-[10px] font-black text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                  <span>Module Progress</span>
                  <span className="text-[var(--text-primary)]">68%</span>
                </div>
                <div className="h-2 bg-[var(--bg-page)] rounded-full overflow-hidden border border-[var(--card-border)]">
                  <div className="h-full bg-emerald-500 w-[68%] shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-all duration-700" />
        </motion.div>

        {/* AI Tutor Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="col-span-12 lg:col-span-4 row-span-2 bento-card bento-card-hover bg-indigo-500/5 border-indigo-500/20 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <TerminalIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-widest">Sudo AI Tutor</h3>
          </div>
          <div className="flex-1 space-y-3 mb-6 overflow-y-auto custom-scrollbar pr-2 h-[200px] flex flex-col">
            {tutorMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`${
                  msg.role === 'assistant' 
                  ? 'bg-[var(--bg-page)] border border-[var(--card-border)] text-[var(--text-secondary)]' 
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-right ml-auto px-4'
                } p-3 rounded-2xl text-[11px] max-w-[85%] w-fit mb-2`}
              >
                {msg.content}
              </div>
            ))}
            {isAiLoading && (
              <div className="bg-[var(--bg-page)] border border-[var(--card-border)] text-[var(--text-secondary)] p-3 rounded-2xl text-[11px] w-fit flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Thinking...
              </div>
            )}
            <div ref={tutorEndRef} />
          </div>
          <form onSubmit={handleTutorSubmit} className="relative">
            <input 
              type="text" 
              value={tutorInput}
              onChange={(e) => setTutorInput(e.target.value)}
              placeholder="Ask SudoAI..." 
              className="w-full bg-[var(--bg-page)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-[var(--text-primary)]"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </form>
        </motion.div>

        {/* Small Action Cards */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="bento-card bento-card-hover bg-orange-500/5 border-orange-500/10 flex flex-col justify-center items-center text-center p-4">
              <Flame className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tighter">Daily Streak</p>
              <p className="text-orange-400 text-[10px] font-bold">5 Days Active</p>
           </div>
           <div className="bento-card bento-card-hover bg-blue-500/5 border-blue-500/10 flex flex-col justify-center items-center text-center p-4">
              <Trophy className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tighter">Weekly Goal</p>
              <p className="text-blue-400 text-[10px] font-bold">2/5 Complete</p>
           </div>
        </div>

        {/* Global Activity */}
        <div className="col-span-12 lg:col-span-6 bento-card bento-card-hover flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[var(--bg-page)] border border-[var(--card-border)] flex items-center justify-center">
               <Target className="w-5 h-5 text-[var(--text-secondary)]" />
             </div>
             <div>
               <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">Global Rank</p>
               <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-1">Top 12% Practitioners</p>
             </div>
           </div>
           <Link to="/leaderboard" className="text-xs font-black text-emerald-500 hover:underline">VIEW ALL</Link>
        </div>
      </div>
    </div>
  );
};
