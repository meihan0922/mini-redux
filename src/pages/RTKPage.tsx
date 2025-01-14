// import store from "../store/rtkStore";
import { useDispatch, useSelector } from "../mini-react-redux";
import { increment } from "../store/counterReducer";

export default function RTKPage(props) {
  //   const count = store.getState().counter.count;
  // const dispatch = store.dispatch
  const count = useSelector(({ counter: { count } }) => count);
  const dispatch = useDispatch();

  return (
    <div>
      RTKPage
      {count}
      <button onClick={() => dispatch(increment())}>change</button>
    </div>
  );
}
