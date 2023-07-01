
import { useEffect } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import icon from '../assets/imgs/icons/lotus.png';
// import simple from '../assets/imgs/stock/yoga-3.jpg';
import YogaPose1 from '../assets/videos/yogapose-1.mp4';
import YogaPose2 from '../assets/videos/yogapose-2.mp4';
import YogaPose3 from '../assets/videos/yogapose-3.mp4';

// gsap.registerPlugin(ScrollTrigger);



export default function Yoga() {
  
  // const wrapper = useRef(null);
  // const lsimg1 = useRef(null);
  // const lsimg2 = useRef(null);
  // const rsimg = useRef(null);

  useEffect(() => {

    // doing a left to right animation
    // gsap.fromTo(lsimg2.current, {
    //   opacity: 0,
    //   x: -100,
    // }, {
    //   scrollTrigger: {
    //     trigger: lsimg2.current,
    //     start: 'top 50%', // 
    //     end: 'bottom 0%',
    //     toggleActions: 'play reverse play reverse',
    //   },
    //   opacity: 1,
    //   x: 0,
    //   duration: 1,
    // });

    // gsap.fromTo(lsimg1.current, {
    //   opacity: 0,
    //   x: -100,
    // }, {
    //   scrollTrigger: {
    //     trigger: wrapper.current,
    //     start: 'top 50%', // 
    //     end: 'bottom 0%',
    //     toggleActions: 'play reverse play reverse',
    //     // markers: true,
    //   },
    //   opacity: 1,
    //   x: 0,
    //   duration: 1,
    // });

    // gsap.fromTo(rsimg.current, {
    //   opacity: 0,
    //   x: 100,
    // }, {
    //   scrollTrigger: {
    //     trigger: rsimg.current,
    //     start: 'right 0%',
    //     end: 'right 80%',
    //     toggleActions: 'play reverse play reverse',
    //   },
    //   opacity: 1,
    //   x: 0,
    //   duration: 1,
    // });


  }, []);

  return (
    <main  className="container w-screen sm:px-8 flex flex-1 items-center justify-between flex-col my-14 sm:gap-48 gap-0">
        <section className='w-full h-[500px] flex flex-1 items-center justify-center flex-col sm:flex-row' id=''>
          {/* <img src={simple} className='sm:w-1/2 w-full sm:h-full h-[300px] max-h-[500px] max-w-screen-lg sm:shadow-yoga-green-sm shadow-yoga-green-mb sm:ml-14 object-cover object-center' alt="" /> */}
          <video data-aos="fade-left" src={YogaPose1} muted loop autoPlay preload='auto' className='sm:w-1/2 w-full sm:h-full h-[300px] max-h-[500px] max-w-screen-lg shadow-yoga-green sm:ml-14 object-cover object-center aspect-square' alt="Yoga pose for stretching hands" ></video>
          <div data-aos="fade-right" className='h-full sm:px-10 px-8 sm:py-12 py-8 sm:w-1/2 w-[92%] bg-yoga-white flex items-center sm:justify-start justify-center flex-col sm:gap-6 gap-4 sm:-translate-x-14 translate-x-0 sm:translate-y-0 -translate-y-24'>
            <div className='w-full flex items-center justify-start sm:flex-row flex-col sm:gap-4 gap-1'>
              <img src={icon} className='h-12 w-12' alt="Red/pink lotus icon" />
              <h2 className='text-2xl cinzel font-bold'>Yoga</h2>
            </div>
            <p className='sm:text-base text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque expedita libero eius error nesciunt itaque quaerat veritatis laboriosam corrupti. Veritatis voluptates qui voluptatum fuga, pariatur vero aliquam dolor excepturi corporis.
            Aliquam optio voluptas quo provident corporis commodi quod distinctio tempora debitis assumenda tenetur consequuntur sapiente est ab dicta, magni maiores sed, ut nesciunt voluptate iure. Explicabo sequi corporis repellat facere!
            Dolor blanditiis aperiam ipsum voluptas reprehenderit! Voluptates quo unde quas error eius? Qui ratione, culpa exercitationem odio quod a at molestiae. Reprehenderit iste id magnam sequi ipsa ratione iusto earum?</p>
          </div>
        </section>
        <section className='w-full h-[500px] flex flex-1 items-center justify-center flex-col sm:flex-row-reverse' id=''>
          {/* <img src={simple} className='sm:w-1/2 w-full sm:h-full h-[300px] max-h-[500px] max-w-screen-lg sm:shadow-yoga-green-sm shadow-yoga-green-mb sm:mr-14 object-cover object-center' alt="" /> */}
          <video src={YogaPose2} muted loop autoPlay preload='auto' className='sm:w-1/2 w-full sm:h-full h-[300px] max-h-[500px] max-w-screen-lg shadow-yoga-green-reverse sm:mr-14 object-cover object-center aspect-square' alt="Yoga pose for stretching hands and the back" ></video>
          <div className='h-full sm:px-10 px-8 sm:py-12 py-8 sm:w-1/2 w-[92%] bg-yoga-white flex items-center sm:justify-start justify-center flex-col sm:gap-6 gap-4 sm:translate-x-14 translate-x-0 sm:translate-y-0 -translate-y-24'>
            <div className='w-full flex items-center justify-start sm:flex-row flex-col sm:gap-4 gap-1'>
              <img src={icon} className='h-12 w-12' alt="Red/pink lotus icon" />
              <h2 className='text-2xl cinzel font-bold'>Yoga</h2>
            </div>
            <p className='sm:text-base text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque expedita libero eius error nesciunt itaque quaerat veritatis laboriosam corrupti. Veritatis voluptates qui voluptatum fuga, pariatur vero aliquam dolor excepturi corporis.
            Aliquam optio voluptas quo provident corporis commodi quod distinctio tempora debitis assumenda tenetur consequuntur sapiente est ab dicta, magni maiores sed, ut nesciunt voluptate iure. Explicabo sequi corporis repellat facere!
            Dolor blanditiis aperiam ipsum voluptas reprehenderit! Voluptates quo unde quas error eius? Qui ratione, culpa exercitationem odio quod a at molestiae. Reprehenderit iste id magnam sequi ipsa ratione iusto earum?</p>
          </div>
        </section>
        <section className='w-full h-[500px] flex flex-1 items-center justify-center flex-col sm:flex-row' id=''>
          {/* <img src={simple} className='sm:w-1/2 w-full sm:h-full h-[300px] max-h-[500px] max-w-screen-lg sm:shadow-yoga-green-sm shadow-yoga-green-mb sm:ml-14 object-cover object-center' alt="" /> */}
          <video src={YogaPose3} muted loop autoPlay preload='auto' className='sm:w-1/2 w-full sm:h-full h-[300px] max-h-[500px] max-w-screen-lg shadow-yoga-green sm:ml-14 object-cover object-center aspect-square' alt="Yoga pose for stretching back and legs" ></video>
          <div className='h-full sm:px-10 px-8 sm:py-12 py-8 sm:w-1/2 w-[92%] bg-yoga-white flex items-center sm:justify-start justify-center flex-col sm:gap-6 gap-4 sm:-translate-x-14 translate-x-0 sm:translate-y-0 -translate-y-24'>
            <div className='w-full flex items-center justify-start sm:flex-row flex-col sm:gap-4 gap-1'>
              <img src={icon} className='h-12 w-12' alt="Red/pink lotus icon" />
              <h2 className='text-2xl cinzel font-bold'>Yoga</h2>
            </div>
            <p className='sm:text-base text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque expedita libero eius error nesciunt itaque quaerat veritatis laboriosam corrupti. Veritatis voluptates qui voluptatum fuga, pariatur vero aliquam dolor excepturi corporis.
            Aliquam optio voluptas quo provident corporis commodi quod distinctio tempora debitis assumenda tenetur consequuntur sapiente est ab dicta, magni maiores sed, ut nesciunt voluptate iure. Explicabo sequi corporis repellat facere!
            Dolor blanditiis aperiam ipsum voluptas reprehenderit! Voluptates quo unde quas error eius? Qui ratione, culpa exercitationem odio quod a at molestiae. Reprehenderit iste id magnam sequi ipsa ratione iusto earum?</p>
          </div>
        </section>
    </main>
  )
}
