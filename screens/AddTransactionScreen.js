import { Text, StyleSheet, Platform, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Box, Center, Input, InputLeftAddon, InputRightAddon, InputGroup, VStack, Heading, Button, Icon, CheckIcon, Select } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Checkexp from "../components/CheckExp";
import { GlobalLayout } from "../components/Layout";
import { GlobalStyles } from "../styles/global";
import { fetchCategory, newTransaction } from "../components/ApiController";
import dayjs from 'dayjs'; 

export default function TransactionScreen() {
  const [category, setCategory] = useState('');
  const [dataCategory, setDataCategories] = useState([]);
  const [money, setMoney] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const navigation = useNavigation();
  const globalStyles = GlobalStyles();

  const loadCategories = async () => {
    try {
      const categories = await fetchCategory();
      setDataCategories(categories);
    } catch (error) {
      Alert.alert('ERROR', "Cannot connect to database. Please try again later.");
    }
  };

  const handleNewTransaction = async () => {
    try {
      await newTransaction(money, date, note, category);
      setIsSave(false);
      setCategory('');
      setMoney('');
      setNote('');
      setDate(new Date());
      Alert.alert("WELL DONE", "Add transaction successfully!");
    } catch (error) {
      console.error('Error creating transaction:', error);
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

  useEffect(() => {
    onChange();

    if (isSave) {
      handleNewTransaction();
    }
  }, [date, isSave]);

  return (
    <GlobalLayout>
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
            bg="#96B6C5"
            leftIcon={<Icon as={AntDesign} name="save" size="sm" />}
            onPress={() => setIsSave(true)}
            colorScheme="teal"
            mt={4}
          >
            <Text style={globalStyles.text}>Save</Text>
          </Button>
        </VStack>
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
