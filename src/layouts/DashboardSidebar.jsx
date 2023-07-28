import "handyscript/lib/string";
import logo from "../assets/imgs/spine/logo.webp";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { dashboardNavbar, dashboardNavicons } from "../utils";
import { Link } from "react-router-dom";
import { useActiveBoard, useData } from "../hooks";
import Stars from "../components/Stars";

export default function DashboardSidebar() {
    const { data: { reviews } } = useData();
    const { activeBoard, setActiveBoard } = useActiveBoard();
    const [isMenuHidden, setIsMenuHidden] = useState(true);

    const { t } = useTranslation();
    const dashboardnavbar = t(`dashboardNavbar`, { returnObjects: true });

    const dashboardSidebar = useRef(null);

    // set the length of the reviews and contacts as notifications in the navbar, using the active board and local storage
    // const notifications = useMemo(() => {
    //     // check local storage notifications
    //     const localNotifications = JSON.parse(localStorage.getItem("notifications"));
    //     // const activeBoard = localStorage.getItem("activeBoard") || "contacts";
    //     // it the local storage notifications deffers from the reviews and contacts length, update the notifications

    //     const Notifications = { reviews: reviews.length, contacts: contacts.length };

    //     const newNotifications = { 
    //         reviews: reviews.length - localNotifications.reviews,
    //         contacts: contacts.length - localNotifications.contacts, 
    //     };
    //     console.log({localNotifications});
    //     console.log({newNotifications});
    //     // newNotifications[activeBoard] = 0;
    //     // set the notifications in loacl storage
    //     localStorage.setItem("notifications", JSON.stringify(Notifications));
    //     return newNotifications;
    // }, [reviews, contacts]);

    // check if navbar is an array
    const Tnavbar = () => Array.isArray(dashboardnavbar) ? dashboardnavbar : dashboardNavbar;

    // getting golbal rate from reviews
    const globalRate = () => {
        const rate = reviews.reduce((acc, review) => acc + review.rate, 0) / reviews.length;
        return rate.toFixed(1)*1;
    }

    const showMenu = () => { 
        setIsMenuHidden(false)
        // PREVENT SCROLLING
        document.body.style.overflow = "hidden";
        // disable interacting with the page
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
    <aside className={`lg:w-1/4 w-screen z-[9999] before:absolute before:h-screen before:w-screen before:pointer-events-none ${isMenuHidden ? "before:bg-none" : "before:bg-black before:bg-opacity-40 before:backdrop-blur-[2px]"} lg:bg-none flex flex-col transition-all duration-300`}>
        <div className={`lg:hidden py-2 px-6 w-screen flex justify-between items-center bg-yoga-white`}>
            <button id="toggleDashboardSidebar" onClick={showMenu} className={`flex items-center justify-center text-2xl`}><i id="toggleDashboardSidebar" className="fi fi-bs-bars-staggered flex items-center justify-center"></i></button>
            <img className="h-10" src={logo} alt="Jnanin Yoga Studio Logo" />
        </div>

        <nav ref={dashboardSidebar} id="dashboardsidebar" className={`z-[9999] lg:relative fixed p-4 h-screen lg:w-full w-[70%] max-w-[250px] min-w-max flex items-center flex-col gap-7 bg-yoga-white transition-all lg:left-0 ${isMenuHidden ? "-left-[120%] lg:left-0" : "left-0"}`}>
            <div className={`relative w-full flex items-center justify-center flex-col gap-2`}>
                <Link to={"/"}><img className="h-16" src={logo} alt="Jnanin Yoga Studio Logo" /></Link>
                <h1 className="cinzel uppercase font-bold sm:text-xl text-lg text-center">Jnanin Yoga Studio</h1>
                <Stars rate={globalRate()} className="h-6 w-6"/>
            </div>

            <ul className="w-full flex items-center flex-col">
            {
                Tnavbar().map((link, index) => (
                <li key={index} onClick={() => { hideMenu(); setActiveBoard(dashboardNavbar[index].toLowerCase()); }} className={`relative w-full text-lg sm:text-xl px-4 py-2 flex items-center gap-4 group  outline outline-2 -outline-offset-[5px] outline-none hover:outline-white hover:bg-yoga-red ${activeBoard?.toLowerCase() === dashboardNavbar[index].toLowerCase() ?  "bg-yoga-red outline-white" : ''} transition-all duration-300 cursor-pointer`}>
                    <i className={`flex items-center ${Object.values(dashboardNavicons)[index]} transition-all group-hover:text-yoga-green-dark ${activeBoard?.toLowerCase() === dashboardNavbar[index].toLowerCase() ?  "text-yoga-green-dark" : ''}`}></i>
                    <button className={`text-center font-medium capitalize`}>{ link }</button>
                    {/* Notification Counter */}
                    {/* { notifications[dashboardNavbar[index].toLowerCase()] > 0 && activeBoard?.toLowerCase() !== dashboardNavbar[index].toLowerCase() && <span className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5 flex items-center justify-center text-xs text-white bg-yoga-green rounded-full">{ notifications[dashboardNavbar[index].toLowerCase()] }</span> } */}
                </li>
            ))}
            </ul>
            <ul className="w-full flex items-center flex-col">
                {
                    // supportedLanguages.map((lang, i) => (
                    //     <li key={i} title={lang.name} onClick={() => { hideMenu(); changeLanguage(lang.code) }} className={`w-full text-lg sm:text-xl px-4 py-2 flex items-center ${currentLang.dir === "rtl" ? "flex-row-reverse" : "flex-row"} gap-4 group outline outline-2 -outline-offset-[5px] outline-none hover:outline-white hover:bg-yoga-red-ligth hover:text-yoga-green-dark ${lang.code === currentLang.code ?  "bg-yoga-red-ligth text-yoga-green-dark outline-white" : ''} transition-all duration-300 cursor-pointer`}>{ lang.name }</li>
                    // ))
                }
            </ul>
        </nav>
    </aside>
  )
}
