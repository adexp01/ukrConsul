import mediaBannerImage from "../../assets/mediaBunner.png";
import "./style.css";

const DESCRIPTION =
  "We cover Ukraine's defence industry, the activities of the Gunsmiths' Council, key decisions for the sector, international cooperation, and projects that help Ukrainian manufacturers scale domestically and abroad.";

export const MediaBunner = () => {
  return (
    <section className="media-bunner" aria-labelledby="media-bunner-title">
      <div className="media-bunner__inner">
        <div className="media-bunner__head">
          <h1 id="media-bunner-title" className="media-bunner__title">
            Media
          </h1>
          <p className="media-bunner__desc">{DESCRIPTION}</p>
        </div>

        <div className="media-bunner__visual">
          <img src={mediaBannerImage} alt="" />
        </div>
      </div>
    </section>
  );
};
