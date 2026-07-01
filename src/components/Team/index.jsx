import { useLanguage } from "../../i18n/LanguageContext";
import { getTeamMemberImage } from "./memberImages";
import "./style.css";

export const Team = ({ contentKey = "aboutUsPage.team" }) => {
  const { t } = useLanguage();
  const copy = t(contentKey);
  const rows = copy.rows ?? [];

  if (rows.length === 0) return null;

  return (
    <section className="team" aria-labelledby="team-title">
      <div className="team__glow" aria-hidden="true" />

      <div className="team__inner">
        <h2 id="team-title" className="team__title">
          {copy.title}
        </h2>

        <div className="team__groups">
          {rows.map((row) => {
            const members = row.members ?? [];

            return (
              <section key={row.id} className="team__group">
                {row.title ? (
                  <h3 className="team__group-title">{row.title}</h3>
                ) : null}

                <div className="team__members">
                  {members.map((member) => {
                    const photoSrc = getTeamMemberImage(member);

                    return (
                      <article
                        key={member.id ?? member.name}
                        className="team__member"
                      >
                        <div className="team__photo" aria-hidden="true">
                          {photoSrc ? (
                            <img
                              src={photoSrc}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <span className="team__photo-placeholder">
                              {copy.imagePlaceholder}
                            </span>
                          )}
                        </div>
                        <h4 className="team__name">{member.name}</h4>
                        <p className="team__role">{member.role}</p>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
};
