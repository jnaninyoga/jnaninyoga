import Card from "../layouts/Card";

export default function ContactCard() {
  return (
    <section className="container flex items-center justify-center">
        <Card
        twStyle={'-translate-y-20 sm:translate-y-10'}
        btn={'Contact'}
        linkTo={"/contact"}
        title="Keep Up with our sessions"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quam similique saepe iusto esse ipsa molestiae obcaecati laborum dolorem, sunt incidunt recusandae blanditiis provident sint. Cumque eveniet perspiciatis necessitatibus commodi." />
    </section>
  )
}
