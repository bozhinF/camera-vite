import { render, screen, fireEvent } from '@testing-library/react';
import { Reviews } from '../../types/types';
import ReviewsList from './reviews-list';
import { getMockReview } from '../../util/mocks';

describe('Component: ReviewsList', () => {
  const mockReviews: Reviews = Array.from({ length: 4 }, getMockReview);

  it('should renders the correct number of reviews initially', () => {
    render(<ReviewsList reviews={mockReviews} />);

    expect(screen.getByText('Отзывы')).toBeInTheDocument();
    expect(screen.getAllByTestId('review-item')).toHaveLength(3);
  });

  it('should shows more reviews when button is clicked', () => {
    render(<ReviewsList reviews={mockReviews} />);

    const showMoreButton = screen.getByRole('button', {
      name: /Показать больше отзывов/i,
    });
    fireEvent.click(showMoreButton);

    expect(screen.getAllByTestId('review-item')).toHaveLength(4);
  });

  it('should does not show the button when all reviews are displayed', () => {
    render(<ReviewsList reviews={mockReviews} />);

    const showMoreButton = screen.getByRole('button', {
      name: /Показать больше отзывов/i,
    });
    fireEvent.click(showMoreButton);

    expect(showMoreButton).not.toBeInTheDocument();
  });

  it('should renders no reviews message when there are no reviews', () => {
    render(<ReviewsList reviews={[]} />);

    expect(screen.getByText('Отзывы')).toBeInTheDocument();
    expect(screen.queryByTestId('review-item')).toBeNull();
  });
});
