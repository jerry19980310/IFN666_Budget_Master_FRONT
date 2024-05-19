import { Text,  StyleSheet, Alert } from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { Center, Input, ScrollView, VStack, HStack, IconButton, Box, Icon } from "native-base";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkexp from "../components/CheckExp";
import { GlobalStyles } from "../styles/global";


export default function HistoryScreen() {

  const [dataTransactions, setDataTransactions] = useState([]);
  const [filterTransactions, setFilterTransactions] = useState([]);
  const [transactionID, setTransactionID] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [transactions, setTransactions] = useState({});
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const globalStyles = GlobalStyles();

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
      // console.log(transaction.data.transactions);
    } catch (error) {
      console.error("Error fetching data: ", error);
      Alert.alert('ERROR', "Cannot connent database. Please try again later.");
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
      Alert.alert('ERROR', error.response.data.message);
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
      async function check() {
      const isExpire = await Checkexp();
      if(!isExpire){
        fetchTransaction();
        setYear('');
        setMonth('');
      }
      else{
        navigation.navigate("Login");
      }
    }
    check();
    }, [])
  );


  useEffect(() => {
    handlefilter();    
  }, [year, month]);

  return (
    <Center flex={1} px="3">
      <VStack space={4} w="90%" maxW="400px">
        {/* <Heading size="lg" textAlign="center" style={isLargeText && styles.largeText}>Transaction History</Heading> */}
        <HStack space={3} justifyContent="center">
          <Input
            w="45%"
            variant="outline"
            placeholder="Year"
            onChangeText={v => setYear(v)}
            value={year}
            keyboardType='numeric'
            style={globalStyles.text}
          />
          <Input
            w="45%"
            variant="outline"
            placeholder="Month"
            onChangeText={v => setMonth(v)}
            value={month}
            keyboardType='numeric'
            style={globalStyles.text}
          />
        </HStack>
        <ScrollView>
          <VStack space={4} mt={4} alignItems="center" width="100%">
            {filterTransactions.length > 0 ? (
              filterTransactions.map((transaction) => (
                <Box key={transaction.ID} p="4" bg="#D8AE7E" rounded="md" shadow={2} mb={2} w="90%">
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <HStack alignItems="center" space={2}>
                        <Icon as={MaterialIcons} name="date-range" size="sm" color="white" />
                        <Text color="white" bold style={globalStyles.text}>{dayjs(transaction.date).format("YYYY/MM/DD")}</Text>
                      </HStack>
                      <HStack alignItems="center" space={2}>
                        <Icon as={MaterialIcons} name="attach-money" size="sm" color="white" />
                        <Text color="white" style={globalStyles.text}>${transaction.amount}</Text>
                      </HStack>
                      <HStack alignItems="center" space={2}>
                        <Icon as={MaterialIcons} name="note" size="sm" color="white" />
                        <Text color="white" style={globalStyles.text}>{transaction.note}</Text>
                      </HStack>
                      <HStack alignItems="center" space={2}>
                        <Icon as={MaterialIcons} name="category" size="sm" color="white" />
                        <Text color="white" style={globalStyles.text}>{transaction.category}</Text>
                      </HStack>
                    </VStack>
                    <HStack space={2}>
                      <IconButton
                        icon={<AntDesign name="edit" size={24} color="white" />}
                        onPress={() => { setTransactions(transaction); setIsModify(true); }}
                      />
                      <IconButton
                        icon={<AntDesign name="delete" size={24} color="white" />}
                        onPress={() => { setTransactionID(transaction.ID); setIsDelete(true); }}
                      />
                    </HStack>
                  </HStack>
                </Box>
              ))
            ) : (
              <Text style={globalStyles.text}>No transactions found for the selected date.</Text>
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </Center>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },

});
