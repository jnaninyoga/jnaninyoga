import PropsTypes from 'prop-types';
import textureBG from "../assets/imgs/spine/GreenMat.webp";

Loader.propTypes = {
  loading: PropsTypes.string
}

export default function Loader({loading="Loading..."}) {
  return (
    <section className='h-full w-full flex flex-1 justify-center items-center flex-col overflow-hidden'>
      <section className={`p-6 w-[95%] flex justify-center items-center flex-col gap-5`} style={{backgroundImage: `url(${textureBG})`}}>
        <div className="loader"></div>
        <h1 className="cinzel sm:text-4xl text-2xl text-yoga-white animate-pulse">{ loading }</h1>
      </section>
    </section>
  )
}
