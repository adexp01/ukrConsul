import { PageLayout } from "../../components/PageLayout";
import notFound from "../../assets/errorPage.png";
import { Button } from "../../components/UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";

export const NotFoundPage = () => {
  const { t, localizePath } = useLanguage();

  return (
    <PageLayout variant="not-found">
      <div className="page-layout__inner not-found-page">
        <div className="not-found-page__visual" aria-hidden="true">
          <img src={notFound} alt="" />
        </div>

        <h1 className="not-found-page__title">{t("notFound.title")}</h1>

        <p className="not-found-page__text">{t("notFound.text")}</p>

        <Button href={localizePath("/")} variant="primary" className="not-found-page__cta">
          {t("notFound.cta")}
        </Button>
      </div>
    </PageLayout>
  );
};
