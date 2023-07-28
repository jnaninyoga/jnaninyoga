import { useEffect, useState } from "react";
import OverLaped from "../../layouts/OverLaped";
import Footer from "../../layouts/Footer";
import Form from "../../layouts/Form";
import { adminLoginFields, tokenCoder } from "../../utils";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import { useTranslation } from "react-i18next";
import { docSnap } from "../../firebase";
import { useAdminAuth, useCurrentLanguage, usePathLanguage } from "../../hooks";
import { useNavigate } from "react-router-dom";
import collections from "../../firebase/collections";

export default function Auth() {
    const { t } = useTranslation();
    const token = useAdminAuth();
    const navigate = useNavigate();
    const currentLanguage = useCurrentLanguage();
    usePathLanguage();

    // if the user is logged in, redirect to the dashboard
    if(!token.loading && token.auth) navigate(`/lotus/${currentLanguage.code}`);

    const [auth, setAuth] = useState({});
    // error messages for the login form
    const [error, setError] = useState();

    const TFields = t('adminauth.form.fields', {returnObjects: true});
    const TFieldsErrors = t('adminauth.form.fieldserrors', {returnObjects: true});
  
    adminLoginFields.forEach((field) => {
      field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
      field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
      field.emptyError = t('contact.form.empty', {field: field.placeholder});
    });
    
    const validateAuth = async (authdata) => {
      try{
        const admin = await (await docSnap(collections.auth)).docs[0].data();
        if (admin.username === authdata.username && admin.password === authdata.password){
          tokenCoder("yogacoach", authdata);
          navigate(`/lotus/${currentLanguage.code}`);
        } else {
          setError(t('adminauth.form.onEmpty'));
        }
      }catch(error){
        console.log(error);
      }
    }

    /// 5s timeout to clear the error message
    useEffect(() => {
      if(!error) return;
      const timeout = setTimeout(() => setError(), 5000);
      return () => clearTimeout(timeout);
    }, [error]);

  return (
    <>
    <OverLaped>
        <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
        <Form
        onSubmit={validateAuth}
        onEmpty={t('adminauth.form.onEmpty')}
        onError={error}
        title={t('adminauth.title')}
        state={[auth, setAuth]}
        fields={adminLoginFields}
        sendBtn={t('adminauth.form.login')}
        />
    </OverLaped>
    <Footer/>
    </>
  )
}
