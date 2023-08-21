import * as CryptoJS from "crypto-js";
import * as XLSX from "xlsx";

// Classes - Stock Images
import C1 from "../assets/imgs/stock/classes-1.webp";
import C2 from "../assets/imgs/stock/classes-2.webp";
import C3 from "../assets/imgs/stock/classes-3.webp";
import C4 from "../assets/imgs/stock/classes-4.webp";
import C5 from "../assets/imgs/stock/classes-5.webp";
// Studio - Stock Images
import S1 from "../assets/imgs/stock/studio-1.webp";
import S2 from "../assets/imgs/stock/studio-2.webp";
import S3 from "../assets/imgs/stock/studio-3.webp";
import S4 from "../assets/imgs/stock/studio-4.webp";
import S5 from "../assets/imgs/stock/studio-5.webp";
// Yoga - Stock Images
import Y1 from "../assets/imgs/stock/yoga-1.webp";
import Y2 from "../assets/imgs/stock/yoga-2.webp";
import Y3 from "../assets/imgs/stock/yoga-3.webp";
import Y4 from "../assets/imgs/stock/yoga-4.webp";
import Y5 from "../assets/imgs/stock/yoga-5.webp";

export const OverviewStockImgs = {
    classes: [C1, C2, C3, C4, C5],
    studio: [S1, S2, S3, S4, S5],
    yoga: [Y1, Y2, Y3, Y4, Y5]
};

// Yoga Calander:
export const standardNavbar = ["Home","About","Contact","Classes", "BookNow"];
export const dashboardNavbar = ["Contacts","Reviews","Books"];
export const usersDashboardNavbar = ["Users","Carnets","Classes"];
export const standardDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const standardYogaCoursesTypes = [
    {
        type: "Collective Course",
        desc: "its a collective sessions"
    },
    {
        type: "Private Course",
        desc: "its a private sessions"
    },
    {
        type: "Special Course",
        desc: "its a special sessions"
    },
    {
        type: "Online Course",
        desc: "its an online and live sessions in social media"
    }
];

/// Dashboard allowed search fields
export const usersSearchFields = ["firstname", "lastname", "job",  "phone", "address", "date"];

export const dashboardNavicons = {
    contacts: "fi fi-ss-headset",
    reviews: "fi fi-sr-star-comment-alt",
    books: "fi fi-sr-book-open-reader",
    classes: "fi fi-sr-calendar",
    account: "fi fi-sr-user-gear",
    users: "fi fi-sr-users-alt",
    carnets: "fi fi-sr-address-book",
}

export const supportedLanguages = [
    {name: 'English', code: 'en', dir: 'ltr'},
    {name: 'Français', code: 'fr', dir: 'ltr'},
    {name: 'العربية', code: 'ar', dir: 'rtl'}
];

// alert message generator based on crud operations "CRUD" & DA: Delete All
export function alertMessage(operation, topic, finished=false, operationDescription="Operating on"){
    const alert = {title: "", message: "", confirm: "ok", cancel: "close", type: "info"};
    // Alert UI types: "info", "success", "warning", "error"

    switch(operation.toUpperCase()){
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
            alert.message = `An error has occured while ${operationDescription} the ${topic}`
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
export function dateFormater(date, withTime=true, withDay=true, local="en-US"){
    const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(typeof date == "string" ? date : date?.seconds * 1000).toLocaleDateString(local, {...dateOptions, ...(withDay && {weekday: 'long'}), ...(withTime && timeOptions)})
}

export function tokenDecoder(secret){
    const token = document.cookie.search(secret) !== -1 ? JSON.parse(document.cookie.split(";").find(cookie => cookie.includes(secret)).split("=")[1]) : null;
    return {
        ...token,
        password: token ? CryptoJS.AES.decrypt(decodeURIComponent(token.password), secret).toString(CryptoJS.enc.Utf8) : null
    }
}

export  function tokenCoder(secret, token){
    // setting a cookie to remember the user for 1 day
    const date = new Date()
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
    // hash the admin password before saving it in the cookie using crypto-js
    // normali the hashed password to avoid '=' in the cookie
    token.password = encodeURIComponent(CryptoJS.AES.encrypt(token.password, secret).toString());
    document.cookie = `${secret}=${JSON.stringify(token)}; expires=${date.toUTCString()}; path=/`;
    return token;
}

export function toXlsx(data, filename){
    const wb = XLSX.utils.book_new();
    wb.Props = {
        Title: filename,
        Subject: "Exported Data",
    };
    wb.SheetNames.push("Data");
    const ws = XLSX.utils.json_to_sheet(data);
    wb.Sheets["Data"] = ws;
    const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    function saveAs(blob, filename) {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `${filename}.xlsx`);
}

export function copyright(hostname=window.location.hostname){
    return `Copyright © ${new Date().getFullYear()} ${hostname}, All Rights Reserved`
}