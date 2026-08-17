import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { SUPPORTED_LOCALES } from "./localeRoutes";

/**
 * Обгортка маршрутів із мовним префіксом.
 *
 * Якщо перший сегмент — не мова, це старе посилання без префікса
 * (`/media`, `/office`, `/article/<id>` з соцмереж, пошуку, закладок).
 * Такі шляхи треба донести до потрібної сторінки, а не викидати людину на
 * головну: тому дописуємо `/en` спереду й лишаємо решту шляху як є.
 */
export const LocaleOutlet = () => {
  const { locale } = useParams();
  const { pathname, search, hash } = useLocation();

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return <Navigate to={`/en${pathname}${search}${hash}`} replace />;
  }

  return <Outlet />;
};
