import logoEn from "../../assets/logo.svg";
import logoUk from "../../assets/logouk.svg";
import { Button } from "../UI/Button";
import instagram from "../../assets/ins.svg";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import telegram from "../../assets/tg.svg";
import xIcon from "../../assets/x.svg";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/ucdi_official/",
    icon: instagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61573734720256",
    icon: facebook,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/105948600/admin/page-posts/published/",
    icon: linkedin,
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/DefenderMedia",
    icon: telegram,
  },
  { id: "x", label: "X", href: "https://x.com/UCDI_Official", icon: xIcon },
];

export const Footer = () => {
  const { t, localizePath, language } = useLanguage();
  const logo = language === "uk" ? logoUk : logoEn;
  const companyLinks = t("footer.companyLinks");

  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__cta" aria-label="Call to action">
          <h2 className="footer__cta-title">{t("footer.ctaTitle")}</h2>
          <Button
            href="mailto:official@ucdi.org.ua"
            variant="primary"
            className="footer__cta-button"
          >
            {t("footer.sendRequest")}
          </Button>
        </section>

        <div className="footer__main">
          <section className="footer__brand">
            <a href={localizePath("/")} className="footer__logo">
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
              <a href="tel:+380688764622" className="footer__contact-value">
                +38 068 876 46 22
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">{t("footer.copyright")}</p>
          <div className="footer__legal-links">
            <a href={localizePath("/privacy-policy")} className="footer__legal">
              {t("footer.privacy")}
            </a>
            <a href={localizePath("/terms")} className="footer__legal">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
