import { useAdminAuth } from "../../hooks"
import NotImplemented from "../../layouts/NotImplemented";
import OverLaped from "../../layouts/OverLaped";

export default function Dashboard() {
    useAdminAuth();

  return (
    <main>
        {/* <OverLaped> */}
            <NotImplemented />
        {/* </OverLaped> */}
    </main>
  )
}
