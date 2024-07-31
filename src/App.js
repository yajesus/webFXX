import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import { Route, Routes } from "react-router-dom";
import Event from "./pages/Event";
const App = () => {
  return (
    <div>
      <Header />
      <Main />
      <Routes>
        <Route path="/event" element={<Event />} />
      </Routes>
    </div>
  );
};

export default App;
