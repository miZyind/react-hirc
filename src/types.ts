/* eslint-disable @typescript-eslint/no-explicit-any */
type ActionCreator<Action> = (...args: any[]) => Action;

type Dispatch<Action> = (value: Action) => void;

type ActionsUnion<ActionCreators extends IActionCreators<any>> = ReturnType<
  ActionCreators[keyof ActionCreators]
>;

type MappedActionCreators<
  Action,
  ActionCreators extends IActionCreators<Action>
> = {
  [key in keyof ActionCreators]: (
    ...args: Parameters<ActionCreators[keyof ActionCreators]>
  ) => void;
};

interface IActionCreators<Action> {
  [name: string]: ActionCreator<Action>;
}

interface IContext<
  State,
  Action,
  ActionCreators extends IActionCreators<Action>
> {
  state: State;
  actions: MappedActionCreators<Action, ActionCreators>;
}

export {
  ActionCreator,
  Dispatch,
  ActionsUnion,
  MappedActionCreators,
  IActionCreators,
  IContext,
};
