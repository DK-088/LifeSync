import React, { useEffect, useState } from 'react';
import { analyticsAPI, expensesAPI } from '../lib/api';
import { TrendingUp, TrendingDown, Wallet, Target, CreditCard, RefreshCw, Brain, Zap, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#7C3AED','#A78BFA','#6D28D9','#C4B5FD','#8B5CF6','#DDD6FE','#4C1D95','#EDE9FE'];

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [dash, sum] = await Promise.all([analyticsAPI.dashboard(), expensesAPI.summary()]);
      setDashboard(dash.data.data);
      setSummary(sum.data.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <PageLoader />;

  const metrics = [
    { label: 'Spent This Month', value: `₹${(dashboard?.totalExpenses||0).toLocaleString('en-IN')}`, icon: <Wallet size={20}/>, color: 'from-violet-600 to-purple-700' },
    { label: 'Monthly Income', value: `₹${(dashboard?.monthlyIncome||0).toLocaleString('en-IN')}`, icon: <TrendingUp size={20}/>, color: 'from-emerald-600 to-teal-700' },
    { label: 'Active Debts', value: `₹${(dashboard?.totalDebt||0).toLocaleString('en-IN')}`, icon: <CreditCard size={20}/>, color: 'from-rose-600 to-pink-700' },
    { label: 'Goal Progress', value: `${dashboard?.goalProgress||0}%`, icon: <Target size={20}/>, color: 'from-amber-500 to-orange-600' },
  ];

  const categoryData = summary?.summary?.map((s:any) => ({ name: s._id, value: s.total })) || [];
  const monthlyTrend = dashboard?.monthlyTrend || [];

  return (
    <div className="p-6 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Your financial overview</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"><RefreshCw size={16}/></button>
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2">
            <Brain size={14} className="text-violet-400"/><span className="text-violet-300 text-sm font-medium">AI Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m,i) => (
          <div key={i} className="bg-[#111127] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-all">
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${m.color} opacity-10`}/>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-3`}>{m.icon}</div>
            <div className="text-white/40 text-xs font-medium mb-1">{m.label}</div>
            <div className="text-white text-2xl font-bold">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[#111127] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Spending Trend</h3>
          <p className="text-white/30 text-xs mb-4">Monthly overview</p>
          <div className="h-[220px]">
            {monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{top:5,right:5,bottom:0,left:0}}>
                  <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3}/><stop offset="100%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="month" tick={{fill:'#ffffff30',fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#ffffff30',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={(v)=>`₹${(v/1000).toFixed(0)}k`}/>
                  <Tooltip contentStyle={{background:'#1a1a38',border:'1px solid #ffffff10',borderRadius:'12px',color:'#fff'}} formatter={(v:any)=>[`₹${Number(v).toLocaleString('en-IN')}`,'Spent']}/>
                  <Area type="monotone" dataKey="total" stroke="#7C3AED" fill="url(#grad)" strokeWidth={2} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            ) : <EmptyState msg="No trend data yet. Add expenses!"/>}
          </div>
        </div>

        <div className="bg-[#111127] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">By Category</h3>
          <p className="text-white/30 text-xs mb-4">This month</p>
          {categoryData.length > 0 ? (
            <>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {categoryData.map((_:any,i:number) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Pie><Tooltip contentStyle={{background:'#1a1a38',border:'1px solid #ffffff10',borderRadius:'12px',color:'#fff',fontSize:'12px'}} formatter={(v:any)=>[`₹${Number(v).toLocaleString('en-IN')}`,'']}/></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {categoryData.slice(0,4).map((c:any,i:number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{background:COLORS[i%COLORS.length]}}/><span className="text-white/50 text-xs truncate max-w-[100px]">{c.name}</span></div>
                    <span className="text-white/70 text-xs font-medium">₹{c.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <EmptyState msg="No expenses this month"/>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center"><Brain size={14} className="text-white"/></div>
            <h3 className="text-white font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {(dashboard?.aiInsights || ['Add expenses to get personalized insights.','Enable voice commands for hands-free tracking.','Set a savings goal to see your progress.']).map((t:string,i:number) => (
              <div key={i} className="flex items-start gap-3 bg-violet-500/5 border border-violet-500/10 rounded-xl p-3">
                <Zap size={14} className="text-violet-400 flex-shrink-0 mt-0.5"/>
                <p className="text-white/60 text-sm leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111127] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Expenses</h3>
            <a href="/expenses" className="text-violet-400 text-xs hover:text-violet-300 flex items-center gap-1">View all <ArrowUpRight size={12}/></a>
          </div>
          {(dashboard?.recentExpenses||[]).length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentExpenses.slice(0,5).map((e:any,i:number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-white text-sm font-medium">{e.merchant||e.category}</div>
                    <div className="text-white/30 text-xs">{new Date(e.createdAt).toLocaleDateString('en-IN')} · {e.category}</div>
                  </div>
                  <div className="text-rose-400 font-semibold text-sm">-₹{e.amount.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          ) : <EmptyState msg="No expenses yet. Add your first one!"/>}
        </div>
      </div>

      {dashboard?.healthScore != null && (
        <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/20 border border-violet-500/20 rounded-2xl p-5 flex items-center gap-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#ffffff10" strokeWidth="8"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#7C3AED" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(dashboard.healthScore/100)*214} 214`}/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-bold text-xl">{dashboard.healthScore}</span></div>
          </div>
          <div>
            <div className="text-white font-semibold text-lg">Financial Health Score</div>
            <div className="text-white/50 text-sm mt-0.5">
              {dashboard.healthScore>=90?'🟢 Excellent':dashboard.healthScore>=70?'🟡 Good':dashboard.healthScore>=50?'🟠 Warning':'🔴 Risky'} — {dashboard.healthScore>=70?'Keep it up!':'Review your spending habits'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"/>
      <p className="text-white/30 text-sm">Loading...</p>
    </div>
  </div>
);

const EmptyState = ({msg}:{msg:string}) => (
  <div className="flex items-center justify-center h-full min-h-[100px] text-white/20 text-sm">{msg}</div>
);

export default Dashboard;
