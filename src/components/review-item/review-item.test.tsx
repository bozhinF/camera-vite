import { render, screen } from '@testing-library/react';
import ReviewItem from './review-item';
import { getMockReview } from '../../util/mocks';

describe('Component: ReviewItem', () => {
  it('should renders review data correctly', () => {
    const mockReview = getMockReview({
      createAt: '2023-03-15T12:34:56Z',
      userName: 'Тестировщик',
      advantage: 'Хорошее качество',
      disadvantage: 'Высокая цена',
      review: 'Отличный товар, но слишком дорогой.',
      rating: 4.5,
    });
    const expectedDateText = '15 марта';
    const expectedAdvantagesTitleText = 'Достоинства:';
    const expectedDisadvantagesTitleText = 'Недостатки:';
    const expectedCommentTitleText = 'Комментарий:';

    render(<ReviewItem reviewData={mockReview} />);

    expect(screen.getByText(mockReview.userName)).toBeInTheDocument();
    expect(screen.getByText(expectedDateText)).toBeInTheDocument();
    expect(screen.getByText(expectedAdvantagesTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockReview.advantage)).toBeInTheDocument();
    expect(
      screen.getByText(expectedDisadvantagesTitleText)
    ).toBeInTheDocument();
    expect(screen.getByText(mockReview.disadvantage)).toBeInTheDocument();
    expect(screen.getByText(expectedCommentTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockReview.review)).toBeInTheDocument();
  });

  it('should renders different review data', () => {
    const mockReview = getMockReview({
      createAt: '2022-12-01T09:30:00Z',
      userName: 'Покупатель',
      advantage: 'Быстрая доставка',
      disadvantage: 'Неудобная упаковка',
      review: 'Получил товар быстро, но упаковка была повреждена.',
      rating: 3,
    });
    const expectedDateText = '01 декабря';
    const expectedAdvantagesTitleText = 'Достоинства:';
    const expectedDisadvantagesTitleText = 'Недостатки:';
    const expectedCommentTitleText = 'Комментарий:';

    render(<ReviewItem reviewData={mockReview} />);

    expect(screen.getByText(mockReview.userName)).toBeInTheDocument();
    expect(screen.getByText(expectedDateText)).toBeInTheDocument();
    expect(screen.getByText(expectedAdvantagesTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockReview.advantage)).toBeInTheDocument();
    expect(
      screen.getByText(expectedDisadvantagesTitleText)
    ).toBeInTheDocument();
    expect(screen.getByText(mockReview.disadvantage)).toBeInTheDocument();
    expect(screen.getByText(expectedCommentTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockReview.review)).toBeInTheDocument();
  });
});
