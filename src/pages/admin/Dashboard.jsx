import { useState } from "react";
import { useAdminAuth } from "../../hooks"
import DashboardSidebar from "../../layouts/DashboardSidebar";

export default function Dashboard() {
    useAdminAuth();
    const [activeBoard, setActiveBoard] = useState("contacts");

  return (
    <main className="flex w-screen lg:flex-row flex-col">
      <DashboardSidebar board={[activeBoard, setActiveBoard]}/>
      <section>
        
      </section>
    </main>
  )
}
