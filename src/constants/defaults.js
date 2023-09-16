import { names } from "../firebase/collections";
import { supportedLanguages, tokenDecoder } from "../utils";
import sessions from './sessions.json';

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
    medicalhistory:{
        currentcare: "No Current Medical Care",
        currentcareinfo: "",
        record: "No Medical History",
        recordinfo: "",
    },
    physentalstate:{
        physical: [""],
        mental: [""],
    },
    liferhythm:{
        sleep: "good",
        sport:"regulary",
        nutrition:"good",
        meditation:"regulary",
    },
    consultationreason:"",
    createdAt: new Date().toDateString(),
}

export const Carnet = {
    user: 0,
    completed: false,
    type: "regular",
    period: "2M", // 2 months, periods: 1Y, 6M, 4M, 2M
    sessions: 10, // number of sessions, sessions: 50, 30, 20, 10
    passedSessions: 0, // number of passed sessions
    price: 1500, // price of the carnet, prices: 5000MAD, 3600MAD, 2600MAD, 1500MAD
    paidAmount: 0, // amount paid by the user
    reremainingAmount: 1500, // remaining amount to pay
    createdAt: new Date().toDateString(),
}

export function defaultCarnet(period="2M"){
    switch (period.toUpperCase()) {
        case "1Y": return {...Carnet, period, sessions: 50, price: 5000, remainingAmount: 5000};
        case "6M": return {...Carnet, period, sessions: 30, price: 3600, remainingAmount: 3600};
        case "4M": return {...Carnet, period, sessions: 20, price: 2600, remainingAmount: 2600};
        case "2M": return {...Carnet, period, sessions: 10, price: 1500, remainingAmount: 1500};
        default: return {...Carnet, period, sessions: 10, price: 1500, remainingAmount: 1500};
    }
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