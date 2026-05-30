import React, { useEffect, useState } from 'react';
import { voiceAPI } from '../lib/api';
import { Mic, MicOff, Play, Send, Brain, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VoicePage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data } = await voiceAPI.history();
      setHistory(data.data || []);
    } catch {
      toast.error('Failed to load voice history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();

    // Check if Speech Recognition is supported in the browser
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Indian English pronunciation works well for ₹ amounts

      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onresult = (e: any) => {
        const resultText = e.results[0][0].transcript;
        setText(resultText);
        toast.success('Speech Captured!');
      };
      rec.onerror = () => {
        toast.error('Speech recognition error. Please type your command.');
        setListening(false);
      };
      setRecognition(rec);
    }
  }, []);

  const handleListen = () => {
    if (!recognition) {
      toast.error('Web Speech API is not supported in your browser.');
      return;
    }
    if (listening) {
      recognition.stop();
    } else {
      setText('');
      recognition.start();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    setProcessing(true);
    try {
      const { data } = await voiceAPI.command({ text });
      toast.success(`Intent Detected: ${data.data.voiceCommand.intent}`);
      setText('');
      loadHistory();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to process command');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Voice Assistant</h1>
          <p className="text-white/40 text-sm">Add expenses and reminders using natural speech commands</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2 text-violet-300 text-sm font-semibold">
          <Brain size={14} />
          <span>Natural Language Understanding</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Microphone Interaction Panel */}
        <div className="lg:col-span-2 bg-[#111127] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[400px]">
          <div className="w-full text-center space-y-2">
            <h3 className="text-white font-bold text-lg">Talk to LifeSync</h3>
            <p className="text-white/40 text-xs">Try saying: <strong className="text-violet-300">"Spent ₹1000 on petrol"</strong> or <strong className="text-violet-300">"Add ₹300 for dinner"</strong></p>
          </div>

          {/* Glowing Microphone Button */}
          <div className="relative my-8">
            {listening && (
              <>
                <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-xl animate-ping" />
                <div className="absolute -inset-4 border border-violet-500/20 rounded-full animate-pulse" />
              </>
            )}
            <button
              onClick={handleListen}
              className={`w-28 h-28 rounded-full flex items-center justify-center border transition-all duration-300 z-10 relative ${
                listening
                  ? 'bg-gradient-to-r from-rose-500 to-red-500 border-red-400 text-white shadow-lg shadow-red-950/40'
                  : 'bg-gradient-to-tr from-violet-600 to-purple-600 border-violet-500 text-white shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95'
              }`}
            >
              {listening ? <MicOff size={36} /> : <Mic size={36} />}
            </button>
          </div>

          {/* Form Command Box */}
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={listening ? 'Listening to speech...' : 'Type or speak your financial command...'}
                className="bg-transparent text-white text-sm outline-none w-full placeholder-white/20"
              />
              <button
                type="submit"
                disabled={processing || !text}
                className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 transition-colors"
              >
                {processing ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </form>
        </div>

        {/* History Panel */}
        <div className="bg-[#111127] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg">Command History</h3>
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center text-white/20 text-xs py-8">
                No past voice commands. Try saying something!
              </div>
            ) : (
              history.map((cmd, i) => (
                <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40">{new Date(cmd.createdAt).toLocaleTimeString()}</span>
                    <span className="bg-violet-500/10 text-violet-300 font-bold px-2 py-0.5 rounded">
                      {cmd.intent}
                    </span>
                  </div>
                  <p className="text-white text-xs italic font-medium">"{cmd.transcription}"</p>
                  {cmd.result && (
                    <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                      Added: ₹{cmd.result.amount} ({cmd.result.category})
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
