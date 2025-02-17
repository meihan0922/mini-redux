import { useNavigate } from "react-router-dom";
import { logout } from "../action/user";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "src/hooks";

function UserPage() {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(({ user }) => user);

  return (
    <div>
      <h1>UserPage: {user.userInfo.username}</h1>
      <button onClick={() => dispatch(logout())}>logout</button>
      <p>{user.userInfo.score}</p>
    </div>
  );
}

export default UserPage;
