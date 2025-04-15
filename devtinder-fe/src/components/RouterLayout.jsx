import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";


function RouterLayout() {
  const location = useLocation();
  const centeredRoutes = ["/", "/login", "/profile"];
  const isCentered = centeredRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className={`flex-1 ${isCentered ? "flex items-center justify-center" : ""}`}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="feed" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default RouterLayout;
