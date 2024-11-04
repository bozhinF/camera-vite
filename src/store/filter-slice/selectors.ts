import { NameSpace } from '../../const/const';
import { State } from '../../types/state';

export const getFilterParams = (state: Pick<State, NameSpace.Filter>) =>
  state[NameSpace.Filter];
