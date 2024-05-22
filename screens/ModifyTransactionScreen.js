import React, { useEffect, useCallback, useState } from "react";
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Center, useToast } from "native-base";
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalLayout } from "../components/Layout";
import { fetchCategory, updateTransaction } from "../components/ApiController";
import Checkexp from "../components/CheckExp";
import TransactionForm from "../components/TransactionForm";
import MyAlert from "../components/MyAlert";

export default function ModifyTransactionScreen() {
  const route = useRoute();
  const { transactions } = route.params;
  const [dataCategory, setDataCategories] = useState([]);
  const navigation = useNavigation();

  const toast = useToast();

  const loadCategories = async () => {
    try {
      const categories = await fetchCategory();
      setDataCategories(categories);
    } catch (error) {
      // Error handling is done in fetchCategory
    }
  };

  const handleUpdateTransaction = async ({ money, date, note, category }) => {
    const user_id = await AsyncStorage.getItem('userId');
    const transactionData = {
      amount: money,
      user_id,
      date: dayjs(date).format('YYYY-MM-DD'),
      note,
      category,
    };
    try {
      await updateTransaction(transactions.ID, transactionData);
      navigation.goBack();
      toast.show({
        render: () => (
          <MyAlert title="Success" description="Update transaction successfully!" variant="top-accent" status="success" />
        ),
        duration: 3000,
        placement: "top"
      });
    } catch (error) {
      // Error handling is done in updateTransaction
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function check() {
        const isExpire = await Checkexp();
        if (!isExpire) {
          loadCategories();
        } else {
          navigation.navigate('Login');
        }
      }
      check();
    }, [navigation])
  );

  return (
    <GlobalLayout>
      <Center flex={1} px="3">
        <TransactionForm
          initialData={{
            money: transactions.amount.toString(),
            category: transactions.category,
            date: new Date(transactions.date),
            note: transactions.note
          }}
          onSubmit={handleUpdateTransaction}
          categories={dataCategory}
        />
      </Center>
    </GlobalLayout>
  );
}
