import PropsTypes from 'prop-types';
import { supportedLanguages } from '../utils';

Lookup.propTypes = {
    id: PropsTypes.string,
    author: PropsTypes.string,
    message: PropsTypes.string,
    email: PropsTypes.string,
    phone: PropsTypes.string,
    lang: PropsTypes.oneOf(supportedLanguages.map(lang => lang.name)),
    date: PropsTypes.string,
    status: PropsTypes.bool,
    statusDisplay: PropsTypes.string,
    // className: PropsTypes.string,
    succes: PropsTypes.string,
    abort: PropsTypes.string,
    forSucces: PropsTypes.func,
    forAbort: PropsTypes.func,
    insertElement: PropsTypes.node,
    details: PropsTypes.bool,
};

export default function Lookup({id, author, message, email, phone, lang, date, status, statusDisplay, succes, abort, forSucces, forAbort, insertElement, details=true}) {
  return (
    <section id={id} className='flex flex-col justify-center items-center p-6 gap-3 bg-yoga-white sm:w-[700px] w-[330px]'>
      <h4 className='cinzel sm:text-3xl text-2xl uppercase font-bold text-yoga-red-dark'>{author}</h4>

      <ul className='flex justify-center items-center gap-4 sm:flex-row flex-col'>
        <li className='flex items-center justify-center gap-2'><i className="flex items-center justify-center text-yoga-green-dark fi fi-ss-language"></i> <span>{lang}</span></li>
        <li className='flex items-center justify-center gap-2'><i className="flex items-center justify-center text-yoga-green-dark fi fi-sr-clock"></i> <span>{date}</span></li>
        {statusDisplay && <li className='flex items-center justify-center gap-2'>Status: <span className={`uppercase ${status ? "text-yoga-green-dark":"text-yoga-red-dark"}`}>{statusDisplay}</span></li>}
      </ul>

      {insertElement && insertElement}

      <p dir={supportedLanguages.find(lng => lng.name.toLowerCase() === lang?.toLowerCase()).dir} className='p-2 sm:text-start text-center'>{message}</p>

      {details && (
        <ul className='flex w-full items-center justify-center gap-4 flex-col sm:flex-row'>
          <li className='flex items-center justify-center gap-2'>
            <i className="flex items-center justify-center text-yoga-green-dark fi fi-bs-at"></i>
            <a href={`mailto:${email}`}>{email}</a>
          </li>
          <li className='flex items-center justify-center gap-2'>
            <i className="flex items-center justify-center text-yoga-green-dark fi fi-sr-phone-flip"></i>
            <a href={`tel:${phone}`}>{phone}</a>
          </li>
          <li className='flex items-center justify-center gap-2'>
            <i className="flex items-center justify-center text-yoga-green-dark fi fi-brands-whatsapp"></i>
            <a href={`https://wa.me/${phone}`}>{phone}</a>
          </li>
        </ul>
      )}

      {(succes || abort) && (
        <div className="flex w-full justify-center items-center gap-4 sm:gap-8 pt-2">
          {succes && <button className={`cinzel text-center text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-green text-yoga-white outline-white hover:bg-yoga-green-dark active:scale-90 transition-all`} onClick={forSucces}>{succes}</button>}
          {abort && <button className={`cinzel text-center text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] bg-yoga-red outline-white hover:bg-yoga-red-dark active:scale-90 transition-all`} onClick={forAbort}>{abort}</button>}
        </div>
      )}
    </section>
  )
}
