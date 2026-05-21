import "./style.css";

const COLUMNS = [
  "The Ukrainian Council of Defence Industry develops media projects that help explain the role of the defence industry to society, partners and international audiences.",
  "We work to ensure that Ukraine's defence industry is understood not only as a production sector, but as part of the economy, technological development, international cooperation and security.",
];

export const MediaInfo = () => {
  return (
    <section className="media-info" aria-labelledby="media-info-title">
      <div className="media-info__glow" aria-hidden="true" />

      <div className="media-info__inner">
        <h2 id="media-info-title" className="media-info__title">
          <span>Media projects —</span>
          <span>how we tell the story</span>
          <span>of the defence industry</span>
        </h2>

        <div className="media-info__columns">
          {COLUMNS.map((text) => (
            <p key={text} className="media-info__text">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
