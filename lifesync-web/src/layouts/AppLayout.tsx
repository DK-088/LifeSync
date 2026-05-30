import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Brain, LayoutDashboard, Receipt, CreditCard, Target, Bell,
  Mic, ScanLine, BarChart3, HeartPulse, Sparkles, MessageCircle,
  Settings, LogOut, ChevronLeft, ChevronRight, Wallet, User,
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',     to: '/' },
  { icon: Receipt,          label: 'Expenses',      to: '/expenses' },
  { icon: BarChart3,        label: 'Analytics',     to: '/analytics' },
  { icon: CreditCard,       label: 'Debts & EMI',   to: '/debts' },
  { icon: Target,           label: 'Goals',         to: '/goals' },
  { icon: Bell,             label: 'Reminders',     to: '/reminders' },
  { icon: Wallet,           label: 'Subscriptions', to: '/subscriptions' },
  { icon: HeartPulse,       label: 'Health Score',  to: '/health' },
  { icon: Sparkles,         label: 'AI Insights',   to: '/insights' },
  { icon: Mic,              label: 'Voice AI',      to: '/voice' },
  { icon: ScanLine,         label: 'OCR Scanner',   to: '/ocr' },
  { icon: MessageCircle,    label: 'UPI Parser',    to: '/upi' },
];

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex font-sans">
      {/* ── Sidebar ───────────────────────────────── */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        } bg-[#111127] border-r border-white/5 relative`}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/40">
            <Brain size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-sm tracking-tight leading-none">LifeSync</div>
              <div className="text-violet-400 text-[10px] font-medium tracking-widest uppercase mt-0.5">
                AI Platform
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/20 text-violet-300 border border-violet-500/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
          <NavLink
            to="/settings"
            title={collapsed ? 'Settings' : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'text-violet-300 bg-violet-500/10'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Settings size={18} />
            {!collapsed && 'Settings'}
          </NavLink>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} />
            {!collapsed && 'Logout'}
          </button>

          {/* User chip */}
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 mt-2 bg-white/3 rounded-xl border border-white/5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <User size={13} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
                <div className="text-white/30 text-[10px] truncate">{user?.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#1a1a38] border border-white/10 text-white/40 hover:text-white/80 transition-colors flex items-center justify-center z-20"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── Main content ──────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
