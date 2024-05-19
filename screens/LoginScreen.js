import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Input, Stack, Icon, Pressable, Box, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import { Alert, BackHandler } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import CheckExp from '../components/CheckExp';
import { useMyTheme } from '../context/mytheme';


const LoginScreen = () => {

  const navigation = useNavigation();

  const [show, setShow] = useState(false);

  const [userName, setUserName] = useState('');

  const [password, setPassword] = useState('');

  const { isLargeText } = useMyTheme();

  const login = async () => {

    if(!userName || !password){
      Alert.alert("Remind","Please enter username and password");
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:3000/users/login', {
        username: userName,
        password: password
      });

      const token = response.data.token;
      console.log(token);

      const decode = jwtDecode(token);

      console.log(decode);

      await AsyncStorage.setItem('jwtToken', response.data.token);
      await AsyncStorage.setItem('userId', JSON.stringify(decode.tokenPayload.userId));
      await AsyncStorage.setItem('username', decode.tokenPayload.username);
      await AsyncStorage.setItem('exp', JSON.stringify(decode.exp));

      navigation.navigate('Tabview')

      alert(userName + ", Welcome back!!!");

      setUserName('');
      setPassword('');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {

    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      const userName = await AsyncStorage.getItem('username');
      if (token) {
        alert(userName + ", Welcome back!!!");
        navigation.navigate('Tabview');
      }
    }

    async function check() {
      const isExpire = await CheckExp();
      console.log(isExpire);
      if (isExpire) {
        navigation.navigate('Login');
        return;
      }
      else {
        checkLogin();
      }

    };

    check();

  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <ImageBackground source={require('../assets/MySplash1.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Box style={styles.card}>
          <Text style={styles.headerText}>Welcome Back!</Text>
          <Stack space={4} w="100%" alignItems="center">
            <Input
              w={styles.inputWidth}
              InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />}
              placeholder="Username"
              onChangeText={setUserName}
              value={userName}
              style={isLargeText && styles.largeText || styles.input}
            />
            <Input
              w={styles.inputWidth}
              type={show ? "text" : "password"}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                </Pressable>
              }
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              style={isLargeText && styles.largeText || styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button onPress={login} style={styles.button} _text={isLargeText && styles.largeText || styles.buttonText}>Login</Button>
              <Button onPress={() => navigation.navigate('SignUp')} style={styles.button} _text={isLargeText && styles.largeText && styles.boldText|| styles.buttonText}>Sign Up</Button>
            </View>
          </Stack>
        </Box>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '85%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  inputWidth: {
    base: "100%", 
    md: "100%"
  },
  input: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#406E8E' 
  },
  buttonText: {
    color: 'white'
  },
  text: {
    marginTop: 10,
    color: '#333'
  },
  largeText: {
    fontSize: 20,
  },
  boldText: {
    fontWeight : "bold",
  }
});

export default LoginScreen;