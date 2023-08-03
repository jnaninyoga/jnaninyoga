import Icon from "../assets/svg"
import OverLaped from "./OverLaped"
import PropTypes from 'prop-types';

Error.propTypes = {
    error: PropTypes.string,
};

export default function Error({error}) {
    // refresh the page
    const refreshPage = () => {
        window.location.reload();
    }


  return (
    <OverLaped>
      <section className="w-[90vw] flex flex-1 items-center justify-center flex-col">
        <Icon
          label="Lotus"
          src="https://cdn.lordicon.com/hvuelaml.json"
          colors={{oc: "#ffffff", pc: "#fdc5ba"}}
        />
        <h1 className="cinzel sm:text-8xl text-4xl text-yoga-white animate-pulse">Erro Loading The Data</h1>
        {error && <p className="text-yoga-white mt-2">{error}</p>}
        <button onClick={refreshPage} className="yoga-btn mt-4">Try Again</button>
      </section>
    </OverLaped>
  )
}