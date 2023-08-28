import i18next, { changeLanguage } from "i18next";
import { useState, useEffect, useContext, useMemo} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom/dist";
import { standardNavbar, supportedLanguages, tokenDecoder } from "../utils";
import { docSnap, fetchDescDocs, fetchDocs } from "../firebase";
import { ActiveBoardContext } from "../context/activeboard";
import collections, { names } from "../firebase/collections";
import { onSnapshot, orderBy, where } from "firebase/firestore";

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

// load dashboard data
export function useData(collection){
    const { verifying, auth } = useAdminAuth();
    const [data, setData] = useState(JSON.parse(localStorage.getItem(collection)));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const navigate = useNavigate();

    // check if the session still valid:
    if(!verifying && !auth ) {
        // clear the cached data
        Object.values(names).forEach(name => localStorage.removeItem(name));
        navigate("/lotus/login?error=Your session has expired, please login again")
    }

    // start loading data based on the collection
    useEffect(() => {
        (async () => {
            //swith the collection:
            switch (collection) {
                case names.auth:
                    try {
                        const admin = (await docSnap(collections.auth)).docs[0];
                        setData({ ...admin.data(), id: admin.id });
                    } catch (error) {
                        console.error(`${collection.toUpperCase()} DASHBOARD ERROR`, error);
                        setError(error);
                    } finally {
                        setLoading(false);
                    }
                break;

                case names.classes:
                    try {
                        onSnapshot(fetchDocs(collections[collection], orderBy("order")), (querySnapshot) => {
                            // check if the session still valid:
                            // if(!verifying && !auth ) navigate("/lotus/login?error=Your session has expired, please login again");
    
                            // set the documents in the collection state with there ids
                            // order the sessions by there time that session is starting, the start time is like this: sessions = [{type: number, start: string = "hh:mm"}, {type: number, start: string = "hh:mm"}]
                            // checking for sessions who not have a start time like this: sessions = [{type: number}, {type: number, start: string = "hh:mm"}]
                            // setData((prevData) => ({ ...prevData, [collection]: querySnapshot.docs.map((doc) => ({ ...doc.data(), day: doc.id, sessions: doc.data().sessions.sort((a, b) => a?.start?.localeCompare(b?.start)) })) }));
                            // console.log("classes", data.classes);
                            setData( querySnapshot.docs.map( doc => ({ ...doc.data(), day: doc.id }) ) );
                        });
                    } catch (error) {
                        console.error(`${collection.toUpperCase()} DASHBOARD ERROR`, error);
                        setError(error);
                    } finally {
                        setLoading(false);
                    }
                break;

                default:
                    try{
                        onSnapshot(fetchDescDocs(collections[collection], where("deleted", "==", false)), (querySnapshot) => {
                            // check if the session still valid:
                            // if(!verifying && !auth ) navigate("/lotus/login?error=Your session has expired, please login again");
                            // set the documents in the collection state with there ids
                            setData( querySnapshot.docs.map( doc => ({ ...doc.data(), id: doc.id }) ) );
                        });
                    } catch (error) {
                        console.error(`${collection.toUpperCase()} DASHBOARD ERROR`, error);
                        setError(error);
                    } finally {
                        setLoading(false);
                    }
                break;
            }
        })();
    }, [collection]);

    // cache the data in the local storage
    useEffect(() => {
        localStorage.setItem(collection, JSON.stringify(data));
    }, [data, collection]);

    console.info(`${collection.toUpperCase()} DASHBOARD DATA`, data, loading);

    return [data, loading, error];
}

// hook the server the active board in the dashboard
export function useActiveBoard() {
    const {activeBoard, setActiveBoard} = useContext(ActiveBoardContext);
    return { activeBoard, setActiveBoard };
}
