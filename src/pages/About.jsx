import { useRef } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/banner.mp4";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.png";
import icon from "../assets/imgs/icons/lotus.png";
import profile from "../assets/imgs/stock/profile.webp";
import { useIntersectView } from "../hooks";

export default function About() {
  const wrapper = useRef(null);
  const profileImg = useRef(null);
  const SocialMedia = useRef(null);
  const isWrapperIntersected = useIntersectView(wrapper);
  const isProfileIntersected = useIntersectView(profileImg);
  const isSocialMediaIntersected = useIntersectView(SocialMedia);
  return (
   <>
   <Header/>
    <OverLaped banner={banner} type={"video"}>
      <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
      <section ref={wrapper} className="relative w-[80vw] sm:px-20 px-2 flex items-center gap-4 flex-col">
        <div ref={profileImg} className={`absolute aspect-square h-48 w-48 -translate-y-[70%] sm:-top-1/2 sm:left-1/2 sm:translate-y-1/2 sm:-translate-x-1/2 overflow-hidden`}>
          <img src={icon} className={`${isProfileIntersected ? "scale-1" : "scale-0"} h-full w-full transition-all duration-300 select-none`} alt="Red/pink lotus icon" />
          <img src={profile} className={`${isProfileIntersected ? "opacity-100 -translate-y-1/2" : "opacity-0 translate-y-1/2"} absolute h-[60%] w-[60%] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full object-cover object-center transition-all duration-300 select-none pointer-events-none`} alt="The Yoga Coash Ouarda"/>
        </div>
        <article className="flex flex-col items-center justify-center gap-6 mt-12">
          <h1 className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} cinzel text-yoga-white sm:text-4xl text-3xl font-bold uppercase transition-all duration-500`}>About</h1>
          <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} text-yoga-white sm:w-[80%] text-center transition-all duration-300`}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur hic omnis tenetur molestias aut. Quo eius consectetur aliquam voluptatibus ducimus natus velit reprehenderit assumenda beatae facere, provident, eligendi veritatis officia.
          Laudantium quia quos sapiente labore odio ullam saepe eius alias earum, consequatur officiis neque iure, error, possimus soluta temporibus iusto id sint est. Sint nam fugit, unde laboriosam vero illum!
          Voluptates, tenetur! Esse dolor id error quas illo amet nemo adipisci eius fuga excepturi minima explicabo quaerat ea molestiae recusandae facilis odit, neque consequuntur, exercitationem obcaecati quod aut ab expedita.
          Vitae suscipit rem labore minima accusantium maiores corrupti aliquid? Blanditiis expedita porro delectus explicabo, laborum corrupti modi possimus consequuntur aut odit maiores laboriosam rem illum vel? Vel esse excepturi dignissimos?
          Ullam explicabo incidunt aspernatur dignissimos inventore beatae eveniet iusto commodi labore suscipit doloremque consectetur fugit, eaque nemo mollitia pariatur, deserunt ratione est! Distinctio iusto in, ut delectus laboriosam modi dolor.
          Molestias at possimus libero enim voluptatem, dolorum exercitationem obcaecati perferendis rem accusamus iure, necessitatibus odit porro neque architecto asperiores quae vel ullam quidem temporibus quibusdam! Alias consectetur earum sit incidunt!</p>
          <ul ref={SocialMedia} className="cinzel items-center flex gap-6" id="SocialMedia">
            <li>
              <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-200`} href="https://instagram.com/jnaninyoga" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
                <i className="fi fi-brands-instagram sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
              </a>
            </li>
            <li>
              <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-300`} href="https://facebook.com/jnaninyoga" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
                <i className="fi fi-brands-facebook sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
              </a>
            </li>
            <li>
              <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-500`} href="https://wa.me//212661286464" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
                <i className="fi fi-brands-whatsapp sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
              </a>
            </li>
            <li>
              <a className={`${isSocialMediaIntersected ? "opacity-100 scale-100":"opacity-0 scale-0"} flex items-center gap-4 transition-all duration-700`} href="mailto:contact@jnaninyoga.com" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
                <i className="fi fi-bs-at sm:text-lg text-xl text-yoga-white hover:text-yoga-red transition-all duration-300"></i>
              </a>
            </li>
          </ul> 
        </article>
        {/* <div></div> */}
      </section>
    </OverLaped>
   <Footer/>
   </>
  )
}
