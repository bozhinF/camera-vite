import { render, screen, fireEvent } from '@testing-library/react';
import CloseButton from './close-button';

describe('Component: CloseButton', () => {
  it('should renders with default class and type', () => {
    render(<CloseButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('cross-btn');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should renders with custom class and type', () => {
    render(<CloseButton className="custom-class" type="submit" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should renders with aria-label', () => {
    render(<CloseButton label="Close the dialog" />);

    const button = screen.getByLabelText('Close the dialog');
    expect(button).toBeInTheDocument();
  });

  it('should renders with text', () => {
    render(<CloseButton text="Close" />);

    const hiddenText = screen.getByText('Close');
    expect(hiddenText).toBeInTheDocument();
    expect(hiddenText).toHaveClass('visually-hidden');
  });

  it('should calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<CloseButton onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
