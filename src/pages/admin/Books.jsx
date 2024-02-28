import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData, useActiveBoard } from "../../hooks";
import { useCallback, useMemo, useState, useEffect } from "react";
import Lookup from "../../layouts/admin/shared/Lookup";
import { dateFormater, whatsappLink, supportedLanguages, toXlsx, alertMessage } from "../../utils";
import { names } from "../../firebase/collections";
import { deleteDocument, updateDocument } from "../../firebase";
import Alert from "../../layouts/admin/shared/Alert";
import Loader from "../../layouts/global/Loader";
import { useNavigate } from "react-router-dom";

export default function Books() {
  const [books, DataLoading, DataError] = useData(names.books);

  // selected Book
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);

  // get the booked session id 'BID' from the url search params
  const {boardParams} = useActiveBoard();
  const navigate = useNavigate();

  // message modal state
  const [modal, setModal] = useState();
  const [alert, setAlert] = useState({});

  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);

  // check if the book id 'ID' is presented in the search params,and set the Modal with the coresponding book
  useEffect(() => {
    if(!boardParams.id) return;
    const book = books.find((book) => book.id === boardParams.id);
    book && setModal(book);
  }, [boardParams, books]);

  // updating the document in firestore
  const updateBook = useCallback(async (id, data) => {
    try {
      await updateDocument(names.books, id, data);
      setModal(null);
      setAlert({...alertMessage("U", "Book", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Book", true, "Updating"), confirm: "Try Again", onConfirm: () => alertAction(() => updateBook(id)), onCancel: alertAction })
    }
  }, [alertAction]);

  // update all Books
  const updateMultiBooks = useCallback(async (data) => {
    try {
      const updateBooks = async () => await Promise.all(selection.map((id) => updateBook(id, data)));
      setAlert({...alertMessage("UA", "Book"), onConfirm: () => alertAction(updateBooks), onCancel: alertAction})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Books", true, "Updating"), confirm: "Try Again", onConfirm: () => alertAction(() => updateMultiBooks(data)), onCancel: alertAction })
    }
  }, [selection, updateBook, alertAction]);

  // delete Book
  const deleteBook = useCallback(async (id) => {
    try {
      await deleteDocument(names.books, id);
      const restoreBook = async () => await updateDocument(names.books, id, {deleted: false});
      setAlert({...alertMessage("D", "Book", true), onConfirm: () => alertAction(restoreBook), onCancel: alertAction, confirm: "Restore"})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Book", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(() => deleteBook(id)), onCancel: alertAction })
    }
  }, [alertAction]);

  // delete all Books
  const deleteMultiBooks = useCallback(async () => {
    try {
      await Promise.all(selection.map((id) => deleteBook(id)));
      const restoreBooks = async () => await Promise.all(selection.map((id) => updateDocument(names.books, id, {deleted: false})));
      setAlert({...alertMessage("DA", "Book", true), onConfirm: () => alertAction(restoreBooks), onCancel: alertAction, confirm: "Restore All"})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Books", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(deleteMultiBooks), onCancel: alertAction })
    }
  }, [selection, alertAction, deleteBook]);

  const exportToXLSX = useCallback(() => {
    const data = (selection.length > 0 ? selection : books).map((book) => {
      // formating the data to be readable
      return {
        "ID": book.id,
        "Full Name": book.fullname,
        "Email": book.email,
        "Phone Number": book.phone,
        "Language": book.lang,
        "Interest": book.interest,
        "Confirmed": book.confirmed ? "Yes" : "No",
        "Created At": dateFormater(book.createdAt)
      }
    });

    // exporting the data to xlsx
    return toXlsx(data, "jnaninyoga-booked-sessions");

  }, [books, selection]);

  // close the model when click outside the modal in the parent element
  const closeModal = e =>{
    if(e.target === e.currentTarget){
      setModal(null);
      setAlert({});
      navigate({search: ''});
      navigate(`/lotus/${names.books}`);
    }
  }

  // Books table columns
  const columns = useMemo(() => [
    { field: "confirmed", headerName: "Confirmed", width: 80,
      editable: false,
      // formate the value to be a readable format of "Yes" or "No"
      type: "boolean",
      renderCell: ({ value }) => <div title={value ? "Confirmed" : "Not Confirmed"} className={`cinzel text-center flex justify-center items-center font-bold uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] ${value ? "bg-yoga-green" : "bg-yoga-red"} outline-white transition-all duration-300`}><i className={`fi ${value ? "fi-bs-check text-yoga-white" : "fi-bs-cross"} flex justify-center items-center`}></i></div> 
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

    { field: "interest", headerName: "Client Interest", width: 200,
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
    // action field to delete make the Book as answered or not
    { field: "action", headerName: "Action", width: 300,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex justify-center items-center gap-4">
          <button onClick={() => updateBook(row.id, { confirmed: true })} title={"Mark This Booked Session as Confirmed"} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>Confirmed</button>
          <button onClick={() => updateBook(row.id, { confirmed: false })} title={"Mark This Booked Session as Not Confirmed"} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Not Confirmed</button>
        </div>
      )
    },
    // filed to show the Book message info inside a modal
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => { setModal(row); }} title={"Show Booked Form Detailes"} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Show</button>
      )
    },
    // field for making a Book as deleted
    { field: "delete", headerName: "Delete", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => setAlert({...alertMessage("D", "Book"), onConfirm: () => alertAction(() => deleteBook(row.id)), onCancel: alertAction})} title={"Delete This Booked Form"} className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
      )
    }
  ], [updateBook, deleteBook, alertAction]);

  // if data been loading
  if (!books && DataLoading) return <Loader loading='Loading Booked Sessions Data...' />;

  // if there is error loading the data
  if (DataError || !books) return (
    <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 print:z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert
        type="error"
        title="Error Loading Booked Sessions Data"
        message="There was an error loading your Booked Sessions data dashboard. Please try again later."
        confirm={"Try Again"}
        onConfirm={window.location.reload}
        onCancel={closeModal}
      />
    </section>
  )

  return (
    <>
    <Box className="w-fit max-w-full min-h-[250px] max-h-screen p-4 flex flex-col gap-4">

      <div className={`w-full h-full max-h-14 sm:max-h-10 py-1 sm:py-0 flex justify-start items-center gap-2 overflow-x-auto overflow-y-hidden`}>
        <button onClick={exportToXLSX} className={`cinzel h-full min-w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>{(selection.length > 0 && selection.length < books.length) ? "Export Selected To Excel" : "Export All To Excel"}</button>
        <button onClick={() => updateMultiBooks({ confirmed: true })} title={"Mark This Booked Sessions as Confirmed"} className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-150" : "translate-y-[100%] scale-0 opacity-0"} cinzel h-full min-w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>All Confirmed</button>
        <button onClick={() => updateMultiBooks({ confirmed: false })} title={"Mark This Booked Sessions as Not Confirmed"} className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-200" : "translate-y-[100%] scale-0 opacity-0"} cinzel h-full min-w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>All Not Confirmed</button>
        <button onClick={() => setAlert({...alertMessage("DA", "Review"), onConfirm: () => alertAction(deleteMultiBooks), onCancel: alertAction})} className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-100" : "translate-y-[100%] scale-0 opacity-0"} cinzel h-full min-w-max text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 text-yoga-white -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i> <span className="ml-2 text-yoga-white">{(selection.length > 0 && selection.length < books.length) ? "Delete Selected" : "Delete All"}</span></button>
      </div>

      <DataGrid
        className="h-fit bg-yoga-white text-lg"
        rows={books}
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
    </Box>
    {/* message modal */}
    {modal && (
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Lookup
          author={modal.fullname}
          {...modal}
          status={modal.answered}
          statusDisplay={modal.answered ? "Confirmed" : "Not Confirmed"}
          date={dateFormater(modal.createdAt)}
          succes="Confirmed"
          abort="Not Confirmed"
          forSucces={() => { updateBook(modal.id, { confirmed: true }); setModal(null) }}
          forAbort={() => { updateBook(modal.id, { confirmed: false }); setModal(null) }}
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
