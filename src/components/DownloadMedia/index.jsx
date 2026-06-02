import "./style.css";
import pdfIcon from "../../assets/pdfIcon.svg";
import zipIcon from "../../assets/zipIcon.svg";
import downloadIcon from "../../assets/downloadIcon.svg";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import { ButtonTest } from "../UI/ButtonTest";

const FILE_TYPES = ["PDF", "PDF", "ZIP"];

export const DownloadMedia = () => {
  const { t } = useLanguage();
  const files = t("media.download.files");

  return (
    <section className="download-media" aria-labelledby="download-media-title">
      <div className="download-media__inner">
        <header className="download-media__head">
          <h2 id="download-media-title" className="download-media__title">
            {t("media.download.title")}
          </h2>
          <p className="download-media__intro">{t("media.download.intro")}</p>
        </header>

        <span className="download-media__pill">{t("media.download.pill")}</span>

        <ul className="download-media__list">
          {files.map((file, index) => (
            <li key={file.title}>
              <a href="#" className="download-media__item">
                <span className="download-media__item-main">
                  <span className="download-media__type">
                    {FILE_TYPES[index] === "PDF" ? (
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
          <ButtonTest
            href="#"
            variant="primary"
            icon={
              <img
                src={downloadIcon}
                alt={t("media.download.downloadAlt")}
                className="download-media__icon"
              />
            }
          >
            {t("media.download.downloadZip")}
          </ButtonTest>
        </div>
      </div>
    </section>
  );
};
