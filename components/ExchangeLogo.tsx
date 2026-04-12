import React from 'react';

export function ExchangeLogo({ exchange, size = 24 }: { exchange: 'binance' | 'bybit' | 'okx' | 'pacifica', size?: number }) {
  if (exchange === 'binance') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L6 8L12 14L18 8L12 2Z" fill="#F0B90B"/>
        <path d="M12 22L6 16L12 10L18 16L12 22Z" fill="#F0B90B"/>
        <path d="M2.5 11.5L0 14L4 18L6.5 15.5L2.5 11.5Z" fill="#F0B90B"/>
        <path d="M21.5 11.5L24 14L20 18L17.5 15.5L21.5 11.5Z" fill="#F0B90B"/>
        <path d="M2.5 12.5L0 10L4 6L6.5 8.5L2.5 12.5Z" fill="#F0B90B"/>
        <path d="M21.5 12.5L24 10L20 6L17.5 8.5L21.5 12.5Z" fill="#F0B90B"/>
      </svg>
    );
  }
  
  if (exchange === 'pacifica') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#06B6D4" />
        <path d="M7 12L12 7L17 12L12 17L7 12Z" fill="#111113" />
        <circle cx="12" cy="12" r="2" fill="#06B6D4" />
      </svg>
    );
  }
  
  return <div className={`w-[${size}px] h-[${size}px] bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold`}>{exchange[0].toUpperCase()}</div>;
}
