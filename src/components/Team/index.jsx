import { useLanguage } from "../../i18n/LanguageContext";
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

        <div className="team__mosaic">
          {rows.map((row, rowIndex) => {
            const members = row.members ?? [];

            return members.map((member) => (
              <article
                key={member.id ?? member.name}
                className="team__member"
                style={{
                  "--team-col": member.column,
                  "--team-row": rowIndex + 1,
                }}
              >
                <div className="team__photo" aria-hidden="true">
                  {member.image ? (
                    <img
                      src={member.image}
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
                <h3 className="team__name">{member.name}</h3>
                <p className="team__role">{member.role}</p>
              </article>
            ));
          })}
        </div>
      </div>
    </section>
  );
};
