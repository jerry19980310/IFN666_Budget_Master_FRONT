import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import HoneScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MyThemeProvider } from "./context/mytheme";
import CategoryScreen from "./screens/CategoryScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { NativeBaseProvider } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { createContext, useContext } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={TabsNavigator} />
    </Stack.Navigator>
  );
}

const TabsNavigator = () => {
  return (
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
  );
};


export default function App() {

  const AuthContext = createContext();
  
  const isAuthenticated = false;


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
