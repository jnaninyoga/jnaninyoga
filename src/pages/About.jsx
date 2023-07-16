import { useRef } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/banner.mp4";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.webp";
import icon from "../assets/imgs/icons/lotus.webp";
import profile from "../assets/imgs/stock/profile.webp";
import { useIntersectView } from "../hooks";
import { useTranslation } from "react-i18next";
import { activePage } from "../utils";
import Meta from "../meta";
import Map from "../components/Map";
// import OGP from '../constant/ogp';

export default function About() {
  const { t } = useTranslation();

  const wrapper = useRef(null);
  const profileImg = useRef(null);
  const SocialMedia = useRef(null);
  const isWrapperIntersected = useIntersectView(wrapper);
  const isProfileIntersected = useIntersectView(profileImg);
  const isSocialMediaIntersected = useIntersectView(SocialMedia);
  
  return (
  <>
  <Meta title={t('about.meta.title')} />
  <Header/>
  <OverLaped banner={banner} type={"video"}>
    <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
    <section ref={wrapper} className="relative w-[80vw] sm:px-20 px-2 flex items-center gap-4 flex-col">
      <div ref={profileImg} className={`absolute aspect-square h-48 w-48 -translate-y-[70%] sm:-top-1/2 sm:left-1/2 ltr:sm:translate-y-[80%] rtl:sm:translate-y-[40%] sm:-translate-x-1/2 overflow-hidden`}>
        <img src={icon} className={`${isProfileIntersected ? "scale-1" : "scale-0"} h-full w-full transition-all duration-300 select-none`} alt="Red/pink lotus icon" />
        <img src={profile} className={`${isProfileIntersected ? "opacity-100 -translate-y-1/2" : "opacity-0 translate-y-1/2"} absolute h-[60%] w-[60%] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full object-cover object-center transition-all duration-300 select-none pointer-events-none`} alt="The Yoga Coash Ouarda"/>
      </div>
      <article className="flex flex-col items-center justify-center gap-6 mt-12">
        <h1 className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} cinzel text-yoga-white text-center sm:text-4xl text-2xl font-bold uppercase transition-all duration-500`}>{t(`${activePage()}.title`)}</h1>
        <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} text-yoga-white sm:w-[100%] sm:text-center text-justify sm:text-lg transition-all duration-300`}>
          {t(`${activePage()}.text`)}
        </p>
        <ul ref={SocialMedia} className="cinzel items-center flex gap-6" id="socialmedia">
          <li>
            <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-200`} href="https://instagram.com/jnaninyoga" title="Instagram Page" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-instagram sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
            </a>
          </li>
          <li>
            <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-300`} href="https://facebook.com/jnaninyoga" title="Facebook Page" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-facebook sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
            </a>
          </li>
          <li>
            <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-500`} href="https://wa.me//212661286464" title="Whatsapp Contact" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-whatsapp sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
            </a>
          </li>
          <li>
            <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-700`} href="mailto:contact@jnaninyoga.com" title="Contact Email" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-bs-at sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
            </a>
          </li>
        </ul> 
      </article>
    </section>
  </OverLaped>
  <Map title={t('about.map')}/>
  <Footer/>
  </>
  )
}
