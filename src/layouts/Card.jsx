import { NavLink } from "react-router-dom";
// import icon from '../assets/imgs/icons/lotus.webp';
import PropTypes from 'prop-types';
import { useRef } from "react";
import { useCurrentLanguage, useIntersectView } from "../hooks";
import Icon from "../assets/svg";

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
  const currentLanguage = useCurrentLanguage();

  return (
  <div ref={card} className={`py-6 px-6 w-[90%] lg:min-w-[1150px] flex items-center justify-between flex-col gap-4 bg-yoga-white bg-texture texture-v sm:texture-h texture-opacity-80 ${twStyle} overflow-hidden`}>
    <div className={`${isCardIntersected ? "scale-1" : "scale-0"} h-14 w-24 flex items-center justify-between bg-[#ffb2a3]] transition-all select-none z-20`}>
      <Icon
        // default: #fdc5ba
        // varients: red[#fd8284, #ffaaab], beige[#ffb2a3]
        label="Lotus"
        colors={{oc: "#ffffff", pc: "#ffb2a3"}}
        height={100}
        width={100}
      />
    </div>
    {title && <h3 className={`${isCardIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel text-xl sm:text-2xl font-bold uppercase text-center transition-all duration-500 z-20`}>{title}</h3> } 
    <p className={`${isCardIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel text-center pb-2 sm:text-xl transition-all duration-500 z-20`}>{text}</p>
    {btn && <NavLink to={`/${currentLanguage.code}${linkTo}`} title={btn} className={`${isCardIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} yoga-btn transition-all duration-500 delay-100 z-20`}>{btn}</NavLink> }
  </div>
  )
}
