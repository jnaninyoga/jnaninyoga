import { Helmet } from "react-helmet-async";
import { useActiveBoard } from "../../../hooks"
import { dashboardNavbar } from "../../../utils";
// Board Components
import Account from "../../../pages/admin/Account";
import Books from "../../../pages/admin/Books";
import Carnets from "../clients/Carnets";
import Sessions from "../../../pages/admin/Sessions";
import Contacts from "../../../pages/admin/Contacts";
import Reviews from "../../../pages/admin/Reviews";
import Clients from "../../../pages/admin/Clients";
import { useMemo } from "react";

export default function Switchboard() {
    const { activeBoard } = useActiveBoard();

    // get the icon for the active board
    const ActiveBoardIcon = useMemo(() => dashboardNavbar.find(board => board.name.toLowerCase() === activeBoard.toLowerCase()).icon, [activeBoard]);

    // switch between the different boards
    const Board = () => {
        switch (activeBoard?.toLowerCase()) {
            case "account": return <Account />;
            case "sessions": return <Sessions />;
            case "contacts": return <Contacts />;
            case "books": return <Books />;
            case "reviews": return <Reviews />;
            case "users": return <Clients />;
            case "clients": return <Clients />;
            case "carnets": return <Carnets />;
            default: return <Clients />;
        }
    }

    return (
        <>
        <Helmet>
            <title>{activeBoard.toCapitalCase()} Dashboard - Jnanin Yoga Studio</title>
        </Helmet>
        <section className={`relative w-full h-screen flex items-start flex-col overflow-auto`}>
            { (activeBoard?.toLowerCase() !== "sessions") && <header className="w-full p-4 flex justify-center items-start flex-col sm:gap-4 gap-2 print:hidden">
                <h2 className="cinzel w-full flex justify-center items-center gap-4 sm:text-2xl text-xl text-yoga-green-dark font-bold uppercase py-4 px-6 outline outline-[3px] -outline-offset-[10px] bg-yoga-red outline-white transition-all duration-300"><i className={`flex justify-center items-center text-yoga-green-dark ${ActiveBoardIcon}`}></i> {activeBoard}</h2>
            </header> }
            <Board />
        </section>
        </>
    );
}
