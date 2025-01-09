// import { createStore, applyMiddleware } from "redux";
// import { thunk } from "redux-thunk";
// import logger from "redux-logger";
import { logger, logger2 } from "./logger";
import { createStore, applyMiddleware } from "../mini-redux";
import thunk from "./thunk";

function countReducer(state = 0, action) {
  switch (action?.type) {
    case "ADD":
      return state + 1;
    case "MINUS":
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(
  countReducer,
  applyMiddleware(logger2, logger, thunk)
);
export default store;
