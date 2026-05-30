import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import Chart from '../components/Chart';
import WalletCard from '../components/WalletCard';
import SpendingCard from '../components/SpendingCard';
import TransactionTable from '../components/TransactionTable';
import { Calendar, Plus, ChevronDown, TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F8F9] font-sans flex flex-col items-center">
      
      {/* 1. Header Section */}
      <div className="w-full flex justify-center pt-5 px-8">
        <div className="w-full max-w-[1450px]">
          <Header />
        </div>
      </div>

      {/* 2. Title Section */}
      <div className="w-full max-w-[1450px] px-8 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[36px] font-medium text-[#383838] tracking-tight leading-tight">Finance Dashboard</h1>
          <p className="text-[#383838] text-[15px] font-medium tracking-wide opacity-90 mt-1">Overview of your financial health</p>
        </div>

        {/* Action Buttons: Date Range & New Transaction */}
        <div className="flex items-center gap-4">
          {/* Date Picker Bubble */}
          <div className="flex items-center bg-white rounded-full pl-1.5 pr-6 py-2 shadow-[0_4px_20px_rgb(0,0,0,0.01)] border border-slate-100 group cursor-pointer hover:border-slate-200 transition-all">
            <div className="w-9 h-9 rounded-full bg-[#6D3FD8] flex items-center justify-center text-white mr-3">
              <Calendar size={18} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-[#383838]">29 Apr, 2025 - 29 Dec, 2025</span>
            <ChevronDown size={16} strokeWidth={2} className="ml-2 text-slate-500 group-hover:text-slate-500 transition-colors flex-shrink-0 self-center" />
          </div>

          {/* New Transaction Button */}
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#6D3FD8] to-[#9A6BF2] text-white px-7 py-3 rounded-full text-[14px] font-medium shadow-lg shadow-indigo-500/10 hover:opacity-90 transition-all active:scale-95">
            <Plus size={18} strokeWidth={2.5} />
            New Transaction
          </button>
        </div>
      </div>

      {/* 3. Sidebar + Main Content Area */}
      <div className="w-full max-w-[1450px] px-8 mt-5 flex gap-6 flex-1 pb-10">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col xl:flex-row gap-6">
          
          {/* Left Column (takes remaining space) */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            
            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                amount="₹12,5434"
                change="+12.5%"
                isPositive={true}
                lastMonthAmount="122320"
                variant="purple"
                icon={TrendingUp}
              />
              <MetricCard
                title="Total Expenses"
                amount="₹68,240"
                change="-8.5%"
                isPositive={false}
                lastMonthAmount="90,860"
                variant="white"
                icon={TrendingDown}
              />
              <MetricCard
                title="Net Profit"
                amount="₹57,190"
                change="+12.5%"
                isPositive={true}
                lastMonthAmount="72320"
                variant="white"
                icon={DollarSign}
              />
              <MetricCard
                title="Cash Balance"
                amount="₹5,36,450"
                change="-8.5%"
                isPositive={false}
                lastMonthAmount="610560"
                variant="white"
                icon={Wallet}
              />
            </div>

            {/* Performance Overview Chart */}
            <Chart />

            {/* All Transactions Table */}
            <TransactionTable />
          </div>

          {/* Right Column (fixed width on desktop, full-width on mobile) */}
          <div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-6">
            <WalletCard />
            <SpendingCard />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
