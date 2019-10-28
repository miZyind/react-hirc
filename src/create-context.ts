import produce, { Draft } from 'immer';
import React from 'react';

import {
  ActionCreator,
  ActionsUnion,
  Dispatch,
  IActionCreators,
  IContext,
  MappedActionCreators
} from './types';

function bindActionCreator<Action>(
  actionCreator: ActionCreator<Action>,
  dispatch: Dispatch<Action>,
) {
  return function bind() {
    return dispatch(actionCreator.apply(null, Array.from(arguments)));
  };
}

function mapDispatchToActionCreators<
  Action,
  ActionCreators extends IActionCreators<Action>
>(
  actionCreators: ActionCreators,
  dispatch: Dispatch<ActionsUnion<ActionCreators>>,
) {
  return Object.entries(actionCreators).reduce<
    MappedActionCreators<Action, ActionCreators>
  >(
    produce((draft, [name, creator]) => {
      draft[name] = bindActionCreator(creator, dispatch);
    }),
    actionCreators,
  );
}

export default function createContext<
  State,
  Action,
  ActionCreators extends IActionCreators<Action>
>(
  initialState: State,
  actionCreators: ActionCreators,
  recipe: (draft: Draft<State>, action: ActionsUnion<ActionCreators>) => void,
) {
  const reducer = (state: State, action: ActionsUnion<ActionCreators>) =>
    produce(state, (draft) => recipe(draft, action));

  const Context = React.createContext<IContext<State, Action, ActionCreators>>({
    state: initialState,
    actions: actionCreators,
  });

  const ContextProvider: React.FC = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const actions = mapDispatchToActionCreators(actionCreators, dispatch);
    return React.createElement(
      Context.Provider,
      { value: { state, actions } },
      children,
    );
  };

  const useContext = () => React.useContext(Context);

  return { Context, ContextProvider, useContext };
}
