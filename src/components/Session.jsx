import PropTypes from 'prop-types';

import YT1 from "../assets/imgs/icons/yoga-type-1.webp";
import YT2 from "../assets/imgs/icons/yoga-type-2.webp";
import YT3 from "../assets/imgs/icons/yoga-type-3.webp";
import YT4 from "../assets/imgs/icons/yoga-type-4.webp";

Session.propTypes = {
    type: PropTypes.oneOf([0, 1, 2, 3, 4]),
    instructor: PropTypes.string,
    name: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    desc: PropTypes.string,
    alt: PropTypes.string
};

export default function Session({type=1, instructor, start="00:00", end="00:00", desc=null, alt=""}) {
const imgs = [YT1, YT2, YT3, YT4];

  return (
    <td title={type == 0 ? '': instructor} className='h-[80px]'>
      <div className={`h-[80px] relative ${type == 0 ? 'session-free' : `session session-type-${type}`}`}>
        {
          type == 0 ? <></> : 
          <>
          { desc && <h6 style={{color: `var(--yoga-drk-type-${type})`}} className='cinzel w-full h-full z-30 absolute top-2 left-1/2 -translate-x-1/2 text-center uppercase font-bold'>{desc}</h6> }
          <img src={imgs[type-1]} className="h-full object-cover object-center aspect-square" alt={alt}/>
          <h6 style={{color: `var(--yoga-drk-type-${type})`}} className={`cinzel w-full h-full z-30 absolute top-1/2 -translate-y-1/2 translate-x-1/2 -left-1/2 flex justify-around items-center sm:text-xl text-lg sm:flex-row font-bold`}>
            {start && <span style={{color: `var(--yoga-drk-type-${type})`}}>{start}</span>}
            {end && <span style={{color: `var(--yoga-drk-type-${type})`}}>{end}</span>}
          </h6>
          </>
        }
      </div>
    </td>
  )
}
