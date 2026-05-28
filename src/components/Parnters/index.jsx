import { useLanguage } from "../../i18n/LanguageContext";
import partnersRow1 from "../../assets/partners1.svg";
import partnersRow2 from "../../assets/partners2.svg";
import "./style.css";

export const Parnters = () => {
  const { t } = useLanguage();
  const title = t("track.partners.title");

  return (
    <section className="partners" aria-labelledby="partners-title">
      <div className="partners__inner">
        <h2 id="partners-title" className="partners__title">
          {title}
        </h2>

        <div className="partners__rows">
          <div className="partners__marquee partners__marquee--top">
            <div className="partners__track partners__track--left">
              <img src={partnersRow1} alt="" className="partners__strip" draggable={false} />
              <img
                src={partnersRow1}
                alt=""
                className="partners__strip"
                draggable={false}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="partners__marquee partners__marquee--bottom">
            <div className="partners__track partners__track--right">
              <img src={partnersRow2} alt="" className="partners__strip" draggable={false} />
              <img
                src={partnersRow2}
                alt=""
                className="partners__strip"
                draggable={false}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
