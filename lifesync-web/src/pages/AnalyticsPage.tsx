import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../lib/api';
import { BarChart3, TrendingUp, Sparkles, Calendar, DollarSign, ArrowUpRight, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

const AnalyticsPage: React.FC = () => {
  const [spending, setSpending] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const load = async () => {
    setLoading(true);
    try {
      const [spendRes, predRes] = await Promise.all([
        analyticsAPI.spending({ month: selectedMonth, year: selectedYear }),
        analyticsAPI.savingsPrediction().catch(() => ({ data: { data: null } })),
      ]);
      setSpending(spendRes.data.data);
      setPrediction(predRes.data.data);
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Analyzing your transactions...</p>
        </div>
      </div>
    );
  }

  const breakdown = spending?.breakdown || [];
  const dailyTrend = spending?.dailyTrend?.map((item: any) => ({
    day: `Day ${item._id}`,
    amount: item.total,
  })) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Analytics</h1>
          <p className="text-white/40 text-sm">Deep-dive category analysis and savings forecasting</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="bg-[#111127] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none cursor-pointer">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(2026, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="bg-[#111127] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none cursor-pointer">
            {[2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Savings Prediction Card */}
      {prediction && (
        <div className="bg-gradient-to-r from-violet-900/30 via-[#111127] to-purple-900/20 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles size={24} />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg">AI Savings Forecast</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${prediction.confidence === 'high' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  Confidence: {prediction.confidence}
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-2xl">{prediction.message}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <PredictionStat label="Avg. Monthly Spend" value={`₹${prediction.avgMonthlySpend?.toLocaleString('en-IN')}`} />
                <PredictionStat label="Predicted Savings" value={`₹${prediction.predictedSavings?.toLocaleString('en-IN')}`} />
                <PredictionStat label="Target Savings Rate" value={`${prediction.savingsRate}%`} />
                <PredictionStat label="Financial Status" value={prediction.savingsRate >= 20 ? 'Healthy' : 'Needs Review'} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spending Breakdown and Daily Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spending Trend Line Chart */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Daily Spending Trend</h3>
          <p className="text-white/30 text-xs mb-4">Spend distribution across this month</p>
          <div className="h-[260px]">
            {dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrend} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                  <XAxis dataKey="day" tick={{ fill: '#ffffff30', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#ffffff30', fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip contentStyle={{ background: '#1a1a38', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-white/20 text-sm">No transaction trend data found.</div>
            )}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Breakdown by Category</h3>
          <p className="text-white/30 text-xs mb-4">Total amount spent by category</p>
          <div className="h-[260px]">
            {breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                  <XAxis dataKey="category" tick={{ fill: '#ffffff30', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#ffffff30', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1a1a38', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }} formatter={(v: any) => [`₹${v}`, 'Total']} />
                  <Bar dataKey="total" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                    {breakdown.map((_: any, idx: number) => (
                      <span key={idx} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-white/20 text-sm">No categories spent on yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Details List */}
      <div className="bg-[#111127] border border-white/5 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">Category Analysis</h3>
        <div className="space-y-4">
          {breakdown.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <div>
                  <div className="text-white text-sm font-semibold">{item.category}</div>
                  <div className="text-white/30 text-xs mt-0.5">{item.count} Transactions · Avg: ₹{item.avgAmount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm">₹{item.total.toLocaleString('en-IN')}</div>
                <div className="text-violet-400 text-xs mt-0.5">{item.percentage}% of total</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PredictionStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white/3 rounded-xl p-3 border border-white/5">
    <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider">{label}</div>
    <div className="text-white font-extrabold text-base mt-1">{value}</div>
  </div>
);

export default AnalyticsPage;
