import IMask, { InputMask } from 'imask';
import { useEffect, useRef, useState } from 'react';

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

function PhoneInput(): JSX.Element {
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

  return (
    <div className="custom-input form-review__item">
      <label>
        <span className="custom-input__label">
          Телефон
          <svg width={9} height={9} aria-hidden="true">
            <use xlinkHref="#icon-snowflake" />
          </svg>
        </span>
        <input
          autoFocus
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
