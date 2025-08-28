import { IoSunny, IoMoon } from "react-icons/io5";
import useThemeStore from "../../stores/useThemeStore";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDark ? (
        <IoSunny className="w-5 h-5" />
      ) : (
        <IoMoon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;