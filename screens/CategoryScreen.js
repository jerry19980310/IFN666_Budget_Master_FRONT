import { Text, StyleSheet, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Center, FlatList, VStack, HStack, Button, Icon, IconButton, Input, Box } from "native-base";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalLayout } from "../components/Layout";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Checkexp from "../components/CheckExp";
import { createCategory, deleteCategory, initialCategory, fetchCategory } from "../components/ApiController";
import { GlobalStyles } from "../styles/global";

export default function CategoryScreen() {
  const [dataCategory, setDataCategories] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isInitial, setIsInitial] = useState(false);
  const [categoryID, setCategoryID] = useState(0);
  const [categoryName, setCategoryName] = useState('');  
  const navigation = useNavigation();

  const globalStyles = GlobalStyles();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isCreate) {
      handleCreateCategory();
      setIsCreate(false);
      setCategoryName('');
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
      await createCategory(categoryName);
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

  const renderItem = ({ item }) => (
    <Box m={1} p="4" bg="#96B6C5" shadow={2} mb={2} w="50%" >
      <HStack justifyContent="space-between" alignItems="center">
        <Text style={globalStyles.text}>{item.name}</Text>
        <IconButton
          icon={<Icon as={AntDesign} name="delete" size="sm" color="#A91D3A" />}
          onPress={() => { setCategoryID(item.ID); setIsDelete(true); }}
        />
      </HStack>
    </Box>
  );

  return (
    <GlobalLayout>
      <VStack space={4} w="90%" maxW="400px" mx="auto" my={4}>
        <HStack space={3} justifyContent="center" mb="4">
          <Input
            flex={1}
            variant="outline"
            placeholder="Enter a new category"
            onChangeText={v => setCategoryName(v)}
            value={categoryName}
            style={globalStyles.text}
          />
          <Button
            bg="#96B6C5"
            colorScheme="teal"
            leftIcon={<Icon as={Ionicons} name="add-circle-outline" size="sm" color="#EEE0C9" />}
            onPress={() => { setIsCreate(true); setCategoryName(categoryName); }}
          >
            <Text style={globalStyles.text}>New</Text>
          </Button>
        </HStack>
        <FlatList
          data={dataCategory}
          renderItem={renderItem}
          keyExtractor={item => item.ID.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
        />
      </VStack>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
  },
  contentContainer: {
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

