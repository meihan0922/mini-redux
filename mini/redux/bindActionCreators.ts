function bindActionCreator(action, dispatch) {
  return (...args) => dispatch(action(...args));
}

export default function bindActionCreators(actions, dispatch) {
  let obj = {};
  for (const key in actions) {
    obj[key] = bindActionCreator(actions[key], dispatch);
  }
  return obj;
}
