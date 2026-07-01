import { useLanguage } from "../../i18n/LanguageContext";
import { getEcoSystemMemberImage } from "./memberImages";
import "./style.css";

export const EcoSystem = () => {
  const { t } = useLanguage();
  const copy = t("aboutUsPage.ecoSystem");
  const members = copy.members ?? [];
  const memberCount = members.length;

  if (memberCount === 0) return null;

  return (
    <section className="eco-system" aria-labelledby="eco-system-title">
      <div className="eco-system__glow" aria-hidden="true" />

      <div className="eco-system__inner">
        <div className="eco-system__intro">
          <h2 id="eco-system-title" className="eco-system__title">
            {copy.title}
          </h2>
          <p className="eco-system__lead">{copy.intro}</p>
        </div>

        <div className="eco-system__members" role="list">
          <article
            role="listitem"
            className="eco-system__member eco-system__member--focus"
          >
            <span className="eco-system__focus">
              <span className="eco-system__focus-icon" aria-hidden="true" />
              {copy.focusLabel}
            </span>
            <p className="eco-system__focus-text">{copy.focusDescription}</p>
          </article>

          {members.map((member) => {
            const thumbSrc = getEcoSystemMemberImage(member);

            return (
              <article
                key={member.id ?? member.name}
                role="listitem"
                className="eco-system__member"
              >
                <div className="eco-system__member-thumb" aria-hidden="true">
                  {thumbSrc ? (
                    <img
                      src={thumbSrc}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{copy.imagePlaceholder}</span>
                  )}
                </div>
                <h3 className="eco-system__member-name">{member.name}</h3>
                <p className="eco-system__member-role">{member.role}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
