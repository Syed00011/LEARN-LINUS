import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Lock, Play, Star, BookOpen, Terminal, Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MODULES = [
  {
    id: 'beginner',
    title: 'Phase 1: Linux Foundations',
    description: 'Master the core concepts, filesystem, and basic automation.',
    lessons: [
      { id: '1', title: 'Linux Basics', status: 'completed', duration: '15m' },
      { id: '2', title: 'File & Directory Management', status: 'available', duration: '20m' },
      { id: '3', title: 'Linux File System Structure', status: 'available', duration: '25m' },
      { id: '4', title: 'File Permissions & Ownership', status: 'available', duration: '30m' },
      { id: '5', title: 'Text Processing & Searching', status: 'locked', duration: '35m' },
      { id: '6', title: 'Package Management', status: 'locked', duration: '20m' },
      { id: '7', title: 'Process Management', status: 'locked', duration: '25m' },
      { id: '8', title: 'Disk & Memory Management', status: 'locked', duration: '20m' },
      { id: '9', title: 'Networking Basics', status: 'locked', duration: '30m' },
      { id: '10', title: 'Service Management', status: 'locked', duration: '25m' },
      { id: '11', title: 'Bash & Shell Scripting', status: 'locked', duration: '45m' },
      { id: '12', title: 'Linux Editors (Vim/Nano)', status: 'locked', duration: '15m' },
    ],
    icon: Shield,
    color: 'emerald'
  },
  {
    id: 'intermediate',
    title: 'Phase 2: Intermediate Administration',
    description: 'Deep dive into security, logging, and remote management.',
    lessons: [
      { id: '13', title: 'User & Group Administration', status: 'locked', duration: '30m' },
      { id: '14', title: 'Log Management', status: 'locked', duration: '20m' },
      { id: '15', title: 'Advanced Networking', status: 'locked', duration: '40m' },
      { id: '16', title: 'SSH & Remote Management', status: 'locked', duration: '25m' },
      { id: '17', title: 'Storage Management (LVM/RAID)', status: 'locked', duration: '45m' },
      { id: '18', title: 'Linux Security Hardening', status: 'locked', duration: '40m' },
      { id: '19', title: 'Performance Monitoring', status: 'locked', duration: '30m' },
      { id: '20', title: 'Scheduling & Automation', status: 'locked', duration: '25m' },
    ],
    icon: Terminal,
    color: 'blue'
  },
  {
    id: 'advanced',
    title: 'Phase 3: Advanced Architect',
    description: 'Enterprise-grade expertise, DevOps, and Cloud engineering.',
    lessons: [
      { id: '21', title: 'Advanced Shell Scripting', status: 'locked', duration: '60m' },
      { id: '22', title: 'Kernel & Boot Process', status: 'locked', duration: '45m' },
      { id: '23', title: 'System Administration Mastery', status: 'locked', duration: '50m' },
      { id: '24', title: 'Advanced Linux Networking', status: 'locked', duration: '45m' },
      { id: '25', title: 'Web & Database Servers', status: 'locked', duration: '40m' },
      { id: '26', title: 'DevOps & Infrastructure (Ansible)', status: 'locked', duration: '60m' },
      { id: '27', title: 'Cloud & Virtualization', status: 'locked', duration: '45m' },
      { id: '28', title: 'Linux for Cybersecurity', status: 'locked', duration: '50m' },
      { id: '29', title: 'System Troubleshooting', status: 'locked', duration: '40m' },
      { id: '30', title: 'Enterprise Administration at Scale', status: 'locked', duration: '60m' },
    ],
    icon: BookOpen,
    color: 'purple'
  }
];

export const Learn: React.FC = () => {
  return (
    <div id="learn-page" className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Learning Roadmap</h1>
        <p className="text-zinc-500 max-w-xl mx-auto">Follow this structured path to transition from a Linux beginner to a professional System Administrator.</p>
      </header>

      <div className="space-y-12">
        {MODULES.map((mod, idx) => (
          <section key={mod.id} className="relative">
            {idx !== MODULES.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-zinc-800" />
            )}
            
            <div className="flex gap-6 mb-8 items-start">
              <div className={`p-4 bg-${mod.color}-500/10 rounded-2xl border border-${mod.color}-500/20 relative z-10 bg-zinc-950`}>
                <mod.icon className={`w-8 h-8 text-${mod.color}-500`} />
              </div>
              <div className="pt-2">
                <h2 className="text-2xl font-bold text-white mb-2">{mod.title}</h2>
                <p className="text-zinc-500 text-sm">{mod.description}</p>
              </div>
            </div>

            <div className="ml-14 grid gap-4">
              {mod.lessons.map((lesson, lIdx) => (
                <Link
                  key={lesson.id}
                  to={lesson.status !== 'locked' ? `/learn/${lesson.id}` : '#'}
                  className="block"
                >
                  <motion.div
                    whileHover={lesson.status !== 'locked' ? { x: 10 } : {}}
                    className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${
                      lesson.status === 'locked' 
                        ? 'bg-slate-900/20 border-slate-900 cursor-not-allowed opacity-50' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-emerald-500/50 cursor-pointer shadow-xl shadow-black/20'
                    }`}
                  >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {lesson.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                      {lesson.status === 'available' && <Play className="w-6 h-6 text-emerald-500" />}
                      {lesson.status === 'locked' && <Lock className="w-6 h-6 text-zinc-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        {lesson.title}
                        {lesson.status === 'available' && <span className="text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded font-black uppercase tracking-tighter">New</span>}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          100 XP
                        </span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <span className="text-xs text-zinc-500">{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                  {lesson.status !== 'locked' && (
                    <ChevronRight className="w-5 h-5 text-zinc-700" />
                  )}
                </motion.div>
              </Link>
            ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
