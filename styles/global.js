import { StyleSheet } from "react-native";
import { useMyTheme } from "../context/mytheme";

export function GlobalStyles() {
  const { isLargeText } = useMyTheme();
  const { isBoldText } = useMyTheme();

  const styles = StyleSheet.create({
    text: {
      fontSize: isLargeText ? 24 : 16,
      fontWeight : isBoldText ? "bold" : "normal",
    },
    heading: {
      fontSize: isLargeText ? 28 : 20,
      fontWeight : isBoldText ? "bold" : "500",
    },
  });

  return styles;
}