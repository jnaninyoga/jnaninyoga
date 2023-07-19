import OverLaped from "./OverLaped";
import Footer from "./Footer";
import banner from  "../assets/imgs/stock/thankpage.webp"
import { useTranslation } from "react-i18next";
import { usePathLanguage } from "../hooks";
import PropTypes from 'prop-types';

Thank.propTypes = {
    mr: PropTypes.string,
    onClick: PropTypes.func
};

export default function Thank({mr, onClick}) {
  const { t } = useTranslation();
  usePathLanguage();

  return (
    <>
    <OverLaped banner={banner}>
        <section className="sm:w-[90vw] flex flex-1 justify-center items-center flex-col gap-4">
            <article className="w-full sm:p flex flex-1 justify-center items-center flex-col sm:gap-6 gap-4">
              <h1 className="cinzel sm:text-4xl text-3x text-center text-yoga-white font-bold uppercase">{t("thankpage.title", {mr})}</h1>
              <p className="cinzel sm:text-2xl text-center text-yoga-white font-bold">{t("thankpage.text")}</p>
              <button onClick={onClick} className="cinzel sm:text-2xl text-xl font-bold yoga-btn">{t("thankpage.btn")}</button>
            </article>
        </section>
    </OverLaped>
    <Footer/>
    </>
  )
}
