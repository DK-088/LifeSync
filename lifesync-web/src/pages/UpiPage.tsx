import React, { useEffect, useState } from 'react';
import { notificationsAPI } from '../lib/api';
import { MessageSquare, Send, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const UpiPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [smsText, setSmsText] = useState('');
  const [app, setApp] = useState('GPay');
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await notificationsAPI.transactions();
      setTransactions(data.data || []);
    } catch {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsText) return;
    setParsing(true);
    setParseResult(null);
    try {
      const { data } = await notificationsAPI.parse({
        notificationText: smsText,
        upiApp: app,
      });
      setParseResult(data.data);
      if (data.data.isTransaction) {
        toast.success('UPI Transaction parsed successfully!');
        setSmsText('');
        loadTransactions();
      } else {
        toast.error('Not recognized as a financial transaction.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to parse text');
    } finally {
      setParsing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">UPI Transaction Parser</h1>
          <p className="text-white/40 text-sm">Simulate and parse mobile notification alerts & banking SMS logs</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2 text-violet-300 text-sm font-semibold">
          <Layers size={14} />
          <span>Auto Parser Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parsing simulator form */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <MessageSquare size={18} className="text-violet-400" />
            <span>SMS Notification Simulator</span>
          </h3>
          <p className="text-white/40 text-xs leading-relaxed">
            Paste your standard banking UPI SMS logs or merchant push alerts to test the parsing accuracy.
          </p>

          <form onSubmit={handleParse} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">Select UPI App</label>
              <select
                value={app}
                onChange={e => setApp(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none cursor-pointer focus:border-violet-500/60"
              >
                {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'CRED'].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">Raw SMS Message / Alert Text</label>
              <textarea
                value={smsText}
                onChange={e => setSmsText(e.target.value)}
                rows={4}
                required
                placeholder="e.g. Debited Rs.250 to SWIGGY. Ref: 6271929 from HDFC Bank."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/60 placeholder-white/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={parsing || !smsText}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {parsing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Parsing SMS...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Simulate Parsing
                </>
              )}
            </button>
          </form>

          {/* Parsing Output */}
          {parseResult && (
            <div className={`border rounded-xl p-4 space-y-3 ${parseResult.isTransaction ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
              <div className="flex items-center gap-2">
                {parseResult.isTransaction ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-xs">Transaction Recognized</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-rose-400" />
                    <span className="text-rose-400 font-bold text-xs">Failed to Parse Transaction Details</span>
                  </>
                )}
              </div>
              {parseResult.isTransaction && parseResult.transaction && (
                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <span className="text-white/40 block">Merchant:</span>
                    <span className="text-white font-medium">{parseResult.transaction.merchant || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Amount:</span>
                    <span className="text-rose-400 font-bold">₹{parseResult.transaction.amount}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Ref / Trans ID:</span>
                    <span className="text-white font-medium truncate max-w-[120px] block">{parseResult.transaction.transactionId || '—'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Source App:</span>
                    <span className="text-white font-medium">{parseResult.transaction.upiApp}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Transactions Logs */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg">Parsed SMS Logs Feed</h3>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-white/20 text-xs py-8">
                No SMS logs parsed yet. Try sending simulated text.
              </div>
            ) : (
              transactions.map((tx, i) => (
                <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-3.5 space-y-2 hover:border-violet-500/20 transition-all">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40">{new Date(tx.timestamp || tx.createdAt).toLocaleString('en-IN')}</span>
                    <span className="bg-violet-500/10 text-violet-300 font-bold px-2 py-0.5 rounded uppercase">
                      {tx.upiApp}
                    </span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed truncate">"{tx.notificationText}"</p>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                    <span className="text-white/40">Parsed: <strong className="text-white">{tx.merchant || 'Unknown'}</strong></span>
                    <span className="text-rose-400 font-bold">₹{tx.amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpiPage;
