import { useEffect, useMemo, useState } from "react";
import OverLaped from "../../layouts/OverLaped";
import Footer from "../../layouts/Footer";
import Form from "../../layouts/Form";
import { tokenCoder } from "../../utils";
import { adminLoginFields } from "../../utils/form";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import { useTranslation } from "react-i18next";
import { docSnap } from "../../firebase";
import { useAdminAuth, usePathLanguage, useSearchParamsSerializer } from "../../hooks";
import { useNavigate } from "react-router-dom";
import collections from "../../firebase/collections";

export default function Auth() {
    const { t } = useTranslation();
    const token = useAdminAuth();
    const navigate = useNavigate();
    usePathLanguage();

    // check if the if redericted to the login page with `error` search  param
    const searchParams = useSearchParamsSerializer();

    // if the user is logged in, redirect to the dashboard
    if(!token.verifying && token.auth) navigate(`/lotus`);

    const [auth, setAuth] = useState({});
    // error messages for the login form
    const [error, setError] = useState(false);

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
        setError(false);
        // get the admin data from the database
        const admin = await (await docSnap(collections.auth)).docs[0].data();
        if (admin.username === authdata.username && admin.password === authdata.password){
          tokenCoder("yogacoach", authdata);
          navigate(`/lotus`);
        } else {
          setError(t('adminauth.form.error'));
        }
      }catch(error){
        console.error(error);
      }
    }

    // set error based on serch param error
    useEffect(() => {
      if(!searchParams.error) return;
      setError(searchParams.error);
    }, [searchParams]);

    // effect to clear custom error messages
    useEffect(() => {
      if(!error) return
      const timeout = setTimeout(() => {
        setError(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }, [error]);

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
        ErrorMessage={error}
        errorTrigger={error}
        />
    </OverLaped>
    <Footer/>
    </>
  )
}
