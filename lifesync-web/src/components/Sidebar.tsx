import React from 'react';
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

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[75px] bg-white rounded-[100px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center py-5 flex-shrink-0">
      <div className="flex flex-col h-full w-full items-center">
        
        {/* Top Navigation Group */}
        <div className="flex flex-col gap-2 items-center pt-2">
          <SidebarIcon icon={<Home size={20} strokeWidth={1.5} />} />
          <SidebarIcon icon={<PieChart size={20} strokeWidth={1.5} />} />
          <SidebarIcon icon={<LayoutGrid size={20} strokeWidth={1.5} />} active />
          <SidebarIcon icon={<Lock size={20} strokeWidth={1.5} />} />
          <SidebarIcon icon={<ArrowLeftRight size={20} strokeWidth={1.5} />} />
          <SidebarIcon icon={<Mail size={20} strokeWidth={1.5} />} />
        </div>

        {/* Bottom Group - Pushed to bottom with mt-auto */}
        <div className="flex flex-col items-center mt-auto">
          <SidebarIcon icon={<Settings size={20} strokeWidth={1.5} />} />
          <SidebarIcon icon={<LogOut size={20} strokeWidth={1.5} />} />
        </div>
        
      </div>
    </aside>
  );
};

// Helper Component for Sidebar Icons
const SidebarIcon = ({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) => (
  <button className={`w-[54px] h-[54px] rounded-full transition-all flex items-center justify-center relative active:scale-95 group ${
    active 
      ? 'bg-gradient-to-tr from-[#6D3FD8] to-[#9A6BF2] text-white' 
      : 'text-[#383838] opacity-60 hover:opacity-100 hover:bg-slate-50'
  }`}>
    <div className={`transition-transform duration-300 ${active ? 'scale-100' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
  </button>
);

export default Sidebar;
