import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/client/Home";
import About from "./pages/client/About";
import Contact from "./pages/client/Contact";
import Classes from "./pages/client/Classes";
import NotFound from "./layouts/global/404";
import Auth from "./pages/admin/Auth";
import Dashboard from "./pages/admin/Dashboard";
import BookNow from "./pages/client/BookNow";
import Error from "./layouts/global/Error";

const router = [
  // Home page & localization path
  {
    path: "/",
    element: <Home />,
    index: true,
    errorElement: <Error/>
  },
  {
    path: "/:lang",
    element: <Home />,
    index: true,
    errorElement: <Error/>
  },
  // About page & localization path
  {
    path: "/about",
    element: <About />,
    errorElement: <Error/>
  },
  {
    path: "/:lang/about",
    element: <About />,
    errorElement: <Error/>
  },
  // Contact page & localization path
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <Error/>
  },
  {
    path: "/:lang/contact",
    element: <Contact />,
    errorElement: <Error/>
  },
  // Classes page & localization path
  {
    path: "/classes",
    element: <Classes />,
    errorElement: <Error/>
  },
  {
    path: "/:lang/classes",
    element: <Classes />,
    errorElement: <Error/>
  },
  // BookNow page & localization path
  {
    path: "/booknow",
    element: <BookNow />,
    errorElement: <Error/>
  },
  {
    path: "/:lang/booknow",
    element: <BookNow />, 
    errorElement: <Error/>
  },
  //----------- Admin Routes ------------//
  // Login page & localization path
  {
    path: "/lotus/login",
    element: <Auth />,
    errorElement: <Error/>
  },
  {
    path: "/lotus/:lang/login",
    element: <Auth />,
    errorElement: <Error/>
  },
  // Dashboard page & localization path
  {
    path: "/lotus",
    element: <Dashboard />,
    errorElement: <Error/>
  },
  {
    path: "/lotus/:board",
    element: <Dashboard />,
    errorElement: <Error/>
  },
  //-------- 404- Not Found Error -------//
  {
    path: "*",
    element: <NotFound />,
    errorElement: <Error/>
  },
]

export default function Router() {
  return (
    <RouterProvider router={createBrowserRouter(router)}/>
  )
}

