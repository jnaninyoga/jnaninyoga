// context for the active board
import { createContext, useMemo, useState, useEffect } from "react";
import collections, { names } from "../firebase/collections";
import { docSnap, fetchDescDocs, fetchDocs } from "../firebase";
import { onSnapshot, orderBy, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useAdminAuth } from "../hooks";
import Suspens from "../layouts/Suspens";
import Error from "../layouts/Error";

DashboardProvider.propTypes = {
    children: PropTypes.any,
};

export const DashboardContext = createContext();

export default function DashboardProvider(props) {
    const { verifying } = useAdminAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(
        Object.keys(collections).reduce((obj, collection) => {
            obj[collection] = [];
            return obj;
        }, {})
    );

    const DashBoard = useMemo(() => ({ data, loading, setData }), [data, loading, setData]);

    useEffect(() => {
        Object.keys(collections).forEach(async (collection) => {
            if(collection === names.auth){
                try {
                    const admin = (await docSnap(collections.auth)).docs[0];
                    setData((prevData) => ({ ...prevData, [collection]: { ...admin.data(), id: admin.id } }));
                } catch (error) {
                    console.error(`${collection.toUpperCase()} DASHBOARD ERROR`, error);
                    setError(error);
                } finally {
                    setLoading(false);
                }

            } else if(collection === names.classes){
                try {
                    onSnapshot(fetchDocs(collections[collection], orderBy("order")), (querySnapshot) => {
                        // check if the session still valid:
                        // if(!verifying && !auth ) navigate("/lotus/login?error=Your session has expired, please login again");

                        // set the documents in the collection state with there ids
                        // order the sessions by there time that session is starting, the start time is like this: sessions = [{type: number, start: string = "hh:mm"}, {type: number, start: string = "hh:mm"}]
                        // checking for sessions who not have a start time like this: sessions = [{type: number}, {type: number, start: string = "hh:mm"}]
                        // setData((prevData) => ({ ...prevData, [collection]: querySnapshot.docs.map((doc) => ({ ...doc.data(), day: doc.id, sessions: doc.data().sessions.sort((a, b) => a?.start?.localeCompare(b?.start)) })) }));
                        // console.log("classes", data.classes);
                        setData((prevData) => ({ ...prevData, [collection]: querySnapshot.docs.map((doc) => ({ ...doc.data(), day: doc.id })) }));
                    });
                } catch (error) {
                    console.error(`${collection.toUpperCase()} DASHBOARD ERROR`, error);
                    setError(error);
                } finally {
                    setLoading(false);
                }

            } else {
                try{
                    onSnapshot(fetchDescDocs(collections[collection], where("deleted", "==", false)), (querySnapshot) => {
                        // check if the session still valid:
                        // if(!verifying && !auth ) navigate("/lotus/login?error=Your session has expired, please login again");
                        // set the documents in the collection state with there ids
                        setData((prevData) => ({ ...prevData, [collection]: querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) }));
                    });
                } catch (error) {
                    console.error(`${collection.toUpperCase()} DASHBOARD ERROR`, error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            } 
        });
    }, [verifying]);

    console.log("DASHBOARD DATA:", data);

    // it the auth validation is not done yet, return a loading screen
    if (verifying) return <Suspens/>;

    // if there is an error, return an error screen
    if (error) { alert(error.message || error); return <Error error={error} />}

    return (
        <DashboardContext.Provider value={DashBoard}>
            {props.children}
        </DashboardContext.Provider>
    )
}