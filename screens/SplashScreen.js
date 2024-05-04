import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Splash from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // 隐藏原生 SplashScreen
    Splash.hideAsync();
    setTimeout(() => {
      // Code to navigate to the next screen
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text onPress={() => navigation.navigate('Home')}>Splash Screen</Text>
    </View>
  );
};

export default SplashScreen;