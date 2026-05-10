import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2, ChevronRight, HelpCircle, Terminal as TerminalIcon, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Terminal } from '../components/Terminal';

const LESSON_DATA = {
  'b2': {
    title: 'File System Hierarchy',
    module: 'Basics',
    steps: [
      {
        id: 1,
        title: 'The Root Directory',
        content: 'In Linux, everything starts at the root directory, denoted by a single slash: /. Unlike Windows (C:/), Linux uses a unified hierarchy.',
        task: 'Explore the root directory. Type "ls" to see what is inside the current directory.',
        check: 'ls'
      },
      {
        id: 2,
        title: 'Home Sweet Home',
        content: 'The /home directory contains personal data for users. Your current path is represented by ~ (tilde).',
        task: 'See your current path by typing "pwd" (Print Working Directory).',
        check: 'pwd'
      },
      {
        id: 3,
        title: 'Final Quiz',
        type: 'quiz',
        question: 'Which directory typically contains system configuration files?',
        options: ['/bin', '/etc', '/home', '/var'],
        correct: 1,
        explanation: '/etc is used for system-wide configuration files.'
      }
    ]
  }
};

export const LessonDetail: React.FC = () => {
  const { id } = useParams();
  const lesson = LESSON_DATA['b2']; // Mocking for now, could be dynamic
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const step = lesson.steps[currentStepIdx];
  const progress = ((currentStepIdx + 1) / lesson.steps.length) * 100;

  const nextStep = () => {
    if (currentStepIdx < lesson.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setQuizSelected(null);
      setQuizSubmitted(false);
    }
  };

  return (
    <div id="lesson-detail" className="min-h-[calc(100vh-64px)] bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8 h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <Link to="/learn" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 text-zinc-400">
               <ChevronLeft />
             </Link>
             <div>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{lesson.module}</span>
                <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
             </div>
          </div>
          <div className="w-64">
             <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-2 uppercase">
               <span>Step {currentStepIdx + 1} of {lesson.steps.length}</span>
               <span>{Math.round(progress)}% Complete</span>
             </div>
             <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 className="h-full bg-emerald-500" 
               />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* Content Pane */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStepIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">{step.title}</h2>
                
                {step.type === 'quiz' ? (
                   <div className="space-y-6">
                      <p className="text-zinc-300 text-lg leading-relaxed">{step.question}</p>
                      <div className="grid gap-3">
                         {step.options?.map((opt, i) => (
                           <button
                             key={i}
                             disabled={quizSubmitted}
                             onClick={() => setQuizSelected(i)}
                             className={`w-full p-4 rounded-xl border text-left transition-all ${
                               quizSelected === i 
                                 ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                                 : 'border-zinc-800 bg-black/20 text-zinc-400 hover:border-zinc-700'
                             } ${
                               quizSubmitted && i === step.correct ? 'border-emerald-500 bg-emerald-500/20' : ''
                             } ${
                               quizSubmitted && quizSelected === i && i !== step.correct ? 'border-rose-500 bg-rose-500/20' : ''
                             }`}
                           >
                              <span className="text-xs font-black mr-3 text-zinc-600">{String.fromCharCode(65 + i)}</span>
                              {opt}
                           </button>
                         ))}
                      </div>
                      {quizSubmitted && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 ${quizSelected === step.correct ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                           {quizSelected === step.correct ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                           <div>
                              <p className="text-sm font-bold">{quizSelected === step.correct ? 'Brilliant!' : 'Not quite right'}</p>
                              <p className="text-xs opacity-80 mt-1">{step.explanation}</p>
                           </div>
                        </div>
                      )}
                      
                      {!quizSubmitted ? (
                        <button 
                          disabled={quizSelected === null}
                          onClick={() => setQuizSubmitted(true)}
                          className="w-full py-4 bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button 
                          onClick={nextStep}
                          className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          {currentStepIdx === lesson.steps.length - 1 ? 'Finish Lesson' : 'Next Step'}
                          <ChevronRight />
                        </button>
                      )}
                   </div>
                ) : (
                   <div className="space-y-6">
                      <p className="text-zinc-300 text-lg leading-relaxed">{step.content}</p>
                      
                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl border-l-4 border-l-emerald-500">
                         <div className="flex items-center gap-2 mb-2">
                           <HelpCircle className="w-4 h-4 text-emerald-500" />
                           <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-tighter">Your Task</h4>
                         </div>
                         <p className="text-zinc-200 text-sm italic">{step.task}</p>
                      </div>

                      <button 
                        onClick={nextStep}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        I've Done This
                        <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Terminal Pane */}
          <div className="h-full flex flex-col">
             <div className="flex items-center gap-2 mb-4">
                <TerminalIcon className="w-5 h-5 text-zinc-500" />
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Interactive Sandbox</h3>
             </div>
             <div className="flex-1 min-h-[400px]">
                <Terminal />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
