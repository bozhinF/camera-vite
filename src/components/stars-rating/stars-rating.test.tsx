import { render, screen } from '@testing-library/react';
import StarsRating from './stars-rating';

describe('Component: StarsRating', () => {
  it('should renders correct number of stars filled based on rating', () => {
    const rating = 3;
    render(<StarsRating rating={rating} />);

    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);
    const starsImage = screen.getAllByTestId('star-image');
    starsImage.forEach((starImage, index) =>
      expect(starImage.getAttribute('xlink:href')).toBe(
        index < rating ? '#icon-full-star' : '#icon-star'
      )
    );
  });

  it('should renders review count when provided', () => {
    render(<StarsRating rating={4} reviewCount={10} />);

    expect(screen.getByText('Рейтинг: 4')).toBeInTheDocument();
    expect(screen.getByText('Всего оценок:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should does not render review count when not provided', () => {
    render(<StarsRating rating={5} />);

    expect(screen.queryByText('Всего оценок:')).not.toBeInTheDocument();
  });

  it('should renders visually hidden text correctly', () => {
    render(<StarsRating rating={2} reviewCount={5} />);

    expect(screen.getByText('Рейтинг: 2')).toBeInTheDocument();
    expect(screen.getByText('Всего оценок:')).toBeInTheDocument();
  });
});
