import logo from "../assets/imgs/spine/logo.webp"
import { Link } from "react-router-dom";
import { copyright, standardNavbar } from "../utils";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const navbar = t(`navbar`, { returnObjects: true });
  
  const Tnavbar = () => Array.isArray(navbar) ? navbar : standardNavbar;

  return (
    <footer className="bg-yoga-white flex flex-col py-8 px-10 items-center justify-between bottom-0 mt-5">
      <h1 className="z-0 w-full lg:mb-4 mb-8 lg:text-2xl sm:text-3xl text-2xl ltr:lg:text-left rtl:lg:text-right text-center uppercase font-bold relative before:absolute before:h-1 lg:before:w-80 before:sm:w-[70%] before:w-full before:bg-yoga-black ltr:lg:before:left-0 rtl:lg:before:right-0 before:left-1/2 lg:before:translate-x-0 before:-translate-x-1/2 before:-bottom-2">Jnanin Yoga Studio</h1>
      <section className="container w-full font-medium flex justify-evenly items-center lg:flex-row flex-col lg:gap-4 sm:gap-6 gap-4">
        <ul className="lg:w-1/3 lg:order-1 order-4 cinzel lg:text-base sm:text-xl flex sm:flex-col-reverse flex-col lg:items-start sm:items-center items-start lg:gap-2 gap-4" id="contactinfo">
          <li itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <a itemProp="url" className="flex items-start gap-4" href="https://goo.gl/maps/e4rGL1BPWrSXGZH77" title="espace essafwa, angle BD Yacoub El Mansour et, Bd Allal Al Fassi, Marrakesh" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-ss-marker"></i>
              <h4 className="uppercase sm:text-center lg:text-start underline-offset-4 underline">espace essafwa, angle BD Yacoub El Mansour et, Bd Allal Al Fassi, Marrakesh</h4>
            </a>
          </li>
          <li>
            <a itemProp="url" className="flex items-start gap-4" href="tel:+212661286464" title="Phone Number" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-sr-phone-flip"></i>
              <h4 className="">212 661 286 464</h4>
            </a>
          </li>
          <li>
            <a itemProp="url" className="flex items-start gap-4" href="mailto:contact@jnaninyoga.com" title="Contact Email" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-bs-at"></i>
              <h4 className="">contact@jnaninyoga.com</h4>
            </a>
          </li>
        </ul>
        <img className="h-40 lg:order-2 order-2" src={logo} alt="Jnanin Yoga Studio Logo" />
        {/* Social Media */}
        <ul className="lg:w-[14%] lg:text-base sm:text-xl w-full lg:order-3 order-3 cinzel flex lg:flex-col sm:flex-row flex-col sm:justify-center lg:items-start sm:items-center lg:gap-2 gap-4" id="socialmedia">
          <li>
            <a itemProp="url" className="flex items-center gap-4" href="https://instagram.com/jnaninyoga" title="Instagram Page" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-instagram"></i>
              <h4 className="underline-offset-4 underline">@jnaninyoga</h4>
            </a>
          </li>
          <li>
            <a itemProp="url" className="flex items-center gap-4" href="https://facebook.com/jnaninyoga" title="Facebook Page" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-facebook"></i>
              <h4 className="underline-offset-4 underline">@jnaninyoga</h4>
            </a>
          </li>
          <li>
            <a itemProp="url" className="flex items-center gap-4" href="https://wa.me//212661286464" title="Whatsapp Contact" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
              <i className="fi fi-brands-whatsapp"></i>
              <h4 className="underline-offset-4 underline">212 661 286 464</h4>
            </a>
          </li>
        </ul>       
        {/* Navigation */}
        <ul className="lg:w-1/12 order-1 lg:order-4 cinzel flex flex-col sm:items-center gap-2" id="navigaton">
          {Tnavbar().map((link, index) => (
            <li key={index} className="text-center lg:text-lg text-xl">
              <Link 
              to={link.toLowerCase() === navbar[0].toLowerCase() ? "/" : `/${standardNavbar[index].toLowerCase()}`}
              className={`relative transition-all before:transition-all before:absolute before:h-1 before:bg-yoga-red before:left-1/2 before:-translate-x-1/2 before:-bottom-1 hover:before:w-full hover:text-yoga-green uppercase`}>
              {link}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <h6 className="mt-4 pt-4 w-screen text-center font-bold lg:text-base sm:text-lg text-sm">{copyright("Jnanin Yoga")}</h6>
    </footer>
  )
}
