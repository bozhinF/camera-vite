import { render, screen, fireEvent } from '@testing-library/react';
import CloseButton from './close-button';
import { ElementAttribute, ElementRole } from '../../const/const';

describe('Component: CloseButton', () => {
  it('should renders with default class and type', () => {
    const expectedButtonClass = 'cross-btn';
    const expectedType = 'button';

    render(<CloseButton />);

    const button = screen.getByRole(ElementRole.Button);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(expectedButtonClass);
    expect(button).toHaveAttribute(ElementAttribute.Type, expectedType);
  });

  it('should renders with custom class and type', () => {
    const expectedButtonClass = 'custom-class';
    const expectedType = 'submit';

    render(<CloseButton className={expectedButtonClass} type={expectedType} />);

    const button = screen.getByRole(ElementRole.Button);
    expect(button).toHaveClass(expectedButtonClass);
    expect(button).toHaveAttribute(ElementAttribute.Type, expectedType);
  });

  it('should renders with aria-label', () => {
    const expectedButtonLabelText = 'Close the dialog';

    render(<CloseButton label={expectedButtonLabelText} />);

    const button = screen.getByLabelText(expectedButtonLabelText);
    expect(button).toBeInTheDocument();
  });

  it('should renders with text', () => {
    const expectedHiddenText = 'Close';
    const expectedClass = 'visually-hidden';

    render(<CloseButton text={expectedHiddenText} />);

    const hiddenText = screen.getByText(expectedHiddenText);
    expect(hiddenText).toBeInTheDocument();
    expect(hiddenText).toHaveClass(expectedClass);
  });

  it('should calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const expectedHandleClickCalledTimes = 1;

    render(<CloseButton onClick={handleClick} />);

    const button = screen.getByRole(ElementRole.Button);
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(expectedHandleClickCalledTimes);
  });
});
