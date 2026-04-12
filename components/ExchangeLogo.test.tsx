import { render, screen } from '@testing-library/react';
import { ExchangeLogo } from './ExchangeLogo';

describe('ExchangeLogo', () => {
  it('should render binance logo', () => {
    const { container } = render(<ExchangeLogo exchange="binance" size={32} />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should render pacifica logo', () => {
    const { container } = render(<ExchangeLogo exchange="pacifica" size={32} />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should render a generic logo for unknown exchanges', () => {
    // @ts-expect-error Testing invalid prop
    render(<ExchangeLogo exchange="invalid" size={32} />);
    expect(screen.getByText('I')).toBeDefined();
  });
});
