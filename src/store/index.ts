import { applyMiddleware, combineReducers } from "redux";
import { logger, logger2 } from "./logger";
// import { createStore, applyMiddleware, combineReducers } from "@mini/redux";
// import thunk from "./thunk";
import { loginReducer } from "./loginReducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: { user: loginReducer },
});
export default store;
export type AppDispatch = typeof store.dispatch;
