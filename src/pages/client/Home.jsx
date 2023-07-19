import { useTranslation } from "react-i18next";
import AboutMe from "../../components/AboutMe";
import ContactCard from "../../components/ContactCard";
import Hero from "../../components/Hero";
import Overview from "../../components/Overview";
import Yoga from "../../components/Yoga";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import Meta from "../../meta";
import metadata from "../../meta/meta";
import { useActivePage, usePathLanguage } from "../../hooks";
import NotFound from "../../layouts/404";
import Reviews from "../../layouts/Reviews";
import Wrapper from "../../layouts/Wrapper";

export default function Home() {
  const { t } = useTranslation();
  const activePage = useActivePage();
  usePathLanguage();

  // check if activePage is notfound, it will render 404 page
  if (activePage === 'notfound') return <NotFound/>;
  
  return (
    <>
      <Meta title={t('home.meta.title')} {...metadata.home}/>
      <Header/>
      <Wrapper>
        <Hero/>
        <Overview/>
        <Yoga/>
        <ContactCard/>
        <AboutMe/>
        <Reviews/>
      </Wrapper>
      <Footer/>
    </>
  )
}
