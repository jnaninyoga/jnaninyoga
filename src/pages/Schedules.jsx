import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/yoga.mp4";
import Session from "../components/Session";
import sessions from "../constant/sessions.json"
import SessionRefernce from "../components/SessionRefernce";

export default function Schedules() {
    console.log(sessions);
  return (
    <>
    <Header/>
    <OverLaped banner={banner} type="video">
        <section className="h-full pb-4 sm:pb-0 sm:overflow-x-hidden overflow-x-scroll scroll-smooth scroll-mx-[80vw] scroll-px-[80vw] sm:scroll-px-0 sm:scroll-mx-0">
            <table className="table-fixed sm:rotate-0 border-separate border-spacing-2">
                <thead>
                    <tr className="text-yoga-white w-full">
                        <th className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">Monday</th>
                        <th className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">Tuesday</th>
                        <th className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">Wednesday</th>
                        <th className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">Thursday</th>
                        <th className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">Friday</th>
                        <th className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">Saturday</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((sessionDay, sdidx) => (
                        <tr key={sessionDay.day} className="h-[80px]">
                            {sessionDay.data.map((session, sidx) => (
                            <Session
                                key={`${sdidx}${sidx}`}
                                type={session.type}
                                start={session.start}
                                end={session.end}
                                desc={session.desc}
                            />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    </OverLaped>
    
        <SessionRefernce/>

    <Footer/>
    </>
  )
}
