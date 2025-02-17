// import Test from "./pages/Test";
// import ReactReduxPage from "./pages/ReactReduxPage";
// import ReactReduxHookPage from "./pages/ReactReduxHookPage";
// import RTKPage from "./pages/RTKPage";
import {
  Link,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import RequiredAuth from "./auth/RequiredAuth";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="user"
              element={
                <RequiredAuth>
                  <UserPage />
                </RequiredAuth>
              }
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

function Layout(props) {
  return (
    <div className="border">
      <Link to="/">首頁</Link>
      <Link to="/user">用戶中心</Link>
      <Link to="/about">關於</Link>
      <Outlet />
    </div>
  );
}

function Home() {
  return <div>Home</div>;
}

function NoMatch() {
  return <div>❌ NoMatch</div>;
}

export default App;
