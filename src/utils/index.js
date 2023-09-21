import * as CryptoJS from "crypto-js";
import * as XLSX from "xlsx";
import parsePhoneNumber from "libphonenumber-js";

// Yoga Calander:
export const standardNavbar = [
	"Home",
	"About",
	"Contact",
	"Classes",
	"BookNow",
];
export const standardDays = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
export const standardYogaCoursesTypes = [
	{
		type: "Collective Course",
		desc: "its a collective sessions",
	},
	{
		type: "Private Course",
		desc: "its a private sessions",
	},
	{
		type: "Special Course",
		desc: "its a special sessions",
	},
	{
		type: "Online Course",
		desc: "its an online and live sessions in social media",
	},
];

export const dashboardNavbar = [
	{
		name: "Users",
		icon: "fi fi-sr-users-alt",
	},
	{
		name: "Carnets",
		icon: "fi fi-sr-address-book",
	},
	{
		name: "Sessions",
		icon: "fi fi-sr-calendar",
	},
	/// separator
	{
		name: "Books",
		icon: "fi fi-sr-book-open-reader",
	},
	{
		name: "Contacts",
		icon: "fi fi-ss-headset",
	},
	{
		name: "Reviews",
		icon: "fi fi-sr-star-comment-alt",
	},
	/// separator
	{
		name: "Account",
		icon: "fi fi-sr-user-gear",
	},
];

export const supportedLanguages = [
	{ name: "English", code: "en", dir: "ltr" },
	{ name: "Français", code: "fr", dir: "ltr" },
	{ name: "العربية", code: "ar", dir: "rtl" },
];

export const carnetsPeriodToPriceSessions = {
	// periods: 1Y, 6M, 4M, 2M
	// sessions: 50, 30, 20, 10
	// prices: 5000MAD, 3600MAD, 2600MAD, 1500MAD
	"1Y": {
		sessions: 50,
		price: 5000,
	},
	"6M": {
		sessions: 30,
		price: 3600,
	},
	"4M": {
		sessions: 20,
		price: 2600,
	},
	"2M": {
		sessions: 10,
		price: 1500,
	},
};

// alert message generator based on crud operations "CRUD" & DA: Delete All
export function alertMessage(operation, topic, finished = false, operationDescription = "Operating on") {
	const alert = {
		title: "",
		message: "",
		confirm: "ok",
		cancel: "close",
		type: "info",
	};
	// Alert UI types: "info", "success", "warning", "error"

	switch (operation.toUpperCase()) {
		case "C":
			alert.title = finished ? `${topic} Added` : `Add ${topic}`;
			alert.message = finished ? `The ${topic} has been added successfully` : `Do you want to add the ${topic}?`;
			alert.confirm = finished ? "ok" : "add";
			alert.type = finished ? "success" : "info";
			break;
		case "R":
			alert.title = `${topic} Details`;
			alert.message = `Here are the details of the ${topic}`;
			break;
		case "U":
			alert.title = finished ? `${topic} Updated` : `Update ${topic}`;
			alert.message = finished ? `The ${topic} has been updated successfully` : `Are you sure you want to update this ${topic}?`;
			alert.confirm = finished ? "ok" : "update";
			alert.type = finished ? "success" : "info";
			break;
		case "UA":
			alert.title = finished ? `${topic}s Updated` : `Update Selected ${topic}s`;
			alert.message = finished ? `All the selected ${topic}s has been updated successfully` : `Are you sure you want to update all the selected ${topic}s?`;
			alert.confirm = finished ? "ok" : "update all";
			alert.type = finished ? "success" : "info";
			break;
		case "D":
			alert.title = finished ? `${topic} Deleted` : `Delete ${topic}`;
			alert.message = finished ? `The ${topic} has been deleted successfully` : `Are you sure you want to delete this ${topic}?`;
			alert.confirm = finished ? "ok" : "delete";
			alert.type = finished ? "success" : "warning";
			break;
		case "DA":
			alert.title = finished ? `${topic}s Deleted` : `Delete Selected ${topic}s`;
			alert.message = finished ? `All the selected ${topic}s has been deleted successfully` : `Are you sure you want to delete all the selected ${topic}s?`;
			alert.confirm = finished ? "ok" : "delete";
			alert.type = finished ? "success" : "warning";
			break;
		// Error Alert
		case "E":
			alert.title = `Error ${operationDescription} ${topic}`;
			alert.message = `An error has occured while ${operationDescription} the ${topic}`;
			alert.type = "error";
			break;
		default:
			alert.title = `Unknown Operation`;
			alert.message = `The operation is unknown`;
			break;
	}
	return alert;
}

