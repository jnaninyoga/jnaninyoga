// === UTILS ===
import PropTypes from "prop-types";

SessionReportCard.propTypes = {
  onShow: PropTypes.func,
  report: PropTypes.shape({
    session: PropTypes.number.isRequired,
    reports: PropTypes.shape({
      mental: PropTypes.string,
      physical: PropTypes.string,
      spiritual: PropTypes.string,
      energetic: PropTypes.string,
      emotional: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default function SessionReportCard({ report, onShow=() => console.log("Carnet Card Clicked")}) {

  return (
    <article onClick={onShow} className={`relative pt-14 px-3 pb-5 h-72 w-60 flex items-center justify-between flex-col yoga-mate-texture rounded-md before:rounded-md cursor-pointer outline outline-2 -outline-offset-[10px] outline-[rgba(21,95,117,0.20)] outline-c shadow-md drop-shadow-md transition-all hover:scale-105 hover:shadow-lg hover:drop-shadow-lg print:bg-none print:before:hidden print:flex print:items-center print:justify-center`}>
      <div className={`ribbon-top-left ribbon-green`}>#S{report.session}</div>
      <h1 className="font-bold uppercase" title="Carnet ID">Session <span className="text-2xl text-yoga-green-dark">#{report.session}</span> Report</h1>
      <div className="z-[50] w-[85%] h-[3px] bg-cyan-800 opacity-20 rounded-full"></div>
      
      <div className="h-24 w-24 aspect-square flex items-center justify-center">
        <i className={`fi fi-sr-newspaper text-7xl text-yoga-green-dark`}></i>
      </div>

      <div className="z-[50] w-[85%] h-[3px] bg-cyan-800 opacity-20 rounded-full"></div>
      
      <h3 className="cinzel text-xs flex items-center justify-center text-centerl">
        <i className={`fi fi-sr-newspaper mr-2 text-yoga-green-dark flex items-center group-hover:text-yoga-green group-focus:text-yoga-green transition-all`}></i>
        <span className="mr-1 font-semibold text-gray-500">REPORTS: </span>
        <span className="font-semibold text-sm text-yoga-green-dark">{Object.keys(report.reports).filter(key => report.reports[key] !== "").length}/5</span>
      </h3>
    </article>
  )
}
