import i18next from "i18next";

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
    // the name field is string at least 6 chars long only letters no special chars
    {type: 'text', name: 'fullname', placeholder: 'Full Name', regex: /^[a-zA-Z]{6,}$/, error: 'Name must be at least 6 characters long with only letters'},
    {type: 'email', name: 'email', placeholder: 'Email', regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, error: 'Email must be a valid email address'},
    {type: 'tel', name: 'phone', placeholder: 'Phone Number', regex: /^[0-9]{10}$/, error: 'Phone number must be 10 digits long'},
    // the message field is string at least 2 chars long
    {type: 'textarea', name: 'message', placeholder: 'Message', regex: /^.{2,}$/, error: 'Message must be at least 2 characters long'}
];

// Yoga Calander:
export const standardNavbar = ["Home","About","Contact","Classes"];
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
]

export const supportedLanguages = [
    {name: 'English', code: 'en', dir: 'ltr'}, 
    {name: 'Français', code: 'fr', dir: 'ltr'},
    {name: 'العربية', code: 'ar', dir: 'rtl'}
];

export const currentLanguage = () => supportedLanguages.find(lang => lang.code === i18next.language);

export const activePage = () => window.location.pathname.split("/")[1].toLowerCase() === "" ? "home" : window.location.pathname.split("/")[1].toLowerCase();

export function copyright(hostname=window.location.hostname){
    return `Copyright © ${new Date().getFullYear()} ${hostname}, All Rights Reserved`
}