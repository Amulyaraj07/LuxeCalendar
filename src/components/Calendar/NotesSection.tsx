'use client';

import { FileText, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NotesSectionProps {
  notes: Record<string, string>;
  onUpdateNote: (key: string, content: string) => void;
  currentMonthKey: string;
}

export function NotesSection({ notes, onUpdateNote, currentMonthKey }: NotesSectionProps) {
  const [localNote, setLocalNote] = useState(notes[currentMonthKey] || '');

  // Update local state when month changes
  useEffect(() => {
    setLocalNote(notes[currentMonthKey] || '');
  }, [currentMonthKey, notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalNote(value);
    onUpdateNote(currentMonthKey, value);
  };

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md p-6 border-l border-slate-200/50">
      <div className="flex items-center gap-2 mb-4 text-slate-700">
        <FileText className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-lg">Monthly Memos</h3>
      </div>
      
      <div className="relative flex-grow group">
        <textarea
          value={localNote}
          onChange={handleChange}
          placeholder="Jot down some notes for this month..."
          className="w-full h-full min-h-[200px] bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none font-medium leading-relaxed"
        />
        
        <div className="absolute bottom-0 right-0 p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <Save className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/50 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
        Changes are saved automatically
      </div>
    </div>
  );
}
