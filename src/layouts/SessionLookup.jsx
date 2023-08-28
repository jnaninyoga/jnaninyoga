import PropsTypes from 'prop-types'
import Session from '../components/Session'
import BG from "../assets/imgs/spine/GreenMat.webp";
import { useState } from 'react';
import { standardYogaCoursesTypes } from '../utils';
import Alert from './Alert';
import DropdownMenu from './DropdownMenu';

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
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [isEndTime, setIsEndTime] = useState(true);

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

        <button title='Delete this session' className={`sm:absolute top-4 right-6 cinzel text-center uppercase px-3 py-3 flex justify-center items-center text-yoga-white outline outline-2 -outline-offset-[5px] bg-red-400 outline-white hover:bg-red-500 active:scale-90 transition-all`} onClick={() => setDeleteAlert(true)}><i className="fi fi-bs-trash text-yoga-white flex justify-center items-center"></i></button>
        <h2 className='text-yoga-green-dark sm:text-3xl text-2xl font-bold uppercase text-center'>Session Details Lookup</h2>

        <form action="" onSubmit={onSubmit} className='sm:w-[70%] w-full flex flex-col justify-center items-center gap-4'>
            <div className='w-full flex justify-between items-center flex-col gap-3'>
                <input
                    className='form-field drop-shadow-md'
                    type="text"
                    placeholder='Session Name'  
                    defaultValue={selectedSession?.desc}
                    onChange={e => setSelectedSession({...selectedSession, desc: e.target.value})}
                />
                <DropdownMenu
                    placeholder={standardYogaCoursesTypes[Math.max(selectedSession.type-1, 0)]?.type}
                    options={standardYogaCoursesTypes.map(type => type.type)}
                    onSelect={selected => setSelectedSession({...selectedSession, type: standardYogaCoursesTypes.findIndex(type => type.type === selected)+1})}
                />
            </div>
            <div className='w-full flex justify-center items-center sm:flex-row flex-col gap-3'>
                <div className='sm:w-[60%] w-full flex justify-center items-end flex-col gap-2'>
                    <label htmlFor='start-time' className='w-full pl-4 flex justify-between items-center gap-2 bg-yoga-green outline outline-2 -outline-offset-[5px] outline-white'>
                        <span className='cinzel uppercase font-semibold text-yoga-white'>Start Time:</span>
                        <input
                            id='start-time'
                            className='cinzel w-1/2 text-center bg-yoga-red text-sm sm:text-base font-semibold uppercase pl-3 pr-2 py-3 outline outline-2 -outline-offset-[5px] outline-white focus:contrast-[1.20] hover:contrast-[1.20] hover:bg-yoga-red active:scale-90 transition-all'
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
                            className={`h-6 w-6 accent-gray-400 checked:accent-[#fdc5ba] hover:accent-[#fdc5ba] rounded-none bg-yoga-red outline outline-2 -outline-offset-[2px] outline-white hover:bg-yoga-red active:scale-90 transition-all`}
                            onChange={() => { setIsEndTime(!isEndTime); setSelectedSession({...selectedSession, end: !isEndTime? session?.end : ''}) }}
                        />
                        <input 
                            id='end-time'
                            disabled={!isEndTime}
                            className={`cinzel w-1/2 text-center disabled:bg-gray-400 disabled:cursor-not-allowed bg-yoga-red text-sm sm:text-base font-semibold uppercase pl-3 pr-2 py-3 outline outline-2 -outline-offset-[5px] outline-white focus:contrast-[1.20] hover:contrast-[1.20] hover:bg-yoga-red active:scale-90 transition-all`}
                            type="time" 
                            placeholder='End Time'
                            value={isEndTime ? selectedSession?.end : ''}
                            onChange={e => setSelectedSession({...selectedSession, end: e.target.value})}
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
