import { useRef } from 'react';
import Stars from "../../global/Stars";
import { useIntersectView } from '../../../hooks';
import LotusOverlay from "../../../assets/imgs/icons/lotusOverlayW.webp";
import PropsTypes from 'prop-types';

Review.propTypes = {
	author: PropsTypes.string,
	review: PropsTypes.string,
	rate: PropsTypes.number,
}

export default function Review({author="Anonymous", review, rate}) {
	const reviewRef = useRef(null);
	const isReviewIntersected = useIntersectView(reviewRef);

  return (
    <figure ref={reviewRef} className="flex justify-center items-center gap-4 flex-col">
			<figcaption className="flex justify-center items-center flex-col gap-4">
				<h3 className="cinzel text-center text-2xl font-bold text-yoga-white capitalize">{author}</h3>
				<Stars rate={rate}/>
        </figcaption>
        {review && <blockquote className="relative p-1">
					<img src={LotusOverlay} className={`${isReviewIntersected ? "opacity-20" : "opacity-0"} -z-20 max-w-[140px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center mix-blend-screen transition-all duration-700 delay-300`} alt="Lotus Overlay" />
					<p className="text-yoga-white sm:text-lg text-center z-10 sm:px-0 px-4">{review}</p>
        </blockquote>}
    </figure>
  )
}
