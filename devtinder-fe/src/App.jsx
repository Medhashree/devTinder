import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import Footer from "./components/Footer";


function App() {

  return (
    <>
      <Header />

      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}> 
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Footer />
    </>
  );
}

export default App;
