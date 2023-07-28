import ActiveBoardProvider from "../../context/activeboard";
import DashboardProvider from "../../context/dashboard";
import DashboardSidebar from "../../layouts/DashboardSidebar";
import Switchboard from "./Switchboard";

export default function Dashboard() {
  return (
    <main className="flex w-screen lg:flex-row flex-col">
        <ActiveBoardProvider>
          <DashboardProvider>
              <DashboardSidebar/>
              <Switchboard />
          </DashboardProvider>
        </ActiveBoardProvider>    
    </main>
  )
}