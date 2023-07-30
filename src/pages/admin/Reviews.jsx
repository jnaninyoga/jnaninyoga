import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData } from "../../hooks";
import { useMemo, useState } from "react";
import Lockup from "../../layouts/Lookup";
import { dateFormater } from "../../utils";
import { names } from "../../firebase/collections";
import { deleteDocument } from "../../firebase";
import Alert from "../../layouts/Alert";
import Stars from "../../components/Stars";

export default function Reviews() {
  const { loading, data: { reviews } } = useData();
  const [pageSize, setPageSize] = useState(10);
  // message modal state
  const [modal, setModal] = useState();
  const [deleteModal, setDeleteModal] = useState();

  // delete review
  const deleteReview = async (id) => {
    try {
      await deleteDocument(names.reviews, id);
    } catch (error) {
      console.error(error);
    }
  }

  // reviews table columns
  const columns = useMemo(() => [
    { field: "fullname", headerName: "Full Name", width: 150,
      renderCell: ({ value }) => <h1 className="cinzel font-semibold">{value}</h1>
    },

    { field: "rate", headerName: "Rate", width: 160,
      renderCell: ({ value }) => <Stars rate={value} />
    },

    { field: "review", headerName: "Review", width: 300,
      sortable: false,
      // formating the message to be 250 characters max and suffix "..."
      valueFormatter: ({ value }) => value.length > 250 ? `${value.substring(0, 250)}...` : value,
    },

    { field: "lang", headerName: "Language", width: 100 },

    { field: "timestamp", headerName: "Date", width: 170,
      // formating the date to be like this: 2021 Sep 30 12:00:00
      valueFormatter: ({ value }) => dateFormater(value)
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
  ], []);

  return (
    <>
    <Box className="w-full p-4 flex flex-col gap-4">
      <DataGrid
        className="h-fit bg-yoga-white text-lg"
        loading={loading}
        rows={reviews}
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
        <Lockup
          author={modal.fullname}
          message={modal.review}
          lang={modal.lang}
          date={dateFormater(modal.timestamp)}
          insertElement={<Stars rate={modal.rate} />}
          details={false}
          // forSucces={() => updateContact(modal.id, { answered: true })}
          // forAbort={() => { updateContact(modal.id, { answered: false }); setModal(null) }}
        />
      </section>
    )}
    {/* delete modal */}
    {deleteModal && (
      <section onClick={() => setDeleteModal(null)} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Alert
          title="Delete Review"
          message="Are you sure you want to delete this Review?"
          confirm="Delete"
          cancel="Cancel"
          onConfirm={() => { deleteReview(deleteModal.id); setDeleteModal(null); }}
          onCancel={() => setDeleteModal(null)}
        />
      </section>
    )}
    </>
  )
}
