import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Templates from "./Pages/Templates/Templates";
import Header from "./components/Header/Header";
import Contact from "./Pages/contact/contact";
import Footer from "./components/Footer/Footer";
import Success from "./Pages/Success/Success";
import Error from "./Pages/Error/Error";
import Playground from "./Pages/Playground/Playground";
import JoinMentorship from "./Pages/JoinMentorship/JoinMentorship";
import CourseOutline from "./Pages/CourseOutline/CourseOutline";
import { baseUrl } from "./constants/constants";
import Login from "./Pages/Login/Login";
import PrivateRoutes from "./components/PrivateRoute/PrivateRoutes";
import Users from "./Pages/users/Users";
import AboutMe from "./Pages/AboutMe/AboutMe";
import Register from "./Pages/Register/Register";
import Portal from "./Pages/Portal/Portal";
import Messages from "./Pages/Messages/Messages";
import BlogList from "./features/blog/BlogList";
import BlogPost from "./features/blog/BlogPost";

// app component
const App = () => {
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(baseUrl);
        if (!res.ok) {
          throw new Error("something went wrong. SERVER NOT CONNNECTED");
        }
        console.log({
          message: "connected to server successfully",
          url: baseUrl,
        });
      } catch (error) {
        console.log({ error: error.message });
      }
    };

    getData();
  }, []);
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<Error />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/mentorship" element={<JoinMentorship />} />
          <Route path="/course-outline" element={<CourseOutline />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="about-me" element={<AboutMe />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/templates" element={<Templates />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/users" element={<Users />} />
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
