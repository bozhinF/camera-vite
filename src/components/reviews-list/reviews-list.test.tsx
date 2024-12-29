import { render, screen, fireEvent } from '@testing-library/react';
import ReviewsList from './reviews-list';
import { getMockReview } from '../../util/mocks';
import { ElementRole } from '../../const/const';

describe('Component: ReviewsList', () => {
  const mockReviews = Array.from({ length: 4 }, getMockReview);

  it('should renders the correct number of reviews initially', () => {
    const epxectedReviewsText = 'Отзывы';
    const expectedReviewItemTestId = 'review-item';
    const expectedReviewItemsCount = 3;

    render(<ReviewsList reviews={mockReviews} />);

    expect(screen.getByText(epxectedReviewsText)).toBeInTheDocument();
    expect(screen.getAllByTestId(expectedReviewItemTestId)).toHaveLength(
      expectedReviewItemsCount
    );
  });

  it('should shows more reviews when button is clicked', () => {
    const expectedShowMoreButtonText = /Показать больше отзывов/i;
    const expectedReviewItemTestId = 'review-item';
    const expectedReviewItemsCount = 4;

    render(<ReviewsList reviews={mockReviews} />);

    const showMoreButton = screen.getByRole(ElementRole.Button, {
      name: expectedShowMoreButtonText,
    });
    fireEvent.click(showMoreButton);
    expect(screen.getAllByTestId(expectedReviewItemTestId)).toHaveLength(
      expectedReviewItemsCount
    );
  });

  it('should does not show the button when all reviews are displayed', () => {
    const expectedShowMoreButtonText = /Показать больше отзывов/i;

    render(<ReviewsList reviews={mockReviews} />);

    const showMoreButton = screen.getByRole(ElementRole.Button, {
      name: expectedShowMoreButtonText,
    });
    fireEvent.click(showMoreButton);
    expect(showMoreButton).not.toBeInTheDocument();
  });

  it('should renders no reviews message when there are no reviews', () => {
    const epxectedReviewsText = 'Отзывы';
    const expectedReviewItemTestId = 'review-item';

    render(<ReviewsList reviews={[]} />);

    expect(screen.getByText(epxectedReviewsText)).toBeInTheDocument();
    expect(screen.queryByTestId(expectedReviewItemTestId)).toBeNull();
  });
});
