import { render, screen } from '@testing-library/react';
import { Review } from '../../types/types';
import ReviewItem from './review-item';
import { getMockReview } from '../../util/mocks';

describe('Component: ReviewItem', () => {
  it('should renders review data correctly', () => {
    const mockReview: Review = getMockReview({
      createAt: '2023-03-15T12:34:56Z',
      userName: 'Тестировщик',
      advantage: 'Хорошее качество',
      disadvantage: 'Высокая цена',
      review: 'Отличный товар, но слишком дорогой.',
      rating: 4.5,
    });

    render(<ReviewItem reviewData={mockReview} />);

    expect(screen.getByText('Тестировщик')).toBeInTheDocument();
    expect(screen.getByText('15 марта')).toBeInTheDocument(); // Проверяем формат даты
    expect(screen.getByText('Достоинства:')).toBeInTheDocument();
    expect(screen.getByText('Хорошее качество')).toBeInTheDocument();
    expect(screen.getByText('Недостатки:')).toBeInTheDocument();
    expect(screen.getByText('Высокая цена')).toBeInTheDocument();
    expect(screen.getByText('Комментарий:')).toBeInTheDocument();
    expect(
      screen.getByText('Отличный товар, но слишком дорогой.')
    ).toBeInTheDocument();
  });

  it('should renders different review data', () => {
    const mockReview: Review = getMockReview({
      createAt: '2022-12-01T09:30:00Z',
      userName: 'Покупатель',
      advantage: 'Быстрая доставка',
      disadvantage: 'Неудобная упаковка',
      review: 'Получил товар быстро, но упаковка была повреждена.',
      rating: 3,
    });

    render(<ReviewItem reviewData={mockReview} />);

    expect(screen.getByText('Покупатель')).toBeInTheDocument();
    expect(screen.getByText('01 декабря')).toBeInTheDocument();
    expect(screen.getByText('Достоинства:')).toBeInTheDocument();
    expect(screen.getByText('Быстрая доставка')).toBeInTheDocument();
    expect(screen.getByText('Недостатки:')).toBeInTheDocument();
    expect(screen.getByText('Неудобная упаковка')).toBeInTheDocument();
    expect(screen.getByText('Комментарий:')).toBeInTheDocument();
    expect(
      screen.getByText('Получил товар быстро, но упаковка была повреждена.')
    ).toBeInTheDocument();
  });
});
