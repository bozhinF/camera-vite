import { useEffect, useRef, useState } from 'react';
import CloseButton from '../close-button/close-button';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../const/const';

const CLOSE_BUTTON_LABEL = 'Закрыть попап';

type AddItemSuccessModalProps = {
  onCloseButtonClick: () => void;
};

function AddItemSuccessModal({
  onCloseButtonClick,
}: AddItemSuccessModalProps): JSX.Element {
  const { pathname } = useLocation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const buyButtonRef = useRef<HTMLAnchorElement>(null);
  const [firstFocused, setFirstFocused] = useState<HTMLAnchorElement | null>(
    null
  );
  const [lastFocused, setLastFocused] = useState<HTMLButtonElement | null>(
    null
  );
  const navigate = useNavigate();

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

  useElementListener('click', closeButtonRef, onCloseButtonClick);

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

  return (
    <div className="modal__content">
      <p className="title title--h4">Товар успешно добавлен в корзину</p>
      <svg className="modal__icon" width="86" height="80" aria-hidden="true">
        <use xlinkHref="#icon-success"></use>
      </svg>
      <div className="modal__buttons">
        <a
          className="btn btn--transparent modal__btn"
          href="#"
          ref={buyButtonRef}
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
        <button
          className="btn btn--purple modal__btn modal__btn--fit-width"
          autoFocus
          onClick={() => {
            onCloseButtonClick();
            navigate(AppRoute.Basket);
          }}
        >
          Перейти в корзину
        </button>
      </div>
      <CloseButton label={CLOSE_BUTTON_LABEL} ref={closeButtonRef} />
    </div>
  );
}

export default AddItemSuccessModal;
