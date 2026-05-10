import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Terminal } from './components/Terminal';
import { Learn } from './pages/Learn';
import { Library } from './pages/Library';
import { Forum } from './pages/Forum';
import { Leaderboard } from './pages/Leaderboard';
import { LessonDetail } from './pages/LessonDetail';
import { Notes } from './pages/Notes';
import { UserSettings } from './pages/UserSettings';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-emerald-500/30 font-sans transition-colors duration-300">
          <Navbar />
          <main className="max-w-7xl mx-auto">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/practice" element={
               <div className="max-w-5xl mx-auto p-4 sm:p-8">
                 <div className="mb-8">
                   <h1 className="text-3xl font-bold text-white mb-2">Interactive Sandbox</h1>
                   <p className="text-zinc-500">Practice your commands in a safe, virtual environment.</p>
                 </div>
                 <Terminal />
               </div>
            } />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:id" element={<LessonDetail />} />
            <Route path="/forum" element={user ? <Forum /> : <Navigate to="/login" />} />
            <Route path="/library" element={<Library />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<UserSettings />} />
          </Routes>
        </main>
        
        {/* Toast Container Placeholder */}
        <div id="toast-root" />
      </div>
      </Router>
    </ThemeProvider>
  );
}
