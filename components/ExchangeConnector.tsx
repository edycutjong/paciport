"use client";

import { useState } from 'react';
import { ExchangeLogo } from './ExchangeLogo';
import { KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ExchangeConnector() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  const handleDemoLogin = () => {
    router.push('/dashboard');
  };

  if (connected) {
    return (
      <div className="flex items-center justify-between bg-[#0a0a18] border border-zinc-800/40 rounded-xl px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <ExchangeLogo exchange="binance" size={20} />
          <span className="font-medium text-zinc-200">Binance Futures</span>
          <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Connected
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-zinc-500 font-mono">API-****-XXXX</div>
          <button onClick={() => setConnected(false)} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">Disconnect</button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border-gradient">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <ExchangeLogo exchange="binance" size={24} />
          <h3 className="font-semibold text-zinc-100">Connect Binance Futures</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Read-only keys</span>
        </div>
      </div>
      
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
            <KeyRound className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="API Key" 
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full bg-[#050510] border border-zinc-800/60 focus:border-[#06b6d4]/50 focus:ring-1 focus:ring-[#06b6d4]/30 rounded-xl py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all font-mono"
          />
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
            <KeyRound className="w-4 h-4" />
          </div>
          <input 
            type="password" 
            placeholder="API Secret" 
            value={apiSecret}
            onChange={e => setApiSecret(e.target.value)}
            className="w-full bg-[#050510] border border-zinc-800/60 focus:border-[#06b6d4]/50 focus:ring-1 focus:ring-[#06b6d4]/30 rounded-xl py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all font-mono"
          />
        </div>
        <button 
          onClick={() => setConnected(true)}
          disabled={!apiKey || !apiSecret}
          className="bg-zinc-100 hover:bg-white text-zinc-900 disabled:bg-zinc-800/40 disabled:text-zinc-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          Connect
        </button>
      </div>

      {/* Demo Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-zinc-800/60"></div>
        <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-zinc-800/60"></div>
      </div>

      {/* Demo Account Button */}
      <button 
        onClick={handleDemoLogin}
        className="w-full btn-demo py-3 rounded-xl text-sm flex items-center justify-center gap-2.5 group"
      >
        <Zap className="w-4 h-4" />
        Try Demo Account — No API Keys Required
      </button>
    </div>
  );
}
