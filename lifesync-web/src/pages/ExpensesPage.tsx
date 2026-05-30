import React, { useEffect, useState } from 'react';
import { expensesAPI } from '../lib/api';
import { Plus, X, Trash2, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food & Dining','Transport','Shopping','Entertainment','Health & Medical','Utilities','Education','Travel','Groceries','Rent','EMI','Investment','Insurance','Subscriptions','Personal Care','Others'];
const PAYMENT_TYPES = ['UPI','Cash','Card','Net Banking','Wallet','Others'];

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [form, setForm] = useState({ amount: '', category: 'Food & Dining', merchant: '', description: '', paymentType: 'UPI' });

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };
      if (filterCat) params.category = filterCat;
      const { data } = await expensesAPI.list(params);
      setExpenses(data.data || []);
    } catch { toast.error('Failed to load expenses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterCat]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await expensesAPI.create({ ...form, amount: Number(form.amount) });
      toast.success('Expense added!');
      setShowAdd(false);
      setForm({ amount: '', category: 'Food & Dining', merchant: '', description: '', paymentType: 'UPI' });
      load();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try { await expensesAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = expenses.filter(e =>
    !search || e.merchant?.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((a, e) => a + e.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-white/40 text-sm">Track every rupee you spend</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 hover:opacity-90 transition-all active:scale-95">
          <Plus size={16}/> Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-[#111127] border border-white/10 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-white/30"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..." className="bg-transparent text-white text-sm outline-none w-full placeholder-white/20"/>
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-[#111127] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none cursor-pointer">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2.5 text-violet-300 text-sm font-semibold">
          Total: ₹{total.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111127] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_100px_120px_100px_50px] gap-4 px-5 py-3 border-b border-white/5 text-white/30 text-xs font-medium uppercase tracking-wider">
          <span>Merchant</span><span>Category</span><span>Payment</span><span>Date</span><span className="text-right">Amount</span><span></span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"/></div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/20 py-16 text-sm">No expenses found. Add your first expense!</div>
        ) : filtered.map(e => (
          <div key={e._id} className="grid grid-cols-[1fr_1fr_100px_120px_100px_50px] gap-4 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
            <div>
              <div className="text-white text-sm font-medium">{e.merchant || 'Unknown'}</div>
              {e.description && <div className="text-white/30 text-xs mt-0.5 truncate max-w-[200px]">{e.description}</div>}
            </div>
            <span className="text-white/60 text-sm"><span className="bg-violet-500/10 text-violet-300 text-xs px-2 py-0.5 rounded-lg">{e.category}</span></span>
            <span className="text-white/40 text-xs">{e.paymentType}</span>
            <span className="text-white/40 text-xs">{new Date(e.createdAt).toLocaleDateString('en-IN')}</span>
            <span className="text-rose-400 text-sm font-semibold text-right">₹{e.amount.toLocaleString('en-IN')}</span>
            <button onClick={() => handleDelete(e._id)} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[#111127] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add Expense</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white"><X size={18}/></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <FormField label="Amount (₹)" type="number" value={form.amount} onChange={v => setForm(p => ({...p, amount: v}))} required placeholder="500"/>
              <div className="grid grid-cols-2 gap-3">
                <FormSelect label="Category" value={form.category} onChange={v => setForm(p => ({...p, category: v}))} options={CATEGORIES}/>
                <FormSelect label="Payment Type" value={form.paymentType} onChange={v => setForm(p => ({...p, paymentType: v}))} options={PAYMENT_TYPES}/>
              </div>
              <FormField label="Merchant" value={form.merchant} onChange={v => setForm(p => ({...p, merchant: v}))} placeholder="Swiggy, Amazon..."/>
              <FormField label="Description" value={form.description} onChange={v => setForm(p => ({...p, description: v}))} placeholder="Lunch with team"/>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-purple-900/30 hover:opacity-90 transition-all">Add Expense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FormField = ({label,value,onChange,type='text',placeholder,required}:{label:string;value:string;onChange:(v:string)=>void;type?:string;placeholder?:string;required?:boolean}) => (
  <div><label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/60 transition-all"/></div>
);

const FormSelect = ({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}) => (
  <div><label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
  <select value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/60 transition-all cursor-pointer">{options.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
);

export default ExpensesPage;
