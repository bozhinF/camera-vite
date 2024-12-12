import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { Product } from '../../types/types';
import SomethingWrongModal from '../something-wrong-modal/something-wrong-modal';
import { addItemToBasket } from '../../store/products-slice/products-slice';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';

type AddItemModalProps = {
  callItem: Product | null;
  onCloseButtonClick: () => void;
};

function AddItemModal({
  callItem,
  onCloseButtonClick,
}: AddItemModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(false);
  const [firstFocused, setFirstFocused] = useState<HTMLButtonElement | null>(
    null
  );
  const [lastFocused, setLastFocused] = useState<HTMLButtonElement | null>(
    null
  );

  useEffect(() => {
    if (closeButtonRef.current) {
      setLastFocused(closeButtonRef.current);
    }
    if (buyButtonRef.current) {
      setFirstFocused(buyButtonRef.current);
    }
  }, [closeButtonRef]);

  const handleLastFocusableElementTabDown = (event: KeyboardEvent) => {
    if (!firstFocused || !lastFocused) {
      return;
    }

    if (
      document.activeElement === lastFocused &&
      event.key === 'Tab' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      firstFocused.focus();
    }
  };
  const handleFirstFocusableElementShiftTabDown = (event: KeyboardEvent) => {
    if (firstFocused === null || lastFocused === null) {
      return;
    }

    if (
      document.activeElement === firstFocused &&
      event.key === 'Tab' &&
      event.shiftKey
    ) {
      event.preventDefault();
      lastFocused.focus();
    }
  };

  const handleBuyButtonClick = () => {
    if (!callItem) {
      return;
    }
    setIsBuyButtonDisabled(true);
    const { id } = callItem;
    dispatch(addItemToBasket(id));
    onCloseButtonClick();
    setIsBuyButtonDisabled(false);
  };

  useElementListener('click', closeButtonRef, onCloseButtonClick);
  useElementListener('click', buyButtonRef, handleBuyButtonClick);

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
      <p className="title title--h4">Добавить товар в корзину</p>
      <div className="basket-item basket-item--short">
        <div className="basket-item__img">
          <picture>
            <source
              type="image/webp"
              srcSet={`/${previewImgWebp}, /${previewImgWebp2x} 2x`}
            />
            <img
              src={`/${previewImg}`}
              srcSet={`/${previewImg2x} 2x`}
              width={140}
              height={120}
              alt={callItem.name}
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
      <div className="modal__buttons">
        <button
          className="btn btn--purple modal__btn modal__btn--fit-width"
          type="button"
          disabled={isBuyButtonDisabled}
          ref={buyButtonRef}
          autoFocus
        >
          <svg width="24" height="16" aria-hidden="true">
            <use xlinkHref="#icon-add-basket"></use>
          </svg>
          Добавить в корзину
        </button>
      </div>
      <button
        className="cross-btn"
        type="button"
        aria-label="Закрыть попап"
        ref={closeButtonRef}
      >
        <svg width="10" height="10" aria-hidden="true">
          <use xlinkHref="#icon-close"></use>
        </svg>
      </button>
    </div>
  );
}

export default AddItemModal;
