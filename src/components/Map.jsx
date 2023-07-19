import icon from '../assets/imgs/icons/lotus.webp';
import { useRef } from "react";
import { useIntersectView } from "../hooks";
import PropTypes from 'prop-types';

Map.propTypes = {
    title: PropTypes.string
}

export default function Map({title}){
    const map = useRef(null);
    const isMapIntersected = useIntersectView(map);

    return(
        <section className="container max-h-[700px]" id="#studiolocation">
            <section ref={map} className="py-6 mb-12 h-fit flex flex-1 justify-start items-center flex-col gap-4 bg-yoga-white texture-v sm:texture-h texture-opacity-80 overflow-hidden">
            <img src={icon} className={`${isMapIntersected ? "scale-1" : "scale-0"} h-12 w-12 transition-all duration-500 select-none`} alt="Red/pink lotus icon" />
            <h2 className={`${isMapIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel sm:text-4xl text-2xl font-bold uppercase text-center transition-all duration-500`}>{title}</h2>
            <iframe
            className={`${isMapIntersected ? "opacity-100" : "opacity-0"} border-none w-full sm:max-h-[500px] sm:h-[500px] h-[400px] max-h-[600px] object-cover object-center aspect-video transition-all duration-700`}
            title={title}
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13586.97703150534!2d-7.999672!3d31.6408519!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef3ed7d51c8b%3A0x1e8998c3ca75bf31!2sJNANIN%20Yoga%20Studio!5e0!3m2!1sen!2sma!4v1689438289984!5m2!1sen!2sma"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            >
            </iframe>
            </section>
        </section>
    )
}