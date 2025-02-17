import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import { bindActionCreators } from "../redux";

type Store = {
  getState: () => any;
  dispatch: (action: any) => void;
  subscribe: (listener: any) => () => void;
};

const Context = createContext<Store>(null);

export function Provider({
  store,
  children,
}: {
  store: Store;
  children: ReactNode;
}) {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export const connect =
  (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => (props) => {
    const context = useContext(Context);
    const { dispatch, getState, subscribe } = context;
    let state = useSyncExternalStore(subscribe, getState);
    if (typeof mapStateToProps === "function") {
      state = mapStateToProps(state);
    }
    let dispatchProps: Object = { dispatch };
    if (typeof mapDispatchToProps === "function") {
      dispatchProps = mapDispatchToProps(dispatch);
    } else if (typeof mapDispatchToProps === "object") {
      dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
    }

    // const forceUpdate = useForceUpdate();

    // 因為 useEffect 有延遲，如果更新發生在延遲之前，就會漏掉更新
    // 像是 mini-antD-form 一樣（可以跳過去看
    // useLayoutEffect(() => {
    //   const unsubscribe = subscribe(() => forceUpdate());
    //   return () => unsubscribe();
    // }, [subscribe]);

    return <WrappedComponent {...props} {...state} {...dispatchProps} />;
  };

function useForceUpdate() {
  const [, setState] = useState(0);

  const update = useCallback(() => {
    setState((prev) => prev + 1);
  }, []);

  return update;
}

export function useSelector(selector) {
  const store = useContext(Context);
  const { getState, subscribe } = store;

  //   const forceUpdate = useForceUpdate();

  //   useLayoutEffect(() => {
  //     const unsubscribe = subscribe(() => forceUpdate());
  //     return () => unsubscribe();
  //   }, [subscribe, forceUpdate]);

  const state = useSyncExternalStore(subscribe, getState);
  let selectedState = selector(state);

  return selectedState;
}

export function useDispatch() {
  const store = useContext(Context);
  const { dispatch } = store;

  return dispatch;
}
