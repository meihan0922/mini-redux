import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import store from "./store";
import store from "./store/rtkStore";
import { Provider } from "./mini-react-redux";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
