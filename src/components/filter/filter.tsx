import { filterOptions } from '../../const/const';
import FilterPrice from '../filter-price/filter-price';
import FilterCheckList from '../filter-check-list/filter-check-list';
import { FilterState } from '../../store/filter-slice/filter-slice';
import { Products, updateURLProps } from '../../types/types';

type FilterProps = {
  filterState: FilterState;
  filteredProducts: Products;
  onChange: (data: updateURLProps) => void;
};

function Filter({
  filterState,
  filteredProducts,
  onChange,
}: FilterProps): JSX.Element {
  const filterPrice = filterState.price ? +filterState.price : null;
  const filterPriceUp = filterState.priceUp ? +filterState.priceUp : null;

  const prices = filteredProducts
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
          totalState={filterState}
        />

        <FilterCheckList
          type="checkbox"
          title="Тип камеры"
          name="type"
          items={filterOptions.type}
          onChange={onChange}
          totalState={filterState}
        />

        <FilterCheckList
          type="checkbox"
          title="Уровень"
          name="level"
          items={filterOptions.level}
          onChange={onChange}
          totalState={filterState}
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
