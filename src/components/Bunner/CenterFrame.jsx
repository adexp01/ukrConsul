export const CENTER_FRAME_PATH =
  "M0.5 4.2C0.5 3.1 4 2.5 8 2.5H1364.5C1368.5 2.5 1372 3.1 1372 4.2";

export const CenterFrame = ({ className = "" }) => (
  <div
    className={`anima__center-frame${className ? ` ${className}` : ""}`}
    aria-hidden="true"
  >
    <svg
      className="anima__center-frame-svg"
      width="344"
      viewBox="0 0 1373 22"
      preserveAspectRatio="none"
    >
      <path d={CENTER_FRAME_PATH} fill="none" />
    </svg>
  </div>
);
