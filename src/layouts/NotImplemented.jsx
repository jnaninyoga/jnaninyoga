import Card from "./Card";

export default function NotImplemented() {
  return (
    <section className="h-full py-12 w-screen flex items-center justify-center">
        <Card
        // twStyle={'-translate-y-0'}
        title="This page is not implemented yet 👨🏻‍💻👷🏻‍♂️⚒"
        text="It will be implemented soon. Please check back later."
        linkTo="/"
        btn="Go Back"
        />
    </section>
  )
}
