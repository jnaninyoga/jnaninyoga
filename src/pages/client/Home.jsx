import { useTranslation } from "react-i18next";
import AboutMe from "../../components/AboutMe";
import ContactCard from "../../components/ContactCard";
import Hero from "../../components/Hero";
import Overview from "../../components/Overview";
import Yoga from "../../components/Yoga";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import Meta from "../../meta";
import { usePathLanguage } from "../../hooks";
// import { useParams } from "react-router-dom/dist";
// import OGP from '../constant/ogp';

export default function Home() {
  const { t } = useTranslation();
  usePathLanguage();
  
  return (
    <>
      <Meta title={t('home.meta.title')}/>
      <Header/>
      <Hero/>
      <Overview/>
      <Yoga/>
      <ContactCard/>
      <AboutMe/>
      <Footer/>
    </>
  )
}
