import { useRef } from 'react';
import { useIntersectView } from '../hooks';
import icon from '../assets/imgs/icons/lotus.png';
import PropTypes from 'prop-types';

IntersectedSection.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    video: PropTypes.string.isRequired,
    alt: PropTypes.string,
    poster: PropTypes.string,
    reverse: PropTypes.bool
};

export default function IntersectedSection({title, text, video, alt="", poster="", reverse=false}) {
    const psec = useRef(null);
    const vsec = useRef(null);
    const isVsecIntersected = useIntersectView(vsec);
    const isPsecIntersected = useIntersectView(psec);

  return (
    <section className={`w-full h-[500px] flex flex-1 items-center justify-center flex-col ${reverse ? "sm:flex-row-reverse" : "sm:flex-row"}`} id={title}>
        <video ref={vsec} onContextMenu={e => e.preventDefault()} src={video} poster={poster} muted loop autoPlay preload='auto' className={`${isVsecIntersected  ? "translate-x-[0%] opacity-100 shadow-yoga-green": `${reverse ? "translate-x-[100%]":"translate-x-[-100%]"} opacity-0 shadow-none`} sm:w-1/2 w-full sm:h-full h-[300px] max-h-[500px] max-w-screen-lg ${reverse ? "sm:mr-14":"sm:ml-14"} object-cover object-center aspect-square transition-all duration-1000 select-none pointer-events-none`} alt={alt} ></video>
        <div ref={psec} className={`${isPsecIntersected ? `${reverse ? "sm:translate-x-14":"sm:-translate-x-14"} opacity-100 translate-x-0` : `${reverse ? "translate-x-[-100%]":"translate-x-[100%]"} opacity-0`} h-full sm:px-10 px-8 sm:py-12 py-8 sm:w-1/2 w-[92%] bg-yoga-white flex items-center sm:justify-start justify-center flex-col sm:gap-6 gap-4 sm:translate-y-0 -translate-y-24 transition-all duration-1000 overflow-hidden`}>
            <div className='w-full flex items-center justify-start sm:flex-row flex-col sm:gap-4 gap-1'>
                <img src={icon} className={`${isPsecIntersected ? "scale-1" : "scale-0"} h-12 w-12 transition-all delay-300 duration-700 select-none`} alt="Red/pink lotus icon" />
                <h2 className={`${isPsecIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} text-2xl cinzel font-bold delay-500 duration-500 transition-all`}>{title}</h2>
            </div>
            <p className={`${isPsecIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} sm:text-base text-justify delay-500 duration-500 transition-all`}>{text}</p>
        </div>
    </section>
  )
}