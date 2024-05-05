import { Text, Switch, View, StyleSheet, Platform } from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Center, Input, ScrollView, VStack, HStack, IconButton } from "native-base";
import { AntDesign } from '@expo/vector-icons';



export default function HistoryScreen() {

  const [dataTransactions, setDataTransactions] = useState([]);
  const [transactionID, setTransactionID] = useState(0);
  const [isDelete, setIsDelete] = useState(false);

  const fetchTransaction = async () => {
    try {
      const transaction = await axios.get(`http://10.0.2.2:3000/api/transaction/1`);
      setDataTransactions(transaction.data.transactions);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Cannot connent database. Please try again later.");
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await axios.delete(`http://10.0.2.2:3000/api/transaction/delete/${transactionID}`);
      console.log(response.data);
      fetchTransaction();
      setIsDelete(false);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  useEffect(() => {

    if (isDelete) {
      deleteCategory();
    }
  }, [isDelete]);

    return (
      <VStack>
        <HStack space={3} justifyContent="center">
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Year" />
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Month" />
        </HStack>
        <ScrollView>
          <VStack space={4} alignItems="center">
          { dataTransactions.map((transaction) => (
            <Center key={transaction.ID} w="100%" h="20" bg="indigo.300" rounded="md" shadow={3} >
              <HStack space={3} justifyContent="space-between">
                <Text>{dayjs(transaction.date).format("YYYY/MM/DD")}</Text>
                <Text>{transaction.amount}</Text>
                <Text>{transaction.note}</Text>
                <Text>{transaction.category}</Text>
                <IconButton
                  icon={<AntDesign name="edit" size={24} color="black" />}
                  onPress={() => alert("Modify transaction")}
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