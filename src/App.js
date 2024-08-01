import React from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Event from "./pages/Event";
import Layout from "./components/Layout";
import Withdrawal from "./pages/Withdrawal";
import Invitation from "./pages/Invitation";
import Company from "./pages/Company";
import TC from "./pages/TC";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/invitation" element={<Invitation />} />
          <Route path="/company" element={<Company />} />
          <Route path="/Tc" element={<TC />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
