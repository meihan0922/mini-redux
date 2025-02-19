import { MATCH } from "./symbol";

export function stdChannel() {
  const currentTakers = [];
  // matcher 為一個函式：表示是否對應相同的key，方便 put 條件句判斷
  // cb 是 next 函式
  function take(cb, matcher) {
    cb[MATCH] = matcher;
    currentTakers.push(cb);
  }

  function put(action) {
    const takers = currentTakers;
    // takers.length 是動態的，要先取好，避免陷入無限循環
    for (let i = 0, len = takers.length; i < len; i++) {
      const taker = takers[i];
      if (taker[MATCH](action)) {
        console.log("put 執行，take 原停住的流程所在的地方 下一個 next");
        taker(action);
      }
    }
  }

  return { take, put };
}
