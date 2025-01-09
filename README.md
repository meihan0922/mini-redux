- [mini-redux](#mini-redux)
  - [Reducer](#reducer)
    - [基礎架構](#基礎架構)
  - [applymiddleware 中間件](#applymiddleware-中間件)
  - [combineReducers](#combinereducers)

# mini-redux

## Reducer

接收舊的狀態和 action，返回新的狀態。
像是 `Array.reduce(reducer, initialValue);`

```js
(previousState, action) => newState;
```

是 純函數(Pure Function)，傳入相同的參數會有相同的回傳值！
所以不能夠：

1. 修改傳入的參數
2. 使副作用發生，比方 API 或是 路由跳轉
3. 調用非純的函式，比方 `Date.now()`, `Math.random()`，每次調用產生的結果都不同

```mermaid
flowchart LR

A[Action Creators] -->|dispatch（action）| B(Store)

B -->| （previousState,action） | C(Reducers)

C -->|（newState）| B

B -->|（state）| D(React components)

D --> | trigger | A
```

- 核心要實現

  - 存儲狀態
  - 獲取狀態
  - 更新狀態
  - 變更訂閱

### 基礎架構

> src/store/index.js

```ts
// import { createStore } from "redux";
import { createStore } from "../mini-redux/index.ts";

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

const store = createStore(countReducer);
export default store;
```

> src/pages/Test.tsx

```tsx
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
      state: {store.getState()}
      <button
        onClick={() => {
          store.dispatch({ type: "ADD" });
        }}
      >
        change
      </button>
    </div>
  );
};

export default Test;
```

> src/mini-redux/index.ts

```ts
import createStore from "./createStore.ts";
export { createStore };
```

> src/mini-redux/createStore.ts

```tsx
export default function createStore(reducer) {
  let currentState;
  let listeners: any[] = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    const newState = reducer(currentState, action);
    currentState = newState;
    listeners.forEach((l) => {
      l();
    });
  }

  function subscribe(listener: any) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 初始數據
  dispatch({ type: "1111" });

  return {
    getState,
    dispatch,
    subscribe,
  };
}
```

## applymiddleware 中間件

如果想要處理副作用，要怎麼辦？想和服務端交互、異步處理，有辦法這樣寫嗎？

```ts
// 不是這樣
setTimeout(() => {
  store.dispatch({ type: "MINUS" });
}, 100);
// 想要改寫成這樣，異步處理 dispatch，有辦法嗎
store.dispatch((dispatch) => {
  setTimeout(() => {
    dispatch({ type: "MINUS" });
  }, 100);
});
```

redux 只是一個純粹的狀態管理工具，只支持同步。如果要支援異步，必須要使用中間件，比如 redux-thunk 和 redux-logger。對 `store.dispatch` 進行改造，在發出 action 和執行 reducer 這兩部之間，添加其他功能。

> src/store/index.js

```js
import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import logger from "redux-logger";

const store = createStore(countReducer, applyMiddleware(thunk, logger));
```

> src/pages/Test.tsx

```js
<button
  onClick={() => {
    store.dispatch((dispatch) => {
      setTimeout(() => {
        dispatch({ type: "ADD" });
      }, 1000);
    });
  }}
>
  async add
</button>
```

中間會需要利用 `compose` 和 `currying` 的概念。

- compose

  將三個函式結合成一個，並且把第一個函式返回值傳遞給下一個當作參數

  ```js
  function f1(arg) {
    console.log("f1", arg);
    return arg;
  }

  function f2(arg) {
    console.log("f2", arg);
    return arg;
  }

  function f3(arg) {
    console.log("f3", arg);
    return arg;
  }

  const fn = compose(f1, f2, f3);
  fn(123);
  ```

  利用 arguments 來處理

  ```js
  function compose(...funArgs) {
    if (funArgs.length === 0) {
      return (args) => args;
    }

    return function (...args) {
      const result = funArgs.reduce((acc, cur) => {
        return cur(acc);
      }, ...args);
    };
  }
  // args => f3(f2(f1(args)))
  // 可以在簡寫成這樣（但是執行的順序不同
  function compose(...funArgs) {
    if (funArgs.length === 0) {
      return (args) => args;
    }

    // 如果沒有傳初始值，則原陣列的第一個元素將會被當作初始的累加器。
    // [f1, f2, f3]。 f1 作為初始值
    // 再下一次，cur 函式會帶著 args 變成上個累加器的 arg
    // (f3(args)) => f1(f2(f3(args)))
    return funArgs.reduce((acc, cur) => {
      return (...args) => acc(cur(...args));
    });
  }
  ```

  為什麼會需要用到 `compose`?
  說到要改造 dispatch ，讓他可以層層被包住，交給下一棒處理

比方

```ts
const store = createStore(countReducer, applyMiddleware(logger2, logger));
```

發起 dispatch 時，會執行

```rust
logger2
    |
logger
    |
dispatch(action) 本身
    |
logger
    |
logger2
```

所以 middleware 要做的是，執行並且接收下一個函式 - logger 作為參數把 action ，把執行完的結果回傳。

```ts
const logger = (store) => (next) => (action) => {
  debugger;
  console.log("logger1 dispatch", action);
  const result = next(action);
  console.log("logger1 next state", store.getState());
  return result;
};

export default logger;
```

傳遞給 middleware 的 store 內的 dispatch ，不可以是最本來的，畢竟 middleware 是中間插件，最終執行的還是 `store.dispatch`。
所以針對每個 middleware 的 dispatch 必須要改寫：

```ts
const midAPI = {
  getState: store.getState,
  dispatch: (action, ...args) => store.dispatch(action, ...args),
};
```

在 `createStore` 中，接收第二個參數，也就是擴充，讓 `enhancer` 去改寫內部的 `store.dispatch`

```ts
export default function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let currentState;
  let listeners: any[] = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    const newState = reducer(currentState, action);
    currentState = newState;
    listeners.forEach((l) => {
      l();
    });
  }

  function subscribe(listener: any) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 初始數據
  dispatch({ type: "1111" });

  return {
    getState,
    dispatch,
    subscribe,
  };
}

const store = createStore(countReducer, applyMiddleware(logger2, logger));
```

```ts
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    // const dispatch = store.dispatch;
    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };
    const midAPI = {
      getState: store.getState,
      // 改寫了 dispatch 本身！
      dispatch: (action, ...args) => dispatch(action, ...args),
    };
    const chain = middlewares.map((middleware) => middleware(midAPI));

    // 再把 store.dispatch 作為參數傳入
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
```

🌟🌟🌟 有意思的是這段

```js
const chain = middlewares.map((middleware) => middleware(midAPI));

dispatch = compose(...chain)(store.dispatch);
```

假設 `chain = [logger2, logger]`，那麼展開的結果是：

```js
dispatch = (...args) => logger2(logger(store.dispatch))(...args);
```

執行的順序是什麼呢？
分成兩段來看 `logger2(logger(store.dispatch))`、`(...args)`。
`logger(store.dispatch)` 執行完後，回傳的會是

```ts
// 從這樣
const logger = (store) => (next) => (action) => {
  console.log("logger1 dispatch", action);
  const result = next(action);
  console.log("logger1 next state", store.getState());
  return result;
};
// 變成這樣，傳入 logger2 作為參數 next 傳入
(action) => {
  console.log("logger1 dispatch", action);
  const result = next(action);
  console.log("logger1 next state", store.getState());
  return result;
};
```

所以是 `logger2(logger1回傳函式)` 再次執行，回傳了差不多的函式，再接收 `logger2回傳函式(...args)` 作為後面執行的函式，所以是 logger2 優先執行！而不是上述 `compose` 那邊的範例的執行順序
`compose(f1, f2, f3)`，執行順序是 f3 → f2 → f1。
`compose(logger2, logger)`，執行順序是 logger2 → logger。
透過 currying 把 next 保留了。

面對異步的 dispatch，如果不處理的話，進入到 reducer 會跑到 default，

```ts
store.dispatch((dispatch) => {
  console.log("??!?!?1");
  setTimeout(() => {
    dispatch({ type: "ADD" });
  }, 1000);
});
```

模擬處理，簡單寫

```ts
const thunk =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }
    return next(action);
  };
```

同樣如果是處理 promise，簡單寫

```ts
const thunk =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    return isPromise(action) ? action.then(dispatch) : next(action);
  };
```

## combineReducers

多個 reducer 時，可以分開寫再一起做處理

```ts
const store = createStore(
  combineReducers({
    count: countReducer,
    user: userReducer,
  }),
  applyMiddleware(logger2, logger, thunk)
);
```

使用時

```ts
store.getState().count;
```

```ts
export default function combineReducers(reducers) {
  return function (prevState = {}, action) {
    const nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      const reducer = reducers[key];
      nextState[key] = reducer(prevState[key], action);
      hasChanged = hasChanged || nextState[key] !== prevState[key];
    }

    // 簡單紀錄有沒有改變，返回前值或新值
    hasChanged =
      hasChanged ||
      Object.keys(nextState).length !== Object.keys(prevState).length;

    return hasChanged ? nextState : prevState;
  };
}
```
