import { useMemo } from "react";
import { useLanguage } from "./LanguageContext";

export const useBannerTabs = () => {
  const { t, language } = useLanguage();

  return useMemo(
    () => ({
      tabs: [
        { id: "industry", label: t("banner.tabs.industry") },
        { id: "partners", label: t("banner.tabs.partners") },
        { id: "capacity", label: t("banner.tabs.capacity") },
      ],
      mobileTabs: [
        { id: "capacity", label: t("banner.tabs.capacity"), active: true },
        { id: "partners", label: t("banner.tabs.partners"), active: false },
      ],
    }),
    [t, language],
  );
};
