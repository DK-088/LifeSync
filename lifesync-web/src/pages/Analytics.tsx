import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  ArrowUpRight,
  Download,
  ChevronDown,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const areaData = [
  { month: 'Jan', income: 42000, expenses: 28000 },
  { month: 'Feb', income: 48000, expenses: 32000 },
  { month: 'Mar', income: 39000, expenses: 24000 },
  { month: 'Apr', income: 55000, expenses: 35000 },
  { month: 'May', income: 61000, expenses: 40000 },
  { month: 'Jun', income: 58000, expenses: 37000 },
  { month: 'Jul', income: 67000, expenses: 42000 },
  { month: 'Aug', income: 72000, expenses: 38000 },
  { month: 'Sep', income: 65000, expenses: 45000 },
  { month: 'Oct', income: 78000, expenses: 50000 },
  { month: 'Nov', income: 82000, expenses: 52000 },
  { month: 'Dec', income: 91000, expenses: 58000 },
];

const categoryData = [
  { name: 'Housing', value: 35, amount: 18200, color: '#7C3AED' },
  { name: 'Food', value: 22, amount: 11440, color: '#A78BFA' },
  { name: 'Transport', value: 15, amount: 7800, color: '#C4B5FD' },
  { name: 'Health', value: 12, amount: 6240, color: '#DDD6FE' },
  { name: 'Others', value: 16, amount: 8320, color: '#EDE9FE' },
];

const weeklyData = [
  { day: 'Mon', spent: 3200 },
  { day: 'Tue', spent: 5400 },
  { day: 'Wed', spent: 2800 },
  { day: 'Thu', spent: 6100 },
  { day: 'Fri', spent: 4700 },
  { day: 'Sat', spent: 8200 },
  { day: 'Sun', spent: 3900 },
];

const savingsGoals = [
  { name: 'Emergency Fund', current: 85000, target: 100000, color: '#7C3AED', pct: 85 },
  { name: 'Vacation', current: 32000, target: 50000, color: '#10B981', pct: 64 },
  { name: 'New Laptop', current: 18000, target: 80000, color: '#F59E0B', pct: 22 },
  { name: 'Investment', current: 150000, target: 200000, color: '#3B82F6', pct: 75 },
];

const recentActivity = [
  { label: 'Netflix Subscription', date: 'Today, 9:41 AM', amount: '-₹ 649', type: 'debit', img: '/icon_netflix.png' },
  { label: 'Salary Credit', date: 'Yesterday, 12:00 PM', amount: '+₹ 85,000', type: 'credit', img: '/icon_salary.png' },
  { label: 'Grocery Store', date: 'Yesterday, 7:30 PM', amount: '-₹ 2,340', type: 'debit', img: '/icon_grocery.png' },
  { label: 'Freelance Payment', date: '28 May', amount: '+₹ 12,000', type: 'credit', img: '/icon_freelance.png' },
  { label: 'Electricity Bill', date: '27 May', amount: '-₹ 1,840', type: 'debit', img: '/icon_electricity.png' },
];

// ─── Custom Tooltips ──────────────────────────────────────────────────────────
const AreaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-4 min-w-[180px]">
      <p className="text-[13px] font-semibold text-slate-700 mb-3">{label} 2025</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center gap-6">
          <span className="flex items-center gap-1.5 text-[12px] text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] inline-block" />Income</span>
          <span className="text-[13px] font-bold text-slate-800">₹ {Number(payload[0]?.value).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="flex items-center gap-1.5 text-[12px] text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD] inline-block" />Expenses</span>
          <span className="text-[13px] font-bold text-slate-800">₹ {Number(payload[1]?.value).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-xl p-3">
      <p className="text-[12px] font-semibold text-slate-700">{label}</p>
      <p className="text-[13px] font-bold text-[#7C3AED] mt-1">₹ {Number(payload[0]?.value).toLocaleString()}</p>
    </div>
  );
};

