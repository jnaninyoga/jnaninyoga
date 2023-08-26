import Lang from "../components/Lang";
import logo from "../assets/imgs/spine/logo.webp"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { standardNavbar } from "../utils";
import { useActivePage, useCurrentLanguage } from "../hooks";
import { useParams } from "react-router-dom/dist";


export default function Header() {
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLanguage = useCurrentLanguage();
  const activePage = useActivePage();

  const navbar = t(`navbar`, { returnObjects: true });

  // check if navbar is an array
  const Tnavbar = () => Array.isArray(navbar) ? navbar : standardNavbar;

  // hide the navbar when scrolling down and show it when scrolling up
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    let prevScrollPos = window.pageYOffset;
    const onScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setHideNavbar(prevScrollPos < currentScrollPos);
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const activeLink = link => activePage === link.toLowerCase() ? "before:w-full text-yoga-green" : "before:w-0";

  return (
    <header className={`fixed ${hideNavbar ? '-top-[100%] opacity-0' : 'top-0 opacity-100'} z-[9999] bg-yoga-white sm:px-10 px-4 h-14 sm:h-16 w-full flex justify-between items-center transition-all duration-300`}>
      <div className="lg:h-full lg:w-auto w-full flex items-center lg:justify-center justify-between lg:gap-6">
        <Link to={"/"}>
          <img className="lg:h-14 h-12" src={logo} alt="Jnanin Yoga Studio Logo" />
        </Link>
        <h1 className="cinzel sm:text-xl font-bold uppercase">Jnanin Yoga Studio</h1>
        <button onClick={showMenu} className="lg:hidden flex items-center justify-center sm:text-3xl text-2xl"><i className="fi fi-bs-menu-burger flex items-center justify-center"></i></button>
      </div>

      <nav className={`bg-yoga-white lg:pt-0 sm:pt-0 pt-10 lg:h-full h-screen lg:w-auto w-screen lg:relative fixed z-[9999] top-0 flex items-center sm:justify-center justify-start gap-6 lg:flex-row flex-col texture-v lg:bg-none lg:before:bg-none lg:right-auto lg:left-auto ltr:lg:right-auto ltr:lg:left-auto rtl:lg:right-auto rtl:lg:left-auto transition-all ${isMenuHidden ? "ltr:-right-[120%] rtl:-left-[120%]" : "ltr:right-0 rtl:left-0"}`}>
        <Link to={"/"} className="lg:h-full lg:hidden flex items-center gap-4 lg:flex-row flex-col z-[10]">
          <img className="lg:h-14 sm:h-60 h-40" src={logo} alt="Jnanin Yoga Studio Logo" />
          <h1 className="cinzel sm:text-4xl text-2xl text-center font-bold uppercase">Jnanin Yoga Studio</h1>
        </Link>
        <ul className="flex items-center lg:gap-4 sm:gap-8 gap-4 lg:flex-row flex-col z-[40]">
          {
            Tnavbar().map((link, index) => (
              <li key={index} onClick={hideMenu}>
                <Link to={`${lang ? `/${currentLanguage.code}/` : '/'}${link.toLowerCase() === navbar[0].toLowerCase() ? "" : `${standardNavbar[index].toLowerCase()}`}`}
                className={`relative lg:text-lg sm:text-2xl text-xl font-bold transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green uppercase outline-none focus:before:w-full focus:text-yoga-green ${activeLink(standardNavbar[index].toLowerCase())}`}>
                { link.toCapitalCase() }
                </Link>
              </li>
          ))}
          <li onClick={hideMenu}>
            <Link className="yoga-btn" to={`${lang ? `/${currentLanguage.code}/` : '/'}booknow`}>{t('booknow.title')}</Link>
          </li>
          <Lang className="lg:text-xl sm:text-2xl text-xl mt-4"/>
        </ul>
        <button onClick={hideMenu} className="absolute top-6 ltr:right-6 rtl:left-6 sm:text-3xl text-2xl text-yoga-red lg:hidden"><i className="fi fi-bs-cross"></i></button>
      </nav>
    </header>
  )
}
