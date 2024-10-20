import { Reviews } from '../types/types';

export const capitalize = (string: string): string =>
  string[0].toUpperCase() + string.slice(1);

export const sortReviewsByDate = (reviews: Reviews) => {
  const result = [...reviews].sort((reviewA, reviewB) => {
    const reviewADate = Date.parse(reviewA.createAt);
    const reviewBDate = Date.parse(reviewB.createAt);
    return reviewBDate - reviewADate;
  });

  return result;
};
