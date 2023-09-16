import Rating from '../components/Rating'
import { useEffect, useMemo, useRef, useState } from "react";
import GreenMat from "../assets/imgs/spine/GreenMat.webp";
import Icon from '../assets/svg';
import Review from '../components/Review';
import Form from "./Form";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y } from 'swiper/modules';
import { reviewsFields } from "../utils/form";
import { useTranslation } from 'react-i18next';
import { useActivePage, useCurrentLanguage, useIntersectView } from '../hooks';
import { onSnapshot, limit, where, orderBy } from "firebase/firestore";
import { addDocument, fetchDocs } from '../firebase';
import collections, { names } from '../firebase/collections';

// Styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/a11y';

export default function Reviews() {
    const { t } = useTranslation();
    const activePage = useActivePage();
    const currentLanguage = useCurrentLanguage();

    const [reviews, setReviews] = useState([]);
    const [reviewData, setReviewData] = useState({});
    const [rate, setRate] = useState(5);
    const [isFormActive, setIsFormActive] = useState(false);
    const [thankPage, setThankPage] = useState(false);
    const [error, setError] = useState(false);

    const reviewsRef = useRef(null);
    const isReviewsIntersected = useIntersectView(reviewsRef);

    const TFields = t(`${activePage}.reviews.form.fields`, {returnObjects: true});
    const TFieldsErrors = t(`${activePage}.reviews.form.fieldserrors`, {returnObjects: true});
  
    const ReviewsFields = useMemo(() => reviewsFields.map(field => {
        field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
        field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
        field.empty = t('GlobalForm.emptyField', {field: field.placeholder});
        return field;
    }), [TFields, TFieldsErrors, t]);

    // submitting the review form to firebase collection called "reviews"
    const sendReview = async (reviewdata) => {
        try {
            // clear the error message
            setError(false);
            // await addDoc(collections.reviews, document({...reviewdata, rate, lang: currentLanguage.name}));
            await addDocument(names.reviews, {...reviewdata, rate, lang: currentLanguage.name});
            if (reviewdata.rate >= 4) setReviews([...reviews, reviewdata]);
            setThankPage(true);
        } catch (e) {
            setError(true);
            console.error(e);
        }
    }

    // loading reviews from firebase collection called "reviews"
    useEffect(() => {
        (async () => {
            try {
                onSnapshot(fetchDocs(collections.reviews, where("rate", ">=", 4), orderBy("rate", "desc"), limit(100)), (querySnapshot) => {
                    setReviews(querySnapshot.docs.map(doc => doc.data()));
                });
            } catch (error) {
                console.error(error);
            }
        })()
    }, []);

    // set a timeout to close the form after 15 seconds
    useEffect(() => {
        if (!thankPage) return;
        const timeout = setTimeout(() => {
            setIsFormActive(false);
        }, 15000);
        return () => clearTimeout(timeout);
    }, [isFormActive, thankPage]);

    // effect to clear custom error messages
    useEffect(() => {
        if(!error) return
        const timeout = setTimeout(() => {
            setError(false);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [error]);

  
  return (
    <section id="reviews" className="w-screen min-h-[400px] relative mt-14 py-8 flex flex-1 justify-center items-center flex-col gap-6 sm:mt-20 overflow-hidden" style={{backgroundImage: `url(${GreenMat})`}}>
    {isFormActive ? 
    <section className='w-full flex flex-1 justify-center items-center px-4 flex-col'>
    {thankPage ?        
        <article className="w-full flex flex-1 justify-center items-center flex-col gap-4">
            <h1 className="cinzel sm:text-4xl text-3x text-center text-yoga-white font-bold uppercase">{t(`${activePage}.reviews.form.onSuccess`, {mr: reviewData.fullname})}</h1>
            <button onClick={() => setIsFormActive(false)} className="cinzel font-bold yoga-btn">{t("thankpage.btn")}</button>
        </article>
    :
        <Form
        animatedIcon
        title={"Add Your Review"}
        onSubmit={sendReview}
        state={[reviewData, setReviewData]}
        fields={ReviewsFields}
        submitBtn={t('contact.form.submitBtn')}
        resetBtn={t(`${activePage}.reviews.form.resetBtn`)}
        EmptyErrorMessage={t('GlobalForm.emptyFields')}
        ErrorMessage={t('GlobalError.text')}
        errorTrigger={error}
        onReset={() => {setIsFormActive(false); setRate(5)}}
        insertElement={<Rating  className='h-8 w-8 cursor-pointer' rate={rate} setRate={setRate}/>}
        />
    }
    </section> :
    <section ref={reviewsRef} className='w-full flex flex-1 justify-center items-center flex-col gap-12'>
        <div className='w-full flex justify-center items-center flex-col gap-4'>
            <div className={`${isReviewsIntersected ? "scale-1" : "scale-0"} h-14 w-24 flex items-center justify-between bg-[#ffb4b6]] transition-all select-none z-20`}>
                <Icon
                label="Lotus"
                colors={{oc: "#ffffff", pc: "#fdc5ba"}}
                height={100}
                width={100}
                />
            </div>
            <h2 className={`${isReviewsIntersected ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"} sm:w-1/2 w-[80%] text-yoga-white cinzel sm:text-4xl text-2xl font-bold uppercase text-center transition-all duration-500 relative before:absolute before:h-1 before:w-full before:bg-yoga-white  before:left-1/2  before:-translate-x-1/2 before:-bottom-2`}>{t(`${activePage}.reviews.title`)}</h2>
        </div>

    <Swiper
    className="w-full h-full"
    modules={[Autoplay, A11y]}
    loop
    grabCursor
    centeredSlides
    content="center"
    spaceBetween={30}
    autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    }}
    breakpoints={{
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    }}
    a11y={{
        enabled: true, // enable A11y in other words Accessibility
    }}
    wrapperTag='ul'
    >
    {
        reviews.map((review, index) => {
            return (
                <SwiperSlide key={index} tag='li'>
                    <Review 
                    author={review.fullname}
                    review={review.review}
                    rate={review.rate}
                    />
                </SwiperSlide>
            )
        })
    }
    </Swiper>
    </section>
    }
    {!isFormActive && <button onClick={() => setIsFormActive(true)} className="yoga-btn">{t(`${activePage}.reviews.btn`)}</button> }
    </section>
  )
}
