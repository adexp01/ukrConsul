import { Button } from "../UI/Button";
import "./style.css";

const FEATURED = {
  id: "zbroya-militarnyi",
  layout: "featured",
  tag: "Media project with Militarnyi",
  title: "Zbroya with Militarnyi",
  description: [
    "A joint media project of the Ukrainian Council of Defence Industry and Militarnyi that explains how the defence industry works, what challenges manufacturers face, and which solutions are already changing the sector.",
    "Through interviews, analytics and field stories, we show how private defence production becomes part of Ukraine's security and economic resilience.",
  ],
  cta: "Learn more",
  href: "#",
};

const ITEMS = [
  {
    id: "telegram",
    layout: "card",
    tag: "Telegram channel",
    title: "Zbroyari × Defender",
    description:
      "Operational updates, sector news and expert commentary on defence industry developments — in a format that is easy to follow day to day.",
    cta: "Subscribe",
    href: "#",
  },
  {
    id: "digest",
    layout: "card",
    tag: "Email / Monthly",
    title: "Gunsmiths' Council digest",
    description:
      "A monthly overview of key decisions, association updates, international cooperation and projects that help Ukrainian manufacturers scale.",
    cta: "Subscribe",
    href: "#",
  },
];

const MediaItemCard = ({ item }) => {
  const isFeatured = item.layout === "featured";

  return (
    <article
      className={`media-item media-item--${item.layout}`}
      aria-labelledby={`media-item-title-${item.id}`}
    >
      <div className="media-item__media">
        <span className="media-item__media-placeholder">Image</span>
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
  return (
    <section className="media-items" aria-label="Media projects">
      <MediaItemCard item={FEATURED} />

      <div className="media-items__row">
        {ITEMS.map((item) => (
          <MediaItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
