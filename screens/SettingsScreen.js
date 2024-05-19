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

  const handleAbout = async () => {
    navigation.navigate('About');
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
      <Button bg="#D8AE7E" onPress={handleAbout}>
        <Text style={isLargeText && styles.largeText}>About</Text>
      </Button>
      <Button bg="#D8AE7E" onPress={handleLogout}>
        <Text style={[isLargeText && styles.largeText, isLargeText && styles.boldText]}>Logout</Text>
      </Button>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  largeText: {
    fontSize: 20,
  },
  boldText: {
    fontWeight : "bold",
  }
});