import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const login = async (userName, password, navigation, toast, MyAlert) => {
  console.log('Login function started');
  if (!userName || !password) {
    console.log('Missing username or password');
    toast.show({
      render: () => (
        <MyAlert title="Warning" description="Please enter username and password" variant="left-accent" status="warning" />
      ),
      duration: 3000,
      placement: "top",
    });
    return false;
  }

  try {
    console.log('Making request to backend');
    await delay(500);
    const response = await axios.post('http://10.0.2.2:3000/users/login', {
      username: userName,
      password: password,
    });

    console.log('Response received:', response.data);

    const token = response.data.token;
    const decode = jwtDecode(token);

    await AsyncStorage.setItem('jwtToken', token);
    await AsyncStorage.setItem('userId', JSON.stringify(decode.tokenPayload.userId));
    await AsyncStorage.setItem('username', decode.tokenPayload.username.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()));
    await AsyncStorage.setItem('exp', JSON.stringify(decode.exp));

    navigation.navigate('Tabview');

    const Name = decode.tokenPayload.username.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    console.log('Login successful');

    toast.show({
      render: () => (
        <MyAlert title="Login Success" description={`Hello, ${Name}, Nice to see you again!`} variant="top-accent" status="success" />
      ),
      duration: 3000,
      placement: "top",
    });

    
    return true;
  } catch (error) {
    console.log('Login failed:', error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="Login Failed" description={error.response.data.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top",
    });
    return false;
  }
};
