import { formatCurrency, formatPriceCurrency, formatPercent, formatTimeMs } from './format';

describe('lib/format', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(100.5)).toBe('$100.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format price currency with more decimals', () => {
    const formatted = formatPriceCurrency(1.23456);
    expect(formatted).toContain('$1.2346'); // Rounded to 4 decimals
  });

  it('should format percent correctly', () => {
    expect(formatPercent(0.05)).toBe('5.00%');
    expect(formatPercent(1)).toBe('100.00%');
  });

  it('should format time in ms', () => {
    expect(formatTimeMs(150)).toBe('150ms');
    expect(formatTimeMs(1000)).toBe('1,000ms');
  });
});
