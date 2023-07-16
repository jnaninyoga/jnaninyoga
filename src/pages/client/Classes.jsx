import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import OverLaped from "../layouts/OverLaped";
import banner from "../assets/videos/yoga.mp4";
import Session from "../components/Session";
import sessions from "../constant/sessions.json"
import SessionRefernce from "../components/SessionRefernce";
import { useTranslation } from "react-i18next";
import { standardDays, standardYogaCoursesTypes } from "../utils";
import Meta from "../meta";
import { useActivePage, usePathLanguage } from "../hooks";
// import OGP from '../constant/ogp';

export default function Classes() {
    const { t } = useTranslation();
    const activePage = useActivePage();
    usePathLanguage();

    const days = t(`${activePage}.days`, { returnObjects: true });
    const yogaCoursesTypes = t(`${activePage}.yogaCoursesTypes`, { returnObjects: true });

    const TDays = () => Array.isArray(days) ? days : standardDays;
    const TYogaCoursesTypes = () => Array.isArray(yogaCoursesTypes) ? yogaCoursesTypes : standardYogaCoursesTypes;

  return (
    <>
    <Meta title={t('classes.meta.title')} />
    <Header/>
    <OverLaped banner={banner} type="video">
        <section className="h-full pb-4 sm:pb-0 sm:overflow-x-hidden overflow-x-scroll scroll-smooth scroll-mx-[80vw] scroll-px-[80vw] sm:scroll-px-0 sm:scroll-mx-0">
            <table className="table-fixed sm:rotate-0 border-separate border-spacing-2">
                <thead>
                    <tr className="text-yoga-white w-full">
                        {TDays().map((day, idx) => (
                            <th key={idx} className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">{day}</th>
                        ))}
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
                                instructor={t("sessionInstructor", { course: TYogaCoursesTypes()[session.type - session.type === 0 ? 0 : 1].type, start: session.start, end: session.end })}
                                alt={TYogaCoursesTypes()[session.type - session.type === 0 ? 0 : 1].type}
                            />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    </OverLaped>
    <SessionRefernce types={TYogaCoursesTypes()}/>
    <Footer/>
    </>
  )
}
