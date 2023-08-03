// creating a context for modal active state 'false' by default
import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const ModalContext = createContext(false);

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default function ModalProvider({ children }){
    const [activeModal, setActiveModal] = useState(false);
    // using useRef to avoid the modal to be unmounted when the modal is closed
    // const activeModal = useRef(false);
    // const setActiveModal = (value) => activeModal.current = value;

    const ModalActiveState = useMemo(() => ({ activeModal, setActiveModal }), [activeModal]);

    return (
        <ModalContext.Provider value={ModalActiveState}>
        {children}
        </ModalContext.Provider>
    );
}
