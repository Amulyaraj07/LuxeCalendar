'use client';

import { format } from 'date-fns';
import { useCalendarState } from '@/hooks/useCalendarState';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesSection } from './NotesSection';
import { motion, AnimatePresence } from 'framer-motion';

export default function WallCalendar() {
  const {
    currentMonth,
    range,
    hoverDate,
    notes,
    days,
    nextMonth,
    prevMonth,
    handleDateClick,
    setHoverDate,
    updateNote,
    isMounted,
    isSameMonth
  } = useCalendarState();

  const monthKey = format(currentMonth, 'yyyy-MM');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      {/* Physical Calendar Container */}
      <div className="max-w-6xl w-full flex flex-col shadow-[0_40px_100px_-10px_rgba(0,0,0,0.2)] rounded-3xl overflow-hidden bg-white border border-slate-200 fold-shadow">
        
        {/* Top Fold: Hero Image */}
        <div className="relative h-[25vh] md:h-[40vh] overflow-hidden group">
          {isMounted && (
            <motion.img
              key={monthKey}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              src="/assets/hero-main.png"
              alt="Snowy Peaks"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter opacity-90">
                {format(currentMonth, 'MMMM').toUpperCase()}
              </h1>
              <p className="text-lg font-medium opacity-70 tracking-[0.3em] ml-1">
                {format(currentMonth, 'yyyy')}
              </p>
            </div>
          </div>
          
          {/* Surface Texture Overlay */}
          <div className="absolute inset-0 paper-texture pointer-events-none opacity-20" />
        </div>

        {/* Spiral Binding Visual Aspect */}
        <div className="h-6 bg-slate-100 flex justify-around items-center px-12 relative z-20 shadow-inner">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none h-2" />
        </div>

        {/* Bottom Fold: Content */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_350px] bg-white overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={monthKey}
              initial={{ rotateX: -90, opacity: 0, transformOrigin: 'top' }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col"
            >
              <CalendarHeader 
                currentMonth={currentMonth} 
                onPrev={prevMonth} 
                onNext={nextMonth} 
              />
              <CalendarGrid 
                days={days}
                range={range}
                hoverDate={hoverDate}
                onDateClick={handleDateClick}
                onDateHover={setHoverDate}
                isSameMonth={isSameMonth}
              />
            </motion.div>
          </AnimatePresence>

          <div className="border-t md:border-t-0">
            <NotesSection 
              notes={notes}
              onUpdateNote={updateNote}
              currentMonthKey={monthKey}
            />
          </div>

          {/* Paper Shadow for the fold */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.03] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
    </div>
  );
}
