import React from 'react';
import { Settings, Bell, Search, MoreVertical, LayoutDashboard, Repeat, CreditCard, ArrowLeftRight, Headphones } from 'lucide-react';

const Header: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
    { label: 'Transaction', icon: <Repeat size={18} />, active: false },
    { label: 'Payments', icon: <CreditCard size={18} />, active: false },
    { label: 'Exchange', icon: <ArrowLeftRight size={18} />, active: false },
    { label: 'Support', icon: <Headphones size={18} />, active: false },
  ];

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xl rotate-3 transform hover:rotate-0 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12C4 12 7 4 12 4C17 4 20 12 20 12C20 12 17 20 12 20C7 20 4 12 4 12Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-black text-white shadow-md' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors border border-gray-200">
          <Settings size={20} />
        </button>
        <div className="relative">
          <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors border border-gray-200">
            <Bell size={20} />
          </button>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-accent cursor-pointer">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
