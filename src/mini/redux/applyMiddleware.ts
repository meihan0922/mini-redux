export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    // const dispatch = store.dispatch;
    let dispatch = (...args) => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };
    const midAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    };
    const chain = middlewares.map((middleware) => middleware(midAPI));

    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

function compose(...funArgs) {
  if (funArgs.length === 0) {
    return (args) => args;
  }
  if (funArgs.length === 1) {
    return funArgs[0];
  }

  return funArgs.reduce((acc, cur) => {
    return (...args) => acc(cur(...args));
  });
}
