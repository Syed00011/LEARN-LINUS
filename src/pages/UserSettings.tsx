import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Save, Shield, User, Mail, Briefcase, GraduationCap, Target } from 'lucide-react';
import { db, auth } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export const UserSettings: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    occupation: '',
    linuxLevel: 'Beginner',
    goal: 'DevOps Engineer',
    interests: [] as string[]
  });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          occupation: data.occupation || '',
          linuxLevel: data.linuxLevel || 'Beginner',
          goal: data.goal || 'DevOps Engineer',
          interests: data.interests || []
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert('Profile updated! Your experience will now be personalized.');
    } catch (e) {
      console.error(e);
      alert('Error updating profile.');
    }
    setSaving(false);
  };

  if (!user) return (
    <div className="p-8 text-center">
      <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">Please login to manage your profile</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <Settings className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Profile Settings</h1>
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">Personalize your Linux Learning Path</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bento-card flex flex-col items-center">
          <div className="relative mb-6">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} 
              className="w-24 h-24 rounded-3xl border-4 border-emerald-500 bg-slate-800 p-1" 
              alt="avatar" 
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">LVL 12</div>
          </div>
          <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">{user.displayName || 'Learner'}</h3>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-4">{user.email}</p>
          <div className="w-full h-1.5 bg-[var(--bg-page)] rounded-full overflow-hidden border border-[var(--card-border)] mb-2">
            <div className="h-full bg-emerald-500 w-[65%]" />
          </div>
          <p className="text-[10px] font-black text-emerald-500 uppercase">650 / 1000 XP TO LVL 13</p>
        </div>

        {/* Details Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bento-card space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Occupation
                </label>
                <input 
                  type="text"
                  value={profile.occupation}
                  onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                  placeholder="e.g. Student, Developer"
                  className="w-full bg-[var(--bg-page)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                  <GraduationCap className="w-3 h-3" /> Expertise
                </label>
                <select 
                  value={profile.linuxLevel}
                  onChange={(e) => setProfile({...profile, linuxLevel: e.target.value})}
                  className="w-full bg-[var(--bg-page)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Kernel Master</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                <Target className="w-3 h-3" /> Career Goal
              </label>
              <select 
                value={profile.goal}
                onChange={(e) => setProfile({...profile, goal: e.target.value})}
                className="w-full bg-[var(--bg-page)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
              >
                <option>DevOps Engineer</option>
                <option>System Administrator</option>
                <option>Security Analyst</option>
                <option>SRE</option>
                <option>Open Source Contributor</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-400 text-slate-950 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'UPDATING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>

          <div className="bento-card bg-indigo-500/5 border-indigo-500/10">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Personalization
            </h4>
            <p className="text-[10px] text-[var(--text-secondary)] font-bold">Your details are used to suggest relevant books in the Library and tailored practice labs in the Interactive Sandbox. We do not sell your data to third parties.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
