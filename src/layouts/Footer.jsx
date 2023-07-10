import logo from "../assets/imgs/spine/logo.webp"
import { Link } from "react-router-dom";
import { copyright } from "../utils";

export default function Footer() {
  return (
    <footer className="bg-yoga-white flex flex-col py-8 px-10 items-center justify-between bottom-0 mt-5">
      <h1 className="z-0 w-full sm:mb-4 mb-8 text-2xl sm:text-left text-center uppercase font-bold relative before:absolute before:h-1 sm:before:w-80 before:w-full before:bg-yoga-black sm:before:left-0 before:left-1/2 sm:before:translate-x-0 before:-translate-x-1/2 before:-bottom-2">Jnanin Yoga Studio</h1>
      <section className="container w-full font-medium flex justify-evenly items-center sm:flex-row flex-col gap-4">
        <ul className="sm:w-1/3 sm:order-1 order-4 cinzel flex flex-col sm:gap-2 gap-4" id="contactinfo">
          <li>
            <a className="flex items-start gap-4" href="https://goo.gl/maps/e4rGL1BPWrSXGZH77" title="espace essafwa, angle BD Yacoub El Mansour et, Bd Allal Al Fassi, Marrakesh" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-ss-marker"></i>
              <h4 className="uppercase underline-offset-4 underline">espace essafwa, angle BD Yacoub El Mansour et, Bd Allal Al Fassi, Marrakesh</h4>
            </a>
          </li>
          <li>
            <a className="flex items-start gap-4" href="tel:+212661286464" title="Phone Number" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-sr-phone-flip"></i>
              <h4 className="">212 661 286 464</h4>
            </a>
          </li>
          <li>
            <a className="flex items-start gap-4" href="mailto:contact@jnaninyoga.com" title="Contact Email" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-bs-at"></i>
              <h4 className="">contact@jnaninyoga.com</h4>
            </a>
          </li>
        </ul>
        <img className="h-40 sm:order-2 order-2" src={logo} alt="Jnanin Yoga Studio Logo" />
        {/* Social Media */}
        <ul className="sm:w-[14%] w-full sm:order-3 order-3 cinzel flex flex-col sm:gap-2 gap-4" id="socialmedia">
          <li>
            <a className="flex items-center gap-4" href="https://instagram.com/jnaninyoga" title="Instagram Page" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-instagram"></i>
              <h4 className="underline-offset-4 underline">@jnaninyoga</h4>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-4" href="https://facebook.com/jnaninyoga" title="Facebook Page" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-facebook"></i>
              <h4 className="underline-offset-4 underline">@jnaninyoga</h4>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-4" href="https://wa.me//212661286464" title="Whatsapp Contact" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-whatsapp"></i>
              <h4 className="underline-offset-4 underline">212 661 286 464</h4>
            </a>
          </li>
        </ul>       
        {/* Navigation */}
        <ul className="sm:w-1/12 order-1 sm:order-4 cinzel flex flex-col gap-2" id="navigaton">
          <li className="text-center sm:text-lg text-xl"><Link to="/" className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green uppercase`}>Home</Link></li>
          <li className="text-center sm:text-lg text-xl"><Link to="/about" className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green uppercase`}>About</Link></li>
          <li className="text-center sm:text-lg text-xl"><Link to="/contact" className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green uppercase`}>Contact</Link></li>
          <li className="text-center sm:text-lg text-xl"><Link to="/schedules" className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green uppercase`}>Schedules</Link></li>
        </ul>
      </section>
      <h6 className="mt-4 pt-4 w-screen text-center font-bold sm:text-base text-sm">{copyright("Jnanin Yoga")}</h6>
    </footer>
  )
}
