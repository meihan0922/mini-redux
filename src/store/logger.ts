const logger = (store) => (next) => (action) => {
  console.log("logger1 dispatch", action);
  const result = next(action);
  console.log("logger1 next state", store.getState());
  return result;
};

const logger2 = (store) => (next) => (action) => {
  console.log("logger2 dispatch", action);
  const result = next(action);
  console.log("logger2 next state", store.getState());
  return result;
};

export { logger, logger2 };
