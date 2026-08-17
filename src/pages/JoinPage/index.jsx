import { PageLayout } from "../../components/PageLayout";
import { JoinBunner } from "../../components/JoinBunner";
import { JoinEcosystem } from "../../components/JoinEcosystem";
import { JoinFormat } from "../../components/JoinFormat";
import { JoinParticipationFormats } from "../../components/JoinParticipationFormats";
import { JoinProcess } from "../../components/JoinProcess";
import { JoinFinalCta } from "../../components/JoinFinalCta";
import "./style.css";
import { useSeo } from "../../seo/useSeo";

export const JoinPage = () => {
  useSeo("join", { path: "join" });

  return (
    <PageLayout>
      <main className="join-page">
        <JoinBunner />
        <JoinEcosystem />
        <JoinFormat />
        <JoinParticipationFormats />
        <JoinProcess />
        <JoinFinalCta />
      </main>
    </PageLayout>
  );
};
