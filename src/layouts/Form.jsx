import { useState, useRef, useEffect } from 'react';
import { useCurrentLanguage, useIntersectView } from '../hooks';
import icon from '../assets/imgs/icons/lotus.webp';
import PropsTypes from 'prop-types';
import DropdownMenu from './DropdownMenu';
import PhoneInput from 'react-phone-number-input';
import Icon from '../assets/svg';

import 'react-phone-number-input/style.css';

Form.propTypes = {
    title: PropsTypes.string,
    state: PropsTypes.array,
    fields: PropsTypes.array,
    submitBtn: PropsTypes.string,
    resetBtn: PropsTypes.string,
    EmptyErrorMessage: PropsTypes.string,
    ErrorMessage: PropsTypes.string,
    insertElement: PropsTypes.element,
    onSubmit: PropsTypes.func,
    onReset: PropsTypes.func,
    dark: PropsTypes.bool,
    animatedIcon: PropsTypes.bool,
    errorTrigger: PropsTypes.bool,
}

export default function Form({title, state, fields, insertElement, resetBtn,  submitBtn="Submit", ErrorMessage="Something went wrong, please try again", EmptyErrorMessage="Please fill all the required fields", onSubmit= async form => console.log("FORM DATA: ", form), onReset=e=>e.preventDefault(), dark=false, animatedIcon=false, errorTrigger=false}) {
    // get the current language to know wich direction the form should be: ltr or rtl
    const currentLanguage = useCurrentLanguage();

    const [form, setForm] = state;
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState(false);

    // for field type of password
    const [showPassword, setShowPassword] = useState(false);

    const formRef = useRef(null);
    const btnsRef = useRef(null);
    const wrapper = useRef(null);
    const isWrapperIntersected = useIntersectView(wrapper);
    const isFormIntersected = useIntersectView(formRef);
    const isBtnsIntersected = useIntersectView(btnsRef);

    
    const setFormField = (e, fieldData={})=>{
        const { name, value } = e ? e.target : fieldData;
        const field = fields.find(field => field.name === name);
        const regex = new RegExp(field.regex);
        
        setForm({ ...form, [name]: field.valueFormatter ? field.valueFormatter(value.trim()) : value.trim() });
        // check if the field is required
        if (field.required) {
            value ? setErrors({...errors, [name]: !regex.test(value.trim()) ? field.error || `Invalid '${field.placeholder}'` : ''}) : setErrors({...errors, [name]: field.empty ||  `${field.placeholder} is required`});
        }

        console.log("FORM DATA: ", form);
    }

    const submitForm = async e =>{
        e.preventDefault();
        
        const formattedForm = fields.filter(field => field.type !== "separator").reduce((acc, field) => {
            if(field.for){
                // group the fields by the `for` value
                acc[field.for] = {...acc[field.for], [field.name]: form[field.name] || field.defaultValue || ''};
            }else{
                acc[field.name] = form[field.name] || field.defaultValue || '';
            }
            return acc;
        }, {});

        // check if there's any empty field or error field
        const isStillErrors = Object.values(errors).some(error => error);
        setIsError(isStillErrors);

        if(!isStillErrors){
            // calling the onSubmit with validated form data
            try{
                await onSubmit(formattedForm);
            } catch (error) {
                setIsError(true);
                console.error("FORM SUBMITION ERROR: ", error)
            }
        }
    }

    // reset the form and clear the errors
    const resetForm = ()=>{
        setErrors({});
        onReset();
    }  

    // setup a 5 seconds timeout to clear the EmptyMessage error
    useEffect(() => {
        if(!isError) return
        const timeout = setTimeout(() => {
            setIsError(false);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [isError]);
    

  return (
    <form ref={formRef} onSubmit={submitForm} className='lg:w-[50vw] w-full lg:px-20 sm:px-10 px-2 flex items-center flex-col'>
        {animatedIcon ?
            <div className={`${isFormIntersected ? "scale-1" : "scale-0"} sm:h-24 sm:w-32 h-20 w-28 flex items-center justify-center transition-all duration-500 select-none `}>
                <Icon
                    label="Lotus"
                    colors={{oc: "#ffffff", pc: "#fdc5ba"}}
                    height={160}
                    width={160}
                />
            </div>
            : <img src={icon} className={`${isFormIntersected ? "scale-1" : "scale-0"} sm:h-16 sm:w-16 h-12 w-12 transition-all duration-500 select-none`} alt="Red/pink lotus icon" />
        }
        <h1 className={`${isFormIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} cinzel ${!dark && "text-yoga-white"} text-center text-3xl font-bold uppercase transition-all duration-500`}>{title}</h1>

        {insertElement && <div className={`${isFormIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} my-2 transition-all duration-500 delay-200`}>
            {insertElement}
        </div>}

        <p className={`${isFormIntersected && (errorTrigger || isError) ? "translate-y-0 opacity-100 mb-2" : 'translate-y-[100%] opacity-0 mb-0'} text-center sm:text-lg text-base font-bold form-label-error transition-all duration-500`}>{errorTrigger ?  ErrorMessage : EmptyErrorMessage}</p>
        
        <div dir={currentLanguage.dir} ref={wrapper} className='w-full flex items-center justify-center gap-4 flex-col'>
            {fields.map((field, index) => <div key={index} className='relative w-full h-fit flex flex-col gap-1'>
            
            {/* Display a NOTE on top of field it there is one */}
            { field.note && <div className={`relative ${ isWrapperIntersected ? "translate-y-0 opacity-100 mb-1": 'translate-y-[-100%] opacity-0'} pl-2 m-0 flex font-bold text-sm text-yoga-green transition-all duration-[${ 100 * index + 100 }ms]`}>
                <i className="fi fi-sr-info text-yoga-green flex items-center justify-center mx-2 z-10 animate-pulse"></i>
                <div className='absolute h-8 w-8 top-1/2 border-t-2 border-l-2 border-yoga-green animate-pulse'></div>
                <p className="bg-yoga-green text-yoga-white px-1 z-10">{field.note}</p>
            </div> }

            {
                // Separators
                field.type === 'separator' ?
                <div className={`relative h-10 mt-4 w-full flex justify-center items-center gap-2 overflow-x-hidden`}>
                    <h4 className={`absolute ${isWrapperIntersected ? "left-4 opacity-100" : 'left-[-100%] opacity-0'} pl-2 pr-4 cinzel font-semibold uppercase w-max bg-yoga-white transition-all duration-[${ 100 * index + 100 }ms]`}>{field.title}:</h4>
                    <div className="w-full h-[2px] bg-cyan-800 bg-opacity-10"></div>
                </div> : 

                // Single Select
                field.type === 'singleSelect' ?
                <div className={`form-field flex gap-4 ${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'}  ${errorTrigger || (isError && field.required) || errors[field.name] ? "form-field-error" : ""} ${dark && "drop-shadow"} transition-all duration-[${ 100 * index + 100 }ms] bg-yoga-white`}>
                    <div className='cinzel font-semibold w-fit'>{field.name}{field.required && <span className="form-label-error">*</span>}:</div>
                    <div className='flex items-center gap-2 overflow-x-auto'>
                        {field.options.map((option, index) =>
                        <label key={index} className={`flex items-center gap-1`}>
                            <span className='capitalize'>{option}</span>
                            <input
                                defaultChecked={(form[field.name] === option) || (field?.defaultValue === option)}
                                onChange={setFormField}
                                className='accent-cyan-600 p-1 rounded-full focus:outline-red-300'
                                type='radio'
                                name={field.name}
                                value={option}
                                required={field.required}
                            />
                        </label>
                        )}
                    </div>
                </div> :

                // Custom Select
                field.type === 'select' ?
                <DropdownMenu 
                    options={field.options}
                    placeholder={field.placeholder}
                    onSelect={selected => setFormField(null, {name: field.name, value: selected}) }
                    defaultSelected={typeof field.defaultValue == 'number' ? form[field.name] || field.defaultValue : field.options.indexOf(form[field.name] || field.defaultValue) || 0}
                /> :

                // Testarea element
                field.type === 'textarea' ?
                <div className={`relative w-full h-fit flex flex-col gap-1`} >
                    <textarea
                        onChange={setFormField}
                        // expand the textarea as the user types new lines
                        rows={form[field.name] ? form[field.name].split('\n').length : 2}
                        className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} form-field ${ errorTrigger || (isError && field.required) || errors[field.name] ? "form-field-error form-label-error" : ""} ${dark && "drop-shadow"} ${field.required && "placeholder:first-letter:text-red-600"} resize-y placeholder:capitalize delay-[${ 100 * index + 100 }ms] `}
                        name={field.name}
                        placeholder={field.required ? "*"+field.placeholder : field.placeholder}
                        defaultValue={form[field.name] || field.defaultValue}
                        required={field.required}
                        />
                        {// check if the textarea have a maxChars rule like maxChars = 500
                            (field.maxChars && form[field.name]?.length > 0) &&
                            <p className={`z-30 absolute bottom-2 ltr:right-3 rtl:left-3 p-0 m-0 text-sm transition-all duration-[${ 100 * index + 100 }ms]`}>{form[field.name].length}/{field.maxChars}</p>
                        }
                </div> :

                // input type phone
                field.type === 'tel' ?
                <div className='relative w-full h-fit flex gap-1'>
                    <PhoneInput
                        defaultCountry='MA'
                        name={field.name}
                        onChange={value => setFormField(null, {name: field.name, value}) }
                        className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} form-field ${ errorTrigger || (isError && field.required) || errors[field.name] ? "form-field-error form-label-error" : ""} ${dark && "drop-shadow"} ${field.required && "placeholder:first-letter:text-red-600"} placeholder:capitalize delay-[${ 100 * index + 100 }ms]`}
                        placeholder={field.required ? "*"+field.placeholder : field.placeholder}
                        value={form[field.name] || field.defaultValue}
                        required={field.required}
                    />
                </div> :

                // default input element
                <div className='relative w-full h-fit flex flex-col gap-1'>
                    <input
                        onChange={setFormField}
                        className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} form-field ${ errorTrigger || (isError && field.required) || errors[field.name] ? "form-field-error form-label-error" : ""} ${dark && "drop-shadow"} ${field.required && "placeholder:first-letter:text-red-600"} placeholder:capitalize delay-[${ 100 * index + 100 }ms]`}
                        type={field.type.toLowerCase() === 'password' ? showPassword ? 'text' : 'password' : field.type.toLowerCase()}
                        name={field.name.toLowerCase()}
                        placeholder={field.required ? "*"+field.placeholder : field.placeholder}
                        defaultValue={form[field.name] || field.defaultValue}
                        required={field.required}
                    />
                    {// if the field is type of password, show the show/hide password button
                        (field.type.toLowerCase() === 'password') && (
                        <button type='button' title={showPassword ? "Hide Password" : "Show Password"} onClick={() => setShowPassword(!showPassword)} className={`${isWrapperIntersected ? "-translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} absolute top-[17px] ${currentLanguage.dir === "rtl" ? "left-6" : "right-6"} p-0 m-0 text-sm transition-all duration-[${ 100 * index + 100 }ms]`}> 
                            <i className={`fi ${showPassword ? "fi-sr-eye-crossed" : "fi-sr-eye"} ${ errorTrigger || (isError && field.required) || errors[field.name] ? "form-label-error" : "text-yoga-green"} flex justify-center items-end`}></i>
                        </button>
                    )}
                </div>
            }

            {/* // show the error message if there's any */}
            { errors[field.name] && <p className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} pl-2 m-0 font-bold text-sm form-label-error transition-all duration-[${ 100 * index + 100 }ms]`}>{errors[field.name]}</p> }
            
            </div>
        )}
        </div>

        <div dir='ltr' ref={btnsRef} className='w-full py-6 flex justify-around items-center z-50'>
            {resetBtn && <button type="reset" onClick={resetForm} className={`${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[-100%] opacity-0'} ${dark && "drop-shadow-md"} yoga-btn-sec hover:yoga-btn`}>{resetBtn}</button> }
            <button type="submit" className={`${resetBtn ? `${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[100%] opacity-0'}` : `${isBtnsIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'}`} ${!resetBtn ? "w-[65%]" : ''} ${dark && "drop-shadow-md"} yoga-btn`}>{submitBtn || "submit"}</button>
        </div>

    </form>
  )
}

