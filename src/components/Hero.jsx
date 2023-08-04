import HeroBG from '../assets/imgs/stock/yogapose.webp';
import Card from '../layouts/Card';
import { useTranslation } from 'react-i18next';
import { useActivePage } from '../hooks';

export default function Hero() {
  const { t } = useTranslation();
  const activePage = useActivePage();
  

  return (
    <section className='relative flex flex-1 items-center justify-center flex-col'>
        <img className='trany w-screen h-full object-cover object-center select-none' src={HeroBG} alt="Yoga Position" />
        <Card 
        twStyle={'sm:-translate-y-28 -translate-y-14'} 
        title={t(`${activePage}.hero.title`)}
        text={t(`${activePage}.hero.text`)}
        btn={t(`booknow.title`)}
        linkTo='/booknow'
        />
    </section>
  )
}
