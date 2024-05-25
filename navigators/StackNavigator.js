import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ModifyTransactionScreen from "../screens/ModifyTransactionScreen";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SummaryScreen from "../screens/SummaryScreen";
import AboutScreen from "../screens/AboutScreen";
import TabsNavigator from "./TabsNavigator";


const Stack = createStackNavigator();

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

export default StackNavigator;