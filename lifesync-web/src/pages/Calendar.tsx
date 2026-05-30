import { useState } from 'react';
import { addDays, setHours, setMinutes, subDays } from 'date-fns';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { EventCalendar, type CalendarEvent } from '../components/EventCalendar';

// ─── Sample Events (same structure as the user's code) ────────────────────────
const sampleEvents: CalendarEvent[] = [
  {
    allDay: true,
    color: 'sky',
    description: 'Strategic planning for next year',
    end: subDays(new Date(), 23),
    id: '1',
    location: 'Main Conference Hall',
    start: subDays(new Date(), 24),
    title: 'Annual Planning',
  },
  {
    color: 'amber',
    description: 'Submit final deliverables',
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30),
    id: '2',
    location: 'Office',
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0),
    title: 'Project Deadline',
  },
  {
    allDay: true,
    color: 'orange',
    description: 'Strategic planning for next year',
    end: subDays(new Date(), 13),
    id: '3',
    location: 'Main Conference Hall',
    start: subDays(new Date(), 13),
    title: 'Quarterly Budget Review',
  },
  {
    color: 'sky',
    description: 'Weekly team sync',
    end: setMinutes(setHours(new Date(), 11), 0),
    id: '4',
    location: 'Conference Room A',
    start: setMinutes(setHours(new Date(), 10), 0),
    title: 'Team Meeting',
  },
  {
    color: 'emerald',
    description: 'Discuss new project requirements',
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15),
    id: '5',
    location: 'Downtown Cafe',
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0),
    title: 'Lunch with Client',
  },
  {
    allDay: true,
    color: 'violet',
    description: 'New product release',
    end: addDays(new Date(), 6),
    id: '6',
    start: addDays(new Date(), 3),
    title: 'Product Launch',
  },
  {
    color: 'rose',
    description: 'Discuss about new clients',
    end: setMinutes(setHours(addDays(new Date(), 5), 14), 45),
    id: '7',
    location: 'Downtown Cafe',
    start: setMinutes(setHours(addDays(new Date(), 4), 14), 30),
    title: 'Sales Conference',
  },
  {
    color: 'orange',
    description: 'Weekly team sync',
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 30),
    id: '8',
    location: 'Conference Room A',
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0),
    title: 'Team Meeting',
  },
  {
    color: 'sky',
    description: 'Weekly team sync',
    end: setMinutes(setHours(addDays(new Date(), 5), 15), 30),
    id: '9',
    location: 'Conference Room A',
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0),
    title: 'Review contracts',
  },
  {
    color: 'amber',
    description: 'Weekly team sync',
    end: setMinutes(setHours(addDays(new Date(), 5), 11), 0),
    id: '10',
    location: 'Conference Room A',
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45),
    title: 'Team Meeting',
  },
  {
    color: 'emerald',
    description: 'Quarterly marketing planning',
    end: setMinutes(setHours(addDays(new Date(), 9), 15), 30),
    id: '11',
    location: 'Marketing Department',
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0),
    title: 'Marketing Strategy Session',
  },
  {
    allDay: true,
    color: 'sky',
    description: 'Presentation of yearly results',
    end: addDays(new Date(), 17),
    id: '12',
    location: 'Grand Conference Center',
    start: addDays(new Date(), 17),
    title: 'Annual Shareholders Meeting',
  },
  {
    color: 'rose',
    description: 'Brainstorming for new features',
    end: setMinutes(setHours(addDays(new Date(), 27), 17), 0),
    id: '13',
    location: 'Innovation Lab',
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0),
    title: 'Product Development Workshop',
  },
];

