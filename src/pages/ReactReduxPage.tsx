import { Component, ReactNode } from "react";
import { connect } from "@mini/react-redux";
import { bindActionCreators } from "@mini/redux";

export default connect(
  ({ count }) => ({ count }),
  //   (dispatch) => {
  //     let creators: Object = {
  //       add: () => ({ type: "ADD" }),
  //     };
  //     creators = bindActionCreators(creators, dispatch);
  //     return { dispatch, ...creators };
  //   }
  {
    add: () => ({ type: "ADD" }),
  }
)(
  class ReactReduxPage extends Component<{ count: number; add: () => void }> {
    render(): ReactNode {
      const { count, add } = this.props;
      return (
        <div>
          ReactReduxPage
          {count}
          <button onClick={add}>change</button>
        </div>
      );
    }
  }
);
