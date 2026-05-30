import React, { useEffect, useState } from 'react';
import { debtsAPI } from '../lib/api';
import { Plus, X, ArrowDownLeft, ArrowUpRight, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const DebtsPage: React.FC = () => {
  const [debts, setDebts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showPay, setShowPay] = useState<string|null>(null);
  const [payAmt, setPayAmt] = useState('');
  const [form, setForm] = useState({ personName:'', amount:'', type:'borrowed', description:'', dueDate:'' });

  const load = async () => {
    setLoading(true);
    try { const {data}=await debtsAPI.list(); setDebts(data.data?.debts||data.data||[]); }
    catch { toast.error('Failed to load debts'); }
    finally { setLoading(false); }
  };
  useEffect(()=>{load();},[]);

  const handleAdd = async (e:React.FormEvent) => {
    e.preventDefault();
    try { await debtsAPI.create({...form,amount:Number(form.amount),dueDate:form.dueDate||undefined}); toast.success('Debt added!'); setShowAdd(false); load(); }
    catch(err:any){ toast.error(err?.response?.data?.message||'Failed'); }
  };

  const handlePay = async () => {
    if(!showPay||!payAmt)return;
    try { await debtsAPI.pay(showPay,{amount:Number(payAmt)}); toast.success('Payment recorded!'); setShowPay(null); load(); }
    catch(err:any){ toast.error(err?.response?.data?.message||'Failed'); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Debts & EMI</h1><p className="text-white/40 text-sm">Track money borrowed and lent</p></div>
        <button onClick={()=>setShowAdd(true)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 hover:opacity-90 transition-all"><Plus size={16}/> Add Debt</button>
      </div>

      <div className="space-y-3">
        {loading ? <Loader/> : debts.length===0 ? <Empty msg="No debts recorded 🎉"/>
        : debts.map(d=>(
          <div key={d._id} className="bg-[#111127] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.type==='borrowed'?'bg-rose-500/10 text-rose-400':'bg-emerald-500/10 text-emerald-400'}`}>
                {d.type==='borrowed'?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}
              </div>
              <div>
                <div className="text-white font-medium">{d.personName}</div>
                <div className="text-white/30 text-xs mt-0.5">{d.type==='borrowed'?'You owe':'Owes you'} · {d.description||'—'}</div>
                {d.dueDate&&<div className="text-amber-400/70 text-xs mt-0.5">Due: {new Date(d.dueDate).toLocaleDateString('en-IN')}</div>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`font-bold text-lg ${d.type==='borrowed'?'text-rose-400':'text-emerald-400'}`}>₹{(d.remainingAmount||d.amount||0).toLocaleString('en-IN')}</div>
              {d.status!=='paid'&&<button onClick={()=>{setShowPay(d._id);setPayAmt('');}} className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/20">Pay</button>}
              {d.status==='paid'&&<span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">Settled ✓</span>}
            </div>
          </div>
        ))}
      </div>

      {showAdd&&<Modal title="Add Debt" onClose={()=>setShowAdd(false)}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
            {['borrowed','lent'].map(t=><button key={t} type="button" onClick={()=>setForm(p=>({...p,type:t}))} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.type===t?'bg-gradient-to-r from-violet-600 to-purple-600 text-white':'text-white/40'}`}>{t==='borrowed'?'I Borrowed':'I Lent'}</button>)}
          </div>
          <Inp label="Person Name" value={form.personName} set={v=>setForm(p=>({...p,personName:v}))} required/>
          <Inp label="Amount (₹)" type="number" value={form.amount} set={v=>setForm(p=>({...p,amount:v}))} required/>
          <Inp label="Description" value={form.description} set={v=>setForm(p=>({...p,description:v}))}/>
          <Inp label="Due Date" type="date" value={form.dueDate} set={v=>setForm(p=>({...p,dueDate:v}))}/>
          <Btn>Add Debt</Btn>
        </form>
      </Modal>}

      {showPay&&<Modal title="Record Payment" onClose={()=>setShowPay(null)}>
        <div className="space-y-4">
          <Inp label="Payment Amount (₹)" type="number" value={payAmt} set={setPayAmt} required/>
          <Btn onClick={handlePay} color="emerald">Record Payment</Btn>
        </div>
      </Modal>}
    </div>
  );
};

const Modal=({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode})=>(
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[#111127] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5"><h3 className="text-white font-semibold text-lg">{title}</h3><button onClick={onClose} className="text-white/30 hover:text-white"><X size={18}/></button></div>
      {children}
    </div>
  </div>
);
const Inp=({label,value,set,type='text',required,placeholder}:{label:string;value:string;set:(v:string)=>void;type?:string;required?:boolean;placeholder?:string})=>(
  <div><label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label><input type={type} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} required={required} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/60 transition-all"/></div>
);
const Btn=({children,onClick,color='violet'}:{children:React.ReactNode;onClick?:()=>void;color?:string})=>(
  <button type={onClick?'button':'submit'} onClick={onClick} className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${color==='emerald'?'from-emerald-600 to-teal-600':'from-violet-600 to-purple-600'} text-white text-sm font-semibold shadow-lg`}>{children}</button>
);
const Loader=()=>(<div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"/></div>);
const Empty=({msg}:{msg:string})=>(<div className="bg-[#111127] border border-white/5 rounded-2xl p-16 text-center text-white/20 text-sm">{msg}</div>);

export default DebtsPage;
