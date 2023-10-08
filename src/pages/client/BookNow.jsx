import Footer from "../../layouts/global/Footer";
import Header from "../../layouts/global/Header";
import OverLaped from "../../layouts/global/OverLaped";
import banner from "../../assets/videos/redleaves.mp4";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import Form from "../../layouts/global/Form";
import { bookNowFields } from "../../utils/form";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrentLanguage, usePathLanguage } from "../../hooks";
import { addDocument } from "../../firebase";
import { names } from "../../firebase/collections";
import Error from "../../layouts/global/Error";
import Thank from "../../layouts/client/shared/Thank";
import Meta from "../../meta";
import metadata from "../../meta/meta";
import { emailLog, sendEmail } from "../../email";

export default function BookNow() {
  const { t } = useTranslation();
  const currentLanguage = useCurrentLanguage();
  usePathLanguage();

  const [book, setBook] = useState({});
  const [showThankPage, setShowThankPage] = useState(false);
  const [error, setError] = useState(false);

  const TFields = t('booknow.form.fields', {returnObjects: true});
  const TFieldsErrors = t('booknow.form.fieldserrors', {returnObjects: true});

  const BookNowFields = useMemo(() => bookNowFields.map(field => {
    field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
    field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
    field.empty = t('GlobalForm.emptyField', {field: field.placeholder});
    return field;
  }), [TFields, TFieldsErrors, t]);

  // submiting the form
  const bookNow = async (bookdata) => {
    try {
      // clear the error
      setError(false);
      const book = await addDocument(names.books, {...bookdata, lang: currentLanguage.name, confirmed: false});
      // send the contact as an email to the admin
      const emaillog = await sendEmail({
        to: import.meta.env.VITE_CONTACT_EMAIL,
        from: {
          name: bookdata.fullname,
          email: bookdata.email
        },
        subject: `New Booking From, ${bookdata.fullname}`,
        html: `
          <h1>New Booking Form</h1>
          <p>You have a new booking from, <strong>${bookdata.fullname}<strong>.</p>
          <ul>
            <li><strong>Name:</strong> ${bookdata.fullname}</li>
            <li><strong>Email:</strong> ${bookdata.email}</li>
            <li><strong>Phone:</strong> ${bookdata.phone}</li>
            <li><strong>Interest:</strong> ${bookdata.interest}</li>
          </ul>
          <p><strong><u>BOOKS DASHBOARD:</u></strong> <a href="${import.meta.env.VITE_HOST_NAME}/lotus/books?id=${book.id}">${import.meta.env.VITE_HOST_NAME}/lotus/books?id=${book.id}</a></p>
        `,
        text: `New Booking From, ${bookdata.fullname}\nYou have a new contact from, ${bookdata.fullname}.\nName: ${bookdata.fullname}\nEmail: ${bookdata.email}\nPhone: ${bookdata.phone}\nInterest: ${bookdata.interest}\nBOOKS DASHBOARD: ${import.meta.env.VITE_HOST_NAME}/lotus/books?id=${book.id}`
      });
      // email log
      await emailLog("booking", book, emaillog.messageId);
      setShowThankPage(true);
    } catch (e) {
      setError(e.message);
      console.error("Error adding document: ", e);
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
  if (error) return <Error title={t('GlobalError.title')} error={error.message || t('GlobalError.text')} btn={t('GlobalError.btn')}/>

  // if the form is sent successfully, it will render the thank you page
  if (showThankPage) return <Thank
    title={t('booknow.thank.title', {name: book.fullname})}
    message={t('booknow.thank.message')}
    btn={t('booknow.thank.btn')}
    onBack={() => { setShowThankPage(false); setBook({}); }}
  />

  return (
    <>
    <Meta title={t('booknow.metaTitle')} {...metadata.booknow}/>
    <Header/>
    <OverLaped banner={banner} type="video">
      <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
      <Form
        animatedIcon
        title={t('booknow.title')}
        state={[book, setBook]}
        fields={BookNowFields}
        onSubmit={bookNow}
        EmptyErrorMessage={t('GlobalForm.emptyFields')}
        ErrorMessage={t('GlobalError.text')}
        errorTrigger={error}
        submitBtn={t('booknow.form.submitBtn')}
        resetBtn={t('booknow.form.resetBtn')}
      />
    </OverLaped>
    <Footer/>
    </>
  )
}
