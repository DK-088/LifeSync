import React from 'react';
import { MoreVertical } from 'lucide-react';

const SpendingCard: React.FC = () => {
  // Concentric ring properties matching the design
  const rings = [
    { label: '₹40K', value: 78, color: '#8B5CF6', bg: '#F2EEFF', radius: 72, strokeWidth: 10 },
    { label: '₹25K', value: 58, color: '#A78BFA', bg: '#F5F2FF', radius: 52, strokeWidth: 10 },
    { label: '₹10K', value: 38, color: '#C4B5FD', bg: '#F8F6FF', radius: 32, strokeWidth: 10 },
  ];

  return (
    <div className="bg-white rounded-[28px] border border-slate-100/80 p-6 flex flex-col justify-between shadow-[0_4px_30px_rgb(0,0,0,0.02)] h-[350px] min-w-[280px]">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-semibold text-[#383838] tracking-tight">Spending</h3>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#383838]/80 hover:bg-slate-50 transition-colors active:scale-95">
          <MoreVertical size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. Concentric Radial Chart */}
      <div className="relative flex items-center justify-center h-48 mt-2">
        <svg width="180" height="180" className="transform -rotate-90">
          {rings.map((ring, idx) => {
            const circumference = 2 * Math.PI * ring.radius;
            const strokeDashoffset = circumference - (ring.value / 100) * circumference;
            return (
              <g key={idx}>
                {/* Background Ring */}
                <circle
                  cx="90"
                  cy="90"
                  r={ring.radius}
                  fill="transparent"
                  stroke={ring.bg}
                  strokeWidth={ring.strokeWidth}
                />
                {/* Active Ring */}
                <circle
                  cx="90"
                  cy="90"
                  r={ring.radius}
                  fill="transparent"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* Labels over the rings, centered horizontally and positioned vertically at the top peak of each circle */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center">
          <div className="absolute top-[8px] text-[9px] font-bold bg-white text-[#383838]/80 px-1.5 py-0.5 rounded-full shadow-sm border border-slate-100">
            ₹40K
          </div>
          <div className="absolute top-[28px] text-[9px] font-bold bg-white text-[#383838]/80 px-1.5 py-0.5 rounded-full shadow-sm border border-slate-100">
            ₹25K
          </div>
          <div className="absolute top-[48px] text-[9px] font-bold bg-white text-[#383838]/80 px-1.5 py-0.5 rounded-full shadow-sm border border-slate-100">
            ₹10K
          </div>
        </div>
      </div>

      {/* 3. Legend / Categories */}
      <div className="flex justify-between items-center text-[13px] mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          <span className="text-[#383838]/70 font-medium">Shopping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
          <span className="text-[#383838]/70 font-medium">Bills</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" />
          <span className="text-[#383838]/70 font-medium">Food</span>
        </div>
      </div>

    </div>
  );
};

export default SpendingCard;
