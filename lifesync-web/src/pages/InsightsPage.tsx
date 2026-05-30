import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../lib/api';
import { Brain, HelpCircle, Sparkles, Zap, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const InsightsPage: React.FC = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [loadingHabits, setLoadingHabits] = useState(true);

  // Affordability check state
  const [affordAmt, setAffordAmt] = useState('');
  const [affordDesc, setAffordDesc] = useState('');
  const [checking, setChecking] = useState(false);
  const [affordResult, setAffordResult] = useState<any>(null);

  const loadHabits = async () => {
    setLoadingHabits(true);
    try {
      const { data } = await analyticsAPI.habits();
      setHabits(data.data?.habits || []);
    } catch {
      toast.error('Failed to load spending habits');
    } finally {
      setLoadingHabits(false);
    }
  };

  const handleAffordCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affordAmt || !affordDesc) return;
    setChecking(true);
    setAffordResult(null);
    try {
      const { data } = await analyticsAPI.checkAffordability({
        amount: Number(affordAmt),
        description: affordDesc,
      });
      setAffordResult(data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Affordability check failed');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Habit Learning & Affordability</h1>
        <p className="text-white/40 text-sm">Evaluate financial health metrics and test affordability decisions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Can I Afford This Analyzer */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <HelpCircle size={18} className="text-violet-400" />
            <span>"Can I Afford This?" AI Analyzer</span>
          </h3>
          <p className="text-white/40 text-xs leading-relaxed">
            AI evaluates current savings, existing EMI burden, monthly income and outstanding debts to advise if a purchase is financially safe.
          </p>

          <form onSubmit={handleAffordCheck} className="space-y-3.5">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">Purchase Item / Goal</label>
              <input
                type="text"
                value={affordDesc}
                onChange={e => setAffordDesc(e.target.value)}
                placeholder="e.g. iPhone 16 Pro, Weekend Trip"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/60"
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">Estimated Cost (₹)</label>
              <input
                type="number"
                value={affordAmt}
                onChange={e => setAffordAmt(e.target.value)}
                placeholder="e.g. 65000"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/60"
              />
            </div>
            <button
              type="submit"
              disabled={checking}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checking ? 'Analyzing...' : 'Test Affordability'}
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Affordability Result */}
          {affordResult && (
            <div className={`mt-4 border rounded-xl p-4 space-y-3 ${affordResult.canAfford ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
              <div className="flex items-center gap-2">
                {affordResult.canAfford ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-sm">Affordable</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className="text-rose-400" />
                    <span className="text-rose-400 font-bold text-sm">Not Recommended</span>
                  </>
                )}
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{affordResult.adviceText}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-white/5">
                <div>
                  <span className="text-white/40 block">Remaining Budget:</span>
                  <span className="text-white font-medium">₹{affordResult.remaining?.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Purchase Amount:</span>
                  <span className="text-white font-medium">₹{affordResult.purchaseAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Habit Learning Panel */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Brain size={18} className="text-violet-400" />
            <span>AI Spending Habit Tracker</span>
          </h3>
          <p className="text-white/40 text-xs leading-relaxed">
            AI constantly monitors transaction frequency, payment schedules, and weekend outflows to discover routine habits.
          </p>

          {loadingHabits ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center text-white/20 text-sm py-12">
              Not enough transaction history yet. AI learns habits over a 90-day period.
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((h, i) => (
                <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-2 hover:border-violet-500/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs uppercase bg-violet-500/10 px-2 py-0.5 rounded text-violet-300">
                      {h.category}
                    </span>
                    <span className="text-white/40 text-[11px]">Monthly Average: ₹{h.monthlyAverage}</span>
                  </div>
                  <div className="flex items-start gap-2 text-white/60 text-xs leading-relaxed">
                    <Zap size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
                    <p>{h.insight}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
