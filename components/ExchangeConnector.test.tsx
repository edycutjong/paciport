import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExchangeConnector } from './ExchangeConnector';

describe('ExchangeConnector', () => {
  it('should render initial state', () => {
    render(<ExchangeConnector />);
    expect(screen.getByText('Connect Binance Futures')).toBeDefined();
  });

  it('should show success state when connected', async () => {
    render(<ExchangeConnector />);
    const apiKeyInput = screen.getByPlaceholderText('API Key');
    const apiSecretInput = screen.getByPlaceholderText('API Secret');
    const connectButton = screen.getByRole('button', { name: 'Connect' });

    fireEvent.change(apiKeyInput, { target: { value: 'test-key' } });
    fireEvent.change(apiSecretInput, { target: { value: 'test-secret' } });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeDefined();
    });
    expect(screen.getByText('API-****-XXXX')).toBeDefined();
  });

  it('should allow disconnecting', async () => {
    render(<ExchangeConnector />);
    
    // Connect first
    fireEvent.change(screen.getByPlaceholderText('API Key'), { target: { value: 'a' } });
    fireEvent.change(screen.getByPlaceholderText('API Secret'), { target: { value: 's' } });
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));

    await waitFor(() => screen.getByText('Connected'));
    
    // Disconnect
    fireEvent.click(screen.getByText('Disconnect'));
    expect(screen.getByText('Connect Binance Futures')).toBeDefined();
  });
});
