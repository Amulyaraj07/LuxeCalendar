'use client';

import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth
} from 'date-fns';

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  content: string;
  dateKey: string; // ISO string for a specific day or "month-year"
}

export function useCalendarState() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 3, 1)); // Default to April 2026
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // If we wanted to track the REAL current date, we'd do it here after mount
    // but starting at a specific month for a "Wall Calendar" mockup is often better.
  }, []);

  // Persistence: Load from localStorage
  useEffect(() => {
    const savedRange = localStorage.getItem('calendar_range');
    const savedNotes = localStorage.getItem('calendar_notes');

    if (savedRange) {
      try {
        const parsed = JSON.parse(savedRange);
        setRange({
          start: parsed.start ? new Date(parsed.start) : null,
          end: parsed.end ? new Date(parsed.end) : null,
        });
      } catch (e) {
        console.error('Failed to parse range', e);
      }
    }

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes', e);
      }
    }
  }, []);

  // Persistence: Save to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('calendar_range', JSON.stringify(range));
  }, [range]);

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

  const handleDateClick = (date: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else if (range.start && !range.end) {
      if (isBefore(date, range.start)) {
        setRange({ start: date, end: range.start });
      } else {
        setRange({ ...range, end: date });
      }
    }
  };

  const updateNote = (key: string, content: string) => {
    setNotes(prev => ({ ...prev, [key]: content }));
  };

  const clearRange = () => setRange({ start: null, end: null });

  // Get all days for the current grid (including padding from prev/next months)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return {
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
    clearRange,
    isMounted,
    isSameMonth: (date: Date) => isSameMonth(date, currentMonth),
  };
}
