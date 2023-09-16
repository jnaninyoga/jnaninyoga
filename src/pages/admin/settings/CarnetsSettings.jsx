import { useCallback, useState } from "react";
import Icon from "../../../assets/svg";
import { names } from "../../../firebase/collections";
import { useConfigurations } from "../../../hooks";
import Alert from "../../../layouts/Alert";
import Loader from "../../../layouts/Loader";
import propTypes from "prop-types";
import DropdownMenu from "../../../layouts/DropdownMenu";
import { alertMessage } from "../../../utils";
import { updateDocument } from "../../../firebase";

CarnetsSettings.propTypes = {
  onReset: propTypes.func.isRequired,
}

Field.propTypes = {
  field: propTypes.object.isRequired,
  onChange: propTypes.func.isRequired,
  defaultValue: propTypes.string,
}

const fields = [
  {label: "Periods", note: "Separate Periods with a comma (,); like: 1Y, 6M, 4M, 2M", dataType: "text"},
  {label: "Sessions", note: "Separate Sessions with a comma (,); like: 50, 30, 20, 10", dataType: "number"},
  {label: "Prices", note: "Separate Prices with a comma (,); like: 5000, 3600, 2600, 1500", dataType: "number"},
]

function Field({field, defaultValue, onChange}){
  return (
    <>
      {/* FIELD NOTE */}
      <div className={`relative pl-2 flex font-bold text-sm text-yoga-green transition-all duration-150`}>
        <i className="fi fi-sr-info text-yoga-green flex items-center justify-center mx-2 z-10 animate-pulse"></i>
        <div className='absolute h-8 w-8 top-1/2 border-t-2 border-l-2 border-yoga-green animate-pulse'></div>
        <p className="bg-yoga-green text-yoga-white px-1 z-10">{field.note}</p>
      </div>
      {/* END NOTE */}
      <label htmlFor={field.label} className="form-field flex gap-4 drop-shadow transition-all duration-150 bg-yoga-white">
        <span className="capitalize">{field.label}</span>
        <input id={field.label} type={"text"} defaultValue={defaultValue} onChange={e => onChange(e.target.value)} className="outline-none h-full w-full" />
      </label>
    </>
  )
}

