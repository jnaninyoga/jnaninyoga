import i18next, { changeLanguage } from "i18next";
import { useState, useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom/dist";
import { standardNavbar, supportedLanguages } from "../utils";
import { collectionDB, docSnap } from "../firebase";
import * as CryptoJS from "crypto-js";

export function useIntersectView(ref) {
    const [isIntersected, setIsintersected] = useState();
  
    useEffect(()=>{
        const observer = new IntersectionObserver(entries =>{
            setIsintersected(entries[0].isIntersecting);
        });
        observer.observe(ref.current);
    }, [ref]);

    return isIntersected;
}

// hook for the active page that return the active page regardless of the language
export function useActivePage() {
    const path = useLocation().pathname.toLowerCase().split("/");
    const pathPage = supportedLanguages.map(lang => lang.code).includes(path[1]) ? path[2] : path[1];
    const activePage = !pathPage ? "home" : pathPage;
    return standardNavbar.map(page => page.toLowerCase()).includes(activePage) ? activePage : "notfound";
}

export function useCurrentLanguage() {
    return supportedLanguages.find(lang => lang.code === i18next.language)
}

// change the i18next language based on the page path like about/ => about/en
export function usePathLanguage() {
    const { lang } = useParams();
    // const queryLang = useLocation().search.split("=")[1];
    const currentLang = useCurrentLanguage();
    const pathLang = supportedLanguages.map(lang => lang.code).includes(lang?.toLowerCase()) ? lang : "en";

    // if (!supportedLanguages.find(lang => lang.code === pathLang)) return;
    // if (currentLang.code !== queryLang && !lang) changeLanguage(queryLang);
    if (currentLang.code !== pathLang) changeLanguage(pathLang);
    return pathLang;
}

// Auth Hook that check if the user is logged in or not buy checking the token in the cokies 'jnaninyoga'
export function useAdminAuth() {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigte = useNavigate();
    const currentLang = useCurrentLanguage();

    useEffect(() => {
        (async () => {
        const token = document.cookie.search("yogacoach") !== -1 ? JSON.parse(document.cookie.split(";").find(cookie => cookie.includes("yogacoach")).split("=")[1]) : null;
        const decodedToken = token ? CryptoJS.AES.decrypt(decodeURIComponent(token.password), "yogacoach").toString(CryptoJS.enc.Utf8) : null;
        // validate the token with firebase
        const auth = collectionDB("auth");
        const admin = await (await docSnap(auth)).docs[0].data();
        // if not logged in redirect to login page
        if (!decodedToken || decodedToken !== admin.password) {
            navigte(`/lotus/${currentLang.code}/login`);
            setLoading(false);
            return;
        }
    
        if (decodedToken === admin.password) setAuth(true);
        setLoading(false);
        })();
    }, [currentLang.code, navigte]);

    return { auth, loading };
}