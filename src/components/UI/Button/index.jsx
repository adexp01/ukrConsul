import { useId } from "react";
import "./style.css";

const PRIMARY_LABEL_PATH =
  "M0 8C0 3.58172 3.58172 0 8 0L195.506 0C201.078 0 204.943 5.55352 203.008 10.7785L188.934 48.7785C187.772 51.9168 184.779 54 181.432 54H8C3.58172 54 0 50.4183 0 46V8Z";

const PRIMARY_ICON_PATH =
  "M254 46C254 50.4183 250.418 54 246 54H203.494C197.922 54 194.057 48.4465 195.992 43.2215L210.066 5.22149C211.228 2.08316 214.221 0 217.568 0H246C250.418 0 254 3.58172 254 8V46Z";

const DEFAULT_LABEL_PATH =
  "M150.432 53.5H8C3.85787 53.5 0.5 50.1421 0.5 46V8C0.5 3.85786 3.85787 0.5 8 0.5H164.506C169.729 0.5 173.353 5.70616 171.539 10.6045L157.465 48.6045C156.375 51.5467 153.569 53.5 150.432 53.5Z";

const DEFAULT_ICON_PATH =
  "M215 53.5H172.494C167.271 53.5 163.647 48.2938 165.461 43.3955L179.535 5.39551C180.625 2.45333 183.431 0.5 186.568 0.5H215C219.142 0.5 222.5 3.85786 222.5 8V46C222.5 50.1421 219.142 53.5 215 53.5Z";

const DefaultIcon = () => (
  <svg
    className="button2__arrow"
    viewBox="0 0 16 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5H14M14 5L10 1M14 5L10 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Button = ({
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

  const labelPath = isPrimary ? PRIMARY_LABEL_PATH : DEFAULT_LABEL_PATH;
  const iconPath = isPrimary ? PRIMARY_ICON_PATH : DEFAULT_ICON_PATH;
  const viewBox = isPrimary ? "0 0 254 54" : "0 0 223 54";
  
  return (
    <a
      href={href}
      className={`button2 button2--${variant}${className ? ` ${className}` : ""}`}
      {...props}
    >
      <svg
        className="button2__svg"
        viewBox={viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {isPrimary ? (
          <>
            <defs>
              <linearGradient
                id={gradientLeft}
                x1="91"
                y1="-29.5"
                x2="91"
                y2="45.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FBA050" />
                <stop offset="1" stopColor="#E66618" />
              </linearGradient>
              <linearGradient
                id={gradientRight}
                x1="223"
                y1="48"
                x2="223"
                y2="-18.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E66618" />
                <stop offset="1" stopColor="#FBA050" />
              </linearGradient>
            </defs>
            <path d={labelPath} fill={`url(#${gradientLeft})`} />
            <path d={iconPath} fill={`url(#${gradientRight})`} />
          </>
        ) : (
          <>
            <path
              className="button2__shape"
              d={labelPath}
              fill="rgba(255, 255, 255, 0.02)"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1"
            />
            <path
              className="button2__shape"
              d={iconPath}
              fill="rgba(255, 255, 255, 0.02)"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1"
            />
          </>
        )}
      </svg>

      <span className="button2__label">{children}</span>

      <span className="button2__icon" aria-hidden="true">
        <span className="button2__icon-inner">{icon ?? <DefaultIcon />}</span>
      </span>
    </a>
  );
};
