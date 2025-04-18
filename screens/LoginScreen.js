import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Alert, BackHandler } from 'react-native';
import { Input, Stack, Icon, Pressable, Box, Button, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckExp from '../auth/CheckExp';
import { GlobalStyles } from "../styles/global";
import MyAlert from '../components/MyAlert';
import { login } from '../auth/Auth'; // Import the login function

const LoginScreen = () => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const globalStyles = GlobalStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      const userName = await AsyncStorage.getItem('username');
      if (token) {
        Toast.show({
          render: () => (
            <MyAlert title="Welcome Back" description={`Hi, ${userName} , Welcome back!`} variant="top-accent" status="info" />
          ),
          duration: 3000,
          placement: "top"
        });
        navigation.navigate('Tabview');
      }
    }

    async function check() {
      const isExpire = await CheckExp();
      if (isExpire) {
        setUserName('');
        setPassword('');
        navigation.navigate('Login');
        return;
      } else {
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
        { text: 'YES', onPress: () => BackHandler.exitApp() },
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
              style={globalStyles.text}
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
              style={globalStyles.text}
            />
            <View style={styles.buttonContainer}>
              <Button onPress={() => {login(userName, password, navigation, setLoading, setUserName, setPassword) }} style={styles.button} _text={globalStyles.text} isLoading={loading} >Login</Button>
              <Button onPress={() => navigation.navigate('SignUp')} style={styles.button} _text={globalStyles.text}>Sign Up</Button>
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
    fontWeight: "bold",
  }
});

export default LoginScreen;
