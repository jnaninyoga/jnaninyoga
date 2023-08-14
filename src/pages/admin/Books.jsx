import "handyscript/lib/string";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData } from "../../hooks";
import { useCallback, useMemo, useState } from "react";
import Lookup from "../../layouts/Lookup";
import { dateFormater, supportedLanguages, toXlsx } from "../../utils";
import { names } from "../../firebase/collections";
import { deleteDocument, updateDocument } from "../../firebase";
import Alert from "../../layouts/Alert";

export default function Books() {
  const { loading, data: { books } } = useData();
  
  const [pageSize, setPageSize] = useState(10);

  // selected Book
  const [selection, setSelection] = useState([]);

  // message modal state
  const [modal, setModal] = useState();
  const [deleteModal, setDeleteModal] = useState();

  // updating the document in firestore
  const updateBook = useCallback(async (id, data) => {
    try {
      await updateDocument(names.books, id, data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // update all Books
  const updateAllBooks = useCallback(async (data) => {
    try {
      await Promise.all(selection.map((id) => updateBook(id, data)));
    } catch (error) {
      console.error(error);
    }
  }, [selection, updateBook]);

  // delete Book
  const deleteBook = async (id) => {
    try {
      await deleteDocument(names.books, id);
    } catch (error) {
      console.error(error);
    }
  }

  // delete all Books
  const deleteAllBooks = useCallback(async () => {
    try {
      await Promise.all(selection.map((id) => deleteBook(id)));
    } catch (error) {
      console.error(error);
    }
  }, [selection]);

  const exportToXLSX = useCallback(() => {
    const data = books.map((book) => {
      // formating the data to be readable
      return {
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

  }, [books]);

  // close the model when click outside the modal in the parent element
  const closeModal = e =>{
    if(e.target === e.currentTarget){
      setModal(null);
      setDeleteModal(null)
    }
  }

  // Books table columns
  const columns = useMemo(() => [
    { field: "confirmed", headerName: "Confirmed", width: 80,
      editable: false,
      // formate the value to be a readable format of "Yes" or "No"
      type: "boolean",
      renderCell: ({ value }) => <div className={`cinzel text-center flex justify-center items-center font-bold uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] ${value ? "bg-yoga-green" : "bg-yoga-red"} outline-white transition-all duration-300`}><i className={`fi ${value ? "fi-bs-check text-yoga-white" : "fi-bs-cross"} flex justify-center items-center`}></i></div> 
    },
    { field: "fullname", headerName: "Full Name", width: 150, 
      renderCell: ({ value }) => <h1 className="cinzel font-semibold">{value}</h1>
    },
    { field: "email", headerName: "Email", width: 180,
      sortable: false,
      renderCell: ({ value }) => ( <a href={`mailto:${value}`}>{value}</a> )
    },

    { field: "phone", headerName: "Phone", width: 100,
      sortable: false,
      renderCell: ({ value }) => ( <a href={`https://wa.me/${value}`}>{value}</a> )
    },

    { field: "interest", headerName: "User Interest", width: 200,
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
          <button className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`} onClick={() => updateBook(row.id, { confirmed: true })}>Confirmed</button>
          <button className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`} onClick={() => updateBook(row.id, { confirmed: false })}>Not Confirmed</button>
        </div>
      )
    },
    // filed to show the Book message info inside a modal
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`} onClick={() => { setModal(row); }}>Show</button>
      )
    },
    // field for making a Book as deleted
    { field: "delete", headerName: "Delete", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} onClick={() => { setDeleteModal(row); }}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
      )
    }
  ], [updateBook]);

  return (
    <>
    <Box className="w-full p-4 flex flex-col gap-4">

      <div className={`w-full flex items-center gap-20 ${selection.length > 0 && "p-2 overflow-auto overflow-y-hidden"}`}>
        <div className="flex justify-center items-center gap-4">
          <button className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-100" : "translate-y-[100%] scale-0 opacity-0"} cinzel w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`} onClick={() => updateAllBooks({ confirmed: true })}>All Confirmed</button>
          <button className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-150" : "translate-y-[100%] scale-0 opacity-0"} cinzel w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`} onClick={() => updateAllBooks({ confirmed: false })}>All Not Confirmed</button>
        </div>
        <div className="flex justify-center items-center gap-4">
          <button className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-200" : "translate-y-[100%] scale-0 opacity-0"} cinzel w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`} onClick={exportToXLSX}>Export To Excel</button>
          <button className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-300" : "translate-y-[100%] scale-0 opacity-0"} cinzel w-max text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 text-yoga-white -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} onClick={() => setDeleteModal("deleteall")}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i> <span className="ml-2 text-yoga-white">Delete All</span></button>
        </div>
      </div>

      <DataGrid
        className="h-fit bg-yoga-white text-lg"
        loading={loading}
        rows={books}
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
          statusDisplay={modal.answered ? "Confirmed" : "Not Confirmed"}
          date={dateFormater(modal.timestamp)}
          succes="Confirmed"
          abort="Not Confirmed"
          forSucces={() => { updateBook(modal.id, { confirmed: true }); setModal(null) }}
          forAbort={() => { updateBook(modal.id, { confirmed: false }); setModal(null) }}
        />
      </section>
    )}
    {/* delete modal */}
    {deleteModal && (
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Alert
          title={deleteModal === "deleteall" ? "Delete All Books" : "Delete Book"}
          message={deleteModal === "deleteall" ? "Are you sure you want to delete all the Books?" : "Are you sure you want to delete this Book?"}
          confirm="Delete"
          cancel="Cancel"
          onConfirm={() => { deleteModal === "deleteall" ? deleteAllBooks() : deleteBook(deleteModal.id); setDeleteModal(null) }}
          onCancel={() => setDeleteModal(null)}
        />
      </section>
    )}
    </>
  )
}
