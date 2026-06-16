import { useEffect, useState } from "react";
import logoEn from "../../assets/logo.svg";
import logoUk from "../../assets/logouk.svg";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const NAV_ITEMS = [
  // { key: "aboutUs", href: "/about-us" },
  // { key: "getInvolved", href: "/get-involved" },
  // { key: "activities", href: "/activities", hasDropdown: true },
  // { key: "media", href: "/media" },
  // { key: "events", href: "/events" },
  // { key: "contact", href: "/contact" },
];

export const Header = () => {
  const { language, setLanguage, localizePath, t } = useLanguage();
  const logo = language === "uk" ? logoUk : logoEn;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);

  const activitiesMenu = Array.isArray(t("header.activitiesMenu"))
    ? t("header.activitiesMenu")
    : [];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsActivitiesOpen(false);
  };

  return (
    <header className="header">
      <div className="header__left">
        <a href={localizePath("/")} className="header__logo" onClick={closeMenu}>
          <img src={logo} alt={t("header.logoAlt")} />
        </a>

        <div
          className="header__lang"
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
          {NAV_ITEMS.map((item) => {
            if (item.hasDropdown) {
              return (
                <li
                  key={item.key}
                  className={`header__nav-item header__nav-item--dropdown${
                    isActivitiesOpen ? " header__nav-item--open" : ""
                  }`}
                  onMouseEnter={() => setIsActivitiesOpen(true)}
                  onMouseLeave={() => setIsActivitiesOpen(false)}
                >
                  <a
                    href={item.href}
                    className="header__nav-link header__nav-link--trigger"
                    aria-expanded={isActivitiesOpen}
                    aria-haspopup="true"
                    onClick={(event) => {
                      if (window.matchMedia("(max-width: 1024px)").matches) {
                        event.preventDefault();
                        setIsActivitiesOpen((open) => !open);
                      } else {
                        closeMenu();
                      }
                    }}
                  >
                    {t(`header.nav.${item.key}`)}
                  </a>

                  <div className="header__dropdown">
                    <ul className="header__dropdown-list">
                      {activitiesMenu.map((menuItem) => (
                        <li key={menuItem.id}>
                          <a
                            href={localizePath(menuItem.href)}
                            className="header__dropdown-link"
                            onClick={closeMenu}
                          >
                            {menuItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.key} className="header__nav-item">
                <a
                  href={item.href}
                  className="header__nav-link"
                  onClick={closeMenu}
                >
                  {t(`header.nav.${item.key}`)}
                </a>
              </li>
            );
          })}
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
