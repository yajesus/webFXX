import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Event from "./pages/Event";
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
import FAQ from "./pages/FAQ";
import Customerservice from "./pages/profilepages/Customerservice";
import PrivateRoute from "./components/PrivateRoute";
import AdminLogin from "./pages/Adminpage/Admin";
import AdminDashboard from "./components/AdminDashboard";
import NotFound from "./pages/NotFound";
import AddEvent from "./pages/Admin dashboard page/AddEvent";
import AddProduct from "./pages/Admin dashboard page/AddProduct";
import Products from "./pages/Products";
import Edituserbalance from "./pages/Admin dashboard page/Edituserbalance";
import GenerateInviteCode from "./pages/Admin dashboard page/Generatecode";
import Transaction from "../src/pages/profilepages/Transaction";
import Approvewidthdrwal from "./pages/Admin dashboard page/Approvewidthdrwal";
import Notifications from "./pages/profilepages/Notifications";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Add state for admin check

  return (
    <div className="overflow-y-visible">
      <Routes>
        <Route
          path="/admin/login"
          element={<AdminLogin setIsAdmin={setIsAdmin} />}
        />
        <Route
          path="/admin/dashboard"
          element={
            isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/admin/dashboard/addevent"
          element={isAdmin ? <AddEvent /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/dashboard/addproduct"
          element={isAdmin ? <AddProduct /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/dashboard/edituserbalance"
          element={
            isAdmin ? <Edituserbalance /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/admin/dashboard/Generatecode"
          element={
            isAdmin ? <GenerateInviteCode /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/admin/dashboard/Approvewithdrwal"
          element={
            isAdmin ? <Approvewidthdrwal /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />
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
          <Route path="/tc" element={<TC />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wallet" element={<BindWallet />} />
          <Route path="/team" element={<Team />} />
          <Route path="/changepass" element={<ChangePass />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/customerservice" element={<Customerservice />} />
          <Route path="/products" element={<Products />} />
          <Route path="/Transaction" element={<Transaction />} />
          <Route path="/Notification" element={<Notifications />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
