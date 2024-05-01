import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import NewsScreen from "./screens/NewsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MyThemeProvider } from "./context/mytheme";
import CategoryScreen from "./screens/CategoryScreen";
import { NativeBaseProvider } from 'native-base';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <MyThemeProvider>
        <Tab.Navigator
          screenOptions={({ route }) => {
            return {
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === "News") {
                  iconName = "newspaper";
                } else if (route.name === "Settings") {
                  iconName = "cog";
                }
                else if (route.name === "Category") {
                  iconName = "piggy-bank";
                }
                return (
                  <FontAwesome5 name={iconName} size={size} color={color} />
                );
              },
            };
          }}
        >
          <Tab.Screen name="News" component={NewsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Category" component={CategoryScreen} />
        </Tab.Navigator>
        </MyThemeProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
