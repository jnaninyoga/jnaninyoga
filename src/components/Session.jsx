import { yogaTypes } from '../utils';
import PropTypes from 'prop-types';

Session.propTypes = {
    type: PropTypes.oneOf([0, 1, 2, 3, 4]),
    name: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    desc: PropTypes.string
};

export default function Session({type=1, start="00:00", end="00:00", desc=null}) {
  return (
    <td title={type == 0 ? '':`The ${yogaTypes[type-1].name} Yoga Course start at '${start}', and end at '${end}' in (24h format)`} className='h-[80px]'>
      <div className={`h-[80px] relative ${type == 0 ? 'session-free' : `session session-type-${type}`}`}>
        {
          type == 0 ? <></> : 
          <>
          { desc && <h6 style={{color: `var(--yoga-drk-type-${type})`}} className='cinzel w-full h-full z-30 absolute top-2 left-1/2 -translate-x-1/2 text-center uppercase font-bold'>{desc}</h6> }
          <img src={yogaTypes[type-1].img} className="h-full object-cover object-center aspect-square" alt={`${yogaTypes[type-1].name} Yoga Course`}/>
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
