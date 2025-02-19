import LoginService from "src/service/login";
import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_SAGA,
  REQUEST,
} from "src/store/loginReducer";
// import { put, call, takeEvery, take } from "redux-saga/effects";
import { put, call, take, fork } from "@mini/saga/effects";

function* loginHandler(action) {
  yield put({ type: REQUEST });
  try {
    // 異步操作 call
    // 狀態更新 put(dispatch)
    // 做監聽 take
    const res1 = yield call(LoginService.login, action.payload);
    const res2 = yield call(LoginService.getMoreUserInfo, res1);
    yield put({ type: LOGIN_SUCCESS, payload: res2 });
  } catch (err) {
    yield put({ type: LOGIN_FAILURE, payload: err });
  }
}

// 監聽
export function* loginSaga() {
  // yield takeEvery(LOGOUT_SAGA, loginHandler);
  // 與下面相等
  while (true) {
    const action = yield take(LOGOUT_SAGA);
    // 使用 call 下面就阻塞了，除非改用 fork
    yield fork(loginHandler, action);
  }
}
