import overlay from "../assets/imgs/spine/texture-horizontal.webp";
import textureBG from "../assets/imgs/spine/GreenMat.webp";
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
        <video role="banner" poster={overlay} src={banner} onContextMenu={e => e.preventDefault()} className="relative w-full sm:h-96 lg:h-[430px] h-52 object-cover object-center pointer-events-none select-none" alt="The background Video banner" muted loop autoPlay preload='auto'></video>
        : <img role="banner" src={banner || overlay} onContextMenu={e => e.preventDefault()} className="relative w-full sm:h-96 lg:h-[430px] h-52 object-cover object-center pointer-events-none select-none" alt="The background image banner" />
      }
      <main className="container relative px-4 py-8 h-min lg:w-fit w-[92%] lg:-translate-y-20 -translate-y-14 flex justify-center flex-col" style={{backgroundImage: `url(${textureBG})`}}>
        {props.children}
      </main>
    </section>
  )
}
