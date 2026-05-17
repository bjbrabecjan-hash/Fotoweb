"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ExperienceContextValue = {
  entered: boolean;
  enterExperience: () => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);

  const value = useMemo(
    () => ({
      entered,
      enterExperience: () => setEntered(true)
    }),
    [entered]
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used inside ExperienceProvider");
  }
  return context;
}
