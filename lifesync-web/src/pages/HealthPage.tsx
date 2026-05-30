import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../lib/api';
import { HeartPulse, RefreshCw, AlertCircle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const HealthPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await analyticsAPI.health();
      setHealth(data.data);
    } catch {
      toast.error('Failed to load financial health score');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setRefreshing(true);
    try {
      const { data } = await analyticsAPI.recalculateHealth();
      setHealth(data.data);
      toast.success('AI Health Score updated!');
    } catch {
      toast.error('Failed to recalculate score');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Computing health indicators...</p>
        </div>
      </div>
    );
  }

  const score = health?.score || 80;
  const grade = health?.grade || 'B';
  const savings = health?.savingsRate || 0;
  const emi = health?.emiRatio || 0;
  const spendingRatio = health?.spendingRatio || 0;
  const recommendations = health?.recommendations || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Health Score</h1>
          <p className="text-white/40 text-sm">AI evaluates savings rate, debt ratio, and spending trends</p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={refreshing}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Recalculate Score
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score Ring Panel */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff05" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#gradHealth)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 264} 264`}
              />
              <defs>
                <linearGradient id="gradHealth" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
              <span className="text-white font-black text-5xl tracking-tighter">{score}</span>
              <span className="text-violet-300 text-xs font-bold mt-1">GRADE {grade}</span>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <h3 className="text-white font-bold text-lg">
              {score >= 90 ? 'Excellent Standing' :
               score >= 70 ? 'Healthy Standing' :
               score >= 50 ? 'Warning Status' :
               'Risky Standing'}
            </h3>
            <p className="text-white/40 text-xs max-w-xs leading-relaxed">
              Your financial health score is dynamically computed from recent UPI logs and manual entries.
            </p>
          </div>
        </div>

        {/* Detailed Indicators */}
        <div className="lg:col-span-2 bg-[#111127] border border-white/5 rounded-2xl p-6 space-y-6">
          <h3 className="text-white font-bold text-lg">Financial Indicators</h3>

          <div className="space-y-4">
            <IndicatorBar
              label="Monthly Savings Rate"
              value={savings}
              ideal="20%+"
              status={savings >= 20 ? 'good' : savings >= 10 ? 'warning' : 'poor'}
            />
            <IndicatorBar
              label="EMI Burden Ratio"
              value={emi}
              ideal="Under 30%"
              status={emi <= 30 ? 'good' : emi <= 45 ? 'warning' : 'poor'}
              inverse
            />
            <IndicatorBar
              label="Spending-to-Income Ratio"
              value={spendingRatio}
              ideal="Under 75%"
              status={spendingRatio <= 75 ? 'good' : spendingRatio <= 90 ? 'warning' : 'poor'}
              inverse
            />
          </div>
        </div>
      </div>

      {/* AI Recommendations List */}
      <div className="bg-[#111127] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-violet-400" />
          <span>AI Smart Recommendations</span>
        </h3>

        {recommendations.length === 0 ? (
          <div className="text-white/40 text-sm py-4">
            No suggestions yet. Maintain a savings rate above 20% and pay bills on time to stay healthy!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec: string, idx: number) => (
              <div key={idx} className="bg-white/3 border border-white/5 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const IndicatorBar = ({
  label,
  value,
  ideal,
  status,
  inverse = false,
}: {
  label: string;
  value: number;
  ideal: string;
  status: 'good' | 'warning' | 'poor';
  inverse?: boolean;
}) => {
  const rounded = Math.round(value);
  const color = status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500';
  const textColor = status === 'good' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60 font-medium">{label}</span>
        <span className="text-white/40">Ideal: <strong className="text-white">{ideal}</strong></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-white/5 h-3 rounded-full overflow-hidden">
          <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(5, rounded))}%` }} />
        </div>
        <span className={`${textColor} font-bold text-sm w-12 text-right`}>{rounded}%</span>
      </div>
    </div>
  );
};

export default HealthPage;
