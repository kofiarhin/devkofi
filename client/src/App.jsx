import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Templates from "./Pages/Templates/Templates";
import Header from "./components/Header/Header";
import Contact from "./Pages/contact/contact";
import Footer from "./components/Footer/Footer";
import Success from "./Pages/Success/Success";
import Error from "./Pages/Error/Error";
import Playground from "./Pages/Playground/Playground";
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
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
