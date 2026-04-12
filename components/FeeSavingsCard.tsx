"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface Props {
  annualSavingsUsd: number;
}

export function FeeSavingsCard({ annualSavingsUsd }: Props) {
  const data = [
    { name: 'Binance', fees: annualSavingsUsd * 2 },
    { name: 'Pacifica', fees: annualSavingsUsd }
  ];

  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-zinc-400 text-sm font-medium tracking-wide uppercase">Annual Savings</h3>
          <div className="text-4xl font-extrabold text-[#fbbf24] mt-2 tracking-tight">
            +{formatCurrency(annualSavingsUsd)}
          </div>
          <p className="text-sm text-zinc-500 mt-1">Based on estimated monthly volume</p>
        </div>
      </div>
      
      <div className="h-32 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={80} tick={{fill: '#a1a1aa', fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}} 
              contentStyle={{backgroundColor: '#1a1a1e', border: '1px solid #27272a', borderRadius: '8px'}}
              formatter={(val: number | string | readonly (number | string)[] | undefined) => formatCurrency(Number(Array.isArray(val) ? val[0] : (val || 0)))}
            />
            <Bar dataKey="fees" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Pacifica' ? '#06b6d4' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
