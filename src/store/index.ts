import { applyMiddleware, combineReducers } from "redux";
import { logger, logger2 } from "./logger";
// import { createStore, applyMiddleware, combineReducers } from "@mini/redux";
// import thunk from "./thunk";
import { loginReducer } from "./loginReducer";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { loginSaga } from "src/action/loginSaga";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: { user: loginReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});
// then run the saga
sagaMiddleware.run(loginSaga);

export default store;
export type AppDispatch = typeof store.dispatch;
