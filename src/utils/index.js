// Classes - Stock Images
import C1 from "../assets/imgs/stock/classes-1.jpg";
import C2 from "../assets/imgs/stock/classes-2.png";
import C3 from "../assets/imgs/stock/classes-3.jpg";
import C4 from "../assets/imgs/stock/classes-4.jpg";
import C5 from "../assets/imgs/stock/classes-5.jpg";
// Studio - Stock Images
import S1 from "../assets/imgs/stock/studio-1.jpg";
import S2 from "../assets/imgs/stock/studio-2.jpg";
import S3 from "../assets/imgs/stock/studio-3.png";
import S4 from "../assets/imgs/stock/studio-4.jpg";
import S5 from "../assets/imgs/stock/studio-5.jpg";
// Yoga - Stock Images
import Y1 from "../assets/imgs/stock/yoga-1.jpg";
import Y2 from "../assets/imgs/stock/yoga-2.jpg";
import Y3 from "../assets/imgs/stock/yoga-3.jpg";
import Y4 from "../assets/imgs/stock/yoga-4.jpg";
import Y5 from "../assets/imgs/stock/yoga-5.png";

export const OverviewStockImgs = {
    classes: [C1, C2, C3, C4, C5],
    studio: [S1, S2, S3, S4, S5],
    yoga: [Y1, Y2, Y3, Y4, Y5]
};

export function copyright(hostname=window.location.hostname){
    return `Copyright © ${new Date().getFullYear()} ${hostname}, All Rights Reserved`
}