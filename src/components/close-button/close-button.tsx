import { forwardRef } from 'react';

type CloseButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const render = function CloseButton(
  { onClick }: CloseButtonProps,
  ref?: React.ForwardedRef<HTMLButtonElement>
): JSX.Element {
  return (
    <button
      className="cross-btn"
      type="button"
      aria-label="Закрыть попап"
      ref={ref}
      onClick={onClick}
    >
      <svg width="10" height="10" aria-hidden="true">
        <use xlinkHref="#icon-close"></use>
      </svg>
    </button>
  );
};

const CloseButton = forwardRef(render);

export default CloseButton;
