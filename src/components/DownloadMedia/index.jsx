import "./style.css";
import pdfIcon from "../../assets/pdfIcon.svg";
import zipIcon from "../../assets/zipIcon.svg";
import downloadIcon from "../../assets/downloadIcon.svg";

const INTRO =
  "This section provides materials that help journalists and partners represent the Gunsmiths' Council accurately in public communication.";

const FILES = [
  {
    id: "overview",
    type: "PDF",
    title: "Brief overview of the Ukrainian Council of Defence Industry",
    meta: "2 pages",
    href: "#",
  },
  {
    id: "structure",
    type: "PDF",
    title: "Ecosystem structure guide",
    meta: "6 pages",
    href: "#",
  },
  {
    id: "brand-kit",
    type: "ZIP",
    title: "Council brand assets",
    meta: "SVG / PNG · 18 MB",
    href: "#",
  },
];

export const DownloadMedia = () => {
  return (
    <section className="download-media" aria-labelledby="download-media-title">
      <div className="download-media__inner">
        <header className="download-media__head">
          <h2 id="download-media-title" className="download-media__title">
            Media materials
          </h2>
          <p className="download-media__intro">{INTRO}</p>
        </header>

        <span className="download-media__pill">Available materials:</span>

        <ul className="download-media__list">
          {FILES.map((file) => (
            <li key={file.id}>
              <a href={file.href} className="download-media__item">
                <span className="download-media__item-main">
                  <span className="download-media__type">
                    {file.type === "PDF" ? (
                      <img src={pdfIcon} alt="PDF" />
                    ) : (
                      <img src={zipIcon} alt="ZIP" />
                    )}
                  </span>
                  <span className="download-media__item-title">
                    {file.title}
                  </span>
                </span>
                <span className="download-media__item-meta">{file.meta}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="download-media__actions">
          <a
            href="#"
            className="ui-button ui-button--primary download-media__zip"
          >
            <span className="ui-button__label">
              <span className="ui-button__label-inner">Download .zip</span>
            </span>
            <span className="ui-button__icon">
              <span className="ui-button__icon-inner" style={{ left: 2 }}>
                <img src={downloadIcon} alt="Download" />
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
