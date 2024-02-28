import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { twMerge } from 'tailwind-merge';
import propTypes from "prop-types";

const LabeledSelect = memo(({ 
	id,
	options,
	onSelect,
	label,
	defaultSelected,
	valueFormatter,
	style = {
		wrapper: "",
		menu: "",
		option: "",
		label: "",
	},
	readOnly = false, // make the select read only
	})  => {

	// check if the options are an array of strings or an array of objects: {value: "value", title: "title"}
	const Options = useMemo(() => {
		if (typeof options[0] === "string") {
			return options.map((option) => ({ value: option, title: option }));
		}
		return options;
	}, [options]);


  const [selection, setSelection] = useState(Options.find((option) => option.value == defaultSelected));
	const [dropdownMenu, setDropdownMenu] = useState(false);
	const dropdownRef = useRef(null);
	const optionRef = useRef();
	const cid = useId();

	// watch when the defaultSelected changes
	useEffect(() => {
		if (defaultSelected) setSelection(Options.find((option) => option.value == defaultSelected));
	}, [Options, defaultSelected]);

  const handleSelect = (option) => {
		setSelection(option);
		onSelect(option.value);
		setDropdownMenu(false);
	};

	const hideDropdownMenu = useCallback((e) => {
		if (dropdownRef.current && e.target.id !== id && !dropdownRef.current.contains(e.target)) {
			setDropdownMenu(false);
		}
	}, [id]);

	// adding keyboard navigation
	const keyboardNavigation = useCallback((e) => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			const index = Options.findIndex((option) => option.value === selection.value);
			const nextIndex = e.key === "ArrowDown" ? (index + 1) % Options.length : (index - 1 + Options.length) % Options.length;
			setSelection(Options[nextIndex]);
			onSelect(selection.value);
			// scroll into view of the selected option
			nextIndex > 3 ? dropdownRef.current.scrollTo(0, (nextIndex - 3) * optionRef.current.offsetHeight) : dropdownRef.current.scrollTo(0, 0);
		}
	}, [Options, onSelect, selection]);

	useEffect(() => {
		window.addEventListener("click", hideDropdownMenu);
		return () => window.removeEventListener("click", hideDropdownMenu);
	}, [dropdownMenu, hideDropdownMenu]);

	return (
		<div className={twMerge("relative form-field w-full flex items-center", style.wrapper)}>
      <label htmlFor={id || cid} className={`cinzel h-full ${!readOnly && "cursor-pointer"}`}>{label}</label>
      <span className="font-bold text-xl text-center mx-1 mb-1 flex justify-center items-center">:</span>
			<button type="button" id={id || cid} onKeyDown={keyboardNavigation} onClick={() => !readOnly &&  setDropdownMenu(!dropdownMenu)} className={twMerge(`px-3 cinzel h-full text-yoga-green-dark text-center text-sm sm:text-base font-semibold uppercase flex justify-center items-center gap-3 transition-all ${!readOnly && "cursor-pointer"}`, style.label)}>
				
				{(valueFormatter ? valueFormatter(selection.value) : selection.value) || label}

				{ !readOnly && <svg className={`w-6 ${dropdownMenu && "rotate-180"} text-yoga-green pointer-events-none transition-all`} aria-hidden="true" fill="none" stroke="#8CC9D2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
				</svg>}
			</button>
			<ul ref={dropdownRef} className={twMerge(`absolute ${ dropdownMenu ? "top-[80%] opacity-100" : "opacity-0 top-[180%] pointer-events-none"} right-4 z-[40] max-h-48 min-w-[150px] w-[50%] drop-shadow-lg bg-yoga-white p-1 flex items-center flex-col outline outline-2 -outline-offset-[5px] outline-[var(--yoga-red)] transition-all overflow-y-auto overflow-x-hidden`, style.menu)}>
				{Options.map((option, index) => (
					<li
						ref={optionRef}
						role="option"
						key={index}
						title={option.title}
						value={option.value}
						className={twMerge(`cinzel w-full cursor-pointer text-center text-sm uppercase px-3 py-3 outline outline-2 -outline-offset-[5px] ${(selection.value == option.value) ? "outline-white bg-yoga-green text-yoga-white" : "outline-gray-300 bg-white" } hover:outline-white hover:bg-yoga-green hover:text-yoga-white transition-all`, style.option)}
						onClick={() => !readOnly && handleSelect(option)}
					>
					{valueFormatter ? valueFormatter(option.value) : option.value}
					</li>
				))}
			</ul>
		</div>
	);
});

LabeledSelect.displayName = "LabeledSelect";

LabeledSelect.propTypes = {
	id: propTypes.string,
	options: propTypes.oneOfType([
		propTypes.arrayOf(propTypes.string),
		propTypes.arrayOf(propTypes.shape({
			value: propTypes.string.isRequired,
			title: propTypes.string.isRequired,
		})),
]).isRequired,
	onSelect: propTypes.func.isRequired,
	label: propTypes.string.isRequired,
	// default selected option is eaither the index of the option or the option itself (string)
	defaultSelected: propTypes.string,
	valueFormatter: propTypes.func,
	style: propTypes.shape({
		wrapper: propTypes.string,
		menu: propTypes.string,
		option: propTypes.string,
		label: propTypes.string,
	}),
	readOnly: propTypes.bool,
};

export default LabeledSelect;