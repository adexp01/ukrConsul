import { useId } from "react";
import "./style.css";
import arrow from "../../../assets/arrow.svg";

const DefaultIcon = () => (
  <img className="button2__arrow" src={arrow} alt="" />
);

export const ButtonTest = ({
  children = "Take the test",
  href = "#",
  variant = "primary",
  icon,
  className = "",
  ...props
}) => {
  const uid = useId().replace(/:/g, "");
  const gradientLeft = `button2-gradient-left-${uid}`;
  const gradientRight = `button2-gradient-right-${uid}`;
  const isPrimary = variant === "primary";

  return (
    <a
      href={href}
      className={`button2 button2--${variant}${className ? ` ${className}` : ""}`}
      {...props}
    >
      <svg
        className={`button2__svg button2__svg--${variant}`}
        aria-hidden="true"
      >
        {isPrimary ? (
          <defs>
            <linearGradient
              id={gradientLeft}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="objectBoundingBox"
            >
              <stop stopColor="#FBA050" />
              <stop offset="1" stopColor="#E66618" />
            </linearGradient>
            <linearGradient
              id={gradientRight}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
              gradientUnits="objectBoundingBox"
            >
              <stop stopColor="#E66618" />
              <stop offset="1" stopColor="#FBA050" />
            </linearGradient>
          </defs>
        ) : null}
        <rect
          className="button2__label-shape"
          fill={
            isPrimary ? `url(#${gradientLeft})` : "rgba(255, 255, 255, 0.02)"
          }
          stroke={isPrimary ? "none" : "rgba(255, 255, 255, 0.28)"}
          strokeWidth={isPrimary ? 0 : 1}
        />
        <rect
          className="button2__icon-shape"
          fill={
            isPrimary ? `url(#${gradientRight})` : "rgba(255, 255, 255, 0.02)"
          }
          stroke={isPrimary ? "none" : "rgba(255, 255, 255, 0.28)"}
          strokeWidth={isPrimary ? 0 : 1}
        />
      </svg>

      <span className="button2__label">
        <span className="button2__label-text">{children}</span>
      </span>

      <span className="button2__icon" aria-hidden="true">
        <span className="button2__icon-inner">{icon ?? <DefaultIcon />}</span>
      </span>
    </a>
  );
};
