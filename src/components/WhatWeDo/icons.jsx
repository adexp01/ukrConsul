export const CubeIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M14 4L23 9.5V18.5L14 24L5 18.5V9.5L14 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 4V14M14 14L23 9.5M14 14L5 9.5M14 14V24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const GlobeIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="14" cy="14" r="9.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4.5 14H23.5M14 4.5C11.5 7.5 10 10.5 10 14C10 17.5 11.5 20.5 14 23.5C16.5 20.5 18 17.5 18 14C18 10.5 16.5 7.5 14 4.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const LayersIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M14 5L23.5 10.5L14 16L4.5 10.5L14 5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 14.5L14 20L23.5 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 18.5L14 24L23.5 18.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChartIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 22V12M12 22V8M18 22V14M24 22V6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const MegaphoneIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 12V16C6 17.1 6.9 18 8 18H10L16 22V6L10 10H8C6.9 10 6 10.9 6 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M19 11C20.2 12.2 21 13.8 21 14C21 14.2 20.2 15.8 19 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ICONS = {
  cube: CubeIcon,
  globe: GlobeIcon,
  layers: LayersIcon,
  chart: ChartIcon,
  megaphone: MegaphoneIcon,
};

export const WhatWeDoIcon = ({ name = "cube" }) => {
  const Icon = ICONS[name] ?? CubeIcon;
  return <Icon />;
};
