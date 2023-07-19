import PropType from 'prop-types';
import Rate from './Rate';

Stars.propTypes = {
    stars: PropType.number,
    rate: PropType.number,
}

export default function Stars({stars, rate}) {
  return (
    <div className='flex justify-center items-center gap-1'>
    {stars > 0 && ( Array(stars).fill(0).map((_, i) => 
        <div key={i}>
            <Rate fill={rate > 0 && i < rate} className={"w-6 h-6"} color={"#fdc5ba"}/>
        </div>
    ))}
    </div>
  )
}