import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown, TrendingUp, Search, User } from 'lucide-react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { UserProfile } from '../types';

export const Leaderboard: React.FC = () => {
  const [topUsers, loading] = useCollectionData(
    query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10))
  ) as [UserProfile[] | undefined, boolean, any];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-amber-400" />;
      case 2: return <Medal className="w-8 h-8 text-zinc-300" />;
      case 3: return <Medal className="w-8 h-8 text-amber-600" />;
      default: return <span className="text-xl font-black text-zinc-700 w-8 text-center">{rank}</span>;
    }
  };

  return (
    <div id="leaderboard-page" className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-16">
        <div className="inline-flex p-3 bg-amber-500/10 rounded-2xl mb-6">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Global Leaderboard</h1>
        <p className="text-zinc-500 max-w-md mx-auto">See how you rank against the best Linux architects in the world.</p>
      </header>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
        {topUsers && topUsers.length >= 3 && (
          <>
            {/* Rank 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl text-center order-2 md:order-1 h-56 flex flex-col justify-center"
            >
              <div className="mb-4 flex justify-center">{getRankIcon(2)}</div>
              <img src={topUsers[1].photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${topUsers[1].uid}`} className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-zinc-700" alt="" />
              <h3 className="font-bold text-white truncate px-2">{topUsers[1].displayName}</h3>
              <p className="text-xs text-zinc-500 font-bold">{topUsers[1].xp} XP</p>
            </motion.div>

            {/* Rank 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-zinc-900 border-2 border-amber-500/30 rounded-3xl text-center order-1 md:order-2 relative h-64 flex flex-col justify-center shadow-2xl shadow-amber-500/5"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Champion</div>
              <div className="mb-4 flex justify-center">{getRankIcon(1)}</div>
              <img src={topUsers[0].photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${topUsers[0].uid}`} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-amber-500 shadow-xl shadow-amber-500/20" alt="" />
              <h3 className="text-xl font-bold text-white truncate px-2">{topUsers[0].displayName}</h3>
              <p className="text-sm text-amber-500 font-black">{topUsers[0].xp} XP</p>
            </motion.div>

            {/* Rank 3 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl text-center order-3 h-48 flex flex-col justify-center"
            >
              <div className="mb-4 flex justify-center">{getRankIcon(3)}</div>
              <img src={topUsers[2].photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${topUsers[2].uid}`} className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-zinc-700" alt="" />
              <h3 className="font-bold text-white truncate px-2">{topUsers[2].displayName}</h3>
              <p className="text-xs text-zinc-500 font-bold">{topUsers[2].xp} XP</p>
            </motion.div>
          </>
        )}
      </div>

      {/* Main List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-emerald-500" />
             <h2 className="font-bold text-white">Full Ranking</h2>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input type="text" placeholder="Find user..." className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-zinc-700" />
           </div>
        </div>

        <div className="divide-y divide-zinc-800/50">
          {loading ? (
             <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
             </div>
          ) : (
            topUsers?.map((u, i) => (
              <div key={u.uid} className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors group">
                <div className="w-10 flex justify-center">
                  {getRankIcon(i + 1)}
                </div>
                <img src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`} className="w-10 h-10 rounded-xl bg-zinc-800" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white hover:text-emerald-500 transition-colors cursor-pointer truncate">{u.displayName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Level {u.level || 1}</span>
                     <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                     <span className="text-[10px] text-zinc-600 truncate">{u.badges?.length || 0} Badges Earned</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{u.xp} XP</p>
                  <p className="text-[10px] text-emerald-500 font-black tracking-widest">+120 this week</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-black/20 text-center">
           <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Show more rankings</button>
        </div>
      </div>
    </div>
  );
};
