import { forwardRef } from 'react';

type CloseButtonProps = {
  className?: string;
  text?: string;
  label?: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const render = function CloseButton(
  { className, text, label, type, onClick }: CloseButtonProps,
  ref?: React.ForwardedRef<HTMLButtonElement>
): JSX.Element {
  return (
    <button
      className={className ? className : 'cross-btn'}
      type={type ? type : 'button'}
      {...(label ? { 'aria-label': label } : {})}
      ref={ref}
      onClick={onClick}
    >
      <svg width="10" height="10" aria-hidden="true">
        <use xlinkHref="#icon-close"></use>
      </svg>
      {text && <span className="visually-hidden">{text}</span>}
    </button>
  );
};

const CloseButton = forwardRef(render);

export default CloseButton;
