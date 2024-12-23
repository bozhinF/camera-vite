import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Product } from '../../types/types';
import CloseButton from '../close-button/close-button';
import ProductImage from '../product-image/product-image';
import { updateBasket } from '../../store/products-slice/products-slice';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';
import SomethingWrongModal from '../something-wrong-modal/something-wrong-modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../const/const';
import { getBasket } from '../../store/products-slice/selectors';
import ProductDescription from '../product-description/product-description';

const CLOSE_BUTTON_LABEL = 'Закрыть попап';

type RemoveItemModalProps = {
  removeItem: Product | null;
  onCloseButtonClick: () => void;
};

function RemoveItemModal({
  removeItem,
  onCloseButtonClick,
}: RemoveItemModalProps): JSX.Element {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const [isRemoveButtonDisabled, setRemoveButtonDisabled] = useState(false);
  const [firstFocused, setFirstFocused] = useState<HTMLButtonElement | null>(
    null
  );
  const [lastFocused, setLastFocused] = useState<HTMLButtonElement | null>(
    null
  );
  const navigate = useNavigate();
  const basket = useAppSelector(getBasket);

  useEffect(() => {
    if (closeButtonRef.current) {
      setLastFocused(closeButtonRef.current);
    }
    if (removeButtonRef.current) {
      setFirstFocused(removeButtonRef.current);
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

  const handleRemoveButtonClick = () => {
    if (!removeItem) {
      return;
    }
    setRemoveButtonDisabled(true);
    const { id } = removeItem;
    const update = [...basket].filter((productId) => productId !== id);
    dispatch(updateBasket(update));
    onCloseButtonClick();
    setRemoveButtonDisabled(false);
    if (!update.length) {
      navigate(AppRoute.Catalog);
    }
  };

  useElementListener('click', closeButtonRef, onCloseButtonClick);
  useElementListener('click', removeButtonRef, handleRemoveButtonClick);

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

  if (removeItem === null) {
    return <SomethingWrongModal onCloseButtonClick={onCloseButtonClick} />;
  }

  return (
    <div className="modal__content">
      <p className="title title--h4">Удалить этот товар?</p>
      <div className="basket-item basket-item--short">
        <div className="basket-item__img">
          <ProductImage image={removeItem} />
        </div>
        <ProductDescription product={removeItem} />
      </div>
      <div className="modal__buttons">
        <button
          className="btn btn--purple modal__btn modal__btn--half-width"
          type="button"
          ref={removeButtonRef}
          autoFocus
          disabled={isRemoveButtonDisabled}
        >
          Удалить
        </button>
        <a
          className="btn btn--transparent modal__btn modal__btn--half-width"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onCloseButtonClick();
            if (pathname !== AppRoute.Catalog) {
              navigate(AppRoute.Catalog);
            }
          }}
        >
          Продолжить покупки
        </a>
      </div>
      <CloseButton label={CLOSE_BUTTON_LABEL} ref={closeButtonRef} />
    </div>
  );
}

export default RemoveItemModal;
