// context for the active board
import { createContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { dashboardNavbar } from "../utils";

ActiveBoardProvider.propTypes = {
    children: PropTypes.any,
};

export const ActiveBoardContext = createContext(localStorage.getItem("activeBoard") || "clients");

export default function ActiveBoardProvider(props) {
    const [activeBoard, setActiveBoard] = useState(localStorage.getItem("activeBoard") || "clients");
    // getting the target board from the url
    const { board, ...boardParams } = useParams();
    // check if the requested board buy url is valid
    const supportedBoards = useMemo(() => dashboardNavbar.map(board => board.name.toLowerCase()), []);

    // if the board is not supported, redirect to the clients board
    useEffect(() => {
        if (!supportedBoards.includes(board?.toLowerCase())) {
            setActiveBoard("clients");
        } else {
            setActiveBoard(board);
        }
    }, [board, supportedBoards]);

    // set the active board in local storage
    const ActiveBoard = useMemo(() => ({ activeBoard, setActiveBoard, boardParams }), [activeBoard, setActiveBoard, boardParams]);
    useEffect(() => localStorage.setItem("activeBoard", activeBoard), [activeBoard]);

    return (
        <ActiveBoardContext.Provider value={ActiveBoard}>
            {props.children}
        </ActiveBoardContext.Provider>
    )
}