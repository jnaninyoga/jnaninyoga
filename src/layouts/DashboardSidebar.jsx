import logo from "../assets/imgs/spine/logo.webp";
import { useEffect, useMemo, useRef, useState } from "react";
import { dashboardNavbar } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBoard, useData } from "../hooks";
import Stars from "../components/Stars";
import { names } from "../firebase/collections";

export default function DashboardSidebar() {
    const [reviews] = useData(names.reviews);
    const { activeBoard } = useActiveBoard();
    const [isMenuHidden, setIsMenuHidden] = useState(true);
    const navigate = useNavigate();

    const ChunkDashBoard = useMemo(() => dashboardNavbar.chunk(3) ,[])

    const dashboardSidebar = useRef(null);

    // set the length of the reviews and contacts as notifications in the navbar, using the active board and local storage

    //dashboard navigation
    const dashboardNavigation = (board) => {
        hideMenu();
        navigate(`/lotus/${board}`);
    };

    // getting golbal rate from reviews
    const globalRate = useMemo(() => {
        const rate = reviews.reduce((acc, review) => acc + review.rate, 0) / reviews.length;
        return rate.toFixed(1)*1;
    }, [reviews]);

    useEffect(() => {
        // prevent scrolling when menu is open
        document.body.style.overflow = isMenuHidden ? "auto" : "hidden";
    }, [isMenuHidden]);

    const showMenu = () => { 
        setIsMenuHidden(false)
    };

    const hideMenu = () => { 
        setIsMenuHidden(true)
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
    <aside className={`lg:w-1/4 w-screen z-[100000] before:absolute before:h-screen before:w-screen before:pointer-events-none ${isMenuHidden ? "before:bg-none" : "before:bg-black before:bg-opacity-40 before:backdrop-blur-[2px]"} lg:bg-none flex flex-col transition-all duration-300 print:hidden`}>
        <div className={`lg:hidden py-2 px-6 w-screen flex justify-between items-center bg-yoga-white`}>
            <button id="toggleDashboardSidebar" onClick={showMenu} className={`flex items-center justify-center text-2xl`}><i id="toggleDashboardSidebar" className="fi fi-bs-bars-staggered flex items-center justify-center"></i></button>
            <img className="h-10" src={logo} alt="Jnanin Yoga Studio Logo" />
        </div>

        <nav ref={dashboardSidebar} id="dashboardsidebar" className={`z-[9999] lg:relative fixed p-4 h-screen lg:w-full w-[70%] max-w-[250px] min-w-max flex items-center flex-col gap-7 texture-v-1 before:opacity-30 bg-yoga-white transition-all lg:left-0 ${isMenuHidden ? "-left-[120%] lg:left-0" : "left-0"}`}>
            <div className={`relative w-full flex items-center justify-center flex-col gap-2`}>
                <Link to={"/"} onClick={() => hideMenu()}><img className="h-16" src={logo} alt="Jnanin Yoga Studio Logo" /></Link>
                <h1 className="cinzel uppercase font-bold sm:text-xl text-lg text-center">Jnanin Yoga Studio</h1>
                <div className={`relative w-full flex justify-center items-center gap-2 overflow-x-hidden`}>
                    <div className="w-[28%] h-[2px] bg-cyan-800 bg-opacity-10"></div>
                    <h4 className={`px-2 cinzel text-sm font-semibold uppercase w-max bg-yoga-white transition-all`}>{globalRate}</h4>
                    <div className="w-[28%] h-[2px] bg-cyan-800 bg-opacity-10"></div>
                </div> 
                <Stars rate={globalRate} className="h-6 w-6"/>
            </div>

            <div key="dashboard-links" className="h-full w-full flex items-center flex-col gap-5 overflow-y-auto">
                { ChunkDashBoard.map((board,bidx) => (
                    <>
                    { (bidx > 0) && <div key={bidx} className="w-full h-1 bg-cyan-800 bg-opacity-10"></div> }
                    <ul key={bidx+1} className="w-full flex items-center flex-col">
                        { board.map((link) => (
                            <li tabIndex={1} role="link" key={link.name} onClick={() => dashboardNavigation(link.name.toLowerCase()) } className={`relative w-full text-lg sm:text-xl px-4 py-2 flex items-center gap-4 group  outline outline-2 -outline-offset-[5px] outline-none hover:outline-white hover:bg-yoga-red focus:outline-white focus:bg-yoga-red ${activeBoard?.toLowerCase() === link.name.toLowerCase() ?  "bg-yoga-red outline-white" : ''} transition-all duration-300 cursor-pointer`}>
                                <i className={`flex items-center ${link.icon} transition-all group-hover:text-yoga-green-dark group-focus:text-yoga-green-dark ${activeBoard?.toLowerCase() === link.name.toLowerCase() ?  "text-yoga-green-dark" : ''}`}></i>
                                <span className={`text-center font-medium capitalize`}>{ link.name }</span>
                            </li>
                        ))}
                    </ul>
                    </>
                ))}
            </div>
        </nav>
    </aside>
  )
}
