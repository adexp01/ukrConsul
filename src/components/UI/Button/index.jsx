import "./style.css";

export const Button = ({
  children,
  href = "#",
  variant = "default",
  className = "",
  ...props
}) => {
  return (
    <a
      href={href}
      className={`ui-button ui-button--${variant}${className ? ` ${className}` : ""}`}
      {...props}
    >
      <span className="ui-button__label">
        <span className="ui-button__label-inner">{children}</span>
      </span>
      <span className="ui-button__icon">
        <span className="ui-button__icon-inner" aria-hidden="true">
          →
        </span>
      </span>
    </a>
  );
};
