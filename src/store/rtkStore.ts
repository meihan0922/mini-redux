// import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@mini/redux-toolkit";
import countReducer from "./counterReducer";

export default configureStore({
  reducer: {
    counter: countReducer,
  },
});
