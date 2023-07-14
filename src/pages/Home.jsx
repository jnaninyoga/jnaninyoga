import { useTranslation } from "react-i18next";
import AboutMe from "../components/AboutMe";
import ContactCard from "../components/ContactCard";
import Hero from "../components/Hero";
import Overview from "../components/Overview";
import Yoga from "../components/Yoga";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import Meta from "../meta";
import OGP from '../constant/ogp';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <>
      <Meta title={t('home.meta.title')} description={t('home.meta.description')} keywords={t('home.meta.keywords')} ogp={OGP.home}/>
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
