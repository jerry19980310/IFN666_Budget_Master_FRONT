import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Input, Icon, Stack, Box, Pressable, Button, useToast } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import { GlobalStyles } from "../styles/global";
import { signup } from '../auth/Auth';

const SignUpScreen = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const globalStyles = GlobalStyles();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  return (
    <ImageBackground source={require('../assets/MySplash1.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Box style={styles.card}>
          <Text style={styles.headerText}>Create Your Account</Text>
          <Stack space={4} w="100%" alignItems="center">
            <Input
              w={styles.inputWidth}
              InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />}
              placeholder="Enter your Username"
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
              <Button onPress={() => signup(userName, password, navigation, setLoading)} style={styles.button} _text={globalStyles.text} isLoading={loading}>Sign Up</Button>
              <Button onPress={() => navigation.navigate('Login')} style={styles.button} _text={globalStyles.text}>Login</Button>
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
    marginTop: 20
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
    marginTop: 20,
    color: '#333',
    textAlign: 'center'
  },
  largeText: {
    fontSize: 20,
  }
});

export default SignUpScreen;
