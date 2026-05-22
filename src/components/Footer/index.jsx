import logo from "../../assets/logo.png";
import { Button } from "../UI/Button";
import instagram from "../../assets/ins.svg";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import "./style.css";

const DIRECTIONS = [
  "Policy & Regulatory",
  "Internal Ecosystem Development",
  "Reputation, Trust & Advocacy",
  "International Representation",
  "Combat Feedback",
];

const COMPANY_LINKS = [
  "Home",
  "About us",
  "Get Involved",
  "Activities",
  "Media",
  "Events",
  "Contact",
];

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "#", icon: instagram },
  { id: "facebook", label: "Facebook", href: "#", icon: facebook },
  { id: "linkedin", label: "LinkedIn", href: "#", icon: linkedin },
];

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__cta" aria-label="Call to action">
          <h2 className="footer__cta-title">
            LET&apos;S EXPLORE WAYS TO INCREASE EFFICIENCY
          </h2>
          <Button href="#" variant="primary">
            Send a request
          </Button>
        </section>

        <div className="footer__divider" aria-hidden="true" />

        <div className="footer__content">
          <section className="footer__brand">
            <a href="/" className="footer__logo">
              <img src={logo} alt="Ukrainian Council of Defence Industry" />
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
              <h3 className="footer__column-title">Directions</h3>
              <ul className="footer__list">
                {DIRECTIONS.map((item) => (
                  <li key={item}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">Our company</h3>
              <ul className="footer__list">
                {COMPANY_LINKS.map((item) => (
                  <li key={item}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">Contacts</h3>
              <ul className="footer__contacts">
                <li>
                  <a href="mailto:info@ucdi.org.ua">info@ucdi.org.ua</a>
                </li>
                <li className="footer__contacts-muted">
                  Mazepy str. 23, Kyiv, Ukraine
                </li>
                <li>
                  <a href="tel:+380508329207">(050) 832 92 07</a>
                </li>
                <li className="footer__contacts-muted">
                  Mo-Th: 8:30 am – 5:00 pm
                </li>
                <li className="footer__contacts-muted">
                  Friday: 8:30 am – 2:00 pm
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">Copyright © 2026</p>
            <a href="/privacy-policy" className="footer__legal">
              Privacy Policy, Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
