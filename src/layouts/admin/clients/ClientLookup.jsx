import PropTypes from "prop-types";
import { clientFields } from "../../../utils/form";
import logo from "../../../assets/imgs/spine/logo.webp";
import { dateFormater, whatsappLink } from "../../../utils";
import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import Bullet from "../shared/Bullet";

ClientLookup.propTypes = {
	client: PropTypes.shape({
		// personal info
		id: PropTypes.string,
		hp: PropTypes.number,
		firstname: PropTypes.string,
		lastname: PropTypes.string,
		sex: PropTypes.oneOf(["male", "female"]),
		birthdate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		age: PropTypes.number,
		email: PropTypes.string,
		phone: PropTypes.string,
		address: PropTypes.string,
		job: PropTypes.string,
		// medical info
		medicalhistory: PropTypes.shape({
			// current care
			currentcare: PropTypes.oneOf(clientFields.find((field) => field.name === "currentcare").options),
			currentcareinfo: PropTypes.string,
			// medical history
			record: PropTypes.oneOf(clientFields.find((field) => field.name === "record").options),
			recordinfo: PropTypes.string,
		}),
		// physical / mental info
		physentalstate: PropTypes.shape({
			physical: PropTypes.arrayOf(PropTypes.string),
			mental: PropTypes.arrayOf(PropTypes.string),
		}),
		// life rhythm
		liferhythm: PropTypes.shape({
			sleep: PropTypes.oneOf(clientFields.find((field) => field.name === "sleep").options),
			nutrition: PropTypes.oneOf(clientFields.find((field) => field.name === "nutrition").options),
			sport: PropTypes.oneOf(clientFields.find((field) => field.name === "sport").options),
			meditation: PropTypes.oneOf(clientFields.find((field) => field.name === "meditation").options),
		}),
		// consultation reason
		consultationreason: PropTypes.string,
		// => Database document fields
		createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	}),
};

// local components props
Title.propTypes = {
	title: PropTypes.string.isRequired,
};


function Title({ title }) {
	return (
		<div className={`relative h-10 w-full min-w-max flex justify-center items-center gap-2`}>
			<h3 className={`absolute left-8 opacity-100 px-4 py-[5px] cinzel text-lg text-center font-semibold uppercase w-max bg-yoga-red outline outline-2 outline-white -outline-offset-[6px] transition-all`}>
				{title}
			</h3>
			<div className="w-full h-[4px] bg-cyan-800 bg-opacity-10"></div>
		</div>
	);
}

