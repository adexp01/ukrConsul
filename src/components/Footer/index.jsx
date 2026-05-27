import logo from "../../assets/logo.png";
import { Button } from "../UI/Button";
import instagram from "../../assets/ins.svg";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "#", icon: instagram },
  { id: "facebook", label: "Facebook", href: "#", icon: facebook },
  { id: "linkedin", label: "LinkedIn", href: "#", icon: linkedin },
];

export const Footer = () => {
  const { t } = useLanguage();
  const directions = t("footer.directionsList");
  const companyLinks = t("footer.companyLinks");

  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__cta" aria-label="Call to action">
          <h2 className="footer__cta-title">{t("footer.ctaTitle")}</h2>
          <Button href="#" variant="primary">
            {t("footer.sendRequest")}
          </Button>
        </section>

        <div className="footer__divider" aria-hidden="true" />

        <div className="footer__content">
          <section className="footer__brand">
            <a href="/" className="footer__logo">
              <img src={logo} alt={t("header.logoAlt")} />
            </a>

            <div className="footer__socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className="footer__social-link"
                  aria-label={social.label}
                >
                  <img
                    src={social.icon}
                    alt=""
                    className="footer__social-icon"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </section>

          <div className="footer__columns">
            <div className="footer__column">
              <h3 className="footer__column-title">{t("footer.directions")}</h3>
              <ul className="footer__list">
                {directions.map((item) => (
                  <li key={item}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">{t("footer.ourCompany")}</h3>
              <ul className="footer__list">
                {companyLinks.map((item) => (
                  <li key={item}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">{t("footer.contacts")}</h3>
              <ul className="footer__contacts">
                <li>
                  <a href="mailto:info@ucdi.org.ua">info@ucdi.org.ua</a>
                </li>
                <li className="footer__contacts-muted">{t("footer.address")}</li>
                <li>
                  <a href="tel:+380508329207">(050) 832 92 07</a>
                </li>
                <li className="footer__contacts-muted">{t("footer.hoursWeek")}</li>
                <li className="footer__contacts-muted">{t("footer.hoursFriday")}</li>
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">{t("footer.copyright")}</p>
            <a href="/privacy-policy" className="footer__legal">
              {t("footer.privacy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
