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
import { useEffect } from "react";
import { baseUrl } from "./constants/constants";
// app component
const App = () => {
  useEffect(() => {
    const info = async () => {
      try {
        const url = import.meta.env.DEV ? "http://localhost:5000" : baseUrl;
        const res = await fetch("http://localhost:5000");
      } catch (error) {
        console.log(error.message);
      }
    };
    info();
  }, []);
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
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
