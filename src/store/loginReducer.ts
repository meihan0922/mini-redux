const userInit = {
  isLogin: false,
  userInfo: { id: null, username: "", score: 0 },
  loading: false,
  err: { msg: "" },
};
export type RootState = typeof userInit;
export const REQUEST = "REQUEST";
export const ADD = "ADD";
export const MINUS = "MINUS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_SAGA = "LOGOUT_SAGA";

export const loginReducer: (
  state: RootState,
  action: { type: string; payload: any }
) => typeof userInit = (state = { ...userInit }, { type, payload }) => {
  switch (type) {
    case REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLogin: true,
        loading: false,
        userInfo: { ...payload },
      };
    case LOGIN_FAILURE:
      return { ...state, ...userInit, ...payload };
    case LOGOUT_SUCCESS:
      return { ...userInit, isLogin: false, loading: false };
    default:
      return state;
  }
};
