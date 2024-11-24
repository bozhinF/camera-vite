import { useEffect, useState } from 'react';
import { filterOptions } from '../../const/const';
import { SetFilterStateOptions } from '../../types/types';
import { FilterState } from '../../store/filter-slice/filter-slice';

type Prices = {
  from: number | null;
  to: number | null;
};

type FilterPriceProps = {
  allPrices: number[];
  filterState: FilterState;
  onChange: <T extends FilterState, K extends keyof T, V extends T[K]>(
    state: T,
    options: SetFilterStateOptions<K, V>
  ) => void;
};

function FilterPrice({
  allPrices,
  filterState,
  onChange,
}: FilterPriceProps): JSX.Element {
  const pricesState: Prices = {
    from: filterState.price,
    to: filterState.priceUp,
  };
  const minPrice = allPrices[0];
  const maxPrice = allPrices[allPrices.length - 1];
  const [previousPrices, setPreviousPrices] = useState<Prices>({
    from: null,
    to: null,
  });
  const [currentPrices, setCurrentPrices] = useState<Prices>({
    from: null,
    to: null,
  });

  useEffect(() => {
    const correctFromValue = pricesState.from
      ? Math.min(maxPrice, Math.max(minPrice, pricesState.from))
      : null;
    const correctToValue = pricesState.to
      ? Math.max(minPrice, Math.min(maxPrice, pricesState.to))
      : null;
    if (
      previousPrices.from !== pricesState.from ||
      previousPrices.to !== pricesState.to ||
      pricesState.from !== correctFromValue ||
      pricesState.to !== correctToValue
    ) {
      setPreviousPrices({ from: correctFromValue, to: correctToValue });
      setCurrentPrices({ from: correctFromValue, to: correctToValue });
      onChange({ ...filterState }, [
        { key: 'price', value: correctFromValue },
        { key: 'priceUp', value: correctToValue },
      ]);
    }
  }, [
    maxPrice,
    minPrice,
    previousPrices.from,
    previousPrices.to,
    pricesState.from,
    pricesState.to,
    filterState,
    onChange,
  ]);

  const calculatePrice = (
    value: number | null,
    name: 'price' | 'priceUp'
  ): Prices => {
    if (!value) {
      return name === 'price'
        ? { from: null, to: currentPrices.to }
        : { from: currentPrices.from, to: null };
    }

    const correctValue = Math.min(Math.max(minPrice, value), maxPrice);
    if (!currentPrices.from) {
      return { from: null, to: correctValue };
    }
    if (!currentPrices.to) {
      return { from: correctValue, to: null };
    }

    const isThisPriceExist = allPrices.some(
      (price) =>
        currentPrices.from &&
        currentPrices.to &&
        price >= currentPrices.from &&
        price <= currentPrices.to
    );
    if (!isThisPriceExist && name === 'price') {
      return {
        from: correctValue,
        to: allPrices.find((price) => price >= correctValue) || correctValue,
      };
    }
    if (!isThisPriceExist && name === 'priceUp') {
      return {
        from:
          [...allPrices].reverse().find((price) => price <= correctValue) ||
          correctValue,
        to: correctValue,
      };
    }
    return name === 'price'
      ? { from: correctValue, to: currentPrices.to }
      : { from: currentPrices.from, to: correctValue };
  };

  const handlePriceChange = (
    name: 'price' | 'priceUp',
    value: number | null
  ) => {
    const { from, to } = calculatePrice(value, name);

    if (
      from === currentPrices.from &&
      from === previousPrices.from &&
      to === currentPrices.to &&
      to === previousPrices.to
    ) {
      return;
    }

    setCurrentPrices({ from, to });

    if (from && to) {
      onChange({ ...filterState }, [
        { key: 'price', value: from },
        { key: 'priceUp', value: to },
      ]);
    }
    if (!from && !to) {
      onChange({ ...filterState }, [
        { key: 'price', value: null },
        { key: 'priceUp', value: null },
      ]);
    }
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.target.name as 'price' | 'priceUp';
    const value = +event.target.value || null;
    handlePriceChange(name, value);
  };
  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }
    const element = event.target as HTMLInputElement;
    const name = element.name as 'price' | 'priceUp';
    const value = +element.value || null;
    handlePriceChange(name, value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    setCurrentPrices((prev) => {
      const from = name === 'price' ? +event.target.value : prev.from;
      const to = name === 'priceUp' ? +event.target.value : prev.to;
      return { from, to };
    });
  };

  return (
    <fieldset className="catalog-filter__block">
      <legend className="title title--h5">Цена, ₽</legend>
      <div className="catalog-filter__price-range">
        <div className="custom-input">
          <label>
            <input
              value={currentPrices.from ? currentPrices.from : ''}
              onKeyDown={handleEnterKeyDown}
              onChange={handleInputChange}
              type="number"
              name={filterOptions.price[0].id}
              placeholder={`${minPrice ? minPrice : 'от'}`}
              onBlur={handleInputBlur}
            />
          </label>
        </div>
        <div className="custom-input">
          <label>
            <input
              value={currentPrices.to ? currentPrices.to : ''}
              onChange={handleInputChange}
              onKeyDown={handleEnterKeyDown}
              type="number"
              name={filterOptions.priceUp[0].id}
              placeholder={`${maxPrice ? maxPrice : 'до'}`}
              onBlur={handleInputBlur}
            />
          </label>
        </div>
      </div>
    </fieldset>
  );
}

export default FilterPrice;
