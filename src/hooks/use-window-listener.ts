import {RefObject, useEffect} from 'react';

export const useWindowListener = <K extends keyof WindowEventMap, T extends HTMLElement>(
  eventName: K,
  element: RefObject<T>,
  listener: (evt: WindowEventMap[K]) => void
) => {

  useEffect(() => {
    const domElement = element.current;

    if (!domElement) {
      return;
    }

    window.addEventListener(eventName, listener);

    return () => {
      window.removeEventListener(eventName, listener);
    };
  }, [eventName, element, listener]);
};
