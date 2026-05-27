import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
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
          <img src={logo} alt={t("header.logoAlt")} />
        </a>

        <div className="header__lang" role="group" aria-label={t("header.langLabel")}>
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
            className={`header__lang-btn${language === "uk" ? " header__lang-btn--active" : ""}`}
            onClick={() => setLanguage("uk")}
            aria-pressed={language === "uk"}
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
        <span className="header__menu-btn-text">{t("header.menu")}</span>
        <span className="header__menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      {isMenuOpen ? (
        <button
          type="button"
          className="header__backdrop"
          aria-label={t("header.closeMenu")}
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id="header-mobile-nav"
        className={`header__nav${isMenuOpen ? " header__nav--open" : ""}`}
        aria-label="Main navigation"
      >
        <ul className="header__nav-list">
          {["aboutUs", "getInvolved", "activities", "media", "events", "contact"].map((key) => (
            <li key={key}>
              <a
                href={
                  key === "aboutUs"
                    ? "/about-us"
                    : key === "getInvolved"
                      ? "/get-involved"
                      : key === "activities"
                        ? "/activities"
                        : key === "media"
                          ? "/media"
                          : key === "events"
                            ? "/events"
                            : "/contact"
                }
                className="header__nav-link"
                onClick={closeMenu}
              >
                {t(`header.nav.${key}`)}
              </a>
            </li>
          ))}
        </ul>

        <div
          className="header__lang header__lang--mobile"
          role="group"
          aria-label={t("header.langLabel")}
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
            className={`header__lang-btn${language === "uk" ? " header__lang-btn--active" : ""}`}
            onClick={() => setLanguage("uk")}
            aria-pressed={language === "uk"}
          >
            Ua
          </button>
        </div>
      </nav>
    </header>
  );
};
