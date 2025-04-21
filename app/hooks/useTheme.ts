import { useState, useEffect } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";

export interface UseThemeResult {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeStyles: {
    backgroundColor: string;
    textColor: string;
    cardBgColor: string;
    borderColor: string;
  };
}

export const useTheme = (): UseThemeResult => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  // Update theme if system preference changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === "dark");
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Common theme styles
  const themeStyles = {
    backgroundColor: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    textColor: isDarkMode ? "text-white" : "text-gray-900",
    cardBgColor: isDarkMode ? "bg-gray-800" : "bg-white",
    borderColor: isDarkMode ? "border-gray-700" : "border-gray-200",
  };

  return {
    isDarkMode,
    toggleTheme,
    themeStyles,
  };
};
