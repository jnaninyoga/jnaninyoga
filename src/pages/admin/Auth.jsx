import { useState } from "react";
import OverLaped from "../../layouts/OverLaped";
import Footer from "../../layouts/Footer";
import Form from "../../layouts/Form";
import { adminLoginFields } from "../../utils";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import { useTranslation } from "react-i18next";
import { collectionDB, docSnap } from "../../firebase";
import { useAdminAuth, useCurrentLanguage, usePathLanguage } from "../../hooks";
import { useNavigate } from "react-router-dom";
import * as CryptoJS from "crypto-js";

export default function Auth() {
    const { t } = useTranslation();
    const token = useAdminAuth();
    const navigate = useNavigate();
    const currentLanguage = useCurrentLanguage();
    usePathLanguage();

    console.log(token);

    // if the user is logged in, redirect to the dashboard
    if(!token.loading && token.auth) navigate(`/lotus/${currentLanguage.code}`);

    const [auth, setAuth] = useState({});

    const TFields = t('adminauth.form.fields', {returnObjects: true});
    const TFieldsErrors = t('adminauth.form.fieldserrors', {returnObjects: true});
  
    adminLoginFields.forEach((field) => {
      field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
      field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
      field.emptyError = t('contact.form.empty', {field: field.placeholder});
    });
    
    const validateAuth = async (authdata) => {
      try{
        const auth = collectionDB("auth");
        const admin = await (await docSnap(auth, "admin")).docs[0].data();
        if (admin.username === authdata.username && admin.password === authdata.password){
          console.log("logged in");
          // setting a cookie to remember the user for 1 day
          const date = new Date()
          date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
          // hash the admin password before saving it in the cookie using crypto-js
          // normaliz the hashed password to avoid '=' in the cookie
          admin.password = encodeURIComponent(CryptoJS.AES.encrypt(admin.password, "yogacoach").toString());
          // CryptoJS.AES.decrypt(decodeURIComponent(admin.password), "yogacoach").toString(CryptoJS.enc.Utf8);
          // admin.password = btoa(admin.password);
          document.cookie = `yogacoach=${JSON.stringify(admin)}; expires=${date.toUTCString()}; path=/`;
          navigate(`/lotus/${currentLanguage.code}`);
        }else{
          console.log("not logged in");
        }
      }catch(e){
        console.log(e);
      }
    }

  return (
    <>
    <OverLaped>
        <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
        <Form
        onSubmit={validateAuth}
        onEmpty={t('adminauth.form.onEmpty')}
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
