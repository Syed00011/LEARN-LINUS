import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { useTerminal } from '../hooks/useTerminal';

export const Terminal: React.FC = () => {
  const { 
    history, 
    execute, 
    cwd, 
    handleTabCompletion, 
    interrupt, 
    runningProcess,
    editorMode,
    setEditorMode,
    editorContent,
    setEditorContent,
    editorFileName,
    saveFile
  } = useTerminal();
  const [input, setInput] = useState('');
  const [vimCmd, setVimCmd] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editorMode) {
      if (vimCmd === ':wq') {
        saveFile(editorFileName!, editorContent);
        setEditorMode(false);
        setVimCmd('');
      } else if (vimCmd === ':q!') {
        setEditorMode(false);
        setVimCmd('');
      } else if (vimCmd === ':w') {
        saveFile(editorFileName!, editorContent);
        setVimCmd('');
      }
      return;
    }
    if (input.trim()) {
      execute(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = handleTabCompletion(input);
      setInput(completed);
    }
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      interrupt();
      setInput('');
    }
  };

  return (
    <div 
      id="terminal-container" 
      onClick={() => {
        if (!editorMode) document.getElementById('terminal-input')?.focus();
      }}
      className="flex flex-col h-[500px] w-full bg-[#020617] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm cursor-text relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">bash — user@linux — {editorMode ? `VIM: ${editorFileName}` : `~/${cwd.join('/')}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] text-slate-600 font-bold select-none">{editorMode ? 'VIM EDITOR' : `~/${cwd.join('/')}`}</span>
        </div>
      </div>

      {/* Editor Mode Overlay */}
      <AnimatePresence>
        {editorMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 top-14 bg-[#020617] z-20 flex flex-col"
          >
            <textarea
              autoFocus
              className="flex-1 bg-transparent border-none outline-none p-6 text-emerald-500/90 leading-relaxed resize-none font-mono selection:bg-emerald-500/20"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="~ INSERT MODE ~"
            />
            <div className="px-6 py-3 bg-slate-900/30 border-t border-slate-800 flex items-center gap-4">
              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">VIM CMD</span>
              <input 
                type="text"
                placeholder="Type :wq to save, :q! to exit..."
                className="bg-transparent border-none outline-none flex-1 text-slate-400 italic text-[11px] placeholder:text-slate-700"
                value={vimCmd}
                onChange={(e) => setVimCmd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lines */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-black/20">
        <AnimatePresence mode="popLayout">
          {history.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-1.5 break-all ${
                line.type === 'input' ? 'text-slate-100 flex gap-2' :
                line.type === 'error' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'
              }`}
            >
              {line.type === 'input' && <span className="text-emerald-500 shrink-0 font-black">user@linux:~$</span>}
              <span className="whitespace-pre-wrap">{line.content}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 flex items-center gap-3">
        {!runningProcess ? (
          <>
            <span className="text-emerald-500 shrink-0 font-black text-xs">user@linux:~$</span>
            <input
              id="terminal-input"
              autoFocus
              className="bg-transparent border-none outline-none flex-1 text-slate-100 placeholder:text-slate-700 caret-emerald-500 font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="..."
              autoComplete="off"
              spellCheck={false}
            />
            {/* Mobile Submit Button */}
            <button 
              type="submit"
              className="sm:hidden p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs italic">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Process running: {runningProcess}...
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); interrupt(); }}
              className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-500/20"
            >
              STOP (CTRL+C)
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
