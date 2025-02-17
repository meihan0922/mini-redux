import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { login } from "../action/user";
import LoginService from "src/service/login";
import { useAppDispatch, useAppSelector } from "src/hooks";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(({ user }) => user);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const submit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    dispatch(login({ username }));
  };

  if (user.isLogin) {
    return <Navigate to={from} replace />;
  }

  return (
    <div>
      <h1>LoginPage</h1>
      <form onSubmit={submit}>
        <input type="text" name="username" />
        <button type="submit">{user.loading ? "loading..." : "login"}</button>
      </form>
      <p>{user.err.msg}</p>
    </div>
  );
}
