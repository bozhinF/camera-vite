import { useRef } from 'react';
import { Product } from '../../types/types';
import SomethingWrongModal from '../something-wrong-modal/something-wrong-modal';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';

type CallItemModalProps = {
  callItem: Product | null;
  onCloseButtonClick: () => void;
};

function CallItemModal({
  callItem,
  onCloseButtonClick,
}: CallItemModalProps): JSX.Element {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pressedKeys = new Set();

  const handleKeyUp = (event: KeyboardEvent) => pressedKeys.delete(event.key);
  const handleKeyDow = (event: KeyboardEvent) => pressedKeys.add(event.key);

  const handleCloseButtonTabDown = (event: KeyboardEvent) => {
    pressedKeys.add(event.key);

    if (pressedKeys.size > 1 || event.key !== 'Tab') {
      return;
    }

    event.preventDefault();
    phoneInputRef.current?.focus();
  };

  const handleInputShiftTabDown = (event: KeyboardEvent) => {
    const trackedKeys = ['Tab', 'Shift'];
    pressedKeys.add(event.key);

    for (const key of trackedKeys) {
      if (!pressedKeys.has(key)) {
        return;
      }
    }

    event.preventDefault();
    closeButtonRef.current?.focus();
  };

  useWindowListener('keyup', phoneInputRef, handleKeyUp);
  useWindowListener('keydown', phoneInputRef, handleKeyDow);
  useElementListener('keydown', phoneInputRef, handleInputShiftTabDown);
  useElementListener('keydown', closeButtonRef, handleCloseButtonTabDown);
  useElementListener('click', closeButtonRef, onCloseButtonClick);

  if (callItem === null) {
    return <SomethingWrongModal onCloseButtonClick={onCloseButtonClick} />;
  }

  const {
    name,
    vendorCode,
    type,
    category,
    level,
    price,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = callItem;

  return (
    <div className="modal__content">
      <p className="title title--h4">Свяжитесь со мной</p>
      <div className="basket-item basket-item--short">
        <div className="basket-item__img">
          <picture>
            <source
              type="image/webp"
              srcSet={`${previewImgWebp}, ${previewImgWebp2x} 2x`}
            />
            <img
              src={previewImg}
              srcSet={`${previewImg2x} 2x`}
              width={140}
              height={120}
              alt={callItem?.name}
            />
          </picture>
        </div>
        <div className="basket-item__description">
          <p className="basket-item__title">{name}</p>
          <ul className="basket-item__list">
            <li className="basket-item__list-item">
              <span className="basket-item__article">Артикул:</span>{' '}
              <span className="basket-item__number">{vendorCode}</span>
            </li>
            <li className="basket-item__list-item">
              {type} {category.toLowerCase()}
            </li>
            <li className="basket-item__list-item">{level} уровень</li>
          </ul>
          <p className="basket-item__price">
            <span className="visually-hidden">Цена:</span>
            {price.toLocaleString('ru')} ₽
          </p>
        </div>
      </div>
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
            ref={phoneInputRef}
          />
        </label>
        <p className="custom-input__error">Нужно указать номер</p>
      </div>
      <div className="modal__buttons">
        <button
          className="btn btn--purple modal__btn modal__btn--fit-width"
          type="button"
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
