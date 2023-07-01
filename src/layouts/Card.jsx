import { Link } from "react-router-dom";
import icon from '../assets/imgs/icons/lotus.png';

export default function Card({text="", twStyle="", title="", btn=false, linkTo="/"}) {
  return (
    <div className={`py-6 px-6 w-[90%] flex items-center justify-between flex-col gap-4 bg-yoga-white texture-v sm:texture-h texture-opacity-80 ${twStyle}`}>
        <div className='h-12 w-12 bg-center bg-cover' style={{backgroundImage: `url(${icon})`}}></div>
        {title ? <h3 className="cinzel text-xl sm:text-2xl font-bold uppercase text-center">{title}</h3> : null } 
        <p className='cinzel text-center pb-2 sm:text-xl'>{text}</p>
        {btn ? <Link to={linkTo} className="yoga-btn">{btn}</Link> : null}
    </div>
  )
}
