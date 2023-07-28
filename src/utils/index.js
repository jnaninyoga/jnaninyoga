import * as CryptoJS from "crypto-js";

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

// Form Fields:
export const contactFields = [
    // the fullname field is string at least 6 chars long only letters and alow spaces no special chars
    {type: 'text', name: 'fullname', placeholder: 'Full Name', regex: /^[a-zA-Z\u0600-\u06FF\s]{2,}$/, error: 'Full Name must be at least 2 characters long and only letters and spaces'},
    {type: 'email', name: 'email', placeholder: 'Email', regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, error: 'Email must be a valid email address'},
    {type: 'tel', name: 'phone', placeholder: 'Phone Number', regex: /^[0-9]{10}$/, error: 'Phone number must be 10 digits long'},
    // the message field is string at least 2 chars long alow new lines and spaces
    {type: 'textarea', name: 'message', placeholder: 'Message', regex: /^[\S\s]{2,}$/, error: 'Message must be at least 2 characters long and only letters, numbers, spaces and new lines'}
];

export const adminLoginFields = [
    // username
    {type: 'text', name: 'username', placeholder: 'Username', regex: /^[\S\s]{2,}$/, error: 'Username must be at least 6 characters long'},
    // password
    {type: 'password', name: 'password', placeholder: 'Password', regex: /^[\S\s]{6,}$/, error: 'Invalid Password'}
];

export const accountFields = [
    // username
    {type: 'text', name: 'username', placeholder: 'Username', defaultValue: 'admin', regex: /^[a-zA-Z]{5,12}$/, error: 'Username must be between 5 to 12 characters long, only letters [A-Z]'},
    // password
    {type: 'password', name: 'password', placeholder: 'Password', defaultValue: 'admin', regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/, error: 'Password must be between 8 and 16 characters, one uppercase letter, one lowercase letter, one number or one special character [!@#$%^&*]'},
];

export const reviewsFields = [
    // the fullname field is string at least 6 chars long only letters and alow spaces no special chars
    {type: 'text', name: 'fullname', placeholder: 'Full Name', regex: /^[a-zA-Z\u0600-\u06FF\s]{2,}$/, error: 'Full Name must be at least 2 characters long and only letters and spaces'},
    // the message field is string at least 2 chars long alow new lines and spaces
    {type: 'textarea', name: 'review', placeholder: 'Your Review', regex: /^[\S\s]{10,500}$/, maxChars: 500, error: 'review must be at least 10 characters long'}
];

// Yoga Calander:
export const standardNavbar = ["Home","About","Contact","Classes"];
export const dashboardNavbar = ["Contacts","Reviews","Classes","Account"];
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

export const dashboardNavicons = {
    contacts: "fi fi-ss-headset",
    reviews: "fi fi-sr-star-comment-alt",
    classes: "fi fi-sr-calendar",
    account: "fi fi-sr-user-gear",
}

// export const dashboardNavicons = {
//     reviews: {
//         icon: "https://cdn.lordicon.com/mdgrhyca.json",
//         colors: {pc: ":#13a9b1"}
//     },

// }

export const supportedLanguages = [
    {name: 'English', code: 'en', dir: 'ltr'},
    {name: 'Français', code: 'fr', dir: 'ltr'},
    {name: 'العربية', code: 'ar', dir: 'rtl'}
];

// formate date to `0000 mon 00, 00:00:00`
export function dateFormater(date){
    return new Date(date?.seconds * 1000).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
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
    // normaliz the hashed password to avoid '=' in the cookie
    token.password = encodeURIComponent(CryptoJS.AES.encrypt(token.password, secret).toString());
    document.cookie = `${secret}=${JSON.stringify(token)}; expires=${date.toUTCString()}; path=/`;
    return token;
}

export function copyright(hostname=window.location.hostname){
    return `Copyright © ${new Date().getFullYear()} ${hostname}, All Rights Reserved`
}