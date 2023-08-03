import PropsTypes from 'prop-types'
import Session from '../components/Session'
import BG from "../assets/imgs/spine/GreenMat.webp";
import { useEffect, useRef, useState } from 'react';
import { standardYogaCoursesTypes } from '../utils';
import Alert from './Alert';

SessionLookup.propTypes = {
    id: PropsTypes.string,
    session: PropsTypes.object,
    onCancel: PropsTypes.func,
    onConfirm: PropsTypes.func,
    onDelete: PropsTypes.func,
    confirmed: PropsTypes.bool,
    deleted: PropsTypes.bool,
    // type: PropsTypes.string,
}

export default function SessionLookup({id, session, onCancel, onConfirm, onDelete, confirmed=false, deleted=false}) {
    // const [targetSession, setTargetSession] = session;
    const [selectedSession, setSelectedSession] = useState(session);
    const [dropdown, setDropdown] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [isEndTime, setIsEndTime] = useState(true);

    const DropDown = useRef(null);

    const hideDropdown = e => {
        if (DropDown.current && e.target.id !== 'dropdownYogatypes' && !DropDown.current.contains(e.target)) {
            setDropdown(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', hideDropdown);
        return () => window.removeEventListener('click', hideDropdown);
    }, [dropdown]);

    // submit form
    const onSubmit = async (e) => {
        e.preventDefault();
        await onConfirm(selectedSession);
    }

  return (
    <section id={id} className='relative flex flex-col justify-center items-center p-6 gap-3 bg-yoga-white sm:w-[700px] w-[330px]'>
        { confirmed || deleted ? 
            <div className='flex flex-col justify-center items-center gap-3'>
                <h2 className='text-yoga-green-dark sm:text-3xl text-2xl font-bold uppercase text-center'>Session {confirmed && "Updated"} {deleted && "Deleted"} Succesfully</h2>
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
        { deleteAlert ? 
            <Alert 
                title={`Delete Session ${selectedSession?.desc}?`}
                message={`Are you sure you want to delete this session?`}
                confirm='Delete'
                cancel='Cancel'
                onConfirm={onDelete}
                onCancel={() => setDeleteAlert(false)}
            />
        : <>

        <button className={`sm:absolute top-4 right-6 cinzel text-center uppercase px-3 py-2 flex justify-center items-center text-yoga-white outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} onClick={() => setDeleteAlert(true)}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center mr-2"></i> Delete</button>
        <h2 className='text-yoga-green-dark sm:text-3xl text-2xl font-bold uppercase text-center'>Session Details Lookup</h2>

        <form action="" onSubmit={onSubmit} className='sm:w-[70%] w-full flex flex-col justify-center items-center gap-4'>
            <div className='w-full flex justify-between items-center flex-col gap-2'>
                <input
                    className='cinzel w-full bg-red-200 bg-opacity-80 text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] outline-white hover:bg-yoga-red transition-all'
                    type="text"
                    placeholder='Session Name'  
                    defaultValue={selectedSession?.desc}
                    onChange={e => setSelectedSession({...selectedSession, desc: e.target.value})}
                />
                {/* Custom drop down menu */}
                <div className='relative w-full flex justify-center items-center'>
                    <button type='button' id='dropdownYogatypes' onClick={() => setDropdown(!dropdown)} className='cinzel w-full flex justify-center items-center gap-3 text-center bg-red-200 bg-opacity-80 text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-white outline-white hover:bg-yoga-red hove:bg-opacity-100 transition-all'>{standardYogaCoursesTypes[selectedSession.type-1]?.type ?? "Free Time Session"} <svg className={`w-6 ${ dropdown && "rotate-180" } transition-all`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
                    <ul ref={DropDown} className={`absolute ${ dropdown ? 'top-[80%] opacity-100' : 'opacity-0 top-[180%] pointer-events-none'} left-1/2 -translate-x-1/2 z-[40] w-max bg-yoga-white p-1 flex justify-center items-center flex-col outline outline-2 -outline-offset-[5px] outline-[var(--yoga-red)] transition-all`}>
                        {standardYogaCoursesTypes.map((type, i) => <li key={i} title={type.desc} onClick={() => { setSelectedSession({...selectedSession, type: i+1}); setDropdown(false)}} className={`cinzel w-full cursor-pointer text-center text-sm uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] outline-white ${selectedSession.type == i+1 ? "bg-yoga-green text-yoga-white" : "bg-zinc-100"} hover:bg-yoga-green hover:text-yoga-white transition-all`}>{type.type}</li>)}
                        <li title={"Free Time Session"} onClick={() => { setSelectedSession({...selectedSession, type: 0, start: "", end: "", desc: ""}); setDropdown(false)}} className={`cinzel w-full cursor-pointer text-center text-sm uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] outline-white ${selectedSession.type == 0 ? "bg-yoga-green text-yoga-white" : "bg-zinc-100"} hover:bg-yoga-green hover:text-yoga-white transition-all`}>Free Time Session</li>
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
                            defaultValue={selectedSession?.start}
                        />
                    </label>
                    <label htmlFor='end-time' className='w-full pl-4 flex justify-between items-center gap-2 bg-yoga-green outline outline-2 -outline-offset-[5px] outline-white'>
                        <span className='cinzel uppercase font-semibold text-yoga-white'>End Time:</span>
                        <input
                            type='checkbox'
                            id='end-time'
                            checked={isEndTime}
                            className={`h-6 w-6 rounded-none bg-yoga-red outline outline-2 -outline-offset-[5px] outline-white active:scale-90 transition-all`}
                            onChange={() => { setIsEndTime(!isEndTime); setSelectedSession({...selectedSession, end: !isEndTime? session?.end : ''}) }}
                        />
                        <input 
                            id='end-time'
                            disabled={!isEndTime}
                            className={`cinzel w-1/2 text-center disabled:bg-gray-400 disabled:cursor-not-allowed bg-red-200 text-sm sm:text-base font-semibold uppercase pl-3 pr-2 py-3 outline outline-2 -outline-offset-[5px] outline-white hover:bg-yoga-red active:scale-90 transition-all`}
                            type="time" 
                            placeholder='End Time'
                            value={isEndTime ? selectedSession?.end : ''}
                            onChange={e => setSelectedSession({...selectedSession, end: e.target.value})}
                            defaultValue={selectedSession?.end}
                        />
                    </label>
                </div>
                <div className='bg-black h-full sm:w-[40%] w-full z-[20]' style={{backgroundImage: `url(${BG})`}}>
                <Session
                    height='h-[100px]'
                    type={selectedSession?.type*1}
                    start={selectedSession?.start}
                    end={selectedSession?.end}
                    desc={selectedSession?.desc}
                />
                </div>
            </div>
            <div className='w-full flex justify-evenly items-center'>
                <button type="reset" onClick={onCancel} className={`cinzel text-center text-sm sm:text-base font-semibold uppercase px-6 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`}>Cancel</button>
                <button type='submit' className={`cinzel text-center text-sm sm:text-base font-semibold uppercase px-6 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`}>Update</button>
            </div>
        </form>
        </>}
    </>}
    </section>
  )
}
