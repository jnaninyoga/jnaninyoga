import { yogaTypes } from "../utils";
import textureBG from "../assets/imgs/spine/GreenMat.webp";
import { useRef } from "react";
import { useIntersectView } from "../hooks";

export default function SessionRefernce() {
    const coursetypes = useRef(null);
    const isCourseTypesIntersected = useIntersectView(coursetypes);
    // const scrollToCourseTypes = () => {
    //     coursetypes.current.scrollIntoView({behavior: "smooth"});
    // }
  return (
    <section ref={coursetypes} className="flex justify-center items-center flex-col" id="coursetypes">
    <div className="h-fit w-[90%] py-4 sm:px-8 px-4 flex justify-center items-center gap-4 sm:flex-row flex-col bg-yoga-white" style={{backgroundImage: `url(${textureBG})`}}>
        { yogaTypes.map((yoga, idx) => (
        <div key={idx} className="h-full flex justify-center items-center gap-2">
            <div className={`${isCourseTypesIntersected ? "translate-x-0 opacity-100" : "-translate-x-[100%] opacity-0"} session session-type-${idx+1} delay-[${(idx+1) * 100}ms]`}>
                <img src={yoga.img} className={`h-[80px] w-[200px] aspect-square`} alt={`The ${yoga.name} Yoga Course`} />
            </div>
            <div className="flex flex-col gap-1 text-yoga-white">
                <h5 className={`${isCourseTypesIntersected ? "translate-y-0 opacity-100" : "-translate-y-[100%] opacity-0"} cinzel font-bold uppercase text-yoga-white transition-all duration-[${(idx+1) * 100 + 200}ms]`}>{yoga.name}</h5>
                <p className={`${isCourseTypesIntersected ? "translate-y-0 opacity-100" : "-translate-y-[100%] opacity-0"} cinzel text-sm text-yoga-white transition-all duration-[${(idx+1) * 100 + 250}ms]`}>{yoga.desc}</p>
            </div>
        </div>))}
    </div>
    </section>
  )
}
