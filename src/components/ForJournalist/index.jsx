import { Button } from "../UI/Button";
import "./style.css";

const INTRO =
  "Our media team helps journalists find experts, receive comments, and work safely with topics related to the Ukrainian defence industry.";

const TOPICS = [
  "Comments on the state and development of the Ukrainian defence industry",
  "Explanation of legislative and regulatory changes for the defence industry",
  "International cooperation of Ukrainian manufacturers",
  "Participation of Ukrainian companies in exhibitions, forums, and B2B formats",
  "Analytics, data, and public materials of the Council",
  "Requests for interviews with manufacturers",
  "Participation in media projects of the Council",
];

export const ForJournalist = () => {
  return (
    <section className="for-journalist" aria-labelledby="for-journalist-title">
      <div className="for-journalist__inner">
        <header className="for-journalist__head">
          <h2 id="for-journalist-title" className="for-journalist__title">
            For journalists
          </h2>
          <p className="for-journalist__intro">{INTRO}</p>
        </header>

        <div className="for-journalist__panel">
          <span className="for-journalist__pill">
            You can contact us regarding:
          </span>

          <ul className="for-journalist__list">
            {TOPICS.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>

          <Button href="#" variant="default" className="for-journalist__cta">
            Write to us
          </Button>
        </div>
      </div>
    </section>
  );
};
