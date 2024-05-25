import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { initialCategory, fetchCategory } from '../functions/ApiController';
import MyAlert from '../components/MyAlert';
import "core-js/stable/atob";
import { Toast } from 'native-base';

const ROOT = process.env.EXPO_PUBLIC_ROOT;

const delay = ms => new Promise(res => setTimeout(res, ms));

const handleInitialCategory = async () => {
  try {
    const categories = await fetchCategory();
    if (categories.length === 0) {
      await initialCategory();
      console.log("Initial Category Created");
    }
  } catch (error) {
    console.error("Error fetching data: ", error.response.data.message);
  }
};

export const login = async (userName, password, navigation, setLoading) => {
  if (!userName || !password) {
    Toast.show({
      render: () => (
        <MyAlert title="Warning" description="Please enter username and password" variant="left-accent" status="warning" />
      ),
      duration: 3000,
      placement: "top"
    });
    return;
  }

  setLoading(true); // Start loading

  try {
    await delay(300);
    const response = await axios.post(`${ROOT}/users/login`, {
      username: userName,
      password: password
    });

    const token = response.data.token;
    const decode = jwtDecode(token);

    await AsyncStorage.setItem('jwtToken', response.data.token);
    await AsyncStorage.setItem('userId', JSON.stringify(decode.tokenPayload.userId));
    await AsyncStorage.setItem('username', (decode.tokenPayload.username.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())));
    await AsyncStorage.setItem('exp', JSON.stringify(decode.exp));

    await handleInitialCategory();

    navigation.navigate('Tabview');

    const Name = decode.tokenPayload.username.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    Toast.show({
      render: () => (
        <MyAlert title="Login Success" description={`Hello, ${Name} , Nice to see you again!`} variant="top-accent" status="success" />
      ),
      duration: 3000,
      placement: "top"
    });
  } catch (error) {
    Toast.show({
      render: () => (
        <MyAlert title="Login Failed" description={error.response?.data?.message || 'Cannot connect to database. Please try again later.'} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
  } finally {
    setLoading(false); // Stop loading
  }
};

export const signup = async (userName, password, navigation, setLoading) => {
  if (!userName || !password) {
    Toast.show({
      render: () => (
        <MyAlert title="Warning" description="Please enter username and password" variant="left-accent" status="warning" />
      ),
      duration: 3000,
      placement: "top"
    });
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(`${ROOT}/users/register`, {
      username: userName,
      password: password
    });

    if (response.data.success) {
      Toast.show({
        render: () => (
          <MyAlert title="Sign Up Success" description={response.data.message + " Please login to continue."} variant="top-accent" status="success" />
        ),
        duration: 3000,
        placement: "top"
      });
      navigation.navigate('Login');
    }
  } catch (error) {
    Toast.show({
      render: () => (
        <MyAlert title="ERROR" description={error.response?.data?.message || "Cannot connect to database. Please try again later."} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
  } finally {
    setLoading(false);
  }
};
