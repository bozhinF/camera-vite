import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { Product } from '../../types/types';
import SomethingWrongModal from '../something-wrong-modal/something-wrong-modal';
import { addItemToBasket } from '../../store/products-slice/products-slice';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';
import ProductImage from '../product-image/product-image';
import ProductPrice from '../product-price/product-price';
import ProductDescription from '../product-description/product-description';
import CloseButton from '../close-button/close-button';

const CLOSE_BUTTON_LABEL = 'Закрыть попап';

type AddItemModalProps = {
  addItem: Product | null;
  onCloseButtonClick: () => void;
};

function AddItemModal({
  addItem,
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
    if (!addItem) {
      return;
    }
    setIsBuyButtonDisabled(true);
    const { id } = addItem;
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

  if (addItem === null) {
    return <SomethingWrongModal onCloseButtonClick={onCloseButtonClick} />;
  }

  return (
    <div className="modal__content">
      <p className="title title--h4">Добавить товар в корзину</p>
      <div className="basket-item basket-item--short">
        <div className="basket-item__img">
          <ProductImage image={addItem} />
        </div>
        <ProductDescription product={addItem}>
          <ProductPrice product={addItem} />
        </ProductDescription>
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
      <CloseButton label={CLOSE_BUTTON_LABEL} ref={closeButtonRef} />
    </div>
  );
}

export default AddItemModal;
