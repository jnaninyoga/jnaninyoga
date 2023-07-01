import { Link } from "react-router-dom";
import aboutme from "../assets/imgs/stock/aboutme.png";
import GreenMat from "../assets/imgs/spine/GreenMat.png";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.png";

export default function AboutMe() {
  return (
    <section id="aboutme" className="container sm:pb-0 pb-4 sm:h-[540px] flex flex-1 justify-center items-start text-yoga-white  sm:mt-24 sm:flex-row flex-col" style={{backgroundImage: `url(${GreenMat})`}}>
        <img src={aboutme} className="sm:w-1/3 w-full h-full object-cover object-center" alt="Yoga Coash Profile picture" />
        <div className="relative sm:pl-8 sm:py-12 py-8 h-full flex flex-1 justify-start sm:items-start items-center flex-col gap-10">
            <img src={LotusOverlay} className="absolute sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen" alt="Lotus Overlay" />
            <h2 className="cinzel text-3xl uppercase font-bold text-yoga-white">About Me</h2>
            <p className="sm:pl-6 text-yoga-white text-lg text-justify w-[90%] z-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae eveniet voluptatem eos quae aspernatur praesentium et quas perferendis accusamus, voluptates dolore harum maiores nesciunt saepe, officia tempora quidem ducimus beatae.
                Suscipit sequi natus modi, odit debitis excepturi delectus eaque perferendis! Deleniti vel placeat quibusdam architecto velit! Repellat esse quibusdam ipsam tempora dolor dolorum necessitatibus et. Mollitia ab quas laudantium incidunt.
                Facilis exercitationem deserunt similique placeat at, eveniet obcaecati quidem perspiciatis veniam reprehenderit nulla perferendis ab vero eligendi soluta nisi corporis aperiam beatae ex. Vitae, eligendi quisquam deleniti deserunt quas quis?
                Non, animi quam architecto obcaecati rem enim, distinctio cupiditate vitae dolor repudiandae iure debitis optio accusantium fugit dolorem voluptatibus sapiente aliquid eligendi. Dicta, sequi eveniet. Impedit quod alias amet veritatis? 
            </p>
            <Link to={"/about"} className="yoga-btn text-yoga-black z-20">Learn More</Link>
        </div>
    </section>
  )
}
