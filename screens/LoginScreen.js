import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Input, Stack, Icon, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import { Alert, BackHandler } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import CheckExp from '../components/CheckExp';

const LoginScreen = () => {

  const navigation = useNavigation();

  const [show, setShow] = useState(false);

  const [userName, setUserName] = useState('');

  const [password, setPassword] = useState('');

  const [isLogin, setIsLogin] = useState(false);

  const login = async () => {

    if(!userName || !password){
      alert("Please enter username and password");
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

    const checkexp = async () => {
      const exp = await AsyncStorage.getItem('exp');
      if(exp < Date.now()){
        console.log(exp);
        alert("Token expired, please login again");
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('exp');
        navigation.navigate('Login');
        return;
      }
      else
      {
        checkLogin();
      }

      
    };
    
    checkexp();

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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack space={4} w="100%" alignItems="center">
      <Text>Login</Text>
        <Input w={{
          base: "75%",
          md: "25%"
        }} InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />} placeholder="Username" onChangeText={v => setUserName(v)} value={userName}/>
        <Input w={{
          base: "75%",
          md: "25%"
        }} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
          <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
        </Pressable>} placeholder="Password" onChangeText={v => setPassword(v)} value={password} />
      </Stack>
      <Button title="Login" onPress={() => login()} />
      <Text>Don't have a account?</Text>
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
};

export default LoginScreen;