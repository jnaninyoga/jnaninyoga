import { useRef } from "react";
import { useActivePage, useIntersectView } from "../../hooks";
import { Link } from "react-router-dom";
import profile from "../../assets/imgs/stock/aboutme.webp";
import GreenMat from "../../assets/imgs/spine/GreenMat.webp";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import { useTranslation } from "react-i18next";

export default function AboutMe() {
  const { t } = useTranslation();
  const activePage = useActivePage();
  const aboutme = t(`${activePage}.aboutme`, { returnObjects: true });

  const aboutmeRef = useRef(null);
  const aboutWrapper = useRef(null);
  const btn = useRef(null);

  const isAboutMeIntersected = useIntersectView(aboutmeRef);
  const isAboutWrapperIntersected = useIntersectView(aboutWrapper);
  const isBtnIntersected = useIntersectView(btn);

  return (
    <section ref={aboutmeRef} id="aboutme" className="w-screen lg:pb-0 lg:h-[500px] 2xl:h-[500px] flex flex-1 justify-start items-center text-yoga-white sm:mt-24 lg:flex-row flex-col overflow-hidden" style={{backgroundImage: `url(${GreenMat})`}}>
      <img src={profile} className={`${isAboutMeIntersected ? "sm:translate-x-0 opacity-100" : "sm:translate-x-[-100%] opacity-0"} lg:w-1/3 sm:w-auto w-full lg:h-full sm:h-1/3 h-full object-cover object-center transition-all duration-700`} alt="Yoga Coash Profile picture" />
      <article ref={aboutWrapper} className={`relative ltr:lg:pl-8 rtl:lg:pr-8 lg:py-12 py-8 h-full flex flex-1 justify-start lg:items-start items-center flex-col gap-10`}>
        <img src={LotusOverlay} className={`${isBtnIntersected ? "opacity-100" : "opacity-0"} absolute sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
        <h2 className={`${isAboutWrapperIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel text-3xl uppercase font-bold text-yoga-white transition-all duration-500`}>{aboutme.title}</h2>
        <p className={`${isAboutWrapperIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} lg:pl-6 max-w-4xl text-yoga-white sm:text-xl lg:text-lg lg:text-start sm:text-center text-justify w-[90%] z-20 transition-all duration-500 delay-100`}>{aboutme.text}</p>
        <Link ref={btn} to={"/about"} title={aboutme.btn} className={`${isBtnIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} yoga-btn text-yoga-black z-20 transition-all duration-500 delay-200`}>{aboutme.btn}</Link>
      </article>
    </section>
  )
}
