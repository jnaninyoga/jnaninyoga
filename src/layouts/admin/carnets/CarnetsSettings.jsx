import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Icon from "../../../assets/svg";
import DropdownMenu from "../../../layouts/global/DropdownMenu";
import collections, { names } from "../../../firebase/collections";
import Alert from "../../../layouts/admin/shared/Alert";
import Loader from "../../../layouts/global/Loader";
import { DefaultCarnetsSettings } from "../../../utils";
import { fetchDocs, updateDocument } from "../../../firebase";
import { onSnapshot } from "firebase/firestore";

Field.propTypes = {
  field: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

CarnetsSettings.propTypes = {
  onReset: PropTypes.func.isRequired,
};

const fields = [
  {label: "Periods", key: "periods", note: "Separate Periods with a comma (,); like: 1Y, 6M, 4M, 2M", dataType: "text"},
  {label: "Sessions", key: "sessions", note: "Separate Sessions with a comma (,); like: 50, 30, 20, 10", dataType: "number"},
  {label: "Prices", key: "prices", note: "Separate Prices with a comma (,); like: 5000, 3600, 2600, 1500", dataType: "number"},
];

function encodeValue(value, encodingType="string"){
  return value.trim().split(",").filter(sv => sv !== '').map(sv => encodingType === "number" ? sv.trim().split(" ").join('')*1 : sv.trim().split(" ").join(''))
}

function decodeValue(value){
  return value.join(", ");
}

function Field({field, defaultValue, onChange}){
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const storeValue = (v) => {
    setValue(v);
    onChange(encodeValue(v, field.dataType))
  }

  return (
    <>
      {/* FIELD NOTE */}
      <div className={`relative pl-2 flex font-bold text-sm text-yoga-green transition-all duration-150`}>
        <i className="fi fi-sr-info text-yoga-green flex items-center justify-center mx-2 z-10 animate-pulse"></i>
        <div className='absolute h-8 w-8 top-1/2 border-t-2 border-l-2 border-yoga-green animate-pulse'></div>
        <p className="bg-yoga-green text-yoga-white px-1 z-10">{field.note}</p>
      </div>
      {/* END NOTE */}
      <label htmlFor={field.key} className="form-field flex gap-4 drop-shadow transition-all duration-150 bg-yoga-white">
        <span className="capitalize">{field.label}:</span>
        <input id={field.key} type={"text"} value={value} onChange={e => storeValue(e.target.value)} className="outline-none h-full w-full" />
      </label>
      {/* FIELD DATA VALUE VISUALISATION */}
      { !field.rawValue && <p className="flex w-full gap-2 z-50">
        {encodeValue(value, field.dataType).map((v, i) => (
          <span key={i} className={`flex items-center justify-center bg-yoga-green text-yoga-white text-sm px-1 py-[2px] rounded-md`}>{field.key === "prices" ? v + " MAD" : v}</span>
        ))}
      </p>}
    </>
  )
}


export default function CarnetsSettings({onReset}) {
  const [settings, setSettings] = useState({regular: DefaultCarnetsSettings});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(null);
  
  // const [carnetSettings, setCarnetSettings] = useState(DefaultCarnetsSettings);
  const [carnetType, setCarnetType] = useState("regular");
  const [newCarnetType, setNewCarnetType] = useState("");
  const [isTypeAdding, setIsTypeAdding] = useState(false);

  // loading the configurations of the carnet dashboard
  useEffect(() => {
    (async () => {
      try {
        onSnapshot(fetchDocs(collections.configurations), (querySnapshot) => {
          // set the documents in the collection state with there ids
          setSettings(querySnapshot.docs.filter((doc) => doc.id === names.carnets)[0]?.data().settings);
        });
      } catch (error) {
        console.error(`${names.carnets.toUpperCase()} DASHBOARD CONFIGURATIONS ERROR`, error);
        setSettingsError(error);
      } finally {
        setSettingsLoading(false);
      }
    })();
  }, [carnetType]);

  // Alert Action
  const alertAction = useCallback((onAction, closeAlert=true) => {
    onAction && onAction(); // run the action if it's exist
    closeAlert && setAlert({}); // close the alert
  }, []);

  const [alert, setAlert] = useState({
		type: "info",
		title: "",
		message: "",
		confirm: "ok",
		cancel: "close",
    onConfirm: alertAction,
    onCancel: alertAction
	})

  useEffect(() => {
    console.table(settings)
    console.log(`%cCurrent Carnet Type: %c${carnetType}`, "color:gray;font-family:system-ui;font-size:2rem;font-weight:bold", "color:#b31451;font-family:system-ui;font-size:2rem;font-weight:bold")
  }, [carnetType, settings])

  if (settingsLoading){
    return <section className="flex items-center justify-center h-full w-full max-h-[400px] max-w-[600px]">
      <Loader loading="Loading Carnet Settings..."/>
    </section>
  }

  if (!settingsLoading && ( settingsError || Object.values(settings).length === 0 )){
    return <Alert
      type="error"
      message="Error Loading Carnet Settings"
      confirm={"Try Agin"}
      onConfirm={window.location.reload}
  />}

  if (alert.message) return <Alert {...alert} />

  // Create New carnet type with te default settings:
  const createNewCarnetType = async () => {
    try {
      await updateDocument(names.configurations, names.carnets, {settings: {...settings, [newCarnetType]: DefaultCarnetsSettings}})
      setIsTypeAdding(false)
      setCarnetType(newCarnetType)
    } catch (error) {
      console.error(error);
      setAlert({...alert, type: "error", title: "Error Creating New Carnet Type", message: error.message});
    }
  }

  // Update Carnet Settings:
  const updateCarnetSettings = async (e) => {
    e.preventDefault();
    try {
      await updateDocument(names.configurations, names.carnets, {settings: {...settings, [carnetType]: settings[carnetType]}})
      setAlert({...alert, type: "success", title: `Settings Of "${carnetType}" Carnet Type Updated`, message: `The Settings Of "${carnetType}" Carnet Type Was Updated Successfully`});
    } catch (error) {
      console.error(error);
      setAlert({...alert, type: "error", title: "Error Updating Carnet Settings", message: error.message});
    }
  }

  const reset = () => {
    setIsTypeAdding(false);
    setSettings({regular: DefaultCarnetsSettings});
    setCarnetType("regular");
    onReset();
  }


  return (
    <section className="py-4 flex flex-1 h-full w-full max-h-[800px] max-w-[550px] flex-col items-center gap-5 bg-texture texture-v-1 overflow-y-auto">
      <div className={`sm:h-24 sm:w-32 h-20 w-28 flex items-center justify-center transition-all duration-500 select-none`}>
        <Icon
          label="Lotus"
          colors={{oc: "#ffffff", pc: "#fdc5ba"}}
          height={160}
          width={160}
        />
      </div>

      <h1 className="cinzel text-center text-2xl font-bold uppercase z-50">Carnet Configurations</h1>

      <form onSubmit={updateCarnetSettings} className="px-8 w-full flex flex-col gap-9 items-center">
        <div className="flex w-full gap-4 max-h-14 z-50">
          { isTypeAdding ? (
            <div className="w-full flex items-center justify-center gap-2">
              <input type="text" placeholder="Carnet type" onChange={e => setNewCarnetType(e.target.value.trim().toLowerCase())} className="form-field h-full shadow-md drop-shadow-md" />
              <button type="button" onClick={async () => await createNewCarnetType()} title="Add Carnet Type" className="cinzel h-[80%] px-3 py-3 min-w-max aspect-square text-center font-semibold uppercase flex items-center justify-center outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-green outline-white shadow-md drop-shadow-md hover:bg-yoga-green-dark active:scale-90 transition-all"><i className="fi fi-br-check text-yoga-white flex items-center justify-center"></i></button>
              <button type="button" onClick={() => setIsTypeAdding(false)} title="Cancel" className="cinzel h-[80%] px-3 py-3 min-w-max aspect-square text-center font-semibold uppercase flex items-center justify-center outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-red outline-white hover:bg-yoga-red-dark shadow-md drop-shadow-md active:scale-90 transition-all"><i className="fi fi-br-cross text-yoga-white flex items-center justify-center"></i></button>
            </div>
          ) : (
            <>
            <DropdownMenu
              placeholder="Select Carnet Type"
              options={Object.keys(settings)}
              onSelect={type => setCarnetType(type)}
              defaultSelected={carnetType}
            />
            <button type="button" onClick={() => setIsTypeAdding(true)} className="cinzel px-3 py-2 min-w-max text-center font-semibold uppercase flex items-center justify-center outline outline-2 -outline-offset-[5px] text-yoga-white bg-yoga-green outline-white shadow-md hover:bg-yoga-green-dark active:scale-90 transition-all"><i className="fi fi-br-layer-plus text-yoga-white flex items-center justify-center mr-2"></i> Add Type</button>
            </>
          )}
        </div>

        <section className="flex w-full flex-col gap-4">
          {fields.map((field, i) => (
            <Field key={i} defaultValue={decodeValue(settings[carnetType][field.key])} field={field}  onChange={value => setSettings({...settings, [carnetType]: {...settings[carnetType], [field.key]: value}})} />
          ))}
        </section>

        <div dir='ltr' className='w-full max-w-lg py-2 flex justify-around items-center z-50'>
          <button type="reset"  onClick={reset} className={`drop-shadow-md yoga-btn-sec hover:yoga-btn`}>Cancel</button>
          <button type="submit" className={`drop-shadow-md yoga-btn`}>Submit</button>
        </div>

      </form>

    </section>
  )
}
