import Icon from "../assets/svg"
import OverLaped from "./OverLaped"

export default function Suspens() {
  return (
    <OverLaped>
      <section className="w-[90vw] flex flex-1 items-center justify-center flex-col">
        <Icon
          label="Lotus"
          src="https://cdn.lordicon.com/hvuelaml.json"
          colors={{oc: "#ffffff", pc: "#fdc5ba"}}
        />
        <h1 className="cinzel sm:text-8xl text-4xl text-yoga-white animate-pulse">Loading...</h1>
      </section>
    </OverLaped>
  )
}
