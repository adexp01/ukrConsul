import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../animation/gsapSetup";
import { useLanguage } from "../../i18n/LanguageContext";
import { hasDestination, isExternalUrl } from "../../utils/links";
import { ACTIVITIES_ENABLED } from "../../config/features";
import { NavArrows } from "../UI/Button";
import "./style.css";

/*
 * Фото проєктів. Два розміри на кожне: велике для головного вікна й окреме
 * маленьке для мініатюри.
 *
 * Раніше тут лежали оригінали — 23 МБ на сім штук, зокрема `image1.jpg`
 * розміром 6240×4160 (4.1 МБ), яке показувалось у вікні 688×516. Тобто
 * браузер тягнув і розпаковував у 40 разів більше пікселів, ніж малював, і
 * ще стільки ж — на мініатюру 100×120. Тепер 0.88 МБ на всі чотирнадцять
 * файлів, і мініатюра важить 6–18 КБ замість 4 МБ.
 */
import f1 from "../../assets/gallery-image1.webp";
import f1s from "../../assets/gallery-image1-thumb.webp";
import f2 from "../../assets/gallery-f2.webp";
import f2s from "../../assets/gallery-f2-thumb.webp";
import f3 from "../../assets/gallery-f3.webp";
import f3s from "../../assets/gallery-f3-thumb.webp";
import f4 from "../../assets/gallery-zel.webp";
import f4s from "../../assets/gallery-zel-thumb.webp";
import f5 from "../../assets/gallery-f5.webp";
import f5s from "../../assets/gallery-f5-thumb.webp";
import f6 from "../../assets/gallery-image2.webp";
import f6s from "../../assets/gallery-image2-thumb.webp";
import f7 from "../../assets/gallery-f7.webp";
import f7s from "../../assets/gallery-f7-thumb.webp";

/** Скільки триває переїзд фото у мініатюру */
const TRAVEL_S = 0.62;

/** Мініатюра порожня, поки клон до неї летить */
const THUMB_WAITING = "gallery-section__thumb--waiting";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

const linkifyText = (text) => {
  if (!text) return null;

  return text.split(URL_PATTERN).map((part, index) => {
    if (!part.startsWith("http://") && !part.startsWith("https://")) {
      return <Fragment key={index}>{part}</Fragment>;
    }

    const href = part.replace(/[.,;:!?)]+$/, "");
    const trailing = part.slice(href.length);

    return (
      <Fragment key={index}>
        <a
          href={href}
          className="gallery-section__desc-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {href}
        </a>
        {trailing}
      </Fragment>
    );
  });
};

const SLIDE_MEDIA = [
  { id: 1, image: f1, thumb: f1s },
  { id: 2, image: f2, thumb: f2s },
  { id: 3, image: f3, thumb: f3s },
  { id: 4, image: f4, thumb: f4s },
  { id: 5, image: f5, thumb: f5s },
  { id: 6, image: f6, thumb: f6s },
  { id: 7, image: f7, thumb: f7s },
];

