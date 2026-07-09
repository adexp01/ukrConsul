import { Header } from "../Header";
import { Footer } from "../Footer";
import "./style.css";
import { Anima } from "../Anima";
import { useLocation } from "react-router-dom";

export const PageLayout = ({ children, variant }) => {
  const { pathname } = useLocation();

  const shouldHideAnima =
    pathname.includes("/events") || pathname.includes("/about-us") || pathname.includes("/join") || pathname.includes("/media") || pathname.includes("/office");

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