// ─── Main Analytics Page ──────────────────────────────────────────────────────
const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y');

  return (
    <div className="min-h-screen bg-[#F6F8F9] font-sans flex flex-col items-center">

      {/* Header */}
      <div className="w-full flex justify-center pt-5 px-8">
        <div className="w-full max-w-[1450px]">
          <Header />
        </div>
      </div>

      {/* Title Section */}
      <div className="w-full max-w-[1450px] px-8 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[36px] font-medium text-[#383838] tracking-tight leading-tight">Analytics</h1>
          <p className="text-[#383838] text-[15px] font-medium tracking-wide opacity-90 mt-1">Deep insights into your financial patterns</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Period selector */}
          <div className="flex items-center bg-white rounded-full p-1 border border-slate-100 gap-1">
            {(['1M', '3M', '6M', '1Y'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#6D3FD8] to-[#9A6BF2] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Export button */}
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-[#383838] px-5 py-2.5 rounded-full text-[14px] font-medium hover:bg-slate-50 transition-all active:scale-95">
            <Download size={15} strokeWidth={2} />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1450px] px-8 mt-5 flex gap-6 flex-1 pb-10">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* ── Row 1: Metric Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Income"
              amount="₹7,38,000"
              change="+18.4%"
              isPositive={true}
              lastMonthAmount="6,24,000"
              variant="purple"
            />
            <MetricCard
              title="Total Expenses"
              amount="₹4,81,000"
              change="-6.2%"
              isPositive={false}
              lastMonthAmount="5,13,000"
              variant="white"
            />
            <MetricCard
              title="Net Savings"
              amount="₹2,57,000"
              change="+24.1%"
              isPositive={true}
              lastMonthAmount="2,07,000"
              variant="white"
            />
            <MetricCard
              title="Avg. Monthly"
              amount="₹61,500"
              change="+11.3%"
              isPositive={true}
              lastMonthAmount="55,260"
              variant="white"
            />
          </div>

          {/* ── Row 2: Area Chart + Pie Chart ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Area Chart (spans 2) */}
            <div className="xl:col-span-2 bg-white rounded-[28px] border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[20px] font-semibold text-[#383838]">Income vs Expenses</h2>
                  <div className="flex items-center gap-5 mt-3">
                    <span className="flex items-center gap-2 text-[13px] text-slate-500">
                      <span className="w-3 h-3 rounded-full bg-[#7C3AED] inline-block" />Income
                    </span>
                    <span className="flex items-center gap-2 text-[13px] text-slate-500">
                      <span className="w-3 h-3 rounded-full bg-[#C4B5FD] inline-block" />Expenses
                    </span>
                  </div>
                </div>
                <button className="h-10 px-4 rounded-full border border-slate-200 flex items-center gap-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                  2025 <ChevronDown size={14} />
                </button>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#ECECEC" strokeDasharray="4 4" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} content={<AreaTooltip />} />
                    <Area type="monotone" dataKey="income" stroke="#7C3AED" strokeWidth={2.5} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: '#7C3AED' }} />
                    <Area type="monotone" dataKey="expenses" stroke="#C4B5FD" strokeWidth={2} fill="url(#expGrad)" dot={false} activeDot={{ r: 4, fill: '#C4B5FD' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart – Spending Breakdown */}
            <div className="bg-white rounded-[28px] border border-slate-100 p-6">
              <h2 className="text-[18px] font-semibold text-[#383838] mb-1">Spending Breakdown</h2>
              <p className="text-[13px] text-slate-400 mb-4">By category this year</p>
              <div className="flex justify-center">
                <div className="h-[160px] w-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="text-[13px] text-slate-600 font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-400">{cat.value}%</span>
                      <span className="text-[13px] font-semibold text-[#383838]">₹ {cat.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 3: Weekly Spending + Savings Goals ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Weekly Bar Chart */}
            <div className="bg-white rounded-[28px] border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#383838]">Weekly Spending</h2>
                  <p className="text-[13px] text-slate-400 mt-1">This week's daily breakdown</p>
                </div>
                <div className="bg-[#EDE9FE] text-[#7C3AED] text-[12px] font-bold px-3 py-1.5 rounded-full">
                  ₹ 34,300 total
                </div>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barSize={32} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#ECECEC" strokeDasharray="4 4" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip cursor={false} content={<BarTooltip />} />
                    <Bar dataKey="spent" fill="url(#barGrad)" radius={[10, 10, 10, 10]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Savings Goals */}
            <div className="bg-white rounded-[28px] border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#383838]">Savings Goals</h2>
                  <p className="text-[13px] text-slate-400 mt-1">Track your financial targets</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D3FD8] to-[#9A6BF2] flex items-center justify-center text-white hover:opacity-90 transition-opacity active:scale-95">
                  <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="space-y-5">
                {savingsGoals.map((goal) => (
                  <div key={goal.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-medium text-[#383838]">{goal.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-slate-400">₹ {goal.current.toLocaleString()}</span>
                        <span className="text-[11px] text-slate-300">/</span>
                        <span className="text-[12px] font-semibold text-[#383838]">₹ {goal.target.toLocaleString()}</span>
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full ml-1"
                          style={{ background: `${goal.color}18`, color: goal.color }}
                        >
                          {goal.pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${goal.pct}%`, background: goal.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 4: Recent Activity ── */}
          <div className="bg-white rounded-[28px] border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[18px] font-semibold text-[#383838]">Recent Activity</h2>
                <p className="text-[13px] text-slate-400 mt-0.5">Your latest transactions</p>
              </div>
              <button className="text-[13px] font-medium text-[#7C3AED] hover:text-[#6D3FD8] transition-colors flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {recentActivity.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-[#F6F8F9] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#F6F8F9] flex items-center justify-center overflow-hidden group-hover:bg-white transition-colors border border-slate-100">
                      <img src={item.img} alt={item.label} className="w-full h-full object-cover rounded-2xl" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#383838]">{item.label}</p>
                      <p className="text-[12px] text-slate-400 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[15px] font-semibold ${
                      item.type === 'credit' ? 'text-emerald-500' : 'text-[#383838]'
                    }`}
                  >
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;
