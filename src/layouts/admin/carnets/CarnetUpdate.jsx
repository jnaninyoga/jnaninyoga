import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Icon from "../../../assets/svg";
import { useCallback } from "react";
import { date, dateFormater, periodAccronymMap } from "../../../utils";
import LabeledSelect from "../../global/LabeledSelect";
import Session from "./Session";
import Bullet from "../shared/Bullet";
import { serverTimestamp } from "firebase/firestore";

CarnetUpdate.propTypes = {
  carnet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    sessions: PropTypes.number.isRequired,
    passedSessions: PropTypes.number.isRequired,
    progress: PropTypes.number,
    price: PropTypes.number.isRequired,
    paidAmount: PropTypes.number.isRequired,
    remainingAmount: PropTypes.number.isRequired,
    payments: PropTypes.shape([
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.object.isRequired,
      }).isRequired
    ]).isRequired,
    // => Database document fields
		createdAt: PropTypes.object,
		updatedAt: PropTypes.object,
  }).isRequired,
  configurations: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default function CarnetUpdate({ carnet, configurations, onUpdate, onCancel}) {
  const [carnetData, setCarnetData] = useState(carnet);
  const [paymentTicketSwitch, setPaymentTicketSwitch] = useState(false);
  
  // calculate the progress in the fly
  carnetData.progress = Math.round((carnetData.passedSessions / carnetData.sessions) * 100);
  // calculate if the carnet is fully completed: if all sessions passed and fully paid
  carnetData.completed = carnetData.passedSessions === carnetData.sessions && carnetData.remainingAmount === 0;

  const totalPayments = useMemo(() => carnetData.payments.reduce((acc, payment) => acc + payment.amount, 0), [carnetData]);

  // const remainingAmount = useCallback(paiment => {
  //   return carnetData.price - (totalPayments + paiment*1) < 0 ? carnetData.price : carnetData.price - (totalPayments + paiment*1)
  // }, [carnetData, totalPayments]);

  const addPayment = useCallback(amount => {
    setPaymentTicketSwitch(false);
    if (amount > 0 && amount <= carnetData.price) {
      setCarnetData(prev => ({
        ...prev,
        paidAmount: amount,
        remainingAmount: carnetData.price - (totalPayments + amount) < 0 ? carnetData.price : carnetData.price - (totalPayments + amount),
      }));
    }
  }, [carnetData.price, totalPayments]);

  // push the payment ticket to the payments array history
  const addPaymentTicket = useCallback(() => { 
    if (carnetData.paidAmount > 0 && carnetData.paidAmount <= carnetData.price && totalPayments + carnetData.paidAmount <= carnetData.price) {
      setCarnetData(prev => ({
        ...prev,
        payments: [...prev.payments, { amount: prev.paidAmount, date: serverTimestamp() }],
      }));
      setPaymentTicketSwitch(true);
    }
  }, [carnetData.paidAmount, carnetData.price, totalPayments]);

  const updateCarnet = useCallback( async (e) => {
    e.preventDefault();
    try {
      await onUpdate(carnetData);
    } catch (error) {
      console.error(error);
    }
  }, [carnetData, onUpdate]);

  const reset = () => {
    setCarnetData(carnet);
    onCancel && onCancel();
  }

  return (
    <form onSubmit={updateCarnet} className="max-h-[95%] max-w-xl w-full sm:px-10 px-2 py-10 flex items-center flex-col gap-4 bg-texture texture-v-1 before:max-h-full overflow-y-auto">
      <div className={`sm:h-24 sm:w-32 h-20 w-28 flex items-center justify-center transition-all duration-500 select-none z-10 `}>
        <Icon
          label="Lotus"
          colors={{oc: "#ffffff", pc: "#fdc5ba"}}
          height={160}
          width={160}
        />
      </div>
			<h1 className={`cinzel text-center text-3xl font-bold uppercase transition-all duration-500 z-10`}>Update {carnetData.username} Carnet</h1>
      <h2 className="cinzel text-center font-semibold text-gray-500 z-10"><span className="text-yoga-green-dark">Carnet ID:</span> {"#"+carnetData.id}</h2>
      <h2 className="cinzel text-center font-semibold text-gray-500 z-10"><span className="text-yoga-green-dark">User ID:</span> <a href={`/lotus/users?id=${carnetData.userID}`} target="_blank" rel="noopener noreferrer">{"#"+carnetData.userID}</a></h2>


      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all`}>Carnet Attributes:</h4>
        <div className="w-full h-[2.5px] bg-cyan-800 bg-opacity-20"></div>
      </div>

      <section className="w-full flex items-center flex-col gap-4 z-[200]">
        <LabeledSelect
          id="carnettype"
          label="Select Carnet Type"
          options={Object.keys(configurations)}
          onSelect={type => setCarnetData(prev => ({ ...prev, type }))}
          defaultSelected={carnetData.type}
        />
        <LabeledSelect
          id="carnetperiod"
          label="Select Carnet Period"
          options={configurations[carnetData.type].periods}
          onSelect={period => setCarnetData(prev => ({ ...prev, period }))}
          defaultSelected={carnetData.period}
          valueFormatter={periodAccronymMap}
        />
        <LabeledSelect
          id="carnetprice"
          label="Select Carnet Price"
          options={configurations[carnetData.type].prices.map(price => price.toString())}
          onSelect={price => setCarnetData(prev => ({ ...prev, price }))}
          defaultSelected={carnetData.price.toString()} // convert to string
          valueFormatter={price => `${price} MAD`}
        />
        <LabeledSelect
          id="carnetsessions"
          label="Select Carnet Sessions"
          options={configurations[carnetData.type].sessions.map(session => session.toString())}
          onSelect={sessions => setCarnetData(prev => ({ ...prev, sessions }))}
          defaultSelected={carnetData.sessions.toString()} // convert to string
          valueFormatter={session => `${session} Sessions`}
        />
      </section>

      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all`}>Sessions:</h4>
        <div className="w-full h-[2.5px] bg-cyan-800 bg-opacity-20"></div>
      </div>

      <section className="w-full flex items-center justify-center flex-col gap-4">
        <h3 className="cinzel font-semibold z-40">Progress: <span className="cinzel text-yoga-green-dark">{carnetData.progress}%</span></h3>

        {/* Table of the sessions; each row must contain 10 Check sesions & and each Check session is eather checked or not */}
        <ul className="w-full px-2 grid grid-cols-10 gap-2">
          {Array.from({ length: carnetData.sessions }, (_, i) => (
            <Session key={i} passed={i < carnet.passedSessions} clickAble onSwitch={(flag) => setCarnetData(prev => ({ ...prev, passedSessions: prev.passedSessions + (prev.passedSessions < prev.sessions ? (flag ? -1 : 1) : 0) }))} />
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
        <p className="cinzel font-semibold">Last Payment: <span className="cinzel text-yoga-green-dark">{dateFormater(carnet.payments.at(-1)?.date).toLowerCase().includes("invalid date") ? "No Payment" : dateFormater(carnet.payments.at(-1)?.date)}</span></p>

        <label htmlFor={"carnetprice"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Carnet Price:</span>
          <input id={"price"} type={"text"} name="price" readOnly title={`Carnet Price: ${carnetData.price} MAD`} value={carnetData.price+" MAD"} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>

        <div className="w-full flex justify-between items-center gap-4">
          <label htmlFor={"paidAmount"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
            <span className="cinzel capitalize min-w-max cursor-pointer">Paid Amount:</span>
            <input id={"paidAmount"} type={"number"} name="paidAmount" title={`Paid Amount: ${carnetData.paidAmount} MAD`} defaultValue={0} value={carnetData.paidAmount} min={0} max={carnetData.remainingAmount === 0 ? carnetData.price : carnetData.remainingAmount} onChange={e => addPayment(e.target.value*1)} className="outline-none h-full w-full bg-transparent" />
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
          <span title="Paid Amount" className="flex gap-2"><i className="fi fi-sr-hand-holding-usd flex items-center justify-center text-yoga-green-dark"></i> {carnetData.paidAmount + totalPayments} MAD</span>
          <i className="fi fi-br-grip-lines flex items-center justify-center text-yoga-green-dark"></i>
          <span title="Remaining Amount" className="flex gap-2"><i className="fi fi-sr-coins flex items-center justify-center text-yoga-green-dark"></i> {carnetData.remainingAmount} MAD</span>
        </p>

      </section>

      <div className={`relative py-5 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
        <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all`}>Payments History:</h4>
        <div className="w-full h-[2.5px] bg-cyan-800 bg-opacity-20"></div>
      </div>

      <ul className="w-full h-full min-h-[80px] max-h-[160px] px-3 flex flex-col-reverse gap-2 overflow-x-hidden overflow-y-auto">
        { carnetData.payments.map((payment, index) => (
          <li key={index} className="group w-full px-3 py-1 flex items-center justify-start gap-4 shadow-sm border border-gray-300 bg-white rounded-md transition-all hover:scale-[1.01] hover:shadow-md">
            <span>#{index+1}</span>
            <span title="Payment Amount" className="flex gap-2"><i className="fi fi-sr-hand-holding-usd flex items-center justify-center text-yoga-green transition-all group-hover:text-yoga-green-dark"></i> {payment.amount} MAD</span>
            <i className="fi fi-br-minus flex items-center justify-center text-yoga-green-dark transition-all"></i>
            <span className="transition-all group-hover:text-yoga-green-dark">{dateFormater(payment.date).toLowerCase().includes("invalid date") ? ( async () => dateFormater(await date()) )() : dateFormater(payment.date)}</span>
          </li>
        ))}
      </ul>

      <div dir='ltr' className='w-full max-w-lg py-6 flex justify-around items-center z-50'>
				<button type="reset" onClick={reset} className={`drop-shadow-md yoga-btn-sec hover:yoga-btn`}>Cancel</button>
				<button type="submit" className={`drop-shadow-md yoga-btn`}>Update</button>
			</div>

    </form>
  )
}
