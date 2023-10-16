import { useCallback, useEffect, useState } from "react";
import Form from "../../layouts/global/Form";
import { alertMessage, clientIPify, date, dateFormater, tokenDecoder } from "../../utils";
import { accountFields } from "../../utils/form";
import { useData } from "../../hooks";
import { names } from "../../firebase/collections";
import { updateDocument } from "../../firebase";
import Alert from "../../layouts/admin/shared/Alert";
import Loader from "../../layouts/global/Loader";
import { emailLog, sendEmail } from "../../email";

export default function Account() {
  const [auth, DataLoading, DataError] = useData(names.auth);
  const [account, setAccount] = useState(tokenDecoder());
  const [alert, setAlert] = useState({}); // [title, message, cancel, onCancel, confirm, onConfirm]
  const [error, setError] = useState(false);

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
      const clientIP = await clientIPify();
      // sending email to the admin to notify him about the update
      const emaillog = await sendEmail({
        to: import.meta.env.VITE_CONTACT_EMAIL,
        from: {
          name: "Jnain Yoga Coach",
          email: import.meta.env.VITE_CONTACT_EMAIL
        },
        subject: "Account Credentials Updated",
        html: `
          <h1>Account Credentials Updated</h1>
          <p>Account Credentials has been updated by <strong>${auth.username}</strong>, at: <strong>${dateFormater(new Date(await date()).toString())}</strong>, from: <strong>${clientIP.country_name}</strong>, <strong>${clientIP.city}</strong>, <strong>IP: ${clientIP.ip}</strong></p>
        `,
      });
      await emailLog("Update Account Credentials", auth.id, emaillog.messageId);
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

  // if data been loading
  if (!auth && DataLoading) return <Loader loading='Loading Account Credentials Data...' />;

  // if there is error loading account credentials 
  if (DataError || !auth) return (
    <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 print:bg-opacity-100 flex justify-center items-center print:fixed print:left-0 print:top-0 print:z-[200000] print:h-screen print:w-screen print:bg-white">
      <Alert
        type="error"
        title="Error Loading Account Credentials"
        message="There was an error loading your Account Credentials dashboard. Please try again later."
        confirm={"Try Again"}
        onConfirm={window.location.reload}
        onCancel={closeModal}
      />
    </section>
  )

  return (
    <section className="w-full p-4 flex flex-col gap-4">
        <section className="w-full p-6 flex justify-center items-center bg-texture texture-h-1 bg-[#efe9e2]] bg-[#eae6e0]] bg-[#f6f1ee]">
          <Form
          dark
          animatedIcon
          title={"Update Credentials"}
          state={[account, setAccount]}
          fields={accountFields}
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
