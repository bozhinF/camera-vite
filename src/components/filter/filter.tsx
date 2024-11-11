import { useAppSelector } from '../../hooks';
import { filterOptions } from '../../const/const';
import { getAllProducts } from '../../store/products-slice/selectors';
import FilterPrice from '../filter-price/filter-price';
import FilterCheckList from '../filter-check-list/filter-check-list';
import { FilterState } from '../../store/filter-slice/filter-slice';
import { updateURLProps } from '../../types/types';

type FilterProps = {
  filterState: FilterState;
  onChange: (data: updateURLProps) => void;
};

function Filter({ filterState, onChange }: FilterProps): JSX.Element {
  const filterPrice = filterState.price ? +filterState.price : null;
  const filterPriceUp = filterState.priceUp ? +filterState.priceUp : null;

  const allProducts = useAppSelector(getAllProducts);
  const prices = allProducts
    .map((product) => product.price)
    .sort((a, b) => a - b);

  const handleResetButtonClick = () => {
    const resetParams = Object.keys(filterState).map(
      (filterItem): updateURLProps[number] => ({
        param: filterItem,
        action: 'delete',
      })
    );
    onChange(resetParams);
  };

  return (
    <div className="catalog-filter">
      <form action="#">
        <h2 className="visually-hidden">Фильтр</h2>

        <FilterPrice
          allPrices={prices}
          pricesState={{ from: filterPrice, to: filterPriceUp }}
          onChange={onChange}
        />

        <FilterCheckList
          type="radio"
          title="Категория"
          name="category"
          items={filterOptions.category}
          onChange={onChange}
          state={filterState.category ? [filterState.category] : []}
        />

        <FilterCheckList
          type="checkbox"
          title="Тип камеры"
          name="type"
          items={filterOptions.type}
          onChange={onChange}
          state={filterState.type ? filterState.type : []}
        />

        <FilterCheckList
          type="checkbox"
          title="Уровень"
          name="level"
          items={filterOptions.level}
          onChange={onChange}
          state={filterState.level ? filterState.level : []}
        />

        <button
          className="btn catalog-filter__reset-btn"
          type="reset"
          onClick={handleResetButtonClick}
        >
          Сбросить фильтры
        </button>
      </form>
    </div>
  );
}

export default Filter;
