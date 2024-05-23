import { Text, Switch, View, StyleSheet } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { useMyTheme } from "../context/mytheme";
import { GlobalStyles } from "../styles/global";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {

  const { isLargeText, setIsLargeText } = useMyTheme();
  const { isBoldText, setIsBoldText } = useMyTheme();
  const globalStyles = GlobalStyles();

  return (
    <GlobalLayout>
      <View style={styles.view}>
        <Switch
          value={isLargeText}
          onValueChange={async () => {
            await AsyncStorage.setItem("isLargeText", JSON.stringify(!isLargeText));
            setIsLargeText(!isLargeText);
          }}
          trackColor={{ false: "#767577", true: "#96B6C5" }}
        />
        <Text style={globalStyles.text}>Large Text</Text>
      </View>
      <View style={styles.view}>
        <Switch
          value={isBoldText}
          onValueChange={async () => {
            await AsyncStorage.setItem("isBoldText", JSON.stringify(!isBoldText));
            setIsBoldText(!isBoldText);
          }}
          trackColor={{ false: "#767577", true: "#96B6C5" }}
        />
        <Text style={globalStyles.text}>Bold Text</Text>
      </View>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
});