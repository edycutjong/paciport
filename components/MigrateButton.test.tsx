import { render, screen, fireEvent } from '@testing-library/react';
import MigrateButton from './MigrateButton';

describe('MigrateButton', () => {
  const mockOnClick = jest.fn();

  it('should render enabled state', () => {
    render(<MigrateButton onClick={mockOnClick} disabled={false} loading={false} selectedCount={2} />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(screen.getByText('2 positions selected')).toBeDefined();
  });

  it('should render disabled state', () => {
    render(<MigrateButton onClick={mockOnClick} disabled={true} loading={false} selectedCount={0} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<MigrateButton onClick={mockOnClick} disabled={false} loading={true} selectedCount={1} />);
    expect(screen.getByText('Executing...')).toBeDefined();
  });

  it('should trigger onClick', () => {
    render(<MigrateButton onClick={mockOnClick} disabled={false} loading={false} selectedCount={1} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
