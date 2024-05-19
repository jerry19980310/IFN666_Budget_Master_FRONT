import { Text, StyleSheet, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Box, Center, Input,InputLeftAddon, InputRightAddon, InputGroup, VStack, Heading, Button, Icon, CheckIcon, Select } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Checkexp from "../components/CheckExp";
import { useMyTheme } from '../context/mytheme';


export default function TransactionScreen() {

  const [category, setCategory] = useState('');
  const [dataCategory, setDataCategories] = useState([]);
  const [money, setMoney] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const navigation = useNavigation();
  const { isLargeText } = useMyTheme();



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
      alert("Cannot connent database. Please try again later.");
    }
  };

  const newTransaction = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('jwtToken');
    const headers = {
      accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }
    try {
      const response = await axios.post('http://10.0.2.2:3000/api/transaction/create', {
        amount: money,
        user_id: user_id,
        date: dayjs(date).format('YYYY-MM-DD'),
        note: note,
        category: category
      }, {headers});
      setIsSave(false);
      setCategory('');
      setMoney('');
      setNote('');
      setDate(new Date());
      alert("Add transaction successfully!");
    } catch (error) {
      alert('Error posting data. Please try again later.');
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

  useFocusEffect(
    useCallback(() => {
      async function check() {
      const isExpire = await Checkexp();
      if(!isExpire){
        fetchCategory();
      }
      else {
        navigation.navigate("Login");
      }
    }
    check();
    }, [])
  );

  useEffect(() => {
    
    onChange();

    if(isSave) {
      newTransaction();
    }
  }, [date, isSave]);

  return (
    <Center flex={1} px="3">
      <VStack space={4} w="90%" maxW="400px">
        <Box>
          <Heading size="md" mb={2} style={isLargeText && styles.largeText}>Amount</Heading>
          <InputGroup>
            <InputLeftAddon children={"$"} />
            <Input
              w="80%"
              placeholder="Enter amount"
              onChangeText={v => setMoney(v)}
              value={money}
              keyboardType="numeric"
              style={isLargeText && styles.largeText}
            />
            <InputRightAddon children={"AUD"} />
          </InputGroup>
        </Box>

        <Box>
          <Heading size="md" mb={2} style={isLargeText && styles.largeText}>Category</Heading>
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
            style={isLargeText && styles.largeText}
          >
            {dataCategory.map((item) => (
              <Select.Item key={item.ID} label={item.name} value={item.name} />
            ))}
          </Select>
        </Box>

        <Box>
          <Heading size="md" mb={2} style={isLargeText && styles.largeText}>Date</Heading>
          <Button
            variant="outline"
            onPress={() => setShowPicker(true)}
          >
            {dayjs(date).format("YYYY/MM/DD")}
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
          <Heading size="md" mb={2} style={isLargeText && styles.largeText}>Note</Heading>
          <Input
            variant="outline"
            placeholder="Enter note"
            onChangeText={v => setNote(v)}
            value={note}
            style={isLargeText && styles.largeText}
          />
        </Box>

        <Button
          bg="#D8AE7E"
          leftIcon={<Icon as={AntDesign} name="save" size="sm" />}
          onPress={() => setIsSave(true)}
          colorScheme="teal"
          mt={4}
        >
          <Text style={isLargeText && styles.largeText}>Save</Text>
        </Button>
      </VStack>
    </Center>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  largeText: {
    fontSize: 20,
  },
});