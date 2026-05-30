import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Download, 
  Lock, 
  ArrowLeftRight, 
  Upload, 
  MoreVertical, 
  TrendingUp 
} from 'lucide-react';

interface WalletCardProps {
  balance?: string;
  spendingJune?: string;
  spendingDiffText?: string;
  transactionsTotal?: string;
  increasePercent?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance = "₹867,550.80",
  spendingJune = "15,800",
  spendingDiffText = "This ₹20,000 less than last month",
  transactionsTotal = "15,800.00",
  increasePercent = "20%",
}) => {
  const [progress, setProgress] = useState(45);

  return (
    <div className="bg-white rounded-[28px] border border-slate-100/80 p-6 flex flex-col justify-between shadow-[0_4px_30px_rgb(0,0,0,0.02)] h-[440px] min-w-[280px]">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-semibold text-[#383838] tracking-tight">My Wallet</h3>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#383838]/80 hover:bg-slate-50 transition-colors active:scale-95">
          <ArrowUpRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. Balance Section */}
      <div className="mt-3">
        <p className="text-[13px] font-medium text-[#383838]/60">Your Balance</p>
        <h2 className="text-[34px] font-semibold text-[#383838] tracking-tight mt-1 leading-none">
          {balance}
        </h2>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        <button 
          title="Download"
          className="flex items-center justify-center h-12 rounded-[16px] bg-[#F6F8F9] text-[#383838]/70 hover:bg-slate-100 hover:text-[#383838] active:scale-95 transition-all"
        >
          <Download size={18} strokeWidth={2.2} />
        </button>
        <button 
          title="Lock"
          className="flex items-center justify-center h-12 rounded-[16px] bg-[#F6F8F9] text-[#383838]/70 hover:bg-slate-100 hover:text-[#383838] active:scale-95 transition-all"
        >
          <Lock size={18} strokeWidth={2.2} />
        </button>
        <button 
          title="Transfer"
          className="flex items-center justify-center h-12 rounded-[16px] bg-[#F6F8F9] text-[#383838]/70 hover:bg-slate-100 hover:text-[#383838] active:scale-95 transition-all"
        >
          <ArrowLeftRight size={18} strokeWidth={2.2} />
        </button>
        <button 
          title="Upload"
          className="flex items-center justify-center h-12 rounded-[16px] bg-[#F6F8F9] text-[#383838]/70 hover:bg-slate-100 hover:text-[#383838] active:scale-95 transition-all"
        >
          <Upload size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* 4. Spending Section */}
      <div className="mt-5">
        <h4 className="text-[14px] font-semibold text-[#383838] mb-3">Spending in June</h4>
        
        {/* Interactive Slider Container */}
        <div className="relative h-10 bg-[#F6F8F9] rounded-full flex items-center p-1 overflow-visible">
          {/* Overlay Invisible Range Input */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress} 
            onChange={(e) => setProgress(Number(e.target.value))} 
            className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full" 
          />

          {/* Visual Track Fill */}
          <div 
            className="absolute left-1 top-1 bottom-1 bg-[#8B5CF6] rounded-full transition-all duration-75"
            style={{ width: `calc(${progress}% - ${(progress * 8) / 100}px)` }}
          />

          {/* Visual Handle */}
          <div 
            className="absolute bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-[0_3px_12px_rgba(0,0,0,0.12)] border border-slate-100 cursor-pointer pointer-events-none z-10 transition-all duration-75"
            style={{ left: `calc(${progress}% - ${(progress * 48) / 100}px)` }}
          >
            <MoreVertical size={16} className="text-[#383838]/80" strokeWidth={2.5} />
          </div>
        </div>

        {/* Labels below slider */}
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-[15px] font-bold text-[#383838]">₹{spendingJune}</span>
          <span className="text-[11px] font-medium text-[#383838]/50 max-w-[170px] text-right truncate">
            {spendingDiffText}
          </span>
        </div>
      </div>

      {/* 5. Bottom Pill Info */}
      <div className="bg-[#F6F8F9] rounded-full p-1.5 flex items-center justify-between mt-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
            <span className="text-[13px] font-bold text-[#383838]">₹</span>
          </div>
          <span className="text-[14px] font-bold text-[#383838]">₹{transactionsTotal}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#EEFDF3] px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-[#10B981]">
          <TrendingUp size={13} strokeWidth={2.5} />
          <span>{increasePercent}</span>
        </div>
      </div>

    </div>
  );
};

export default WalletCard;
