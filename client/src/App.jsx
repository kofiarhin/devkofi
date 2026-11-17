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
import AiIntegration from "./Pages/AiIntegration/AiIntegration";
import Mentorship from "./Pages/Mentorship/Mentorship";
import Work from "./Pages/Work/Work";
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
import { legacyRedirects } from "./constants/seo";

export const AppRoutes = () => {
  useAdminSession();

  return (
    <>
      <PageMeta />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ai-integration" element={<AiIntegration />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-a-call" element={<BookCall />} />
          <Route path="/newsletter/verify" element={<NewsletterVerify />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          {Object.entries(legacyRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
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
