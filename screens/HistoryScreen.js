import { Text, Switch, View, StyleSheet, Platform } from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { Center, Input, ScrollView, VStack, HStack, IconButton } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function HistoryScreen() {

  const [dataTransactions, setDataTransactions] = useState([]);
  const [filterTransactions, setFilterTransactions] = useState([]);
  const [transactionID, setTransactionID] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [transactions, setTransactions] = useState({});
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const fetchTransaction = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('jwtToken');
    const headers = {
      accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }

    try {
      const transaction = await axios.get(`http://10.0.2.2:3000/api/transaction/${user_id}`, {headers});
      setDataTransactions(transaction.data.transactions);
      setFilterTransactions(transaction.data.transactions);
      console.log(transaction.data.transactions);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Cannot connent database. Please try again later.");
    }
  };

  const deleteCategory = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const headers = {
      accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }
    try {
      const response = await axios.delete(`http://10.0.2.2:3000/api/transaction/delete/${transactionID}`, {headers});
      console.log(response.data);
      fetchTransaction();
      setIsDelete(false);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const navigation = useNavigation();

  const handleModifyTransaction = () => {
    // Navigate to the transaction screen with necessary data
    navigation.navigate("ModifyTransaction", { transactions });
  };

  const handlefilter = () => {

    if (!year || !month) {
      setFilterTransactions(dataTransactions);
      return;
    }
    const filtered = dataTransactions.filter((transaction) => { 
      return dayjs(transaction.date).format("YYYY") === year && dayjs(transaction.date).format("MM") === String(month).padStart(2, '0'); //handle 1 digit month
    });
    setFilterTransactions(filtered);
  }

  useEffect(() => {
    fetchTransaction();
  }, []);

  useEffect(() => {

    if (isDelete) {
      deleteCategory();
    }

    if (isModify) {
      handleModifyTransaction();
      setIsModify(false);
    }
  }, [isDelete, isModify]);

  useFocusEffect(
    useCallback(() => {
      fetchTransaction();
      setYear('');
      setMonth('');
    }, [])
  );


  useEffect(() => {
    handlefilter();    
  }, [year, month]);

    return (
      <VStack>
        <HStack space={3} justifyContent="center">
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Year" onChangeText={v => setYear(v)} value={year} keyboardType='numeric'/>
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Month" onChangeText={v => setMonth(v)} value={month} keyboardType='numeric'/>
        </HStack>
        <ScrollView>
          <VStack space={4} alignItems="center">
          <HStack space={3} justifyContent="space-between">
          <Text>date</Text>
                <Text>amount</Text>
                <Text>note</Text>
                <Text>category</Text>
                </HStack>
          { filterTransactions.map((transaction) => (
            <Center key={transaction.ID} w="100%" h="20" bg="indigo.300" rounded="md" shadow={3} >
              <HStack space={3} justifyContent="space-between">
                <Text>{dayjs(transaction.date).format("YYYY/MM/DD")}</Text>
                <Text>${transaction.amount}</Text>
                <Text>{transaction.note}</Text>
                <Text>{transaction.category}</Text>
                <IconButton
                  icon={<AntDesign name="edit" size={24} color="black" />}
                  onPress={() => {setTransactions(transaction); setIsModify(true); }}
                />
                <IconButton
                  icon={<AntDesign name="delete" size={24} color="black" />}
                  onPress={() => {setTransactionID(transaction.ID); setIsDelete(true);}}
                />
              </HStack>
            </Center>
          ))}
          </VStack>
        </ScrollView>
      </VStack>

    );
  }
  
  const styles = StyleSheet.create({
    view: {
      flexDirection: "row",
      alignItems: "center",
    },
  });