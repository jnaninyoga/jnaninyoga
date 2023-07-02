import Lang from "../components/Lang";
import logo from "../assets/imgs/spine/logo.png"
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isMenuHidden, setIsMenuHidden] = useState(true);

  const showMenu = () => { 
    setIsMenuHidden(false)
    // PREVENT SCROLLING
    document.body.style.overflow = "hidden";
  };
  const hideMenu = () => { 
    setIsMenuHidden(true) 
    // ALLOW SCROLLING
    document.body.style.overflow = "auto";
  };
  const activePage = link => window.location.pathname.toLowerCase() === link.toLowerCase() ? "before:w-full text-yoga-green" : "before:w-0";

  return (
    <header className={`fixed z-[9999] bg-yoga-white sm:px-10 px-4 h-14 sm:h-20 w-full flex justify-between items-center`}>
      <div className="sm:h-full sm:w-auto w-full flex items-center sm:justify-center justify-between sm:gap-6">
        <img className="sm:h-16 h-12" src={logo} alt="Jnanin Yoga Studio Logo" />
        <h1 className="cinzel sm:text-xl font-bold uppercase">Jnanin Yoga Studio</h1>
        <button onClick={showMenu} className="sm:hidden flex items-center justify-center text-2xl"><i className="fi fi-bs-menu-burger flex items-center justify-center"></i></button>
      </div>

      <nav className={`bg-yoga-white sm:pt-0 pt-16 sm:h-full h-screen sm:w-auto w-screen sm:relative fixed z-[9999] top-0 flex items-center sm:justify-center justify-start sm:gap-4 gap-14 sm:flex-row flex-col texture-v sm:bg-none sm:before:bg-none sm:right-auto transition-all ${isMenuHidden ? "-right-[120%]" : "right-0"}`}>
        <Link to={"/"} className="sm:h-full sm:hidden flex items-center gap-4 sm:flex-row flex-col">
          <img className="sm:h-16 h-40" src={logo} alt="Jnanin Yoga Studio Logo" />
          <h1 className="cinzel text-2xl text-center font-bold uppercase">Jnanin Yoga Studio</h1>
        </Link>
        <ul className="flex items-center sm:text-xl text-2xl font-bold gap-4 sm:flex-row flex-col">
          <li onClick={hideMenu} className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green ${activePage("/")}`}><Link to={"/"}>Home</Link></li>
          <li onClick={hideMenu} className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green ${activePage("/about")}`}><Link to={"/about"}>About</Link></li>
          <li onClick={hideMenu} className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green ${activePage("/contact")}`}><Link to={"/contact"}>Contact</Link></li>
          <Lang className="text-xl"/>
        </ul>
        <button onClick={hideMenu} className="absolute top-6 right-6 text-2xl text-yoga-red sm:hidden"><i className="fi fi-bs-cross"></i></button>
      </nav>

    </header>
  )
}
