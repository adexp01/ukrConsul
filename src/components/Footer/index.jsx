import logo from "../../assets/logo.png";
import { Button } from "../UI/Button";
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
  { id: "instagram", label: "Instagram", href: "#" },
  { id: "facebook", label: "Facebook", href: "#" },
  { id: "linkedin", label: "LinkedIn", href: "#" },
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
                  {social.id === "instagram" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                  )}
                  {social.id === "facebook" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.3l.7-4H13V9c0-.6.4-1 1-1z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {social.id === "linkedin" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9h4v12H6V9zm2-6a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm4 6h4v1.7h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.6V21h-4v-6.2c0-1.5-.5-2.5-1.9-2.5-1 0-1.6.7-1.9 1.4-.1.3-.1.7-.1 1.1V21h-4V9z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
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
            <a href="#" className="footer__legal">
              Privacy Policy, Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
