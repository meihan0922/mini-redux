import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useDispatch, useSelector } from "@mini/react-redux";

export default function ReactReduxHookPage({ value }) {
  const dispatch = useDispatch();
  const add = useCallback(() => {
    dispatch({ type: "ADD" });
  }, [dispatch]);
  const count = useSelector(({ count }) => count);

  return (
    <div>
      ReactReduxHookPage
      {count}
      <button onClick={add}>change</button>
    </div>
  );
}
