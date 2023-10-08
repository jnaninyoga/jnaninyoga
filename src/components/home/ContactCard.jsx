import { useTranslation } from "react-i18next";
import Card from "../../layouts/client/shared/Card";
import { useActivePage } from "../../hooks";

export default function ContactCard() {
  const { t } = useTranslation();
  const activePage = useActivePage();
  const ContactMotivation = t(`${activePage}.contactcard`, { returnObjects: true });
  
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
