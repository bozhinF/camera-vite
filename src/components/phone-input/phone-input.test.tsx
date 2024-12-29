import userEvent from '@testing-library/user-event';
import PhoneInput from './phone-input';
import { render, screen } from '@testing-library/react';
import { ElementTag } from '../../const/const';

describe('Component: PhoneInput', () => {
  const mockOnPhoneInputChange = vi.fn();
  const mockSetFirstFocused = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders correctly with autofocus', () => {
    const expectedPlaceholderText = 'Введите ваш номер';

    render(
      <PhoneInput
        autofocus
        isWarn={false}
        onPhoneInputChange={mockOnPhoneInputChange}
      />
    );

    const inputElement = screen.getByPlaceholderText(expectedPlaceholderText);
    expect(inputElement).toHaveFocus();
  });

  it('should triggers onPhoneInputChange with valid input', async () => {
    const expectedPlaceholderText = 'Введите ваш номер';
    const isExpectedPhoneComplete = true;
    const expectedPhoneNumber = '+79991234567';

    render(
      <PhoneInput isWarn={false} onPhoneInputChange={mockOnPhoneInputChange} />
    );

    const inputElement: HTMLInputElement = screen.getByPlaceholderText(
      expectedPlaceholderText
    );
    await userEvent.type(inputElement, expectedPhoneNumber);
    expect(mockOnPhoneInputChange).toHaveBeenCalledWith(
      isExpectedPhoneComplete,
      expectedPhoneNumber
    );
  });

  it('should triggers onPhoneInputChange with invalid input', async () => {
    const expectedPlaceholderText = 'Введите ваш номер';
    const invalidInput = 'invalid input';
    const isExpectedPhoneComplete = false;
    const expectedPhoneNumber = '+79';

    render(<PhoneInput isWarn onPhoneInputChange={mockOnPhoneInputChange} />);

    const inputElement = screen.getByPlaceholderText(expectedPlaceholderText);
    await userEvent.type(inputElement, invalidInput);
    expect(mockOnPhoneInputChange).toHaveBeenCalledWith(
      isExpectedPhoneComplete,
      expectedPhoneNumber
    );
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
    const expectedPhoneText = 'Телефон';
    const expectedClass = 'is-invalid';

    render(<PhoneInput isWarn onPhoneInputChange={mockOnPhoneInputChange} />);

    const inputWrapper = screen
      .getByText(expectedPhoneText)
      .closest(ElementTag.Div);
    expect(inputWrapper).toHaveClass(expectedClass);
  });
});
