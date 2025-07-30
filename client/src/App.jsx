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
import Dashboard from "./Pages/Dashboard/DAshboard";
import { useEffect } from "react";
import { baseUrl } from "./constants/constants";
import Login from "./Pages/Login/Login";
// app component
const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<Error />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/mentorship" element={<JoinMentorship />} />
          <Route path="/course-outline" element={<CourseOutline />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
