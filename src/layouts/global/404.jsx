import OverLaped from "./OverLaped";
import Header from "./Header";
import Footer from "./Footer";
import banner from  "../../assets/imgs/stock/notfound.webp"
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Meta from "../../meta";
import { usePathLanguage } from "../../hooks";
import { useEffect } from "react";
import metadata from '../../meta/meta';
import Icon from "../../assets/svg";

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
        <section className="sm:max-w-[90vw] flex flex-1 justify-center items-center flex-col gap-4">
          <div className="relative flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center -translate-y-10">
              <Icon 
              label="Lotus"
              src="https://cdn.lordicon.com/hvuelaml.json"
              colors={{oc: "#ffffff", pc: "#fdc5ba", sc: "#ffffff"}}
              />
            </div>
            <h1 className="absolute top-[150px] cinzel text-8xl text-center text-yoga-white font-bold animate-bounce">404</h1>
          </div>
          <article className="w-full flex flex-1 justify-center items-center flex-col gap-4">
            <h2 className="cinzel text-3xl text-center text-yoga-white font-bold uppercase">{t("notfound.title")}</h2>
            <p className="sm:text-xl text-center text-yoga-white font-medium">{t("notfound.text")}</p>
            <button><Link to="/" className="cinzel sm:text-2xl text-xl font-bold yoga-btn">{t("notfound.btn")}</Link></button>
          </article>
        </section>
    </OverLaped>
    <Footer/>
    </>
  )
}
