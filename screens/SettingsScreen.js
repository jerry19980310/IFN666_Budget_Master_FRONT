import { Text, Switch, View, StyleSheet } from "react-native";
import { useState } from "react";
import { GlobalLayout } from "../components/Layout";
import { useMyTheme } from "../context/mytheme";
import { GlobalStyles } from "../styles/global";
import { Button } from "native-base";
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {

  const { isLargeText, setIsLargeText } = useMyTheme();
  const globalStyles = GlobalStyles();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('exp');
    navigation.navigate('Login');
  };

  return (
    <GlobalLayout>
      <View style={styles.view}>
        <Switch
          value={isLargeText}
          onValueChange={async () => {
            await AsyncStorage.setItem("isLargeText", JSON.stringify(!isLargeText));
            setIsLargeText(!isLargeText);
          }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
        <Text style={globalStyles.text}>Large Text</Text>
      </View>
      <Button onPress={handleLogout}>
        <Text>Logout</Text>
      </Button>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
});