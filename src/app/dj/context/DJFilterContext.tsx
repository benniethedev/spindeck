"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Dispatch, SetStateAction } from "react";

export interface DJFilterState {
  genre: string;
  mood: string;
  bpmMin: number;
  bpmMax: number;
  search: string;
}

interface DJFilterContextType {
  filters: DJFilterState;
  setFilters: Dispatch<SetStateAction<DJFilterState>>;
}

const DJFilterContext = createContext<DJFilterContextType | undefined>(undefined);

export function DJFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<DJFilterState>({
    genre: "All",
    mood: "All",
    bpmMin: 0,
    bpmMax: 999,
    search: "",
  });

  return (
    <DJFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </DJFilterContext.Provider>
  );
}

export function useDJFilters() {
  const context = useContext(DJFilterContext);
  if (context === undefined) {
    throw new Error("useDJFilters must be used within a DJFilterProvider");
  }
  return context;
}
