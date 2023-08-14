import 'handyscript/lib/string';
import { useState, useRef, useEffect } from 'react';
import { useCurrentLanguage, useIntersectView } from '../hooks';
import icon from '../assets/imgs/icons/lotus.webp';
import PropsTypes from 'prop-types';
// import { formFields } from '../utils';

Form.propTypes = {
    title: PropsTypes.string,
    state: PropsTypes.array,
    fields: PropsTypes.array,
    sendBtn: PropsTypes.string,
    resetBtn: PropsTypes.string,
    onEmpty: PropsTypes.string,
    onError: PropsTypes.string,
    insertElement: PropsTypes.element,
    onSubmit: PropsTypes.func,
    onReset: PropsTypes.func,
    dark: PropsTypes.bool,
}

export default function Form({title, state, fields, sendBtn, resetBtn, onEmpty, onError, insertElement, onSubmit=e=>e.preventDefault(), onReset=e=>e.preventDefault(), dark=false}) {
    const currentLanguage = useCurrentLanguage();
    const [form, setForm] = state;
    const [emptyError, setEmptyError] = useState({});
    const [error, setError] = useState({});

    // for field type of password
    const [showPassword, setShowPassword] = useState(false);

    const [isEmptyError, setIsEmptyError] = useState(false);

    const formRef = useRef(null);
    const btnsRef = useRef(null);
    const wrapper = useRef(null);
    const isWrapperIntersected = useIntersectView(wrapper);
    const isFormIntersected = useIntersectView(formRef);
    const isBtnsIntersected = useIntersectView(btnsRef);

    const field = e => fields.find(field => field.name === e.target.name);

    const setFormField = e =>{
        const regex = new RegExp(field(e).regex);
        setForm({...form, [e.target.name]: regex.test(e.target.value) ? e.target.value : ""});
        setError({...error, [e.target.name]: !regex.test(e.target.value) ? field(e).error : ""});
        setEmptyError({...emptyError, [e.target.name]: e.target.value == "" ? field(e).emptyError : ""});
    }

    const submitForm = e =>{
        e.preventDefault();
        // check if there's any empty field or error field
        const formdata = Object.values(form).filter(value => value != "");
        const empty = Object.values(emptyError).filter(value => value != "");
        const errors = Object.values(error).filter(value => value != "");

        setIsEmptyError(formdata.length < fields.length || empty.length > 0);
        if(!isEmptyError && errors.length === 0 && formdata.length === fields.length ){
            // calling the onSubmit prop
            onSubmit(form);
        }
    }

    // reset the form and clear the errors
    const resetForm = ()=>{
        setError({});
        setEmptyError({});
        onReset();
    }

    // setup a 2 seconds timeout to clear the OnEmpty error
    useEffect(() => {
        if(!onEmpty) return
        const timeout = setTimeout(() => {
            setEmptyError({});
            setIsEmptyError(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [isEmptyError, onEmpty])
    

  return (
    <form ref={formRef} action="" onSubmit={submitForm} className='lg:w-[50vw] w-full lg:px-20 sm:px-10 px-2 flex items-center gap-1 flex-col'>
        <img src={icon} className={`${isFormIntersected ? "scale-1" : "scale-0"} sm:h-16 sm:w-16 h-12 w-12 transition-all duration-500 select-none`} alt="Red/pink lotus icon" />
        <h1 className={`${isFormIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} cinzel ${!dark && "text-yoga-white"} text-center text-3xl font-bold uppercase transition-all duration-500`}>{title}</h1>
        {insertElement && <div className={`${isFormIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} my-4 transition-all duration-500 delay-200`}>
            {insertElement}
        </div>}
        <p className={`${isFormIntersected && (isEmptyError || onError) ? "translate-y-0 opacity-100 mb-2" : 'translate-y-[100%] opacity-0 mb-0'} text-center sm:text-lg text-base font-bold form-label-error transition-all duration-500`}>{onEmpty || onError}</p>
        <div dir={currentLanguage.dir} ref={wrapper} className='w-full flex items-center justify-center gap-4 flex-col'>
            {fields.map((field, index) => 
            field.type === 'textarea' ?
            <div key={index} className='relative w-full h-fit flex flex-col gap-1'>
            <textarea
                onChange={setFormField}
                // expand the textarea as the user types new lines
                rows={form[field.name] ? form[field.name].split('\n').length : 2}
                className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} form-field ${isEmptyError || onError || emptyError[field.name] || error[field.name] ? "form-field-error" : ""} ${dark && "drop-shadow"} resize-y delay-[${ 100 * index + 100 }ms] `}
                name={field.name}
                placeholder={field.placeholder.toLowerCase().toCapitalCase()}
                defaultValue={field.defaultValue}
                />
                {// check if the textarea have a maxChars rule like maxChars = 500
                (field.maxChars && form[field.name]?.length > 0) &&
                <p className={`z-30 absolute bottom-2 ltr:right-3 rtl:left-3 p-0 m-0 text-sm transition-all duration-[${ 100 * index + 100 }ms]`}>{form[field.name].length}/{field.maxChars}</p>}

                {emptyError[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{emptyError[field.name]}</p>
                : error[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{error[field.name]}</p>
                :<></>}
            </div>
            :
            <div key={index} className='relative w-full h-fit flex flex-col gap-1'>
            <input
                onChange={setFormField}
                className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} form-field ${isEmptyError || onError || emptyError[field.name] || error[field.name] ? "form-field-error" : ""} ${dark && "drop-shadow"} delay-[${ 100 * index + 100 }ms]`}
                type={field.type.toLowerCase() === 'password' ? showPassword ? 'text' : 'password' : field.type.toLowerCase()}
                name={field.name.toLowerCase()}
                placeholder={field.placeholder.toLowerCase().toCapitalCase()}
                defaultValue={field.defaultValue}
                key={index}
                />
                {emptyError[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{emptyError[field.name]}</p>
                : error[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{error[field.name]}</p>
                :<></>}
                {/* if the field is type of password, show the show/hide password button */}
                {field.type.toLowerCase() === 'password' && (
                    <button type='button' title={showPassword ? "Hide Password" : "Show Password"} onClick={() => setShowPassword(!showPassword)} className={`${isWrapperIntersected ? "-translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} absolute top-[17px] ${currentLanguage.dir === "rtl" ? "left-6" : "right-6"} p-0 m-0 text-sm transition-all duration-[${ 100 * index + 100 }ms]`}> 
                        <i className={`fi ${showPassword ? "fi-sr-eye-crossed" : "fi-sr-eye"} ${isEmptyError || onError || emptyError[field.name] || error[field.name] ? "form-label-error" : "text-yoga-green"} flex justify-center items-end`}></i>
                    </button>
                )}
            </div>
            )}
        </div>
        <div dir='ltr' ref={btnsRef} className='w-full my-4 flex justify-around items-center overflow-x-hidden overflow-y-visible'>
            {resetBtn && <button type="reset" onClick={resetForm} className={`${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[-100%] opacity-0'} ${dark && "drop-shadow"} yoga-btn-sec hover:yoga-btn`}>{resetBtn}</button> }
            <button type="submit" className={`${resetBtn ? `${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[100%] opacity-0'}` : `${isBtnsIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'}`} ${!resetBtn ? "w-[65%]" : ''} ${dark && "drop-shadow"} yoga-btn`}>{sendBtn}</button>
        </div>
    </form>
  )
}
