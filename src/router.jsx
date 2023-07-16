import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/client/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Classes from "./pages/Classes";
import NotFound from "./layouts/404";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/classes" element={<Classes />} />
        {/* Pages localization path */}
        <Route path="/:lang" element={<Home />} index />
        <Route path="/:lang/about" element={<About />} />
        <Route path="/:lang/contact" element={<Contact />} />
        <Route path="/:lang/classes" element={<Classes />} />
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

