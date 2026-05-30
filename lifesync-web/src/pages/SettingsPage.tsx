import React, { useEffect, useState } from 'react';
import { authAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Phone, DollarSign, Target, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    monthlyIncome: '',
    savingsGoal: '',
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.me();
      const p = data.data;
      setProfile(p);
      setForm({
        name: p.name || '',
        phone: p.phone || '',
        monthlyIncome: p.monthlyIncome?.toString() || '',
        savingsGoal: p.savingsGoal?.toString() || '',
      });
    } catch {
      toast.error('Failed to load profile settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        monthlyIncome: Number(form.monthlyIncome),
        savingsGoal: Number(form.savingsGoal),
      });
      toast.success('Settings updated!');
      updateUser({
        name: form.name,
        phone: form.phone,
        monthlyIncome: Number(form.monthlyIncome),
        savingsGoal: Number(form.savingsGoal),
      });
      loadProfile();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-white/40 text-sm">Configure system preferences, monthly parameters, and alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 bg-[#111127] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <UserIcon size={18} className="text-violet-400" />
            <span>Profile & Income Settings</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5">Full Name</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <UserIcon size={14} className="text-white/30" />
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    className="bg-transparent text-white text-sm outline-none w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5">Phone Number</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <Phone size={14} className="text-white/30" />
                  <input
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="e.g. +91 9876543210"
                    className="bg-transparent text-white text-sm outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5">Monthly Income (₹)</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <DollarSign size={14} className="text-white/30" />
                  <input
                    type="number"
                    value={form.monthlyIncome}
                    onChange={e => setForm(p => ({ ...p, monthlyIncome: e.target.value }))}
                    required
                    className="bg-transparent text-white text-sm outline-none w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5">Savings Goal Target (₹)</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <Target size={14} className="text-white/30" />
                  <input
                    type="number"
                    value={form.savingsGoal}
                    onChange={e => setForm(p => ({ ...p, savingsGoal: e.target.value }))}
                    required
                    className="bg-transparent text-white text-sm outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <Save size={16} />
                {saving ? 'Saving changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & System Info */}
        <div className="space-y-6">
          <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Shield size={18} className="text-violet-400" />
              <span>Account Security</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                <span className="text-white/40">Email:</span>
                <span className="text-white/80">{profile?.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                <span className="text-white/40">Role:</span>
                <span className="text-violet-300 font-semibold uppercase">{profile?.role || 'user'}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-white/40">Joined:</span>
                <span className="text-white/80">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN') : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
