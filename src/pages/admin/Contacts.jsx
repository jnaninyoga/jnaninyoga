import "handyscript/lib/string";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData } from "../../hooks";
import { useCallback, useMemo, useState } from "react";
import Lookup from "../../layouts/Lookup";
import { dateFormater } from "../../utils";
import { names } from "../../firebase/collections";
import { deleteDocument, updateDocument } from "../../firebase";
import Alert from "../../layouts/Alert";

export default function Contacts() {
  const { data: { contacts } } = useData();
  const [pageSize, setPageSize] = useState(10);
  // message modal state
  const [modal, setModal] = useState();
  const [deleteModal, setDeleteModal] = useState();

  // updating the document in firestore
  const updateContact = useCallback(async (id, data) => {
    try {
      await updateDocument(names.contacts, id, data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // delete contact
  const deleteContact = async (id) => {
    try {
      await deleteDocument(names.contacts, id);
    } catch (error) {
      console.error(error);
    }
  }

  // contacts table columns
  const columns = useMemo(() => [
    { field: "answered", headerName: "Answered", width: 80,
      editable: false,
      valueFormatter: ({ value }) => value ? "Yes" : "No",
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

    { field: "message", headerName: "Message", width: 200,
      sortable: false,
      // formating the message to be 250 characters max and suffix "..."
      valueFormatter: ({ value }) => value.length > 250 ? `${value.substring(0, 250)}...` : value,

    },

    { field: "lang", headerName: "Language", width: 100 },

    { field: "timestamp", headerName: "Date", width: 170,
      // formating the date to be like this: 2021 Sep 30 12:00:00
      valueFormatter: ({ value }) => dateFormater(value)
    },
    // action field to delete make the contact as answered or not
    { field: "action", headerName: "Action", width: 300,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex justify-center items-center gap-4">
          <button className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`} onClick={() => updateContact(row.id, { answered: true })}>Answered</button>
          <button className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`} onClick={() => updateContact(row.id, { answered: false })}>Not Answered</button>
        </div>
      )
    },
    // filed to show the contact message info inside a modal
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`} onClick={() => { setModal(row); }}>Show</button>
      )
    },
    // field for making a contact as deleted
    { field: "delete", headerName: "Delete", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} onClick={() => { setDeleteModal(row); }}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
      )
    }
  ], [updateContact]);

  return (
    <>
    <Box className="w-full p-4 flex flex-col gap-4">
      <DataGrid
        className="h-fit bg-yoga-white text-lg"
        rows={contacts}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pageSizeOptions={[5,20,50,100]}
        checkboxSelection
        disableSelectionOnClick
        disableRowSelectionOnClick
      />
    </Box>
    {/* message modal */}
    {modal && (
      <section onClick={() => setModal(null)} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Lookup
          author={modal.fullname}
          {...modal}
          status={modal.answered}
          statusDisplay={modal.answered ? "Answered" : "Not Answered"}
          date={dateFormater(modal.timestamp)}
          succes="Answered"
          abort="Not Answered"
          forSucces={() => updateContact(modal.id, { answered: true })}
          forAbort={() => { updateContact(modal.id, { answered: false }); setModal(null) }}
        />
      </section>
    )}
    {/* delete modal */}
    {deleteModal && (
      <section onClick={() => setDeleteModal(null)} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Alert
          title="Delete Contact"
          message="Are you sure you want to delete this contact?"
          confirm="Delete"
          cancel="Cancel"
          onConfirm={() => { deleteContact(deleteModal.id); setDeleteModal(null); }}
          onCancel={() => setDeleteModal(null)}
        />
      </section>
    )}
    </>
  )
}
