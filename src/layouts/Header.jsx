import Lang from "../components/Lang";
import logo from "../assets/imgs/spine/logo.webp"
import "handyscript/lib/string";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { standardNavbar } from "../utils";


export default function Header() {
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { t } = useTranslation();
  const navbar = t(`navbar`, { returnObjects: true });

  // check if navbar is an array
  const Tnavbar = () => Array.isArray(navbar) ? navbar : standardNavbar;

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
    <header className={`fixed z-[9999] bg-yoga-white sm:px-10 px-4 h-14 sm:h-16 w-full flex justify-between items-center`}>
      <div className="sm:h-full sm:w-auto w-full flex items-center sm:justify-center justify-between sm:gap-6">
        <Link to={"/"}>
          <img className="sm:h-14 h-12" src={logo} alt="Jnanin Yoga Studio Logo" />
        </Link>
        <h1 className="cinzel sm:text-xl font-bold uppercase">Jnanin Yoga Studio</h1>
        <button onClick={showMenu} className="sm:hidden flex items-center justify-center text-2xl"><i className="fi fi-bs-menu-burger flex items-center justify-center"></i></button>
      </div>

      <nav className={`bg-yoga-white sm:pt-0 pt-8 sm:h-full h-screen sm:w-auto w-screen sm:relative fixed z-[9999] top-0 flex items-center sm:justify-center justify-start sm:gap-6 gap-6 sm:flex-row flex-col texture-v sm:bg-none sm:before:bg-none sm:right-auto sm:left-auto ltr:sm:right-auto ltr:sm:left-auto rtl:sm:right-auto rtl:sm:left-auto transition-all ${isMenuHidden ? "ltr:-right-[120%] rtl:-left-[120%]" : "ltr:right-0 rtl:left-0"}`}>
        <Link to={"/"} className="sm:h-full sm:hidden flex items-center gap-4 sm:flex-row flex-col">
          <img className="sm:h-14 h-40" src={logo} alt="Jnanin Yoga Studio Logo" />
          <h1 className="cinzel text-2xl text-center font-bold uppercase">Jnanin Yoga Studio</h1>
        </Link>
        <ul className="flex items-center sm:text-lg text-xl font-bold gap-4 sm:flex-row flex-col">
          {
            Tnavbar().map((link, index) => (
              <li key={index} onClick={hideMenu}>
                <Link to={link.toLowerCase() === navbar[0].toLowerCase() ? "/" : `/${standardNavbar[index].toLowerCase()}`} 
                className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green uppercase outline-none focus:before:w-full focus:text-yoga-green ${activePage(link.toLowerCase() === navbar[0].toLowerCase() ? "/" : `/${standardNavbar[index].toLowerCase()}`)}`}>
                { link.toCapitalCase() }
                </Link>
              </li>
          ))}
          <Lang className="text-xl mt-4"/>
        </ul>
        <button onClick={hideMenu} className="absolute top-6 ltr:right-6 rtl:left-6 text-2xl text-yoga-red sm:hidden"><i className="fi fi-bs-cross"></i></button>
      </nav>
    </header>
  )
}
