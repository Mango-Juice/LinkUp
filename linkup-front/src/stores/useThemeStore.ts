import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
}

interface ThemeStore extends ThemeState {
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const newIsDark = !get().isDark;
        const root = window.document.documentElement;
        if (newIsDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        set({ isDark: newIsDark });
      },
      setTheme: (isDark: boolean) => {
        const root = window.document.documentElement;
        if (isDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        set({ isDark });
      },
    }),
    {
      name: "theme-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          const shouldUseDark = state.isDark ?? systemPrefersDark;
          
          const root = window.document.documentElement;
          if (shouldUseDark) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
          state.isDark = shouldUseDark;
        }
      },
    }
  )
);

export default useThemeStore;