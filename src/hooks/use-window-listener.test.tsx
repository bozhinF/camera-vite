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
    const { unmount } = render(<TestComponent eventName="resize" />);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(vi.isMockFunction(mockListener)).toBe(true);
    expect(mockListener).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(mockListener).toHaveBeenCalledTimes(1);
  });
});
