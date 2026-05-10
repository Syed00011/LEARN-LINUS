import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book, Sparkles, X, ChevronRight, Bookmark, Calendar, UserPlus } from 'lucide-react';
import { explainHardWord, getRecommendedBooks } from '../services/gemini';

interface BookItem {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  tags: string[];
  externalLink: string;
}

const INITIAL_BOOKS: BookItem[] = [
  { 
    id: '1', 
    title: 'The Linux Command Line', 
    author: 'William Shotts', 
    description: 'A complete introduction to the shell.', 
    cover: 'https://images.unsplash.com/photo-1629654230608-21622753b86e?auto=format&fit=crop&q=80&w=600', 
    tags: ['Beginner', 'CLI', 'Free'], 
    externalLink: 'https://linuxcommand.org/tlcl.php' 
  },
  { 
    id: '2', 
    title: 'Linux Kernel Development', 
    author: 'Robert Love', 
    description: 'Deep dive into kernel internals.', 
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600', 
    tags: ['Advanced', 'Kernel', 'Paid'], 
    externalLink: 'https://www.amazon.com/Linux-Kernel-Development-Robert-Love/dp/0672329468' 
  },
  { 
    id: '3', 
    title: 'How Linux Works', 
    author: 'Brian Ward', 
    description: 'Explaining the operating system conceptually.', 
    cover: 'https://images.unsplash.com/photo-1544716124-7392a9c40284?auto=format&fit=crop&q=80&w=600', 
    tags: ['Concepts', 'Architecture', 'Free'], 
    externalLink: 'https://nostarch.com/howlinuxworks3' 
  },
  { 
    id: '4', 
    title: 'Bash Pocket Reference', 
    author: 'Arnold Robbins', 
    description: 'Helpful guide for common bash commands.', 
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=600', 
    tags: ['Bash', 'Reference', 'Free'], 
    externalLink: 'https://www.oreilly.com/library/view/bash-pocket-reference/9781491915172/' 
  },
  { 
    id: '5', 
    title: 'Mastering Linux Security', 
    author: 'Donald Tevault', 
    description: 'Secure your Linux environment like a pro.', 
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', 
    tags: ['Security', 'Admin', 'Free'], 
    externalLink: 'https://www.packtpub.com/product/mastering-linux-security-and-hardening-second-edition/9781838981778' 
  },
  { 
    id: '6', 
    title: 'Linux in a Nutshell', 
    author: 'Ellen Siever', 
    description: 'A desktop quick reference.', 
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600', 
    tags: ['Reference', 'Admin', 'Free'], 
    externalLink: 'https://www.oreilly.com/library/view/linux-in-a/0596009305/' 
  },
];

export const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books] = useState(INITIAL_BOOKS);
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const [selectedWord, setSelectedWord] = useState<{ word: string, context: string } | null>(null);
  const [explanation, setExplanation] = useState<{ explanation: string, example: string } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleExplain = async (word: string) => {
    setSelectedWord({ word, context: "Reading a book about Linux in the app library." });
    setLoadingAI(true);
    const result = await explainHardWord(word, "Linux terminology");
    setExplanation(result);
    setLoadingAI(false);
  };

  const loadAIRecommendations = async () => {
    const recs = await getRecommendedBooks("Beginner interested in shell scripting and server security");
    setRecommendations(recs);
  };

  useEffect(() => {
    loadAIRecommendations();
  }, []);

  return (
    <div id="library-page" className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="flex-1">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Technical Library</h1>
            <p className="text-zinc-500">Access free and premium Linux books. Search for any resource or get AI tips.</p>
          </header>

          {/* Search */}
          <div className="relative mb-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-white transition-all shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Book Shelves */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-500" />
              Essential Reads {searchTerm && `(${filteredBooks.length} results)`}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <a 
                  key={book.id}
                  href={book.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bento-card p-0 overflow-hidden group bento-card-hover border border-zinc-800/50 h-full flex flex-col"
                  >
                    <div className="aspect-[2/3] overflow-hidden relative">
                      <img 
                        src={book.cover} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        alt={book.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all transform translate-y-4 group-hover:translate-y-0">
                         <div className="w-full py-2.5 bg-emerald-500 text-black font-black rounded-xl text-[10px] uppercase tracking-widest text-center shadow-lg shadow-emerald-500/20">
                           Open Library
                         </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{book.title}</h3>
                      <p className="text-[10px] text-zinc-500 mb-3 font-medium uppercase tracking-wider">{book.author}</p>
                      <div className="mt-auto flex flex-wrap gap-1">
                        {book.tags.map(t => <span key={t} className="text-[9px] font-bold bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    </div>
                  </motion.div>
                </a>
              ))}
              {filteredBooks.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Book className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No books match your search</p>
                </div>
              )}
            </div>
          </section>

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <section className="mb-12">
               <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  AI Suggested for You
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((rec, i) => (
                  <div key={i} className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                    <h4 className="font-bold text-amber-500 mb-1">{rec.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-3">{rec.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
           {/* Reading Tools */}
           <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Study Planner
              </h3>
              <div className="space-y-4">
                 <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase block mb-1">Today</span>
                    <p className="text-xs text-zinc-300 font-medium">Read 10 pages of "The Linux CLI"</p>
                 </div>
                 <button className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                    <UserPlus className="w-3 h-3" />
                    Join a Reading Club
                 </button>
              </div>
           </div>

           {/* AI Word Explainer */}
           <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
              <h3 className="font-bold text-emerald-500 mb-2 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                AI Tooltip
              </h3>
              <p className="text-[10px] text-zinc-500 mb-4 italic">Unsure of a word? Type it below for a simplified explanation.</p>
              <div className="flex gap-2">
                <input 
                  id="word-input"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs px-2 text-white outline-none"
                  placeholder="e.g. Kernel"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExplain((e.target as HTMLInputElement).value);
                  }}
                />
              </div>
           </div>
        </div>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {selectedWord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedWord(null)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase text-amber-500 mb-2 block tracking-widest">AI Insight</span>
                <h2 className="text-2xl font-bold text-white capitalize">{selectedWord.word}</h2>
              </div>

              {loadingAI ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-zinc-500">Decrypting terminology...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Explanation</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{explanation?.explanation}</p>
                  </div>
                  {explanation?.example && (
                    <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50">
                      <h4 className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Real-world Example</h4>
                      <p className="text-xs text-zinc-400 italic">"{explanation?.example}"</p>
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedWord(null)}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                  >
                    Got it, thanks!
                  </button>
                </div>
              )}
              {/* Decoration */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
