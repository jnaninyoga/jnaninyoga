import { useRef } from "react";
import { useIntersectView } from "../hooks";
import { Link } from "react-router-dom";
import aboutme from "../assets/imgs/stock/aboutme.webp";
import GreenMat from "../assets/imgs/spine/GreenMat.webp";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.webp";

export default function AboutMe() {
  const aboutmeRef = useRef(null);
  const aboutWrapper = useRef(null);
  const btn = useRef(null);

  const isAboutMeIntersected = useIntersectView(aboutmeRef);
  const isAboutWrapperIntersected = useIntersectView(aboutWrapper);
  const isBtnIntersected = useIntersectView(btn);

  return (
    <section ref={aboutmeRef} id="aboutme" className="container sm:pb-0 pb-4 sm:h-[540px] flex flex-1 justify-center items-start text-yoga-white  sm:mt-24 sm:flex-row flex-col overflow-hidden" style={{backgroundImage: `url(${GreenMat})`}}>
        <img src={aboutme} className={`${isAboutMeIntersected ? "sm:translate-x-0 opacity-100" : "sm:translate-x-[-100%] opacity-0"} sm:w-1/3 w-full h-full object-cover object-center transition-all duration-700`} alt="Yoga Coash Profile picture" />
        <div ref={aboutWrapper} className="relative sm:pl-8 sm:py-12 py-8 h-full flex flex-1 justify-start sm:items-start items-center flex-col gap-10">
            <img src={LotusOverlay} className={`${isBtnIntersected ? "opacity-100" : "opacity-0"} absolute sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
            <h2 className={`${isAboutWrapperIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel text-3xl uppercase font-bold text-yoga-white transition-all duration-500`}>About Me</h2>
            <p className={`${isAboutWrapperIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} sm:pl-6 text-yoga-white sm:text-lg text-justify w-[90%] z-20 transition-all duration-500 delay-100`}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae eveniet voluptatem eos quae aspernatur praesentium et quas perferendis accusamus, voluptates dolore harum maiores nesciunt saepe, officia tempora quidem ducimus beatae.
                Suscipit sequi natus modi, odit debitis excepturi delectus eaque perferendis! Deleniti vel placeat quibusdam architecto velit! Repellat esse quibusdam ipsam tempora dolor dolorum necessitatibus et. Mollitia ab quas laudantium incidunt.
                Facilis exercitationem deserunt similique placeat at, eveniet obcaecati quidem perspiciatis veniam reprehenderit nulla perferendis ab vero eligendi soluta nisi corporis aperiam beatae ex. Vitae, eligendi quisquam deleniti deserunt quas quis?
                Non, animi quam architecto obcaecati rem enim, distinctio cupiditate vitae dolor repudiandae iure debitis optio accusantium fugit dolorem voluptatibus sapiente aliquid eligendi. Dicta, sequi eveniet. Impedit quod alias amet veritatis? 
            </p>
            <Link ref={btn} to={"/about"} title="Learn More" className={`${isBtnIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} yoga-btn text-yoga-black z-20 transition-all duration-500 delay-200`}>Learn More</Link>
        </div>
    </section>
  )
}
