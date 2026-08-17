import { useMemo } from "react";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const MediaItemCard = ({ item, imagePlaceholder }) => {
  const isFeatured = item.layout === "featured";

  return (
    <article
      className={`media-item media-item--${item.layout}`}
      aria-labelledby={`media-item-title-${item.id}`}
    >
      <div className="media-item__media">
        <span className="media-item__media-placeholder">{imagePlaceholder}</span>
      </div>

      <div className="media-item__body">
        <span className="media-item__tag">{item.tag}</span>

        <h3 id={`media-item-title-${item.id}`} className="media-item__title">
          {item.title}
        </h3>

        <div className="media-item__text">
          {isFeatured ? (
            item.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))
          ) : (
            <p>{item.description}</p>
          )}
        </div>

        <Button href={item.href} variant="default" className="media-item__cta">
          {item.cta}
        </Button>
      </div>
    </article>
  );
};

export const MediaItems = () => {
  const { t } = useLanguage();

  const { featured, items } = useMemo(() => {
    const featuredData = t("media.items.featured");
    const telegram = t("media.items.telegram");
    const digest = t("media.items.digest");

    return {
      featured: {
        id: "zbroya-militarnyi",
        layout: "featured",
        ...featuredData,
        href: "#",
      },
      items: [
        { id: "telegram", layout: "card", ...telegram, href: "#" },
        { id: "digest", layout: "card", ...digest, href: "#" },
      ],
    };
  }, [t]);

  const imagePlaceholder = t("media.items.imagePlaceholder");

  return (
    <section className="media-items" aria-label={t("media.items.sectionAria")}>
      <MediaItemCard item={featured} imagePlaceholder={imagePlaceholder} />

      <div className="media-items__row">
        {items.map((item) => (
          <MediaItemCard
            key={item.id}
            item={item}
            imagePlaceholder={imagePlaceholder}
          />
        ))}
      </div>
    </section>
  );
};
