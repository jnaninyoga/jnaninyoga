// === HOOKS ===
import { useMemo, useState, useEffect } from "react";
import { useCallback } from "react";

// === ASSETS ===
import Icon from "../../../../assets/svg";

// === UTILS ===
import PropTypes from "prop-types";
import { CarnetStatus, date, dateFormater, periodAccronymMap } from "../../../../utils";

// === COMPONENTS ===
// -- shared
import Bullet from "../../shared/Bullet";
// -- global
import LabeledSelect from "../../../global/LabeledSelect";
// -- local
import Session from "./Session";


CarnetUpdate.propTypes = {
  client: PropTypes.object.isRequired,
  carnet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    status: PropTypes.oneOf(CarnetStatus).isRequired, // Active, Paid, Cancelled
    type: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    sessions: PropTypes.number.isRequired,
    passedSessions: PropTypes.number.isRequired,
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
  configurations: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default function CarnetUpdate({ carnet, client, configurations, onUpdate, onCancel}) {
  const [carnetData, setCarnetData] = useState(carnet);
  const [paymentTicketSwitch, setPaymentTicketSwitch] = useState(false);
  const [APIDate, setAPIDate] = useState(new Date());
  const [paidAmount, setPaidAmount] = useState(0);
  const [carnetCancelled, setCarnetCancelled] = useState(carnet.status === "cancelled");

  const [crntSettingsMapIdx, setCrntSettingsMapIdx] = useState(0);

  const carnetConfigType = useMemo(() => configurations[carnetData.type], [configurations, carnetData.type]);

  // set the date to the current date
  useEffect(() => {
    date().then(date => date).then(date => setAPIDate(date));
  }, []);
  
  // calculate the progress in the fly
  carnetData.progress = Math.round((carnetData.passedSessions / carnetData.sessions) * 100);
  // carnetData.fullypaid = carnetData.passedSessions === carnetData.sessions && carnetData.remainingAmount === 0;


  const totalPayments = useMemo(() => carnetData.payments.reduce((acc, payment) => acc + payment.amount, 0), [carnetData]);
  const remainingAmount = useMemo(() => carnetData.price - (totalPayments + paidAmount), [carnetData.price, totalPayments, paidAmount]);

  // carnet stutus handler
  // #-[SATUESES]: active, inprogress, completed, paid, cancelled
  carnetData.status = useMemo(() => {
    if (carnetData.remainingAmount === 0) return "paid";
    return !carnetCancelled ? "active" : "cancelled";
  }, [carnetData, carnetCancelled]);

  console.log("Carnet Status: ", carnetData.status);


  // handle the paid amount change, max: carnetData.price, min: 0
  const handlePaidAmountChange = useCallback((e) => {
    const amount = e.target.value*1;
    if (amount >= 0 && amount <= carnetData.price) setPaidAmount(amount);
  }, [carnetData.price]);

  // calculate the remaining amount
  useEffect(() => {
    if (paidAmount >= 0 && paidAmount <= carnetData.price) {
      setCarnetData(prev => ({
        ...prev,
        remainingAmount: remainingAmount < 0 ? 0 : remainingAmount,
      }));
    }
  }, [carnetData.price, totalPayments, paidAmount, remainingAmount]);

  // push the payment ticket to the payments array history
  const addPaymentTicket = useCallback(() => { 
    if (paidAmount > 0 && paidAmount <= carnetData.price) {
      setCarnetData(prev => ({
        ...prev,
        payments: [...prev.payments, { amount: paidAmount, date: APIDate }],
      }));
      setPaymentTicketSwitch(true);
    }
  }, [paidAmount, carnetData.price, APIDate]);

  // calculate the passed sessions
  const setPassedSessions = useCallback((flag) => {
    if (carnetData.passedSessions < carnetData.sessions) {
      setCarnetData(prev => ({ ...prev, passedSessions: prev.passedSessions + (flag ? -1 : 1) }));
    } else {
      setCarnetData(prev => ({ ...prev, passedSessions: prev.passedSessions + (flag ? -1 : 0) }));
    }
  }, [carnetData.sessions, carnetData.passedSessions]);


  const updateCarnet = useCallback( async (e) => {
    e.preventDefault();
    try {
      await onUpdate(carnetData);
    } catch (error) {
      console.error("Error updating carnet: ", error);
    }
  }, [carnetData, onUpdate]);

  const reset = () => {
    setCarnetData(carnet);
    onCancel && onCancel();
  }

  return (
    <form onSubmit={updateCarnet} className="max-h-[90%] max-w-xl w-full sm:px-10 px-2 py-10 flex items-center flex-col gap-4 bg-texture texture-v-1 before:max-h-full overflow-y-auto">
      <div className={`sm:h-24 sm:w-32 h-20 w-28 flex items-center justify-center transition-all duration-500 select-none z-10 `}>
        <Icon
          label="Lotus"
          colors={{oc: "#ffffff", pc: "#fdc5ba"}}
          height={160}
          width={160}
        />
      </div>
      <h1 className="cinzel text-center text-4xl text-yoga-green-dark font-bold uppercase z-10">#{carnetData.order}</h1>
			<h1 className={`cinzel text-center text-3xl font-bold uppercase transition-all duration-500 z-10`}>Update {client.firstname} {client.lastname} Carnet</h1>
      <ul className="flex justify-center flex-col">
        <Bullet
          sm
          title={"Carnet ID"}
          label={"CRID :"}
          value={"#"+carnetData.id}
          icon="fi fi-sr-address-book"
        />
        <Bullet
          sm
          title={"Client ID"}
          label={"CID :"}
          value={<a href={`/lotus/clients/${client.id}`} target="_blank" rel="noopener noreferrer">{"#"+client.id}</a>}
          icon="fi fi-sr-user"
        />
      </ul>


      {/* === [OLD]: CARNETS ATTRIBUTES, CANCELED IDEA 
          => REASON: CAUSE IT'S CHANGES THE CARNET PRICES WISH IS ALSO ASSOCIATED WITH THE PAYMENTS
          => AND REMEAING AMOUNTS, WISH IS ALSO ASSOCIATED WITH THE PAYMENTS

          [ALTERED]: THE CARNET ATTRIBUTES WILL BE DISPLAYED [READ-ONLY] IN THE CARNET EDIT/UPDATE FORM CARD
          => AND ALSO ADDING THE OPTION TO FLAGE THIS CARNET AS `CANCLED` OR `NOT.
      */}
      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all`}>Carnet Attributes:</h4>
        <div className="w-full h-[2.5px] bg-cyan-800 bg-opacity-20"></div>
      </div>

      <section className="w-full flex items-center flex-col gap-4 z-[200]">
        <LabeledSelect
          readOnly
          id="carnettype"
          label="Select Carnet Type"
          options={Object.keys(configurations)}
          onSelect={type => { 
            setCarnetData(prev => ({ ...prev, type }));
            setCrntSettingsMapIdx(0); // reset the settings map index
          }}
          defaultSelected={carnetData.type}
        />
        <LabeledSelect
          readOnly
          id="carnetperiod"
          label="Select Carnet Period"
          options={carnetConfigType.periods}
          onSelect={period => { 
            setCarnetData(prev => ({ ...prev, period }));
            setCrntSettingsMapIdx(carnetConfigType.periods.indexOf(period));
          }}
          defaultSelected={carnetConfigType.periods[crntSettingsMapIdx]}
          valueFormatter={periodAccronymMap}
        />
        <LabeledSelect
          readOnly
          id="carnetprice"
          label="Select Carnet Price"
          options={carnetConfigType.prices.map(price => price.toString())}
          onSelect={price => { 
            setCarnetData(prev => ({ ...prev, price: parseFloat(price) }));
            setCrntSettingsMapIdx(carnetConfigType.prices.indexOf(parseFloat(price)));
          }}
          defaultSelected={carnetConfigType.prices[crntSettingsMapIdx]}
          valueFormatter={price => `${price} MAD`}
        />
        <LabeledSelect
          readOnly
          id="carnetsessions"
          label="Select Carnet Sessions"
          options={carnetConfigType.sessions.map(session => session.toString())}
          onSelect={sessions => { 
            setCarnetData(prev => ({ ...prev, sessions: parseInt(sessions) }));
            setCrntSettingsMapIdx(carnetConfigType.sessions.indexOf(parseInt(sessions)));
          }}
          defaultSelected={carnetConfigType.sessions[crntSettingsMapIdx]}
          valueFormatter={session => `${session} Sessions`}
        />
      </section>
      {/* ============================================================================================================================================== */}

      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all`}>Sessions:</h4>
        <div className="w-full h-[2.5px] bg-cyan-800 bg-opacity-20"></div>
      </div>

      <section className="w-full flex items-center justify-center flex-col gap-4">
        <h3 className="cinzel font-semibold z-40">Progress: <span className="cinzel text-yoga-green-dark">{carnetData.progress}%</span></h3>

        {/* Table of the sessions; each row must contain 10 Check sesions & and each Check session is eather checked or not */}
        <ul className="w-full px-2 grid grid-cols-10 gap-2">
          {Array.from({ length: carnetData.sessions }, (_, i) => (
            <Session key={i} passed={i < carnet.passedSessions} clickAble onSwitch={setPassedSessions} />
          ))}
        </ul>
      </section>


      <ul className="w-full flex items-center justify-center gap-4">
        <Bullet
          styledText
          title={`Carnet Total Sessions: ${carnetData.sessions}`}
          label={"Total:"}
          value={carnetData.sessions}
          icon="fi fi-bs-bullseye"
        />
        <Bullet
          styledText
          title={`Passed: ${carnetData.passedSessions}`}
          label="Passed Sessions:"
          value={carnetData.passedSessions}
          icon="fi fi-sr-badge"
        />
        <Bullet
          styledText
          title={`Remaining Sessions: ${carnetData.sessions - carnetData.passedSessions}`}
          label="Remaining:"
          value={carnetData.sessions - carnetData.passedSessions}
          icon="fi fi-sr-bars-progress"
        />
      </ul>

      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all`}>Carnet Payment:</h4>
        <div className="w-full h-[2.5px] bg-cyan-800 bg-opacity-20"></div>
      </div>

      <section className="w-full flex items-center flex-col gap-4 z-[200]">
        <p className="cinzel font-semibold">Last Payment: <span className="cinzel text-yoga-green-dark">{carnetData.payments.at(-1)?.date.toString().toLowerCase() ?? "No Payment"}</span></p>

        <label htmlFor={"carnetprice"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Carnet Price:</span>
          <input id={"price"} type={"text"} name="price" readOnly title={`Carnet Price: ${carnetData.price} MAD`} value={carnetData.price+" MAD"} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>

        <div className="w-full flex justify-between items-center gap-4">
          <label htmlFor={"paidAmount"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
            <span className="cinzel capitalize min-w-max cursor-pointer">Paid Amount:</span>
            <input id={"paidAmount"} type={"number"} name="paidAmount" title={`Paid Amount: ${paidAmount} MAD`} value={paidAmount} min={0} max={carnetData.price*1} onChange={handlePaidAmountChange} className="outline-none h-full w-full bg-transparent" />
          </label>
          <button type="button" onClick={() => addPaymentTicket()} disabled={paymentTicketSwitch && carnetData.remainingAmount === 0} className="h-full w-full max-w-[45px] aspect-square flex items-center justify-center bg-yoga-green-dark hover:bg-yoga-green focus:bg-yoga-green hover:scale-105 focus:scale-105 outline outline-2 -outline-offset-[5px] outline-white active:scale-90 disabled:pointer-events-none disabled:bg-gray-600 transition-all"><i className="fi fi-sr-receipt flex items-center justify-center text-yoga-white"></i></button>
        </div>

        <label htmlFor={"remainingAmount"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Remaining Amount:</span> 
          <input id={"remainingAmount"} type={"text"} name="remainingAmount" readOnly title={`Remaining Amount: ${carnetData.remainingAmount} MAD`} value={carnetData.remainingAmount+' MAD'} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>

        <p className="w-full flex items-center justify-center gap-4">
          <span title="Total Price" className="flex gap-2"><i className="fi fi-sr-money-check-edit flex items-center justify-center text-yoga-green-dark"></i> {carnetData.price} MAD</span>
          <i className="fi fi-br-minus flex items-center justify-center text-yoga-green-dark"></i>
          <span title="Paid Amount" className="flex gap-2"><i className="fi fi-sr-hand-holding-usd flex items-center justify-center text-yoga-green-dark"></i> {totalPayments === carnetData.price ? totalPayments : totalPayments + paidAmount} MAD</span>
          <i className="fi fi-br-grip-lines flex items-center justify-center text-yoga-green-dark"></i>
          <span title="Remaining Amount" className="flex gap-2"><i className="fi fi-sr-coins flex items-center justify-center text-yoga-green-dark"></i> {carnetData.remainingAmount} MAD</span>
        </p>

      </section>

      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all`}>Payments History:</h4>
        <div className="w-full h-[2.5px] bg-cyan-800 bg-opacity-20"></div>
      </div>

      <ul className="w-full flex flex-col-reverse gap-2">
        { carnetData.payments.map((payment, index) => (
          <li key={index} className="group h-[30px] w-full px-3 py-1 flex items-center justify-start gap-4 shadow-sm border border-gray-300 bg-white rounded-md transition-all hover:scale-[1.01] hover:shadow-md">
            <span>#{index+1}</span>
            <span title="Payment Amount" className="flex gap-2"><i className="fi fi-sr-hand-holding-usd flex items-center justify-center text-yoga-green transition-all group-hover:text-yoga-green-dark"></i> {payment.amount} MAD</span>
            <i className="fi fi-br-minus flex items-center justify-center text-yoga-green-dark transition-all"></i>
            <span className="transition-all group-hover:text-yoga-green-dark">{dateFormater(payment.date).toLowerCase().includes("invalid date") ? dateFormater(APIDate.toISOString()) : dateFormater(payment.date)}</span>
          </li>
        ))}
      </ul>

      {/* Danger Zone  */}
      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-red-400 border-2 rounded border-red-600 text-yoga-white transition-all`}>Danger Zone:</h4>
        <div className="w-full h-[2.5px] bg-red-800 bg-opacity-20"></div>
      </div>

      <section className="px-4 w-full flex justify-start items-start flex-col">
        <label htmlFor="carnetCancelled" className="flex justify-center items-center gap-1 font-semibold capitalize">
            <input
              id="carnetCancelled"
              type="checkbox"
              onChange={() => setCarnetCancelled(!carnetCancelled)}
              checked={carnetCancelled}
              className="h-4 w-4 accent-cyan-600 border border-yoga-red active:scale-90 transition-all"
            />
            {" "}Mark this carnet as <span className="cinzel font-bold text-red-600 uppercase">Cancelled</span>
        </label>
      </section>

      <div dir='ltr' className='w-full max-w-lg py-6 flex justify-around items-center z-50'>
				<button type="reset" onClick={reset} className={`drop-shadow-md yoga-btn-sec hover:yoga-btn`}>Cancel</button>
				<button type="submit" className={`drop-shadow-md yoga-btn`}>Update</button>
			</div>

    </form>
  )
}
