export default function combineReducers(reducers) {
  return function (prevState = {}, action) {
    const nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      const reducer = reducers[key];
      nextState[key] = reducer(prevState[key], action);
      hasChanged = hasChanged || nextState[key] !== prevState[key];
    }

    hasChanged =
      hasChanged ||
      Object.keys(nextState).length !== Object.keys(prevState).length;

    return hasChanged ? nextState : prevState;
  };
}
