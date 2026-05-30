import React, { useEffect, useState } from 'react';
import { remindersAPI } from '../lib/api';
import { Plus, X, Bell, Calendar, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', reminderDate: '', type: 'custom', priority: 'medium', amount: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [rems, sugs] = await Promise.all([
        remindersAPI.list(),
        remindersAPI.smartSuggestions().catch(() => ({ data: { data: [] } })),
      ]);
      setReminders(rems.data.data || []);
      setSuggestions(sugs.data.data || []);
    } catch {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await remindersAPI.create({
        ...form,
        amount: form.amount ? Number(form.amount) : undefined,
      });
      toast.success('Reminder scheduled!');
      setShowAdd(false);
      setForm({ title: '', description: '', reminderDate: '', type: 'custom', priority: 'medium', amount: '' });
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create reminder');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await remindersAPI.complete(id);
      toast.success('Reminder marked as completed!');
      load();
    } catch {
      toast.error('Failed to update reminder');
    }
  };

  const handleAddSuggestion = async (sug: any) => {
    try {
      await remindersAPI.create({
        title: sug.title,
        description: sug.description || 'AI Recommended reminder',
        reminderDate: sug.dueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
        type: sug.type || 'custom',
        priority: sug.priority || 'medium',
        amount: sug.amount || undefined,
      });
      toast.success('AI Suggestion added!');
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add suggestion');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Life Assistant</h1>
          <p className="text-white/40 text-sm">Task reminders, bills, EMI, and subscriptions</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 hover:opacity-90 transition-all">
          <Plus size={16} /> Schedule Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Reminders List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Bell size={18} className="text-violet-400" />
            <span>Active Reminders</span>
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : reminders.length === 0 ? (
            <div className="bg-[#111127] border border-white/5 rounded-2xl p-16 text-center text-white/20 text-sm">
              All caught up! No active reminders.
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map(r => (
                <div key={r._id} className={`bg-[#111127] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-all ${r.completed ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.completed ? 'bg-zinc-800 text-zinc-500' : r.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-violet-500/10 text-violet-400'}`}>
                      <Bell size={18} />
                    </div>
                    <div>
                      <div className="text-white font-semibold flex items-center gap-2">
                        {r.title}
                        {r.amount && <span className="bg-white/5 px-2 py-0.5 rounded text-xs text-white/60">₹{r.amount}</span>}
                      </div>
                      <div className="text-white/40 text-xs mt-1">{r.description || 'No details'}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[11px] text-white/30">
                          <Calendar size={12} />
                          {new Date(r.reminderDate).toLocaleDateString('en-IN')} at {new Date(r.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${r.priority === 'high' ? 'text-rose-400 bg-rose-500/5' : r.priority === 'medium' ? 'text-violet-400 bg-violet-500/5' : 'text-zinc-400 bg-zinc-500/5'}`}>
                          {r.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!r.completed && (
                    <button onClick={() => handleComplete(r._id)} className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white transition-all">
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Smart Suggestions Panel */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-violet-400" />
            <span>Smart Recommendations</span>
          </h3>

          <div className="bg-gradient-to-b from-[#161633] to-[#111127] border border-violet-500/10 rounded-2xl p-5 space-y-4">
            <p className="text-white/50 text-xs leading-relaxed">
              Our AI analyzes your recurring expense patterns, payment cycles, and past recharges to suggest reminders.
            </p>
            {suggestions.length === 0 ? (
              <div className="text-center text-white/30 text-xs py-8 border border-dashed border-white/5 rounded-xl">
                No new AI suggestions.
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((sug, i) => (
                  <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-3 space-y-2 hover:border-violet-500/30 transition-all">
                    <div>
                      <div className="text-white font-semibold text-xs">{sug.title}</div>
                      <div className="text-white/40 text-[11px] mt-0.5">{sug.description}</div>
                    </div>
                    <button onClick={() => handleAddSuggestion(sug)} className="w-full py-1.5 rounded-lg bg-violet-600 text-white text-[11px] font-semibold hover:bg-violet-500 transition-colors">
                      Accept Suggestion
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <Modal title="Schedule Reminder" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <Inp label="Reminder Title" value={form.title} set={v => setForm(p => ({ ...p, title: v }))} required placeholder="e.g. Electricity Bill" />
            <Inp label="Description" value={form.description} set={v => setForm(p => ({ ...p, description: v }))} placeholder="Due date reminder" />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Reminder Date & Time" type="datetime-local" value={form.reminderDate} set={v => setForm(p => ({ ...p, reminderDate: v }))} required />
              <Inp label="Amount (₹) (Optional)" type="number" value={form.amount} set={v => setForm(p => ({ ...p, amount: v }))} placeholder="e.g. 1500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormSelect label="Reminder Type" value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} options={['bill', 'emi', 'subscription', 'savings', 'custom', 'investment']} />
              <FormSelect label="Priority" value={form.priority} onChange={v => setForm(p => ({ ...p, priority: v }))} options={['low', 'medium', 'high']} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg">Schedule</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[#111127] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Inp = ({ label, value, set, type = 'text', required, placeholder }: { label: string; value: string; set: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) => (
  <div>
    <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} required={required} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/60 transition-all" />
  </div>
);

const FormSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div>
    <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/60 transition-all cursor-pointer">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default RemindersPage;