export default function CarnetsSettings({onReset}) {
  const [settings, settingsLoading, settingsError] = useConfigurations(names.carnets);
  const [carnetsSettings, setCarnetsSettings] = useState({periods: [], sessions: [], prices: []});
  const [carnetType, setCarnetType] = useState("regular");

  const [isTypeAdding, setIsTypeAdding] = useState(false);
  
  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);
  const [alert, setAlert] = useState({confirm: "Ok", cancel: "Cancel", onConfirm: alertAction, onCancel: alertAction});

  const createNewCarnetType = useCallback(async (type) => {
    if (type === "") return setAlert({...alert, type: "warning", title: "Error", message: "Please enter a valid carnet type name."});
    if (Object.keys(settings).includes(type)) return setAlert({...alert, type: "warning", title: "Error Type Already Exist", message: "Please enter a type that not been regestred"});

    try{
      await updateDocument(names.configurations, names.carnets, {settings: {...settings, [type]: {periods: [], sessions: [], prices: []}}});
      setCarnetType(type);
      setCarnetsSettings({periods: [], sessions: [], prices: []});
      setIsTypeAdding(false);
    } catch (error) {
      console.error(error);
      setAlert({ ...alertMessage("E", "Carnet Type", true, "Creating"), confirm: "Try Again", onConfirm: () => alertAction(() => createNewCarnetType(type)), onCancel: alertAction })
    }  
  }, [settings, alert, alertAction]);


  const reset = () => {
    setCarnetsSettings({periods: [], sessions: [], prices: []});
    setCarnetType("regular");
    onReset();
  }
  
  if (settingsLoading || Object.values(settings).length === 0) return <Loader loading='Loading Carnets Settings...' />;
  
  if (!settingsLoading && settingsError) {
    return (
      <Alert
        type="error"
        title="Error Loading Carnets Settings"
        message="There was an error loading your Carnets settings. Please try again later."
        confirm={"Try Again"}
        onConfirm={window.location.reload}
      />
    )
  }

  if(alert.title) { 
    return (
      <section className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center z-[200100]">
        <Alert {...alert} />
      </section>
    )
  }
      
  return (
    <section className="w-full max-w-[600px] h-fit max-h-[700px] px-4 py-8 bg-yoga-white bg-texture texture-h-1 shadow-lg flex flex-col justify-start items-center overflow-y-auto">
      <div className={`sm:h-24 sm:w-32 h-20 w-28 flex items-center justify-center transition-all duration-500 select-none `}>
        <Icon
          label="Lotus"
          colors={{oc: "#ffffff", pc: "#fdc5ba"}}
          height={160}
          width={160}
        />
      </div>
      <h1 className="z-[20] cinzel uppercase font-bold md:text-2xl sm:text-xl text-lg text-center">Carnets Configuration</h1>
      <form className=" w-[90%] flex flex-col gap-4 p-4">
        <fieldset className="w-full flex justify-center gap-4 my-4 z-20">
          { isTypeAdding ? 
            <>
            <input type="text" onChange={e => setCarnetType(e.target.value ?? "regular")} placeholder="Carnet Type" className="form-field drop-shadow" />
            <div className="flex justify-center gap-2">
              <button type="button" onClick={() => createNewCarnetType(carnetType)} className="cinzel text-center uppercase h-full w-12 px-3 py-2 outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-green outline-white hover:bg-yoga-green-dark active:scale-90 transition-all" title="create a new carnet type"><i className="fi fi-br-check text-yoga-white flex justify-center items-center"></i></button>
              <button type="button" onClick={() => setIsTypeAdding(false)} className="cinzel text-center uppercase h-full w-12 px-3 py-2 outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all" title="cancel"><i className="fi fi-bs-cross flex justify-center items-center"></i></button>
            </div>
            </> :
            <>
            <DropdownMenu
              menuStyle="w-[100%]"
              options={Object.keys(settings)}
              onSelect={setCarnetType}
              placeholder="Select Carnet Type"
              defaultSelected={0}
            />
            <button type="button" onClick={() => setIsTypeAdding(true)} className="yoga-btn w-[55%]" title="create a new carnet type"><i className="fi fi-ss-layer-plus flex justify-center items-center mr-2"></i> Add a Type</button>
            </>
          }
        </fieldset>
        {fields.map((field) => 
          <fieldset key={field.label} className='w-full flex justify-center flex-col'>
            <Field  field={field} defaultValue={settings[carnetType][field.label.toLowerCase()]?.join(', ')} onChange={value => setCarnetsSettings({...carnetsSettings, [field.label.toLowerCase()]:value.trim().split(",").filter(sv => sv !== '').map(sv => field.dataType === "number" ? sv.trim().split(" ").join('')*1 : sv.trim().split(" ").join(''))})} />
            <p className="max-w-full overflow-x-auto p-2 z-[20]">
              {carnetsSettings[field.label.toLowerCase()]?.length > 0 && carnetsSettings[field.label.toLowerCase()].map((sv, i) =>
                <span key={i} className="bg-yoga-green text-yoga-white px-1 mx-1 rounded">{field.label.toLowerCase() === "prices" ? sv+" MAD" : sv }</span>
              )}
            </p>
          </fieldset>
        )}
        <div className='w-full py-4 flex justify-around items-center z-50'>
          <button type="reset" onClick={reset} className={`drop-shadow-md yoga-btn-sec hover:yoga-btn`}>Cancel</button>
          <button type="submit" className={`drop-shadow-md yoga-btn`}>Submit</button>
        </div>
      </form>
    </section>
  )
}
