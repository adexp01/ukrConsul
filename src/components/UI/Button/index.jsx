import "./style.css";

const LABEL_CORNER_PATH =
  "M0 0h5.63c7.808 0 13.536 7.337 11.642 14.91l-6.09 24.359A11.527 11.527 0 0 1 0 48V0Z";

const ICON_BLOB_PATH =
  "M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z";

const ICON_BLOB_LEFT_PATH =
  "M44.272 38.91A12 12 0 0 1 32.631 48H12C5.373 48 0 42.627 0 36V12C0 5.373 5.373 0 12 0h26.63c7.809 0 13.537 7.337 11.643 14.91l-6 24Z";

export const ButtonGradients = () => (
  <svg
    width="0"
    height="0"
    className="u-btn__gradients"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="wwu-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F3893A" />
        <stop offset="84.26%" stopColor="#E66618" />
        <stop offset="100%" stopColor="#E66618" />
      </linearGradient>
      <linearGradient id="wwu-grad-hover" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FD9446" />
        <stop offset="84.26%" stopColor="#FF8236" />
        <stop offset="100%" stopColor="#FF8236" />
      </linearGradient>
    </defs>
  </svg>
);

const LabelCorner = () => (
  <div className="label_corner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="48"
      fill="none"
      viewBox="0 0 18 48"
      aria-hidden="true"
    >
      <path d={LABEL_CORNER_PATH} />
    </svg>
  </div>
);

const IconBlob = ({ path = ICON_BLOB_PATH }) => (
  <i className="btn_icon" aria-hidden="true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="51"
      height="48"
      fill="none"
      viewBox="0 0 51 48"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  </i>
);

export const Button = ({
  children = "Take the test",
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const isPrimary = variant === "primary";
  const variantClass = isPrimary ? "-primary" : "-dark";
  const classNames = `u-btn--1 ${variantClass}${className ? ` ${className}` : ""}`;

  const content = (
    <>
      <span className="btn_label button2__label">
        {children}
        <LabelCorner />
      </span>

      <IconBlob />
    </>
  );

  // Кнопка-дія (наприклад «Завантажити ще») має бути <button>, а не <a href="#">:
  // інакше браузер переходить за порожнім якорем і сторінку кидає вгору.
  if (!href) {
    return (
      <button type={type} className={classNames} onClick={onClick} {...props}>
        {content}
      </button>
    );
  }

  return (
    <a href={href} className={classNames} onClick={onClick} {...props}>
      {content}
    </a>
  );
};

export const IconButton = ({
  href = "#",
  direction = "right",
  variant = "outline",
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const directionClass = direction === "left" ? "-left" : "-right";
  const variantClass = variant === "solid" ? "-solid" : "-outline";
  const blobPath = direction === "left" ? ICON_BLOB_LEFT_PATH : ICON_BLOB_PATH;
  const classNames = `u-btn--icon ${directionClass} ${variantClass}${className ? ` ${className}` : ""}`;
  const icon = (
    <i className="btn_icon" aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 51 48"
        fill="none"
        aria-hidden="true"
      >
        <path d={blobPath} />
      </svg>
    </i>
  );

  if (onClick) {
    return (
      <button
        type={type}
        className={classNames}
        onClick={onClick}
        {...props}
      >
        {icon}
      </button>
    );
  }

  return (
    <a href={href} className={classNames} {...props}>
      {icon}
    </a>
  );
};

export const NavArrows = ({
  prevHref = "#",
  nextHref = "#",
  onPrev,
  onNext,
  prevLabel = "Previous",
  nextLabel = "Next",
  variant = "solid",
  prevDisabled = false,
  nextDisabled = false,
  className = "",
}) => (
  <div className={`nav-arrows${className ? ` ${className}` : ""}`}>
    <IconButton
      direction="left"
      variant={variant}
      aria-label={prevLabel}
      disabled={prevDisabled}
      {...(onPrev ? { onClick: onPrev } : { href: prevHref })}
    />
    <IconButton
      direction="right"
      variant={variant}
      aria-label={nextLabel}
      disabled={nextDisabled}
      {...(onNext ? { onClick: onNext } : { href: nextHref })}
    />
  </div>
);
