import { PageLayout } from "../../components/PageLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import { useSeo } from "../../seo/useSeo";

/*
 * Текст політики лежить у локалях (`privacyPolicy`), а не в цьому файлі.
 * Раніше він був зашитий тут українською, тому на /en/privacy-policy —
 * сторінці, посилання на яку є в футері кожної сторінки — англомовний
 * відвідувач бачив український документ.
 */

const isNumberedSectionTitle = (title) => /^\d+\.\s/.test(title);

export const PrivacyPolicyPage = () => {
  useSeo("privacyPolicy", { path: "privacy-policy" });

  const { t } = useLanguage();
  const copy = t("privacyPolicy");
  const sections = Array.isArray(copy.sections) ? copy.sections : [];

  return (
    <PageLayout>
      <article className="privacy-page">
        <div className="privacy-page__backdrop" aria-hidden="true" />

        <div className="privacy-page__shell">
          <div className="privacy-page__frame">
            <div className="privacy-page__glow" aria-hidden="true" />

            <div className="privacy-page__gutter" aria-hidden="true" />

            <div className="privacy-page__main">
              <h1 className="privacy-page__title">{copy.title}</h1>

              <div className="privacy-page__content">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    className="privacy-page__section"
                    aria-labelledby={
                      section.title ? `privacy-${section.id}` : undefined
                    }
                  >
                    {section.title ? (
                      <h2
                        id={`privacy-${section.id}`}
                        className={`privacy-page__section-title${
                          isNumberedSectionTitle(section.title)
                            ? " privacy-page__section-title--main"
                            : " privacy-page__section-title--sub"
                        }`}
                      >
                        {section.title}
                      </h2>
                    ) : null}

                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="privacy-page__text">
                        {paragraph}
                      </p>
                    ))}

                    {section.list ? (
                      <ul className="privacy-page__list">
                        {section.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}

                    {section.paragraphsAfter?.map((paragraph) => (
                      <p key={paragraph} className="privacy-page__text">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}
              </div>
            </div>

            <div className="privacy-page__gutter" aria-hidden="true" />
          </div>
        </div>
      </article>
    </PageLayout>
  );
};
