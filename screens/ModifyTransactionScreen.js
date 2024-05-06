import { Text, StyleSheet, Platform } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import dayjs from "dayjs";
import { Box, Center, Input,InputLeftAddon, InputRightAddon, InputGroup, Stack, Heading, Button, Icon, CheckIcon, Select } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';





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


  const navigation = useNavigation();

  const handleGoBack = () => {
    // Go back to the previous screen
    navigation.goBack();
  };


  console.log(transactions);
  const fetchCategory = async () => {
    try {
      const category = await axios.get(`http://10.0.2.2:3000/api/category/1`);
      setDataCategories(category.data.categories);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Cannot connent database. Please try again later.");
    }
  };

  const updateTransaction = async () => {
    try {
      const response = await axios.put(`http://10.0.2.2:3000/api/transaction/modify/${transactions.ID}`, {
        amount: money,
        user_id: '1',
        date: dayjs(date).format('YYYY-MM-DD'),
        note: note,
        category: category
      });
      handleGoBack();
      alert("Update transaction successfully!");
    } catch (error) {
      console.error('Error posting data:', error);
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

<Center alignItems="center">
  <Box w="75%" maxW="300px" mx="auto">
    <InputGroup w={{
      base: "70%",
      md: "285"
    }}>
      <InputLeftAddon children={"$"} />
      <Input w={{ base: "70%",md: "100%" }} placeholder="" onChangeText={v => setMoney(v)} value={money} />
      <InputRightAddon children={"AUD"} />
    </InputGroup>
  </Box>
  <Box w="75%" maxW="300px" mx="auto">
    <Heading size="md">Category</Heading>
    <Select selectedValue={category} minWidth="200" accessibilityLabel="Choose Category" placeholder="Choose Category" _selectedItem={{
      bg: "teal.600",
      endIcon: <CheckIcon size="5" />
    }} mt={1} onValueChange={itemValue => setCategory(itemValue)}>
      {dataCategory.map((item) => (
        <Select.Item key={item.ID} label={item.name} value={item.name} />
      ))}
    </Select>
    <Heading size="md">Date</Heading>
  </Box>
  <Box w="75%" mx="auto">
    <Button onPress={() => setShowPicker(true)} >Date</Button>
    {showPicker && (
      <DateTimePicker
        value={date}
        mode="date" // Change mode to 'datetime' for date and time picker
        display="default"
        onChange={onChange}
      />
    )}
    <Stack space={2}>
      <Text fontSize="md">{dayjs(date).format("YYYY/MM/DD")}</Text>
    </Stack>
  </Box>
  <Heading size="md">Note</Heading>
  <Box w="75%" maxW="300px" mx="auto">
    <Input variant="outline" placeholder="" onChangeText={v => setNote(v)} value={note} />
  </Box>
  <Box w="75%" maxW="300px" mx="auto">
    <Button leftIcon={<Icon as={AntDesign} name="clouduploado" size="sm" />} onPress={() => setIsUpdate(true)} >
      Update
    </Button>

  </Box>
</Center>


      
        
    );
  }
  
  const styles = StyleSheet.create({
    view: {
      flexDirection: "row",
      alignItems: "center",
    },
  });