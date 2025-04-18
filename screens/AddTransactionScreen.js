import React, { useCallback } from "react";
import { useState } from "react";
import { Center, useToast } from "native-base";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GlobalLayout } from "../components/Layout";
import { fetchCategory, newTransaction } from "../functions/ApiController";
import Checkexp from "../auth/CheckExp";
import MyAlert from "../components/MyAlert";
import TransactionForm from "../components/TransactionForm";

export default function TransactionScreen() {
  const [dataCategory, setDataCategories] = useState([]);
  const navigation = useNavigation();
  const toast = useToast();

  const loadCategories = async () => {
    try {
      const categories = await fetchCategory();
      setDataCategories(categories);
    } catch (error) {

    }
  };

  const handleNewTransaction = async ({ money, date, note, category }) => {
    try {
      await newTransaction(money, date, note, category);
      toast.show({
        render: () => (
          <MyAlert title="Success" description="Transaction saved successfully" variant="top-accent" status="success" />
        ),
        duration: 3000,
        placement: "top"
      });
    } catch (error) {
      // Error handling is done in newTransaction
    }
  };


  useFocusEffect(
    useCallback(() => {
      async function check() {
        const isExpire = await Checkexp();
        if (!isExpire) {
          loadCategories();
        } else {
          navigation.navigate("Login");
        }
      }
      check();
    }, [])
  );

  return (
    <GlobalLayout>
      <Center flex={1} px="3">
        <TransactionForm
          initialData={{}}
          onSubmit={handleNewTransaction}
          categories={dataCategory}
          isNew={true}
        />
      </Center>
    </GlobalLayout>
  );
}
