// import Brevo
import Brevo from '@getbrevo/brevo'
import { addDocument } from '../firebase';
import { names } from '../firebase/collections';

const defaultClient = Brevo.ApiClient.instance;

// Configure API key authorization: api-key
const APIAUTH = defaultClient.authentications['api-key'];
APIAUTH.apiKey = import.meta.env.VITE_EMAIL_API_KEY;

// export const BrevoApi = new Brevo.AccountApi()
// BrevoApi.getAccount().then(function(data) {
//   console.log('API called successfully. Returned data: ', data);
// }, function(error) {
//   console.error(error);
// });

//// ======== BREVO TRANSACTIONAL EMAILS API ======== ////

const TransacEmailAPI = new Brevo.TransactionalEmailsApi();

// create function that will send email
export async function sendEmail({from, to, subject, html, text}) {
  try {
    const data = await TransacEmailAPI.sendTransacEmail({
      sender: from,
      to: typeof to == "string" ? [{email: to}] : [to.map(email => ({email}))],
      subject: subject,
      htmlContent: html,
      textContent: text,
      replyTo:{
        name: import.meta.env.VITE_EMAIL_DISPLAY_NAME,
        email: import.meta.env.VITE_REPLY_TO_EMAIL
      }
    })
    return data
  } catch (error) {
    console.error("TRANSACTIONAL EMAILS API ERROR:",error);
    throw new Error(error);
  }
}

//// ======== BREVO CONTACTS API ======== ////

const ContactsAPI = new Brevo.ContactsApi();

// create function that will add contact
const CreateContact = new Brevo.CreateContact();
export async function addContact({email, ...attributes}) {
  try {
    CreateContact.email = email;
    CreateContact.listIds = [2]; // list id for the contact
    CreateContact.attributes = {} // reset attributes
    Object.keys(attributes).forEach(key => CreateContact.attributes[key.toUpperCase()] = attributes[key]);
    return await ContactsAPI.createContact(CreateContact);
  } catch (error) {
    console.error("ADDING CONTACTS API ERROR:",error);
    throw new Error(error);
  }
}

// create function that will update contact
const UpdateContact = new Brevo.UpdateContact();
export async function updateContact(email, ...attributes) {
  try {
    Object.keys(attributes).forEach(key => UpdateContact.attributes[key.toUpperCase()] = attributes[key]);
    return await ContactsAPI.updateContact(email, UpdateContact);
  } catch (error) {
    console.error("UPDATING CONTACTS API ERROR:",error);
    throw new Error(error);
  }
}

// create function that will delete contact
export async function deleteContact(email) {
  try {
    return await ContactsAPI.deleteContact(email);
  } catch (error) {
    console.error("DELETING CONTACTS API ERROR:",error);
    throw new Error(error);
  }
}


//// ======== LOGS ======== ////

// email log: rgister email to the database collection emails
export async function emailLog(type, ref, log) {
  const LOG = await addDocument(names.emails, {type, ref, log});
  return LOG;
}