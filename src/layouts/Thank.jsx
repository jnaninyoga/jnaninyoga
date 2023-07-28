import OverLaped from "./OverLaped";
import Footer from "./Footer";
import banner from  "../assets/imgs/stock/thankpage.webp"
import { useTranslation } from "react-i18next";
import { usePathLanguage } from "../hooks";
import PropTypes from 'prop-types';
import Icon from "../assets/svg";

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
        <section className="sm:w-[90vw] h-full flex flex-1 justify-center items-center flex-col gap-4">
            <div className="flex flex-col justify-center items-center">
              <Icon
              label="Lotus"
              src="https://cdn.lordicon.com/hvuelaml.json"
              colors={{oc: "#ffffff", pc: "#fdc5ba"}}
              />
              <h1 className="cinzel sm:text-4xl text-4xl text-center text-yoga-white font-bold uppercase">{t("thankpage.title", {mr})}</h1>
            </div>
            <article className="w-full sm:p flex flex-1 justify-center items-center flex-col sm:gap-6 gap-4">
              <p className="cinzel sm:text-2xl text-center text-yoga-white font-bold">{t("thankpage.text")}</p>
              <button onClick={onClick} className="cinzel sm:text-2xl text-xl font-bold yoga-btn">{t("thankpage.btn")}</button>
            </article>
        </section>
    </OverLaped>
    <Footer/>
    </>
  )
}
