// creaing context for the language switcher
import { createContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { activePage } from "../utils";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

export const TranslateContext = createContext();

TranslateProvider.propTypes = {
    children: PropTypes.any,
};

export default function TranslateProvider(props) {
    const { t } = useTranslation();
    const navbar = t("navbar", { returnObjects: true });
    const translation = t(activePage(), { returnObjects: true });
    
    return (
        <TranslateContext.Provider value={{navbar, translation}}>
            <Header/>
            {props.children}
            <Footer/>
        </TranslateContext.Provider>
    )
}
