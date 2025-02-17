// import { createSlice } from "@reduxjs/toolkit";
import { createSlice } from "@mini/redux-toolkit/index";

const counterSlice = createSlice({
  name: "count",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      // 因為使用了 Immer.js 所以可以直接修改狀態，
      // 實際上狀態並沒有發生改變，Immer 檢查到變化，產生一種新的不可改變的狀態
      state.count += 1;
    },
  },
});

console.log("counterSlice.actions", counterSlice.reducer);
export const { increment } = counterSlice.actions;
export default counterSlice.reducer;
