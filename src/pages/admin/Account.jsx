import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "../../layouts/Form";
import { alertMessage, dateFormater, tokenDecoder } from "../../utils";
import { accountFields } from "../../utils/form";
import { useData } from "../../hooks";
import { names } from "../../firebase/collections";
import { updateDocument } from "../../firebase";
import Alert from "../../layouts/Alert";
import Error from "../../layouts/Error";

export default function Account() {
  const { data: { auth } } = useData();
  const [account, setAccount] = useState(tokenDecoder("yogacoach"));
  const [alert, setAlert] = useState({}); // [title, message, cancel, onCancel, confirm, onConfirm]
  const [error, setError] = useState(false);

  // inject the current account credentials into the form
  const AccountFields = useMemo(() => accountFields.map((field) => {
    field.defaultValue = auth[field.name.toLowerCase()];
    return field;
  }), [auth]);

  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);

  // update account credentials
  const updateAccount = async (account) => {
    try {
      setError(false);
      await updateDocument(names.auth, auth.id, account);
      setAlert({ ...alertMessage("U", "Account Credentials", true), onConfirm: alertAction, onCancel: alertAction});      
    } catch (error) {
      console.error(error);
      setError(true);
      setAlert({ ...alertMessage("E", "Account Credentials", false, "Updating"), confirm: "Try Again", onConfirm: () => alertAction(() => updateAccount(account)), onCancel: alertAction});
    }
  }

  // close the model when click outside the modal in the parent element
  const closeModal = e =>{
    if(e.target === e.currentTarget){
      setAlert({});
    }
  }

  // effect to clear custom error messages
  useEffect(() => {
    if(!error) return
    const timeout = setTimeout(() => {
        setError(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  // if there is error loading account credentials 
  if (!auth) return <Error title={"Error Loading Account Credentials"} error={"There was an error loading your account credentials. Please try again later."} />

  return (
    <section className="w-full p-4 flex flex-col gap-4">
        <section className="w-full p-6 flex justify-center items-center bg-texture texture-h-1 bg-[#efe9e2]] bg-[#eae6e0]] bg-[#f6f1ee]">
          <Form
          dark
          animatedIcon
          title={"Update Credentials"}
          state={[account, setAccount]}
          fields={AccountFields}
          insertElement={<p className="cinzel uppercase text-sm text-center text-gray-500"><span className="text-gray-700">Last Update:</span> {dateFormater(auth.updatedAt)}</p>}
          submitBtn={"Update"}
          resetBtn={"Default"}
          ErrorMessage={"There was an error updating your account credentials. Please try again later."}
          errorTrigger={error}
          onSubmit={updateAccount}
          onReset={() => setAccount(tokenDecoder("yogacoach"))}
          />
        </section>
        {/* Account Alert */}
        {alert.title && (
          <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
            <Alert {...alert} />
          </section>
        )}
    </section>
  )
}
