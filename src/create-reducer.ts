import produce from 'immer';

export default function createReducer<State, Action>(
  recipe: (draft: State, action: Action) => void,
) {
  return produce(recipe);
}
