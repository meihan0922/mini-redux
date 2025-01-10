import Test from "./pages/Test";
import ReactReduxPage from "./pages/ReactReduxPage";
import ReactReduxHookPage from "./pages/ReactReduxHookPage";

function App() {
  return (
    <div className="App">
      <ReactReduxHookPage value={123} />
    </div>
  );
}

export default App;
