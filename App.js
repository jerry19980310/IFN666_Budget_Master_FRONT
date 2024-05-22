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
import SummaryScreen from "./screens/SummaryScreen";
import { NativeBaseProvider } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { createContext, useState } from 'react';
import AboutScreen from "./screens/AboutScreen";
import UserIcon from "./components/UserIcon";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  const StackNavigator = () => {
    return (
      <Stack.Navigator >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tabview" component={TabsNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ModifyTransaction" component={ModifyTransactionScreen} options={{ title: 'Modify Transaction', headerShown: true }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About', headerShown: true }} />
        <Stack.Screen name="MonthlyDetial" component={SummaryScreen} options={{ title: 'Monthly detial', headerShown: true }} />
      </Stack.Navigator>
    );
  }

  const TabsNavigator = () => {

    const [userName, setUserName] = useState('');

    const fetchUserName = async () => {
      const userName = await AsyncStorage.getItem('username');
      setUserName(userName);
    };

    fetchUserName();

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
        <Tab.Screen name="Home" component={HoneScreen} options={{
          headerRight: () => (
            <UserIcon userName={userName} />
          ),
        }} />
        <Tab.Screen name="Transaction" component={AddTransactionScreen} options={{
          headerRight: () => (
            <UserIcon userName={userName} />
          ),
        }} />
        <Tab.Screen name="History" component={HistoryScreen} options={{
          headerRight: () => (
            <UserIcon userName={userName} />
          ),
        }} />
        <Tab.Screen name="Category" component={CategoryScreen} options={{
          headerRight: () => (
            <UserIcon userName={userName} />
          ),
        }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{
          headerRight: () => (
            <UserIcon userName={userName} />
          ),
        }} />


      </Tab.Navigator>
    );
  };



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
