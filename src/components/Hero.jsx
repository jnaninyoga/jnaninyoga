import HeroBanner from '../assets/videos/jyero.mp4';
import Card from '../layouts/Card';
import { useTranslation } from 'react-i18next';
import { useActivePage } from '../hooks';

export default function Hero() {
  const { t } = useTranslation();
  const activePage = useActivePage();
  

  return (
    <section className='relative pt-14 sm:pt-16 flex flex-1 items-center justify-center flex-col'>
      <video role="banner" poster={"/assets/gallery/2.webp"} onContextMenu={e => e.preventDefault()} src={HeroBanner} muted loop autoPlay preload='auto' className='w-screen sm:h-[90vh] object-cover object-center pointer-events-none select-none'></video>
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
