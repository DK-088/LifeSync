import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,

  startOfDay,
  endOfDay,
  getHours,
  getMinutes,
  differenceInMinutes,
  setHours,
  setMinutes,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  description?: string;
  location?: string;
}

type ViewMode = 'month' | 'week' | 'day';

interface EventCalendarProps {
  events: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onDaySelect?: (date: Date | null) => void;
  selectedDate?: Date | null;
}

// ─── Color Map ───────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  sky: { bg: '#EFF6FF', text: '#0284C7', border: '#BAE6FD', pill: '#0284C7' },
  amber: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', pill: '#D97706' },
  orange: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA', pill: '#EA580C' },
  emerald: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', pill: '#059669' },
  violet: { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE', pill: '#7C3AED' },
  rose: { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3', pill: '#E11D48' },
  indigo: { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE', pill: '#4338CA' },
  teal: { bg: '#F0FDFA', text: '#0D9488', border: '#99F6E4', pill: '#0D9488' },
};
const getColor = (color?: string) => COLOR_MAP[color ?? 'violet'] ?? COLOR_MAP['violet'];

const COLORS = Object.keys(COLOR_MAP);
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function genId() {
  return Math.random().toString(36).slice(2);
}

function eventTopPct(event: CalendarEvent): number {
  const h = getHours(event.start);
  const m = getMinutes(event.start);
  return ((h * 60 + m) / (24 * 60)) * 100;
}

function eventHeightPct(event: CalendarEvent): number {
  const mins = Math.max(30, differenceInMinutes(event.end, event.start));
  return (mins / (24 * 60)) * 100;
}

// ─── Add/Edit Event Modal ─────────────────────────────────────────────────────
interface ModalProps {
  initialDate: Date;
  existingEvent?: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const EventModal: React.FC<ModalProps> = ({ initialDate, existingEvent, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(existingEvent?.title ?? '');
  const [description, setDescription] = useState(existingEvent?.description ?? '');
  const [color, setColor] = useState(existingEvent?.color ?? 'violet');
  const [allDay, setAllDay] = useState(existingEvent?.allDay ?? false);
  const [startStr, setStartStr] = useState(
    existingEvent ? format(existingEvent.start, "yyyy-MM-dd'T'HH:mm") : format(initialDate, "yyyy-MM-dd'T'09:00")
  );
  const [endStr, setEndStr] = useState(
    existingEvent ? format(existingEvent.end, "yyyy-MM-dd'T'HH:mm") : format(initialDate, "yyyy-MM-dd'T'10:00")
  );

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: existingEvent?.id ?? genId(),
      title: title.trim(),
      description: description.trim(),
      color,
      allDay,
      start: allDay ? startOfDay(new Date(startStr)) : new Date(startStr),
      end: allDay ? endOfDay(new Date(endStr)) : new Date(endStr),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] border border-slate-100 shadow-2xl p-6 w-full max-w-[480px] mx-1 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all active:scale-90"
        >
          <X size={15} />
        </button>

        <h2 className="text-[22px] font-medium text-[#383838] mb-0.5">
          {existingEvent ? 'Edit Event' : 'New Event'}
        </h2>
        <p className="text-[13px] font-normal text-[#656669] mb-6">
          {existingEvent ? 'Update event details' : 'Add a new event to your calendar'}
        </p>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block ml-2">Title *</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Event title..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-[14px] text-[#383838] focus:outline-none focus:border-[#9A6BF2] focus:ring-2 focus:ring-[#9A6BF2]/10 transition-all bg-[#F6F8F9]"
            />
          </div>

          {/* All Day toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAllDay(v => !v)}
              className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${allDay ? 'bg-gradient-to-r from-[#6D3FD8] to-[#9A6BF2]' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${allDay ? 'left-4.5' : 'left-0.5'}`} style={{ left: allDay ? '18px' : '2px' }} />
            </button>
            <span className="text-[13px] font-medium text-slate-600">All day event</span>
          </div>

          {/* Date / Time */}
          {!allDay ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block ml-2">Start</label>
                <input type="datetime-local" value={startStr} onChange={e => setStartStr(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-200 text-[13px] text-[#383838] focus:outline-none focus:border-[#9A6BF2] transition-all bg-[#F6F8F9]" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block ml-2">End</label>
                <input type="datetime-local" value={endStr} onChange={e => setEndStr(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-200 text-[13px] text-[#383838] focus:outline-none focus:border-[#9A6BF2] transition-all bg-[#F6F8F9]" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Start Date</label>
                <input type="date" value={startStr.slice(0, 10)} onChange={e => setStartStr(e.target.value + 'T00:00')}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-200 text-[13px] text-[#383838] focus:outline-none focus:border-[#9A6BF2] transition-all bg-[#F6F8F9]" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">End Date</label>
                <input type="date" value={endStr.slice(0, 10)} onChange={e => setEndStr(e.target.value + 'T23:59')}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-200 text-[13px] text-[#383838] focus:outline-none focus:border-[#9A6BF2] transition-all bg-[#F6F8F9]" />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block ml-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details..."
              rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-[14px] text-[#383838] focus:outline-none focus:border-[#9A6BF2] focus:ring-2 focus:ring-[#9A6BF2]/10 transition-all bg-[#F6F8F9] resize-none" />
          </div>

          {/* Color */}
          <div>
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-2 block ml-2">Color</label>
            <div className="flex gap-2 flex-wrap ml-2">
              {COLORS.map(col => {
                const cc = getColor(col);
                return (
                  <button key={col} onClick={() => setColor(col)}
                    className="w-7 h-7 rounded-full transition-all hover:scale-110 active:scale-95"
                    style={{ background: cc.pill, boxShadow: color === col ? `0 0 0 2px white, 0 0 0 4px ${cc.pill}` : 'none' }}
                    title={col}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          {existingEvent && onDelete && (
            <button onClick={() => { onDelete(existingEvent.id); onClose(); }}
              className="px-4 py-3 rounded-2xl border border-red-100 text-red-400 hover:bg-red-50 transition-all flex items-center gap-2 text-[13px] font-medium">
              <Trash2 size={14} /> Delete
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#6D3FD8] to-[#9A6BF2] text-white text-[14px] font-medium shadow-lg shadow-indigo-300/30 hover:opacity-90 transition-all active:scale-95">
            {existingEvent ? 'Update' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Event Pill (used in month view) ─────────────────────────────────────────
const EventPill: React.FC<{ event: CalendarEvent; onClick: (e: React.MouseEvent) => void }> = ({ event, onClick }) => {
  const evColor = getColor(event.color);
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2 py-0.5 rounded-lg text-[11px] font-semibold truncate transition-all hover:opacity-80 active:scale-95 cursor-pointer"
      style={{ background: evColor.bg, color: evColor.text, border: `1px solid ${evColor.border}` }}
    >
      {!event.allDay && <span className="opacity-70 mr-1">{format(event.start, 'h:mm a')}</span>}
      {event.title}
    </button>
  );
};

// ─── Month View ───────────────────────────────────────────────────────────────
const MonthView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate?: Date | null;
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}> = ({ currentDate, events, selectedDate, onDayClick, onEventClick }) => {
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end });

  const eventsForDay = (day: Date) =>
    events.filter(ev =>
      ev.allDay
        ? day >= startOfDay(ev.start) && day <= startOfDay(ev.end)
        : isSameDay(ev.start, day)
    );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {WEEKDAYS_SHORT.map(d => (
          <div key={d} className="py-3 text-center text-[12px] font-semibold text-slate-400">{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${days.length / 7}, minmax(100px, 1fr))` }}>
        {days.map((day, idx) => {
          const dayEvts = eventsForDay(day);
          const today = isToday(day);
          const inMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          return (
            <div
              key={idx}
              onClick={() => onDayClick(day)}
              className={`border-b border-r border-slate-100 p-1.5 flex flex-col gap-1 cursor-pointer transition-all ${isSelected ? 'bg-[#F3EEFF] ring-2 ring-inset ring-[#9A6BF2]/30' :
                  inMonth ? 'hover:bg-[#FAFBFF]' : 'bg-[#FAFBFD]'
                } ${idx % 7 === 0 ? 'border-l-0' : ''}`}
            >
              <span className={`text-[13px] font-semibold self-start w-7 h-7 flex items-center justify-center rounded-full transition-all ${today ? 'bg-gradient-to-br from-[#6D3FD8] to-[#9A6BF2] text-white' :
                  isSelected ? 'bg-[#7C3AED] text-white' :
                    inMonth ? 'text-[#383838] hover:text-[#7C3AED]' : 'text-slate-300'
                }`}>
                {format(day, 'd')}
              </span>
              <div className="flex flex-col gap-0.5">
                {dayEvts.slice(0, 3).map(ev => (
                  <EventPill key={ev.id} event={ev} onClick={e => { e.stopPropagation(); onEventClick(ev, e); }} />
                ))}
                {dayEvts.length > 3 && (
                  <span className="text-[10px] font-semibold text-slate-400 px-1">+{dayEvts.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Week / Day Time Grid ────────────────────────────────────────────────────
const TimeGrid: React.FC<{
  days: Date[];
  events: CalendarEvent[];
  onSlotClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}> = ({ days, events, onSlotClick, onEventClick }) => {
  const HOUR_HEIGHT = 60; // px per hour

  const eventsForDay = (day: Date) =>
    events.filter(ev => !ev.allDay && isSameDay(ev.start, day));

  const allDayForDay = (day: Date) =>
    events.filter(ev => ev.allDay && day >= startOfDay(ev.start) && day <= startOfDay(ev.end));

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Header row */}
      <div className="flex border-b border-slate-100 flex-shrink-0">
        <div className="w-16 flex-shrink-0" />
        {days.map((day, i) => (
          <div key={i} className={`flex-1 text-center py-2 ${i < days.length - 1 ? 'border-r border-slate-100' : ''}`}>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">{format(day, 'EEE')}</div>
            <div className={`text-[18px] font-semibold mx-auto w-9 h-9 flex items-center justify-center rounded-full transition-all ${isToday(day) ? 'bg-gradient-to-br from-[#6D3FD8] to-[#9A6BF2] text-white' : 'text-[#383838]'
              }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* All-day row */}
      {days.some(d => allDayForDay(d).length > 0) && (
        <div className="flex border-b border-slate-100 flex-shrink-0 min-h-[36px]">
          <div className="w-16 flex-shrink-0 flex items-center justify-end pr-3">
            <span className="text-[10px] text-slate-400 font-medium">all-day</span>
          </div>
          {days.map((day, i) => (
            <div key={i} className={`flex-1 p-1 flex flex-col gap-0.5 ${i < days.length - 1 ? 'border-r border-slate-100' : ''}`}>
              {allDayForDay(day).map(ev => (
                <EventPill key={ev.id} event={ev} onClick={e => { e.stopPropagation(); onEventClick(ev, e); }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
          {/* Hour labels */}
          <div className="w-16 flex-shrink-0 relative">
            {HOURS.map(h => (
              <div key={h} className="absolute w-full flex items-start justify-end pr-3" style={{ top: `${h * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}>
                <span className="text-[11px] text-slate-400 font-medium -mt-2">{format(setHours(setMinutes(new Date(), 0), h), 'h a')}</span>
              </div>
            ))}
          </div>
          {/* Day columns */}
          {days.map((day, di) => (
            <div
              key={di}
              className={`flex-1 relative ${di < days.length - 1 ? 'border-r border-slate-100' : ''}`}
              onClick={e => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const y = e.clientY - rect.top;
                const totalMinutes = Math.floor((y / (24 * HOUR_HEIGHT)) * 24 * 60);
                const h = Math.floor(totalMinutes / 60);
                const m = Math.round((totalMinutes % 60) / 15) * 15;
                const clickedDate = setMinutes(setHours(day, Math.min(h, 23)), Math.min(m, 59));
                onSlotClick(clickedDate);
              }}
            >
              {/* Hour gridlines */}
              {HOURS.map(h => (
                <div key={h} className="absolute w-full border-t border-slate-100/80" style={{ top: `${h * HOUR_HEIGHT}px` }} />
              ))}
              {/* Half-hour lines */}
              {HOURS.map(h => (
                <div key={`h${h}`} className="absolute w-full border-t border-slate-100/40 border-dashed" style={{ top: `${h * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }} />
              ))}

              {/* Events */}
              {eventsForDay(day).map(ev => {
                const topPct = eventTopPct(ev);
                const heightPct = eventHeightPct(ev);
                const c = getColor(ev.color);
                return (
                  <button
                    key={ev.id}
                    onClick={e => { e.stopPropagation(); onEventClick(ev, e); }}
                    className="absolute left-1 right-1 rounded-xl px-2 py-1.5 text-left overflow-hidden transition-all hover:brightness-95 active:scale-[0.98] z-10"
                    style={{
                      top: `calc(${topPct}% + 1px)`,
                      height: `calc(${heightPct}% - 2px)`,
                      background: c.bg,
                      border: `1.5px solid ${c.border}`,
                      color: c.text,
                    }}
                  >
                    <p className="text-[12px] font-bold leading-tight truncate">{ev.title}</p>
                    {heightPct > 4 && (
                      <p className="text-[10px] opacity-70 mt-0.5 truncate">
                        {format(ev.start, 'h:mm')} – {format(ev.end, 'h:mm a')}
                      </p>
                    )}
                  </button>
                );
              })}

              {/* Current time indicator */}
              {isToday(day) && (() => {
                const now = new Date();
                const pct = ((getHours(now) * 60 + getMinutes(now)) / (24 * 60)) * 100;
                return (
                  <div className="absolute w-full flex items-center z-20 pointer-events-none" style={{ top: `${pct}%` }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] -ml-1.5 flex-shrink-0" />
                    <div className="flex-1 h-px bg-[#7C3AED]" />
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main EventCalendar ───────────────────────────────────────────────────────
export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onDaySelect,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>('month');
  const [modal, setModal] = useState<{ date: Date; event?: CalendarEvent } | null>(null);

  // Navigation
  const goBack = () => {
    if (view === 'month') setCurrentDate(d => subMonths(d, 1));
    if (view === 'week') setCurrentDate(d => subWeeks(d, 1));
    if (view === 'day') setCurrentDate(d => subDays(d, 1));
  };
  const goForward = () => {
    if (view === 'month') setCurrentDate(d => addMonths(d, 1));
    if (view === 'week') setCurrentDate(d => addWeeks(d, 1));
    if (view === 'day') setCurrentDate(d => addDays(d, 1));
  };

  const title = view === 'month'
    ? format(currentDate, 'MMMM yyyy')
    : view === 'week'
      ? `${format(startOfWeek(currentDate), 'MMM d')} – ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
      : format(currentDate, 'EEEE, MMMM d, yyyy');

  const weekDays = eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) });

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setModal({ date: event.start, event });
  };

  const handleSave = (event: CalendarEvent) => {
    if (modal?.event) onEventUpdate?.(event);
    else onEventAdd?.(event);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-[20px] border border-slate-100 overflow-hidden shadow-[0_4px_30px_rgb(0,0,0,0.02)] py-3">

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
        {/* Left: Nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-full text-[13px] font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Today
          </button>
          <button onClick={goBack}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          <button onClick={goForward}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
            <ChevronRight size={16} />
          </button>
          <h2 className="text-[18px] font-semibold text-[#383838] ml-2">{title}</h2>
        </div>

        {/* Right: View switcher + Add */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F6F8F9] rounded-full p-1 gap-1">
            {(['month', 'week', 'day'] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium capitalize transition-all cursor-pointer ${view === v
                    ? 'bg-gradient-to-r from-[#6D3FD8] to-[#9A6BF2] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}>
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModal({ date: currentDate })}
            className="flex items-center gap-2 bg-gradient-to-r from-[#6D3FD8] to-[#9A6BF2] text-white px-5 py-2.5 rounded-full text-[13px] font-medium shadow-lg shadow-indigo-300/20 hover:opacity-90 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} /> Add Event
          </button>
        </div>
      </div>

      {/* ── Calendar Body ── */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDayClick={date => { onDaySelect?.(date); }}
            onEventClick={handleEventClick}
          />
        )}
        {view === 'week' && (
          <TimeGrid
            days={weekDays}
            events={events}
            onSlotClick={date => setModal({ date })}
            onEventClick={handleEventClick}
          />
        )}
        {view === 'day' && (
          <TimeGrid
            days={[currentDate]}
            events={events}
            onSlotClick={date => setModal({ date })}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <EventModal
          initialDate={modal.date}
          existingEvent={modal.event}
          onSave={handleSave}
          onDelete={onEventDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default EventCalendar;
