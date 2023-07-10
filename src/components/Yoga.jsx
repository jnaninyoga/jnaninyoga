
import IntersectedSection from '../layouts/IntersectedSection';
import YogaPose1 from '../assets/videos/yogapose-1.mp4';
import YogaPose2 from '../assets/videos/yogapose-2.mp4';
import YogaPose3 from '../assets/videos/yogapose-3.mp4';
// Video Posters
import YogaPose1Poster from '../assets/imgs/stock/yogapose-1.webp';
import YogaPose2Poster from '../assets/imgs/stock/yogapose-2.webp';
import YogaPose3Poster from '../assets/imgs/stock/yogapose-3.webp';

export default function Yoga() {
  return (
    <main  className="container w-screen sm:px-8 sm:py-6 flex flex-1 items-center justify-between flex-col my-14 sm:gap-48 gap-0 overflow-x-hidden">
        <IntersectedSection
          title='Yoga'
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque expedita libero eius error nesciunt itaque quaerat veritatis laboriosam corrupti. Veritatis voluptates qui voluptatum fuga, pariatur vero aliquam dolor excepturi corporis.
          Aliquam optio voluptas quo provident corporis commodi quod distinctio tempora debitis assumenda tenetur consequuntur sapiente est ab dicta, magni maiores sed, ut nesciunt voluptate iure. Explicabo sequi corporis repellat facere!
          Dolor blanditiis aperiam ipsum voluptas reprehenderit! Voluptates quo unde quas error eius? Qui ratione, culpa exercitationem odio quod a at molestiae. Reprehenderit iste id magnam sequi ipsa ratione iusto earum?"
          video={YogaPose1}
          alt='Yoga pose for stretching back and legs'
          poster={YogaPose1Poster}
        />
        <IntersectedSection
          title='Yoga'
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque expedita libero eius error nesciunt itaque quaerat veritatis laboriosam corrupti. Veritatis voluptates qui voluptatum fuga, pariatur vero aliquam dolor excepturi corporis.
          Aliquam optio voluptas quo provident corporis commodi quod distinctio tempora debitis assumenda tenetur consequuntur sapiente est ab dicta, magni maiores sed, ut nesciunt voluptate iure. Explicabo sequi corporis repellat facere!
          Dolor blanditiis aperiam ipsum voluptas reprehenderit! Voluptates quo unde quas error eius? Qui ratione, culpa exercitationem odio quod a at molestiae. Reprehenderit iste id magnam sequi ipsa ratione iusto earum?"
          video={YogaPose2}
          alt='Yoga pose for stretching back and legs'
          poster={YogaPose2Poster}
          reverse={true}
        />
        <IntersectedSection
          title='Yoga'
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque expedita libero eius error nesciunt itaque quaerat veritatis laboriosam corrupti. Veritatis voluptates qui voluptatum fuga, pariatur vero aliquam dolor excepturi corporis.
          Aliquam optio voluptas quo provident corporis commodi quod distinctio tempora debitis assumenda tenetur consequuntur sapiente est ab dicta, magni maiores sed, ut nesciunt voluptate iure. Explicabo sequi corporis repellat facere!
          Dolor blanditiis aperiam ipsum voluptas reprehenderit! Voluptates quo unde quas error eius? Qui ratione, culpa exercitationem odio quod a at molestiae. Reprehenderit iste id magnam sequi ipsa ratione iusto earum?"
          video={YogaPose3}
          alt='Yoga pose for stretching back and legs'
          poster={YogaPose3Poster}
        />
    </main>
  )
}
