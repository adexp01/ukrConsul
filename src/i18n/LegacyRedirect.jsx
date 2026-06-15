import { Navigate, useLocation } from "react-router-dom";
import { getLocaleFromPathname } from "./localeRoutes";

export const LegacyRedirect = () => {
  const location = useLocation();

  if (getLocaleFromPathname(location.pathname)) {
    return <Navigate to="/en" replace />;
  }

  return (
    <Navigate
      to={`/en${location.pathname}${location.search}${location.hash}`}
      replace
    />
  );
};
