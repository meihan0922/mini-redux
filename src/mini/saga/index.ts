import { effectTypes } from "redux-saga/effects";
import { IO } from "./symbol";
import { stdChannel } from "./channel";

const func = (f) => typeof f === "function";
const promise = (p) => p && func(p.then); // 直接看有沒有 then

// env: store;
// pattern: ex- LOGIN_SUCCESS
// cb: next 方法
// const action = yield take(LOGOUT_SAGA);
function runTakeEffect(env, { channel = env.channel, pattern }, cb) {
  console.log("Take", pattern);
  const matcher = (input) => input.type === pattern;
  channel.take(cb, matcher);
}
// env: store;
// pattern: ex- LOGIN_SUCCESS
// cb: next 方法
// yield put({ type: LOGIN_SUCCESS, payload: res2 });
function runPutEffect(env, { action }, cb) {
  console.log("Put");
  const { dispatch } = env;
  const result = dispatch(action);
  cb(result);
}
// 只實現 Promise 的部分，沒有處理其他狀況
// env: store;
// fn: 未來要執行的函式
// args: fn 要執行的參數
// cb: next 方法
// const res1 = yield call(LoginService.login, action.payload);
function runCallEffect(env, { fn, args }, cb) {
  const result = fn.apply(null, args);
  console.log("Call", result, promise(result));
  if (promise(result)) {
    result.then((res) => cb(res)).catch((err) => cb(err, true));
    return;
  }
  cb(result);
}
// 只實現 generator 的部分，沒有處理到 Promise
// env: store;
// fn: 未來要執行的函式
// args: fn 要執行的參數
// cb: next 方法
// yield fork(loginHandler, action);
function runForkEffect(env, { fn, args }, cb) {
  console.log("Fork");
  const taskIterator = fn.apply(null, args);
  process(env, taskIterator); // 處理自身的生成器
  cb(); // 執行原先的 生成器
}

const effectRunnerMap = {
  [effectTypes.TAKE]: runTakeEffect,
  [effectTypes.CALL]: runCallEffect,
  [effectTypes.PUT]: runPutEffect,
  [effectTypes.FORK]: runForkEffect,
};

export default function createSagaMiddleware() {
  let boundRunSaga;
  let channel = stdChannel(); // 源碼中允許用戶自定義

  function sagaMiddleware({ getState, dispatch }) {
    // 1. 預先傳入第一個參數
    boundRunSaga = runSaga.bind(null, { channel, getState, dispatch });

    return (next) => (action) => {
      // dispatch(action)
      let result = next(action);
      console.log("createSagaMiddleware", action, result);
      channel.put(action);
      return result;
    };
  }
  // 2. 接收 generator，執行 generator
  sagaMiddleware.run = (...args) => {
    return boundRunSaga(...args);
  };

  return sagaMiddleware;
}

function runSaga({ getState, dispatch, channel }, saga, ...args) {
  const iterator = saga(...args);
  process({ getState, dispatch, channel }, iterator);
}

function process(env, iterator) {
  function next(arg?, isErr?) {
    let result;
    if (isErr) {
      result = iterator.throw(arg);
    } else {
      result = iterator.next(arg);
    }
    if (!result.done) {
      const effect = result.value;
      digestEffect(effect, next);
    }
  }
  function digestEffect(effect, next) {
    let effectSettled;
    // 避免重複執行
    function currentCb(res, isErr) {
      if (effectSettled) return;
      effectSettled = true;
      next(res, isErr);
    }
    runEffect(effect, currentCb);
  }

  function runEffect(effect, currentCb) {
    // 如果標記的 effect 存在就執行
    if (effect && effect[IO]) {
      const effectRunner = effectRunnerMap[effect.type];
      effectRunner(env, effect.payload, currentCb);
    } else {
      currentCb();
    }
  }

  next();
}
