import { names } from "../firebase/collections";
import { tokenDecoder } from "../utils";
import sessions from './sessions.json';

// defaut client data:
export const Client = {
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
	id: 0,
	order: 1,
	type: "regular",
	status: "active",
		// "active", // ? if the carnet is active
		// "paid", // ? if the carnet is fully paid
		// "cancelled", // ? if the carnet is cancelled
	
	period: "2M", // 2 months, periods: 1Y, 6M, 4M, 2M
	sessions: 10, // number of sessions, sessions: 50, 30, 20, 10
	passedSessions: 0, // number of passed sessions
	progress: 0, // progress in percentage
	price: 1500, // price of the carnet, prices: 5000MAD, 3600MAD, 2600MAD, 1500MAD
	remainingAmount: 1500, // remaining amount to pay
	payments: [], // payments history
	createdAt: new Date().toDateString(),
}

// default contact:
export const Contact = {
	id: 0,
	fullname: "",
	email: "",
	phone: "",
	message: "",
	lang: "English",
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
	lang: "English",
	confirmed: false,
	createdAt: new Date().toDateString(),
}

// default review:
export const Review = {
	id: 0,
	fullname: "",
	rate: 5,
	review: "",
	lang: "English",
	createdAt: new Date().toDateString(),
}

// function that return the default data for each collection:
export default function deafultData(collection){
	switch (collection) {
		case names.clients: return [Client];
		case names.contacts: return [Contact];
		case names.books: return [Book];
		case names.reviews: return [Review];
		case names.auth: return [tokenDecoder("yogacoach")];
		case names.classes: return sessions;
		default: return [];
	}
}