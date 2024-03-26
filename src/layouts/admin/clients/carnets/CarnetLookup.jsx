// === HOOKS ===
import { useMemo, useState } from "react";

// === ASSETS ===
import logo from "../../../../assets/imgs/spine/logo.webp";

// === UTILS ===
import PropTypes from "prop-types";
import { CarnetStatus, dateFormater, periodAccronymMap } from "../../../../utils";

// === COMPONENTS ===
// --- BASE ---
import { Helmet } from "react-helmet-async";
// --- SHARED ---
import Bullet from "./../../shared/Bullet";
// --- LOCAL ---
import Session from "./Session";

CarnetLookup.propTypes = {
  onUpdate: PropTypes.func,
  onReportsDisplay: PropTypes.func,

  client: PropTypes.object.isRequired,
  carnet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    status: PropTypes.oneOf(CarnetStatus).isRequired,
    type: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    sessions: PropTypes.number.isRequired,
    passedSessions: PropTypes.number.isRequired,
    sessionReports: PropTypes.arrayOf(PropTypes.object),
    progress: PropTypes.number,
    price: PropTypes.number.isRequired,
    remainingAmount: PropTypes.number.isRequired,
    payments: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    // => Database document fields
		createdAt: PropTypes.object,
		updatedAt: PropTypes.object,
  }).isRequired,
}