export const Gallery = () => {
  const { t, localizePath } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const photoRef = useRef(null);
  const thumbRef = useRef(null);
  const mainRef = useRef(null);
  const travelRef = useRef(null);
  const travelTweenRef = useRef(null);

  const slides = useMemo(() => {
    const copy = t("gallery.slides");
    return SLIDE_MEDIA.map((media, index) => {
      const slideCopy = copy[index] ?? copy[copy.length - 1];

      return {
        ...media,
        ...slideCopy,
        titleLines: Array.isArray(slideCopy.titleLines)
          ? slideCopy.titleLines
          : null,
      };
    });
    // language не потрібен: t уже інший обʼєкт після зміни мови
  }, [t]);

  const slide = slides[activeIndex];
  const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
  const headingLines = t("gallery.heading");

  /*
   * Сусідні фото підгружаємо заздалегідь. Інакше кожне натискання стрілки —
   * це очікування нового файлу, і саме тому перемикання відчувалось повільним
   * навіть після того, як картинки полегшали.
   */
  useEffect(() => {
    const around = [activeIndex + 1, activeIndex - 1].map(
      (index) => (index + SLIDE_MEDIA.length) % SLIDE_MEDIA.length,
    );

    around.forEach((index) => {
      const preload = new Image();
      preload.src = SLIDE_MEDIA[index].image;
    });
  }, [activeIndex]);

  /*
   * Переїзд фото у мініатюру.
   *
   * Тут нарочито немає стану React. Перша версія тримала «яке фото зараз
   * летить» у useState і запускала твін із useGSAP — і твін стартував двічі:
   * заміряно, на 120-й мілісекунді клон уже був на 340 px, потім відкочувався
   * назад на 347 і блимав до opacity 0.04. Причина в тому, що useGSAP на
   * кожен перезапуск відкочує все, що всередині нього зробили, а залежностей
   * тут змінювалося дві одночасно.
   *
   * Тому: React відповідає лише за те, який слайд активний, а рух — це один
   * імперативний твін. Жодного перерендеру за час анімації не відбувається,
   * тож клас на мініатюрі можна ставити напряму.
   */
  const startTravel = useCallback((fromIndex) => {
    const host = photoRef.current;
    const main = mainRef.current;
    const thumb = thumbRef.current;
    const travel = travelRef.current;

    if (!host || !main || !thumb || !travel) return;

    const hostBox = host.getBoundingClientRect();
    const from = main.getBoundingClientRect();
    const to = thumb.getBoundingClientRect();
    const radius = (el) =>
      Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;

    /*
     * На телефоні мініатюри немає (display: none), тобто летіти нікуди.
     * Без цієї перевірки клон зменшувався б у нуль десь у лівому верхньому
     * куті — там, де в схованого елемента нульовий прямокутник.
     */
    if (to.width === 0 || to.height === 0) {
      gsap.set(travel, { autoAlpha: 0 });
      return;
    }

    travelTweenRef.current?.kill();
    travel.src = SLIDE_MEDIA[fromIndex].image;
    // Поки клон летить, мініатюра порожня: інакше видно дві однакові картинки
    thumb.classList.add(THUMB_WAITING);

    gsap.set(travel, {
      autoAlpha: 1,
      left: from.left - hostBox.left,
      top: from.top - hostBox.top,
      width: from.width,
      height: from.height,
      borderRadius: radius(main),
    });

    travelTweenRef.current = gsap.to(travel, {
      left: to.left - hostBox.left,
      top: to.top - hostBox.top,
      width: to.width,
      height: to.height,
      borderRadius: radius(thumb),
      duration: TRAVEL_S,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(travel, { autoAlpha: 0 });
        thumb.classList.remove(THUMB_WAITING);
      },
    });
  }, []);

  useEffect(
    () => () => {
      travelTweenRef.current?.kill();
    },
    [],
  );

  const goTo = (index) => {
    if (index === activeIndex) return;

    const leaving = activeIndex;
    setActiveIndex(index);
    // Після того, як React підмінив велике фото — саме тоді запускаємо переїзд
    requestAnimationFrame(() => startTravel(leaving));
  };

  const goPrev = () => goTo(prevIndex);
  const goNext = () => goTo((activeIndex + 1) % slides.length);

  const linkLabel = t("gallery.discover");
  const linkHref = slide.href;
  /*
   * Поки розділ «Діяльність» приховано (ACTIVITIES_ENABLED), кнопки, які
   * ведуть на /office, теж не показуємо: інакше з головної була б помітна
   * дорога в розділ, який навмисно прибрали з меню. Прапорець один на обидва
   * входи, тому вони повертаються разом.
   */
  const leadsToHiddenActivities =
    !ACTIVITIES_ENABLED && String(linkHref).startsWith("/office");
  const showLink = hasDestination(linkHref) && !leadsToHiddenActivities;
  const linkIsExternal = showLink && isExternalUrl(linkHref);

  return (
    <section className="gallery-section" aria-label={t("gallery.sectionLabel")}>
      <div className="gallery-section__inner">
        <h2 className="gallery-section__heading">
          {headingLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="gallery-section__slider">
          <div ref={photoRef} className="gallery-photo">
            <button
              type="button"
              ref={thumbRef}
              className="gallery-section__thumb"
              onClick={goPrev}
              aria-label={t("gallery.prevProject")}
            >
              <img
                src={slides[prevIndex].thumb}
                alt=""
                width="100"
                height="120"
                decoding="async"
              />
            </button>

            <div ref={mainRef} className="gallery-section__main">
              <img
                key={`active-${activeIndex}`}
                className="gallery-section__main-img gallery-section__main-img--enter"
                src={slide.image}
                alt={slide.title}
                decoding="async"
              />
            </div>

            {/*
              Клон фото, який їде з великого вікна у мініатюру. Лежить поверх
              обох слотів, тому і рахується від .gallery-photo.
            */}
            <img
              ref={travelRef}
              className="gallery-photo__travel"
              alt=""
              aria-hidden="true"
            />
          </div>

          <div
            className={`gallery-section__content gallery-section__content--slide-${slide.id}`}
          >
            <div className="gallery-section__content-head">
              <span className="gallery-section__index">{slide.id}</span>
              <h3 className="gallery-section__title">
                <span className="gallery-section__title-text gallery-section__title--desktop">
                  {slide.title}
                </span>
                {slide.titleLines ? (
                  <span className="gallery-section__title-lines gallery-section__title--mobile">
                    {slide.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                ) : null}
              </h3>
            </div>

            {/*
              Один опис на всі екрани. Раніше для мобільного був окремий
              `descriptionLines` із заздалегідь розбитими рядками — і в пʼяти
              із семи слайдів там лежав скопійований текст про ZBROYA EXPO.
              Тобто на телефоні опис DEALBOOK, BUILD WITH UKRAINE і решти
              розповідав про виставки.
            */}
            <p className="gallery-section__desc">
              {linkifyText(slide.description)}
            </p>

            {showLink ? (
              linkIsExternal ? (
                <a
                  href={linkHref}
                  className="gallery-section__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkLabel}
                  <span aria-hidden="true">→</span>
                </a>
              ) : (
                <Link
                  to={localizePath(linkHref)}
                  className="gallery-section__link"
                >
                  {linkLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              )
            ) : null}

            <NavArrows
              className="gallery-section__nav"
              onPrev={goPrev}
              onNext={goNext}
              prevLabel={t("gallery.prevSlide")}
              nextLabel={t("gallery.nextSlide")}
            />
          </div>

          <div
            className="gallery-section__pagination"
            role="tablist"
            aria-label={t("gallery.slidesLabel")}
          >
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`${t("gallery.slideLabel")} ${item.id}`}
                className={`gallery-section__pagination-item${
                  index === activeIndex
                    ? " gallery-section__pagination-item--active"
                    : ""
                }`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
