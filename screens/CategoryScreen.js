// CategoryScreen.js
import { Text, StyleSheet, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Center, ScrollView, VStack, HStack, Button, Icon, IconButton } from "native-base";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalLayout } from "../components/Layout";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Checkexp from "../components/CheckExp";
import { createCategory, deleteCategory, initialCategory, fetchCategory } from "../components/ApiController";

export default function CategoryScreen() {
  const [dataCategory, setDataCategories] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isInitial, setIsInitial] = useState(false);
  const [categoryID, setCategoryID] = useState(0);  
  const navigation = useNavigation();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isCreate) {
      handleCreateCategory();
      setIsCreate(false);
    }

    if (isDelete) {
      handleDeleteCategory();
      setIsDelete(false);
    }

    if (isInitial) {
      handleInitialCategory();
      setIsInitial(false);
    }
  }, [isCreate, isDelete, isInitial]);

  useFocusEffect(
    useCallback(() => {
      async function check() {
        const isExpire = await Checkexp();
        console.log(isExpire);
        if (!isExpire) {
          loadCategories();
        } else {
          navigation.navigate("Login");
        }
      }
      check();
    }, [])
  );

  const loadCategories = async () => {
    try {
      const categories = await fetchCategory();
      if (categories.length === 0) {
        setIsInitial(true);
      }
      setDataCategories(categories);
    } catch (error) {
      Alert.alert('ERROR', "Cannot connect to database. Please try again later.");
    }
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory();
      loadCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(categoryID);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleInitialCategory = async () => {
    try {
      await initialCategory();
      loadCategories();
    } catch (error) {
      console.error('Error initializing category:', error);
    }
  };

  return (
    <GlobalLayout>
      <Center>
        <ScrollView>
          {dataCategory.map((item) => (
            <VStack key={item.ID} mb="2.5" mt="1.5" direction="column" space={1}>
              <Center w="300px" h="50px" bg="primary.400" rounded="md" shadow={'5'}>
                <HStack>
                  <Text>{item.name}</Text>
                  <IconButton icon={<Icon as={AntDesign} name="delete" size="sm" />} onPress={() => { setCategoryID(item.ID); setIsDelete(true); }} />
                </HStack>
              </Center>
            </VStack>
          ))}
          <Button leftIcon={<Icon as={Ionicons} name="add-circle-outline" size="sm" />} onPress={() => setIsCreate(true)}>Create</Button>
        </ScrollView>
      </Center>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
});
