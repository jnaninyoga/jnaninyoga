import icon from '../assets/imgs/icons/lotus.webp';
import PropsTypes from 'prop-types';

Alert.propTypes = {
    title: PropsTypes.string,
    message: PropsTypes.string,
    confirm: PropsTypes.string,
    cancel: PropsTypes.string,
    onConfirm: PropsTypes.func,
    onCancel: PropsTypes.func,
}

export default function Alert({title, message, confirm, cancel, onConfirm=() => console.log("Action Confirmed"), onCancel=() => console.log("Action Canceled")}) {
  return (
    <div className={`py-6 px-6 sm:w-[700px] w-[350px] flex items-center justify-between flex-col gap-4 bg-yoga-white bg-texture texture-v sm:texture-h texture-opacity-80 overflow-hidden`}>
        <img src={icon} className={` h-12 w-12 transition-all duration-500 select-none z-20`} alt="Red/pink lotus icon" />
        <h3 className={`cinzel text-xl sm:text-2xl font-bold uppercase text-center transition-all duration-500 z-20`}>{title}</h3>
        <p className={`cinzel text-center pb-2 sm:text-xl transition-all duration-500 z-20`}>{message}</p>
        <div className='w-full flex justify-around items-center px-4 z-20'>
            {confirm && <button onClick={onConfirm} className="yoga-btn">{confirm}</button>}
            {cancel && <button onClick={onCancel} className={`${!confirm ? "yoga-btn" : "yoga-btn-sec hover:yoga-btn"}`}>{cancel}</button>}
        </div>
    </div>
  )
}
