import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/banner.mp4";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.png";

export default function About() {
  return (
   <>
   <Header/>
   <OverLaped banner={banner} type={"video"}>
      <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
      <h1 className="text-4xl font-bold text-center px-4 text-yoga-white uppercase">About</h1>
    </OverLaped>
   <Footer/>
   </>
  )
}
