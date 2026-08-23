import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
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
import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminLogin from "./Pages/Login/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import AdminMessageDetails from "./Pages/AdminMessageDetails/AdminMessageDetails";
import useAdminSession from "./hooks/queries/useAdminSession";
import Templates from "./Pages/Templates/Templates";
import NewsletterVerify from "./Pages/NewsletterVerify/NewsletterVerify";
import Services from "./Pages/Services/Services";
import Journal from "./Pages/Journal/Journal";

export const AppRoutes = () => {
  useAdminSession();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Projects />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/lab" element={<Templates />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/start-a-project" element={<Contact />} />
        <Route path="/projects" element={<Navigate to="/work" replace />} />
        <Route path="/templates" element={<Navigate to="/lab" replace />} />
        <Route path="/contact" element={<Navigate to="/start-a-project" replace />} />
        <Route path="/book-a-call" element={<Navigate to="/start-a-project" replace />} />
        <Route path="/newsletter/verify" element={<NewsletterVerify />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/messages/:messageId"
            element={<AdminMessageDetails />}
          />
        </Route>
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

const AdminLayout = () => {
  const { isOpen } = useSelector((state) => state.navigation);

  return (
    <>
      <Header />
      {isOpen && <SideNav />}
      <Outlet />
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
