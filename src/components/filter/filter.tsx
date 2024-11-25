import { FilterOption } from '../../const/const';
import FilterPrice from '../filter-price/filter-price';
import FilterCheckList from '../filter-check-list/filter-check-list';
import { FilterState } from '../../store/filter-slice/filter-slice';
import { HandleFilterChange, Products } from '../../types/types';

type FilterProps = {
  filterState: FilterState;
  filteredProducts: Products;
  onChange: HandleFilterChange;
};

function Filter({
  filterState,
  filteredProducts,
  onChange,
}: FilterProps): JSX.Element {
  const prices = filteredProducts
    .map((product) => product.price)
    .sort((a, b) => a - b);

  const handleResetButtonClick = () => {
    const resetParams: {
      key: keyof FilterState;
      value: FilterState[keyof FilterState];
    }[] = [
      { key: 'price', value: null },
      { key: 'priceUp', value: null },
      { key: 'category', value: '' },
      { key: 'type', value: [] },
      { key: 'level', value: [] },
    ];
    onChange({ ...filterState }, resetParams);
  };

  return (
    <div className="catalog-filter">
      <form action="#">
        <h2 className="visually-hidden">Фильтр</h2>

        <FilterPrice
          allPrices={prices}
          filterState={filterState}
          onChange={onChange}
        />

        <FilterCheckList
          type="radio"
          title="Категория"
          name="category"
          items={FilterOption.category}
          totalState={filterState}
          onChange={onChange}
        />

        <FilterCheckList
          type="checkbox"
          title="Тип камеры"
          name="type"
          items={FilterOption.type}
          totalState={filterState}
          onChange={onChange}
        />

        <FilterCheckList
          type="checkbox"
          title="Уровень"
          name="level"
          items={FilterOption.level}
          totalState={filterState}
          onChange={onChange}
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
