import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const useMyTheme = () => useContext(ThemeContext);

export function MyThemeProvider({ children }) {
  const [isLargeText, setIsLargeText] = useState(false);
  const [isBoldText, setIsBoldText] = useState(false);

  useEffect(() => {
    const getTheme = async () => {
      try {
        const storedLargeText = await AsyncStorage.getItem("isLargeText");
        const parsedLargeText = storedLargeText ? JSON.parse(storedLargeText) : false;
        setIsLargeText(parsedLargeText);

        const storedBoldText = await AsyncStorage.getItem("isBoldText");
        const parsedBoldText = storedBoldText ? JSON.parse(storedBoldText) : false;
        setIsBoldText(parsedBoldText);
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };
    getTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ isLargeText, setIsLargeText, isBoldText, setIsBoldText }}>
      {children}
    </ThemeContext.Provider>
  );
}