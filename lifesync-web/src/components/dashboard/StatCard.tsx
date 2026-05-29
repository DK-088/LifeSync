import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ChevronRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  data: any[];
  period?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, data, period = "Past 30 days" }) => {
  const isPositive = trend.startsWith('+') || !trend.startsWith('-');

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-3 mt-1">
            <h3 className="text-3xl font-bold tracking-tight text-brand-primary">{value}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
              isPositive ? 'text-brand-accent bg-[#E6F9F2]' : 'text-red-500 bg-red-50'
            }`}>
              {trend}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-black flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
          {period} <ChevronRight size={14} />
        </button>
      </div>

      <div className="h-24 w-full mt-2 relative">
        <div className={`absolute inset-0 opacity-10 blur-2xl rounded-full ${isPositive ? 'bg-brand-accent' : 'bg-red-500'}`}></div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#00CC88" : "#EF4444"} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={isPositive ? "#00CC88" : "#EF4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#00CC88" : "#EF4444"} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#gradient-${title})`} 
            />
            <Tooltip 
              content={() => null}
              cursor={{ stroke: '#004D4D', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatCard;
