import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Home from "./Pages/Home/Home";
import Header from "./components/Header/Header";
import NotFound from "./Pages/NotFound/NotFound";
import Footer from "./Pages/Footer/Footer";
import SideNav from "./components/SideNav/SideNav";
import Projects from "./Pages/Projects/Projects";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import BookCall from "./Pages/BookCall/BookCall";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminLogin from "./Pages/Login/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import AdminMessageDetails from "./Pages/AdminMessageDetails/AdminMessageDetails";
import useAdminSession from "./hooks/queries/useAdminSession";

const AppRoutes = () => {
  useAdminSession();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-a-call" element={<BookCall />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/messages/:messageId" element={<AdminMessageDetails />} />
      </Route>
    </Routes>
  );
};

const PublicLayout = () => {
  const { isOpen } = useSelector((state) => state.navigation);

  return (
    <>
      <Header />
      {isOpen && <SideNav />}
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
};

export default App;
