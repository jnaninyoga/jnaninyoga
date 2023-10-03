import { useEffect, useMemo, useState } from "react";
import OverLaped from "../../layouts/OverLaped";
import Footer from "../../layouts/Footer";
import Form from "../../layouts/Form";
import { tokenCoder } from "../../utils";
import { adminLoginFields } from "../../utils/form";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import { useTranslation } from "react-i18next";
import { docSnap } from "../../firebase";
import { useAdminAuth, usePathLanguage } from "../../hooks";
import { useNavigate } from "react-router-dom";
import collections from "../../firebase/collections";
import Suspens from "../../layouts/Suspens";

export default function Auth() {
    const { t } = useTranslation();
    const token = useAdminAuth();
    const navigate = useNavigate();
    usePathLanguage();

    if(!token.verifying && token.auth) navigate(localStorage.getItem("navigationHistory"));

    const [auth, setAuth] = useState({});
    // error messages for the login form
    const [error, setError] = useState({trigger: false, message: ''});

    const TFields = t('adminauth.form.fields', {returnObjects: true});
    const TFieldsErrors = t('adminauth.form.fieldserrors', {returnObjects: true});
  
    const AdminLoginFields = useMemo(() => adminLoginFields.map(field => {
      field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
      field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
      field.empty = t('contact.form.empty', {field: field.placeholder});
      return field;
    }), [TFields, TFieldsErrors, t]);

    
    const validateAuth = async (authdata) => {
      try{
        // clear the error message
        setError({trigger: false, message: ''});
        // get the admin data from the database
        const admin = await (await docSnap(collections.auth)).docs[0].data();
        if (admin.username === authdata.username && admin.password === authdata.password){
          tokenCoder(authdata);
          navigate(localStorage.getItem("navigationHistory")); // redirect to the dashboard back in history
        } else {
          setError({trigger: true, message: t('adminauth.form.error')});
        }
      }catch(error){
        setError({trigger: true, message: "Something went wrong, please try again later."}); // "Something went wrong, please try again later.
        console.error(error);
      }
    }

    // set error based on serch param error
    useEffect(() => {
      const localErrorLogin = localStorage.getItem('loginerror');
      console.warn(localErrorLogin);
      if(!localErrorLogin) return;
      setError({trigger: true, message: localErrorLogin});
      localStorage.removeItem('loginerror'); // remove the error from the local storage
    }, []);

    // effect to clear custom error messages
    useEffect(() => {
      if(!error) return
      const timeout = setTimeout(() => {
        setError({trigger: false, message: ''});
      }, 5000);
      return () => clearTimeout(timeout);
    }, [error]);

  
  // it the auth validation is not done yet, return a loading screen
  if (token.verifying) return <Suspens/>;

  return (
    <>
    <OverLaped>
        <img src={LotusOverlay} className={`opacity-100 -z-10 absolute scale-75 sm:bottom-6 bottom-0 sm:right-4 right-1 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
        <Form
        animatedIcon
        title={t('adminauth.title')}
        state={[auth, setAuth]}
        fields={AdminLoginFields}
        onSubmit={validateAuth}
        submitBtn={t('adminauth.form.login')}
        EmptyErrorMessage={t('adminauth.form.error')}
        ErrorMessage={error.message}
        errorTrigger={error.trigger}
        />
    </OverLaped>
    <Footer/>
    </>
  )
}
