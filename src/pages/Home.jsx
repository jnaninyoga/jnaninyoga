import AboutMe from "../components/AboutMe";
import ContactCard from "../components/ContactCard";
import Hero from "../components/Hero";
import Overview from "../components/Overview";
import Yoga from "../components/Yoga";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

export default function Home() {
  return (
    <>
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
