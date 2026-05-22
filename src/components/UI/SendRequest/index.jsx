import { Button } from "../Button";
import "./style.css";

const DESCRIPTION =
  "We will help you find an expert comment or materials on the Ukrainian defence industry, the Council's activities and its members.";

export const SendRequest = () => {
  return (
    <section className="send-request" aria-labelledby="send-request-title">
      <div className="send-request__backdrop" aria-hidden="true" />

      <div className="send-request__inner">
        <article className="send-request__card">
          <div className="send-request__glow" aria-hidden="true" />

          <div className="send-request__content">
            <h2 id="send-request-title" className="send-request__title">
              <span>Writing about</span>
              <span>Ukraine&apos;s defence industry?</span>
              <span>Contact us</span>
            </h2>

            <p className="send-request__text">{DESCRIPTION}</p>

            <Button href="#" variant="primary" className="send-request__cta">
              Send a media request
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};
