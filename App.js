import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import HoneScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MyThemeProvider } from "./context/mytheme";
import CategoryScreen from "./screens/CategoryScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import HistoryScreen from "./screens/HistoryScreen";
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
                if (route.name === "Home") {
                  iconName = "home";
                } else if (route.name === "Settings") {
                  iconName = "setting";
                }
                else if (route.name === "Category") {
                  iconName = "book";
                }
                else if (route.name === "Add") {
                  iconName = "plus";
                }
                else if (route.name === "History") {
                  iconName = "calendar";
                }
                return (
                  <AntDesign name={iconName} size={size} color={color} />
                );
              },
            };
          }}
        >
          <Tab.Screen name="Home" component={HoneScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Category" component={CategoryScreen} />
          <Tab.Screen name="Add" component={AddTransactionScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
        </MyThemeProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
