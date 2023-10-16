import Footer from "../../layouts/global/Footer";
import Header from "../../layouts/global/Header";
import OverLaped from "../../layouts/global/OverLaped";
import banner from "../../assets/videos/yoga.mp4";
import Session from "../../components/sessions/Session";
import SessionRefernce from "../../components/sessions/SessionRefernce";
import { useTranslation } from "react-i18next";
import { standardDays, standardYogaCoursesTypes } from "../../utils";
import Meta from "../../meta";
import metadata from "../../meta/meta";
import { useActivePage, usePathLanguage } from "../../hooks";
import { useEffect, useState } from "react";
import { onSnapshot, orderBy } from "firebase/firestore";
import { fetchDocs } from "../../firebase";
import collections from "../../firebase/collections";

export default function Classes() {
	const [classes, setClasses] = useState([]);

	const { t } = useTranslation();
	const activePage = useActivePage();
	usePathLanguage();

	const days = t(`${activePage}.days`, { returnObjects: true });
	const yogaCoursesTypes = t(`${activePage}.yogaCoursesTypes`, {
		returnObjects: true,
	});

	const TDays = () => (Array.isArray(days) ? days : standardDays);
	const TYogaCoursesTypes = () => Array.isArray(yogaCoursesTypes) ? yogaCoursesTypes : standardYogaCoursesTypes;

	// load classes from firestore database
	useEffect(() => {
		(async () => {
			try {
				onSnapshot(
					fetchDocs(collections.classes, orderBy("order")),
					(querySnapshot) => {
						setClasses(
							querySnapshot.docs.map((doc) => ({ ...doc.data(), day: doc.id }))
						);
					}
				);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	return (
		<>
			<Meta title={t("classes.metaTitle")} {...metadata.classes} />
			<Header />
			<OverLaped banner={banner} type="video">
				<section className="h-full pb-4 sm:pb-0 sm:overflow-x-hidden overflow-x-scroll scroll-smooth scroll-mx-[80vw] scroll-px-[80vw] sm:scroll-px-0 sm:scroll-mx-0">
					<table className="table-fixed sm:rotate-0 border-separate border-spacing-2">
						<thead>
							<tr className="text-yoga-white w-full">
								{TDays().map((day, idx) => (
									<th key={idx} className="sm:w-[180px] w-[80vw] min-w-[80vw] sm:min-w-[180px] sm:max-w-[180px] px-2 py-1 cinzel bg-yoga-red">
										{day}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{/* getting the biggest session with elemnts like a: [1,2,3], b: [1,2,3,4]; the biggest one it's b */}
							{Array.from({length: Math.max(...classes.map((sessionDay) => sessionDay.sessions.length))}).map((_, sid) => (
								<tr key={sid} className="h-[80px]">
									{classes.map((sessionDay, sdidx) => (
										<td key={`${sdidx}${sid}`} className="h-[80px]">
											<Session
												type={sessionDay.sessions[sid]?.type * 1 || 0}
												start={sessionDay.sessions[sid]?.start}
												end={sessionDay.sessions[sid]?.end}
												desc={sessionDay.sessions[sid]?.desc}
												instructor={t("classes.sessionInstructor", {
													course:	TYogaCoursesTypes()[sessionDay.sessions[sid]?.type - sessionDay.sessions[sid]?.type === 0 ? 0 : 1].type,
													start: sessionDay.sessions[sid]?.start,
													end: sessionDay.sessions[sid]?.end,
												})}
												alt={TYogaCoursesTypes()[sessionDay.sessions[sid]?.type - sessionDay.sessions[sid]?.type === 0 ? 0 : 1].type}
											/>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</section>
			</OverLaped>
			<SessionRefernce types={TYogaCoursesTypes()} />
			<Footer />
		</>
	);
}
