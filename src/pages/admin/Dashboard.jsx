import ActiveBoardProvider from "../../context/activeboard";
import DashboardSidebar from "../../layouts/DashboardSidebar";
import Switchboard from "./Switchboard";

export default function Dashboard() {
  return (
    <main className="w-screen flex lg:flex-row flex-col">
      <ActiveBoardProvider>
        <DashboardSidebar/>
        <Switchboard />
      </ActiveBoardProvider>    
    </main>
  )
}