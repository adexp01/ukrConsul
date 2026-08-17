/*
 * Кнопки «Долучитися / Подати заявку / Стати партнером» ведуть в один поп-ап.
 * Хелпер лишає посилання там, де воно справді потрібне (mailto, зовнішні
 * сторінки), і підміняє його на відкриття тесту там, де ціль — заявка.
 */
export const joinCtaProps = (openJoinQuiz) => ({ onClick: openJoinQuiz });

export const isJoinTarget = (href) =>
  typeof href === "string" &&
  (href === "/join" ||
    href.endsWith("/join") ||
    href.includes("forms.cloud.microsoft"));