export default function CarnetLookup({ carnet, client, onUpdate=() => console.log("Carnet Lookup Update Clicked"), onReportsDisplay=() => console.log("Carnet Lookup Reports Clicked")}) {
  const [withCarnetIDURL, setWithCarnetIDURL] = useState(false);

  const PaidStatusDisplay = useMemo(() => {
    switch (carnet.status) {
      case "active": return { text: `Active`, ribbon: "ribbon-green" };
      case "paid": return { text: "Paid", ribbon: "ribbon-paid" };
      case "cancelled": return { text: "Cancelled", ribbon: "ribbon-cancelled" };
      default: return { text: `Active`, ribbon: "ribbon-green" };
    }
  }, [carnet.status]);

  return (
    <>
    <Helmet>
      <title>{`${client.firstname} ${client.lastname} - Jnanin Yoga Carnet`}</title>
    </Helmet>
    <section className="relative py-8 px-9 min-h-[340px] max-h-[650px] w-[95%] md:w-[700px] flex justify-center items-center flex-col gap-2 bg-yoga-white rounded-[4px] drop-shadow-md sm:overflow-x-hidden overflow-y-auto bg-texture texture-v-1 print:before:hidden print:bg-transparent print:h-max print:w-screen print:scale-105">
      <div className={`ribbon-top-left ${PaidStatusDisplay.ribbon}`}>{PaidStatusDisplay.text}</div>
      <header className="relative w-full min-w-max print:px-0 print:pr-5 print:py-4 flex items-center gap-8 print:gap-6">
        <div className="w-32 h-32 flex justify-center items-center aspect-square bg-cover bg-center">
          <img src={logo} alt="jnanin yoga client" className="w-[90%] h-[90%] object-cover object-center aspect-square" />
        </div>
        <div className="w-full min-w-max h-full flex flex-col justify-center gap-1">
          {/* biomethric informations */}
          <h2 title={"Client Carnet ID"} className="cinzel text-lg font-semibold text-gray-400">
            # {withCarnetIDURL ? (
              <a href={`${import.meta.env.VITE_HOST_NAME}/lotus/carnets?id=${carnet.id}`} className={`outline-none hover:text-yoga-green focus:text-yoga-green hover:underline focus:underline underline-offset-4 transition-all`} target="_blank" rel="noreferrer">
                {carnet.id}
              </a>
            ) : ( carnet.id )}
          </h2>
          <h1 className="cinzel text-3xl uppercase font-semibold">{client.firstname} {client.lastname}</h1>
          <ul className="w-full flex gap-4">
            <Bullet
              styledText
              title={"Carnet Registration Date"}
              value={dateFormater(carnet.createdAt)}
              icon="fi fi-sr-user-time"
            />
            <Bullet
              styledText
              bold
              title={`${client.firstname} ${client.lastname} Carnets Order`}
              value={
                <span className="font-bold text-lg">#{carnet.order}</span>
              }
              icon="fi fi-sr-apps-sort"
            />
          </ul>
          <ul className="w-full flex gap-4">
            <Bullet
              styledText
              title={`${carnet.type} Carnet Type`}
              value={carnet.type}
              icon="fi fi-sr-address-book"
            />
            <Bullet
              styledText
              title={`Carnet Period`}
              value={periodAccronymMap(carnet.period)}
              icon="fi fi-sr-calendar-clock"
            />
            <Bullet
              styledText
              title={`${client.firstname} ${client.lastname} Carnet Progress`}
              value={
                <div className={`relative h-4 w-[100px] flex items-center text-center bg-gray-300`}>
                  <div className="z-0 h-full bg-yoga-green" style={{width: carnet.progress}}></div>
                  <span className="absolute left-1/2 -translate-x-1/2 z-20">{carnet.progress}%</span>
                </div>
              }
              icon="fi fi-sr-memo-circle-check"
            />
          </ul>
        </div>
      </header>

      <div className="z-[50] w-full h-[4px] bg-yoga-red-ligth"></div>

      <main className="z-[50] w-full flex items-center flex-col gap-4">
        <ul className="w-full flex items-center justify-center gap-4">
          <Bullet
            styledText
            title={`Carnet Total Price: ${carnet.price} MAD`}
            label={"Price:"}
            value={carnet.price + " MAD"}
            icon="fi fi-sr-money-check-edit"
          />
          <Bullet
            styledText
            title={`Paid Amount: ${carnet.payments.at(-1)?.amount ?? 0} MAD`}
            label="Paid:"
            value={`${carnet.payments.at(-1)?.amount ?? 0} MAD`}
            icon="fi fi-sr-hand-holding-usd"
          />
          <Bullet
            styledText
            title={`Remaining Amount: ${carnet.remainingAmount} MAD`}
            label="Remaining:"
            value={carnet.remainingAmount + " MAD"}
            icon="fi fi-sr-coins"
          />
        </ul>

        {/* Table of the sessions; each row must contain 10 Check sesions & and each Check session is eather checked or not */}
        <ul className="w-full grid grid-cols-10 gap-2">
          {Array.from({ length: carnet.sessions }, (_, i) => (
            <Session key={i} passed={i < carnet.passedSessions} />
          ))}
        </ul>

        <ul className="w-full flex items-center justify-center gap-4">
          <Bullet
            styledText
            title={`Carnet Total Sessions: ${carnet.sessions}`}
            label={"Total Sessions:"}
            value={carnet.sessions}
            icon="fi fi-bs-bullseye"
          />
          <Bullet
            styledText
            title={`Passed Sessions: ${carnet.passedSessions}`}
            label="Passed Sessions:"
            value={carnet.passedSessions}
            icon="fi fi-sr-badge"
          />
          <Bullet
            styledText
            title={`Remaining Sessions: ${carnet.sessions - carnet.passedSessions}`}
            label="Remaining Sessions:"
            value={carnet.sessions - carnet.passedSessions}
            icon="fi fi-sr-bars-progress"
          />
        </ul>
      </main>

      <div className="z-[50] w-full h-[4px] bg-yoga-red-ligth"></div>

      <footer className="pt-2 z-20 h-full w-full min-w-max flex justify-center sm:justify-end items-center gap-5 print:hidden">
        <label htmlFor="carnetidurl" title="download the client profile with client id url that will redirect to this client in the clients dashboard" className="flex justify-center items-center gap-1">
          <input
            id="carnetidurl"
            type="checkbox"
            onChange={() => setWithCarnetIDURL(!withCarnetIDURL)}
            checked={withCarnetIDURL}
            className="h-4 w-4 accent-cyan-600 border border-yoga-red active:scale-90 transition-all"
          />
          {" "}With Carnet Id URL
        </label>
        <button onClick={window.print} className="yoga-btn drop-shadow-lg group"><i className="fi fi-sr-file-pdf flex items-center justify-center mr-1 group-hover:text-yoga-green-dark transition-all"></i>{" "}Download</button>
        <button onClick={onReportsDisplay} title={`Show Session Reports For This Carnet`} className={`h-full flex items-center cinzel uppercase px-4 py-3 outline outline-2 -outline-offset-[5px] text-yoga-white bg-gray-400 outline-white hover:bg-gray-600 active:scale-90 drop-shadow-lg transition-all`}><i className="fi fi-sr-newspaper mr-2 text-yoga-white flex justify-center items-center"></i>Session Reports</button>
        <button onClick={onUpdate} title={`Update ${client.firstname} ${client.lastname} Carnet`} className={`h-full flex items-center cinzel uppercase px-4 py-3 outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-green outline-white hover:bg-yoga-green-dark active:scale-90 drop-shadow-lg transition-all`}><i className="fi fi-sr-user-pen mr-2 text-yoga-white flex justify-center items-center"></i>Edit</button>
      </footer>
    </section>
    </>
  )
}
