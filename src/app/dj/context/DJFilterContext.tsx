"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface FilterState {
  genre: string;
  mood: string;
  bpmMin: number;
  bpmMax: number;
  search: string;
  sortBy: "name" | "bpm" | "artist";
}

const DEFAULT_FILTERS: FilterState = {
  genre: "All",
  mood: "All",
  bpmMin: 0,
  bpmMax: 999,
  search: "",
  sortBy: "name",
};

interface DJFilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  resetFilters: () => void;
}

const DJFilterContext = createContext<DJFilterContextType | undefined>(undefined);

export function DJFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);

  const setFilters = useCallback(
    (updater: FilterState | ((prev: FilterState) => FilterState)) => {
      setFiltersState((prev) =>
        typeof updater === "function"
          ? (updater as (prev: FilterState) => FilterState)(prev)
          : updater
      );
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  return (
    <DJFilterContext.Provider value={{ filters, setFilters, resetFilters }}>
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
