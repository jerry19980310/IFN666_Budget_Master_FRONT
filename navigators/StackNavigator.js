import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ModifyTransactionScreen from "../screens/ModifyTransactionScreen";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SummaryScreen from "../screens/SummaryScreen";
import AboutScreen from "../screens/AboutScreen";
import TabsNavigator from "./TabsNavigator";
import { useTranslation } from "react-i18next";


const Stack = createStackNavigator();

const StackNavigator = () => {

  const { t } = useTranslation();

  return (
    <Stack.Navigator >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Tabview" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ModifyTransaction" component={ModifyTransactionScreen} options={{ title: t('modify_transaction'), headerShown: true }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: t('about'), headerShown: true }} />
      <Stack.Screen name="MonthlyDetial" component={SummaryScreen} options={{ title: t('monthly_detial'), headerShown: true }} />
    </Stack.Navigator>
  );
}

export default StackNavigator;