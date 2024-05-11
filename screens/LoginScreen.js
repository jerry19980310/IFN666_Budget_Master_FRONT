import React from 'react';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Input, Stack, Icon, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

const LoginScreen = () => {

  const navigation = useNavigation();

  const [show, setShow] = useState(false);

  const [userName, setUserName] = useState('');

  const [password, setPassword] = useState('');

  const login = async () => {

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

      navigation.navigate('Tabview')

      alert(userName + ", Welcome back!!!");

      setUserName('');
      setPassword('');
    } catch (error) {
      alert(error);
    }
  };

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