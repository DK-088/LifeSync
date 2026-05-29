import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';

const data = [
  { name: 'Available', value: 65, color: '#004D4D' },
  { name: 'Planned', value: 20, color: '#00CC88' },
  { name: 'Other', value: 15, color: '#FFCC33' },
];

const BalanceOverviewCard: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-brand-primary">Overview</h3>
        <button className="text-gray-400 hover:text-black flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
          View details <ChevronRight size={14} />
        </button>
      </div>

      <div className="h-[300px] w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={90}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center">
          <span className="text-5xl font-black text-brand-primary tracking-tighter">$4,682</span>
          <p className="text-sm text-gray-500 font-medium mt-1">Available balance</p>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs font-bold text-gray-400">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalanceOverviewCard;
