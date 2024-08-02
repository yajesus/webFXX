import React, { useState } from "react";
import Home from "./components/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import Event from "./pages/Event";
import Layout from "./components/Layout";
import Withdrawal from "./pages/Withdrawal";
import Invitation from "./pages/Invitation";
import Company from "./pages/Company";
import TC from "./pages/TC";
import Profile from "./pages/Profile";
import BindWallet from "./pages/profilepages/BindWallet";
import Team from "./pages/profilepages/Team";
import ChangePass from "./pages/profilepages/ChangePass";
import Login from "./pages/mainpage/Login";
import Register from "./pages/mainpage/Register";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="overflow-y-visible">
      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/"
          element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}
        >
          <Route
            index
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />

          <Route path="/event" element={<Event />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/invitation" element={<Invitation />} />
          <Route path="/company" element={<Company />} />
          <Route path="/Tc" element={<TC />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Wallet" element={<BindWallet />} />
          <Route path="/Team" element={<Team />} />
          <Route path="/Changepass" element={<ChangePass />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
