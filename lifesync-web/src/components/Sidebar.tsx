import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  PieChart, 
  LayoutGrid, 
  Lock, 
  ArrowLeftRight, 
  Mail, 
  Settings, 
  LogOut 
} from 'lucide-react';

const topNav = [
  { icon: <Home size={20} strokeWidth={1.5} />, to: '/dashboard' },
  { icon: <PieChart size={20} strokeWidth={1.5} />, to: '/analytics' },
  { icon: <LayoutGrid size={20} strokeWidth={1.5} />, to: '/invoice' },
  { icon: <Lock size={20} strokeWidth={1.5} />, to: '/savings' },
  { icon: <ArrowLeftRight size={20} strokeWidth={1.5} />, to: '/transfers' },
  { icon: <Mail size={20} strokeWidth={1.5} />, to: '/messages' },
];

const bottomNav = [
  { icon: <Settings size={20} strokeWidth={1.5} />, to: '/settings' },
  { icon: <LogOut size={20} strokeWidth={1.5} />, to: '/logout' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[75px] bg-white rounded-[100px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center py-5 flex-shrink-0">
      <div className="flex flex-col h-full w-full items-center">
        
        {/* Top Navigation Group */}
        <div className="flex flex-col gap-2 items-center pt-2">
          {topNav.map(({ icon, to }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <SidebarIcon icon={icon} active={isActive} />
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Group */}
        <div className="flex flex-col items-center mt-auto">
          {bottomNav.map(({ icon, to }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <SidebarIcon icon={icon} active={isActive} />
              )}
            </NavLink>
          ))}
        </div>
        
      </div>
    </aside>
  );
};

const SidebarIcon = ({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) => (
  <button
    className={`w-[54px] h-[54px] rounded-full transition-all flex items-center justify-center relative active:scale-95 group ${
      active
        ? 'bg-gradient-to-tr from-[#6D3FD8] to-[#9A6BF2] text-white'
        : 'text-[#383838] opacity-60 hover:opacity-100 hover:bg-slate-50'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-100' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
  </button>
);

export default Sidebar;
