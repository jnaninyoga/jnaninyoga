import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData } from "../../hooks";
import { useCallback, useMemo, useState } from "react";
import Lockup from "../../layouts/Lookup";
import { dateFormater, supportedLanguages, toXlsx, alertMessage } from "../../utils";
import { names } from "../../firebase/collections";
import { deleteDocument, updateDocument } from "../../firebase";
import Alert from "../../layouts/Alert";
import Stars from "../../components/Stars";
import Loader from "../../layouts/Loader";

export default function Reviews() {
  const [reviews, DataLoading, DataError] = useData(names.reviews);
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

  // delete review
  const deleteReview = useCallback(async (id) => {
    try {
      await deleteDocument(names.reviews, id);
      const restoreReview = async () => await updateDocument(names.reviews, id, {deleted: false});
      setAlert({...alertMessage("D", "Review", true), onConfirm: () => alertAction(restoreReview), onCancel: alertAction, confirm: "Restore"})
    } catch (error) {
      console.error(error);
      // throw an alert error
      setAlert({ ...alertMessage("E", "Review", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(() => deleteReview(id)), onCancel: alertAction })
    }
  }, [alertAction]);

  // delete all reviews
  const deleteMultiReviews = useCallback(async () => {
    try {
      await Promise.all(selection.map((id) => deleteReview(id)));
      const restoreReviews = async () => await Promise.all(selection.map((id) => updateDocument(names.reviews, id, {deleted: false})));
      setAlert({...alertMessage("DA", "Review", true), onConfirm: () => alertAction(restoreReviews), onCancel: alertAction, confirm: "Restore All"})
    } catch (error) {
      console.error(error);
      // throw an alert error
      setAlert({ ...alertMessage("E", "Reviews", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(deleteMultiReviews), onCancel: alertAction })
    }
  }, [selection, deleteReview, alertAction]);

  const exportToXLSX = useCallback(() => {
    const data = (selection.length > 0 ? selection : reviews).map((review) => {
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

  }, [reviews, selection]);

    // close the model when click outside the modal in the parent element
    const closeModal = e =>{
      if(e.target === e.currentTarget){
        setModal(null);
        setAlert({})
      }
    }

  // reviews table columns
  const columns = useMemo(() => [
    { field: "fullname", headerName: "Full Name", width: 150,
      renderCell: ({ value }) => <h1 title={value} className="cinzel font-semibold">{value}</h1>
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
      type: "date",
      // formating the date to be like this: 2021 Sep 30 12:00:00
      valueFormatter: ({ value }) => dateFormater(value)
    },
    // filed to show the contact message info inside a modal
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => { setModal(row); }} title={"Show Review Detailes"} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Show</button>
      )
    },
    // field for making a contact as deleted
    { field: "delete", headerName: "Delete", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => setAlert({...alertMessage("D", "Review"), onConfirm: () => alertAction(() => deleteReview(row.id)), onCancel: alertAction})} title={"Delete This Review"} className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
      )
    }
  ], [alertAction, deleteReview]);

  // if data been loading
  if (!reviews && DataLoading) return <Loader loading='Loading Reviews Data...' />;

  // if there is error loading the data
  if (DataError || !reviews) return (
    <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 print:z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert 
        type="error"
        title="Error Loading Reviews Data"
        message="There was an error loading your Reviews data dashboard. Please try again later."
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
        <button onClick={exportToXLSX} className={`cinzel h-full min-w-max text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>{(selection.length > 0 && selection.length < reviews.length) ? "Export Selected To Excel" : "Export All To Excel"}</button>
        <button onClick={() => setAlert({...alertMessage("DA", "Review"), onConfirm: () => alertAction(deleteMultiReviews), onCancel: alertAction})} className={`${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-100" : "translate-y-[100%] scale-0 opacity-0"} cinzel h-full min-w-max text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 text-yoga-white -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i> <span className="ml-2 text-yoga-white">{(selection.length > 0 && selection.length < reviews.length) ? "Delete Selected" : "Delete All"}</span></button>
      </div>

      <DataGrid
        className="h-fit bg-yoga-white text-lg"
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
          date={dateFormater(modal.createdAt)}
          insertElement={<Stars rate={modal.rate} />}
          details={false}
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
