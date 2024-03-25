// === HOOKS ===
// import { useState } from "react";

// === ASSETS ===
import logo from "../../../../assets/imgs/spine/logo.webp";

// === UTILS ===
import PropTypes from "prop-types";
import { CarnetStatus, dateFormater } from "../../../../utils";
import { useMemo } from "react";

CarnetCard.propTypes = {
  onShow: PropTypes.func,
  carnet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.oneOf(CarnetStatus).isRequired,
    period: PropTypes.string.isRequired,
    sessions: PropTypes.number.isRequired,
    passedSessions: PropTypes.number.isRequired,
    sessionReports: PropTypes.arrayOf(PropTypes.object),
    progress: PropTypes.number,
    price: PropTypes.number.isRequired,
    paidAmount: PropTypes.number,
    remainingAmount: PropTypes.number.isRequired,
    // => Database document fields
		createdAt: PropTypes.object,
		updatedAt: PropTypes.object,
  }).isRequired,
}

export default function CarnetCard({ carnet, onShow=() => console.log("Carnet Card Clicked") }) {
  // Satus display text: active => #{order} | inprogress => In Progress | completed => Completed | paid => Paid | cancelled => Cancelled
  // display status with color: {text, ribbon}

  const SessionStatusDisplay = useMemo(() => {
    if (carnet.progress === 100 || carnet.passedSessions === carnet.sessions) return { text: "Completed", ribbon: "ribbon-green" };
    return { text: "In Progress", ribbon: "ribbon-red" };
  }, [carnet.progress, carnet.passedSessions, carnet.sessions]);

  const PaidStatusDisplay = useMemo(() => {
    switch (carnet.status) {
      case "active": return { text: `#${carnet.order}`, ribbon: "ribbon-green" };
      case "paid": return { text: "Paid", ribbon: "ribbon-paid" };
      case "cancelled": return { text: "Cancelled", ribbon: "ribbon-cancelled" };
      default: return { text: `#${carnet.order}`, ribbon: "ribbon-green" };
    }
  }, [carnet.status, carnet.order]);

  return (
    <article onClick={onShow} className={`relative ${carnet.status === "cancelled" && "opacity-60"} pt-14 px-3 pb-5 h-72 w-60 flex items-center justify-between flex-col yoga-mate-texture rounded-md before:rounded-md cursor-pointer outline outline-2 -outline-offset-[10px] outline-[rgba(21,95,117,0.20)] outline-c shadow-md drop-shadow-md transition-all hover:scale-105 hover:shadow-lg hover:drop-shadow-lg print:bg-none print:before:hidden print:flex print:items-center print:justify-center`}>
      <div className={`ribbon-tape ${SessionStatusDisplay.ribbon}`}>{SessionStatusDisplay.text}</div>
      <div className={`ribbon-top-left ${PaidStatusDisplay.ribbon}`}>{PaidStatusDisplay.text}</div>
      <h1 className="font-bold text-gray-500 text-xs" title="Carnet ID">#{carnet.id}</h1>
      <div className="z-[50] w-[85%] h-[3px] bg-cyan-800 opacity-20 rounded-full"></div>
      
      <img src={logo} className="h-24 w-24 object-center aspect-square" alt="Jnain Yoga Logo" />

      <div className="z-[50] w-[85%] h-[3px] bg-cyan-800 opacity-20 rounded-full"></div>
      
      <h3 className="cinzel flex items-center justify-center text-center flex-col">
        <i className={`fi fi-sr-user-time mr-2 text-yoga-green-dark flex items-center group-hover:text-yoga-green group-focus:text-yoga-green transition-all`}></i>
        {dateFormater(carnet.createdAt)}
      </h3>
    </article>
  )
}
