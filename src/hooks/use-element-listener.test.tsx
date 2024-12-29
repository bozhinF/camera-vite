import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import userEvent from '@testing-library/user-event';
import { useElementListener } from './use-element-listener';
import { ElementRole } from '../const/const';

const mockListener = vi.fn();

type TestComponentProps = {
  eventName: keyof HTMLElementEventMap;
};

const TestComponent = ({ eventName }: TestComponentProps) => {
  const ref = useRef(null);

  useElementListener(eventName, ref, mockListener);

  return <button ref={ref}>Click Me</button>;
};

describe('useElementListener', () => {
  it('should adds event listener on mount and removes it on unmount', () => {
    const eventName = 'click';
    const buttonText = 'Click Me';

    const { unmount } = render(<TestComponent eventName={eventName} />);

    const button = screen.getByText(buttonText);
    userEvent.click(button);
    expect(screen.getByRole(ElementRole.Button)).toBeInTheDocument();
    expect(vi.isMockFunction(vi.fn())).toBe(true);
    unmount();
    userEvent.click(button);
    expect(mockListener).not.toHaveBeenCalled();
  });
});
