import IntersectedSection from '../layouts/IntersectedSection';

import YogaPose1 from '../assets/videos/yogapose-1.mp4';
import YogaPose2 from '../assets/videos/yogapose-2.mp4';
import YogaPose3 from '../assets/videos/yogapose-3.mp4';
// Video Posters
import YogaPose1Poster from '../assets/imgs/stock/yogapose-1.webp';
import YogaPose2Poster from '../assets/imgs/stock/yogapose-2.webp';
import YogaPose3Poster from '../assets/imgs/stock/yogapose-3.webp';
import { useTranslation } from 'react-i18next';
import { activePage } from '../utils';

export default function Yoga() {
  const { t } = useTranslation();
  const yogamotivation = t(`${activePage()}.yogamotivation`, { returnObjects: true });
  const videos = [YogaPose1, YogaPose2, YogaPose3];
  const posters = [YogaPose1Poster, YogaPose2Poster, YogaPose3Poster];

  const TYogaMotivation = () => Array.isArray(yogamotivation) ? yogamotivation : [yogamotivation];

  return (
    <main  className="container w-screen sm:px-8 sm:py-6 flex flex-1 items-center justify-between flex-col my-14 sm:gap-48 gap-0 overflow-x-hidden">
      {TYogaMotivation().map((section, index) => (
        <IntersectedSection
          key={index}
          title={section.title}
          text={section.text || ""}
          video={videos[index]}
          alt={section.title}
          poster={posters[index]}
          reverse={index % 2 === 0}
        />
      ))}
    </main>
  )
}
