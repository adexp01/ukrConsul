import { Button } from "../UI/Button";
import "./style.css";

const STATS = [
  {
    id: "funds",
    description: "Private defence Venture funds investing in defence innovation",
    value: "20",
    position: "top-right",
  },
  {
    id: "companies",
    description: "Companies united in one defence ecosystem",
    value: "350+",
    position: "left",
  },
  {
    id: "schools",
    description: "UAV schools training the next generation",
    value: "28",
    position: "bottom",
  },
];

export const AboutUs = () => {
  return (
    <section className="about-us" aria-labelledby="about-us-title">
      <div className="about-us__glow" aria-hidden="true" />

      <div className="about-us__inner">
        <h2 id="about-us-title" className="about-us__title">
          <span>THE LARGEST</span>
          <span>ASSOCIATION OF PRIVATE</span>
          <span>ARMS</span>
          <span>MANUFACTURERS</span>
        </h2>

        {STATS.map((stat) => (
          <article
            key={stat.id}
            className={`about-us__card about-us__card--${stat.position}`}
          >
            <p className="about-us__card-desc">{stat.description}</p>
            <p className="about-us__card-value">{stat.value}</p>
          </article>
        ))}

        <Button href="#" className="about-us__cta">
          About us
        </Button>
      </div>
    </section>
  );
};
