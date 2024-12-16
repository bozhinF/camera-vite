import { render, screen } from '@testing-library/react';
import Loader from './loader';

describe('Component: Loader', () => {
  it('should render correctly', () => {
    const expectedText = /Loading/i;

    render(<Loader />);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
