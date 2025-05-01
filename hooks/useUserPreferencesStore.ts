import { create } from "zustand";

interface UserPreferencesState {
  theme: "light" | "dark";
  language: string;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: string) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>((set) => ({
  theme: "light",
  language: "en",
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));
