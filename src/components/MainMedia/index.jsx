import { useState } from "react";
import { Button } from "../UI/Button";
import "./style.css";

const BOOTCAMP_TOPICS = [
  "How the defence industry ecosystem works in practice",
  "Regulatory decisions and their impact on manufacturers",
  "International cooperation and export opportunities",
  "Media, advocacy and reputation for defence companies",
];

export const MainMedia = () => {
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);

  return (
    <section className="main-media" aria-labelledby="main-media-title">
      <div className="main-media__inner">
        <article className="main-media__card">
          <div className="main-media__media" aria-hidden="true">
            <span className="main-media__media-placeholder">Image</span>
          </div>

          <div className="main-media__body">
            <div className="main-media__meta">
              <span className="main-media__tag">
                Educational format with Calibrated
              </span>
              <p className="main-media__date">
                <span className="main-media__date-label">
                  Start {"— June 2026"}
                </span>
              </p>
            </div>

            <h2 id="main-media-title" className="main-media__title">
              Deftech Media Bootcamp
            </h2>

            <p className="main-media__text">
              An intensive educational programme for defence industry
              professionals, communicators and ecosystem partners who want to
              understand how the sector works and how to tell its story
              effectively.
            </p>

            <div className="main-media__accordion-wrap">
              <button
                type="button"
                className="main-media__accordion"
                aria-expanded={isTopicsOpen}
                aria-controls="main-media-topics"
                onClick={() => setIsTopicsOpen((open) => !open)}
              >
                <span>During the bootcamp, participants explore:</span>
                <span className="main-media__accordion-icon" aria-hidden="true">
                  {isTopicsOpen ? "−" : "+"}
                </span>
              </button>

              {isTopicsOpen ? (
                <ul id="main-media-topics" className="main-media__topics">
                  {BOOTCAMP_TOPICS.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <p className="main-media__text main-media__text--secondary">
              The programme combines lectures, expert meetings, case studies and
              practical workshops — from ecosystem overview to communication
              tools for manufacturers and associations.
            </p>

            <Button href="#" variant="primary" className="main-media__cta">
              Apply
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};
