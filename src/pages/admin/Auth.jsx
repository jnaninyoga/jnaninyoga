import { useEffect, useMemo, useState } from "react";
import OverLaped from "../../layouts/global/OverLaped";
import Footer from "../../layouts/global/Footer";
import Form from "../../layouts/global/Form";
import { tokenCoder } from "../../utils";
import { adminLoginFields } from "../../utils/form";
import LotusOverlay from "../../assets/imgs/icons/lotusOverlay.webp";
import { useTranslation } from "react-i18next";
import { docSnap } from "../../firebase";
import { useAdminAuth, usePathLanguage, useSearchParamsSerializer } from "../../hooks";
import { useNavigate } from "react-router-dom";
import collections from "../../firebase/collections";
import Suspens from "../../layouts/global/Suspens";

export default function Auth() {
    const { t } = useTranslation();
    const token = useAdminAuth();
    const navigate = useNavigate();
    usePathLanguage();

    const searchParams = useSearchParamsSerializer();

    if(!token.verifying && token.auth) navigate(localStorage.getItem("navigationHistory"));

    const [auth, setAuth] = useState({});
    // error messages for the login form
    const [error, setError] = useState({trigger: false, message: ''});


    const TFields = t('adminauth.form.fields', {returnObjects: true});
    const TFieldsErrors = t('adminauth.form.fieldserrors', {returnObjects: true});
  
    const AdminLoginFields = useMemo(() => adminLoginFields.map(field => {
      field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
      field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
      field.empty = t('GlobalForm.emptyField', {field: field.placeholder});
      return field;
    }), [TFields, TFieldsErrors, t]);

    
    const validateAuth = async (authdata) => {
      try{
        // get the admin data from the database
        const admin = await (await docSnap(collections.auth)).docs[0].data();
        if (admin.username === authdata.username && admin.password === authdata.password){
          tokenCoder(authdata);
          navigate(localStorage.getItem("navigationHistory")); // redirect to the dashboard back in history
        } else {
          setError({trigger: true, message: t('adminauth.form.error')});
        }
      }catch(error){
        // "Something went wrong, please try again late);
        console.error(error);
        setError({trigger: true, message: "Something went wrong, please try again later"});
      }
    }

    useEffect(() => {
      if(!searchParams.error) return
      setError({trigger: true, message: searchParams.error});
    }, [searchParams]);

    // effect to clear custom error messages
    useEffect(() => {
      if(!error.trigger) return
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
        EmptyErrorMessage={t('GlobalForm.emptyFields')}
        ErrorMessage={error.message}
        errorTrigger={error.trigger}
      />
    </OverLaped>
    <Footer/>
    </>
  )
}
