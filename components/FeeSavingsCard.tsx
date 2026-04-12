"use client";

import { useSyncExternalStore } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/format';

export const emptySubscribe = (callback: () => void) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  callback;
  return () => {};
};
export const getClientSnapshot = () => true;
export const getServerSnapshot = () => false;

interface Props {
  annualSavingsUsd: number;
}

export function FeeSavingsCard({ annualSavingsUsd }: Props) {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const data = [
    { name: 'Binance', fees: annualSavingsUsd * 2 },
    { name: 'Pacifica', fees: annualSavingsUsd }
  ];

  return (
    <div className="glass-card rounded-xl p-6 border-gradient relative overflow-hidden">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#fbbf24]/40 to-transparent"></div>
      
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-zinc-500 text-sm font-medium tracking-wide uppercase">Annual Savings</h3>
          <div className="text-4xl font-extrabold gradient-text-gold mt-2 tracking-tight">
            +{formatCurrency(annualSavingsUsd)}
          </div>
          <p className="text-sm text-zinc-600 mt-1">Based on estimated monthly volume</p>
        </div>
      </div>
      
      <div className="h-32 w-full mt-4 relative" style={{ minHeight: '120px' }}>
        {mounted ? (
          <div className="absolute inset-0">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fill: '#71717a', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                  contentStyle={{
                    backgroundColor: '#0a0a18', 
                    border: '1px solid rgba(255,255,255,0.06)', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                  }}
                  formatter={(val: number | string | readonly (number | string)[] | undefined) => formatCurrency(Number(Array.isArray(val) ? val[0] : (val || 0)))}
                />
                <Bar dataKey="fees" radius={[0, 6, 6, 0]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Pacifica' ? '#06b6d4' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-4 h-full">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 w-[80px]">Binance</span>
              <div className="flex-1 h-6 rounded bg-zinc-800/50 animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 w-[80px]">Pacifica</span>
              <div className="flex-1 h-6 rounded bg-zinc-800/50 animate-pulse w-1/2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
