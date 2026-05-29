import React from 'react';
import { Plus, DollarSign, ChevronRight } from 'lucide-react';

const MyFinancesCard: React.FC = () => {
  const accounts = [
    { name: 'Banking', value: 9681.49, important: true },
    { name: 'Checking Accounts', value: 7583.00, important: true },
    { name: 'Visa', value: 5299.52, indent: true },
    { name: 'Save Target', value: 958.00, indent: true },
    { name: 'Current balance', value: 7602.15, indent: true },
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-brand-primary">My Finances</h3>
        <button className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
          <Plus size={16} /> Add card
        </button>
      </div>

      {/* Credit Card */}
      <div className="relative h-48 w-full bg-[#002B2B] rounded-2xl p-6 text-white mb-8 overflow-hidden shadow-xl group cursor-pointer transition-transform hover:scale-[1.02]">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#004D4D] rounded-full opacity-50 blur-3xl group-hover:opacity-70"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <span className="text-xl font-black italic tracking-widest">VISA</span>
          <div className="flex gap-1">
            <div className="w-10 h-6 bg-white/20 rounded-md"></div>
          </div>
        </div>

        <div className="mt-8 relative z-10 flex flex-col gap-1">
          <div className="flex gap-4">
            <span className="text-xl tracking-[0.2em] font-medium">****</span>
            <span className="text-xl tracking-[0.2em] font-medium">****</span>
            <span className="text-xl tracking-[0.2em] font-medium">****</span>
            <span className="text-3xl font-bold font-mono tracking-tight -mt-2">5491</span>
          </div>
          <div className="flex gap-6 mt-2 opacity-70">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest">Expires End</span>
              <span className="text-xs font-bold">12/23/2030</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-baseline relative z-10">
          <span className="text-lg font-medium opacity-90">James Smith</span>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm"></div>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Wealth List */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pb-4 border-bottom border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full text-brand-primary">
              <DollarSign size={16} />
            </div>
            <span className="text-sm font-bold text-gray-800">Wealth Overview</span>
          </div>
          <span className="text-sm font-bold text-gray-800">$16,531.54</span>
        </div>

        <div className="flex flex-col gap-3 pl-2">
          {accounts.map((acc) => (
            <div key={acc.name} className={`flex justify-between items-center ${acc.indent ? 'pl-8' : ''}`}>
              <div className="flex items-center gap-2 group cursor-pointer">
                {!acc.indent && <ChevronRight size={14} className="text-gray-400 group-hover:text-black" />}
                <span className={`text-sm ${acc.important ? 'font-bold text-gray-700' : 'text-gray-400 font-medium'}`}>
                  {acc.name}
                </span>
              </div>
              <span className={`text-sm ${acc.important ? 'font-bold text-gray-700' : 'text-gray-400 font-medium'}`}>
                ${acc.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFinancesCard;
