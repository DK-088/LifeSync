import React, { useEffect, useState } from 'react';
import { goalsAPI } from '../lib/api';
import { Plus, X, Target, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showContribute, setShowContribute] = useState<string | null>(null);
  const [contribAmt, setContribAmt] = useState('');
  const [form, setForm] = useState({ name: '', targetAmount: '', deadline: '', category: 'Emergency Fund' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await goalsAPI.list();
      setGoals(data.data || []);
    } catch {
      toast.error('Failed to load savings goals');
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
      await goalsAPI.create({
        ...form,
        targetAmount: Number(form.targetAmount),
      });
      toast.success('Savings goal created!');
      setShowAdd(false);
      setForm({ name: '', targetAmount: '', deadline: '', category: 'Emergency Fund' });
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showContribute || !contribAmt) return;
    try {
      await goalsAPI.contribute(showContribute, { amount: Number(contribAmt) });
      toast.success('Contribution recorded!');
      setShowContribute(null);
      setContribAmt('');
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to contribute');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Goal Planner</h1>
          <p className="text-white/40 text-sm">Save for your dreams with AI projections</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 hover:opacity-90 transition-all">
          <Plus size={16} /> Create Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : goals.length === 0 ? (
          <div className="col-span-2 bg-[#111127] border border-white/5 rounded-2xl p-16 text-center text-white/20 text-sm">
            No goals found. Create a savings goal to start tracking progress!
          </div>
        ) : (
          goals.map(g => {
            const current = g.currentAmount || 0;
            const target = g.targetAmount || 1;
            const pct = Math.min(100, Math.round((current / target) * 100));
            return (
              <div key={g._id} className="bg-[#111127] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-all" />
                
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-violet-500/10 text-violet-300 text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">{g.category}</span>
                      <h3 className="text-white font-bold text-lg mt-2">{g.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 text-xs">Target</div>
                      <div className="text-white font-bold">₹{g.targetAmount.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Saved: <strong className="text-violet-300 font-semibold">₹{current.toLocaleString('en-IN')}</strong></span>
                      <span className="text-violet-300 font-bold">{pct}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Calendar size={14} />
                    <span>Target: {g.deadline ? new Date(g.deadline).toLocaleDateString('en-IN') : 'Flexible'}</span>
                  </div>
                  {g.status !== 'completed' ? (
                    <button onClick={() => { setShowContribute(g._id); setContribAmt(''); }} className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold hover:bg-violet-500/20 transition-all">
                      Contribute
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-xs font-semibold">Completed 🎉</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAdd && (
        <Modal title="Create Savings Goal" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <Inp label="Goal Name" value={form.name} set={v => setForm(p => ({ ...p, name: v }))} required placeholder="e.g. Macbook Pro" />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Target Amount (₹)" type="number" value={form.targetAmount} set={v => setForm(p => ({ ...p, targetAmount: v }))} required placeholder="150000" />
              <FormSelect label="Category" value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} options={['Emergency Fund', 'Gadgets', 'Travel', 'Vehicle', 'Home', 'Investment', 'Others']} />
            </div>
            <Inp label="Target Date" type="date" value={form.deadline} set={v => setForm(p => ({ ...p, deadline: v }))} required />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg">Create Goal</button>
          </form>
        </Modal>
      )}

      {showContribute && (
        <Modal title="Add Contribution" onClose={() => setShowContribute(null)}>
          <form onSubmit={handleContribute} className="space-y-4">
            <Inp label="Amount (₹)" type="number" value={contribAmt} set={setContribAmt} required placeholder="5000" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow-lg">Contribute</button>
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

export default GoalsPage;
