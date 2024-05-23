import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, useToast } from 'native-base';
import dayjs from 'dayjs';
import MyAlert from '../components/MyAlert';

const ROOT = process.env.EXPO_PUBLIC_ROOT;



const getHeaders = async () => {
  const token = await AsyncStorage.getItem('jwtToken');
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const fetchTransaction = async (user_id) => {
  const headers = await getHeaders();
  try {
    const response = await axios.get(`${ROOT}/api/transaction/${user_id}`, { headers });
    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching data: ", error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert('ERROR', "Cannot connect to database. Please try again later.");
    throw error;
  }
};

export const deleteTransaction = async (transactionID) => {
  const headers = await getHeaders();
  try {
    const response = await axios.delete(`${ROOT}/api/transaction/delete/${transactionID}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert('ERROR', error.response.data.message);
    throw error;
  }
};

export const createCategory = async (categoryName) => {
  const user_id = await AsyncStorage.getItem('userId');
  const headers = await getHeaders();
  try {
    const response = await axios.post(`${ROOT}/api/category/create`, {
      name: categoryName,
      user_id: user_id
    }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    throw error;
  }
};

export const deleteCategory = async (categoryID) => {
  const headers = await getHeaders();
  try {
    const response = await axios.delete(`${ROOT}/api/category/delete/${categoryID}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    throw error;
  }
};

export const initialCategory = async () => {
  const user_id = await AsyncStorage.getItem('userId');
  const headers = await getHeaders();
  try {
    const response = await axios.post(`${ROOT}/api/categories/initial`, {
      user_id: user_id
    }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert("ERROR", error.response.data.message);
    throw error;
  }
};

export const fetchCategory = async () => {
  const user_id = await AsyncStorage.getItem('userId');
  const headers = await getHeaders();
  try {
    const response = await axios.get(`${ROOT}/api/category/${user_id}`, { headers });
    return response.data.categories;
  } catch (error) {
    console.error("Error fetching data: ", error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert('ERROR', "Cannot connect to database. Please try again later.");
    throw error;
  }
};

export const newTransaction = async (money, date, note, category) => {
  const user_id = await AsyncStorage.getItem('userId');
  const headers = await getHeaders();
  try {
    const response = await axios.post(`${ROOT}/api/transaction/create`, {
      amount: money,
      user_id: user_id,
      date: dayjs(date).format('YYYY-MM-DD'),
      note: note,
      category: category
    }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert("ERROR", 'Error posting data. Please try again later.');
    throw error;
  }
};

export const fetchSummaryYearMonth = async () => {
  const user_id = await AsyncStorage.getItem('userId');
  const headers = await getHeaders();
  try {
    const response = await axios.get(`${ROOT}/api/transaction/summarybyyearmonth/${user_id}`, { headers });
    return response.data.summary;
  } catch (error) {
    console.error("Error fetching data: ", error.response.data.message);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert('ERROR', error.response?.data?.message || 'Error fetching data. Please try again later.');
    throw error;
  }
};

export const fetchSummaryCategory = async () => {
  const user_id = await AsyncStorage.getItem('userId');
  const headers = await getHeaders();
  try {
    const response = await axios.get(`${ROOT}/api/transaction/summarybycategory/${user_id}`, { headers });
    return response.data.summary;
  } catch (error) {
    console.error("Error fetching data: ", error);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert('ERROR', error.response?.data?.message || 'Error fetching data. Please try again later.');
    throw error;
  }
};

export const updateTransaction = async (transactionID, transactionData) => {
  const headers = await getHeaders();
  try {
    const response = await axios.put(`${ROOT}/api/transaction/modify/${transactionID}`, transactionData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    toast.show({
      render: () => (
        <MyAlert title="ERROR" description= {error.response?.data?.message} variant="left-accent" status="error" />
      ),
      duration: 3000,
      placement: "top"
    });
    // Alert.alert('ERROR', error.response.data.message);
    throw error;
  }
};