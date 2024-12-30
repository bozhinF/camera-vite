import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { postCoupon } from '../../store/products-slice/thunks';
import {
  getCouponValidateStatus,
  getPostOrderStatus,
} from '../../store/products-slice/selectors';
import { RequestStatus } from '../../const/const';
import { resetCoupon } from '../../store/products-slice/products-slice';

enum ValidateClass {
  Valid = 'is-valid',
  Invalid = 'is-invalid',
}

const validatePromo = (value: string): boolean => {
  const isValid = !value.includes(' ');
  return isValid;
};

type PromoFormProps = {
  onFormSubmit: React.Dispatch<React.SetStateAction<string | null>>;
}

function PromoForm({onFormSubmit}: PromoFormProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [isInputValid, setInputValid] = useState(true);
  const promoStatus = useAppSelector(getCouponValidateStatus);
  const orderStatus = useAppSelector(getPostOrderStatus);

  useEffect(() => {
    if (orderStatus === RequestStatus.Success) {
      setInputValue('');
    }
  }, [orderStatus]);

  return (
    <div className="basket-form">
      <form
        action="#"
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(
            postCoupon({
              coupon: inputValue,
            })
          ).unwrap().then(() => onFormSubmit(inputValue));
        }}
      >
        <div
          className={`custom-input ${
            !isInputValid ? ValidateClass.Invalid : ''
          } ${promoStatus === RequestStatus.Success ? ValidateClass.Valid : ''}
          ${promoStatus === RequestStatus.Failed ? ValidateClass.Invalid : ''}`}
        >
          <label>
            <span className="custom-input__label">Промокод</span>
            <input
              type="text"
              name="promo"
              placeholder="Введите промокод"
              value={inputValue}
              onChange={(event) => {
                const value = event.target.value.trim();
                setInputValue(value);
                setInputValid(validatePromo(value));
                if (
                  promoStatus !== RequestStatus.Success &&
                  promoStatus !== RequestStatus.Idle
                ) {
                  dispatch(resetCoupon);
                }
              }}
            />
          </label>
          <p className="custom-input__error">Промокод неверный</p>
          <p className="custom-input__success">Промокод принят!</p>
        </div>
        <button className="btn" type="submit">
          Применить
        </button>
      </form>
    </div>
  );
}

export default PromoForm;