// formate date to look like this 'monday 26 july 2021 10:30:00'
export function dateFormater(date, withTime = true, withDay = true, local = "en-US") {
	const timeOptions = { hour: "numeric", minute: "numeric", second: "numeric" };
	const dateOptions = { year: "numeric", month: "long", day: "numeric" };
	return new Date(
		typeof date == "string" ? date : date?.seconds * 1000
	).toLocaleDateString(local, {
		...dateOptions,
		...(withDay && { weekday: "long" }),
		...(withTime && timeOptions),
	});
}

export async function date() {
	const APIDate = await (await fetch(`https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`)).json();
	return new Date(APIDate.fulldate);
}

// caclulate the user age from his birthdate using accurate time from: 'https://github.com/davidayalas/current-time' API
export async function userAge(birthdate) {
	try {
		return Math.floor(
			new Date(await date()).getFullYear() - new Date(birthdate).getFullYear()
		);
	} catch (error) {
		console.error("ERROR CALCULATING AGE: ", error);
	}
}

// util function that detect user IP/Geo address:
export async function clientIPify() {
	const ipify = await (await fetch("https://api.ipify.org?format=json")).json();
	const ipgeolocation = await (await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${import.meta.env.VITE_IPGEOLOCATION_API_KEY}&ip=${ipify.ip}`)).json();
	return ipgeolocation;
}

// format a phone number to wa.me link from any phone region using libphonenumber-js
export function whatsappLink(phone) {
	const parsedPhoneNumber = parsePhoneNumber(phone, "MA")?.formatInternational();
	return `https://wa.me/${parsedPhoneNumber?.replace(/\s/g, "") || phone}`;
}

export function tokenDecoder() {
	const token = document.cookie.search(import.meta.env.VITE_AUTH_COOKIE_NAME) !== -1 ? JSON.parse(document.cookie.split(";").find((cookie) => cookie.includes(import.meta.env.VITE_AUTH_COOKIE_NAME)).split("=")[1]) : null;
	return { 
		...token,
		password: token ? CryptoJS.AES.decrypt(decodeURIComponent(token.password), import.meta.env.VITE_AUTH_SECRET).toString(CryptoJS.enc.Utf8) : null,
	};
}

export function tokenCoder(token) {
	const date = new Date();
	const Token = { ...token, password: token.password };
	date.setTime(date.getTime() + import.meta.env.VITE_AUTH_SESSION_EXPIRES * 1 * 24 * 60 * 60 * 1000);
	Token.password = encodeURIComponent(CryptoJS.AES.encrypt(Token.password, import.meta.env.VITE_AUTH_SECRET).toString());
	document.cookie = `${import.meta.env.VITE_AUTH_COOKIE_NAME}=${JSON.stringify(Token)}; expires=${date.toUTCString()}; path=/`;
	return Token;
}

export function toXlsx(data, filename) {
	const wb = XLSX.utils.book_new();
	wb.Props = {
		Title: filename,
		Subject: "Exported Data",
	};
	wb.SheetNames.push("Data");
	const ws = XLSX.utils.json_to_sheet(data);
	wb.Sheets["Data"] = ws;
	const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

	function s2ab(s) {
		const buf = new ArrayBuffer(s.length);
		const view = new Uint8Array(buf);
		for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
		return buf;
	}

	function saveAs(blob, filename) {
		const a = document.createElement("a");
		a.href = window.URL.createObjectURL(blob);
		a.download = filename;
		a.click();
	}

	saveAs(
		new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
		`${filename}.xlsx`
	);
}

export function copyright(hostname = window.location.hostname) {
	return `Copyright © ${new Date().getFullYear()} ${hostname}, All Rights Reserved`;
}
