import { useRouteError } from "react-router-dom";
import Icon from "../assets/svg"
import OverLaped from "./OverLaped"
import PropTypes from 'prop-types';

Error.propTypes = {
    error: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    btn: PropTypes.string,
};

export default function Error({error, title="🛑 Something Went Wrong 🛑!", btn="Try Again", icon="https://cdn.lordicon.com/vyukcgvf.json"}) {
    const routerError = useRouteError();

    // refresh the page
    const refreshPage = () => {
        window.location.reload();
    }

  return (
    <OverLaped>
      <section className="w-[90vw] flex flex-1 items-center justify-center flex-col">
        <Icon
          label="Lotus"
          src={icon}
          colors={{oc: "#ffffff", pc: "#fdc5ba", sc: "#8CC9D2"}}
        />
        <h1 className="cinzel text-center sm:text-8xl text-4xl text-yoga-white animate-pulse">{title}</h1>
        {(error || routerError) && <p className="text-yoga-white mt-2">{error || routerError}</p>}
        <button onClick={refreshPage} className="yoga-btn mt-4">{btn}</button>
      </section>
    </OverLaped>
  )
}