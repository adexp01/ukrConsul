import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { JoinQuizModal } from "./index";

const JoinQuizContext = createContext({ openJoinQuiz: () => {} });

/**
 * Один поп-ап на весь застосунок: будь-яка кнопка «Долучитися» просто
 * викликає openJoinQuiz() з цього контексту.
 */
export const JoinQuizProvider = ({ children }) => {
  /*
   * Номер сеансу зростає з кожним відкриттям і йде в key модалки — тому кожне
   * відкриття починається з чистого аркуша. Раніше відповіді скидались
   * ефектом «якщо закрито — забути», а це зайвий рендер після кожного закриття.
   */
  const [session, setSession] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openJoinQuiz = useCallback(() => {
    setSession((current) => current + 1);
    setIsOpen(true);
  }, []);

  const closeJoinQuiz = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openJoinQuiz, closeJoinQuiz, isJoinQuizOpen: isOpen }),
    [openJoinQuiz, closeJoinQuiz, isOpen],
  );

  return (
    <JoinQuizContext.Provider value={value}>
      {children}
      <JoinQuizModal key={session} isOpen={isOpen} onClose={closeJoinQuiz} />
    </JoinQuizContext.Provider>
  );
};

/*
 * Хук лежить в одному файлі з провайдером: контекст, провайдер і доступ до
 * нього — це одне ціле, і розносити їх по файлах лише щоб вдовольнити правило
 * про Fast Refresh, сенсу мало. Наслідок правила — при правці саме цього файла
 * стан у dev-режимі скидається; у продакшн-збірці воно не важить.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useJoinQuiz = () => useContext(JoinQuizContext);
