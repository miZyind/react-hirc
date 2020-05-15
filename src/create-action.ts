export default function createAction<T extends string>(type: T): { type: T };
export default function createAction<T extends string, P>(
  type: T,
  payload: P,
): { type: T; payload: P };
export default function createAction<T extends string, P, M>(
  type: T,
  payload: P,
  meta: M,
): { type: T; payload: P; meta: M };
export default function createAction<T extends string, P, M>(
  type: T,
  payload?: P,
  meta?: M,
): { type: T } | { type: T; payload: P } | { type: T; payload: P; meta: M } {
  return meta === undefined
    ? payload === undefined
      ? { type }
      : { type, payload }
    : { type, payload, meta };
}
