import { useMemo, useState } from "react";
import Form from "../../layouts/Form";
import { accountFields, tokenCoder, tokenDecoder } from "../../utils";
import { useData } from "../../hooks";
import { names } from "../../firebase/collections";
import { updateDocument } from "../../firebase";
import Alert from "../../layouts/Alert";

export default function Account() {
  const { data: { auth } } = useData();
  const [account, setAccount] = useState(tokenDecoder("yogacoach"));
  const [succesModal, setSuccesModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // inject the current account credentials into the form
  const AccountFields = useMemo(() => accountFields.map((field) => {
    field.defaultValue = auth[field.name.toLowerCase()];
    field.emptyError = `Please fill out ${field.name.toLowerCase()}.`;
    return field;
  }), [auth]);

  // update account credentials
  const updateAccount = async (account) => {
    try {
      await updateDocument(names.auth, auth.id, account);
      const { username, password } = account;
      console.log(tokenCoder("yogacoach", { username, password }));
      setSuccesModal(true);
    } catch (error) {
      console.error(error);
      setErrorModal(true);
    }
  }

  return (
    <section className="w-full p-4 flex flex-col gap-4">
        <section className="w-full p-6 flex justify-center items-center bg-texture texture-h">
          <Form
          dark
          title={"Update Credentials"}
          state={[account, setAccount]}
          fields={AccountFields}
          sendBtn={"Update"}
          resetBtn={"Default"}
          onEmpty={"Please fill out all fields."}
          onSubmit={updateAccount}
          onReset={() => setAccount(tokenDecoder("yogacoach"))}
          />
        </section>
        {/* Account Updated Succesfully */}
        {succesModal && (
          <section onClick={() => setSuccesModal(false)} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
            <Alert
            title={"Account Updated Successfully"}
            message={"Your account credentials have been updated successfully."}
            cancel="Close"
            onCancel={() => setSuccesModal(false)}
            />
          </section>
        )}
        {/* Error Updating Account */}
        {errorModal && (
          <section onClick={() => setErrorModal(false)} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
            <Alert
            title={"⛔ Error Updating Account Credentials ⛔"}
            message={"There was an error updating your account credentials. Please try again later."}
            cancel="Close"
            onCancel={() => setErrorModal(false)}
            />
          </section>
        )}
    </section>
  )
}
