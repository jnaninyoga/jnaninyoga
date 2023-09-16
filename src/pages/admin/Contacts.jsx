import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData, useSearchParamsSerializer } from "../../hooks";
import { useCallback, useMemo, useState, useEffect } from "react";
import Lookup from "../../layouts/Lookup";
import { dateFormater, supportedLanguages, toXlsx, alertMessage, whatsappLink } from "../../utils";
import { names } from "../../firebase/collections";
import { deleteDocument, updateDocument } from "../../firebase";
import Alert from "../../layouts/Alert";
import Loader from "../../layouts/Loader";

export default function Contacts() {
  const [contacts, DataLoading, DataError] = useData(names.contacts);
  // get the contact id 'CID' from the url search params
  const searchParams = useSearchParamsSerializer();
  
  const [pageSize, setPageSize] = useState(10);

  // selected contact
  const [selection, setSelection] = useState([]);

  // message modal state
  const [modal, setModal] = useState();
  const [alert, setAlert] = useState({});

  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);

  // check if the contact id 'CID' is presented in the search params,and set the Modal with the coresponding contact
  useEffect(() => {
    if(!searchParams.cid) return;
    const contact = contacts.find((contact) => contact.id === searchParams.cid);
    contact && setModal(contact);
  }, [searchParams, contacts]);

  // updating the document in firestore
  const updateContact = useCallback(async (id, data) => {
    try {
      await updateDocument(names.contacts, id, data);
      setModal(null);
      setAlert({...alertMessage("U", "Contact", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Contact", true, "Updating"), confirm: "Try Again", onConfirm: () => alertAction(() => updateContact(id)), onCancel: alertAction })
    }
  }, [alertAction]);

  // update all contacts
  const updateMultiContacts = useCallback(async (data) => {
    try {
      const updateContacts = async () => await Promise.all(selection.map((id) => updateContact(id, data)));
      setAlert({...alertMessage("UA", "Contact"), onConfirm: () => alertAction(updateContacts), onCancel: alertAction})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Contacts", true, "Updating"), confirm: "Try Again", onConfirm: () => alertAction(() => updateMultiContacts(data)), onCancel: alertAction })
    }
  }, [selection, updateContact, alertAction]);

  // delete contact
  const deleteContact = useCallback(async (id) => {
    try {
      await deleteDocument(names.contacts, id);
      const restoreContact = async () => await updateDocument(names.contacts, id, {deleted: false});
      setAlert({...alertMessage("D", "Contact", true), onConfirm: () => alertAction(restoreContact), onCancel: alertAction, confirm: "Restore"})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Contact", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(() => deleteContact(id)), onCancel: alertAction })
    }
  }, [alertAction]);

  // delete all contacts
  const deleteMultiContacts = useCallback(async () => {
    try {
      await Promise.all(selection.map((id) => deleteContact(id)));
      const restoreContacts = async () => await Promise.all(selection.map((id) => updateDocument(names.contacts, id, {deleted: false})));
      setAlert({...alertMessage("DA", "Contact", true), onConfirm: () => alertAction(restoreContacts), onCancel: alertAction, confirm: "Restore All"})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Contacts", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(deleteMultiContacts), onCancel: alertAction })
    }
  }, [selection, alertAction, deleteContact]);

  const exportToXLSX = useCallback(() => {
    const data = (selection.length > 0 ? selection : contacts).map((contact) => {
      // formating the data to be readable
      return {
        "Full Name": contact.fullname,
        "Email": contact.email,
        "Phone Number": contact.phone,
        "Language": contact.lang,
        "Message": contact.message,
        "Answered": contact.answered ? "Yes" : "No",
        "Created At": dateFormater(contact.createdAt)
      }
    });

    // exporting the data to xlsx
    return toXlsx(data, "jnaninyoga-contacts");

  }, [contacts, selection]);

  // close the model when click outside the modal in the parent element
  const closeModal = e =>{
    if(e.target === e.currentTarget){
      setModal(null);
      setAlert({});
    }
  }

  // contacts table columns
  const columns = useMemo(() => [
    { field: "answered", headerName: "Answered", width: 80,
      editable: false,
      // formate the value to be a readable format of "Yes" or "No"
      type: "boolean",
      renderCell: ({ value }) => <div title={value ? "Answered" : "Not Answered"} className={`cinzel text-center flex justify-center items-center font-bold uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] ${value ? "bg-yoga-green" : "bg-yoga-red"} outline-white transition-all duration-300`}><i className={`fi ${value ? "fi-bs-check text-yoga-white" : "fi-bs-cross"} flex justify-center items-center`}></i></div> 
    },
    { field: "fullname", headerName: "Full Name", width: 150, 
      renderCell: ({ value }) => <h1 title={value} className="cinzel font-semibold">{value}</h1>
    },
    { field: "email", headerName: "Email", width: 180,
      sortable: false,
      renderCell: ({ value }) => ( <a title={value} href={`mailto:${value}`} className="hover:text-yoga-green hover:underline underline-offset-4 transition-all">{value}</a> )
    },

    { field: "phone", headerName: "Phone", width: 100,
      sortable: false,
      renderCell: ({ value }) => ( <a title={value} href={whatsappLink(value)} className="hover:text-yoga-green hover:underline underline-offset-4 transition-all">{value}</a> )
    },

    { field: "message", headerName: "Message", width: 200,
      sortable: false,
      // formating the message to be 250 characters max and suffix "..."
      valueFormatter: ({ value }) => value.length > 250 ? `${value.substring(0, 250)}...` : value,

    },

    { field: "lang", headerName: "Language", width: 100,
      type: "singleSelect",
      // choices for the language
      valueOptions: supportedLanguages.map((lang) => lang.name),
    },

    { field: "createdAt", headerName: "Date", width: 260,
      type: "date",
      // formating the date to be like this: 2021 Sep 30 12:00:00
      valueFormatter: ({ value }) => dateFormater(value)
    },
    // action field to delete make the contact as answered or not
    { field: "action", headerName: "Action", width: 300,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex justify-center items-center gap-4">
          <button onClick={() => updateContact(row.id, { answered: true })} title={"Mark This Contact as Answered"} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>Answered</button>
          <button onClick={() => updateContact(row.id, { answered: false })} title={"Mark This Contact as Not Answered"} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Not Answered</button>
        </div>
      )
    },
    // filed to show the contact message info inside a modal
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => { setModal(row); }} title={"show Contact Detailes"} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Show</button>
      )
    },
    // field for making a contact as deleted
    { field: "delete", headerName: "Delete", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => setAlert({...alertMessage("D", "Contact"), onConfirm: () => alertAction(() => deleteContact(row.id)), onCancel: alertAction})} title={"Delete This Contact"} className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
      )
    }
  ], [updateContact, deleteContact, alertAction]);

  // if data been loading
  if (!contacts && DataLoading) return <Loader loading='Loading Contacts Data...' />;

  // if there is error loading the data
  if (DataError || !contacts) return (
    <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 print:z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert 
        type="error"
        title="Error Loading Contacts Data"
        message="There was an error loading your contacts data dashboard. Please try again later."
        confirm={"Try Again"}
        onConfirm={window.location.reload}
        onCancel={closeModal}
      />
    </section>
  )

  return (
    <>
    <Box className={`w-fit max-w-full min-h-[250px] p-4 flex flex-col gap-4`}>

      <div className={`w-full h-full max-h-14 sm:max-h-10 py-1 sm:py-0 flex justify-start items-center gap-2 overflow-x-auto overflow-y-hidden`}>
        <button onClick={exportToXLSX} className={`cinzel h-full min-w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>{(selection.length > 0 && selection.length < contacts.length) ? "Export Selected To Excel" : "Export All To Excel"}</button>
        <button onClick={() => updateMultiContacts({ answered: true })} title={"Mark This Contact as Answered"} className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-150" : "translate-y-[100%] scale-0 opacity-0"} cinzel h-full min-w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>All Answered</button>
        <button onClick={() => updateMultiContacts({ answered: false })} title={"Mark This Contact as Not Answered"} className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-200" : "translate-y-[100%] scale-0 opacity-0"} cinzel h-full min-w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>All Not Answered</button>
        <button onClick={() => setAlert({...alertMessage("DA", "Review"), onConfirm: () => alertAction(deleteMultiContacts), onCancel: alertAction})} className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-100" : "translate-y-[100%] scale-0 opacity-0"} cinzel h-full min-w-max text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 text-yoga-white -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i> <span className="ml-2 text-yoga-white">{(selection.length > 0 && selection.length < contacts.length) ? "Delete Selected" : "Delete All"}</span></button>
      </div>

      <DataGrid
        className="h-fit bg-yoga-white text-lg"
        rows={contacts}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5,20,50]}
        checkboxSelection
        disableRowSelectionOnClick
        // get selected rows
        onRowSelectionModelChange={(selection) => setSelection(selection)}
      />
    </Box>
    {/* message modal */}
    {modal && (
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Lookup
          author={modal.fullname}
          {...modal}
          status={modal.answered}
          statusDisplay={modal.answered ? "Answered" : "Not Answered"}
          date={dateFormater(modal.timestamp)}
          succes="Answered"
          abort="Not Answered"
          forSucces={() => updateContact(modal.id, { answered: true }) }
          forAbort={() => updateContact(modal.id, { answered: false }) }
        />
      </section>
    )}
    {/* alert modal */}
    {alert.title && (
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Alert {...alert} />
      </section>
    )}
    </>
  )
}
