import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Header from "./components/Header/Header";
import SideNav from "./components/SideNav/SideNav";
import { PageMeta } from "./components/Studio/Studio";
import Footer from "./Pages/Footer/Footer";
import Home from "./Pages/Home/Home";
import Services from "./Pages/Services/Services";
import Work from "./Pages/Work/Work";
import EngineeringSystems from "./Pages/EngineeringSystems/EngineeringSystems";
import AiWorkflowAudit from "./Pages/AiWorkflowAudit/AiWorkflowAudit";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import BookCall from "./Pages/BookCall/BookCall";
import NewsletterVerify from "./Pages/NewsletterVerify/NewsletterVerify";
import Blog from "./Pages/Blog/Blog";
import BlogArticle from "./Pages/BlogArticle/BlogArticle";
import NotFound from "./Pages/NotFound/NotFound";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminLogin from "./Pages/Login/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import AdminMessageDetails from "./Pages/AdminMessageDetails/AdminMessageDetails";
import useAdminSession from "./hooks/queries/useAdminSession";

export const AppRoutes = () => {
  useAdminSession();

  return (
    <>
      <PageMeta />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/engineering-systems" element={<EngineeringSystems />} />
          <Route path="/ai-workflow-audit" element={<AiWorkflowAudit />} />
          <Route path="/products" element={<Navigate to="/work" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-a-call" element={<BookCall />} />
          <Route path="/newsletter/verify" element={<NewsletterVerify />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/projects" element={<Navigate to="/work" replace />} />
          <Route path="/templates" element={<Navigate to="/engineering-systems" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/messages/:messageId" element={<AdminMessageDetails />} />
          </Route>
        </Route>
      </Routes>
    </>
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

const App = () => (
  <Router>
    <ScrollToTop />
    <AppRoutes />
  </Router>
);

export default App;
