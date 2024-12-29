import { render, screen, fireEvent } from '@testing-library/react';
import Portal from './portal';
import { EventKey } from '../../const/const';

describe('Component: Portal', () => {
  const mockOnModalClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders children when isOpen is true', () => {
    const expectedModalText = 'Modal Content';

    render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>{expectedModalText}</div>
      </Portal>
    );

    expect(screen.getByText(expectedModalText)).toBeInTheDocument();
  });

  it('should does not render children when isOpen is false', () => {
    const modalText = 'Modal Content';
    const isModalOpen = false;

    render(
      <Portal isOpen={isModalOpen} onModalClose={mockOnModalClose}>
        <div>{modalText}</div>
      </Portal>
    );

    expect(screen.queryByText(modalText)).not.toBeInTheDocument();
  });

  it('should calls onModalClose when overlay is clicked', () => {
    const modalText = 'Modal Content';
    const overlayTestId = 'overlay';
    const expectedMockOnModalCloseCalledTimes = 1;

    render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>{modalText}</div>
      </Portal>
    );

    const overlay = screen.getByTestId(overlayTestId);
    fireEvent.click(overlay);
    expect(mockOnModalClose).toHaveBeenCalledTimes(
      expectedMockOnModalCloseCalledTimes
    );
  });

  it('should does not call onModalClose when overlay is clicked and blocked is true', () => {
    const modalText = 'Modal Content';
    const overlayTestId = 'overlay';

    render(
      <Portal isOpen blocked onModalClose={mockOnModalClose}>
        <div>{modalText}</div>
      </Portal>
    );

    const overlay = screen.getByTestId(overlayTestId);

    fireEvent.click(overlay);

    expect(mockOnModalClose).not.toHaveBeenCalled();
  });

  it('should calls onModalClose when Escape key is pressed', () => {
    const modalText = 'Modal Content';
    const expectedMockOnModalCloseCalledTimes = 1;

    render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>{modalText}</div>
      </Portal>
    );

    fireEvent.keyDown(document, { key: EventKey.Escape });

    expect(mockOnModalClose).toHaveBeenCalledTimes(
      expectedMockOnModalCloseCalledTimes
    );
  });

  it('should does not call onModalClose when Escape key is pressed and blocked is true', () => {
    const modalText = 'Modal Content';

    render(
      <Portal isOpen blocked onModalClose={mockOnModalClose}>
        <div>{modalText}</div>
      </Portal>
    );

    fireEvent.keyDown(document, { key: EventKey.Escape });

    expect(mockOnModalClose).not.toHaveBeenCalled();
  });

  it('should adjusts body styles when isOpen is true', () => {
    const modalText = 'Modal Content';

    const { rerender } = render(
      <Portal isOpen onModalClose={mockOnModalClose}>
        <div>{modalText}</div>
      </Portal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Portal isOpen={false} onModalClose={mockOnModalClose}>
        <div>{modalText}</div>
      </Portal>
    );

    expect(document.body.style.overflow).toBe('unset');
  });
});
