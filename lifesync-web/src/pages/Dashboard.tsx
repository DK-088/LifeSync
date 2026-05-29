import React from 'react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import ExpenseStrategyCard from '../components/dashboard/ExpenseStrategyCard';
import BalanceOverviewCard from '../components/dashboard/BalanceOverviewCard';
import MyFinancesCard from '../components/dashboard/MyFinancesCard';
import { Plus, Search, Filter, ChevronDown, Download, MoreHorizontal } from 'lucide-react';

const incomeData = [
  { value: 2000 }, { value: 2200 }, { value: 1800 }, { value: 2400 }, 
  { value: 2100 }, { value: 2300 }, { value: 2200 }
];

const moneyFlowData = [
  { value: 4000 }, { value: 4200 }, { value: 4600 }, { value: 4300 }, 
  { value: 4500 }, { value: 4400 }, { value: 4430 }
];

const Dashboard: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] flex flex-col gap-8">
      <Header />
      
      <main className="flex-1 px-4 lg:px-8 pb-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-end mb-8 mt-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-primary">Good Morning, James</h1>
          </div>
          <button className="bg-brand-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#003B3B] transition-all shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5">
            <Plus size={20} /> New Payments
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-black transition-colors">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-black transition-colors">
              This Month <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-black transition-colors">
              <Download size={14} /> Download
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search"
                className="pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm focus:bg-white focus:border-brand-primary outline-none transition-all w-64 shadow-inner"
              />
            </div>
            <button className="p-2.5 text-gray-400 hover:text-black">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <StatCard 
              title="Income" 
              value="$2,200" 
              trend="+ 8.25%" 
              data={incomeData} 
            />
            <ExpenseStrategyCard />
          </div>

          {/* Middle Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <BalanceOverviewCard />
            <StatCard 
              title="Money Flow" 
              value="$4,430" 
              trend="+ 10.65%" 
              data={moneyFlowData} 
            />
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4">
            <MyFinancesCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
