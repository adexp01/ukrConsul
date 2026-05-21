import { PageLayout } from "../../components/PageLayout";
import notFound from "../../assets/errorPage.png";
import { Button } from "../../components/UI/Button";

export const NotFoundPage = () => {
  return (
    <PageLayout variant="not-found">
      <div className="page-layout__inner not-found-page">
        <div className="not-found-page__visual" aria-hidden="true">
          <img src={notFound} alt="" />
        </div>

        <h1 className="not-found-page__title">Page Not Found</h1>

        <p className="not-found-page__text">
          The requested resource could not be found.
        </p>

        <Button href="/" variant="primary" className="not-found-page__cta">
          Back to home
        </Button>
      </div>
    </PageLayout>
  );
};