// ─── Sample Expenses (keyed by day-of-month for demo) ─────────────────────────
const EXPENSE_POOL: Record<number, { label: string; amount: string; type: 'debit' | 'credit'; category: string }[]> = {
  1: [{ label: 'Netflix', amount: '₹ 649', type: 'debit', category: 'Entertainment' }],
  3: [{ label: 'Salary Credit', amount: '₹ 85,000', type: 'credit', category: 'Income' }, { label: 'Gym Membership', amount: '₹ 1,200', type: 'debit', category: 'Health' }],
  5: [{ label: 'Grocery Store', amount: '₹ 2,340', type: 'debit', category: 'Food' }],
  8: [{ label: 'Electricity Bill', amount: '₹ 1,840', type: 'debit', category: 'Utilities' }, { label: 'Freelance', amount: '₹ 12,000', type: 'credit', category: 'Income' }],
  10: [{ label: 'Rent Payment', amount: '₹ 18,000', type: 'debit', category: 'Housing' }],
  13: [{ label: 'Amazon Order', amount: '₹ 3,499', type: 'debit', category: 'Shopping' }],
  15: [{ label: 'Internet Bill', amount: '₹ 799', type: 'debit', category: 'Utilities' }],
  17: [{ label: 'Dividend Credit', amount: '₹ 4,200', type: 'credit', category: 'Investment' }],
  20: [{ label: 'Fuel', amount: '₹ 1,500', type: 'debit', category: 'Transport' }, { label: 'Dining Out', amount: '₹ 1,100', type: 'debit', category: 'Food' }],
  22: [{ label: 'SIP Investment', amount: '₹ 5,000', type: 'debit', category: 'Investment' }],
  25: [{ label: 'Swiggy Order', amount: '₹ 420', type: 'debit', category: 'Food' }],
  27: [{ label: 'Mobile Recharge', amount: '₹ 299', type: 'debit', category: 'Utilities' }],
  30: [{ label: 'Salary Credit', amount: '₹ 85,000', type: 'credit', category: 'Income' }],
};

const COLOR_MAP_EXT: Record<string, string> = {
  sky: '#0284C7', amber: '#D97706', orange: '#EA580C',
  emerald: '#059669', violet: '#7C3AED', rose: '#E11D48',
  indigo: '#4338CA', teal: '#0D9488',
};

