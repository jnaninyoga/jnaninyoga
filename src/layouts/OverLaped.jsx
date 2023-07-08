import overlay from "../assets/imgs/spine/texture-horizontal.jpg";
import textureBG from "../assets/imgs/spine/GreenMat.png";
import PropTypes from 'prop-types';

OverLaped.propTypes = {
    banner: PropTypes.string,
    type: PropTypes.oneOf(["image", "video"]),
    children: PropTypes.node
};

export default function OverLaped(props) {
    const {banner, type} = props;
  return (
    <section className="flex items-center justify-center flex-col w-screen">
        {
          type === "video" ?
          <video poster={overlay} src={banner} onContextMenu={e => e.preventDefault()} className="relative w-full sm:h-80 h-52 object-cover object-center pointer-events-none select-none" alt="The background Video banner" muted loop autoPlay preload='auto'></video>
          : <img src={banner || overlay} onContextMenu={e => e.preventDefault()} className="relative w-full sm:h-80 h-52 object-cover object-center pointer-events-none select-none" alt="The background image banner" />
        }
        {/* <div className="absolute flex w-full px-4 py-4 sm:top-28 top-20 left-1/2 -translate-x-1/2 justify-between text-yoga-white">
            <a className="flex items-center justify-center text-yoga-white gap-2" href="https://facebook.com/jnaninyoga" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <h6 className="cinzel text-yoga-white text-center sm:text-4xl">540 likes</h6>
              <i className="fi fi-brands-facebook text-yoga-red flex items-center justify-center sm:text-4xl text-lg"></i>
            </a>
            <a className="flex items-center justify-center text-yoga-white gap-2" href="https://instagram.com/jnaninyoga" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-instagram text-yoga-red flex items-center justify-center sm:text-4xl text-lg"></i>
              <h6 className="cinzel text-yoga-white text-center sm:text-4xl">540 followers</h6>
            </a>
        </div> */}
        <main className="container relative px-4 py-8 sm:w-fit w-[92%] min-h-full h-fit sm:-translate-y-20 -translate-y-14 flex justify-center" style={{backgroundImage: `url(${textureBG})`}}>
            {props.children}
        </main>
    </section>
  )
}
