import { Header } from "../Header";
import { Footer } from "../Footer";
import "./style.css";
import { Anima } from "../Anima";

export const PageLayout = ({ children, variant }) => {
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
      <div className="anima-wrap">
        <Anima />
      </div>
      <Footer />
    </div>
  );
};
