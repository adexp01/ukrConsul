import { Navigate, Outlet, useParams } from "react-router-dom";
import { SUPPORTED_LOCALES } from "./localeRoutes";

export const LocaleOutlet = () => {
  const { locale } = useParams();

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return <Navigate to="/en" replace />;
  }

  return <Outlet />;
};
