import Footer from "../layouts/Footer";
import Form from "../layouts/Form";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/banner.mp4";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.webp";
import { contactFields } from "../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const [contact, setContact] = useState({});

  return (
    <>
    <Header/>
    <OverLaped banner={banner} type={"video"}>
      <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
      <Form
      title={t('contact.title')}
      state={[contact, setContact]}
      fields={contactFields}
      sendBtn={t('contact.form.sendBtn')}
      resetBtn={t('contact.form.resetBtn')}
      />
    </OverLaped>
    <Footer/>
    </>
  )
}
