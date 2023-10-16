import PropTypes from "prop-types";
import { memo } from "react";

const Bullet = memo(({ type = "bullet", title, label, value, link, icon = false, styledText = false, sm = true, underline = false }) => {
	return (
		<li title={title} className={` ${type == "bullet" ? "flex" : "block"} pb-1`} >
			<label tabIndex={1} className={`cinzel relative outline-none group ${ sm && "text-sm" } font-semibold uppercase text-yoga-green-dark ${ type == "bullet" ? "flex items-center gap-1" : "inline-block" } ${ label && `before:transition-all before:absolute before:h-[2px] ${ underline ? "before:w-full" : "before:w-0"} before:bg-yoga-green-dark before:left-0 before:-bottom-[2px] hover:before:w-full hover:before:bg-yoga-green focus:before:w-full focus:before:bg-yoga-green`}`}>
				{icon && (<i className={`${icon} text-yoga-green-dark flex items-center group-hover:text-yoga-green group-focus:text-yoga-green transition-all`}></i>)}
				{label && (
					<span className={`cinzel text-yoga-green-dark group-hover:text-yoga-green group-focus:text-yoga-green transition-all`}>
            {label}
					</span>
				)}
			</label>
			{link ? (
				<a href={link} className={`${ styledText && "cinzel" } pl-2 outline-none hover:text-yoga-green focus:text-yoga-green hover:underline focus:underline underline-offset-4 transition-all`} target="_blank" rel="noreferrer">
					{value}
				</a>
			) : (
				<span className={`${styledText && "cinzel"} ${type !== "bullet" && "leading-relaxed"} pl-2 flex justify-center items-center`}>
          {value}
				</span>
			)}
		</li>
	);
});

Bullet.displayName = "Bullet";

Bullet.propTypes = {
	type: PropTypes.oneOf(["bullet", "stack"]),
	title: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
	label: PropTypes.string,
	link: PropTypes.string,
	icon: PropTypes.string,
	styledText: PropTypes.bool,
	sm: PropTypes.bool,
	underline: PropTypes.bool,
};

export default Bullet;