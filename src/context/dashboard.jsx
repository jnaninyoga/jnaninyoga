// context for the active board
import { createContext, useMemo, useState, useEffect } from "react";
import collections, { names } from "../firebase/collections";
import { docSnap, fetchDescDocs } from "../firebase";
import { onSnapshot, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useAdminAuth } from "../hooks";
import Suspens from "../layouts/Suspens";

DashboardProvider.propTypes = {
    children: PropTypes.any,
};

export const DashboardContext = createContext();

export default function DashboardProvider(props) {
    const { verifying } = useAdminAuth();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(
        Object.keys(collections).reduce((obj, collection) => {
            obj[collection] = [];
            return obj;
        }, {})
    );

    const DashBoard = useMemo(() => ({ data, loading, setData }), [data, loading, setData]);

    useEffect(() => {
        Object.keys(collections).forEach(async (collection) => {
            try {
                if(collection === names.auth){
                    const admin = (await docSnap(collections.auth)).docs[0];
                    setData((prevData) => ({ ...prevData, [collection]: { ...admin.data(), id: admin.id } }));
                } else {
                    onSnapshot(fetchDescDocs(collections[collection], where("deleted", "==", false)), (querySnapshot) => {
                        // set the documents in the collection state with there ids
                        setData((prevData) => ({ ...prevData, [collection]: querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) }));
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
            }}
        );
    }, []);

    // it the auth validation is not done yet, return a loading screen
    if (verifying) return <Suspens/>;

    return (
        <DashboardContext.Provider value={DashBoard}>
            {props.children}
        </DashboardContext.Provider>
    )
}