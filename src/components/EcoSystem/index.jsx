import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import { getEcoSystemMemberImage } from "./memberImages";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const formatCounter = (index, total) =>
  `${String(index + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

export const EcoSystem = () => {
  const { t, language } = useLanguage();
  const copy = t("aboutUsPage.ecoSystem");
  const members = copy.members ?? [];
  const memberCount = members.length;

  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeMember = members[activeIndex] ?? members[0];
  const activeImage = getEcoSystemMemberImage(activeMember);
  const progress =
    memberCount > 1 ? (activeIndex / (memberCount - 1)) * 100 : 0;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || memberCount < 1) return undefined;

      const memberEls = gsap.utils.toArray(".eco-system__member", section);
      const mm = gsap.matchMedia();

      const bindMemberTriggers = (start, end) => {
        const setMember = (index) => setActiveIndex(index);
        setMember(0);

        return memberEls.map((el, index) =>
          ScrollTrigger.create({
            trigger: el,
            start,
            end,
            onEnter: () => setMember(index),
            onEnterBack: () => setMember(index),
          }),
        );
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setActiveIndex(0);
      });

      mm.add("(max-width: 1024px)", () => {
        const triggers = bindMemberTriggers("top 70%", "bottom 30%");
        return () => triggers.forEach((trigger) => trigger.kill());
      });

      mm.add("(min-width: 1025px)", () => {
        const triggers = bindMemberTriggers("top 52%", "bottom 48%");
        return () => triggers.forEach((trigger) => trigger.kill());
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [memberCount, language] },
  );

  if (memberCount === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="eco-system"
      aria-labelledby="eco-system-title"
    >
      <div className="eco-system__glow" aria-hidden="true" />

      <div className="eco-system__inner">
        <div className="eco-system__layout">
          <div className="eco-system__pinned">
            <div className="eco-system__intro">
              <h2 id="eco-system-title" className="eco-system__title">
                {copy.title}
              </h2>
              <p className="eco-system__lead">{copy.intro}</p>
            </div>

            <div className="eco-system__visual" aria-live="polite">
              {activeImage ? (
                <img
                  key={activeMember?.id ?? activeIndex}
                  className="eco-system__photo"
                  src={activeImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="eco-system__visual-placeholder">
                  <span>{copy.imagePlaceholder}</span>
                </div>
              )}
            </div>
          </div>

          <div
            className="eco-system__panel"
            style={{ "--eco-progress": `${progress}%` }}
          >
            <div className="eco-system__panel-fixed">
              <div className="eco-system__panel-head">
                <p
                  className="eco-system__counter"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="eco-system__counter-value">
                    {formatCounter(activeIndex, memberCount)}
                  </span>
                  <span className="eco-system__counter-name">
                    {activeMember?.name}
                  </span>
                </p>
                <div className="eco-system__rail" aria-hidden="true">
                  <span className="eco-system__rail-progress" />
                </div>
              </div>

              <div className="eco-system__panel-active" aria-live="polite">
                <span className="eco-system__focus">
                  <span
                    className="eco-system__focus-icon"
                    aria-hidden="true"
                  />
                  {copy.focusLabel}
                </span>
                <p className="eco-system__member-desc">
                  {activeMember?.description}
                </p>
              </div>
            </div>

            <div className="eco-system__members" role="list">
              {members.map((member, index) => {
                const isActive = activeIndex === index;
                const thumbSrc = getEcoSystemMemberImage(member);

                return (
                  <article
                    key={member.id ?? member.name}
                    role="listitem"
                    className={`eco-system__member${isActive ? " eco-system__member--active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div className="eco-system__member-head">
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
                      <div className="eco-system__member-titles">
                        <h3 className="eco-system__member-name">{member.name}</h3>
                        <p className="eco-system__member-role">{member.role}</p>
                      </div>
                    </div>

                    {isActive ? (
                      <div className="eco-system__member-detail eco-system__member-detail--mobile">
                        <span className="eco-system__focus">
                          <span
                            className="eco-system__focus-icon"
                            aria-hidden="true"
                          />
                          {copy.focusLabel}
                        </span>
                        <p className="eco-system__member-desc">
                          {member.description}
                        </p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
