import ActiveBoardProvider from "../../context/activeboard";
import DashboardProvider from "../../context/dashboard";
import ModalProvider from "../../context/modal";
import DashboardSidebar from "../../layouts/DashboardSidebar";
import Switchboard from "./Switchboard";

export default function Dashboard() {
  return (
    <main className="flex w-screen lg:flex-row flex-col">
        <ActiveBoardProvider>
          <DashboardProvider>
              <DashboardSidebar/>
              <ModalProvider>
                <Switchboard />
              </ModalProvider>
          </DashboardProvider>
        </ActiveBoardProvider>    
    </main>
  )
}