import { StyleSheet } from "react-native";
import { useMyTheme } from "../context/mytheme";

export function GlobalStyles() {
  const { isLargeText } = useMyTheme();

  const styles = StyleSheet.create({
    text: {
      fontSize: isLargeText ? 28 : 16,
    },
  });

  return styles;
}