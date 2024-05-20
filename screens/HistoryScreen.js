// HistoryScreen.js
import { Text, StyleSheet, Alert } from "react-native";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { Center, Input, ScrollView, VStack, HStack, IconButton, Box, Icon } from "native-base";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkexp from "../components/CheckExp";
import { GlobalStyles } from "../styles/global";
import { GlobalLayout } from "../components/Layout";
import { fetchTransaction, deleteTransaction } from "../components/ApiController";

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
  const navigation = useNavigation();

  const loadTransactions = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    try {
      const transactions = await fetchTransaction(user_id);
      setDataTransactions(transactions);
      setFilterTransactions(transactions);
    } catch (error) {
      // Error handling is done in fetchTransaction
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      console.log(transactionID);
      await deleteTransaction(transactionID);
      await loadTransactions();
      setIsDelete(false);
    } catch (error) {
      // Error handling is done in deleteTransaction
    }
  };

  const handleModifyTransaction = () => {
    navigation.navigate("ModifyTransaction", { transactions });
  };

  const handleFilter = () => {
    if (!year || !month) {
      setFilterTransactions(dataTransactions);
      return;
    }
    const filtered = dataTransactions.filter(transaction => {
      return dayjs(transaction.date).format("YYYY") === year && dayjs(transaction.date).format("MM") === String(month).padStart(2, '0');
    });
    setFilterTransactions(filtered);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (isDelete) {
      handleDeleteTransaction();
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
        if (!isExpire) {
          loadTransactions();
          setYear('');
          setMonth('');
        } else {
          navigation.navigate("Login");
        }
      }
      check();
    }, [])
  );

  useEffect(() => {
    handleFilter();
  }, [year, month]);

  return (
    <GlobalLayout>
      <HStack space={3} justifyContent="center" mb="4">
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
      <Center flex={1} px="3" mt="4"></Center>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto" alignItems="center">
          {filterTransactions.length > 0 ? (
            filterTransactions.map(transaction => (
              <Box key={transaction.ID} p="4" bg="#96B6C5" rounded="md" shadow={2} mb={2} w="100%">
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack space={2} w="70%">
                    <HStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="date-range" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>{dayjs(transaction.date).format("YYYY/MM/DD")}</Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="category" size="sm" color="#EEE0C9" />
                      <Text style={[styles.categoryText, globalStyles.text]}>{transaction.category}</Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="attach-money" size="sm" color="#EEE0C9" />
                      <Text style={[styles.amountText, globalStyles.text]}>${transaction.amount}</Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="note" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>{transaction.note}</Text>
                    </HStack>
                  </VStack>
                  <HStack space={2}>
                    <IconButton
                      icon={<AntDesign name="edit" size={24} color="#135D66" />}
                      onPress={() => { setTransactions(transaction); setIsModify(true); }}
                    />
                    <IconButton
                      icon={<AntDesign name="delete" size={24} color="#A91D3A" />}
                      onPress={() => { setTransactionID(transaction.ID); setIsDelete(true); }}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))
          ) : (
            <Text style={[styles.summaryText, globalStyles.text]}>No transactions found for the selected date.</Text>
          )}
        </VStack>
      </ScrollView>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 8,
    color: '#001C30',
  },
  largeText: {
    fontSize: 20,
  },
  amountText: {
    color: "#3C5B6F",
    marginLeft: 8,
  },
  categoryText: {
    color: "#176B87",
    marginLeft: 8,
  },
});
