import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  // Navigate to the next screen after a certain delay (e.g., 2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Replace 'Login' with the name of your initial screen
    }, 3000); // 2000 milliseconds (2 seconds)
    
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Best Budget Management</Text>
      <Image source={require('../assets/MySplash2.jpeg')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Customize background color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // Adjust width and height as needed
    height: 200,
  },
});

export default SplashScreen;