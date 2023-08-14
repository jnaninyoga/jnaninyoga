import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData } from "../../hooks";
import { useCallback, useMemo, useState } from "react";
import Lockup from "../../layouts/Lookup";
import { dateFormater, supportedLanguages, toXlsx } from "../../utils";
import { names } from "../../firebase/collections";
import { deleteDocument } from "../../firebase";
import Alert from "../../layouts/Alert";
import Stars from "../../components/Stars";

export default function Reviews() {
  const { loading, data: { reviews } } = useData();
  const [pageSize, setPageSize] = useState(10);

  // selected contact
  const [selection, setSelection] = useState([]);

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

  // delete all reviews
  const deleteAllReviews = useCallback(async () => {
    try {
      await Promise.all(selection.map((id) => deleteReview(id)));
    } catch (error) {
      console.error(error);
    }
  }, [selection]);

  const exportToXLSX = useCallback(() => {
    const data = reviews.map((review) => {
      // formating the data to be readable
      return {
        "Full Name": review.fullname,
        "Rate": "⭐".repeat(review.rate) + "☆".repeat(5 - review.rate) + ` (${review.rate}/5)`,
        "Review": review.review,
        "Language": review.lang,
        "Date": dateFormater(review.createdAt),
      }
    });

    // creating the excel file
    return toXlsx(data, "jnaninyoga-reviews");

  }, [reviews]);

    // close the model when click outside the modal in the parent element
    const closeModal = e =>{
      if(e.target === e.currentTarget){
        setModal(null);
        setDeleteModal(null)
      }
    }

  // reviews table columns
  const columns = useMemo(() => [
    { field: "fullname", headerName: "Full Name", width: 150,
      renderCell: ({ value }) => <h1 className="cinzel font-semibold">{value}</h1>
    },

    { field: "rate", headerName: "Rate", width: 160,
      type: "singleSelect",
      valueOptions: [1, 2, 3, 4, 5],
      renderCell: ({ value }) => <Stars rate={value} />
    },

    { field: "review", headerName: "Review", width: 300,
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
      type: "dateTime",
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

      <div className={`flex items-center gap-20`}>
        <div className="flex justify-center items-center gap-4">
          <button className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-150" : "translate-y-[100%] scale-0 opacity-0"} cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`} onClick={exportToXLSX}>Export To Excel</button>
          <button className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-200" : "translate-y-[100%] scale-0 opacity-0"} cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 text-yoga-white -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} onClick={() => setDeleteModal("deleteall")}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i> <span className="ml-2 text-yoga-white">Delete All</span></button>
        </div>
      </div>

      <DataGrid
        className="h-fit bg-yoga-white text-lg"
        loading={loading}
        rows={reviews}
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
        <Lockup
          author={modal.fullname}
          message={modal.review}
          lang={modal.lang}
          date={dateFormater(modal.timestamp)}
          insertElement={<Stars rate={modal.rate} />}
          details={false}
        />
      </section>
    )}
    {/* delete modal */}
    {deleteModal && (
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <Alert
          title={deleteModal === "deleteall" ? "Delete All Reviews" : "Delete Review"}
          message={deleteModal === "deleteall" ? "Are you sure you want to delete all reviews?" : "Are you sure you want to delete this review?"}
          confirm="Delete"
          cancel="Cancel"
          onConfirm={() => { deleteModal === "deleteall" ? deleteAllReviews() : deleteReview(deleteModal.id); setDeleteModal(null); }}
          onCancel={() => setDeleteModal(null)}
        />
      </section>
    )}
    </>
  )
}
