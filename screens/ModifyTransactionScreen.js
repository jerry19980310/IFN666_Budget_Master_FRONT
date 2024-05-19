import { Text, StyleSheet, Platform, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import dayjs from "dayjs";
import { Box, Center, Input,InputLeftAddon, InputRightAddon, InputGroup, VStack, Heading, Button, Icon, CheckIcon, Select } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "../styles/global";


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
    // Go back to the previous screen
    navigation.goBack();
  };


  console.log(transactions);
  const fetchCategory = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const headers = {
      accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }
    try {
      const category = await axios.get(`http://10.0.2.2:3000/api/category`, {headers});
      setDataCategories(category.data.categories);
    } catch (error) {
      console.error("Error fetching data: ", error);
      Alert.alert('ERROR,', "Cannot connent database. Please try again later.");
    }
  };

  const updateTransaction = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('jwtToken');
    const headers = {
      accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }
    try {
      const response = await axios.put(`http://10.0.2.2:3000/api/transaction/modify/${transactions.ID}`, {
        amount: money,
        user_id: user_id,
        date: dayjs(date).format('YYYY-MM-DD'),
        note: note,
        category: category
      }, {headers});
      handleGoBack();
      Alert.alert('WELL DONE,', "Update transaction successfully!");
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('ERROR,', error.response.data.message);
    }
  };
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // Close picker on iOS after selecting date
    setDate(currentDate);
  };

  useEffect(() => {
    fetchCategory();
  },[]);

  useEffect(() => {
    // Reset showPicker state when date changes
    onChange();
    // setShowPicker(false);

    if(isUpdate) {
      updateTransaction();
    }
  }, [date, isUpdate]);

  return (
    <Center flex={1} px="3">
      <VStack space={4} w="90%" maxW="400px">
        <Box>
          <Heading size="md" mb={2} style={globalStyles.heading}>Amount</Heading>
          <InputGroup>
            <InputLeftAddon children={"$"} />
            <Input
              w="80%"
              placeholder="Enter amount"
              onChangeText={v => setMoney(v)}
              value={money}
              keyboardType="numeric"
              style={globalStyles.text}
            />
            <InputRightAddon children={"AUD"} />
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
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            mt={1}
            onValueChange={itemValue => setCategory(itemValue)}
            style={globalStyles.text}
          >
            {dataCategory.map((item) => (
              <Select.Item key={item.ID} label={item.name} value={item.name} />
            ))}
          </Select>
        </Box>

        <Box>
          <Heading size="md" mb={2} style={globalStyles.heading}>Date</Heading>
          <Button
            variant="outline"
            onPress={() => setShowPicker(true)}
          >
            {dayjs(date).format('YYYY/MM/DD')}
          </Button>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
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
          bg="#D8AE7E"
          mt={4}
        >
          <Text style={globalStyles.text}>Update</Text>
        </Button>
      </VStack>
    </Center>
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
