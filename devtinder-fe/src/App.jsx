// import { useState } from "react";
// import "./App.css";
// import Header from "./components/Header";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import SignIn from "./components/pages/SignIn";
// import Login from "./components/pages/Login";
// import Profile from "./components/pages/Profile";
// import Footer from "./components/Footer";
// import { Provider } from "react-redux";
// import appStore from "./utils/appStore";
// import Dashboard from "./components/pages/Dashboard";
// import { useLocation } from "react-router-dom";

// function App() {
//   const location = useLocation();
//   const centeredRoutes = ["/", "/login", "/profile"]; // only these pages are centered

//   const isCentered = centeredRoutes.includes(location.pathname);

//   return (
//     <Provider store={appStore}>
//       <div className="flex flex-col min-h-screen">
//         <BrowserRouter basename="/">
//           <Header />

//           <main className={`flex-1 ${isCentered ? "flex items-center justify-center" : ""}`}>
//             <Routes>
//               <Route path="/" element={<SignIn />} />
//               <Route path="login" element={<Login />} />
//               <Route path="profile" element={<Profile />} />
//               <Route path="feed" element={<Dashboard />} />
//             </Routes>
//           </main>

//           <Footer />
//         </BrowserRouter>
//       </div>
//     </Provider>
//   );
// }

// export default App;



import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import appStore from "./utils/appStore";
import RouterLayout from "./components/RouterLayout";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <RouterLayout />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
