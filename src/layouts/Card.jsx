import { Link } from "react-router-dom";
import icon from '../assets/imgs/icons/lotus.webp';
import PropTypes from 'prop-types';
import { useRef } from "react";
import { useIntersectView } from "../hooks";

Card.propTypes = {
  text: PropTypes.string,
  twStyle: PropTypes.string,
  title: PropTypes.string,
  btn: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
  ]),
  linkTo: PropTypes.string
};

export default function Card({text="", twStyle="", title="", btn=false, linkTo="/"}) {
  const card = useRef(null);
  const isCardIntersected = useIntersectView(card);

  return (
    <div ref={card} className={`py-6 px-6 w-[90%] lg:min-w-[1150px] flex items-center justify-between flex-col gap-4 bg-yoga-white texture-v sm:texture-h texture-opacity-80 ${twStyle} overflow-hidden`}>
        <img src={icon} className={`${isCardIntersected ? "scale-1" : "scale-0"} h-12 w-12 transition-all duration-500 select-none`} alt="Red/pink lotus icon" />
        {title ? <h3 className={`${isCardIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel text-xl sm:text-2xl font-bold uppercase text-center transition-all duration-500`}>{title}</h3> : null } 
        <p className={`${isCardIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel text-center pb-2 sm:text-xl transition-all duration-500`}>{text}</p>
        {btn ? <Link to={linkTo} title={btn} className={`${isCardIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} yoga-btn transition-all duration-500 delay-100`}>{btn}</Link> : null}
    </div>
  )
}
