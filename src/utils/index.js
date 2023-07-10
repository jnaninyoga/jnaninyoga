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
export const formFields = [
    {type: 'text', name: 'name', placeholder: 'Name'},
    {type: 'email', name: 'email', placeholder: 'Email'},
    {type: 'tel', name: 'phone', placeholder: 'Phone Number'},
    {type: 'textarea', name: 'message', placeholder: 'Message'}
];

// Yoga Calander:
import YT1 from "../assets/imgs/icons/yoga-type-1.webp";
import YT2 from "../assets/imgs/icons/yoga-type-2.webp";
import YT3 from "../assets/imgs/icons/yoga-type-3.webp";
import YT4 from "../assets/imgs/icons/yoga-type-4.webp";

export const yogaTypes = [
    {name: 'Collective', img: YT1, desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit."},
    {name: 'Private', img: YT2, desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit."},
    {name: 'Special', img: YT3, desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit."},
    {name: 'Online', img: YT4, desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit."}
];

export function copyright(hostname=window.location.hostname){
    return `Copyright © ${new Date().getFullYear()} ${hostname}, All Rights Reserved`
}