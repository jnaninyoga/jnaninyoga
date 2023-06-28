import Lang from "../components/Lang";
import logo from "../assets/imgs/spine/logo.png"
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isMenuHidden, setIsMenuHidden] = useState(true);

  const showMenu = () => { setIsMenuHidden(false) };
  const hideMenu = () => { setIsMenuHidden(true) };

  return (
    <header className={`z-[9999] bg-yoga-white sm:px-10 px-4 h-14 sm:h-20 w-full flex justify-between items-center`}>
      <div className="sm:h-full sm:w-auto w-full flex items-center sm:justify-center justify-between sm:gap-6">
        <img className="sm:h-16 h-12" src={logo} alt="Jnanin Yoga Studio Logo" />
        <h1 className="sm:text-xl font-bold uppercase">Jnanin Yoga Studio</h1>
        <button onClick={showMenu} className="sm:hidden flex items-center justify-center text-2xl"><i className="fi fi-bs-menu-burger flex items-center justify-center"></i></button>
      </div>

      <nav className={`bg-yoga-white sm:h-full h-screen sm:w-auto w-screen sm:relative fixed z-[9999] top-0 flex items-center justify-center sm:gap-4 gap-16 sm:flex-row flex-col sm:right-auto transition-all ${isMenuHidden ? "-right-[120%]" : "right-0"}`}>
        <Link to={"/"} className="sm:h-full sm:hidden flex items-center gap-4 sm:flex-row flex-col">
          <img className="sm:h-16 h-32" src={logo} alt="Jnanin Yoga Studio Logo" />
          <h1 className="text-xl font-bold uppercase">Jnanin Yoga Studio</h1>
        </Link>
        <ul className="flex items-center text-xl font-bold gap-4 sm:flex-row flex-col">
          <li onClick={hideMenu}><Link to={"/"}>Home</Link></li>
          <li onClick={hideMenu}><Link to={"/about"}>About</Link></li>
          <li onClick={hideMenu}><Link to={"/contact"}>Contact</Link></li>
        </ul>
        <Lang className="text-xl"/>
        <button onClick={hideMenu} className="absolute top-6 right-6 text-2xl text-yoga-red sm:hidden"><i className="fi fi-bs-cross"></i></button>
      </nav>

    </header>
  )
}
