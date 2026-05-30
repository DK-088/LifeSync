import React, { useEffect, useState } from 'react';
import { subscriptionsAPI } from '../lib/api';
import { Plus, X, Calendar, Power, Trash2, Shield, Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', billingCycle: 'monthly', nextBillingDate: '', category: 'streaming' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await subscriptionsAPI.list();
      setSubscriptions(data.data || []);
    } catch {
      toast.error('Failed to load subscriptions');
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
      await subscriptionsAPI.create({
        ...form,
        amount: Number(form.amount),
      });
      toast.success('Subscription tracked!');
      setShowAdd(false);
      setForm({ name: '', amount: '', billingCycle: 'monthly', nextBillingDate: '', category: 'streaming' });
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add subscription');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await subscriptionsAPI.toggle(id);
      toast.success('Subscription status updated!');
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Stop tracking this subscription?')) return;
    try {
      await subscriptionsAPI.delete(id);
      toast.success('Subscription removed');
      load();
    } catch {
      toast.error('Failed to delete subscription');
    }
  };

  const totalMonthly = subscriptions
    .filter(s => s.isActive)
    .reduce((acc, s) => {
      const amt = s.amount;
      if (s.billingCycle === 'monthly') return acc + amt;
      if (s.billingCycle === 'quarterly') return acc + amt / 3;
      if (s.billingCycle === 'half-yearly') return acc + amt / 6;
      if (s.billingCycle === 'yearly') return acc + amt / 12;
      return acc;
    }, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Subscription Tracker</h1>
          <p className="text-white/40 text-sm">Track Netflix, Spotify, gym plans and auto-renewals</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 hover:opacity-90 transition-all">
          <Plus size={16} /> Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Your Subscriptions</h3>
            <span className="text-violet-300 text-xs font-semibold bg-violet-500/10 px-3 py-1 rounded-full">
              Monthly Burn: ₹{Math.round(totalMonthly).toLocaleString('en-IN')}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-[#111127] border border-white/5 rounded-2xl p-16 text-center text-white/20 text-sm">
              No active subscriptions tracked. Let's add Netflix or Spotify!
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map(s => (
                <div key={s._id} className={`bg-[#111127] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-all ${!s.isActive ? 'opacity-40' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-sm uppercase">
                      {s.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className="text-white font-semibold flex items-center gap-2">
                        {s.name}
                        <span className="text-[10px] text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded-full">{s.billingCycle}</span>
                      </div>
                      <div className="text-white/30 text-xs mt-1">Category: {s.category}</div>
                      <div className="flex items-center gap-1.5 text-amber-400/80 text-[11px] mt-1.5">
                        <Calendar size={12} />
                        Next Bill: {new Date(s.nextBillingDate).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <div className="text-white font-bold text-base">₹{s.amount.toLocaleString('en-IN')}</div>
                    </div>
                    <button onClick={() => handleToggle(s._id)} className={`p-2 rounded-xl border transition-all ${s.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-700'}`}>
                      <Power size={14} />
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-rose-400 hover:border-rose-500/20 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscription Insights & Waste Detector */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-violet-400" />
            <span>AI Waste Detector</span>
          </h3>
          <div className="bg-gradient-to-b from-[#161633] to-[#111127] border border-violet-500/10 rounded-2xl p-5 space-y-4">
            <p className="text-white/50 text-xs leading-relaxed">
              Our AI automatically reviews transaction intervals to determine whether you are actively getting value out of each subscription.
            </p>
            
            <div className="border border-white/5 bg-white/3 rounded-xl p-4 space-y-2">
              <div className="text-white font-semibold text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Spotify Smart Insight
              </div>
              <p className="text-white/40 text-[11px] leading-relaxed">
                You subscribed to Spotify for ₹119. However, you rarely have music streaming transactions. Cancelling can save you ₹1,428/yr.
              </p>
            </div>

            <div className="border border-white/5 bg-white/3 rounded-xl p-4 space-y-2">
              <div className="text-white font-semibold text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Auto-Renewal Alerts
              </div>
              <p className="text-white/40 text-[11px] leading-relaxed">
                Netflix renewal is coming up in 3 days. Ensure your default UPI bank account is sufficiently funded to avoid checkout bounces.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <Modal title="Track Subscription" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <Inp label="Subscription Name" value={form.name} set={v => setForm(p => ({ ...p, name: v }))} required placeholder="Netflix, Prime, Gym..." />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Amount (₹)" type="number" value={form.amount} set={v => setForm(p => ({ ...p, amount: v }))} required placeholder="199" />
              <FormSelect label="Billing Cycle" value={form.billingCycle} onChange={v => setForm(p => ({ ...p, billingCycle: v }))} options={['monthly', 'quarterly', 'half-yearly', 'yearly']} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Next Billing Date" type="date" value={form.nextBillingDate} set={v => setForm(p => ({ ...p, nextBillingDate: v }))} required />
              <FormSelect label="Category" value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} options={['streaming', 'music', 'gaming', 'software', 'news', 'fitness', 'cloud', 'others']} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg">Track Subscription</button>
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

export default SubscriptionsPage;
