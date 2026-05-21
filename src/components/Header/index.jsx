import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "./style.css";

const NAV_ITEMS = [
  { title: "About Us", to: "/about-us" },
  { title: "Get Involved", to: "/get-involved" },
  { title: "Activities", to: "/activities" },
  { title: "Media", to: "/media" },
  { title: "Events", to: "/events" },
  { title: "Contact", to: "/contact" },
];

export const Header = () => {
  const [language, setLanguage] = useState("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header__left">
        <a href="/" className="header__logo" onClick={closeMenu}>
          <img src={logo} alt="Ukrainian Council of Defence Industry" />
        </a>

        <div className="header__lang" role="group" aria-label="Language">
          <button
            type="button"
            className={`header__lang-btn${language === "en" ? " header__lang-btn--active" : ""}`}
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
          >
            En
          </button>
          <button
            type="button"
            className={`header__lang-btn${language === "ua" ? " header__lang-btn--active" : ""}`}
            onClick={() => setLanguage("ua")}
            aria-pressed={language === "ua"}
          >
            Ua
          </button>
        </div>
      </div>

      <button
        type="button"
        className="header__menu-btn"
        aria-expanded={isMenuOpen}
        aria-controls="header-mobile-nav"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="header__menu-btn-text">Меню</span>
        <span className="header__menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      {isMenuOpen ? (
        <button
          type="button"
          className="header__backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id="header-mobile-nav"
        className={`header__nav${isMenuOpen ? " header__nav--open" : ""}`}
        aria-label="Main navigation"
      >
        <ul className="header__nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.title}>
              <a
                href={`${item.to}`}
                className="header__nav-link"
                onClick={closeMenu}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        <div
          className="header__lang header__lang--mobile"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            className={`header__lang-btn${language === "en" ? " header__lang-btn--active" : ""}`}
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
          >
            En
          </button>
          <button
            type="button"
            className={`header__lang-btn${language === "ua" ? " header__lang-btn--active" : ""}`}
            onClick={() => setLanguage("ua")}
            aria-pressed={language === "ua"}
          >
            Ua
          </button>
        </div>
      </nav>
    </header>
  );
};
