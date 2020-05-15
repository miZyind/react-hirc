import produce from 'immer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function createReducer<State, Action>(
  recipe: (draft: State, action: Action) => void,
) {
  return produce(recipe);
}
