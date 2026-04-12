import { cn } from './utils';

describe('lib/utils', () => {
  it('should merge class names correctly', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('a', { b: true, c: false })).toBe('a b');
    expect(cn('px-2', 'px-4')).toBe('px-4'); // tailwind-merge in action
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });
});
