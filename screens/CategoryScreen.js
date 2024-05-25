import { Text, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FlatList, VStack, HStack, Button, Icon, IconButton, Input, Box, useToast } from "native-base";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { GlobalLayout } from "../components/Layout";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Checkexp from "../auth/CheckExp";
import { createCategory, deleteCategory, initialCategory, fetchCategory } from "../functions/ApiController";
import { GlobalStyles } from "../styles/global";
import MyAlert from "../components/MyAlert";
import { useTranslation } from 'react-i18next';

export default function CategoryScreen() {
  const { t } = useTranslation();
  const [dataCategory, setDataCategories] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isInitial, setIsInitial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryID, setCategoryID] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const navigation = useNavigation();
  const toast = useToast();
  const globalStyles = GlobalStyles();

  useEffect(() => {
    if (isCreate) {
      if (!categoryName) {
        toast.show({
          render: () => (
            <MyAlert title="Warning" description="Please enter the category name" variant="subtle" status="warning" />
          ),
          duration: 3000,
          placement: "top"
        });
        setIsCreate(false);
        return;
      }
      else {
        handleCreateCategory();
        setIsCreate(false);
        setCategoryName('');
      }
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
          setCategoryName('');
          loadCategories();
        } else {
          navigation.navigate("Login");
        }
      }
      check();
    }, [])
  );

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categories = await fetchCategory();
      if (categories.length === 0) {
        setIsInitial(true);
      }
      setDataCategories(categories);
    } catch (error) {
      // Error handling is done in fetchCategory
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName) {
      toast.show({
        render: () => (
          <MyAlert title="Warning" description="Please enter the category name" variant="subtle" status="warning" />
        ),
        duration: 3000,
        placement: "top"
      });
      return;
    }
    try {
      await createCategory(categoryName);
      loadCategories();
      toast.show({
        render: () => (
          <MyAlert title="Success" description="Category created successfully" variant="top-accent" status="success" />
        ),
        duration: 3000,
        placement: "top"
      });
    } catch (error) {
      // Error handling is done in createCategory

    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(categoryID);
      loadCategories();
      toast.show({
        render: () => (
          <MyAlert title="Success" description="Category deleted successfully" variant="top-accent" status="success" />
        ),
        duration: 3000,
        placement: "top"
      });
    } catch (error) {
      // Error handling is done in deleteCategory
    }
  };

  const handleInitialCategory = async () => {
    try {
      await initialCategory();
      loadCategories();
    } catch (error) {
     // Error handling is done in initialCategory
    }
  };

  const renderItem = ({ item, index }) => {

    const { width } = Dimensions.get('window');
    const itemWidth = (width - 32) / 2;
    const isOddItem = index % 2 !== 0;
    return (
      <Box rounded="md" style={[styles.item, { width: itemWidth, marginLeft: isOddItem ? 8 : 0 }]} >
        <HStack justifyContent="space-between" alignItems="center" w="100%">
          <Text style={[globalStyles.text, { flexShrink: 1 }]}>
            {index + 1}. {item.name}
          </Text>
          <IconButton
            p={1}
            icon={<Icon as={AntDesign} name="delete" size="sm" color="#A91D3A" />}
            onPress={() => { setCategoryID(item.ID); setIsDelete(true); }}
          />
        </HStack>
      </Box>
    );

  };

  return (
    <GlobalLayout>
      <VStack space={4} justifyContent="center" w="90%" maxW="400px" mx="auto" my={2}>
        <HStack space={3} justifyContent="center" mb="2">
          <Input
            flex={1}
            variant="outline"
            placeholder={t('enter_category')}
            onChangeText={v => setCategoryName(v)}
            value={categoryName}
            style={globalStyles.text}
          />
          <Button
            bg="#96B6C5"
            colorScheme="teal"
            leftIcon={<Icon as={Ionicons} name="add-circle-outline" size="sm" color="#ffffff" />}
            onPress={() => { setIsCreate(true); setCategoryName(categoryName); }}
            isLoading={isLoading}
          >
            <Text style={globalStyles.text}>{t('new')}</Text>
          </Button>
        </HStack>

      </VStack>
      <Box >
        <FlatList
          data={dataCategory}
          renderItem={renderItem}
          keyExtractor={item => item.ID.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
        />
      </Box>

    </GlobalLayout>
  );
}
const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
  },
  contentContainer: {
    paddingVertical: '5%',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  item: {
    backgroundColor: '#cbb3e6',
    padding: 10,
    marginVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    rounded: 'md',
  },
});