export default function ClientLookup({ client }) {
	const [withClientIDURL, setWithClientIDURL] = useState(false);

	const itsLongName = useMemo(() => {
		const { firstname, lastname } = client;
		return firstname.split(" ").length > 2 || lastname.split(" ").length > 2;
	}, [client]);

	return (
		<>
			<Helmet>
				<title>{`${client.firstname} ${client.lastname} - Jnanin Yoga Profile`}</title>
			</Helmet>
			<section className="relative h-[90%] w-[95%] md:w-[780px] md:h-[95%] flex flex-col gap-2 bg-yoga-white print:bg-white sm:overflow-x-hidden overflow-y-auto bg-texture texture-v-1 before:opacity-20 print:before:opacity-30 print:absolute print:left-0 print:top-0 print:h-screen print:w-screen">
				<section className="relative h-full w-full min-w-max px-4 py-6 print:px-0 print:pr-5 print:py-4 flex items-center flex-col gap-8 print:gap-6">
					{/* PERSONAL INFORMATIONS */}
					<header className="w-full pl-5 flex justify-start items-center gap-4">
						<div className="w-32 h-32 flex justify-center items-center aspect-square bg-cover bg-center">
							<img src={logo} alt="jnanin yoga client" className="w-[90%] h-[90%] object-cover object-center aspect-square" />
						</div>
						<div className="w-full min-w-max h-full flex flex-col justify-center gap-1">
							{/* biomethric informations */}
							<h2 title={"Client ID"} className="cinzel text-lg font-semibold text-gray-400">
								# {withClientIDURL ? (
									<a href={`${import.meta.env.VITE_HOST_NAME}/lotus/clients?id=${client.id}`} className={`outline-none hover:text-yoga-green focus:text-yoga-green hover:underline focus:underline underline-offset-4 transition-all`} target="_blank" rel="noreferrer">
										{client.id}
									</a>
								) : (
									client.id
								)}
							</h2>
							<h1 className={`flex ${ itsLongName ? "flex-col text-3xl" : "text-4xl"} cinzel text-3xl uppercase font-semibold`}>
								{itsLongName ? (
									<>
										<span className="cinzel">{client.firstname}</span>
										<span className="cinzel">{client.lastname}</span>
									</>
								) : (
									<span className="cinzel">{`${client.firstname} ${client.lastname}`}</span>
								)}
							</h1>
							<div className="w-full flex flex-col">
								<ul className="w-full flex gap-4">
									<Bullet
										styledText
										title={`${client.firstname} ${client.lastname}, Birth date`}
										value={dateFormater(client.birthdate, false)}
										icon="fi fi-ss-cake-birthday"
									/>
									<Bullet
										styledText
										value={client.sex}
										icon={"fi fi-br-couple"}
									/>
									<Bullet
										styledText
										title={`${client.age} Years old`}
										value={`${client.age} Years old`}
										icon={"fi fi-ss-user"}
									/>
								</ul>
								<ul className="w-full flex gap-4">
									<Bullet
										styledText
										title={`registred on ${dateFormater(client.createdAt)}`}
										value={dateFormater(client.createdAt)}
										icon={"fi fi-sr-user-time"}
									/>
									<Bullet
										styledText
										sm={false}
										title={`${client.firstname} ${client.lastname} Health Point (HP) is: ${client.hp}`}
										label={client.hp + " HP"}
										icon={"fi fi-ss-pharmacy"}
									/>
								</ul>
							</div>
						</div>
					</header>

					{/* PERSONAL / PROFESSIONAL INFORMATIONS */}
					<Title title="Personal / Professional Informations" />
					<article className="w-full min-w-max flex flex-col gap-1 px-10">
						<div className="w-full flex gap-24">
							{/* social network informations */}
							<ul className="flex flex-col">
								<Bullet
									styledText
									title={`${client.firstname} ${client.lastname}, Phone`}
									value={client.phone}
									icon="fi fi-ss-smartphone"
									link={`tel:${client.phone}`}
								/>
								<Bullet
									styledText
									title={`${client.firstname} ${client.lastname}, WhatsApp Number`}
									value={client.phone}
									icon="fi fi-brands-whatsapp"
									link={whatsappLink(client.phone)}
								/>
							</ul>
							{/* professional informations */}
							<ul className="flex flex-col">
								<Bullet
									styledText
									title={`${client.firstname} ${client.lastname}, Email`}
									value={client.email}
									icon="fi fi-bs-at"
									link={`mailto:${client.email}`}
								/>
								<Bullet
									styledText
									title={`${client.firstname} ${client.lastname}, Job`}
									value={client.job}
									icon="fi fi-ss-briefcase"
								/>
							</ul>
						</div>
						<div className="" title={`${client.address}`}>
							<i className="fi fi-ss-map-marker text-yoga-green-dark mr-2"></i>
							<a href={`https://www.google.com/maps/search/?api=1&query=${client.address}`} className="hover:text-yoga-green hover:underline underline-offset-4 transition-all" target="_blank" rel="noreferrer">
								{client.address}
							</a>
						</div>
					</article>

					{/* MEDICAL INFORMATIONS */}
					<Title title="Medical Informations" />

					<article className="w-full min-w-max flex flex-col gap-4 pl-10">
						<ul className="w-full flex flex-col">
							<Bullet
								styledText
								sm={false}
								underline
								title={`${client.firstname} ${client.lastname}, Current care`}
								label="Current Care:"
								value={client.medicalhistory.currentcare}
							/>
							<Bullet
								type="stack"
								sm={false}
								underline
								title={`${client.firstname} ${client.lastname}, Current care informations`}
								label="Current Care Informations:"
								value={client.medicalhistory.currentcareinfo || "No Additional Informations"}
							/>
						</ul>
						<ul className="w-full flex flex-col">
							<Bullet
								styledText
								sm={false}
								underline
								title={`${client.firstname} ${client.lastname}, Medical record`}
								label="Medical Record:"
								value={client.medicalhistory.record}
							/>
							<Bullet
								type="stack"
								sm={false}
								underline
								title={`${client.firstname} ${client.lastname}, Medical record informations`}
								label="Medical Record Informations:"
								value={client.medicalhistory.recordinfo || "No Additional Informations"}
							/>
						</ul>
					</article>

					{/* PHYSICAL / MENTAL STATE */}
					<Title title="Physical / Mental State" />

					<article className="w-full min-w-max flex flex-col gap-1 pl-10">
						<ul className="w-full flex flex-col">
							<Bullet
								styledText
								sm={false}
								underline
								title={`${client.firstname} ${client.lastname}, Physical state`}
								label="Physical State:"
								value={client.physentalstate.physical.join(", ")}
							/>
							<Bullet
								styledText
								sm={false}
								underline
								title={`${client.firstname} ${client.lastname}, Mental state`}
								label="Mental State:"
								value={client.physentalstate.mental.join(", ")}
							/>
						</ul>
					</article>

					{/* LIFE RHYTHM */}
					<Title title="Life Rhythm" />

					<article className="w-full min-w-max flex gap-1 pl-10">
						<ul className="w-full flex flex-col">
							<Bullet
								styledText
								sm={false}
								title={`${client.firstname} ${client.lastname}, Sleep`}
								label="Sleep:"
								value={client.liferhythm.sleep}
								icon="fi fi-ss-moon"
							/>
							<Bullet
								styledText
								sm={false}
								title={`${client.firstname} ${client.lastname}, Nutrition`}
								label="Nutrition:"
								value={client.liferhythm.nutrition}
								icon="fi fi-sr-salad"
							/>
						</ul>
						<ul className="w-full flex flex-col">
							<Bullet
								styledText
								sm={false}
								title={`${client.firstname} ${client.lastname}, Sport`}
								label="Sport:"
								value={client.liferhythm.sport}
								icon="fi fi-ss-gym"
							/>
							<Bullet
								styledText
								sm={false}
								title={`${client.firstname} ${client.lastname}, Meditation`}
								label="Meditation:"
								value={client.liferhythm.meditation}
								icon="fi fi-sr-leaf"
							/>
						</ul>
					</article>

					{/* CONSULTATION REASON */}
					<Title title="Consultation Reason" />

					<p className="w-full min-w-max cinzel capitalize pl-10">
						{client.consultationreason || "Nothing Mentioned"}
					</p>

					<footer className="p-4 z-20 w-full min-w-max flex justify-center sm:justify-end items-center gap-5 print:hidden">
						<label htmlFor="clientidurl" title="download the client profile with client id url that will redirect to this client in the clients dashboard" className="flex justify-center items-center gap-1">
							<input
								id="clientidurl"
								type="checkbox"
								checked={withClientIDURL}
								onChange={() => setWithClientIDURL(!withClientIDURL)}
								className="h-4 w-4 accent-cyan-600 border border-yoga-red active:scale-90 transition-all"
							/>
							{" "}With Client Id URL
						</label>
						<button onClick={window.print} className="yoga-btn drop-shadow-lg group"><i className="fi fi-sr-file-pdf flex items-center justify-center mr-1 group-hover:text-yoga-green-dark transition-all"></i>{" "}Download</button>
					</footer>
				</section>
			</section>
		</>
	);
}
