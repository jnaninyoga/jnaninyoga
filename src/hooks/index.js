import i18next, { changeLanguage } from "i18next";
import { useState, useEffect, useContext, useMemo} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom/dist";
import { standardNavbar, supportedLanguages, tokenDecoder } from "../utils";
import { docSnap } from "../firebase";
import { DashboardContext } from "../context/dashboard";
import { ActiveBoardContext } from "../context/activeboard";
import collections from "../firebase/collections";
import { ModalContext } from "../context/modal";

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
    const currentLang = useCurrentLanguage();
    const pathLang = supportedLanguages.map(lang => lang.code).includes(lang?.toLowerCase()) ? lang : "en";

    if (currentLang.code !== pathLang) changeLanguage(pathLang);
    return pathLang;
}

// a search params serializer hook, from: ?uid=helloworld&hi=hola' -> to: {uid: "helloworld", hi: "hola"}
export function useSearchParamsSerializer(){
    const location = useLocation();
    return useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    }, [location]);
}

// Auth Hook that check if the user is logged in or not buy checking the token in the cokies 'jnaninyoga'
export function useAdminAuth() {
    const [auth, setAuth] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const navigte = useNavigate();
    const currentLang = useCurrentLanguage();

    useEffect(() => {
        (async () => {
        const token = tokenDecoder("yogacoach");
        // validate the token with firebase
        const admin = await (await docSnap(collections.auth)).docs[0].data();
        // if not logged in redirect to login page
        if (!token || token.password !== admin.password) {
            navigte(`/lotus/${currentLang.code}/login`);
            setVerifying(false);
            return;
        }
    
        if (token.password === admin.password) setAuth(true);
        setVerifying(false);
        })();
    }, [currentLang.code, navigte]);

    return { auth, verifying };
}

// hook that serve the dashboard context
export function useData(){
    const {data, loading, setData} = useContext(DashboardContext);
    return { data, loading, setData };
}

// hook the server the active board in the dashboard
export function useActiveBoard() {
    const {activeBoard, setActiveBoard} = useContext(ActiveBoardContext);
    return { activeBoard, setActiveBoard };
}

// hook that return the modal active state
export function useModalActiveState() {
    const { activeModal, setActiveModal } = useContext(ModalContext);
    return [ activeModal, setActiveModal ];
}