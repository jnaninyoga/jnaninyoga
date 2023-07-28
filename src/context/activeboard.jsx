// context for the active board
import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

ActiveBoardProvider.propTypes = {
    children: PropTypes.any,
};

export const ActiveBoardContext = createContext(localStorage.getItem("activeBoard") || "contacts");

export default function ActiveBoardProvider(props) {
    const [activeBoard, setActiveBoard] = useState(localStorage.getItem("activeBoard") || "contacts");
    // set the active board in local storage
    const ActiveBoard = useMemo(() => ({ activeBoard, setActiveBoard }), [activeBoard, setActiveBoard]);
    useMemo(() => localStorage.setItem("activeBoard", activeBoard), [activeBoard]);

    return (
        <ActiveBoardContext.Provider value={ActiveBoard}>
            {props.children}
        </ActiveBoardContext.Provider>
    )
}