import { useState } from 'react';
import { Reviews } from '../../types/types';
import ReviewItem from '../review-item/review-item';
import { sortReviewsByDate } from '../../util/util';

type ReviewsListProps = {
  reviews: Reviews;
};

const SHOW_REVIEWS_PER_STEP = 3;

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  const [showedReviewsCount, setShowedReviewsCount] = useState(
    SHOW_REVIEWS_PER_STEP
  );
  const sortedReviews = sortReviewsByDate(reviews);
  const showedReviews = sortedReviews.slice(0, showedReviewsCount);

  const handleShowMoreReviewsButton = () =>
    setShowedReviewsCount((showed) => showed + SHOW_REVIEWS_PER_STEP);

  return (
    <section className="review-block">
      <div className="container">
        <div className="page-content__headed">
          <h2 className="title title--h3">Отзывы</h2>
        </div>
        <ul className="review-block__list">
          {showedReviews.map((review) => (
            <ReviewItem key={review.id} reviewData={review} />
          ))}
        </ul>
        <div className="review-block__buttons">
          {showedReviewsCount < reviews.length ? (
            <button
              className="btn btn--purple"
              type="button"
              onClick={handleShowMoreReviewsButton}
            >
              Показать больше отзывов
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewsList;
