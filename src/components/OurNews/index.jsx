import { useMemo, useState } from "react";
import { Article } from "../UI/Article";
import { Button } from "../UI/Button";
import "./style.css";

const FILTERS = [
  { id: "all", label: "All news" },
  { id: "gr", label: "GR" },
  { id: "export", label: "Export" },
  { id: "international", label: "International" },
  { id: "buildwithukraine", label: "BuildWithUkraine" },
  { id: "zbroyaexpo", label: "ZbroyaExpo" },
  { id: "investments", label: "Investments" },
  { id: "analytics", label: "Analytics" },
  { id: "events", label: "Events" },
];

const NEWS = [
  {
    id: 1,
    category: "export",
    tag: "Export",
    date: "2026-03-12",
    dateLabel: "March 12, 2026",
    title:
      "White Paper on changes in the defence industry: what solutions are already working for manufacturers",
    excerpt:
      "The Ukrainian Council of Defence Industry has prepared an analytical document, the White Paper on changes in the defence industry, outlining practical solutions for manufacturers.",
    bg: "#dde6ed",
  },
  {
    id: 2,
    category: "international",
    tag: "International",
    date: "2026-04-04",
    dateLabel: "April 04, 2026",
    title:
      "Two associations join the Gunsmiths' Council: UAV schools and maritime drones",
    excerpt:
      "Two new industry associations have joined the Ukrainian Council of Defence Industry: the Independent Association of UAV Schools and the Association of Maritime Drones.",
    bg: "#c8d4ea",
  },
  {
    id: 3,
    category: "gr",
    tag: "GR",
    date: "2026-04-30",
    dateLabel: "April 30, 2026",
    title:
      "A year of the Gunsmiths' Council: 300 manufacturers, 30+ regulatory decisions and new partnerships",
    excerpt:
      "On 25 February 2026, the Ukrainian Council of Defence Industry shared the results of its first year: 300+ manufacturers and dozens of sector reforms.",
    bg: "#97a7d8",
  },
];

export const OurNews = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const visibleNews = useMemo(() => {
    if (activeFilter === "all") return NEWS;
    return NEWS.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="our-news" aria-labelledby="our-news-title">
      <div className="our-news__inner">
        <header className="our-news__header">
          <h2 id="our-news-title" className="our-news__title">
            Our news
          </h2>

          <Button href="/media" variant="default" className="our-news__all-link">
            All news
          </Button>
        </header>

        <div
          className="our-news__filters"
          role="tablist"
          aria-label="News categories"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`our-news__filter${isActive ? " our-news__filter--active" : ""}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="our-news__grid" role="tabpanel">
          {visibleNews.map((item) => (
            <Article
              key={item.id}
              id={item.id}
              bg={item.bg}
              tag={item.tag}
              date={item.dateLabel}
              title={item.title}
              excerpt={item.excerpt}
              href={`/article/${item.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
