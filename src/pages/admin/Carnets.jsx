/* eslint-disable no-unexpected-multiline */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { names } from "../../firebase/collections";
import { useConfigurations, useData, useSearchParamsSerializer } from "../../hooks";
import Alert from "../../layouts/admin/shared/Alert";
import Loader from "../../layouts/global/Loader";
import { DefaultCarnetsSettings, alertMessage, dateFormater, periodAccronymMap, toXlsx } from "../../utils";
import { DataGrid } from "@mui/x-data-grid";
import { fetchRefDoc, updateDocument } from "../../firebase";
import { useNavigate } from "react-router-dom";
import CarnetsSettings from "../../layouts/admin/carnets/CarnetsSettings";
import CarnetLookup from "../../layouts/admin/carnets/CarnetLookup";
import CarnetUpdate from "../../layouts/admin/carnets/CarnetUpdate";
import Icon from "../../assets/svg";
import CarnetsProgressChart from "../../layouts/admin/carnets/CarnetsProgressChart";
import CarnetTypesChart from "../../layouts/admin/carnets/CarnetTypesChart";

export default function Carnets() {
  const [carnetsData, DataLoading, DataError] = useData(names.carnets);
  const [carnetsSettings] = useConfigurations(names.carnets, DefaultCarnetsSettings);
  const [carnets, setCarnets] = useState([...carnetsData]);
  const [loadingUserRef, setLoadingUserRef] = useState(true);

  // configuration flag
  const [settings, setSettings] = useState(false);

  // selected contact
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);

  // search params
  const searchParams = useSearchParamsSerializer();
  const navigate = useNavigate();

  useEffect(() => { 
    if (carnetsData.length === 0) return;
    setCarnets(carnetsData.map(async (carnet) => {
      try {        
        carnet.userID = await carnet.user.id;
        carnet.user = await fetchRefDoc(carnet.user);
        carnet.username = carnet.user.firstname + ' ' + carnet.user.lastname;
        carnet.progress = Math.round((carnet.passedSessions / carnet.sessions) * 100)
        setLoadingUserRef(false);
        return carnet;
      } catch (error) {
        setLoadingUserRef(false);
        console.warn("ERROR LOADING USER CARNET DATA REF:", error);
      }
    }));
  }, [carnetsData]);

  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);


  // message modal state
  const [modal, setModal] = useState({type: "R", data: null});
  const [alert, setAlert] = useState({
		type: "info",
		title: "",
		message: "",
		confirm: "ok",
		cancel: "close",
    onConfirm: alertAction,
    onCancel: alertAction
	})

  // check if the carnets id 'ID' is presented in the search params,and set the Modal with the coresponding carnet data
  useEffect(() => {
    if(!searchParams.id) return;
    const carnet = carnetsData.find((carnet) => carnet.id === searchParams.id);
    carnet && setModal(carnet);
  }, [searchParams, carnetsData]);

  // update carnets data when the carnetsData state change
  const updateCarnet = useCallback( async (carnetData) => {
    try {
      await updateDocument(names.carnets, carnetData.id, carnetData);
      setAlert({...alert, ...alertMessage("U", "Carnet", true), onConfirm: alertAction(() => setModal({type: "R", data: null}))});
      console.log("Carnet Data Updated Successfully", carnetData);
    } catch (error) {
      console.error(error);
      setAlert({...alert, ...alertMessage("E", "Carnet", false), onConfirm: alertAction(() => setModal({type: "R", data: null}))});
    }
  }, [alert, alertAction]);


  const columns = useMemo(() => [
    { field: "userID", headerName: "User ID", width: 190, 
      sortable: false,
      editable: false,
      renderCell: ({ value }) => (loadingUserRef || !value) ? "Loading User Data..." : <a title={value} target="_blank" href={`/lotus/users?id=${value}`} className="hover:text-yoga-green hover:underline underline-offset-4 transition-all" rel="noreferrer">{value}</a>
    },

    { field: "username", headerName: "User Name", width: 190, 
      renderCell: ({ value }) => !value ? "Loading User Data..." :  <span title={value} className="font-medium uppercase">{value}</span>
    },

    { field: "type", headerName: "Carnet Type", width: 100, 
      type: "singleSelect",
      valueOptions: Object.keys(carnetsSettings),
      renderCell: ({ value }) => <span title={value} className="cinzel font-semibold text-center uppercase">{value}</span>
    },

    { field: "period", headerName: "Period", width: 90,
      valueFormatter: ({ value }) => periodAccronymMap(value)
    },

    { field: "sessions", headerName: "Sessions", width: 60,
      type: "number"
    },

    { field: "passedSessions", headerName: "Passed Sessions", width: 100,
      type: "number"
    },

    { field: "progress", headerName: "Progress", width: 100,
      renderCell: ({ row }) => <div className={`relative h-4 w-[100px] flex items-center text-center bg-gray-300`}>
        <div className="z-0 h-full bg-yoga-green" style={{width: Math.round((row.passedSessions / row.sessions) * 100)}}></div>
        <span className="absolute left-1/2 -translate-x-1/2 z-20">{Math.round((row.passedSessions / row.sessions) * 100) ?? 0}%</span>
      </div>
    },

    { field: "price", headerName: "Price", width: 100,
      type: "number",
      renderCell: ({ value }) => value + " MAD"
    },

    { field: "paidAmount", headerName: "Paid Amount", width: 100,
      type: "number",
      renderCell: ({ value }) => value + " MAD"
    },

    { field: "remainingAmount", headerName: "Remaining Amount", width: 100,
      type: "number",
      renderCell: ({ value }) => value + " MAD"
    },

    { field: "createdAt", headerName: "Registeration Date", width: 280,
      type: "date",
      // formating the date to be like this: 2021 Sep 30 12:00:00
      valueFormatter: ({ value }) => dateFormater(value)
    },

    // filed to show the User infos
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => setModal({type: "R", data: row}) } title={`Show ${row.user.firstname} ${row.user.lastname} carnet`} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Show</button>
      )
    },

    // field to update the User infos
    { field: "update", headerName: "Update", width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => setModal({type: "U", data: row}) } title={`Update ${row.user.firstname} ${row.user.lastname} Carnet`} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-green outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}><i className="fi fi-sr-file-edit text-yoga-white flex justify-center items-center"></i></button>
      )
    },

    // field for making a user as deleted
    // { field: "delete", headerName: "Delete", width: 80,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: ({row}) => (
    //     <button onClick={() => { setAlert({...alert, ...alertMessage("D", "User"), onConfirm: () => alertAction(() => deleteCarnet(row.id))}) }} title={`Delete ${row.user.firstname} ${row.user.lastname} Carnet Data`} className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
    //   )
    // }
  ], [carnetsSettings, loadingUserRef]);

  const exportToXLSX = useCallback(() => {
    // check if there is a selected rows export the selected rows else export all rows
    const data = (selection.length > 0 ? selection : carnetsData).map((carnet) => {
    // formating the data to be readable
    return {
        "Carnet ID": carnet.id,
        "User ID": carnet.userID,
        "User": carnet.username,
        "Carnet Type": carnet.type,
        "Period": periodAccronymMap(carnet.period),
        "Sessions": carnet.sessions,
        "Passed Sessions": carnet.passedSessions,
        "Progress": carnet.progress,
        "Price": carnet.price + " MAD",
        "Paid Amount": carnet.paidAmount + " MAD",
        "Remaining Amount": carnet.remainingAmount + " MAD",
        "User Profile": `${import.meta.env.VITE_HOST_NAME}/lotus/users?id=${carnet.userID}`,
        "Registeration Date": dateFormater(carnet.createdAt),
      }
    });

    // exporting the data to xlsx
    return toXlsx(data, "jnaninyoga-users-carnets");

  }, [carnetsData, selection]);
  
  // close the model when click outside the modal in the parent element
  const closeModal = e =>{
    if(e.target === e.currentTarget){
      setModal({type: "R", data: null});
      setAlert({});
      setSettings(false);
      navigate({search: ""})
    }
  }
  
  // if data been loading
  if (carnets.length === 0 && DataLoading) return <Loader loading='Loading Carnets Data...' />;
  
  // if there is error loading the data
  if (DataError) return (
    <section className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert
        type="error"
        title={`Error Loading Carnets Data`}
        message={`There was an error loading your Carnets data dashboard. Please try again later.`}
        confirm={"Try Again"}
        onConfirm={window.location.reload}
        cancel={"Close"}
      />
    </section>
  )
  
  return (
    <section className='w-full h-fit flex items-start flex-col'>
      <Box className="w-full max-w-full min-h-[250px] max-h-screen p-4 flex flex-col gap-4 print:hidden overflow-x-auto">
        <div className={`w-full h-full max-h-14 sm:max-h-10 py-1 sm:py-0 flex justify-start items-center gap-2 overflow-x-auto overflow-y-hidden`}>
          <button type="button" onClick={() => setSettings(true)} className="h-full min-w-max px-6 py-2 group flex justify-center items-center gap-2 cinzel font-semibold text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all"><i className="fi fi-sr-settings group-active:rotate-180 flex justify-center items-center transition-all"></i> <span className="">Settings</span></button>
          <button type="button" onClick={exportToXLSX} className={`cinzel h-full min-w-max mx-1 px-3 py-2 text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>{(selection.length > 0 && selection.length < carnets.length) ? "Export Selected To Excel" : "Export All To Excel"}</button>
        </div>

        <DataGrid
          className="h-fit bg-yoga-white text-lg"
          rows={carnetsData}
          columns={columns}
          loading={DataLoading}
          getRowId={(row) => row.id}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5,20,50]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(selection) => setSelection(selection)}
        />
      </Box>
      <Box className="w-full px-4  print:hidden">
        <section className='py-4 flex justify-center items-center gap-4 flex-col rounded-[4px] bg-yoga-white bg-texture texture-h-1'>
          <div className={`sm:h-12 sm:w-24 h-10 w-20 flex items-center justify-center transition-all duration-500 select-none z-[50]`}>
            <Icon
              label="Lotus"
              colors={{oc: "#ffffff", pc: "#fdc5ba"}}
              height={90}
              width={90}
            />
          </div>
          <h2 className='cinzel text-2xl font-semibold z-[50]'>Carnets Data Charts</h2>
          <section className='container z-[50] flex items-start sm:items-center justify-start sm:justify-center sm:flex-row flex-col gap-8 overflow-x-auto sm:overflow-hidden rounded-sm'>
            <CarnetTypesChart carnets={carnetsData} types={Object.keys(carnetsSettings)}/>
            <CarnetsProgressChart carnets={carnetsData} />
          </section>
        </section>
      </Box>

      {/* Settings/Cofiguration UI */}
      {settings && (
        <div className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
          <CarnetsSettings onReset={() => setSettings(false)}/>
        </div>
      )}

      {/* message modal */}
      {modal.data && (
        modal.type === "R" ? (
        <section onClick={closeModal} className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center print:items-start z-[200000] print:h-screen print:w-screen print:bg-texture print:texture-v-1">
          <CarnetLookup carnet={modal.data} />
        </section>
      ) : (
        <section className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center z-[200000]">
          <CarnetUpdate carnet={modal.data} configurations={carnetsSettings}  onUpdate={updateCarnet} onCancel={() => setModal({type: "R", data: null})}  />
        </section>
      )
      )}

      {/* Alert Message */}
      {alert.title && (
        <section onClick={closeModal} className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center z-[200100]">
          <Alert {...alert} />
        </section>
      )}
    </section>
  )
}
