import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Invoice', to: '/invoice' },
  { label: 'Joint Savings', to: '/savings' },
];

const Header: React.FC = () => {
  return (
    <header className="w-full h-[68px] bg-white/95 backdrop-blur-sm rounded-full px-8 flex items-center justify-between shadow-[0_4px_25px_rgb(0,0,0,0.02)] border border-slate-100 relative">
      {/* Left: Logo Section */}
      <div className="flex items-center gap-3 w-40">
        <span className="font-semibold text-lg tracking-tight text-[#383838]">LifeSync AI</span>
      </div>
      
      {/* Center: Navigation Tabs (Absolute Centered) */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        {navItems.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-8 py-2.5 rounded-full text-[15px] font-normal tracking-tight transition-all truncate min-w-[100px] text-center ${
                isActive
                  ? 'bg-gradient-to-r from-[#6D3FD8] to-[#9A6BF2] text-white shadow-md shadow-primary/10 tracking-wider'
                  : 'text-[#383838] bg-[#F6F8F9]/80 hover:bg-slate-100 transition-colors'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right Side: Actions Section */}
      <div className="flex items-center gap-3 w-60 justify-end">
        {/* Search Bubble */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F6F8F9]/80 text-[#383838] hover:bg-slate-100 transition-all active:scale-95 group">
          <Search size={18} strokeWidth={2.4} className="group-hover:scale-110 transition-transform opacity-70" />
        </button>
        
        {/* Notification Bubble */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F6F8F9]/80 text-[#383838] hover:bg-slate-100 transition-all relative active:scale-95 group">
          <Bell size={18} strokeWidth={2.4} className="group-hover:scale-110 transition-transform opacity-70" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Profile Section */}
        <div className="flex items-center gap-4 pl-4 border-l border-slate-100/60 ml-2 h-10">
          <div className="w-10 h-10 bg-slate-100 rounded-full cursor-pointer hover:ring-4 hover:ring-primary/5 transition-all overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center h-full">
            <ChevronDown size={18} strokeWidth={2.5} className="text-[#383838] opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
