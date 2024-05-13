import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import HoneScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MyThemeProvider } from "./context/mytheme";
import CategoryScreen from "./screens/CategoryScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ModifyTransactionScreen from "./screens/ModifyTransactionScreen";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { NativeBaseProvider } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { createContext, useContext, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Tabview" component={TabsNavigator} options={{headerShown: false}}/>
      <Stack.Screen name="ModifyTransaction" component={ModifyTransactionScreen}  options={{ title: 'Modify Transaction', headerShown: true}}/>
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
                else if (route.name === "Transaction") {
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
          <Tab.Screen name="Transaction" component={AddTransactionScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          {/* <Tab.Screen name="Category" component={CategoryScreen} /> */}
          
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
