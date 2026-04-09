"use client";

import { create } from "zustand";

interface ZenModeStore {
  isZenMode: boolean;
  toggleZenMode: () => void;
  setZenMode: (value: boolean) => void;
}

export const useZenModeStore = create<ZenModeStore>()((set) => ({
  isZenMode: false,
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  setZenMode: (value) => set({ isZenMode: value }),
}));
