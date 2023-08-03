import PropsTypes from 'prop-types'
import Session from '../components/Session'
import BG from "../assets/imgs/spine/GreenMat.webp";
import { useEffect, useRef, useState } from 'react';
import { standardDays, standardYogaCoursesTypes } from '../utils';

SessionCreation.propTypes = {
    id: PropsTypes.string,
    onCancel: PropsTypes.func,
    onConfirm: PropsTypes.func,
    confirmed: PropsTypes.bool,
    // type: PropsTypes.string,
}

export default function SessionCreation({id, onCancel, onConfirm, confirmed=false}) {
    const [selectedSession, setSelectedSession] = useState({type: 1});
    // getting the string value of the current day 'monday', 'tuesday', etc
    const [selectedDay, setSelectedDay] = useState(standardDays[new Date().getDay()-1].toLowerCase());
    const [dropdown, setDropdown] = useState(false);
    const [dropdownDays, setDropdownDays] = useState(false);

    const DropDown = useRef(null);

    const hideDropdown = e => {
        if (DropDown.current && e.target.id !== 'dropdownYogatypes' && !DropDown.current.contains(e.target)) {
            setDropdown(false);
        }
    }

    const hideDropdownDays = e => {
        if (DropDown.current && e.target.id !== 'dropdownDays' && !DropDown.current.contains(e.target)) {
            setDropdownDays(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', e => { hideDropdown(e); hideDropdownDays(e) });
        return () => window.removeEventListener('click', e => { hideDropdown(e); hideDropdownDays(e) });
    }, [dropdown]);

    // submit form
    const onSubmit = async (e) => {
        e.preventDefault();
        await onConfirm(selectedSession, selectedDay);
    }

  return (
    <section id={id} className='relative flex flex-col justify-center items-center p-6 gap-3 bg-yoga-white sm:w-[700px] w-[330px]'>
        { confirmed ? 
            <div className='flex flex-col justify-center items-center gap-3'>
                <h2 className='text-yoga-green-dark sm:text-3xl text-2xl font-bold uppercase text-center'>Session Crated Succesfully</h2>
                <div className='bg-black h-full sm:w-[40%] w-full z-[20]' style={{backgroundImage: `url(${BG})`}}>
                <Session
                    height='h-[100px]'
                    type={selectedSession.type*1}
                    start={selectedSession.start}
                    end={selectedSession.end}
                    desc={selectedSession.desc}
                />
                </div>
                <button type='button' onClick={onCancel} className={`yoga-btn`}>Go Back</button>
            </div>

        : <>

        <h2 className='text-yoga-green-dark sm:text-3xl text-2xl font-bold uppercase text-center'>Session Details Creation</h2>

        <form action="" onSubmit={onSubmit} className='sm:w-[70%] w-full flex flex-col justify-center items-center gap-4'>
            <div className='w-full flex justify-between items-center flex-col gap-2'>
                {/* Custom drop down menu */}
                <div className='relative w-full flex justify-center items-center'>
                    <button type='button' id='dropdownDays' onClick={() => setDropdownDays(!dropdownDays)} className='cinzel w-full flex justify-center items-center gap-3 text-center bg-red-200 bg-opacity-80 text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-white outline-white hover:bg-yoga-red hove:bg-opacity-100 transition-all'>{selectedDay} <svg className={`w-6 ${ dropdownDays && "rotate-180" } transition-all`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
                    <ul ref={DropDown} className={`absolute ${ dropdownDays ? 'top-[80%] opacity-100' : 'opacity-0 top-[180%] pointer-events-none'} left-1/2 -translate-x-1/2 z-[40] w-max bg-yoga-white p-1 flex justify-center items-center flex-col outline outline-2 -outline-offset-[5px] outline-[var(--yoga-red)] transition-all`}>
                        {standardDays.map((day, i) => <li key={i} title={day} onClick={() => { setSelectedDay(day.toLowerCase()); setDropdownDays(false)}} className={`cinzel w-full cursor-pointer text-center text-sm uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] outline-white ${selectedDay == day.toLowerCase() ? "bg-yoga-green text-yoga-white" : "bg-zinc-100"} hover:bg-yoga-green hover:text-yoga-white transition-all`}>{day}</li>)}
                    </ul>
                </div>
                <input
                    className='cinzel w-full bg-red-200 bg-opacity-80 text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] outline-white hover:bg-yoga-red transition-all'
                    type="text"
                    placeholder='Session Name'  
                    defaultValue={selectedSession.desc}
                    onChange={e => setSelectedSession({...selectedSession, desc: e.target.value})}
                />
                {/* Custom drop down menu */}
                <div className='relative w-full flex justify-center items-center'>
                    <button type='button' id='dropdownYogatypes' onClick={() => setDropdown(!dropdown)} className='cinzel w-full flex justify-center items-center gap-3 text-center bg-red-200 bg-opacity-80 text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-white outline-white hover:bg-yoga-red hove:bg-opacity-100 transition-all'>{standardYogaCoursesTypes[Math.max(selectedSession.type-1, 0)]?.type} <svg className={`w-6 ${ dropdown && "rotate-180" } transition-all`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
                    <ul ref={DropDown} className={`absolute ${ dropdown ? 'top-[80%] opacity-100' : 'opacity-0 top-[180%] pointer-events-none'} left-1/2 -translate-x-1/2 z-[40] w-max bg-yoga-white p-1 flex justify-center items-center flex-col outline outline-2 -outline-offset-[5px] outline-[var(--yoga-red)] transition-all`}>
                        {standardYogaCoursesTypes.map((type, i) => <li key={i} title={type.desc} onClick={() => { setSelectedSession({...selectedSession, type: i+1}); setDropdown(false)}} className={`cinzel w-full cursor-pointer text-center text-sm uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] outline-white ${selectedSession.type == i+1 ? "bg-yoga-green text-yoga-white" : "bg-zinc-100"} hover:bg-yoga-green hover:text-yoga-white transition-all`}>{type.type}</li>)}
                    </ul>
                </div>
            </div>
            <div className='w-full flex justify-center items-center sm:flex-row flex-col gap-3'>
                <div className='sm:w-[60%] w-full flex justify-center items-end flex-col gap-2'>
                    <label htmlFor='start-time' className='w-full pl-4 flex justify-between items-center gap-2 bg-yoga-green outline outline-2 -outline-offset-[5px] outline-white'>
                        <span className='cinzel uppercase font-semibold text-yoga-white'>Start Time:</span>
                        <input
                            id='start-time'
                            className='cinzel w-1/2 text-center bg-red-200 text-sm sm:text-base font-semibold uppercase pl-3 pr-2 py-3 outline outline-2 -outline-offset-[5px] outline-white hover:bg-yoga-red active:scale-90 transition-all'
                            type="time" 
                            placeholder='Start Time'
                            // the max time can be the end time minus 30 hour
                            max={selectedSession.end ? `${selectedSession.end.split(':')[0]-1}:${selectedSession.end.split(':')[1]}` : '23:59'}
                            onChange={e => setSelectedSession({...selectedSession, start: e.target.value})}
                            defaultValue={selectedSession.start}
                        />
                    </label>
                    <label htmlFor='end-time' className='w-full pl-4 flex justify-between items-center gap-2 bg-yoga-green outline outline-2 -outline-offset-[5px] outline-white'>
                        <span className='cinzel uppercase font-semibold text-yoga-white'>End Time:</span>
                        <input 
                            id='end-time'
                            className='cinzel w-1/2 text-center bg-red-200 text-sm sm:text-base font-semibold uppercase pl-3 pr-2 py-3 outline outline-2 -outline-offset-[5px] outline-white hover:bg-yoga-red active:scale-90 transition-all'
                            type="time" 
                            placeholder='End Time'
                            onChange={e => setSelectedSession({...selectedSession, end: e.target.value})}
                            defaultValue={selectedSession.end}
                        />
                    </label>
                </div>
                <div className='bg-black h-full sm:w-[40%] w-full z-[20]' style={{backgroundImage: `url(${BG})`}}>
                <Session
                    height='h-[100px]'
                    type={selectedSession.type*1}
                    start={selectedSession.start}
                    end={selectedSession.end}
                    desc={selectedSession.desc}
                />
                </div>
            </div>
            <div className='w-full flex justify-evenly items-center'>
                <button type="reset" onClick={onCancel} className={`cinzel text-center text-sm sm:text-base font-semibold uppercase px-6 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Cancel</button>
                <button type='submit' className={`cinzel text-center text-sm sm:text-base font-semibold uppercase px-6 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>Create</button>
            </div>
        </form>
    </>}
    </section>
  )
}
