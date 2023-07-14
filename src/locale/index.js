import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
.use(HttpApi)
.use(LanguageDetector)
.use(initReactI18next)
.init({
  supportedLngs: ["en", "fr", "ar"],
  // default language to the user's browser language in the supported languages [en, fr, ar]
  lng: ["en", "fr", "ar"].includes(navigator.language) ? navigator.language : "en",
  fallbackLng: "en",
  fallbackNS: "/langs/en.json",
  detection: {
    // changing the name of the local/session storage keys
    lookupLocalStorage: "JY-lang",
    lookupSessionStorage: "JY-lang",
    order: ["path", "localStorage", "sessionStorage", "cookie", "navigator", "htmlTag", "subdomain"],
    cache: ["localStorage", "sessionStorage", "cookie"],
  },
  backend: {
    loadPath: `/langs/{{lng}}.json`,
  },
  react: {
    useSuspense: true, //  <---- this will do the magic of loading the translation files, set it to true will make the app crash
  },
  interpolation: {
    escapeValue: false // react already safes from xss
  },
//   debug: true
});