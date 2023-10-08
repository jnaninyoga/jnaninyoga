import OverLaped from "./OverLaped"

export default function Suspens() {
  return (
    <OverLaped>
      <section className="w-[90vmin] py-4 flex flex-1 items-center justify-center flex-col gap-6">
        <div className="loader bg-yoga-red scale-[1.30]"></div>
        <h1 className="cinzel sm:text-8xl text-4xl text-yoga-white animate-pulse">Loading...</h1>
      </section>
    </OverLaped>
  )
}
