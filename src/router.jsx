import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/client/Home";
import About from "./pages/client/About";
import Contact from "./pages/client/Contact";
import Classes from "./pages/client/Classes";
import NotFound from "./layouts/404";
import Auth from "./pages/admin/Auth";
import Dashboard from "./pages/admin/Dashboard";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home />} index />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/classes" element={<Classes />} />
        {/* Client Pages localization path */}
        <Route path="/:lang" element={<Home />} index />
        <Route path="/:lang/about" element={<About />} />
        <Route path="/:lang/contact" element={<Contact />} />
        <Route path="/:lang/classes" element={<Classes />} />

        {/* Admin Routes */}
        <Route path="/lotus/login" element={<Auth />} />
        <Route path="/lotus" element={<Dashboard />} />
        {/* Admin Pages localization path */}
        <Route path="/lotus/:lang/login" element={<Auth />} />
        <Route path="/lotus/:lang" element={<Dashboard />} />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

