import Footer from "../layouts/Footer";
import Form from "../layouts/Form";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/banner.mp4";
import LotusOverlay from "../assets/imgs/icons/lotusOverlay.webp";
import { contactFields } from "../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Meta from "../meta";
import { usePathLanguage } from "../hooks";
// import app from "../firebase";
// import OGP from '../constant/ogp';

export default function Contact() {
  const { t } = useTranslation();
  usePathLanguage();

  const [contact, setContact] = useState({});
  
  const TFields = t('contact.form.fields', {returnObjects: true});
  const TFieldsErrors = t('contact.form.fieldserrors', {returnObjects: true});

  contactFields.forEach((field) => {
    field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
    field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
    field.emptyError = t('contact.form.empty', {field: field.placeholder});
  });

  // sending the contact form to firebase collection called "contact"
  const sendContact = (contactdata) => {
    console.log(contactdata);
    // app.firestore().collection("contact").add(contact).then(() => {
    //   alert(t('contact.form.success'));
    //   setContact({});
    // }).catch((error) => {
    //   alert(error.message);
    // });
  }

  return (
    <>
    <Meta title={t('contact.meta.title')} />
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
    </OverLaped>
    <Footer/>
    </>
  )
}
