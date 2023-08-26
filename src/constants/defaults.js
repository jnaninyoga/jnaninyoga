import { names } from "../firebase/collections";
import { supportedLanguages, tokenDecoder } from "../utils";
import sessions from '../backup/sessions.json';

// defaut user data:
export const User = {
    id: 0,
    firstname: "",
    lastname: "",
    sex: "female",
    birthdate: new Date().toDateString(),
    age: 0,
    email: "",
    phone: "",
    address: "",
    job: "",
    createdAt: new Date().toDateString(),
}

// default contact:
export const Contact = {
    id: 0,
    fullname: "",
    email: "",
    phone: "",
    message: "",
    lang: supportedLanguages[0].name,
    answered: false,
    createdAt: new Date().toDateString(),
}

// default booked session:
export const Book = {
    id: 0,
    fullname: "",
    email: "",
    phone: "",
    interest: "",
    lang: supportedLanguages[0].name,
    confirmed: false,
    createdAt: new Date().toDateString(),
}

// default review:
export const Review = {
    id: 0,
    fullname: "",
    rate: 5,
    review: "",
    lang: supportedLanguages[0].name,
    createdAt: new Date().toDateString(),
}

// function that return the default data for each collection:
export default function deafultData(collection){
    switch (collection) {
        case names.users: return [User];
        case names.contacts: return [Contact];
        case names.books: return [Book];
        case names.reviews: return [Review];
        case names.auth: return [tokenDecoder("yogacoach")];
        case names.classes: return sessions;
        default: return [];
    }
}