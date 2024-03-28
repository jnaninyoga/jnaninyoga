// === HOOKS ===
import { useMemo, useState } from "react";

// === ASSETS ===
import Icon from "../../../../assets/svg";

// === UTILS ===
import PropTypes from "prop-types";
import DropdownMenu from "../../../global/DropdownMenu";


SessionReportCreate.propTypes = {
  carnet: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default function SessionReportCreate({carnet, client, onSubmit, onCancel}) {
  const [sessionReport, setSessionReport] = useState({session: 1,  reports:{ mental: "", physical: "", spiritual: "", energitic: "", emotional: "" }});
  const CarnetSessions = useMemo(() => Array.from({length: carnet.sessions}, (_, i) => i + 1), [carnet.sessions]);

  const setupHealthReport = (e) => {
    setSessionReport({...sessionReport, reports: {...sessionReport.reports, [e.target.name]: e.target.value}});
  }

  const handelSubmit = e => {
    e.preventDefault();
    try {
      onSubmit(sessionReport);
    } catch (error) {
      console.error("Error on submiting the session report: ", error);
    }
  }

  const reset = () => {
    setSessionReport({mental: "", physical: "", spiritual: "", energetic: "", emotional: ""});
    onCancel && onCancel();
  }

  return (
    <form onSubmit={handelSubmit} className="max-h-[90%] max-w-xl w-full sm:px-10 px-2 py-10 flex items-center flex-col gap-4 bg-texture texture-v-1 before:max-h-full overflow-y-auto">
      <div className={`sm:h-24 sm:w-32 h-20 w-28 flex items-center justify-center transition-all duration-500 select-none z-10 `}>
        <Icon
          label="Lotus"
          colors={{oc: "#ffffff", pc: "#fdc5ba"}}
          height={160}
          width={160}
        />
      </div>
      <div className="mb-2 w-full flex flex-col items-center justify-center">
        <h1 className="m-0 cinzel text-center text-4xl font-bold uppercase z-10">Sessions Report</h1>
        <h5 className="m-0 cinzel text-center font-bold uppercase z-10">For <span className="text-yoga-green-dark font-bold">{client.firstname} {client.lastname}</span>  Carnet: <span className="text-yoga-green-dark font-bold">#{carnet.order}</span></h5>
      </div>

      <DropdownMenu
        id="carnet-sessions"
        placeholder="Select Carnet Session"
        options={CarnetSessions}
        onSelect={session => setSessionReport({...sessionReport, session})}
      />

      <section className="w-full flex flex-col items-center justify-center gap-8">
        {/* --- Mental HEALTH --- */}
        <label htmlFor={"mental"} className="w-full flex gap-2 flex-col transition-all duration-150">
          <div className={`relative py-3 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
            <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-bold uppercase w-max bg-yoga-white text-yoga-green-dark transition-all`}>Mental Health:</h4>
            <div className="w-full h-[2.5px] bg-yoga-red bg-opacity-20"></div>
          </div>
          <textarea id={"mental"} name="mental" rows={5} onChange={setupHealthReport} title={`Mental Health Report`} className="form-field-mouse-interact h-full w-full px-6 py-3 outline outline-2 outline-[var(--yoga-green)] -outline-offset-8 bg-yoga-white z-50 drop-shadow transition-all duration-300 ease-in-out" ></textarea>
        </label>

        {/* --- Physical HEALTH --- */}
        <label htmlFor={"physical"} className="w-full flex gap-2 flex-col transition-all duration-150">
          <div className={`relative py-3 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
            <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-bold uppercase w-max bg-yoga-white text-yoga-green-dark transition-all`}>Physical Health:</h4>
            <div className="w-full h-[2.5px] bg-yoga-red bg-opacity-20"></div>
          </div>
          <textarea id={"physical"} name="physical" rows={5} onChange={setupHealthReport} title={`Physical Health Report`} className="form-field-mouse-interact h-full w-full px-6 py-3 outline outline-2 outline-[var(--yoga-green)] -outline-offset-8 bg-yoga-white z-50 drop-shadow transition-all duration-300 ease-in-out" ></textarea>
        </label>

        {/* --- Spiritual HEALTH --- */}
        <label htmlFor={"spiritual"} className="w-full flex gap-2 flex-col transition-all duration-150">
          <div className={`relative py-3 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
            <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-bold uppercase w-max bg-yoga-white text-yoga-green-dark transition-all`}>Spiritual Health:</h4>
            <div className="w-full h-[2.5px] bg-yoga-red bg-opacity-20"></div>
          </div>
          <textarea id={"spiritual"} name="spiritual" rows={5} onChange={setupHealthReport} title={`Spiritual Health Report`} className="form-field-mouse-interact h-full w-full px-6 py-3 outline outline-2 outline-[var(--yoga-green)] -outline-offset-8 bg-yoga-white z-50 drop-shadow transition-all duration-300 ease-in-out" ></textarea>
        </label>
          
        {/* --- ENERGETIC  HEALTH --- */}
        <label htmlFor={"energetic"} className="w-full flex gap-2 flex-col transition-all duration-150">
          <div className={`relative py-3 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
            <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-bold uppercase w-max bg-yoga-white text-yoga-green-dark transition-all`}>Energetic Health:</h4>
            <div className="w-full h-[2.5px] bg-yoga-red bg-opacity-20"></div>
          </div>
          <textarea id={"energetic"} name="energetic" rows={5} onChange={setupHealthReport} title={`Energetic Health Report`} className="form-field-mouse-interact h-full w-full px-6 py-3 outline outline-2 outline-[var(--yoga-green)] -outline-offset-8 bg-yoga-white z-50 drop-shadow transition-all duration-300 ease-in-out" ></textarea>
        </label>

        {/* --- Emotional HEALTH --- */}
        <label htmlFor={"emotional"} className="w-full flex gap-2 flex-col transition-all duration-150">
          <div className={`relative py-3 w-full flex justify-center items-center gap-2 overflow-hidden z-40`}>
            <h4 className={`absolute left-10 pl-2 pr-4 cinzel font-bold uppercase w-max bg-yoga-white text-yoga-green-dark transition-all`}>Emotional Health:</h4>
            <div className="w-full h-[2.5px] bg-yoga-red bg-opacity-20"></div>
          </div>
          <textarea id={"emotional"} name="emotional" rows={5} onChange={setupHealthReport} title={`Emotional Health Report`} className="form-field-mouse-interact h-full w-full px-6 py-3 outline outline-2 outline-[var(--yoga-green)] -outline-offset-8 bg-yoga-white z-50 drop-shadow transition-all duration-300 ease-in-out" ></textarea>
        </label>
      </section>



        
      <div dir='ltr' className='w-full max-w-lg py-6 flex justify-around items-center z-50'>
				<button type="reset" onClick={reset} className={`drop-shadow-md yoga-btn-sec hover:yoga-btn`}>Cancel</button>
				<button type="submit" className={`drop-shadow-md yoga-btn`}>Create</button>
			</div>
    </form>
  )
}

