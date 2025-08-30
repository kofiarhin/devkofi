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
import AboutMe from "./Pages/AboutMe/AboutMe";
import Register from "./Pages/Register/Register";
import Portal from "./Pages/Portal/Portal";

// app component
const App = () => {
  return (
    <div>
      <Router>
        {/* <Header /> */}
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
          <Route path="about-me" element={<AboutMe />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/templates" element={<Templates />} />
            <Route path="/portal" element={<Portal />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