// ─── Calendar Page ────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleEventAdd = (event: CalendarEvent) => setEvents(prev => [...prev, event]);
  const handleEventUpdate = (ev: CalendarEvent) => setEvents(prev => prev.map(e => e.id === ev.id ? ev : e));
  const handleEventDelete = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const handleDaySelect = (date: Date | null) => {
    // toggle off if clicking the same day
    setSelectedDate(prev => (prev && date && prev.toDateString() === date.toDateString()) ? null : date);
  };

  // Events for selected date
  const dayEvents = selectedDate
    ? events.filter(ev =>
      ev.allDay
        ? selectedDate >= new Date(ev.start.toDateString()) && selectedDate <= new Date(ev.end.toDateString())
        : ev.start.toDateString() === selectedDate.toDateString()
    )
    : [];

  // Expenses for selected date (keyed by day number for demo)
  const dayExpenses = selectedDate ? (EXPENSE_POOL[selectedDate.getDate()] ?? []) : [];

  const panelOpen = selectedDate !== null;

  return (
    <div className="min-h-screen bg-[#F6F8F9] font-sans flex flex-col items-center">

      {/* Header */}
      <div className="w-full flex justify-center pt-5 px-8">
        <div className="w-full max-w-[1450px]"><Header /></div>
      </div>

      {/* Title */}
      <div className="w-full max-w-[1450px] px-8 mt-4">
        <h1 className="text-[36px] font-medium text-[#383838] tracking-tight leading-tight">Calendar</h1>
        <p className="text-[#383838] text-[15px] font-medium tracking-wide opacity-90 mt-1">
          Manage your schedule and financial milestones
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1450px] px-8 mt-5 flex gap-6 pb-10" style={{ height: 'calc(200vh - 280px)' }}>
        <Sidebar />

        {/* Calendar + Detail Panel side-by-side */}
        <div className="flex-1 min-w-0 min-h-0 flex gap-5 overflow-hidden">

          {/* EventCalendar — shrinks when panel is open */}
          <div
            className="min-h-0 transition-all duration-300 ease-in-out"
            style={{ flex: panelOpen ? '0 0 60%' : '1' }}
          >
            <EventCalendar
              events={events}
              selectedDate={selectedDate}
              onDaySelect={handleDaySelect}
              onEventAdd={handleEventAdd}
              onEventDelete={handleEventDelete}
              onEventUpdate={handleEventUpdate}
            />
          </div>

          {/* Detail Side Panel */}
          <div
            className="min-h-0 overflow-hidden transition-all duration-300 ease-in-out"
            style={{ flex: panelOpen ? '0 0 38%' : '0 0 0%', opacity: panelOpen ? 1 : 0, width: panelOpen ? undefined : 0 }}
          >
            {selectedDate && (
              <div className="h-full bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_30px_rgb(0,0,0,0.02)] flex flex-col overflow-hidden">

                {/* Panel Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between flex-shrink-0">
                  <div>
                    <p className="text-[14px] font-medium text-[#7C3AED] tracking-widest mb-1">
                      {selectedDate.toLocaleDateString('en-IN', { weekday: 'long' })}
                    </p>
                    <h2 className="text-[26px] font-semibold text-[#383838] leading-tight">
                      {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all active:scale-90 flex-shrink-0 mt-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

                  {/* Events Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[15px] font-medium text-[#383838]">Events</h3>
                      <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
                        {dayEvents.length} Scheduled
                      </span>
                    </div>

                    {dayEvents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 rounded-2xl bg-[#F6F8F9] text-center">
                        <p className="text-[14px] text-[#383838]">No Events on this Day</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {dayEvents.map(ev => {
                          const c = COLOR_MAP_EXT[ev.color ?? 'violet'] ?? '#7C3AED';
                          return (
                            <div key={ev.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                              <div className="w-0.5 h-10 rounded-full flex-shrink-0" style={{ background: c }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold text-[#383838] truncate">{ev.title}</p>
                                <p className="text-[12px] text-slate-400 mt-0.5">
                                  {ev.allDay ? 'All day' : `${ev.start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – ${ev.end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
                                  {ev.location && ` · ${ev.location}`}
                                </p>
                              </div>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${c}15` }}>
                                <span className="text-[10px] font-bold" style={{ color: c }}>EV</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100" />

                  {/* Expenses Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[15px] font-medium text-[#383838]">Expenses</h3>
                      {dayExpenses.length > 0 && (
                        <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
                          {dayExpenses.length} Transaction{dayExpenses.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {dayExpenses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 rounded-2xl bg-[#F6F8F9] text-center">
                        <p className="text-[14px] text-[#383838]">No Transactions recorded</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {dayExpenses.map((exp, i) => (
                          <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] flex-shrink-0 ${exp.type === 'credit' ? 'bg-[#ECFDF5]' : 'bg-[#F6F8F9]'
                                }`}>
                                {exp.type === 'credit' ? '↑' : '↓'}
                              </div>
                              <div>
                                <p className="text-[15px] font-semibold text-[#383838]">{exp.label}</p>
                                <p className="text-[12px] text-slate-400">{exp.category}</p>
                              </div>
                            </div>
                            <span className={`text-[14px] font-bold ${exp.type === 'credit' ? 'text-[#059669]' : 'text-[#383838]'}`}>
                              {exp.type === 'credit' ? '+' : '-'}{exp.amount}
                            </span>
                          </div>
                        ))}

                        {/* Daily total */}
                        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#6D3FD8]/5 to-[#9A6BF2]/5 border border-[#9A6BF2]/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-[#7C3AED]">Day Net</span>
                            <span className="text-[14px] font-bold text-[#7C3AED]">
                              {dayExpenses.reduce((acc, e) => {
                                const n = parseInt(e.amount.replace(/[^\d]/g, ''));
                                return acc + (e.type === 'credit' ? n : -n);
                              }, 0) >= 0 ? '+' : ''}
                              ₹ {Math.abs(dayExpenses.reduce((acc, e) => {
                                const n = parseInt(e.amount.replace(/[^\d]/g, ''));
                                return acc + (e.type === 'credit' ? n : -n);
                              }, 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
