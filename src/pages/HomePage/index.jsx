import { Header } from "../../components/Header";
import { Bunner } from "../../components/Bunner";
import { AboutUs } from "../../components/AboutUs";
import { Info } from "../../components/Info";
import { Gallery } from "../../components/Gallery";
import { UpEvents } from "../../components/UpEvents";
import { Articles } from "../../components/Articles";
import { Anima } from "../../components/Anima";
import { Footer } from "../../components/Footer";
import { useSeo } from "../../seo/useSeo";

export const HomePage = () => {
  useSeo("home");

  return (
    <div>
      <div className="header-container">
        <Header />
      </div>
      <main className="home-page">
        <Bunner />
      </main>
      <div className="about-us">
        <AboutUs />
      </div>
      <div className="info">
        <Info />
      </div>
      <div className="gallery">
        <Gallery />
      </div>
      <div className="up-events-wrap">
        <UpEvents />
      </div>
      <div className="articles-wrap">
        <Articles />
      </div>
      <div className="anima-wrap">
        <Anima />
      </div>
      <Footer />
    </div>
  );
};
