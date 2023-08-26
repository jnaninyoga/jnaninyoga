import { names } from "../../firebase/collections";
import { useData } from "../../hooks";
import Alert from "../../layouts/Alert";
import Loader from "../../layouts/Loader";

export default function Carnets() {
  const [carnets, DataLoading, DataError] = useData(names.carnets);
  
  // if data been loading
  if (!carnets && DataLoading) return <Loader loading='Loading Carnets Data...' />;
  
  // if there is error loading the data
  if (DataError || !carnets) return (
    <section className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 print:z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert
        type="error"
        title="Error Loading Carnets Data"
        message="There was an error loading your Carnets data dashboard. Please try again later."
        confirm={"Try Again"}
        onConfirm={window.location.reload}
      />
    </section>
  )
  
  return (
    <div>Carnets</div>
  )
}
