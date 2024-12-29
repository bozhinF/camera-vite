import { render, screen } from '@testing-library/react';
import css from './loader-spinner.module.css';
import LoaderSpinner from './loader-spinner';

describe('Component: LoaderSpinner', () => {
  it('should renders the loader spinner correctly', () => {
    const expectedLoaderTestId = 'loader';

    render(<LoaderSpinner />);

    const loader = screen.getByTestId(expectedLoaderTestId);
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass(css.loader);
  });
});
