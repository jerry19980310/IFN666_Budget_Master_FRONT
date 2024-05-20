import { Text, StyleSheet, Platform, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Box, Center, Input, InputLeftAddon, InputRightAddon, InputGroup, VStack, Heading, Button, Icon, CheckIcon, Select } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkexp from '../components/CheckExp';
import { GlobalStyles } from '../styles/global';
import { GlobalLayout } from '../components/Layout';
import { fetchCategory, updateTransaction } from '../components/ApiController';

export default function ModifyTransactionScreen() {
  const route = useRoute();
  const { transactions } = route.params;
  const [category, setCategory] = useState(transactions.category);
  const [dataCategory, setDataCategories] = useState([]);
  const [money, setMoney] = useState(transactions.amount.toString());
  const [note, setNote] = useState(transactions.note);
  const [date, setDate] = useState(new Date(transactions.date));
  const [showPicker, setShowPicker] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const globalStyles = GlobalStyles();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const loadCategories = async () => {
    try {
      const categories = await fetchCategory();
      setDataCategories(categories);
    } catch (error) {
      // Error handling is done in fetchCategory
    }
  };

  const handleUpdateTransaction = async () => {
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
      handleGoBack();
      Alert.alert('WELL DONE', 'Update transaction successfully!');
    } catch (error) {
      // Error handling is done in updateTransaction
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // Close picker on iOS after selecting date
    setDate(currentDate);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isUpdate) {
      handleUpdateTransaction();
    }
  }, [isUpdate]);

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
        <VStack space={4} w="90%" maxW="400px">
          <Box>
            <Heading size="md" mb={2} style={globalStyles.heading}>Amount</Heading>
            <InputGroup>
              <InputLeftAddon children="$" />
              <Input
                w="80%"
                placeholder="Enter amount"
                onChangeText={v => setMoney(v)}
                value={money}
                keyboardType="numeric"
                style={globalStyles.text}
              />
              <InputRightAddon children="AUD" />
            </InputGroup>
          </Box>

          <Box>
            <Heading size="md" mb={2} style={globalStyles.heading}>Category</Heading>
            <Select
              selectedValue={category}
              minWidth="200"
              accessibilityLabel="Choose Category"
              placeholder="Choose Category"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => setCategory(itemValue)}
              style={globalStyles.text}
            >
              {dataCategory.map(item => (
                <Select.Item key={item.ID} label={item.name} value={item.name} />
              ))}
            </Select>
          </Box>

          <Box>
            <Heading size="md" mb={2} style={globalStyles.heading}>Date</Heading>
            <Button variant="outline" onPress={() => setShowPicker(true)}>
              {dayjs(date).format('YYYY/MM/DD')}
            </Button>
            {showPicker && (
              <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />
            )}
          </Box>

          <Box>
            <Heading size="md" mb={2} style={globalStyles.heading}>Note</Heading>
            <Input
              variant="outline"
              placeholder="Enter note"
              onChangeText={v => setNote(v)}
              value={note}
              style={globalStyles.text}
            />
          </Box>

          <Button
            leftIcon={<Icon as={AntDesign} name="clouduploado" size="sm" />}
            onPress={() => setIsUpdate(true)}
            colorScheme="teal"
            bg="#96B6C5"
            mt={4}
          >
            <Text style={globalStyles.text}>Update</Text>
          </Button>
        </VStack>
      </Center>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeText: {
    fontSize: 20,
  },
});