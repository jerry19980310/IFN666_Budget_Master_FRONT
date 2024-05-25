import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  // Navigate to the next screen after a certain delay (e.g., 2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Replace 'Login' with the name of your initial screen
    }, 2000); // 2000 milliseconds (2 seconds)
    
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text} >Best Budget Management</Text>
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
    fontSize: 24,
  },
  text: {
    fontSize: 28, // Adjust font size as needed
  },
  logo: {
    width: 400, // Adjust width and height as needed
    height: 400,
  },

});

export default SplashScreen;