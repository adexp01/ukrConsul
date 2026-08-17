import { Header } from "../Header";
import { Footer } from "../Footer";
import "./style.css";
import { Anima } from "../Anima";
import { useLocation } from "react-router-dom";
import { stripLocalePrefix } from "../../i18n/localeRoutes";

/*
 * Сторінки, де блок з кільцем і табами внизу не потрібен — у них свій фінальний
 * блок. Шлях порівнюємо повністю, а не через includes: у статті зі слагом на
 * «join-…» чи «media-…» адреса /en/article/join-… містила ці підрядки, і блок
 * зникав там, де мусив бути.
 */
const PAGES_WITHOUT_ANIMA = [
  "/events",
  "/about-us",
  "/join",
  "/media",
  "/office",
];

export const PageLayout = ({ children, variant }) => {
  const { pathname } = useLocation();

  const shouldHideAnima = PAGES_WITHOUT_ANIMA.includes(
    stripLocalePrefix(pathname),
  );

  const shellClass = variant
    ? `page-shell page-shell--${variant}`
    : "page-shell";
  const layoutClass = variant
    ? `page-layout page-layout--${variant}`
    : "page-layout";

  return (
    <div className={shellClass}>
      <div className="header-container">
        <Header />
      </div>
      <main className={layoutClass}>{children}</main>
      {!shouldHideAnima && (
        <div className="anima-wrap">
          <Anima />
        </div>
      )}
      <Footer />
    </div>
  );
};
