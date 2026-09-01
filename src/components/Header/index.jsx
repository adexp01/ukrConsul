import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoEn from "../../assets/logo.svg";
import logoUk from "../../assets/logouk.svg";
import { useLanguage } from "../../i18n/LanguageContext";
import { ACTIVITIES_ENABLED, EVENTS_ENABLED } from "../../config/features";
import { useIsMobile } from "../../hooks/IsMobile";
import "./style.css";

// Порядок і склад — як у дизайні шапки.
// «Діяльність» веде на /office: це та сама сторінка з табами напрямів.
const NAV_ITEMS = [
  { key: "aboutUs", href: "/about-us" },
  { key: "getInvolved", href: "/join" },
  ...(ACTIVITIES_ENABLED
    ? [{ key: "activities", href: "/office", hasDropdown: true }]
    : []),
  { key: "media", href: "/media" },
  ...(EVENTS_ENABLED ? [{ key: "events", href: "/events" }] : []),
];

export const Header = () => {
  const { language, setLanguage, localizePath, t } = useLanguage();
  // Та сама межа, що й у CSS: до 1024 px меню вертикальне, з акордеоном
  const isNarrow = useIsMobile(1025);
  const logo = language === "uk" ? logoUk : logoEn;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  // Вгорі сторінки шапка прозора й зливається з фоном; щойно контент
  // починає під неї заходити — заливаємо її підкладкою
  const [isScrolled, setIsScrolled] = useState(false);

  const activitiesMenu = Array.isArray(t("header.activitiesMenu"))
    ? t("header.activitiesMenu")
    : [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);

    handleScroll(); // сторінку могли відкрити вже прокрученою
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`header${isScrolled ? " header--scrolled" : ""}`}>
      <div className="header__left">
        <Link to={localizePath("/")} className="header__logo" onClick={closeMenu}>
          <img src={logo} alt={t("header.logoAlt")} />
        </Link>

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
        aria-label={t("header.navLabel")}
      >
        <ul className="header__nav-list">
          {NAV_ITEMS.map((item) => {
            if (item.hasDropdown) {
              return (
                /*
                 * Ховер вішаємо тільки в широкій розкладці. Інакше на вузькому
                 * екрані з мишею (маленьке вікно на ноутбуці) виходило так:
                 * mouseenter відкривав панель, а клік одразу її закривав — і
                 * розкрити список у меню було неможливо.
                 */
                <li
                  key={item.key}
                  className={`header__nav-item header__nav-item--dropdown${
                    isActivitiesOpen ? " header__nav-item--open" : ""
                  }`}
                  {...(isNarrow
                    ? {}
                    : {
                        onMouseEnter: () => setIsActivitiesOpen(true),
                        onMouseLeave: () => setIsActivitiesOpen(false),
                      })}
                >
                  <Link
                    to={localizePath(item.href)}
                    className="header__nav-link header__nav-link--trigger"
                    aria-expanded={isActivitiesOpen}
                    aria-haspopup="true"
                    onClick={(event) => {
                      // У вузькій розкладці пункт працює як розкривач списку
                      if (isNarrow) {
                        event.preventDefault();
                        setIsActivitiesOpen((open) => !open);
                        return;
                      }

                      closeMenu();
                    }}
                  >
                    {t(`header.nav.${item.key}`)}
                  </Link>

                  <div className="header__dropdown">
                    <ul className="header__dropdown-list">
                      {activitiesMenu.map((menuItem) => (
                        <li key={menuItem.id}>
                          <Link
                            to={localizePath(menuItem.href)}
                            className="header__dropdown-link"
                            onClick={closeMenu}
                          >
                            {menuItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.key} className="header__nav-item">
                <Link
                  to={localizePath(item.href)}
                  className="header__nav-link"
                  onClick={closeMenu}
                >
                  {t(`header.nav.${item.key}`)}
                </Link>
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
