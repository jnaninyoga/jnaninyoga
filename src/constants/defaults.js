import { names } from "../firebase/collections";
import { tokenDecoder } from "../utils";
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
	id: 0,
	user: 0,
	completed: false,
	type: "regular",
	period: "2M", // 2 months, periods: 1Y, 6M, 4M, 2M
	sessions: 10, // number of sessions, sessions: 50, 30, 20, 10
	passedSessions: 0, // number of passed sessions
	price: 1500, // price of the carnet, prices: 5000MAD, 3600MAD, 2600MAD, 1500MAD
	paidAmount: 0, // amount paid by the user
	remainingAmount: 1500, // remaining amount to pay
	createdAt: new Date().toDateString(),
}

//   {
//     "sessions": [
//         50,
//         30,
//         20,
//         10
//     ],
//     "prices": [
//         5000,
//         3600,
//         2600,
//         1500
//     ],
//     "periods": [
//         "1Y",
//         "6M",
//         "4M",
//         "2M"
//     ]
// }

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
		case names.users: return [User];
		case names.contacts: return [Contact];
		case names.books: return [Book];
		case names.reviews: return [Review];
		case names.auth: return [tokenDecoder("yogacoach")];
		case names.classes: return sessions;
		default: return [];
	}
}