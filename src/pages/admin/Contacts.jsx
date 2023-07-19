import { useAdminAuth } from "../../hooks";

export default function Contacts() {
    useAdminAuth();

  return (
    <div>Contacts</div>
  )
}
