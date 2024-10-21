import IMask, { InputMask } from 'imask';
import { useEffect, useRef, useState } from 'react';

type PhoneInputProps = {
  autofocus?: boolean;
  isWarn: boolean;
  onPhoneInputChange: (isValid: boolean, unmaskedPhone: string) => void;
  setFirstFocused?: (el: HTMLInputElement) => void;
};

const MASK_OPTIONS = {
  mask: '{+7}({9}00)000-00-00',
  prepare: (input: string) => {
    const cleanedNumber = input.replace(/\D/g, '');
    if (cleanedNumber.length === 11) {
      return cleanedNumber.slice(2);
    }
    return input;
  },
};

function PhoneInput({
  autofocus = false,
  isWarn,
  onPhoneInputChange,
  setFirstFocused,
}: PhoneInputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mask, setMask] = useState<InputMask | null>(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (!mask) {
      setMask(IMask(inputRef.current, MASK_OPTIONS));
    }

    return () => {
      if (mask) {
        mask.destroy();
      }
    };
  }, [mask]);

  useEffect(() => {
    if (mask) {
      mask.on('accept', () => {
        onPhoneInputChange(false, mask.unmaskedValue);
      });

      mask.on('complete', () => {
        onPhoneInputChange(true, mask.unmaskedValue);
      });
    }
  });

  useEffect(() => {
    if (inputRef.current && setFirstFocused) {
      setFirstFocused(inputRef.current);
    }
  });

  return (
    <div
      className={`custom-input form-review__item ${isWarn ? 'is-invalid' : ''}`}
    >
      <label>
        <span className="custom-input__label">
          Телефон
          <svg width={9} height={9} aria-hidden="true">
            <use xlinkHref="#icon-snowflake" />
          </svg>
        </span>
        <input
          autoFocus={autofocus}
          type="tel"
          name="user-tel"
          placeholder="Введите ваш номер"
          required
          ref={inputRef}
        />
      </label>
      <p className="custom-input__error">Нужно указать номер</p>
    </div>
  );
}

export default PhoneInput;
