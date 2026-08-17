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
  const [isOpen, setIsOpen] = useState(false);

  const openJoinQuiz = useCallback(() => setIsOpen(true), []);
  const closeJoinQuiz = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openJoinQuiz, closeJoinQuiz, isJoinQuizOpen: isOpen }),
    [openJoinQuiz, closeJoinQuiz, isOpen],
  );

  return (
    <JoinQuizContext.Provider value={value}>
      {children}
      <JoinQuizModal isOpen={isOpen} onClose={closeJoinQuiz} />
    </JoinQuizContext.Provider>
  );
};

export const useJoinQuiz = () => useContext(JoinQuizContext);
