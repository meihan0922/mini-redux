// import { createReducer } from "@reduxjs/toolkit";
import { createStore, combineReducers } from "../redux";
import createReducer from "./createReducer";

export function configureStore({ reducer }) {
  const rootReducers = combineReducers(reducer);
  const store = createStore(rootReducers);
  return store;
}

export function createSlice(options) {
  const { name, initialState, reducers = {} } = options;
  const reducersName = Object.keys(reducers);
  const actionCreators = {} as { [key in string]: any };
  // {[key]: reducer} 的結構
  const sliceCaseReducersByType = {};

  reducersName.forEach((reducerName) => {
    const type = `${name}/${reducerName}`;
    actionCreators[reducerName] = (...args) => ({
      type,
      payload: args[0],
    });
    // {[key]: reducer} 的結構
    sliceCaseReducersByType[type] = reducers[reducerName];
  });

  let _reducer;

  return {
    reducer: (state, action) => {
      if (!_reducer)
        _reducer = createReducer(initialState, sliceCaseReducersByType);
      return _reducer(state, action);
    },
    actions: actionCreators,
  };
}
