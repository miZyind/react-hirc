import produce, { Draft } from 'immer';
import React from 'react';

import {
  ActionCreator,
  ActionsUnion,
  Dispatch,
  IActionCreators,
  IContext,
  MappedActionCreators,
} from './types';

function bindActionCreator<Action>(
  actionCreator: ActionCreator<Action>,
  dispatch: Dispatch<Action>,
) {
  return function bind(): void {
    // eslint-disable-next-line prefer-rest-params
    return dispatch(actionCreator(...[null, Array.from(arguments)]));
  };
}

function mapDispatchToActionCreators<
  Action,
  ActionCreators extends IActionCreators<Action>
>(
  actionCreators: ActionCreators,
  dispatch: Dispatch<ActionsUnion<ActionCreators>>,
): MappedActionCreators<Action, ActionCreators> {
  return Object.entries(actionCreators).reduce<
    MappedActionCreators<Action, ActionCreators>
  >(
    produce((draft, [name, creator]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
): {
  Context: React.Context<IContext<State, Action, ActionCreators>>;
  ContextProvider: React.FC;
  useContext: () => IContext<State, Action, ActionCreators>;
} {
  const reducer = (state: State, action: ActionsUnion<ActionCreators>): State =>
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

  const useContext = (): IContext<State, Action, ActionCreators> =>
    React.useContext(Context);

  return { Context, ContextProvider, useContext };
}
