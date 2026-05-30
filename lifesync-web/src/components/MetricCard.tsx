import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  lastMonthAmount: string;
  variant?: 'purple' | 'white';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  change,
  isPositive,
  lastMonthAmount,
  variant = 'white',
}) => {
  const isPurple = variant === 'purple';

  return (
    <div className="relative">
      {/* Floating Action Button — sits in the cutout */}
      {/* Floating Button */}
      <div
        className={`absolute -top-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center z-20 ${isPurple
            ? 'bg-[#8B5CF6] text-white'
            : 'bg-white text-[#383838]/60'
          }`}
      >
        <ArrowUpRight size={18} strokeWidth={2} />
      </div>

      {/* Card with radial-gradient mask cutout */}
      <div
        className={`relative rounded-[28px] px-8 py-7 h-[175px] flex flex-col justify-between overflow-hidden ${isPurple
            ? 'text-white'
            : 'border border-slate-100/80 shadow-[0_4px_30px_rgb(0,0,0,0.03)]'
          }`}
        style={{
          maskImage: 'radial-gradient(circle 16px at calc(100% - 71.8px) 16px, #000 98%, transparent 100%), radial-gradient(circle 16px at calc(100% - 16px) 71.8px, #000 98%, transparent 100%), radial-gradient(circle 60px at calc(100% + 2px) -2px, transparent 98%, #000)',
          WebkitMaskImage: 'radial-gradient(circle 16px at calc(100% - 71.8px) 16px, #000 98%, transparent 100%), radial-gradient(circle 16px at calc(100% - 16px) 71.8px, #000 98%, transparent 100%), radial-gradient(circle 60px at calc(100% + 2px) -2px, transparent 98%, #000)',
          background: isPurple
            ? 'linear-gradient(135deg, #7B4FE0 0%, #8B5CF6 50%, #A87FFB 100%)'
            : '#ffffff',
        }}
      >
        {/* === Purple Card Decorative Elements === */}
        {isPurple && (
          <>
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#9F7AEA]/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#6D3FD8]/30 rounded-full blur-2xl"></div>
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            ></div>
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/[0.08] to-transparent"></div>
          </>
        )}

        {/* === Title === */}
        <p
          className={`text-[15px] font-medium relative z-10 ${isPurple ? 'text-white' : 'text-[#383838]/60'
            }`}
        >
          {title}
        </p>

        {/* === Bottom: Amount + Change Badge + Last Month === */}
        <div className="relative z-10">
          <div className="flex items-baseline gap-3">
            <h2
              className={`text-[30px] font-semibold tracking-tight leading-none ${isPurple ? 'text-white' : 'text-[#383838]'
                }`}
            >
              {amount.startsWith('₹') ? (
                <>
                  <span>₹</span><span style={{ marginLeft: '3px' }}>{amount.slice(1)}</span>
                </>
              ) : amount}
            </h2>
            <span
              className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${
                isPurple
                  ? `bg-white ${isPositive ? 'text-green-600' : 'text-red-600'}`
                  : isPositive
                    ? 'text-green-600 bg-green-50'
                    : 'text-red-500 bg-red-50'
              }`}
            >
              {change}
            </span>
          </div>
          <p
            className={`text-[13px] font-medium mt-2 ${isPurple ? 'text-white' : 'text-[#383838]'
              }`}
          >
            vs last month ₹ {lastMonthAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
