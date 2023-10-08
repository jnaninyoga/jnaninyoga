import { useTranslation } from "react-i18next";
import AboutMe from "../../components/home/AboutMe";
import ContactCard from "../../components/home/ContactCard";
import Hero from "../../components/home/Hero";
import Gallery from "../../components/home/Gallery";
import Yoga from "../../components/home/Yoga";
import Footer from "../../layouts/global/Footer";
import Header from "../../layouts/global/Header";
import Meta from "../../meta";
import metadata from "../../meta/meta";
import { useActivePage, usePathLanguage } from "../../hooks";
import NotFound from "../../layouts/global/404";
import Reviews from "../../layouts/client/home/Reviews";
import Wrapper from "../../layouts/client/shared/Wrapper";

export default function Home() {
  const { t } = useTranslation();
  const activePage = useActivePage();
  usePathLanguage();

  // check if activePage is notfound, it will render 404 page
  if (activePage === 'notfound') return <NotFound/>;
  
  return (
    <>
      <Meta title={t('home.metaTitle')} {...metadata.home}/>
      <Header/>
      <Wrapper>
        <Hero/>
        <Gallery/>
        <Yoga/>
        <ContactCard/>
        <AboutMe/>
        <Reviews/>
      </Wrapper>
      <Footer/>
    </>
  )
}
