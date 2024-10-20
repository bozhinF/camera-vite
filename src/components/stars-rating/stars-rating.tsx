const RATING_STARS_COUNT = 5;
type StarsRatingProps = {
  rating: number;
  reviewCount?: number;
};
function StarsRating({ rating, reviewCount }: StarsRatingProps): JSX.Element {
  return (
    <div
      className={`rate ${
        reviewCount ? 'product-card__rate' : 'review-card__rate'
      }`}
    >
      {Array.from({ length: RATING_STARS_COUNT }, (_, i) => i + 1).map(
        (number) => (
          <svg key={number} width={17} height={16} aria-hidden="true">
            <use
              xlinkHref={number > rating ? '#icon-star' : '#icon-full-star'}
            />
          </svg>
        )
      )}
      <p className="visually-hidden">
        {`${reviewCount ? 'Рейтинг' : 'Оценка'}: ${rating}`}
      </p>
      {reviewCount && (
        <p className="rate__count">
          <span className="visually-hidden">Всего оценок:</span>
          {reviewCount}
        </p>
      )}
    </div>
  );
}

export default StarsRating;
