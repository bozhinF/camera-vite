import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useElementListener } from '../../hooks/use-element-listener';
import { useWindowListener } from '../../hooks/use-window-listener';

type PortalProps = {
  isOpen?: boolean;
  onModalClose: () => void;
  children: React.ReactNode;
};

function Portal({ isOpen, onModalClose, children }: PortalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOverlayClick = (event: MouseEvent) => {
    if (overlayRef.current && event.target === overlayRef.current) {
      onModalClose();
    }
  };

  const handleEscKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onModalClose();
    }
  };

  useElementListener('click', overlayRef, handleOverlayClick);
  useWindowListener('keydown', overlayRef, handleEscKeyDown);

  useEffect(() => {
    if (isOpen) {
      document.body.style.paddingRight = `${
        window.innerWidth - document.documentElement.clientWidth
      }px`;
      document.body.style.overflow = 'hidden';

      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal is-active">
      <div className="modal__wrapper">
        <div className="modal__overlay" ref={overlayRef} />
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Portal;
