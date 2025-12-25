import { useEffect, useState } from "react";
import { baseUrl } from "./constants/constants";
import useHealth from "./hooks/useHealth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import NotFound from "./Pages/NotFound/NotFound";
import Footer from "./Pages/Footer/Footer";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SideNav from "./components/SideNav/SideNav";
import { useSelector } from "react-redux";
import Projects from "./Pages/Projects/Projects";
import Playground from "./Pages/Playground/Playground";

const App = () => {
  const { data } = useHealth();
  const { isOpen } = useSelector((state) => state.navigation);
  return (
    <Router>
      <Header />
      {isOpen && <SideNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/playground" element={<Playground />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
