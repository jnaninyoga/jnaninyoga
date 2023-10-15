import BGMale from '../../assets/imgs/spine/bg-male-texture.png';
import BGFemale from '../../assets/imgs/spine/bg-female-texture.jpg';
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useData, useSearchParamsSerializer } from "../../hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dateFormater, whatsappLink, toXlsx, alertMessage, userAge, carnetPicker } from "../../utils";
import { userFields } from "../../utils/form";
import { names } from "../../firebase/collections";
import { addRefDocument, deleteOnCascade, updateDocument } from "../../firebase";
import Alert from "../../layouts/admin/shared/Alert";
import Form from "../../layouts/global/Form";
import UserLookup from "../../layouts/admin/users/UserLookup";
import Loader from '../../layouts/global/Loader';
import { addContact, deleteContact, updateContact } from '../../email';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const [users, DataLoading, DataError] = useData(names.users);
  const [user, setUser] = useState({});
  const [operationError, setOperationError] = useState(false); // error creating or updating the user

  // get the user id 'UID' from the url search params
  const searchParams = useSearchParamsSerializer();
  const navigate = useNavigate();
  
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState([]);

  // message modal state
  const [modal, setModal] = useState({type: '', data: ''});
  const [alert, setAlert] = useState({});

  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);

  // check if the user id 'UID' is presented in the search params,and set the Modal with the coresponding user
  useEffect(() => {
    if(!searchParams.id) return;
    const user = users.find((user) => user.id === searchParams.id);
    user && setModal({type: "R", data: user});
  }, [searchParams, users]);

  const triggerUpdate = useCallback(user => {
    const flattenUser = Object.entries(user).reduce((acc, [key, value]) => {
      // check if the value is object and not instence of Date
      if(typeof value === 'object' && key !== "createdAt" && key !== "updatedAt"){
        acc = {...acc, ...value};
      }else{
        acc[key] = value;
      }
      return acc;
    }, {});
    setUser(flattenUser);
    setModal({type: "U", data: user});
  }, []);


  // create User
  const createUser = useCallback(async (user) => {
    try {
      // clear the form error message
      setOperationError(false);
      await addRefDocument(names.users, {...user, age: await userAge(user.birthdate)}, names.carnets, carnetPicker(), 'user');
      await addContact({firstname:user.firstname, lastname:user.lastname, sex:user.sex, birthdate:user.birthdate, email:user.email, sms:user.phone})
      setModal(null);
      setAlert({...alertMessage("C", "User", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error(error);
      setOperationError(true);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "User", true, "Creating"), confirm: "Try Again", onConfirm: () => alertAction(async () => await createUser(user)), onCancel: alertAction })
    }
  }, [alertAction]);

  // delete User
  const deleteUser = useCallback(async (id) => {
    try {
      await deleteContact(users.find(user => user.id === id).email)
      setAlert({...alertMessage("D", "Brevo Contact", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Brevo Contact", true, "Deleting"), confirm: "Try Again", onConfirm: alertAction, onCancel: alertAction })
    }
    try {
      await deleteOnCascade(names.users, id, names.carnets, 'user');
      const restoreUser = async () => await deleteOnCascade(names.users, id, names.carnets, 'user', true);
      setAlert({...alertMessage("D", "User", true), onConfirm: () => alertAction(restoreUser), onCancel: alertAction, confirm: "Restore"})
    } catch (error) {
      console.error(error);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "User", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(async () => await deleteUser(id)), onCancel: alertAction })
    }
  }, [alertAction, users]);

  // delete all Users
  const deleteMultiUsers = useCallback(async () => {
    try {
      await Promise.all(selection.map(async id => await deleteUser(id)));
      const restoreUsers = async () => await Promise.all(selection.map(async id => await deleteOnCascade(names.users, id, names.carnets, 'user', true)));
      setAlert({...alertMessage("DA", "User", true), onConfirm: () => alertAction(restoreUsers), onCancel: alertAction, confirm: "Restore All"})
    } catch (error) {
      console.error(error);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "Users", true, "Deleting"), confirm: "Try Again", onConfirm: () => alertAction(deleteMultiUsers), onCancel: alertAction })
    }
  }, [selection, deleteUser, alertAction]);

  // update User
  const updateUser = useCallback(async (user) => {
    try {
      // clear the form error message
      setOperationError(false);
      await updateDocument(names.users, modal.data.id, {...user, age: await userAge(user.birthdate)});
      await updateContact(modal.data.email, {firstname:user.firstname, lastname:user.lastname, sex:user.sex, birthdate:user.birthdate, email:user.email, sms:user.phone})
      setModal(null);
      setAlert({...alertMessage("U", "User", true), onConfirm: alertAction, onCancel: alertAction})
    } catch (error) {
      console.error(error);
      setOperationError(true);
      // throw an error alert to try again
      setAlert({ ...alertMessage("E", "User", true, "Updating"), confirm: "Try Again", onConfirm: () => alertAction(async () => await updateUser(user)), onCancel: alertAction })
    }
  }, [alertAction, modal]);



  const exportToXLSX = useCallback(() => {
    // check if there is a selected rows export the selected rows else export all rows
    const data = (selection.length > 0 ? selection : users).map((user) => {
    // formating the data to be readable
    return {
        "ID": user.id,
        "First Name": user.firstname,
        "Last Name": user.lastname,
        "Sex": user.sex,
        "Birth Date": dateFormater(user.birthdate, false),
        "age": user.age,
        "Job": user.job,
        "Address": user.address,
        "Email": user.email,
        "Phone Number": user.phone,
        "Registeration Date": dateFormater(user.createdAt),
        "Current Care": user.medicalhistory.currentcare,
        "Current Care Information": user.medicalhistory.currentcareinfo,
        "Medical History": user.medicalhistory.record,
        "Medical History Information": user.medicalhistory.recordinfo,
        "Physical Health": user.physentalstate.physical.join(", "),
        "Mental Health": user.physentalstate.mental.join(", "),
        "Sleep Rhythm": user.liferhythm.sleep,
        "Nutrition Rhythm": user.liferhythm.nutrition,
        "Sport Activity": user.liferhythm.sport,
        "Meditation Activity": user.liferhythm.meditation
      }
    });

    // exporting the data to xlsx
    return toXlsx(data, "jnaninyoga-users");

  }, [users, selection]);

  // close the model when click outside the modal in the parent element
  const closeModal = e =>{
    if(e.target === e.currentTarget){
      setModal(null);
      setAlert({});
      navigate({search: ""});
    }
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
    { field: "id", headerName: "User ID", width: 190, 
      sortable: false,
      editable: false,
    },

    { field: "firstname", headerName: "First Name", width: 100, 
      renderCell: ({ value }) => <h1 title={value} className="cinzel font-semibold">{value}</h1>
    },

    { field: "lastname", headerName: "Last Name", width: 100,
      renderCell: ({ value }) => <h1 title={value} className="cinzel font-semibold">{value}</h1>
    },

    { field: "sex", headerName: "Sex", width: 70,
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

    // filed to show the User infos
    { field: "show", headerName: "Show", width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => setModal({type: "R", data: row}) } title={`Show ${row.firstname} ${row.lastname} profile`} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Show</button>
      )
    },

    // field to update the User infos
    { field: "update", headerName: "Update", width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <button onClick={() => triggerUpdate(row) } title={`Update ${row.firstname} ${row.lastname} profile`} className={`cinzel text-center uppercase px-3 py-2 outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-green outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}><i className="fi fi-sr-user-pen text-yoga-white flex justify-center items-center"></i></button>
      )
    },

    // field for making a user as deleted
    { field: "delete", headerName: "Delete", width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({row}) => (
        <button onClick={() => { setAlert({...alertMessage("D", "User"), onConfirm: () => alertAction(() => deleteUser(row.id, row.email)), onCancel: alertAction}) }} title={`Delete ${row.firstname} ${row.lastname} profile`} className={`cinzel text-center uppercase px-3 py-2 flex justify-center items-center outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
      )
    }
  ], [alertAction, deleteUser, triggerUpdate]);

  
  // if data been loading
  if (!users && DataLoading) return <Loader loading='Loading Users Data...' />;

  // if there is error loading the data
  if (DataError || !users) return (
    <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert 
        type="error"
        title="Error Loading Users Data"
        message="There was an error loading your users data dashboard. Please try again later."
        confirm={"Try Again"}
        onConfirm={window.location.reload}
        onCancel={closeModal}
      />
    </section>
  )

  return (
    <>
    <Box className="w-fit max-w-full min-h-[250px] p-4 flex flex-col gap-4 print:hidden overflow-x-auto">

      <div className={`w-full h-full max-h-14 sm:max-h-10 py-1 sm:py-0 flex justify-start items-center gap-2 overflow-x-auto overflow-y-hidden`}>
        <button type="button" onClick={() => { setModal({type: "C"}); setUser({}) }} className="h-full min-w-max px-6 py-2 flex justify-center items-center gap-2 cinzel font-semibold text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all"><i className="fi fi-sr-user-add flex justify-center items-center"></i> <span className="">Add User</span></button>
        <button type="button" onClick={exportToXLSX} className={`cinzel h-full min-w-max mx-1 px-3 py-2 text-center uppercase outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>{(selection.length > 0 && selection.length < users.length) ? "Export Selected To Excel" : "Export All To Excel"}</button>
        <button type="button" onClick={() => setAlert({...alertMessage("DA", "User"), onConfirm: () => alertAction(deleteMultiUsers), onCancel: alertAction})} className={`cinzel h-full min-w-max px-3 py-2 ${selection.length > 0 ? "translate-y-0 scale-100 opacity-100 delay-100" : "translate-y-[100%] scale-0 opacity-0"} text-center uppercase flex justify-center items-center outline outline-2 text-yoga-white -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} ><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i> <span className="ml-2 w-full text text-yoga-white">{(selection.length > 0 && selection.length < users.length) ? "Delete Selected" : "Delete All"}</span></button>
      </div>

      <DataGrid
        className="h-fit bg-yoga-white text-lg"
        rows={users}
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
    
    {/* User Model */}
    {modal && (
      modal.type === "C" || modal.type === "U" ?
      // Create User
      <section className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-full print:w-full print:bg-white">
          <div className="relative flex h-[95%] md:w-[70%] w-[95%] max-w-2xl bg-yoga-white overflow-hidden" >
              <img src={user.sex?.toLowerCase() == 'male' ? BGMale : BGFemale} alt="background" className={`h-full w-full select-none object-cover object-center bg-center bg-cover opacity-60`} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 py-6 w-full h-full flex justify-center overflow-y-auto overflow-x-hidden" > 
                <Form
                  dark
                  animatedIcon
                  title={modal.type === "C" ? "Create User" :  `Update ${user.firstname} ${user.lastname} Infos`}
                  fields={userFields}
                  state={[user, setUser]}
                  onSubmit={modal.type === "C" ? createUser : updateUser}
                  onReset={() => { setModal(null); setUser({}) }}
                  ErrorMessage={modal.type === "C" ? "Error Creating User" : "Error Updating User"}
                  errorTrigger={operationError}
                  resetBtn="Cancel"
                  submitBtn={modal.type === "C" ? "Create" : "Update"}
                  insertElement={
                    modal.type === "U" &&
                    <ul className="cinzel flex flex-col uppercase text-sm text-center text-gray-700">
                      <li><span className="text-gray-500 font-semibold">User ID:</span> {modal.data.id}</li>
                      <li><span className="text-gray-500 font-semibold">Last Update:</span> {dateFormater(modal.data.updatedAt || modal.data.createdAt)}</li>
                    </ul>
                  } 
                />
              </div>
          </div>  
      </section> :
      // Show User
      modal.type === "R" &&
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 z-[200000] print:h-screen print:w-screen print:bg-white">
        <UserLookup user={modal.data} />
      </section>
    )}

    {/* Alert Message */}
    {alert.title && (
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center z-[200100]">
        <Alert {...alert} />
      </section>
    )}
    </>
  )
}
