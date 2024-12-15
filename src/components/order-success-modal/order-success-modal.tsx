import { useLocation, useNavigate } from 'react-router-dom';
import CloseButton from '../close-button/close-button';
import { useEffect, useRef, useState } from 'react';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';
import { AppRoute } from '../../const/const';

const CLOSE_BUTTON_LABEL = 'Закрыть попап';

type OrderSuccessModalProps = {
  onCloseButtonClick: () => void;
};

function OrderSuccessModal({
  onCloseButtonClick,
}: OrderSuccessModalProps): JSX.Element {
  const { pathname } = useLocation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const toShoppingButtonRef = useRef<HTMLButtonElement>(null);
  const [firstFocused, setFirstFocused] = useState<HTMLButtonElement | null>(
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
    if (toShoppingButtonRef.current) {
      setFirstFocused(toShoppingButtonRef.current);
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
      <p className="title title--h4">Спасибо за покупку</p>
      <svg className="modal__icon" width="80" height="78" aria-hidden="true">
        <use xlinkHref="#icon-review-success"></use>
      </svg>
      <div className="modal__buttons">
        <button
          className="btn btn--purple modal__btn modal__btn--fit-width"
          type="button"
          ref={toShoppingButtonRef}
          onClick={(event) => {
            event.preventDefault();
            onCloseButtonClick();
            if (pathname !== AppRoute.Catalog) {
              navigate(AppRoute.Catalog);
            }
          }}
        >
          Вернуться к покупкам
        </button>
      </div>
      <CloseButton label={CLOSE_BUTTON_LABEL} ref={closeButtonRef} />
    </div>
  );
}

export default OrderSuccessModal;
