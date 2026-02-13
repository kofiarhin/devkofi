import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import useHealth from "./hooks/useHealth";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import NotFound from "./Pages/NotFound/NotFound";
import Footer from "./Pages/Footer/Footer";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SideNav from "./components/SideNav/SideNav";
import Projects from "./Pages/Projects/Projects";
import Playground from "./Pages/Playground/Playground";
import About from "./Pages/About/About";
import PricingPage from "./Pages/Pricing/Pricing";

import Join from "./Pages/Join/Join";
import Enterprise from "./Pages/Enterprise/Enterprise";

import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminUsers from "./Pages/Dashboard/AdminUsers/AdminUsers";

const App = () => {
  useHealth();
  const { isOpen } = useSelector((state) => state.navigation);

  return (
    <Router>
      <ScrollToTop />

      <Header />
      {isOpen && <SideNav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/playground" element={<Playground />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/join/:planSlug" element={<Join />} />
          <Route path="/enterprise" element={<Enterprise />} />

          <Route element={<AdminRoute />}>
            <Route path="/dashboard/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
