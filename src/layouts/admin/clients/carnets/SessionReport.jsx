// === HOOKS ===
import { useState } from "react";

// === ASSETS ===
import Icon from "../../../../assets/svg";

export default function SessionReport({carnet, client, onSubmit}) {
  const  [sessionReport, setSessionReport] = useState({mental: "", physical: "", spiritual: "", energitic: "", emotional: ""});

  const setupHealthReport = (e) => {
    setSessionReport({...sessionReport, [e.target.name]: e.target.value});
  }

  return (
    <form onSubmit={onSubmit} className="max-h-[90%] max-w-xl w-full sm:px-10 px-2 py-10 flex items-center flex-col gap-4 bg-texture texture-v-1 before:max-h-full overflow-y-auto">
        <div className={`sm:h-24 sm:w-32 h-20 w-28 flex items-center justify-center transition-all duration-500 select-none z-10 `}>
          <Icon
            label="Lotus"
            colors={{oc: "#ffffff", pc: "#fdc5ba"}}
            height={160}
            width={160}
          />
        </div>
        <h1 className="cinzel text-center text-4xl text-yoga-green-dark font-bold uppercase z-10">Sessions Report For <span className="text-yoga-green font-bold">{client.firstname} {client.lastname}</span>  Carnet: <span className="text-yoga-green font-bold">#{carnet.order}</span></h1>

        {/* --- Mental HEALTH --- */}
        <label htmlFor={"mental"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Mental Health:</span>
          <textarea id={"mental"} name="mental" onChange={setupHealthReport} title={`Mental Health Report`} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" ></textarea>
        </label>

        {/* --- Physical HEALTH --- */}
        <label htmlFor={"physical"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Physical Health:</span>
          <textarea id={"physical"} name="physical" onChange={setupHealthReport} title={`Physical Health Report`} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" ></textarea>
        </label>

        {/* --- Spiritual HEALTH --- */}
        <label htmlFor={"spiritual"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Spiritual Health:</span>
          <textarea id={"spiritual"} name="spiritual" onChange={setupHealthReport} title={`Spiritual Health Report`} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" ></textarea>
        </label>

        {/* --- Energitic HEALTH --- */}
        <label htmlFor={"energitic"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Energitic Health:</span>
          <textarea id={"energitic"} name="energitic" onChange={setupHealthReport} title={`Energitic Health Report`} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" ></textarea>
        </label>

        {/* --- Emotional HEALTH --- */}
        <label htmlFor={"emotional"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Emotional Health:</span>
          <textarea id={"emotional"} name="emotional" onChange={setupHealthReport} title={`Emotional Health Report`} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" ></textarea>
        </label>
    </form>
  )
}

