import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronRight } from 'lucide-react';

const data = [
  { name: 'Jan', value: 24983, color: '#004D4D' },
  { name: 'Feb', value: 11335, color: '#4D7D7D' },
  { name: 'Mar', value: 5250, color: '#B2C6C6' },
];

const ExpenseStrategyCard: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-brand-primary">Expense Strategy</h3>
          <div className="mt-6">
            <span className="text-4xl font-bold text-brand-primary">$25k</span>
            <span className="text-xs text-gray-500 ml-3 font-medium">Monthly<br/>Expense Insight</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-black flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
          View details <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-brand-primary text-white p-2 rounded-lg text-xs font-bold shadow-lg">
                      ${payload[0].value.toLocaleString()}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-around mt-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${(item.value / 1000).toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseStrategyCard;
