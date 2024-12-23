import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';

type SomethingWrongModalProps = {
  onCloseButtonClick: () => void;
};

function SomethingWrongModal({
  onCloseButtonClick,
}: SomethingWrongModalProps): JSX.Element {
  const pressedKeys = new Set();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyUp = (event: KeyboardEvent) => pressedKeys.delete(event.key);
  const handleKeyDow = (event: KeyboardEvent) => pressedKeys.add(event.key);

  const handleCloseButtonTabDown = (event: KeyboardEvent) => {
    pressedKeys.add(event.key);

    if (pressedKeys.size > 1 || event.key !== 'Tab') {
      return;
    }

    event.preventDefault();
    linkRef.current?.focus();
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

  useWindowListener('keyup', linkRef, handleKeyUp);
  useWindowListener('keydown', linkRef, handleKeyDow);
  useElementListener('keydown', linkRef, handleInputShiftTabDown);
  useElementListener('keydown', closeButtonRef, handleCloseButtonTabDown);
  useElementListener('click', closeButtonRef, onCloseButtonClick);

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.focus({ preventScroll: true });
    }
  });

  return (
    <div className="modal__content">
      <p className="title title--h3">Произошел сбой...</p>
      <p className="basket-item__title">
        Что-то пошло не так. Вы можете вернуться к предыдущему шагу или
        обратиться в наш{' '}
        <Link ref={linkRef} className="link" to="#" autoFocus>
          Справочный центр
        </Link>
        , если вам нужна помощь
      </p>
      <button
        ref={closeButtonRef}
        className="cross-btn"
        type="button"
        aria-label="Закрыть попап"
      >
        <svg width={10} height={10} aria-hidden="true">
          <use xlinkHref="#icon-close" />
        </svg>
      </button>
    </div>
  );
}

export default SomethingWrongModal;
