import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon, BookOpen, MessageSquare, Trophy, LayoutDashboard, Search, Menu, X, Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTheme } from '../context/ThemeContext';
import { signOut } from 'firebase/auth';

export const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const { progressService } = await import('../services/progressService');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await progressService.ensureUserDoc(result.user);
      // No need to navigate if they are already on a content page
      if (location.pathname === '/login') {
        navigate('/');
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Practice', path: '/practice', icon: TerminalIcon },
    { name: 'Roadmap', path: '/learn', icon: BookOpen },
    { name: 'Library', path: '/library', icon: Search },
    { name: 'Notes', path: '/notes', icon: MessageSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  return (
    <nav id="main-nav" className="sticky top-0 z-50 w-full mb-6 py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-md rounded-3xl px-6 py-3 h-16 shadow-lg transition-colors">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold italic text-slate-950">
              L
            </div>
            <span className="text-xl font-black tracking-tight text-[var(--text-primary)] hidden lg:block uppercase leading-none">LINUX MASTER</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors relative ${
                    isActive ? 'text-emerald-500' : 'text-[var(--text-secondary)] hover:text-emerald-500'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-emerald-500 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-tight">LVL 12</span>
                  </div>
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} 
                    className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-slate-700 p-0.5 group-hover:scale-105 transition-transform" 
                    alt="avatar" 
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[var(--card-border)] bg-emerald-500/5">
                        <p className="text-xs font-black text-[var(--text-primary)] truncate">{user.displayName || 'Learner'}</p>
                        <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-wider truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link 
                          to="/settings" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] hover:bg-indigo-500/10 hover:text-indigo-500 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </Link>
                        <Link 
                          to="/notes" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] hover:bg-emerald-500/10 hover:text-emerald-500 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Lab Notebook
                        </Link>
                        <button 
                          onClick={() => { setIsProfileOpen(false); signOut(auth); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout Session
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                Sign In
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-emerald-500"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 px-4"
          >
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 shadow-2xl">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-emerald-500"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
