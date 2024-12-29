import { render, screen } from '@testing-library/react';
import StarsRating from './stars-rating';
import { ElementAttribute } from '../../const/const';

describe('Component: StarsRating', () => {
  it('should renders correct number of stars filled based on rating', () => {
    const rating = 3;
    const starTestId = 'star';
    const expectedStarsCount = 5;
    const startImageTestId = 'star-image';
    const fullStartXlinkHref = '#icon-full-star';
    const emptyStarXlinkHref = '#icon-star';

    render(<StarsRating rating={rating} />);

    const stars = screen.getAllByTestId(starTestId);
    expect(stars).toHaveLength(expectedStarsCount);
    const starsImage = screen.getAllByTestId(startImageTestId);
    starsImage.forEach((starImage, index) =>
      expect(starImage.getAttribute(ElementAttribute.XlinkHref)).toBe(
        index < rating ? fullStartXlinkHref : emptyStarXlinkHref
      )
    );
  });

  it('should renders review count when provided', () => {
    const rating = 4;
    const reviewCount = 10;
    const expectedRatingText = 'Рейтинг: 4';
    const expectedReviewCountTitleText = 'Всего оценок:';
    const expectedReviewCountText = '10';

    render(<StarsRating rating={rating} reviewCount={reviewCount} />);

    expect(screen.getByText(expectedRatingText)).toBeInTheDocument();
    expect(screen.getByText(expectedReviewCountTitleText)).toBeInTheDocument();
    expect(screen.getByText(expectedReviewCountText)).toBeInTheDocument();
  });

  it('should does not render review count when not provided', () => {
    const rating = 5;
    const expectedReviewCountTitleText = 'Всего оценок:';

    render(<StarsRating rating={rating} />);

    expect(
      screen.queryByText(expectedReviewCountTitleText)
    ).not.toBeInTheDocument();
  });

  it('should renders visually hidden text correctly', () => {
    const rating = 2;
    const reviewCount = 5;
    const expectedRatingText = 'Рейтинг: 2';
    const expectedReviewCountTitleText = 'Всего оценок:';

    render(<StarsRating rating={rating} reviewCount={reviewCount} />);

    expect(screen.getByText(expectedRatingText)).toBeInTheDocument();
    expect(screen.getByText(expectedReviewCountTitleText)).toBeInTheDocument();
  });
});
