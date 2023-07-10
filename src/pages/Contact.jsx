import Footer from "../layouts/Footer";
import Form from "../layouts/Form";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/banner.mp4";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.webp";
import { formFields } from "../utils";

export default function Contact() {
  const a = true;
  return (
    <>
    <Header/>
    <OverLaped banner={banner} type={"video"}>
      <img src={LotusOverlay} className={`${a ? "opacity-100" : "opacity-0"} -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
      <Form
      title="Contact US"
      fields={formFields}
      btn="Send"        
      />
    </OverLaped>
    <Footer/>
    </>
  )
}
