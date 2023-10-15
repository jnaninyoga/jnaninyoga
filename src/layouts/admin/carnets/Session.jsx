import { memo, useState } from 'react'
import PropTypes from "prop-types";

const Session = memo(({ passed, clickAble=false, onSwitch }) => {
  const [isPassed, setIsPassed] = useState(passed);

  const handleClick = () => {
    if (!clickAble) return;
    setIsPassed((prev) => !prev);
    onSwitch(isPassed);
  }

  return (
    <li tabIndex={1} onClick={handleClick} title={`Session ${isPassed ? "Passed" : "Not Passed"}`} className={`z-50 w-full text-center font-semibold flex items-center justify-center aspect-square ${isPassed ? "bg-yoga-green-dark hover:bg-yoga-green focus:bg-yoga-green" : "bg-yoga-red-dark hover:bg-yoga-red focus:bg-yoga-red" } hover:scale-105 focus:scale-105 outline outline-2 -outline-offset-[5px] outline-white active:scale-90 transition-all`}>
      <i className={`fi fi-br-${isPassed ? "check" : "cross"} flex justify-center items-center text-xl text-yoga-white`}></i>
    </li>
  )
});

Session.displayName = "Session";


Session.propTypes = {
  passed: PropTypes.bool.isRequired,
  clickAble: PropTypes.bool,
  onSwitch: PropTypes.func,
}

export default Session;