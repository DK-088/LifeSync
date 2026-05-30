import React from 'react';
import { Search, SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

interface Transaction {
  id: string;
  invoiceId: string;
  clientName: string;
  clientAvatar: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Due';
}

const transactionsData: Transaction[] = [
  {
    id: '1',
    invoiceId: '#INV-029',
    clientName: 'Samantha Wilisam',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '27 Jun 2025',
    amount: '₹3,467',
    status: 'Due',
  },
  {
    id: '2',
    invoiceId: '#INV-030',
    clientName: 'Akrom Muhamad',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: '28 Jun 2025',
    amount: '₹4,500',
    status: 'Paid',
  },
];

const TransactionTable: React.FC = () => {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100/80 p-6 shadow-[0_4px_30px_rgb(0,0,0,0.02)] w-full">
      
      {/* 1. Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-[17px] font-semibold text-[#383838] tracking-tight">All Transaction</h3>
        
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full sm:w-[220px] pl-10 pr-4 py-2 rounded-full border border-slate-200 text-[13px] bg-white focus:outline-none focus:border-indigo-400 transition-all text-[#383838]"
            />
          </div>

          {/* Filter button */}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-[13px] font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors active:scale-95">
            <span>Filter</span>
            <SlidersHorizontal size={14} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="overflow-x-auto w-full rounded-2xl border border-slate-200">
        <table className="w-full text-left border-separate border-spacing-0 min-w-[600px]">
          <thead>
            <tr className="text-slate-700 text-[13px] font-medium">
              <th className="py-3.5 px-4 w-12 bg-[#F6F8F9] border-b border-slate-200 rounded-tl-2xl">
                <div className="w-[18px] h-[18px] rounded-[5px] border border-slate-300 bg-white cursor-pointer hover:border-slate-400 transition-colors" />
              </th>
              <th className="py-3.5 px-4 bg-[#F6F8F9] border-b border-slate-200">Invoice ID</th>
              <th className="py-3.5 px-4 bg-[#F6F8F9] border-b border-slate-200">Client</th>
              <th className="py-3.5 px-4 bg-[#F6F8F9] border-b border-slate-200">Date</th>
              <th className="py-3.5 px-4 bg-[#F6F8F9] border-b border-slate-200">Total Amount</th>
              <th className="py-3.5 px-4 bg-[#F6F8F9] border-b border-slate-200">Status</th>
              <th className="py-3.5 px-4 bg-[#F6F8F9] border-b border-slate-200 rounded-tr-2xl">Action</th>
            </tr>
          </thead>
          
          <tbody>
            {transactionsData.map((tx, idx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors text-[14px] text-[#383838]">
                {/* Checkbox Column */}
                <td className={`py-4 px-4 ${idx < transactionsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="w-[18px] h-[18px] rounded-[5px] border border-slate-200 bg-white hover:border-slate-350 cursor-pointer flex items-center justify-center transition-colors" />
                </td>

                {/* Invoice ID */}
                <td className={`py-4 px-4 font-semibold text-[#383838]/85 ${idx < transactionsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  {tx.invoiceId}
                </td>

                {/* Client (Avatar + Name) */}
                <td className={`py-4 px-4 ${idx < transactionsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <img 
                      src={tx.clientAvatar} 
                      alt={tx.clientName} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-100"
                    />
                    <span className="font-semibold text-slate-800">{tx.clientName}</span>
                  </div>
                </td>

                {/* Date */}
                <td className={`py-4 px-4 text-[#383838]/70 font-medium ${idx < transactionsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  {tx.date}
                </td>

                {/* Total Amount */}
                <td className={`py-4 px-4 font-bold text-slate-800 ${idx < transactionsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  {tx.amount}
                </td>

                {/* Status */}
                <td className={`py-4 px-4 ${idx < transactionsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold ${
                    tx.status === 'Paid'
                      ? 'bg-[#EEFDF3] text-[#10B981]'
                      : 'bg-[#FFFBEB] text-[#F59E0B]'
                  }`}>
                    {tx.status}
                  </span>
                </td>

                {/* Action */}
                <td className={`py-4 px-4 ${idx < transactionsData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-3 text-slate-400">
                    <button className="hover:text-slate-600 transition-colors active:scale-90" title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button className="hover:text-red-500 transition-colors active:scale-90" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TransactionTable;
