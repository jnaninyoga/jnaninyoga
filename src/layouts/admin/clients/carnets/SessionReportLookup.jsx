// === HOOKS ===

// === ASSETS ===
import logo from "../../../../assets/imgs/spine/logo.webp";

// === UTILS ===
import PropTypes from "prop-types";


SessionReportLookup.propTypes = {
  carnet: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
}

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

export default function SessionReportLookup({ report, carnet, client }) {
  return (
    <section className="relative h-[90%] w-[95%] md:w-[780px] md:h-[95%] flex flex-col gap-2 bg-yoga-white print:bg-white sm:overflow-x-hidden overflow-y-auto bg-texture texture-v-1 before:opacity-20 print:before:opacity-30 print:fixed print:left-0 print:top-0 print:h-screen print:w-screen">
      <section className="relative w-full min-w-max px-4 py-6 print:px-0 print:pr-5 print:py-4 flex items-center flex-col gap-8 print:gap-6">
        <header className="w-full pl-5 flex justify-start items-center gap-4">
          <div className="w-32 h-32 flex justify-center items-center aspect-square bg-cover bg-center">
            <img src={logo} alt="jnanin yoga client" className="w-[90%] h-[90%] object-cover object-center aspect-square" />
          </div>
          <div className="w-full min-w-max h-full flex flex-col justify-center gap-1">
            <h1 className={`text-4xl cinzel uppercase font-semibold`}>Session <span className="text-5xl text-yoga-green-dark">#{report.session}</span> Report</h1>
            <h3 className={`text-2xl cinzel uppercase font-semibold`}>For <span className="text-yoga-green-dark font-bold">{client.firstname} {client.lastname}</span>  Carnet: <span className="text-3xl text-yoga-green-dark font-bold">#{carnet.order}</span></h3>
          </div>
        </header>
      </section>
      
      { Object.keys(report.reports).length > 0 && Object.keys(report.reports).map(reportType => (
        <>
        <Title title={`${reportType} Health Report:`} />
        <article className="w-full min-w-max px-10 mb-4">
          { report.reports[reportType] }
        </article>
        </>
      ))}

      <footer className="absolute bottom-0 p-4 z-20 w-full min-w-max flex justify-center sm:justify-end items-center gap-5 print:hidden">
        <button onClick={window.print} className="yoga-btn drop-shadow-lg group"><i className="fi fi-sr-file-pdf flex items-center justify-center mr-1 group-hover:text-yoga-green-dark transition-all"></i>{" "}Download</button>
      </footer>
    </section>
  )
}
