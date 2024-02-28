// === HOOKS ===
import { useData, useConfigurations, useActiveBoard } from "../../hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';

// === Utils ===
import { dateFormater, whatsappLink, toXlsx, alertMessage, clientAge, carnetPicker, DefaultCarnetsSettings } from "../../utils";
import { addSubColDocument, deleteOnCascade, updateDocument } from "../../firebase";
import { configurations } from "../../firebase/collections";
import { addContact, deleteContact, updateContact } from '../../email';

// === Assets ===
import BGFemale from '../../assets/imgs/spine/bg-female-texture.jpg';
import BGMale from '../../assets/imgs/spine/bg-male-texture.png';
import { names } from "../../firebase/collections";
import { clientFields } from "../../utils/form";
import clientHP from '../../constants/healthpoint';

// === Layouts ===
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Alert from "../../layouts/admin/shared/Alert";
import Form from "../../layouts/global/Form";
import Loader from '../../layouts/global/Loader';

// === Components ===
import ClientLookup from "../../layouts/admin/clients/ClientLookup";
import Carnets from "../../layouts/admin/clients/Carnets";
import CarnetsSettings from "../../layouts/admin/clients/carnets/CarnetsSettings";
import ClientsChart from "../../layouts/admin/charts/ClientsChart";


export default function Clients() {
  const [clients, DataLoading, DataError] = useData(names.clients);
  // const [carnets, CarnetsLoading, CarnetsError] = useData(`${names.clients}/${client.id}/carnets`);

  const [client, setClient] = useState({});
  const [operationError, setOperationError] = useState(false); // error creating or updating the client

  // alter between the charts view and the clients table view
  const [chartsView, setChartsView] = useState(false);

  const {boardParams} = useActiveBoard();
  const navigate = useNavigate();
  
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);

  // Carnets Settings
  const [carnetsConfigs] = useConfigurations(configurations.carnets, DefaultCarnetsSettings);
  const [carnetsSettings, setCarnetsSettings] = useState(false);

  // message modal state
  const [modal, setModal] = useState({type: '', data: ''});
  const [alert, setAlert] = useState({});


  // check if the client id 'UID' is presented in the search params,and set the Modal with the coresponding client
  useEffect(() => {
    if(!boardParams.id) return;
    const client = clients.find((client) => client.id  === boardParams.id);
    client && setModal({type: boardParams.view ? "R-CARNETS" : "R-PROFILE", data: client});
  }, [boardParams, clients]);


  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);
  


  // === Display/Views ===
  // --- Carnets View
  // display user carnets, and set the url to : /clients/:id/carnets
  const displayCarnets = useCallback((client) => {
    navigate(`${client.id}/carnets`);
  }, [navigate]);

  // --- Profile View
  // display user profile, and set the url to : /clients/:id
  const displayProfile = useCallback((client) => {
    navigate(`${client.id}`);
  }, [navigate]);


  // === CRUD Operations ===

  // --- create Client
  const createClient = useCallback(async (client) => {
    // clear the form error message
    setOperationError(false);
    try {
      await addSubColDocument(names.clients, {...client, hp: clientHP(client), age: await clientAge(client.birthdate)}, names.carnets, carnetPicker());
      setModal(null);
      setAlert({...alertMessage("C", "Client", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error("ERROR CREATING client:", error);
      setOperationError(true);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "Client", true, "Creating"), confirm: "Try Again", onConfirm: () => alertAction(async () => await createClient(client)), onCancel: alertAction })
    }
    try {
      await addContact({firstname:client.firstname, lastname:client.lastname, sex:client.sex, birthdate:client.birthdate, email:client.email, sms:client.phone})
    } catch (error) {
      console.error("ERROR CREATING BREVO CONTACT:", error);
      const BREVO_ERROR = JSON.parse(error.message.split("Error: ")[1]);
      setAlert({ ...alertMessage("E", "Brevo Contact", true, "Creating"), message: BREVO_ERROR.message, confirm: "Try Again", onConfirm: alertAction, onCancel: alertAction })
    }
  }, [alertAction]);



  // --- delete Client
  const deleteClient = useCallback(async (id) => {
    try {
      await deleteContact(clients.find(client => client.id === id).email)
      setAlert({...alertMessage("D", "Brevo Contact", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error("ERROR DELETING BREVO CONTACT:", error);
      setAlert({ ...alertMessage("E", "Brevo Contact", true, "Deleting"), confirm: "Try Again", onConfirm: alertAction, onCancel: alertAction })
    }
    try {
      await deleteOnCascade(names.clients, id, names.carnets, 'client');
      const restoreClient = async () => await deleteOnCascade(names.clients, id, names.carnets, 'client', true);
      setAlert({...alertMessage("D", "Client", true), onConfirm: () => alertAction(restoreClient), onCancel: alertAction, confirm: "Restore"})
    } catch (error) {
      console.error("ERROR DELETING CLIENT:", error);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "Client", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(async () => await deleteClient(id)), onCancel: alertAction })
    }
  }, [alertAction, clients]);



  // --- delete all Clients
  const deleteMultiClients = useCallback(async () => {
    try {
      await Promise.all(selection.map(async id => await deleteClient(id)));
      const restoreClients = async () => await Promise.all(selection.map(async id => await deleteOnCascade(names.clients, id, names.carnets, 'client', true)));
      setAlert({...alertMessage("DA", "Client", true), onConfirm: () => alertAction(restoreClients), onCancel: alertAction, confirm: "Restore All"})
    } catch (error) {
      console.error("ERROR DELETING clientS:", error);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "Clients", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(deleteMultiClients), onCancel: alertAction })
    }
  }, [selection, deleteClient, alertAction]);



  // --- update Client
  // trigger the update modal with the client data flattened
  const triggerUpdate = useCallback(client => {
    const flattenClient = Object.entries(client).reduce((acc, [key, value]) => {
      // check if the value is object and not instence of Date
      if(typeof value === 'object' && key !== "createdAt" && key !== "updatedAt"){
        acc = {...acc, ...value};
      }else{
        acc[key] = value;
      }
      return acc;
    }, {});
    setClient(flattenClient);
    setModal({type: "U", data: client});
  }, []);

  const updateClient = useCallback(async (client) => {
    // clear the form error message
    setOperationError(false);
    try {
      await updateDocument(names.clients, modal.data.id, {...client, hp: clientHP(client), age: await clientAge(client.birthdate)});
      setModal(null);
      setAlert({...alertMessage("U", "Client", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error("ERROR UPDATING client:", error);
      setOperationError(true);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "Client", true, "Updating"), confirm: "Try Again", onConfirm: () => alertAction(async () => await updateClient(client)), onCancel: alertAction })
    }
    try {
      await updateContact(modal.data.email, {firstname:client.firstname, lastname:client.lastname, sex:client.sex, birthdate:client.birthdate, email:client.email, sms:client.phone})
    } catch (error) {
      console.error("ERROR UPDATING BREVO CONTACT:", error);
      setAlert({ ...alertMessage("E", "Brevo Contact", true, "Updating"), confirm: "Try Again", onConfirm: alertAction, onCancel: alertAction })
    }
  }, [alertAction, modal]);



  const exportToXLSX = useCallback(() => {
    // check if there is a selected rows export the selected rows else export all rows
    const data = (selection.length > 0 ? selection : clients).map((client) => {
    // formating the data to be readable
    return {
        "ID": client.id,
        "First Name": client.firstname,
        "Last Name": client.lastname,
        "HP": client.hp,
        "Sex": client.sex,
        "Birth Date": dateFormater(client.birthdate, false),
        "age": client.age,
        "Job": client.job,
        "Address": client.address,
        "Email": client.email,
        "Phone Number": client.phone,
        "Registeration Date": dateFormater(client.createdAt),
        "Current Care": client.medicalhistory.currentcare,
        "Current Care Information": client.medicalhistory.currentcareinfo,
        "Medical History": client.medicalhistory.record,
        "Medical History Information": client.medicalhistory.recordinfo,
        "Physical Health": client.physentalstate.physical.join(", "),
        "Mental Health": client.physentalstate.mental.join(", "),
        "Sleep Rhythm": client.liferhythm.sleep,
        "Nutrition Rhythm": client.liferhythm.nutrition,
        "Sport Activity": client.liferhythm.sport,
        "Meditation Activity": client.liferhythm.meditation
      }
    });

    // exporting the data to xlsx
    return toXlsx(data, "jnaninyoga-clients");

  }, [clients, selection]);

  // close the model when click outside the modal in the parent element
  const reset = () => {
    setModal(null);
    setAlert({});
    navigate(`/lotus/${names.clients}`);
  }

  const closeModal = e =>{
    if(e.target === e.currentTarget) reset();
  }


  // effect to clear custom errors
  useEffect(() => {
    if(!operationError) return
    const timeout = setTimeout(() => {
      setOperationError(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [operationError]);

  // Books table columns
  const columns = useMemo(() => [
    // filed to show the Client Carnets
    { field: "carnets", headerName: "Carnets", width: 140,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => displayCarnets(row) } title={`Show ${row.firstname} ${row.lastname} Carnets`} className={`flex justify-center items-center gap-1 cinzel text-center uppercase font-semibold px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}><i className="fi fi fi-sr-address-book text-yoga-black flex justify-center items-center"></i> Carnets</button>
      )
    },

    { field: "id", headerName: "Client ID", width: 190, 
      sortable: false,
      editable: false,
      renderCell: ({ row }) => <span title={row.id} onClick={() => displayProfile(row) } className="cinzel text-center">#{row.id}</span>
    },

    { field: "firstname", headerName: "First Name", width: 100, 
      renderCell: ({ value }) => <h1 title={value} className="cinzel font-semibold">{value}</h1>
    },

    { field: "lastname", headerName: "Last Name", width: 100,
      renderCell: ({ value }) => <h1 title={value} className="cinzel font-semibold">{value}</h1>
    },

    { field: "hp", headerName: "HP", width: 50,
      type: "number",
      editable: false,
      renderCell: ({ value }) => <span title={value} className="cinzel font-semibold text-center">{value}</span>
    },

    { field: "sex", headerName: "Sex", width: 50,
      type: "singleSelect",
      valueOptions: ["Male", "Female"],
      renderCell: ({ value }) => <i title={value} className={`fi ${ value.toLowerCase() == 'male' ? "fi-bs-mars text-yoga-green-dark scale-105" : "fi-bs-venus text-yoga-red-dark scale-[1.21]"}`}></i>
    },

    { field: "age", headerName: "Age", width: 100,
        type: "number",
        valueFormatter: ({ value }) => value + " years old"
    },

    { field: "birthdate", headerName: "Birth Date", width: 170,
      type: "date",
      valueFormatter: ({ value }) => dateFormater(value, false)
    },

    { field: "email", headerName: "Email", width: 150,
      sortable: false,
      renderCell: ({ value }) => ( <a title={value} href={`mailto:${value}`} className="hover:text-yoga-green hover:underline underline-offset-4 transition-all">{value}</a> )
    },

    { field: "phone", headerName: "Phone", width: 100,
      sortable: false,
      renderCell: ({ value }) => ( <a title={value} href={whatsappLink(value)} className="hover:text-yoga-green hover:underline underline-offset-4 transition-all">{value}</a> )
    },
    
    { field: "address", headerName: "Address", width: 150,
        sortable: false,
        // using the google maps api to show the address location
        renderCell: ({ value }) => ( <a title={value} href={`https://www.google.com/maps/search/?api=1&query=${value}`} className="hover:text-yoga-green hover:underline underline-offset-4 transition-all" target="_blank" rel="noreferrer">{value}</a> )
    },

    { field: "job", headerName: "Job", width: 150,
      sortable: false,
    },

    { field: "createdAt", headerName: "Registeration Date", width: 260,
      type: "date",
      // formating the date to be like this: 2021 Sep 30 12:00:00
      valueFormatter: ({ value }) => dateFormater(value)
    },

    // filed to show the Client infos
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => displayProfile(row)} title={`Show ${row.firstname} ${row.lastname} profile`} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Show</button>
      )
    },

    // field to update the Client infos
    { field: "update", headerName: "Update", width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => triggerUpdate(row) } title={`Update ${row.firstname} ${row.lastname} profile`} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-green outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}><i className="fi fi-sr-user-pen text-yoga-white flex justify-center items-center"></i></button>
      )
    },

    // field for making a client as deleted
    { field: "delete", headerName: "Delete", width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({row}) => (
        <button onClick={() => { setAlert({...alertMessage("D", "Client"), onConfirm: () => alertAction(() => deleteClient(row.id, row.email)), onCancel: alertAction}) }} title={`Delete ${row.firstname} ${row.lastname} profile`} className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
      )
    }
  ], [alertAction, deleteClient, triggerUpdate, displayProfile, displayCarnets]);

  
  // if data been loading
  if (!clients && DataLoading) return <Loader loading='Loading Clients Data...' />;

  // if there is error loading the data
  if (DataError || !clients) return (
    <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert 
        type="error"
        title="Error Loading Clients Data"
        message="There was an error loading your clients data dashboard. Please try again later."
        confirm={"Try Again"}
        onConfirm={window.location.reload}
        onCancel={closeModal}
      />
    </section>
  )

  return (
    <section className='w-full h-fit flex items-start flex-col'>
      <Box className="w-full h-full sm:h-auto max-w-full min-h-[250px] max-h-screen p-4 flex flex-col gap-4 print:hidden overflow-x-auto">

        <div className={`w-full h-full max-h-14 sm:max-h-10 py-1 sm:py-0 flex justify-between items-center gap-2 overflow-x-auto overflow-y-hidden`}>
          <div className="h-full flex justify-start items-center gap-2">
            <button type="button" onClick={() => { setModal({type: "C"}); setClient({}) }} className="h-full min-w-max px-6 py-2 flex justify-center items-center gap-2 cinzel font-semibold text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all"><i className="fi fi-sr-user-add flex justify-center items-center"></i> <span className="">Add Client</span></button>
            <button type="button" onClick={exportToXLSX} className={`cinzel h-full min-w-max mx-1 px-3 py-2 text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>{(selection.length > 0 && selection.length < clients.length) ? "Export Selected To Excel" : "Export All To Excel"}</button>
            <button type="button" onClick={() => setCarnetsSettings(true)} className="h-full min-w-max px-6 py-2 group flex justify-center items-center gap-2 cinzel font-semibold text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all"><i className="fi fi-sr-settings group-active:rotate-180 flex justify-center items-center transition-all"></i> <span className="">Carnets Settings</span></button>
            <button type="button" onClick={() => setAlert({...alertMessage("DA", "Client"), onConfirm: () => alertAction(deleteMultiClients), onCancel: alertAction})} className={`cinzel h-full min-w-max px-3 py-2 ${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-100" : "translate-y-[100%] scale-0 opacity-0"} text-center uppercase flex justify-center items-center outline outline-2 text-yoga-white -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} ><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i> <span className="ml-2 w-full text text-yoga-white">{(selection.length > 0 && selection.length < clients.length) ? "Delete Selected" : "Delete All"}</span></button>
          </div>
          <div className="h-full flex justify-start items-center gap-2">
            <button type="button" onClick={() => setChartsView(!chartsView)} title={chartsView ? "Show Clients Table" : "Show Clients Charts"}  className={`h-full min-w-max px-6 py-2 flex justify-center items-center gap-2 cinzel font-semibold text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}><i className={`fi ${chartsView ? "fi-sr-table-list" : "fi-sr-chart-pie"} flex justify-center items-center`}></i></button>
          </div>
        </div>

        {/* Alter between chart and table views */}
        {chartsView ? (
          <ClientsChart 
            clients={clients} 
            // carnets={clients.flatMap(client => client.carnets)} 
            carnetsTypes={Object.keys(carnetsConfigs)} 
          />
        ) : (
          <DataGrid
            className="h-fit bg-yoga-white text-lg"
            rows={clients}
            columns={columns}
            loading={DataLoading}
            getRowId={(row) => row.id}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5,20,50]}
            checkboxSelection
            disableRowSelectionOnClick
            // get selected rows
            onRowSelectionModelChange={(selection) => setSelection(selection)}
          />
        )}

      </Box>

      {/* Settings/Cofiguration UI */}
      {carnetsSettings && (
        <div className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
          <CarnetsSettings onReset={() => setCarnetsSettings(false)} />
        </div>
      )}
      
      {/* Client Model */}
      {modal && (
        modal.type === "C" || modal.type === "U" ?
        // Create Client
        <section className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-full print:w-full print:bg-white">
          <div className="relative flex h-[95%] md:w-[70%] w-[95%] max-w-2xl bg-yoga-white overflow-hidden" >
            <img src={client.sex?.toLowerCase() == 'male' ? BGMale : BGFemale} alt="background" className={`h-full w-full select-none object-cover object-center bg-center bg-cover opacity-60`} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 py-6 w-full h-full flex justify-center overflow-y-auto overflow-x-hidden" > 
              <Form
                dark
                animatedIcon
                title={modal.type === "C" ? "Create Client" :  `Update ${client.firstname} ${client.lastname} Infos`}
                fields={clientFields}
                state={[client, setClient]}
                onSubmit={modal.type === "C" ? createClient : updateClient}
                onReset={() => { setModal(null); setClient({}) }}
                ErrorMessage={modal.type === "C" ? "Error Creating Client" : "Error Updating Client"}
                errorTrigger={operationError}
                resetBtn="Cancel"
                submitBtn={modal.type === "C" ? "Create" : "Update"}
                insertElement={
                  modal.type === "U" &&
                  <ul className="cinzel flex flex-col uppercase text-sm text-center text-gray-700">
                    <li><span className="text-gray-500 font-semibold">Client ID:</span> {modal.data.id}</li>
                    <li><span className="text-gray-500 font-semibold">Last Update:</span> {dateFormater(modal.data.updatedAt || modal.data.createdAt)}</li>
                  </ul>
                }
              />
            </div>
          </div>  
        </section> :
        // Show Client Profile
        modal.type === "R-PROFILE" && (
        <section onClick={closeModal} className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white print:before:hidden">
          <ClientLookup client={modal.data} />
        </section>
        ) ||

        // Show Client Carnets
        modal.type === "R-CARNETS" && (
        <section onClick={closeModal} className="absolute h-screen w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white print:before:hidden">
          <Carnets client={modal.data} onClose={reset} configs={carnetsConfigs} />
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
