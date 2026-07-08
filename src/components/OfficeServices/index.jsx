import icon1 from "../../assets/icon1.svg";
import icon2 from "../../assets/icon2.svg";
import icon3 from "../../assets/icon3.svg";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const icons = [icon1, icon2, icon3];

export const OfficeServices = () => {
  const { t } = useLanguage();
  const copy = t("office.services");

  return (
    <section className="office-services" aria-labelledby="office-services-title">
      <div className="office-services__inner">
        <h2 id="office-services-title" className="office-services__title">
          {copy.title}
        </h2>

        <div className="office-services__grid">
          {copy.items.map((item, index) => (
            <article key={item.title} className="office-services-card">
              <img
                src={icons[index]}
                alt=""
                className="office-services-card__icon"
                loading="lazy"
                decoding="async"
              />
              <h3 className="office-services-card__title">{item.title}</h3>
              <p className="office-services-card__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
