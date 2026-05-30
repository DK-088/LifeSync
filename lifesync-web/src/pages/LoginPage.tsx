import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, Loader2, Sparkles, TrendingUp, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', monthlyIncome: '', savingsGoal: '',
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          monthlyIncome: form.monthlyIncome ? Number(form.monthlyIncome) : 0,
          savingsGoal: form.savingsGoal ? Number(form.savingsGoal) : 0,
        });
        toast.success('Account created! Welcome to LifeSync AI');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-gradient-to-br from-[#1a0a3e] via-[#0f0629] to-[#0D0D1A] p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Brain size={22} className="text-white" />
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">LifeSync AI</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10">
          <h1 className="text-[48px] font-bold text-white leading-[1.15] tracking-tight mb-6">
            Your AI-Powered<br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              Financial Brain
            </span>
          </h1>
          <p className="text-white/50 text-lg mb-10 max-w-sm leading-relaxed">
            Automate expense tracking, get AI insights, and take complete control of your financial life.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-col gap-4">
            {[
              { icon: <Sparkles size={16} />, text: 'Auto UPI Detection — zero manual entry' },
              { icon: <TrendingUp size={16} />, text: 'AI spending insights & predictions' },
              { icon: <Shield size={16} />, text: 'Bank-grade AES-256 security' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="text-violet-400">{f.icon}</div>
                <span className="text-white/70 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 flex gap-8">
          {[['12', 'AI Modules'], ['Real-time', 'Analytics'], ['100%', 'Automated']].map(([val, lbl], i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-white">{val}</div>
              <div className="text-white/40 text-sm">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold">LifeSync AI</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-white/40 mb-8">
            {mode === 'login' ? 'Sign in to your financial dashboard' : 'Start your AI finance journey today'}
          </p>

          {/* Mode Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input label="Full Name" value={form.name} onChange={(v) => set('name', v)} placeholder="Hari Prasath" required />
            )}
            <Input label="Email Address" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@example.com" required />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(v) => set('password', v)}
                placeholder="Min. 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-[34px] text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === 'register' && (
              <>
                <Input label="Phone (optional)" value={form.phone} onChange={(v) => set('phone', v)} placeholder="10-digit Indian number" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Monthly Income (₹)" type="number" value={form.monthlyIncome} onChange={(v) => set('monthlyIncome', v)} placeholder="50000" />
                  <Input label="Savings Goal (₹)" type="number" value={form.savingsGoal} onChange={(v) => set('savingsGoal', v)} placeholder="10000" />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-purple-900/40 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-violet-400 hover:text-violet-300 font-medium">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Input = ({
  label, value, onChange, type = 'text', placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) => (
  <div>
    <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
    />
  </div>
);

export default LoginPage;
