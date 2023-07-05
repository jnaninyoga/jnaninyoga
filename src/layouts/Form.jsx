import 'handyscript/lib/string';
import { useState, useRef } from 'react';
import { useIntersectView } from '../hooks';
import icon from '../assets/imgs/icons/lotus.png';
import PropsTypes from 'prop-types';

Form.propTypes = {
    title: PropsTypes.string,
    fields: PropsTypes.array,
    btn: PropsTypes.string,
    onSubmit: PropsTypes.func
}

export default function Form({title, fields, btn, onSubmit}) {
    const [contact, setContact] = useState({});
    const formRef = useRef(null);
    const btnsRef = useRef(null);
    const wrapper = useRef(null);
    const isWrapperIntersected = useIntersectView(wrapper);
    const isFormIntersected = useIntersectView(formRef);
    const isBtnsIntersected = useIntersectView(btnsRef);

  return (
    <form ref={formRef} action="" onSubmit={onSubmit} className='sm:w-[50vw] w-full sm:px-20 px-2 flex items-center gap-4 flex-col'>
        <img src={icon} className={`${isFormIntersected ? "scale-1" : "scale-0"} h-12 w-12 transition-all duration-500 select-none`} alt="Red/pink lotus icon" />
        <h1 className={`${isFormIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} cinzel text-yoga-white sm:text-3xl text-2xl font-bold uppercase transition-all duration-500`}>{title}</h1>
        <div ref={wrapper} className='w-full flex items-center justify-center sm:gap-6 gap-4 flex-col'>
            {fields.map((field, index) => 
            field.type === 'textarea' ?
            <textarea
                onChange={(e) => setContact({...contact, [e.target.name]: e.target.value})}
                // expand the textarea as the user types new lines
                rows={contact[field.name] ? contact[field.name].split('\n').length : 1}
                className={`${isWrapperIntersected ? "translate-y-0 opacity-100" : 'translate-y-[100%] opacity-0'} form-field resize-y delay-[${ index * fields.length }ms] `}
                name={field.name}
                placeholder={field.placeholder.toLowerCase().toCapitalCase()}
                key={index}
                />
            :
                <input
                onChange={(e) => setContact({...contact, [e.target.name]: e.target.value})} 
                className={`${isWrapperIntersected ? "translate-y-0 opacity-100": 'translate-y-[100%] opacity-0'} form-field delay-[${ 100 * index + 100 }ms]`}
                type={field.type.toLowerCase()}
                name={field.name.toLowerCase()}
                placeholder={field.placeholder.toLowerCase().toCapitalCase()}
                key={index}
                />
            )}
        </div>
        <div ref={btnsRef} className='w-full flex justify-around items-center'>
            <button type="reset" className={`${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[-100%] opacity-0'} yoga-btn-sec hover:yoga-btn`}>Reset</button>
            <button type="submit" className={`${isBtnsIntersected ? "translate-x-0 opacity-100" : 'translate-x-[100%] opacity-0'} yoga-btn`}>{btn}</button>
        </div>
    </form>
  )
}
