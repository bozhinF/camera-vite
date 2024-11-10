import { useEffect, useState } from 'react';
import { FilterOptionsItem, UpdateUrl } from '../../types/types';

type FilterCheckListProps = {
  type: 'radio' | 'checkbox';
  title: string;
  name: string;
  items: FilterOptionsItem;
  onChange: UpdateUrl;
  state: string[];
};

function FilterCheckList({
  type,
  title,
  name,
  items,
  onChange,
  state,
}: FilterCheckListProps): JSX.Element {
  const [checkedItems, setCheckedItems] = useState<string[]>(state);

  useEffect(() => {
    if (type === 'checkbox') {
      if (state.length !== checkedItems.length) {
        setCheckedItems(state);
        return;
      }

      const sortedState = [...state].sort((a, b) => a.localeCompare(b));
      const sortedCheckedItems = [...checkedItems].sort((a, b) =>
        a.localeCompare(b)
      );
      const isArraysEqual =
        sortedState.toString() === sortedCheckedItems.toString();
      if (!isArraysEqual) {
        setCheckedItems(state);
      }
    }
  }, [state, checkedItems, type]);

  const handleInputChange = (
    item: FilterOptionsItem[number],
    isActive: boolean
  ) => {
    if (type === 'radio') {
      setCheckedItems([item.value]);
      onChange([{ param: name, prop: item.value, action: 'set' }]);
      return;
    }
    if (isActive) {
      setCheckedItems((prev) => {
        const index = prev.findIndex((element) => element === item.value);
        if (index === -1) {
          return prev;
        }
        const result = [...prev.slice(0, index), ...prev.slice(index + 1)];
        return result;
      });
      onChange([{ param: name, prop: item.value, action: 'delete' }]);
      return;
    }
    setCheckedItems((prev) => [...prev, item.value]);
    onChange([{ param: name, prop: item.value, action: 'append' }]);
  };

  return (
    <fieldset className="catalog-filter__block">
      <legend className="title title--h5">{title}</legend>
      {items.map((item) => {
        const isActive = checkedItems.includes(item.value);
        return (
          <div key={item.id} className={`custom-${type} catalog-filter__item`}>
            <label>
              <input
                type={type}
                name={type === 'radio' ? name : item.id}
                {...(type === 'radio' ? { value: item.value } : {})}
                checked={isActive}
                onChange={() => handleInputChange(item, isActive)}
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
