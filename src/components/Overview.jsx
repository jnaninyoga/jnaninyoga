import { useState, useRef, useEffect } from "react"
import { OverviewStockImgs } from "../utils"
import { useTranslation } from "react-i18next";
import { useActivePage } from "../hooks";

export default function Overview() {
    const { t } = useTranslation();
    const activePage = useActivePage();
    const overview = t(`${activePage}.overview`, { returnObjects: true });
    const standardTitles = ["Classes","Studio","Yoga"];

    const TTitles = () => Array.isArray(overview) ? overview : standardTitles;

    const [classesOverview, setClassesOverview] = useState(OverviewStockImgs.classes[0]);
    const [studioOverview, setStudioOverview] = useState(OverviewStockImgs.studio[0]);
    const [yogaOverview, setYogaOverview] = useState(OverviewStockImgs.yoga[0]);

    const [animateTrigger, setAnimateTrigger] = useState(false);

    const img = useRef(0);

    useEffect(() => {
        // every 3s show a new image (looping)
        let overviewImgs = setInterval(() => {
            setAnimateTrigger(false);

            setTimeout(() => {
                img.current = (img.current + 1) % 5;
                setAnimateTrigger(true);
                setClassesOverview(OverviewStockImgs.classes[img.current]);
                setStudioOverview(OverviewStockImgs.studio[img.current]);
                setYogaOverview(OverviewStockImgs.yoga[img.current]);
            }, 500);
                
        }, 3000);

        return () => clearInterval(overviewImgs);
    });

  return (
    <section className="container w-full px-4 py-10 flex flex-1 flex-col sm:flex-row justify-evenly bg-yoga-white gap-4 sm:gap-8">
        <div className="h-full flex flex-col items-center justify-between sm:gap-4">
            <img  src={classesOverview} className={`h-[400px] w-[400px] aspect-square object-contain select-none transition-opacity duration-500 ${animateTrigger ? 'opacity-100' : 'opacity-0'}`} alt="Yoga Classes Gallery Images" />
            <h3 className="cinzel text-2xl font-bold uppercase">{TTitles()[0]}</h3>
        </div>
        <div className="h-full flex flex-col items-center justify-between sm:gap-4">
            <img src={studioOverview} className={`h-[400px] w-[400px] aspect-square object-contain select-none transition-opacity duration-500 ${animateTrigger ? 'opacity-100' : 'opacity-0'}`} alt="Yoga Studio Gallery Images" />
            <h3 className="cinzel text-2xl font-bold uppercase">{TTitles()[1]}</h3>
        </div>
        <div className="h-full flex flex-col items-center justify-between sm:gap-4">
            <img src={yogaOverview} className={`h-[400px] w-[400px] aspect-square object-contain select-none transition-opacity duration-500 ${animateTrigger ? 'opacity-100' : 'opacity-0'}`} alt="Yoga Pose Gallery Images" />
            <h3 className="cinzel text-2xl font-bold uppercase">{TTitles()[2]}</h3>
        </div>
    </section>
  )
}
