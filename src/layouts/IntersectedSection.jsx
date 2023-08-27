import { useRef } from 'react';
import { useCurrentLanguage, useIntersectView } from '../hooks';
// import icon from '../assets/imgs/icons/lotus.webp';
import PropTypes from 'prop-types';
import Icon from '../assets/svg';

IntersectedSection.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string.isRequired,
    video: PropTypes.string.isRequired,
    alt: PropTypes.string,
    poster: PropTypes.string,
    reverse: PropTypes.bool
};

export default function IntersectedSection({title, text, video, alt="", poster="", reverse=false}) {
    const currentLanguage = useCurrentLanguage();

    const psec = useRef(null);
    const vsec = useRef(null);
    const isVsecIntersected = useIntersectView(vsec);
    const isPsecIntersected = useIntersectView(psec);

  return (
    <section dir='ltr' className={`w-full h-[500px] flex flex-1 items-center justify-center flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`} id={encodeURI(title.toUpperCase())}>
        <video ref={vsec} onContextMenu={e => e.preventDefault()} src={video} poster={poster} muted loop autoPlay preload='auto' className={`${isVsecIntersected  ? "translate-x-[0%] opacity-100 shadow-yoga-green": `${reverse ? "translate-x-[100%]":"translate-x-[-100%]"} opacity-0 shadow-none`} lg:w-1/2 w-full lg:h-full h-[300px] max-h-[500px] max-w-screen-lg ${reverse ? "lg:mr-14":"lg:ml-14"} object-cover object-center aspect-square transition-all duration-1000 select-none pointer-events-none`} alt={alt} ></video>
        <article dir={currentLanguage.dir} ref={psec} className={`${isPsecIntersected ? `${reverse ? "lg:translate-x-14":"lg:-translate-x-14"} opacity-100 translate-x-0` : `${reverse ? "translate-x-[-100%]":"translate-x-[100%]"} opacity-0`} h-full lg:px-10 px-8 lg:py-12 py-8 lg:w-1/2 w-[92%] bg-yoga-white flex items-center ${currentLanguage.dir === "rtl" ? "lg:justify-end" : "lg:justify-start"} justify-center flex-col lg:gap-4 gap-4 lg:translate-y-0 -translate-y-24 transition-all duration-1000 overflow-hidden`}>
            <div className={`w-full flex items-center lg:justify-start justify-center lg:flex-row flex-col lg:gap-0 gap-1`}>
                <div className={`${isPsecIntersected ? "scale-1" : "scale-0"} sm:h-12 sm:w-16 h-14 w-20 flex items-center justify-between transition-all delay-300 duration-700 select-none z-20`}>
                    <Icon
                    // #fd8284, #ffaaab
                    label="Lotus"
                    colors={{oc: "#ffffff", pc: "#ffb4b6"}}
                    height={100}
                    width={100}
                    />
                </div>
                <h2 className={`${isPsecIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} text-2xl cinzel lg:text-start text-center font-bold uppercase delay-500 duration-500 transition-all`}>{title}</h2>
            </div>
            <p dir={currentLanguage.dir} className={`${isPsecIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} lg:text-start lg:text-lg sm:text-center text-justify delay-500 duration-500 transition-all`}>{text}</p>
        </article>
    </section>
  )
}