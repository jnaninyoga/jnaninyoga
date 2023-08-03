import { useActiveBoard } from "../../hooks"
import { dashboardNavicons } from "../../utils";
// Board Components
import Account from "./Account";
import Classes from "./Classes";
import Contacts from "./Contacts";
import Reviews from "./Reviews";

export default function Switchboard() {
    const { activeBoard } = useActiveBoard();
    
    // switch between the different boards
    const Board = () => {
        switch (activeBoard?.toLowerCase()) {
            case "account": return <Account />;
            case "classes": return <Classes />;
            case "contacts": return <Contacts />;
            case "reviews": return <Reviews />;
            default: return <Contacts />;
        }
    }

    return (
        <section className={`relative container w-full h-screen flex items-center flex-col ${"overflow-x-hidden overflow-y-auto"}`}>
            <header className="w-full p-4 flex justify-center items-start flex-col sm:gap-4 gap-2">
                <h2 className="cinzel w-full flex justify-center items-center gap-4 sm:text-2xl text-xl text-yoga-green-dark font-bold uppercase py-4 px-6 outline outline-[3px] -outline-offset-[10px] bg-yoga-red outline-white transition-all duration-300"><i className={`flex justify-center items-center text-yoga-green-dark ${dashboardNavicons[activeBoard]}`}></i> {activeBoard}</h2>
            </header>
            <Board />
        </section>
    );
}
