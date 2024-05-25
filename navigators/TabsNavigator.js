import  React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoryScreen from "../screens/CategoryScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import HistoryScreen from "../screens/HistoryScreen";
import UserIcon from "../components/UserIcon";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HoneScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {

    const [userName, setUserName] = useState('');
    const { t } = useTranslation();
    
    const fetchUserName = async () => {
      const userName = await AsyncStorage.getItem('username');
      setUserName(userName);
      console.log(userName);
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
            tabBarActiveTintColor: '#1C3879',
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

export default TabsNavigator;

