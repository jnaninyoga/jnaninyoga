import { useCallback, useEffect, useId, useRef, useState } from "react";
import propTypes from "prop-types";

DropdownMenu.propTypes = {
	id: propTypes.string,
	options: propTypes.arrayOf(propTypes.string).isRequired,
	onSelect: propTypes.func.isRequired,
	placeholder: propTypes.string.isRequired,
	// default selected option is eaither the index of the option or the option itself (string)
	defaultSelected: propTypes.oneOfType([propTypes.number, propTypes.string]),
	valueFormatter: propTypes.func,
	menuStyle: propTypes.string,
	optionStyle: propTypes.string,
	debug: propTypes.bool,
};

export default function DropdownMenu({id, options, onSelect, placeholder, defaultSelected, valueFormatter, menuStyle, optionStyle, debug=false }) {
	const selection = useRef(typeof defaultSelected === "number"? options[defaultSelected] : options.find((option) => option === defaultSelected));
	const [dropdownMenu, setDropdownMenu] = useState(false);
	const dropdownRef = useRef(null);
	const optionRef = useRef();
	const cid = useId();

	const dropdownMenuStatus = () => {
		setDropdownMenu(!dropdownMenu);
		debug && console.log(`Drop down menu is: ${dropdownMenu ? "open" : "closed"}; `, dropdownMenu);
	};

	const handleSelect = useCallback((option) => {
		debug && console.log("selected option:", option);
		selection.current = option;
		onSelect(option);
		setDropdownMenu(false);
	}, [debug, onSelect]);

	const hideDropdownMenu = useCallback((e) => {
		debug && console.log("hideDropdownMenu:", { id: id || cid, target: e.target, dropdownRef: dropdownRef.current });
		if (dropdownRef.current && e.target.id !== (id || cid) && !dropdownRef.current.contains(e.target)) {
			setDropdownMenu(false);
		}
	}, [id, cid, debug]);

	// adding keyboard navigation
	const keyboardNavigation = useCallback((e) => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			const index = options.indexOf(selection.current);
			const nextIndex = e.key === "ArrowDown" ? (index + 1) % options.length : (index - 1 + options.length) % options.length;
			selection.current = options[nextIndex];
			debug && console.log("selected option:", selection.current);
			onSelect(selection.current);
			// scroll into view of the selected option
			nextIndex > 3 ? dropdownRef.current.scrollTo(0, (nextIndex - 3) * optionRef.current.offsetHeight) : dropdownRef.current.scrollTo(0, 0);
		}
	}, [debug, options, onSelect]);

	useEffect(() => {
		window.addEventListener("click", hideDropdownMenu);
		return () => window.removeEventListener("click", hideDropdownMenu);
	}, [dropdownMenu, hideDropdownMenu]);

	return (
		<div className="relative w-full flex justify-center items-center z-[80]">
			<button type="button" id={id || cid} onKeyDown={keyboardNavigation} onClick={dropdownMenuStatus} className={`${menuStyle ?? ''} cinzel w-full flex justify-center items-center gap-3 text-center bg-yoga-red text-sm sm:text-base font-semibold uppercase px-3 py-3 outline outline-2 -outline-offset-[7px] outline-white focus:contrast-[1.20] hover:contrast-[1.20] ${dropdownMenu && "contrast-[1.20]"} transition-all`}>
				
				{(valueFormatter ? valueFormatter(selection.current) : selection.current) || placeholder}

				<svg className={`w-6 ${dropdownMenu && "rotate-180"} transition-all`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
				</svg>
			</button>
			<ul ref={dropdownRef} className={`absolute ${ dropdownMenu ? "top-[80%] opacity-100" : "opacity-0 top-[180%] pointer-events-none"} left-1/2 -translate-x-1/2 z-[100] max-h-48 min-w-[150px] w-max drop-shadow-lg bg-yoga-white p-1 flex items-center flex-col outline outline-2 -outline-offset-[5px] outline-[var(--yoga-red)] transition-all overflow-y-auto overflow-x-hidden`}>
				{options.map((option, index) => (
					<li
						ref={optionRef}
						role="option"
						key={index}
						value={option}
						className={`${optionStyle} cinzel w-full cursor-pointer text-center text-sm uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] ${selection.current == option ? "outline-white bg-yoga-green text-yoga-white" : "outline-gray-300 bg-white" } hover:outline-white hover:bg-yoga-green hover:text-yoga-white transition-all`}
						onClick={() => handleSelect(option)}
					>
					{valueFormatter ? valueFormatter(option) : option}
					</li>
				))}
			</ul>
		</div>
	);
}
