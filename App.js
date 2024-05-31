import { NavigationContainer } from "@react-navigation/native";
import { MyThemeProvider } from "./context/mytheme";
import { NativeBaseProvider } from 'native-base';
import StackNavigator from "./navigators/StackNavigator";

export default function App() {

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <MyThemeProvider>
          <StackNavigator />
        </MyThemeProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
