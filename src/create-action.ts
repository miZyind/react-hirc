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
  if (typeof meta === 'undefined') {
    if (typeof payload === 'undefined') {
      return { type };
    }

    return { type, payload };
  }

  return { type, payload, meta };
}
