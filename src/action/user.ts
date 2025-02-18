import LoginService from "src/service/login";
import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_SAGA,
  LOGOUT_SUCCESS,
  REQUEST,
} from "../store/loginReducer";

// export const getMoreUserInfo = (dispatch, userInfo) => {
//   LoginService.getMoreUserInfo(userInfo).then(
//     (res) => {
//       dispatch({ type: LOGIN_SUCCESS, payload: res });
//     },
//     (err) => {
//       dispatch({ type: LOGIN_FAILURE, payload: err });
//     }
//   );
// };

// export const login = (payload: any) => (dispatch) => {
//   dispatch({ type: REQUEST });
//   // 確保前後關係
//   LoginService.login(payload).then(
//     (res) => {
//       getMoreUserInfo(dispatch, res);
//     },
//     (err) => {
//       dispatch({ type: LOGIN_FAILURE, payload: err });
//     }
//   );
// };

export const login = (userInfo) => {
  return { type: LOGOUT_SAGA, payload: userInfo };
};

export const logout = () => ({ type: LOGOUT_SUCCESS });
