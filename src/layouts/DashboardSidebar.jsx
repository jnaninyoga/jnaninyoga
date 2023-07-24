import "handyscript/lib/string";
import logo from "../assets/imgs/spine/logo.webp";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { dashboardNavbar, dashboardNavicons, supportedLanguages } from "../utils";
import { Link } from "react-router-dom";
import { useCurrentLanguage } from "../hooks";
import { changeLanguage } from 'i18next';
import PropTypes from "prop-types";

DashboardSidebar.propTypes = {
    board: PropTypes.array.isRequired
};

export default function DashboardSidebar({board}) {
    const [activeBoard, setActiveBoard] = board;
    const [isMenuHidden, setIsMenuHidden] = useState(true);

    const currentLang = useCurrentLanguage();

    const { t } = useTranslation();
    const dashboardnavbar = t(`dashboardNavbar`, { returnObjects: true });

    const dashboardSidebar = useRef(null);

    // check if navbar is an array
    const Tnavbar = () => Array.isArray(dashboardnavbar) ? dashboardnavbar : dashboardNavbar;

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

    // hide menu when clicked outside
    const hideWhenClickOutside = e => {
        if (dashboardSidebar.current && e.target.id !== 'toggleDashboardSidebar' && !dashboardSidebar.current.contains(e.target)) {
            setIsMenuHidden(true);
        }
    }

    useEffect(() => {
        if (isMenuHidden) return;
        window.addEventListener('click', hideWhenClickOutside);
        return () => window.removeEventListener('click', hideWhenClickOutside);
    }, [isMenuHidden]);

  return (
    <aside className={`lg:w-1/5 w-screen h-screen lg:h-auto z-[9999] before:absolute before:h-screen before:w-screen before:pointer-events-none ${isMenuHidden ? "before:bg-none" : "before:bg-black before:bg-opacity-40 before:backdrop-blur-[2px]"} lg:bg-none flex flex-col transition-all duration-300`}>
        <div className={`lg:hidden py-2 px-6 w-screen flex justify-between items-center bg-yoga-white`}>
            <button id="toggleDashboardSidebar" onClick={showMenu} className={`flex items-center justify-center sm:text-3xl text-2xl`}><i id="toggleDashboardSidebar" className="fi fi-bs-bars-staggered flex items-center justify-center"></i></button>
            <img className="h-12" src={logo} alt="Jnanin Yoga Studio Logo" />
        </div>

        <nav ref={dashboardSidebar} id="dashboardsidebar" className={`z-[9999] lg:relative fixed p-4 h-screen lg:w-full w-[70%] max-w-sm flex items-center flex-col gap-5 bg-yoga-white transition-all lg:left-0 ${isMenuHidden ? "-left-[120%] lg:left-0" : "left-0"}`}>
            <div className={`w-full flex items-center justify-center flex-col gap-2`}>
                <Link to={"/"}><img className="h-16" src={logo} alt="Jnanin Yoga Studio Logo" /></Link>
                <h1 className="cinzel uppercase font-bold sm:text-xl text-lg text-center">Jnanin Yoga Studio</h1>
            </div>

            <ul className="w-full flex items-center flex-col">
            {
                Tnavbar().map((link, index) => (
                <li key={index} onClick={() => { hideMenu(); setActiveBoard(dashboardNavbar[index].toLowerCase()); }} className={`w-full text-lg sm:text-xl px-4 py-2 flex items-center ${currentLang.dir === "rtl" ? "flex-row-reverse" : "flex-row"} gap-4 group  outline outline-2 -outline-offset-[5px] outline-none hover:outline-white hover:bg-yoga-red-ligth ${activeBoard.toLowerCase() === dashboardNavbar[index].toLowerCase() ?  "bg-yoga-red-ligth outline-white" : ''} transition-all duration-300 cursor-pointer`}>
                    <i className={`flex items-center ${Object.values(dashboardNavicons)[index]} transition-all group-hover:text-yoga-green-dark ${activeBoard.toLowerCase() === dashboardNavbar[index].toLowerCase() ?  "text-yoga-green-dark" : ''}`}></i>
                    <button className={`text-center font-medium capitalize`}>{ link }</button>
                </li>
            ))}
            </ul>
            <ul className="w-full flex items-center flex-col">
                {
                    supportedLanguages.map((lang, i) => (
                        <li key={i} title={lang.name} onClick={() => { hideMenu(); changeLanguage(lang.code) }} className={`w-full text-lg sm:text-xl px-4 py-2 flex items-center ${currentLang.dir === "rtl" ? "flex-row-reverse" : "flex-row"} gap-4 group outline outline-2 -outline-offset-[5px] outline-none hover:outline-white hover:bg-yoga-red-ligth hover:text-yoga-green-dark ${lang.code === currentLang.code ?  "bg-yoga-red-ligth text-yoga-green-dark outline-white" : ''} transition-all duration-300 cursor-pointer`}>{ lang.name }</li>
                    ))
                }
            </ul>
        </nav>
    </aside>
  )
}
