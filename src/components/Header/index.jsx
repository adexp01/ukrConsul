import { useState } from "react";
import logo from "../../assets/logo.png";
import "./style.css";

const NAV_ITEMS = [
  "About Us",
  "Get Involved",
  "Activities",
  "Media",
  "Events",
  "Contact",
];

export const Header = () => {
  const [language, setLanguage] = useState("en");

  return (
    <header className="header">
      <div className="header__left">
        <a href="/" className="header__logo">
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

      <nav className="header__nav" aria-label="Main navigation">
        <ul className="header__nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a href="#" className="header__nav-link">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
