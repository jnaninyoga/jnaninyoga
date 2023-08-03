import Session from '../../components/Session'
import { useData } from '../../hooks'
import { useMemo, useRef, useState } from 'react';
import { standardDays, standardYogaCoursesTypes } from '../../utils'
import BG from "../../assets/imgs/spine/GreenMat.webp";
import SessionLookup from '../../layouts/SessionLookup';
import { useTranslation } from 'react-i18next';
import { updateDocument } from '../../firebase';
import { names } from '../../firebase/collections';
import SessionCreation from '../../layouts/SessionCreation';
// import backup from '../../backup';


export default function Classes() {
  const { data: { classes } } = useData();
  // const [, useModalActiveState] = useModalActiveState();

  const [modal, setModal] = useState();
  const [creationModal, setCreationModal] = useState();
  const [sessionUpdated, setSessionUpdated] = useState(false);
  const [sessionDeleted, setSessionDeleted] = useState(false);

  const { t } = useTranslation();

  const modalRef = useRef();

  const defaultSession = useMemo(() => ({ type: 0, start: "", end: "", desc: '' }), []);

  const updateSession = async (session) => {
    const {day, sid} = modal;
    try {
      const newClasses = [...classes];
      newClasses.find((sessionDay) => sessionDay.day === day).sessions[sid] = session;
      await updateDocument(names.classes, day, { sessions: newClasses.find((sessionDay) => sessionDay.day === day).sessions });
      setSessionUpdated(true);
    } catch (error) {
      console.error(error);
    }
  }

  // create a new session, and insert it like this:
  // newSession = {type: number, start: string = "12:00"}
  // sessions = [{type: number, start: string = "09:00"}, {type: number, start: string = "14:00"}]
  // the new session will be inserted after the session that have the start time lower than the new session start time session.start < newSession.start
  const createSession = async (session, day) => {
    try {
      const newClasses = [...classes];
      const { sessions } = newClasses.find((sessionDay) => sessionDay.day === day);
      const newSessions = [...sessions];
      // finding the index , NOTE session start is a string
      // const index = sessions.findIndex((ses) => ses?.start?.split(":")[0]*1 > session.start.split(":")[0]*1)
      // insert the newSession in it's correspondent index
      // newSessions.splice(index, 0, session);
      newSessions.push(session)
      await updateDocument(names.classes, day, { sessions: newSessions });
      setSessionUpdated(true);
    } catch (error) {
      console.error(error);
    }
  }

  // delete a session
  const deleteSession = async () => {
    const {day, sid} = modal;
    try {
      const newClasses = [...classes];
      const { sessions } = newClasses.find((sessionDay) => sessionDay.day === day);
      const newSessions = [...sessions];
      // delete the session
      newSessions.splice(sid, 1);
      await updateDocument(names.classes, day, { sessions: newSessions });
      setSessionDeleted(true);
    } catch (error) {
      console.error(error);
    }
  }

  const openModal = (data) => {
    setModal(data);
    
  }

  const openCreationModal = () => {
    setCreationModal(true);
    
  }

  const closeModal = (e) => {
    if(e.target === e.currentTarget){
      setModal(null);
      setCreationModal(null);
      
    }
  }


  return (
    <div className='flex gap-5 flex-col px-4 py-4 h-full w-full' style={{backgroundImage: `url(${BG})`}}>

      <button onClick={openCreationModal} className="w-full yoga-btn">
        <i className="fi fi-sr-plus text-yoga-dark flex justify-center items-center"></i> <span className="ml-4 uppercase">Add A New Session</span>
      </button>

      <section className="h-full pb-4 overflow-x-scroll scroll-smooth scroll-mx-[80vw] scroll-px-[80vw] sm:scroll-px-0 sm:scroll-mx-0">
        <table className="table-fixed sm:rotate-0 border-separate border-spacing-2">
            <thead>
                <tr className="text-yoga-white w-full">
                    {standardDays.map((day, idx) => (
                        <th key={idx} className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">{day}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* getting the biggest session with elemnts like a: [1,2,3], b: [1,2,3,4]; the biggest one it's b */}
                {Array.from({ length: Math.max(...classes.map((sessionDay) => sessionDay.sessions.length)) })
                .map((_, sid) => (
                    <tr key={sid} className="h-[80px]">
                        {classes.map((sessionDay, sdidx) => (
                          <td key={`${sdidx}${sid}`} className='h-[80px] cursor-pointer'>
                            <Session
                                onClick={() => openModal({ day: sessionDay.day, session: sessionDay.sessions[sid] || defaultSession, sid })}
                                type={sessionDay.sessions[sid]?.type*1 || 0}
                                start={sessionDay.sessions[sid]?.start}
                                end={sessionDay.sessions[sid]?.end}
                                desc={sessionDay.sessions[sid]?.desc}
                                instructor={t("classes.sessionInstructor", { course: standardYogaCoursesTypes[Math.max(sessionDay.sessions[sid]?.type - 1, 0)]?.type, start: sessionDay.sessions[sid]?.start, end: sessionDay.sessions[sid]?.end })}
                                alt={standardYogaCoursesTypes[Math.max(sessionDay.sessions[sid]?.type - 1, 0)]?.type}
                            />
                          </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </section>

    { modal && (
      <section onClick={closeModal} ref={modalRef} className="absolute  h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <SessionLookup
          id="model"
          session={modal.session} 
          onConfirm={updateSession}
          onDelete={deleteSession}
          onCancel={() => {setModal(null); setSessionUpdated(false); setSessionDeleted(false); }}
          confirmed={sessionUpdated}
          deleted={sessionDeleted}
        />
      </section>
    )}
    { creationModal && (
      <section onClick={closeModal} className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center">
        <SessionCreation
          id="creationmodel"
          onConfirm={createSession}
          onCancel={() => {setCreationModal(null); setSessionUpdated(false); }}
          confirmed={sessionUpdated}
        />
      </section>
    )}
    </div>

  )
}
