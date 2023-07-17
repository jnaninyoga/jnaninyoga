import OverLaped from "./OverLaped";
import Header from "./Header";
import Footer from "./Footer";
import banner from  "../assets/imgs/stock/notfound.webp"
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Meta from "../meta";
import { usePathLanguage } from "../hooks";
import { useEffect } from "react";
import metadata from '../meta/meta';
// import AnimatedLotus from "../assets/imgs/icons/animatedlotus.mp4";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePathLanguage();

  // set a timeout of 15s to redirect to home
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 18000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <>
    <Meta title={t('notfound.meta.title')} {...metadata.notfound}/>
    <Header/>
    <OverLaped banner={banner}>
        <section className="sm:w-[90vw] flex flex-1 justify-center items-center flex-col gap-4">
            {/* <img src={AnimatedLotus} className="w-[480px] h-[480px] aspect-square object-cover object-center" alt="" /> */}
            {/* <video muted autoPlay loop src={AnimatedLotus} className="w-[480px] h-[480px] aspect-square object-cover object-center" alt="" ></video> */}
            {/* <lottie-player src="https://lottie.host/13d290ed-9dff-4a44-ab8c-d6a11b0bc664/Wu2Mu5BrPP.json" background="transparent" speed="1" style={{width: 300, height: 300, background: "#fff"}} loop autoplay></lottie-player> */}
            <article className="w-full flex flex-1 justify-center items-center flex-col gap-4">
              <h1 className="cinzel text-8xl text-center text-yoga-white font-bold animate-bounce">404</h1>
              <h2 className="cinzel text-4xl text-center text-yoga-white font-bold uppercase">{t("notfound.title")}</h2>
              <p className="cinzel sm:text-2xl text-center text-yoga-white font-bold">{t("notfound.text")}</p>
              <button><Link to="/" className="cinzel sm:text-2xl text-xl font-bold yoga-btn">{t("notfound.btn")}</Link></button>
            </article>
        </section>
    </OverLaped>
    <Footer/>
    </>
  )
}