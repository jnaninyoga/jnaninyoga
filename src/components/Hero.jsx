import HeroBG from '../assets/imgs/stock/yogapose.webp';
import Card from '../layouts/Card';

export default function Hero() {
  return (
    <section className='relative flex flex-1 items-center justify-center flex-col'>
        <img className='w-screen h-full object-cover object-center select-none' src={HeroBG} alt="Yoga Position" />
        <Card twStyle={'-translate-y-14'} text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quam similique saepe iusto esse ipsa molestiae obcaecati laborum dolorem, sunt incidunt recusandae blanditiis provident sint. Cumque eveniet perspiciatis necessitatibus commodi." />
    </section>
  )
}
