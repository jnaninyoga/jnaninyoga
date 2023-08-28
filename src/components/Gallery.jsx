import { useRef } from "react"
import { useTranslation } from "react-i18next";
import { useActivePage, useIntersectView } from "../hooks";
import Icon from "../assets/svg";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay, Mousewheel, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/a11y';

export default function Gallery() {
    const { t } = useTranslation();
    const activePage = useActivePage();

    const gallery = useRef(null);
    const isGalleryIntersected = useIntersectView(gallery)

  return (
    <section ref={gallery} itemProp="gallery" itemScope className="w-screen px-4 py-6 flex flex-1 justify-center items-center flex-col gap-4 bg-yoga-white bg-texture texture-v sm:texture-h overflow-hidden">
        <div className={`${isGalleryIntersected ? "scale-1" : "scale-0"} h-14 w-24 flex items-center justify-between transition-all duration-300 select-none z-20`}>
            <Icon
                label="Lotus"
                colors={{oc: "#ffffff", pc: "#ffb2a3"}}
                height={100}
                width={100}
            />
        </div>
        <h2 className={`${isGalleryIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} cinzel lg:text-4xl sm:text-3xl text-2xl font-bold uppercase text-center transition-all duration-500 z-20`}>{t(`${activePage}.gallery`)}</h2>
        <Swiper
            effect="coverflow"
            modules={[EffectCoverflow, Pagination, Autoplay, Mousewheel, A11y]}
            className="mt-2 w-full h-fit"
            role="presentation"
            wrapperTag='ul'
            loop
            grabCursor
            centeredSlides
            content="center"
            spaceBetween={30}
            slidesPerView={'auto'}
            pagination={{
                clickable: true,
                dynamicBullets: true,
                bulletClass: 'swiper-pagination-bullet bg-yoga-red-dark',
            }}
            autoplay={{ 
                delay: 3000 ,
                pauseOnMouseEnter: true, 
            }}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            a11y={{
                enabled: true, // enable A11y in other words Accessibility
            }}
        >
        {[...Array(8)].map((_, i) => (
            <SwiperSlide key={i} tag='li' className="sm:max-h-[400px] sm:max-w-[400px]">
                <img src={`/assets/gallery/${i+1}.webp`} role="slider" onContextMenu={e => e.preventDefault()} className={`h-full w-full object-contain select-none`} alt="Yoga Gallery Photo" />
            </SwiperSlide>
        ))}
        </Swiper>
    </section>
  )
}
