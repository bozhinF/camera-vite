import { useEffect, useRef, useState } from 'react';
import { Order, Product } from '../../types/types';
import SomethingWrongModal from '../something-wrong-modal/something-wrong-modal';
import { useWindowListener } from '../../hooks/use-window-listener';
import PhoneInput from '../phone-input/phone-input';
import { useAppDispatch } from '../../hooks';
import { postOrder } from '../../store/products-slice/thunks';
import { useElementListener } from '../../hooks/use-element-listener';
import ProductImage from '../product-image/product-image';

type CallItemModalProps = {
  callItem: Product | null;
  onCloseButtonClick: () => void;
};

function CallItemModal({
  callItem,
  onCloseButtonClick,
}: CallItemModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phone, setPhone] = useState('');
  const [isInputWarn, setIsInputWarn] = useState(false);
  const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(false);
  const [firstFocused, setFirstFocused] = useState<HTMLInputElement | null>(
    null
  );
  const [lastFocused, setLastFocused] = useState<HTMLButtonElement | null>(
    null
  );

  const pressedKeys = new Set();

  useEffect(() => {
    if (closeButtonRef.current) {
      setLastFocused(closeButtonRef.current);
    }
  }, [closeButtonRef]);

  const onPhoneInputChange = (
    isValid: boolean,
    unmaskedPhone: string
  ): void => {
    setIsPhoneValid(isValid);
    setPhone(unmaskedPhone);
    if (isValid && isInputWarn) {
      setIsInputWarn(false);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => pressedKeys.delete(event.key);
  const handleKeyDow = (event: KeyboardEvent) => pressedKeys.add(event.key);

  const handleLastFocusableElementTabDown = (event: KeyboardEvent) => {
    pressedKeys.add(event.key);

    if (!firstFocused || !lastFocused || pressedKeys.size > 1) {
      return;
    }

    if (document.activeElement === lastFocused && event.key === 'Tab') {
      event.preventDefault();
      firstFocused.focus();
    }
  };

  const handleFirstFocusableElementShiftTabDown = (event: KeyboardEvent) => {
    const trackedKeys = ['Tab', 'Shift'];
    pressedKeys.add(event.key);

    for (const key of trackedKeys) {
      if (!pressedKeys.has(key)) {
        return;
      }
    }

    if (firstFocused === null || lastFocused === null) {
      return;
    }

    if (document.activeElement === firstFocused) {
      event.preventDefault();
      lastFocused.focus();
    }
  };

  const handleBuyButtonClick = () => {
    if (!isPhoneValid) {
      setIsInputWarn(true);
      return;
    }

    if (!callItem) {
      return;
    }

    setIsBuyButtonDisabled(true);
    const { id } = callItem;
    const order: Order = {
      camerasIds: [id],
      coupon: null,
      tel: phone,
    };
    dispatch(postOrder({ order }))
      .unwrap()
      .then(
        () => onCloseButtonClick(),
        () => setIsInputWarn(true)
      )
      .finally(() => setIsBuyButtonDisabled(false));
  };

  useElementListener('click', closeButtonRef, onCloseButtonClick);
  useElementListener('click', buyButtonRef, handleBuyButtonClick);
  useWindowListener('keyup', closeButtonRef, handleKeyUp);
  useWindowListener('keydown', closeButtonRef, handleKeyDow);

  useWindowListener(
    'keydown',
    closeButtonRef,
    handleFirstFocusableElementShiftTabDown
  );

  useWindowListener(
    'keydown',
    closeButtonRef,
    handleLastFocusableElementTabDown
  );

  if (callItem === null) {
    return <SomethingWrongModal onCloseButtonClick={onCloseButtonClick} />;
  }

  const { name, vendorCode, type, category, level, price } = callItem;

  return (
    <div className="modal__content">
      <p className="title title--h4">Свяжитесь со мной</p>
      <div className="basket-item basket-item--short">
        <div className="basket-item__img">
          <ProductImage image={callItem} />
        </div>
        <div className="basket-item__description">
          <p className="basket-item__title">{name}</p>
          <ul className="basket-item__list">
            <li className="basket-item__list-item">
              <span className="basket-item__article">Артикул:</span>{' '}
              <span className="basket-item__number">{vendorCode}</span>
            </li>
            <li className="basket-item__list-item">
              {`${type} ${
                category === 'Фотоаппарат'
                  ? 'фотокамера'
                  : category.toLowerCase()
              }`}
            </li>
            <li className="basket-item__list-item">{level} уровень</li>
          </ul>
          <p className="basket-item__price">
            <span className="visually-hidden">Цена:</span>
            {price.toLocaleString('ru')} ₽
          </p>
        </div>
      </div>
      <PhoneInput
        autofocus
        isWarn={isInputWarn}
        onPhoneInputChange={onPhoneInputChange}
        setFirstFocused={setFirstFocused}
      />
      <div className="modal__buttons">
        <button
          className="btn btn--purple modal__btn modal__btn--fit-width"
          type="button"
          disabled={isBuyButtonDisabled}
          ref={buyButtonRef}
        >
          <svg width={24} height={16} aria-hidden="true">
            <use xlinkHref="#icon-add-basket" />
          </svg>
          Заказать
        </button>
      </div>
      <button
        className="cross-btn"
        type="button"
        aria-label="Закрыть попап"
        ref={closeButtonRef}
      >
        <svg width={10} height={10} aria-hidden="true">
          <use xlinkHref="#icon-close" />
        </svg>
      </button>
    </div>
  );
}

export default CallItemModal;
