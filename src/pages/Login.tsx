import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase';
import { progressService } from '../services/progressService';
import { useNavigate } from 'react-router-dom';
import { Terminal, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await progressService.ensureUserDoc(result.user);
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div id="login-page" className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-xl mb-4">
            <Terminal className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Master Linux with the smartest interactive platform.</p>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-zinc-300">Secure progress tracking</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-zinc-300">Daily interactive challenges</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-xs text-zinc-500 px-4">
          By continuing, you agree to LinuxLearner's Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};
