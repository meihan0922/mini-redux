import createNextState from "immer";
// 返回一個 reducer
export default function createReducer(initialState, actionsMap) {
  function reducer(state = initialState, action) {
    const caseReducers = [actionsMap[action.type]];

    return caseReducers.reduce((acc, cur) => {
      if (cur) {
        return createNextState(acc, (draft) => {
          return cur(draft, action);
        });
      }
      return acc;
    }, state);
  }
  return reducer;
}
