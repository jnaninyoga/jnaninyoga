
export default function Followers() {
  return (
    <ul className="flex w-full justify-center items-center gap-4 text-yoga-white opacity-70">
        <li>
            <a className="flex justify-center items-center gap-2" href="https://instagram.com/jnaninyoga" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
                <i className="flex justify-center items-center fi fi-brands-instagram text-yoga-white text-sm"></i>
                <h6 className="text-yoga-white text-sm">450 followers</h6>
            </a>
        </li>
        <li>
            <h6 className="text-yoga-white text-sm">&</h6>
        </li>
        <li>
            <a className="flex justify-center items-center gap-2" href="https://facebook.com/jnaninyoga" referrerPolicy="no-referrer" rel="noreferrer" target="_blank">
                <h6 className="text-yoga-white text-sm">140 likes</h6>
                <i className="flex justify-center items-center fi fi-brands-facebook text-yoga-white text-sm"></i>
            </a>
        </li>
    </ul>
  )
}
