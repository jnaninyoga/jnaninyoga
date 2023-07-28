import { useState, useEffect } from "react";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import Form from "../../layouts/Form";
import OverLaped from "../../layouts/OverLaped";
import banner from "../../assets/videos/banner.mp4";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import { contactFields } from "../../utils";
import { useTranslation } from "react-i18next";
import Meta from "../../meta";
import metadata from "../../meta/meta";
import { useCurrentLanguage, usePathLanguage } from "../../hooks";
import { document } from "../../firebase";
import { addDoc } from "firebase/firestore";
import Thank from "../../layouts/Thank";
import Followers from "../../components/Followers";
import collections from "../../firebase/collections";

export default function Contact() {
  const { t } = useTranslation();
  const currentLanguage = useCurrentLanguage();
  usePathLanguage();

  const [contact, setContact] = useState({});
  const [showThankPage, setShowThankPage] = useState(false);
  
  const TFields = t('contact.form.fields', {returnObjects: true});
  const TFieldsErrors = t('contact.form.fieldserrors', {returnObjects: true});

  contactFields.forEach((field) => {
    field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
    field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
    field.emptyError = t('contact.form.empty', {field: field.placeholder});
  });

  // sending the contact form to firebase collection called "contact"
  const sendContact = async (contactdata) => {
    try {
      await addDoc(collections.contacts, document({...contactdata, lang: currentLanguage.name, answered: false}));
      setShowThankPage(true);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowThankPage(false);
      setContact({});
    }, 18000);
    return () => clearTimeout(timeout);
  }, [showThankPage]);

  // if the contact form is sent successfully, it will render the thank you page
  if (showThankPage) return <Thank mr={contact.fullname} onClick={() => { setShowThankPage(false); setContact({}); }}/>

  return (
    <>
    <Meta title={t('contact.meta.title')} {...metadata.contact}/>
    <Header/>
    <OverLaped banner={banner} type={"video"}>
      <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
      <Form
      onSubmit={sendContact}
      onEmpty={t('contact.form.onEmpty')}
      title={t('contact.title')}
      state={[contact, setContact]}
      fields={contactFields}
      sendBtn={t('contact.form.sendBtn')}
      resetBtn={t('contact.form.resetBtn')}
      />
      <Followers/>
    </OverLaped>
    <Footer/>
    </>
  )
}
