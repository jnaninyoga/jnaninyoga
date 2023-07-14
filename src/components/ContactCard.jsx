import { useTranslation } from "react-i18next";
import Card from "../layouts/Card";
import { activePage } from "../utils";

export default function ContactCard() {
  const { t } = useTranslation();
  const ContactMotivation = t(`${activePage()}.contactcard`, { returnObjects: true });
  
  return (
    <section className="container flex items-center justify-center">
        <Card
        twStyle={'-translate-y-20 sm:translate-y-10'}
        btn={ContactMotivation.btn}
        linkTo={"/contact"}
        title={ContactMotivation.title}
        text={ContactMotivation.text} />
    </section>
  )
}
