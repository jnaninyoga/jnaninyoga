import 'handyscript/lib/string';
import { useState, useRef, useEffect } from 'react';
import { useIntersectView } from '../hooks';
import icon from '../assets/imgs/icons/lotus.webp';
import PropsTypes from 'prop-types';
import Followers from '../components/Followers';
// import { formFields } from '../utils';

Form.propTypes = {
    title: PropsTypes.string,
    state: PropsTypes.array,
    fields: PropsTypes.array,
    sendBtn: PropsTypes.string,
    resetBtn: PropsTypes.string,
    onEmpty: PropsTypes.string,
    onSubmit: PropsTypes.func,
}

export default function Form({title, state, fields, sendBtn, resetBtn, onEmpty, onSubmit=e=>e.preventDefault()}) {
    const [form, setForm] = state;
    const [emptyError, setEmptyError] = useState({});
    const [error, setError] = useState({});

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
        // regex.test(e.target.value) ? setForm({...form, [e.target.name]: e.target.value}) : setError({...error, [e.target.name]: field(e).error});
        setForm({...form, [e.target.name]: regex.test(e.target.value) ? e.target.value : ""});
        setError({...error, [e.target.name]: !regex.test(e.target.value) ? field(e).error : ""});
        setEmptyError({...emptyError, [e.target.name]: e.target.value == "" ? field(e).emptyError : ""});
        // if(e.target.value !== ""){
        //     setEmptyError({...emptyError, [e.target.name]: '' });
        //     // setError({...error, [e.target.name]: !regex.test(e.target.value) ? fields.find(field => field.name === e.target.name).error : ``});
        // }else{
        //     // testing fields with regex if it's not empty
        //     setError({...error, [e.target.name]: ''})
        //     setEmptyError({...emptyError, [e.target.name]: field(e).emptyError });
        // }
    }

    const submitForm = e =>{
        e.preventDefault();
        // check if there's any empty field or error field
        const formdata = Object.values(form).filter(value => value != "");
        const empty = Object.values(emptyError).filter(value => value != "");
        const errors = Object.values(error).filter(value => value != "");

        console.log({formdata, empty, errors});
        console.log({form, emptyError, error});

        setIsEmptyError(formdata.length < fields.length || empty.length > 0);
        if(!isEmptyError && errors.length === 0 && formdata.length === fields.length ){
            // calling the onSubmit prop
            onSubmit(form);
        }
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
    <form ref={formRef} action="" onSubmit={submitForm} className='sm:w-[50vw] w-full sm:px-20 px-2 flex items-center gap-1 flex-col'>
        <img src={icon} className={`${isFormIntersected ? "scale-1" : "scale-0"} sm:h-16 sm:w-16 h-12 w-12 transition-all duration-500 select-none`} alt="Red/pink lotus icon" />
        <h1 className={`${isFormIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} cinzel text-yoga-white sm:text-3xl text-2xl font-bold uppercase transition-all duration-500`}>{title}</h1>
        <p className={`${isFormIntersected && isEmptyError ? "translate-y-0 opacity-100 mb-2" : 'translate-y-[100%] opacity-0 mb-0'} text-center sm:text-lg text-base font-bold form-label-error transition-all duration-500`}>{onEmpty}</p>
        <div ref={wrapper} className='w-full flex items-center justify-center gap-4 flex-col'>
            {fields.map((field, index) => 
            field.type === 'textarea' ?
            <div key={index} className='w-full h-fit flex flex-col gap-1'>
            <textarea
                onChange={setFormField}
                // expand the textarea as the user types new lines
                rows={form[field.name] ? form[field.name].split('\n').length : 1}
                className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} form-field ${isEmptyError || emptyError[field.name] || error[field.name] ? "form-field-error" : ""} resize-y delay-[${ 100 * index + 100 }ms] `}
                name={field.name}
                placeholder={field.placeholder.toLowerCase().toCapitalCase()}
                />
                {emptyError[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{emptyError[field.name]}</p>
                : error[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{error[field.name]}</p>
                :<></>}
            </div>
            :
            <div key={index} className='w-full h-fit flex flex-col gap-1'>
            <input
                onChange={setFormField} 
                className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} form-field ${isEmptyError || emptyError[field.name] || error[field.name] ? "form-field-error" : ""} delay-[${ 100 * index + 100 }ms]`}
                type={field.type.toLowerCase()}
                name={field.name.toLowerCase()}
                placeholder={field.placeholder.toLowerCase().toCapitalCase()}
                key={index}
                />
                {emptyError[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{emptyError[field.name]}</p>
                : error[field.name] ? <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{error[field.name]}</p>
                :<></>}
            </div>
            )}
        </div>
        <div dir='ltr' ref={btnsRef} className='w-full my-4 flex justify-around items-center'>
            <button type="reset" className={`${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[-100%] opacity-0'} yoga-btn-sec hover:yoga-btn`}>{resetBtn}</button>
            <button type="submit" className={`${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[100%] opacity-0'} yoga-btn`}>{sendBtn}</button>
        </div>
        <Followers/>
    </form>
  )
}
