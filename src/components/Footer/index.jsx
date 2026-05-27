import logo from "../../assets/logo.png";
import { Button } from "../UI/Button";
import instagram from "../../assets/ins.svg";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import telegram from "../../assets/tg.svg";
import xIcon from "../../assets/x.svg";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "#", icon: instagram },
  { id: "facebook", label: "Facebook", href: "#", icon: facebook },
  { id: "linkedin", label: "LinkedIn", href: "#", icon: linkedin },
  { id: "telegram", label: "Telegram", href: "#", icon: telegram },
  { id: "x", label: "X", href: "#", icon: xIcon },
];

export const Footer = () => {
  const { t } = useLanguage();
  const companyLinks = t("footer.companyLinks");

  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__cta" aria-label="Call to action">
          <h2 className="footer__cta-title">{t("footer.ctaTitle")}</h2>
          <Button href="#" variant="primary" className="footer__cta-button">
            {t("footer.sendRequest")}
          </Button>
        </section>


        <div className="footer__main">
          <section className="footer__brand">
            <a href="/" className="footer__logo">
              <img src={logo} alt={t("header.logoAlt")} />
            </a>
            <p className="footer__tagline">{t("footer.tagline")}</p>
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

          <div className="footer__column footer__column--contacts">
            <h3 className="footer__column-title">{t("footer.contacts")}</h3>
            <div className="footer__contact-group">
              <p className="footer__contact-label">{t("footer.forContact")}</p>
              <a
                href="mailto:official@ucdi.org.ua"
                className="footer__contact-value"
              >
                official@ucdi.org.ua
              </a>
            </div>
            <div className="footer__contact-group">
              <p className="footer__contact-label">
                {t("footer.infoRequests")}
              </p>
              <a
                href="mailto:info@ucdi.org.ua"
                className="footer__contact-value"
              >
                info@ucdi.org.ua
              </a>
              <a href="tel:+380508329207" className="footer__contact-value">
                (050) 832 92 07
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">{t("footer.copyright")}</p>
          <div className="footer__legal-links">
            <a href="/privacy-policy" className="footer__legal">
              {t("footer.privacy")}
            </a>
            <a href="/terms" className="footer__legal">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
