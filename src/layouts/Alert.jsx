import { useMemo } from 'react';
import PropsTypes from 'prop-types';
import Icon from '../assets/svg';

Alert.propTypes = {
    type: PropsTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropsTypes.string,
    message: PropsTypes.string,
    confirm: PropsTypes.string,
    cancel: PropsTypes.string,
    onConfirm: PropsTypes.func,
    onCancel: PropsTypes.func,
}

export default function Alert({title, message, confirm, cancel, type="info", onConfirm=() => console.log("Action Confirmed"), onCancel=() => console.log("Action Canceled")}) {
  // setting the Alert style theme based on the type
  const theme = useMemo(() => {
    switch (type.toLowerCase()) {
      case 'success':
        return {
          icon: <i className="fi fi-br-check h-full w-full flex justify-around items-center text-yoga-white"></i>,
          color: 'text-yoga-green',
          bg: 'bg-yoga-green',
          outline: 'outline-yoga-green',
          withIconBG: true
        };
      case 'error':
        return {
          icon: <i className="fi fi-br-cross h-full w-full flex justify-around items-center text-yoga-white"></i>,
          color: 'text-red-500',
          bg: 'bg-red-500',
          outline: 'outline-red-500',
          withIconBG: true
        };
      case 'warning':
        return {
          icon: <i className="fi fi-ss-triangle-warning h-full w-full flex justify-around items-center text-yellow-400"></i>,
          color: 'text-yellow-500',
          bg: 'bg-yellow-400',
          outline: 'outline-yellow-400',
          withIconBG: false
        };
      case 'info':
        return {icon: 'info', color: 'yoga-red', withIconBG: false};
      default:
        return {icon: 'info', color: 'yoga-red', withIconBG: false};
    }
  }, [type]);

  return (
    <div role='alert' className={`z-[99999] outline ${theme.outline} outline-2 -outline-offset-[12px] py-6 px-6 sm:w-[700px] w-[350px] flex items-center justify-between flex-col gap-4 bg-yoga-white bg-texture texture-v-1 sm:texture-h-1 texture-opacity-80 overflow-hidden`}>
        {/* <img src={icon} className={`h-12 w-12 transition-all duration-500 select-none z-20 animate-bounce`} alt="Red/pink lotus icon" /> */}
        { type.toLowerCase() == 'info' ?
          <div className='sm:h-20 sm:w-28 h-16 w-20 flex items-center justify-center transition-all duration-500 select-none'>
            <Icon 
              label={type}
              colors={{oc: "#ffffff", pc: "#fdc5ba"}}
              height={120}
              width={120}
            /> 
          </div> :

          <div className={`${type.toLowerCase() == "warning" ? "sm:text-6xl text-3xl" : "sm:text-4xl text-3xl"} p-2 flex justify-center items-center transition-all duration-500 select-none z-20 animate-bounce ${theme.withIconBG ? `sm:h-16 sm:w-16 h-16 w-16 ${theme.bg} rounded-full` : ''}`}>
            {theme.icon}
          </div>
        }
        <h3 className={`cinzel text-xl sm:text-2xl font-bold uppercase text-center ${theme.color} transition-all duration-500 z-20`}>{title}</h3>
        <p role='alertdialog' className={`cinzel text-center pb-2 sm:text-xl transition-all duration-500 z-20`}>{message}</p>
        <div className='sm:w-[80%] w-full flex justify-around items-center px-4 z-20'>
            {cancel && <button onClick={() => onCancel()} className={`${!confirm ? "yoga-btn" : "yoga-btn-sec hover:yoga-btn"} drop-shadow`}>{cancel}</button>}
            {confirm && <button onClick={() => onConfirm()} className="yoga-btn drop-shadow">{confirm}</button>}
        </div>
    </div>
  )
}
