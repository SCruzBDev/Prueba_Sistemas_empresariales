import { createContext, useContext } from "react";

export const FeedbackContext = createContext(null);

export function useFeedback() {
  return useContext(FeedbackContext);
}
