import { Button } from "../UI/Button";
import shield from "../../assets/shield.png";
import "./style.css";

const ORGANIZATIONS = [
  "DEFENSE ALLIANCE OF UKRAINE",
  "LEAGUE OF DEFENSE ENTERPRISES OF UKRAINE",
  "RADIOELECTRONIC ALLIANCE OF UKRAINE",
  "UKRAINIAN ROBOTIC FORCES",
  "TECHOSYSTEM DEFENSE",
  'ASSOCIATION OF MANUFACTURERS OF UAVS "ARMADA"',
  "ASSOCIATION OF MARITIME DRONES",
  "INDEPENDENT ASSOCIATION OF UAV SCHOOLS OF UKRAINE",
  "UCDI INVESTOR CLUB",
];

export const Info = () => {
  return (
    <section className="info-section" aria-labelledby="info-cta-title">
      <div className="info-section__inner">
        <div className="info-section__orgs">
          <div className="info-section__shield" aria-hidden="true">
            <img src={shield} alt="" />
          </div>

          <ul className="info-section__list">
            {ORGANIZATIONS.map((name) => (
              <li key={name} className="info-section__list-item">
                {name}
              </li>
            ))}
          </ul>
        </div>

        <article className="info-section__cta">
          <div className="info-section__cta-glow" aria-hidden="true" />

          <h2 id="info-cta-title" className="info-section__cta-title">
            <span>WANT TO JOIN</span>
            <span>THE GUNSMITHS</span>
            <span>COUNCIL</span>
            <span>ECOSYSTEM?</span>
          </h2>

          <p className="info-section__cta-text">
            Take a short test and find out which association or community suits
            you best.
          </p>

          <div className="info-section__cta-actions">
            <Button href="#" variant="primary">
              Take the test
            </Button>
            <a href="#" className="info-section__cta-link">
              Apply directly
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};
