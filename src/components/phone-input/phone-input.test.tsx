import userEvent from '@testing-library/user-event';
import PhoneInput from './phone-input';
import { render, screen } from '@testing-library/react';

describe('Component: PhoneInput', () => {
  const mockOnPhoneInputChange = vi.fn();
  const mockSetFirstFocused = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders correctly with autofocus', () => {
    render(
      <PhoneInput
        autofocus
        isWarn={false}
        onPhoneInputChange={mockOnPhoneInputChange}
      />
    );

    const inputElement = screen.getByPlaceholderText('Введите ваш номер');
    expect(inputElement).toHaveFocus();
  });

  it('should triggers onPhoneInputChange with valid input', async () => {
    render(
      <PhoneInput isWarn={false} onPhoneInputChange={mockOnPhoneInputChange} />
    );

    const inputElement: HTMLInputElement =
      screen.getByPlaceholderText('Введите ваш номер');
    await userEvent.type(inputElement, '+79991234567');
    expect(mockOnPhoneInputChange).toHaveBeenCalledWith(true, '+79991234567');
  });

  it('should triggers onPhoneInputChange with invalid input', async () => {
    render(<PhoneInput isWarn onPhoneInputChange={mockOnPhoneInputChange} />);

    const inputElement = screen.getByPlaceholderText('Введите ваш номер');
    await userEvent.type(inputElement, 'invalid input');

    expect(mockOnPhoneInputChange).toHaveBeenCalledWith(false, '+79');
  });

  it('should sets element for first focus', () => {
    render(
      <PhoneInput
        isWarn={false}
        onPhoneInputChange={mockOnPhoneInputChange}
        setFirstFocused={mockSetFirstFocused}
      />
    );

    expect(mockSetFirstFocused).toHaveBeenCalled();
    expect(mockSetFirstFocused).toHaveBeenCalledWith(
      expect.any(HTMLInputElement)
    );
  });

  it('should displays error state when isWarn is true', () => {
    render(<PhoneInput isWarn onPhoneInputChange={mockOnPhoneInputChange} />);

    const inputWrapper = screen.getByText('Телефон').closest('div');
    expect(inputWrapper).toHaveClass('is-invalid');
  });
});
