import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import LoginGuard from "./LogInGuard";
import Settings from "./pages/Settings";
import Connections from "./pages/Connections";
import ConnectionProfileView from "./pages/ConnectionProfileView";
import CreateAccount from "./pages/CreateAccount";

function RouterLayout() {
  const location = useLocation();
  const centeredRoutes = ["/", "/login", "/profile"];
  const isCentered = centeredRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main
        className={`flex-1 ${
          isCentered ? "flex items-center justify-center" : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="login" element={<Login />} />
          <Route
            path="profile"
            element={
              <LoginGuard>
                <Profile />
              </LoginGuard>
            }
          />
          <Route
            path="feed"
            element={
              <LoginGuard>
                <Dashboard />
              </LoginGuard>
            }
          />
          <Route
            path="settings"
            element={
              <LoginGuard>
                <Settings />
              </LoginGuard>
            }
          />
          <Route
            path="connections"
            element={
              <LoginGuard>
                <Connections />
              </LoginGuard>
            }
          />

          <Route
            path="profile/:requestId/:userId"
            element={
              <LoginGuard>
                <ConnectionProfileView />
              </LoginGuard>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default RouterLayout;
