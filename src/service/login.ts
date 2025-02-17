const LoginService = {
  login(userInfo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userInfo.username === "小明") {
          resolve({ id: 123, username: "小明" });
        } else {
          reject({ err: { msg: "用戶或密碼錯誤" } });
        }
      }, 1000);
    });
  },
  getMoreUserInfo(userInfo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userInfo.id === 123) {
          resolve({ ...userInfo, score: "100" });
        } else {
          reject({ err: { msg: "獲取詳情錯誤" } });
        }
      }, 1000);
    });
  },
};

export default LoginService;
