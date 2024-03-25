// === HOOKS ===
import { useState } from "react";

// === ASSETS ===
import Icon from "../../../assets/svg";

export default function SessionReport({carnet, onSubmit}) {
  const  [sessionReport, setSessionReport] = useState({mental: "", physical: "", spiritual: "", energitic: "", emotional: ""});

  return (
    <form className="max-h-[90%] max-w-xl w-full sm:px-10 px-2 py-10 flex items-center flex-col gap-4 bg-texture texture-v-1 before:max-h-full overflow-y-auto">
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

        {/* --- MENTAL HEALTH --- */}
        <label htmlFor={"carnetprice"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Carnet Price:</span>
          <input id={"price"} type={"text"} name="price" readOnly title={`Carnet Price: ${carnetData.price} MAD`} value={carnetData.price+" MAD"} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>
        {/* --- MENTAL HEALTH --- */}
        <label htmlFor={"carnetprice"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Carnet Price:</span>
          <input id={"price"} type={"text"} name="price" readOnly title={`Carnet Price: ${carnetData.price} MAD`} value={carnetData.price+" MAD"} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>
        {/* --- MENTAL HEALTH --- */}
        <label htmlFor={"carnetprice"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Carnet Price:</span>
          <input id={"price"} type={"text"} name="price" readOnly title={`Carnet Price: ${carnetData.price} MAD`} value={carnetData.price+" MAD"} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>
        {/* --- MENTAL HEALTH --- */}
        <label htmlFor={"carnetprice"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Carnet Price:</span>
          <input id={"price"} type={"text"} name="price" readOnly title={`Carnet Price: ${carnetData.price} MAD`} value={carnetData.price+" MAD"} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>
        {/* --- MENTAL HEALTH --- */}
        <label htmlFor={"carnetprice"} className="form-field flex gap-4 drop-shadow transition-all duration-150">
          <span className="cinzel capitalize min-w-max cursor-pointer">Carnet Price:</span>
          <input id={"price"} type={"text"} name="price" readOnly title={`Carnet Price: ${carnetData.price} MAD`} value={carnetData.price+" MAD"} className="outline-none h-full w-full text-yoga-green-dark bg-transparent" />
        </label>
    </form>
  )
}

