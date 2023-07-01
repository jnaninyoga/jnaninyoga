import HeroBG from '../assets/imgs/stock/yogapose.jpg';
import Card from '../layouts/Card';

export default function Hero() {
  return (
    <section className='relative flex flex-1 items-center justify-center flex-col'>
        <img className='w-screen h-full object-cover object-center select-none' src={HeroBG} alt="Yoga Position" />
        {/* <div className='py-6 px-6 w-[80%] flex items-center justify-between flex-col gap-2 -translate-y-14 bg-yoga-white texture-v sm:texture-h texture-opacity-80'>
            <div className='h-12 w-12 bg-center bg-cover' style={{backgroundImage: `url(${icon})`}}></div>
            <p className='cinzel text-center pb-2 sm:text-2xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quam similique saepe iusto esse ipsa molestiae obcaecati laborum dolorem, sunt incidunt recusandae blanditiis provident sint. Cumque eveniet perspiciatis necessitatibus commodi.</p>
        </div> */}
        <Card twStyle={'-translate-y-14'} text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quam similique saepe iusto esse ipsa molestiae obcaecati laborum dolorem, sunt incidunt recusandae blanditiis provident sint. Cumque eveniet perspiciatis necessitatibus commodi." />
    </section>
  )
}
