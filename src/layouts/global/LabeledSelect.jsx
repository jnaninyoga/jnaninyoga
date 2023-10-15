import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import propTypes from "prop-types";

const LabeledSelect = memo(({ id, options, onSelect, label, defaultSelected, valueFormatter, menuStyle, optionStyle, })  => {
  const selection = useRef(typeof defaultSelected === "number"? options[defaultSelected] : options.find((option) => option === defaultSelected));
	const [dropdownMenu, setDropdownMenu] = useState(false);
	const dropdownRef = useRef(null);
	const optionRef = useRef();
	const cid = useId();

  const handleSelect = useCallback((option) => {
		selection.current = option;
		onSelect(option);
		setDropdownMenu(false);
	}, [onSelect]);

	const hideDropdownMenu = useCallback((e) => {
		if (dropdownRef.current && e.target.id !== id && !dropdownRef.current.contains(e.target)) {
			setDropdownMenu(false);
		}
	}, [id]);

	// adding keyboard navigation
	const keyboardNavigation = useCallback((e) => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			const index = options.indexOf(selection.current);
			const nextIndex = e.key === "ArrowDown" ? (index + 1) % options.length : (index - 1 + options.length) % options.length;
			selection.current = options[nextIndex];
			onSelect(selection.current);
			// scroll into view of the selected option
			nextIndex > 3 ? dropdownRef.current.scrollTo(0, (nextIndex - 3) * optionRef.current.offsetHeight) : dropdownRef.current.scrollTo(0, 0);
		}
	}, [options, onSelect]);

	useEffect(() => {
		window.addEventListener("click", hideDropdownMenu);
		return () => window.removeEventListener("click", hideDropdownMenu);
	}, [dropdownMenu, hideDropdownMenu]);

	return (
		<div className="relative form-field w-full flex items-center">
      <label htmlFor={id || cid} className="cinzel h-full cursor-pointer">{label}</label>
      <span className="font-bold text-xl text-center mx-1 mb-1 flex justify-center items-center">:</span>
			<button type="button" id={id || cid} onKeyDown={keyboardNavigation} onClick={() => setDropdownMenu(!dropdownMenu)} className={`${menuStyle} px-3 cinzel h-full text-yoga-green-dark text-center text-sm sm:text-base font-semibold uppercase flex justify-center items-center gap-3 transition-all`}>
				
				{(valueFormatter ? valueFormatter(selection.current) : selection.current) || label}

				<svg className={`w-6 ${dropdownMenu && "rotate-180"} text-yoga-green pointer-events-none transition-all`} aria-hidden="true" fill="none" stroke="#8CC9D2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
				</svg>
			</button>
			<ul ref={dropdownRef} className={`absolute ${ dropdownMenu ? "top-[80%] opacity-100" : "opacity-0 top-[180%] pointer-events-none"} right-4 z-[40] max-h-48 min-w-[150px] w-[50%] drop-shadow-lg bg-yoga-white p-1 flex items-center flex-col outline outline-2 -outline-offset-[5px] outline-[var(--yoga-red)] transition-all overflow-y-auto overflow-x-hidden`}>
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
});

LabeledSelect.displayName = "LabeledSelect";

LabeledSelect.propTypes = {
	id: propTypes.string,
	options: propTypes.arrayOf(propTypes.string).isRequired,
	onSelect: propTypes.func.isRequired,
	label: propTypes.string.isRequired,
	// default selected option is eaither the index of the option or the option itself (string)
	defaultSelected: propTypes.oneOfType([propTypes.number, propTypes.string]),
	valueFormatter: propTypes.func,
	menuStyle: propTypes.string,
	optionStyle: propTypes.string,
};

export default LabeledSelect;
