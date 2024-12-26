import { Review } from '../../types/types';
import StarsRating from '../stars-rating/stars-rating';

type ReviewItemProps = {
  reviewData: Review;
};

function ReviewItem({ reviewData }: ReviewItemProps): JSX.Element {
  const { createAt, userName, advantage, disadvantage, review, rating } =
    reviewData;

  const date = new Date(createAt);
  const dateString = date.toLocaleString('ru-ru', {
    day: '2-digit',
    month: 'long',
  });
  const dateTime = date.toISOString().slice(0, 10);
  return (
    <li className="review-card" data-testid="review-item">
      <div className="review-card__head">
        <p className="title title--h4">{userName}</p>
        <time className="review-card__data" dateTime={dateTime}>
          {dateString}
        </time>
      </div>
      <StarsRating rating={rating} />
      <ul className="review-card__list">
        <li className="item-list">
          <span className="item-list__title">Достоинства:</span>
          <p className="item-list__text">{advantage}</p>
        </li>
        <li className="item-list">
          <span className="item-list__title">Недостатки:</span>
          <p className="item-list__text">{disadvantage}</p>
        </li>
        <li className="item-list">
          <span className="item-list__title">Комментарий:</span>
          <p className="item-list__text">{review}</p>
        </li>
      </ul>
    </li>
  );
}

export default ReviewItem;
