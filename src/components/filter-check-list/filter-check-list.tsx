import { useEffect, useState } from 'react';
import { FilterOptionsItem, HandleFilterChange } from '../../types/types';
import { FilterState } from '../../store/filter-slice/filter-slice';

type FilterCheckListProps = {
  type: 'radio' | 'checkbox';
  title: string;
  name: keyof FilterState;
  items: FilterOptionsItem;
  totalState: FilterState;
  onChange: HandleFilterChange;
};

function FilterCheckList({
  type,
  title,
  name,
  items,
  totalState,
  onChange,
}: FilterCheckListProps): JSX.Element {
  const localState = totalState[name];
  const [checkedItems, setCheckedItems] =
    useState<FilterState[keyof FilterState]>(localState);

  const isvideocameraChecked = totalState.category === 'videocamera';

  useEffect(() => {
    if (!Array.isArray(localState) && localState !== checkedItems) {
      setCheckedItems(localState);
      return;
    }
    if (
      Array.isArray(localState) &&
      Array.isArray(checkedItems) &&
      localState.length !== checkedItems.length
    ) {
      setCheckedItems(localState);
      return;
    }

    if (Array.isArray(localState) && Array.isArray(checkedItems)) {
      const sortedState = [...localState].sort((firstItem, secondItem) =>
        firstItem.localeCompare(secondItem)
      );
      const sortedCheckedItems = [...checkedItems].sort(
        (firstItem, secondItem) => firstItem.localeCompare(secondItem)
      );
      const isArraysEqual =
        sortedState.toString() === sortedCheckedItems.toString();
      if (!isArraysEqual) {
        setCheckedItems(localState);
      }
    }
  }, [checkedItems, localState, type]);

  const handleInputChange = (
    item: FilterOptionsItem[number],
    isActive: boolean
  ) => {
    if (type === 'radio') {
      setCheckedItems(item.value);
      if (item.value === 'videocamera') {
        const changedType = totalState.type.filter(
          (typeItem) => typeItem !== 'film' && typeItem !== 'snapshot'
        );
        const options: {
          key: keyof FilterState;
          value: FilterState[keyof FilterState];
        }[] = [
          { key: name, value: item.value },
          { key: 'type', value: changedType },
        ];
        onChange({ ...totalState }, options);
        return;
      }
      onChange({ ...totalState }, [{ key: name, value: item.value }]);
      return;
    }
    if (isActive) {
      if (Array.isArray(checkedItems)) {
        setCheckedItems((prev) => {
          const typedPrev = prev as string[];
          const index = typedPrev.findIndex(
            (element) => element === item.value
          );
          if (index === -1) {
            return typedPrev;
          }
          const result = [
            ...typedPrev.slice(0, index),
            ...typedPrev.slice(index + 1),
          ];
          return result;
        });
        const update = [...checkedItems].filter(
          (typeItem) => typeItem !== item.value
        );
        const options: {
          key: keyof FilterState;
          value: FilterState[keyof FilterState];
        }[] = [{ key: name, value: update }];
        onChange({ ...totalState }, options);
        return;
      }
    }
    if (Array.isArray(checkedItems)) {
      setCheckedItems((prev) => {
        const typedPrev = prev as string[];
        return [...typedPrev, item.value];
      });
      const update = [...checkedItems, item.value];

      onChange({ ...totalState }, [{ key: name, value: update }]);
    }
  };

  return (
    <fieldset className="catalog-filter__block">
      <legend className="title title--h5">{title}</legend>
      {items.map((item) => {
        const isActive =
          checkedItems === item.value ||
          (Array.isArray(checkedItems) && checkedItems.includes(item.value));
        const isDisabled =
          isvideocameraChecked &&
          (item.id === 'snapshot' || item.id === 'film');
        return (
          <div key={item.id} className={`custom-${type} catalog-filter__item`}>
            <label>
              <input
                type={type}
                name={type === 'radio' ? name : item.id}
                {...(type === 'radio' ? { value: item.value } : {})}
                checked={isActive}
                onChange={() => handleInputChange(item, isActive)}
                disabled={isDisabled}
              />
              <span className={`custom-${type}__icon`}></span>
              <span className={`custom-${type}__label`}>{item.title}</span>
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}

export default FilterCheckList;
