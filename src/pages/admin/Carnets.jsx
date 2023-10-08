/* eslint-disable no-unexpected-multiline */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { names } from "../../firebase/collections";
import { useConfigurations, useData, useSearchParamsSerializer } from "../../hooks";
import Alert from "../../layouts/admin/shared/Alert";
import Loader from "../../layouts/global/Loader";
import { DefaultCarnetsSettings, alertMessage, dateFormater, periodAccronymMap, toXlsx } from "../../utils";
import { DataGrid } from "@mui/x-data-grid";
import { fetchRefDoc } from "../../firebase";
import { useNavigate } from "react-router-dom";
import CarnetsSettings from "../../layouts/admin/carnets/CarnetsSettings";
import CarnetLookup from "../../layouts/admin/carnets/CarnetLookup";

export default function Carnets() {
  const [carnets, DataLoading, DataError] = useData(names.carnets);
  // configuration flag
  const [settings, setSettings] = useState(false);
  
  // close the model when click outside the modal in the parent element
  const closeModal = e =>{
    if(e.target === e.currentTarget){
      // setModal(null);
      // setAlert({});
      setSettings(false);
    }
  }
  
  // if data been loading
  if (!carnets && DataLoading) return <Loader loading='Loading Carnets Data...' />;
  
  // if there is error loading the data
  if (DataError || !carnets) return (
    <section className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
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
    <>
    <Box className="w-fit max-w-full min-h-[250px] p-4 flex flex-col gap-4 print:hidden overflow-x-auto">
      <div className={`w-full h-full max-h-14 sm:max-h-10 py-1 sm:py-0 flex justify-start items-center gap-2 overflow-x-auto overflow-y-hidden`}>
        <button type="button" onClick={() => setSettings(true)} className="h-full min-w-max px-6 py-2 group flex justify-center items-center gap-2 cinzel font-semibold text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all"><i className="fi fi-sr-settings group-active:rotate-180 flex justify-center items-center transition-all"></i> <span className="">Settings</span></button>
      </div>


    </Box>
    {/* Settings/Cofiguration UI */}
    {settings && (
      <div className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
        <CarnetsSettings onReset={() => setSettings(false)}/>
      </div>
    )}
    </>
  )
}
