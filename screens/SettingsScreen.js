import { Text, Switch, View, StyleSheet } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { useMyTheme } from "../context/mytheme";
import { GlobalStyles } from "../styles/global";
import { Button, useToast } from "native-base";
import { useNavigation } from '@react-navigation/native';
import MyAlert from "../components/MyAlert";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {

  const { isLargeText, setIsLargeText } = useMyTheme();
  const { isBoldText, setIsBoldText } = useMyTheme();
  const globalStyles = GlobalStyles();
  const navigation = useNavigation();
  const toast = useToast();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('exp');
    toast.show({
      render: () => (
        <MyAlert title="Logout success" description="You have been logged out!" variant="left-accent" status="info" />
      ),
      duration: 3000,
      placement: "top"
    });
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
      <Button bg="#96B6C5" onPress={handleAbout}>
        <Text style={globalStyles.text}>About</Text>
      </Button>
      <Button bg="#96B6C5" onPress={handleLogout}>
        <Text style={globalStyles.text}>Logout</Text>
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