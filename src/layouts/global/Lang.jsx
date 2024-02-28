import {useRef, useState, useEffect} from 'react';
import { changeLanguage } from 'i18next';
import { supportedLanguages } from '../../utils';
import { useActivePage } from '../../hooks';
import { useNavigate } from 'react-router-dom/dist';

export default function Lang() {
    const [dropdown, setDropdown] = useState(false);
    const activePage = useActivePage();
    const navigteTo = useNavigate();
    const DropDown = useRef(null);
    const currentLang = localStorage.getItem("JY-lang") || "en";

    // hide dropdown when clicked outside
    const hideDropdown = e => {
        if (DropDown.current && e.target.id !== 'dropdownLang' && !DropDown.current.contains(e.target)) {
            setDropdown(false);
        }
    }

    const changeLang = lang => {
        changeLanguage(lang);
        setDropdown(false); // hide the dropdown
        navigteTo(`/${lang}${activePage === "home" ? '' : '/'+activePage}`);
    }


    // changing the document lang attr and dir based on the current language
    useEffect(() => {
        document.documentElement.lang = currentLang || "en";
        document.documentElement.dir = supportedLanguages.find(lang => lang.code === currentLang).dir || "ltr";
    }, [currentLang]);

    useEffect(() => {
        window.addEventListener('click', hideDropdown);
        // setting a timeout to close the dropdown when the client leave it open
        const timeout = setTimeout(() => {
            window.addEventListener('click', hideDropdown);
        }, 500);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('click', hideDropdown);
        }
    }, [dropdown]);

  return (
    <div className='relative'>
        <button id="dropdownLang" onClick={()=> setDropdown(!dropdown)} className= "font-medium text-xl px-2 py-1 text-center inline-flex items-center uppercase" type="button">{currentLang} <svg onClick={()=> setDropdown(!dropdown)} className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
        <ul ref={DropDown} id="dropdown" className={`px-4 sm:py-2 py-3 absolute flex flex-1 items-center justify-center sm:gap-2 gap-4 sm:flex-col left-1/2 -translate-x-1/2 sm:top-[100%] transition-all z-10  ${dropdown ? "":"hidden"} text-base bg-yoga-white divide-y divide-gray-100 drop-shadow-lg shadow-lg`}>
            {supportedLanguages.map((lang, i) => (
                <li key={i}><button className={`w-full ${lang.code === currentLang ? "text-yoga-green-darker":""} transition-all duration-150 hover:text-yoga-green`} onClick={() => changeLang(lang.code)} title={lang.name}>{lang.name}</button></li>
            ))}
        </ul>
    </div>
  )
}
