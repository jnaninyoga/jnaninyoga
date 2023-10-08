import textureBG from "../../assets/imgs/spine/GreenMat.webp";
import { useRef } from "react";
import { useIntersectView } from "../../hooks";
import PropsType from "prop-types";

import YT1 from "../../assets/imgs/icons/yoga-type-1.webp";
import YT2 from "../../assets/imgs/icons/yoga-type-2.webp";
import YT3 from "../../assets/imgs/icons/yoga-type-3.webp";
import YT4 from "../../assets/imgs/icons/yoga-type-4.webp";

SessionRefernce.propTypes = {
    types: PropsType.array,
}

export default function SessionRefernce({types=[]}) {
    const imgs = [YT1, YT2, YT3, YT4];

    const coursetypes = useRef(null);
    const isCourseTypesIntersected = useIntersectView(coursetypes);

  return (
    <section ref={coursetypes} className="flex justify-center items-center flex-col" id="coursetypes">
    <div className="h-fit w-[90%] py-4 sm:px-8 px-4 flex justify-center items-start gap-4 sm:flex-row flex-col bg-yoga-white" style={{backgroundImage: `url(${textureBG})`}}>
        { types.map((type, idx) => (
        <div key={idx} className="h-1/4 sm:h-full w-full sm:w-1/4 flex items-start gap-2">
            <div className={`${isCourseTypesIntersected ? "translate-x-0 opacity-100" : "-translate-x-[100%] opacity-0"} session session-type-${idx+1} delay-[${(idx+1) * 100}ms]`}>
                <img src={imgs[idx] || imgs[0]} className={`h-[80px] w-[80px] aspect-square`} alt={type.type} />
            </div>
            <div className="flex w-1/2 flex-col gap-1 text-yoga-white">
                <h5 className={`${isCourseTypesIntersected ? "translate-y-0 opacity-100" : "-translate-y-[100%] opacity-0"} cinzel font-bold uppercase text-yoga-white transition-all duration-[${(idx+1) * 100 + 200}ms]`}>{type.type}</h5>
                <p className={`${isCourseTypesIntersected ? "translate-y-0 opacity-100" : "-translate-y-[100%] opacity-0"} cinzel text-sm text-yoga-white transition-all duration-[${(idx+1) * 100 + 250}ms]`}>{type.desc}</p>
            </div>
        </div>))}
    </div>
    </section>
  )
}
