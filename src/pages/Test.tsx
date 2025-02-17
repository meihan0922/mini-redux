import React, { useLayoutEffect, useReducer } from "react";
import store from "../store";

const Test = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useLayoutEffect(() => {
    return store.subscribe(() => {
      forceUpdate();
    });
  }, []);

  return (
    <div>
      {/* state: {store.getState().count} */}
      <button
        onClick={() => {
          store.dispatch({ type: "ADD" });
        }}
      >
        change
      </button>
      <button
        onClick={() => {
          store.dispatch((dispatch) => {
            console.log("??!?!?1");
            setTimeout(() => {
              dispatch({ type: "ADD" });
            }, 1000);
          });
        }}
      >
        async add
      </button>
    </div>
  );
};

export default Test;
