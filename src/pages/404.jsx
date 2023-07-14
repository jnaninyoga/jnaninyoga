import OverLaped from "../layouts/OverLaped";
import banner from  "../assets/imgs/stock/notfound.webp"
// import AnimatedLotus from "../assets/imgs/icons/animatedlotus.mp4";

export default function NotFound() {
  return (
    <OverLaped banner={banner}>
        <section className="w-[90vw] flex justify-center items-center flex-col gap-4">
            {/* <img src={AnimatedLotus} className="w-[480px] h-[480px] aspect-square object-cover object-center" alt="" /> */}
            {/* <video muted autoPlay loop src={AnimatedLotus} className="w-[480px] h-[480px] aspect-square object-cover object-center" alt="" ></video> */}
            {/* <lottie-player src="https://lottie.host/13d290ed-9dff-4a44-ab8c-d6a11b0bc664/Wu2Mu5BrPP.json" background="transparent" speed="1" style={{width: 300, height: 300, background: "#fff"}} loop autoplay></lottie-player> */}
            <h1 className="cinzel text-8xl text-yoga-white font-bold animate-bounce">404</h1>
        </section>
    </OverLaped>
  )
}
