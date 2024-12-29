import { render, act } from '@testing-library/react';
import { useRef } from 'react';
import { useWindowListener } from './use-window-listener';

const mockListener = vi.fn();

type TestComponentProps = {
  eventName: keyof WindowEventMap;
};

const TestComponent = ({ eventName }: TestComponentProps) => {
  const ref = useRef(null);

  useWindowListener(eventName, ref, mockListener);

  return <div ref={ref}>Test Component</div>;
};

describe('useWindowListener', () => {
  it('shuld adds event listener on mount and removes it on unmount', () => {
    const dispatchingEvent = 'keydown';
    const expectedMockListenerCalledTimes = 1;

    const { unmount } = render(<TestComponent eventName={dispatchingEvent} />);

    act(() => {
      window.dispatchEvent(new Event(dispatchingEvent));
    });

    expect(vi.isMockFunction(mockListener)).toBe(true);
    expect(mockListener).toHaveBeenCalledTimes(expectedMockListenerCalledTimes);

    unmount();

    act(() => {
      window.dispatchEvent(new Event(dispatchingEvent));
    });
    expect(mockListener).toHaveBeenCalledTimes(expectedMockListenerCalledTimes);
  });
});
