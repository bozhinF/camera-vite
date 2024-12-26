import { render, screen, fireEvent } from '@testing-library/react';
import Portal from './portal';

describe('Component: Portal', () => {
  const mockOnModalClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders children when isOpen is true', () => {
    render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should does not render children when isOpen is false', () => {
    render(
      <Portal isOpen={false} onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should calls onModalClose when overlay is clicked', () => {
    render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    const overlay = screen.getByTestId('overlay');

    fireEvent.click(overlay);

    expect(mockOnModalClose).toHaveBeenCalledTimes(1);
  });

  it('should does not call onModalClose when overlay is clicked and blocked is true', () => {
    render(
      <Portal isOpen blocked onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    const overlay = screen.getByTestId('overlay');

    fireEvent.click(overlay);

    expect(mockOnModalClose).not.toHaveBeenCalled();
  });

  it('should calls onModalClose when Escape key is pressed', () => {
    render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnModalClose).toHaveBeenCalledTimes(1);
  });

  it('should does not call onModalClose when Escape key is pressed and blocked is true', () => {
    render(
      <Portal isOpen blocked onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnModalClose).not.toHaveBeenCalled();
  });

  it('should adjusts body styles when isOpen is true', () => {
    const { rerender } = render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Portal isOpen={false} onModalClose={mockOnModalClose}>
        <div>Modal Content</div>
      </Portal>
    );

    expect(document.body.style.overflow).toBe('unset');
  });
});
