import Rating from '../components/Rating'
import { useEffect, useState } from "react";
import GreenMat from "../assets/imgs/spine/GreenMat.webp";
import Review from '../components/Review';
import Form from "./Form";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel, A11y } from 'swiper/modules';
import { reviewsFields } from "../utils";
import { useTranslation } from 'react-i18next';
import { useActivePage, useCurrentLanguage } from '../hooks';
import { addDoc, onSnapshot } from 'firebase/firestore';
import { collectionDB, document, fetchDocs } from '../firebase';

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

    const TFields = t(`${activePage}.reviews.form.fields`, {returnObjects: true});
    const TFieldsErrors = t(`${activePage}.reviews.form.fieldserrors`, {returnObjects: true});
  
    reviewsFields.forEach((field) => {
      field.placeholder = TFields[field.name.toLowerCase()] || field.placeholder;
      field.error = TFieldsErrors[field.name.toLowerCase()] || field.error;
      field.emptyError = t('contact.form.empty', {field: field.placeholder});
    });


    // submitting the review form to firebase collection called "reviews"
    const sendReview = async (reviewdata) => {
        try {
            await addDoc(collectionDB("reviews"), document({...reviewdata, rate, lang: currentLanguage.name}));
            setReviews([...reviews, reviewdata]);
            setThankPage(true);
        } catch (e) {
            console.error(e);
        }
    }

    // loading reviews from firebase collection called "reviews"
    useEffect(() => {
        (async () => {
            try {
                const reviewsRef = collectionDB("reviews");
                onSnapshot(fetchDocs(reviewsRef, 100), (querySnapshot) => {
                    setReviews(querySnapshot.docs.map(doc => doc.data()));
                });
            } catch (error) {
                console.log(error);
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

  
  return (
    <section id="reviews" className="container min-h-[400px] relative mt-14 py-8 flex flex-1 justify-center items-center flex-col gap-6 sm:mt-20 overflow-hidden" style={{backgroundImage: `url(${GreenMat})`}}>
    {isFormActive ? 
    <section className='w-full flex flex-1 justify-center items-center px-4'>
    {thankPage ?        
        <article className="w-full flex flex-1 justify-center items-center flex-col gap-4">
            <h1 className="cinzel sm:text-4xl text-3x text-center text-yoga-white font-bold uppercase">{t(`${activePage}.reviews.form.onSuccess`, {mr: reviewData.fullname})}</h1>
            <button onClick={() => setIsFormActive(false)} className="cinzel font-bold yoga-btn">{t("thankpage.btn")}</button>
        </article>
    :
        <Form
        title={"Add Your Review"}
        onSubmit={sendReview}
        insertElement={<Rating  className='h-8 w-8 cursor-pointer' rate={rate} setRate={setRate}/>}
        state={[reviewData, setReviewData]}
        fields={reviewsFields}
        sendBtn={t('contact.form.sendBtn')}
        resetBtn={t(`${activePage}.reviews.form.resetBtn`)}
        onEmpty={t('contact.form.onEmpty')}
        onReset={() => {setIsFormActive(false); setRate(5)}}
        />
    }
    </section> :

    <Swiper
    className="w-full h-full"
    modules={[Autoplay, Mousewheel, A11y]}
    a11y={{
        enabled: true, // enable A11y in other words Accessibility
    }}
    spaceBetween={30}
    grabCursor={true}
    content="center"

    centeredSlides={true}
    mousewheel={{
        invert: false,
    }}
    loop={true}
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
            slidesPerView: 3,
        },
        1024: {
            slidesPerView: 3,
        },
    }}
    >
    {
        reviews.map((review, index) => {
            return (
                <SwiperSlide key={index}>
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
    }
    {!isFormActive && <button onClick={() => setIsFormActive(true)} className="yoga-btn">{t(`${activePage}.reviews.btn`)}</button> }
    </section>
  )
}
