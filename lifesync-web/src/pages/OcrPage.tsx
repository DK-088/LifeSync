import React, { useState } from 'react';
import { ocrAPI } from '../lib/api';
import { ScanLine, UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const OcrPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) {
      toast.error('Please select a receipt image first');
      return;
    }
    setScanning(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await ocrAPI.scan(fd);
      setResult(data.data);
      toast.success('Receipt scanned successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to scan receipt');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart OCR Scanner</h1>
          <p className="text-white/40 text-sm">Upload physical receipts or bills to automatically extract details</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2 text-violet-300 text-sm font-semibold">
          <ScanLine size={14} />
          <span>OCR Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Container */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[360px] text-center relative overflow-hidden group">
          {previewUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <img src={previewUrl} alt="Receipt preview" className="max-h-[220px] rounded-xl object-contain border border-white/10" />
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
                  Change Image
                  <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                </label>
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-purple-900/30 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {scanning ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Scanning Bill...
                    </>
                  ) : (
                    <>
                      <ScanLine size={14} />
                      Start Scanning
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-12 border-2 border-dashed border-white/10 hover:border-violet-500/40 rounded-xl transition-all">
              <div className="w-14 h-14 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
                <UploadCloud size={28} />
              </div>
              <span className="text-white font-semibold text-sm">Upload Receipt Image</span>
              <span className="text-white/30 text-xs mt-1">Drag & drop or click to choose PNG, JPG, or JPEG</span>
              <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
            </label>
          )}
        </div>

        {/* OCR Scan Results Panel */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <FileText size={18} className="text-violet-400" />
              <span>Extracted Transaction Data</span>
            </h3>
            <p className="text-white/40 text-xs mb-6">Details will automatically populate below after parsing</p>

            {scanning ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                <span className="text-white/40 text-xs">AI is reading text from the bill...</span>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40 text-xs">Merchant Name</span>
                  <span className="text-white font-semibold text-sm">{result.ocrResult?.merchant || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40 text-xs">Category</span>
                  <span className="text-violet-300 font-semibold text-xs bg-violet-500/10 px-2 py-0.5 rounded">
                    {result.ocrResult?.category || 'Others'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40 text-xs">Confidence Score</span>
                  <span className={`font-semibold text-xs ${result.ocrResult?.confidence > 0.7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {Math.round((result.ocrResult?.confidence || 0) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40 text-xs">Total Amount</span>
                  <span className="text-rose-400 font-bold text-base">₹{result.ocrResult?.amount?.toLocaleString('en-IN') || '—'}</span>
                </div>

                {result.savedExpense && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5 mt-4">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-emerald-400 font-semibold text-xs">Expense Auto-Logged</div>
                      <div className="text-white/50 text-[11px] mt-0.5">This transaction has been successfully recorded in your Expenses manager.</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-white/20 text-xs">
                <AlertCircle size={24} className="mb-2" />
                No receipt uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OcrPage;
