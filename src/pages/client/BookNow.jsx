import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import OverLaped from "../../layouts/OverLaped";
import banner from "../../assets/videos/redleaves.mp4";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import Form from "../../layouts/Form";
import { bookNowFields } from "../../utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrentLanguage, usePathLanguage } from "../../hooks";
import { addDoc } from "firebase/firestore";
import { document } from "../../firebase";
import collections from "../../firebase/collections";
import Error from "../../layouts/Error";
import Thank from "../../layouts/Thank";
import Meta from "../../meta";
import metadata from "../../meta/meta";

export default function BookNow() {
  const { t } = useTranslation();
  const currentLanguage = useCurrentLanguage();
  usePathLanguage();

  const [error, setError] = useState();
  const [book, setBook] = useState({});
  const [showThankPage, setShowThankPage] = useState(false);

  const TFields = t('booknow.form.fields', {returnObjects: true});
  const TFieldsErrors = t('booknow.form.fieldserrors', {returnObjects: true});

  bookNowFields.forEach((field) => {
    field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
    field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
    field.emptyError = t('contact.form.empty', {field: field.placeholder});
  });

  // submiting the form
  const bookNow = async (bookdata) => {
    try {
      await addDoc(collections.books, document({...bookdata, lang: currentLanguage.name, confirmed: false}));
      setShowThankPage(true);
    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e);
    }
  }

  // timeout to return
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowThankPage(false);
      setBook({});
    }, 18000);
    return () => clearTimeout(timeout);
  }, [showThankPage]);

  // check if there is any error
  if (error) return <Error/>

  // if the form is sent successfully, it will render the thank you page
  if (showThankPage) return <Thank
    title={t('booknow.thank.title', {name: book.fullname})}
    message={t('booknow.thank.message')}
    btn={t('booknow.thank.btn')}
    onBack={() => { setShowThankPage(false); setBook({}); }}
  />

  return (
    <>
    <Meta title={t('booknow.meta.title')} {...metadata.booknow}/>
    <Header/>
    <OverLaped banner={banner} type="video">
      <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
      <Form
        title={t('booknow.title')}
        onSubmit={bookNow}
        fields={bookNowFields}
        state={[book, setBook]}
        onEmpty={t('contact.form.onEmpty')}
        sendBtn={t('booknow.form.sendBtn')}
        resetBtn={t('booknow.form.resetBtn')}
      />
    </OverLaped>
    <Footer/>
    </>
  )
}
