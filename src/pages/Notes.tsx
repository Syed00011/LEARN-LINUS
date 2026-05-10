import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Save, FileText, ChevronRight, BookOpen } from 'lucide-react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  updatedAt: any;
}

export const Notes: React.FC = () => {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'notes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
      setNotes(notesData.sort((a, b) => b.updatedAt?.seconds - a.updatedAt?.seconds));
    });
    return () => unsubscribe();
  }, [user]);

  const handleCreate = async () => {
    if (!user || !newTitle.trim()) return;
    await addDoc(collection(db, 'notes'), {
      title: newTitle,
      content: newContent,
      userId: user.uid,
      updatedAt: serverTimestamp()
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (!selectedNote) return;
    const noteRef = doc(db, 'notes', selectedNote.id);
    await updateDoc(noteRef, {
      title: selectedNote.title,
      content: selectedNote.content,
      updatedAt: serverTimestamp()
    });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDoc(doc(db, 'notes', id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="p-4 bg-emerald-500/10 rounded-full mb-6">
          <FileText className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Cloud Synced Notes</h2>
        <p className="text-slate-400 max-w-sm mb-8">Login to save your terminal commands, snippets, and study notes securely in your account.</p>
        <button 
           onClick={() => window.location.href = '/login'}
           className="px-8 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl"
        >
          LOG IN NOW
        </button>
      </div>
    );
  }

  return (
    <div id="notes-page" className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 h-[calc(100vh-150px)]">
      <div className="flex h-full gap-6">
        
        {/* Sidebar */}
        <div className="w-full sm:w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-white tracking-widest uppercase text-sm">Lab Notebook</h2>
            <button 
              onClick={() => setIsAdding(true)}
              className="p-2 bg-emerald-500 rounded-xl text-black hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {notes.map(note => (
              <div 
                key={note.id}
                onClick={() => { setSelectedNote(note); setIsAdding(false); }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  selectedNote?.id === note.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-sm line-clamp-1">{note.title}</h4>
                  <button 
                    onClick={(e) => handleDelete(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2">{note.content || 'Empty note...'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bento-card flex flex-col p-0 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div 
                key="new"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col p-8"
              >
                <input 
                  autoFocus
                  placeholder="Note Title..."
                  className="text-3xl font-black bg-transparent border-none outline-none text-white mb-6 placeholder:text-slate-800"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea 
                  placeholder="Record your learning here..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-400 resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <div className="mt-8 flex justify-end gap-4">
                  <button onClick={() => setIsAdding(false)} className="px-6 py-2 text-slate-500 font-bold uppercase text-xs">Cancel</button>
                  <button 
                    onClick={handleCreate}
                    className="px-8 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    SAVE NOTE
                  </button>
                </div>
              </motion.div>
            ) : selectedNote ? (
              <motion.div 
                key={selectedNote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                   <div className="p-2 bg-emerald-500/10 rounded-xl">
                      <FileText className="w-5 h-5 text-emerald-500" />
                   </div>
                   <input 
                    className="text-3xl font-black bg-transparent border-none outline-none text-white flex-1"
                    value={selectedNote.title}
                    onChange={(e) => {
                      const updated = { ...selectedNote, title: e.target.value };
                      setSelectedNote(updated);
                      // In a real app, debounce this
                    }}
                    onBlur={handleUpdate}
                  />
                </div>
                <textarea 
                  className="flex-1 bg-transparent border-none outline-none text-slate-400 resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                  value={selectedNote.content}
                  onChange={(e) => {
                    const updated = { ...selectedNote, content: e.target.value };
                    setSelectedNote(updated);
                  }}
                  onBlur={handleUpdate}
                />
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40">
                <BookOpen className="w-16 h-16 text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Select or create a note to begin</p>
              </div>
            )}
          </AnimatePresence>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};
