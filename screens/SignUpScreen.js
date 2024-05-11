import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Input, Stack, Icon, Pressable } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { useState } from 'react';


const SignUpScreen = ({ navigation }) => {

  const [show, setShow] = useState(false);
  
  const [userName, setUserName] = useState('');

  const [password, setPassword] = useState('');

  const signup = async () => {

    try {
      const response = await axios.post('http://10.0.2.2:3000/users/register', {
        username: userName,
        password: password
      });

      console.log(response.data);

      if(response.data.success){
        alert(response.data.message + ". Please login to continue");
        setUserName('');
        setPassword('');
        navigation.navigate('Login');
      }


    } catch (error) {
      
      alert(error.response.data.message);
    }
  };




  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Stack space={4} w="100%" alignItems="center">
      <Text>Sign Up</Text>
      <Input w={{
        base: "75%",
        md: "25%"
      }} InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />} placeholder="Enter your Username" onChangeText={v => setUserName(v)} value={userName}/>
      <Input w={{
        base: "75%",
        md: "25%"
      }} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
      </Pressable>} placeholder="Password" onChangeText={v => setPassword(v)} value={password} />
    </Stack>
    <Button title="Sign up" onPress={() => signup()} />
    <Text>Allready have a account</Text>
    <Button title="Login" onPress={() => navigation.navigate('Login')} />
  </View>
  );
};

export default SignUpScreen;