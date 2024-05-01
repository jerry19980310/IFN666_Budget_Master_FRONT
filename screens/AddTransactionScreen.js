import { Text, Switch, View, StyleSheet, Platform } from "react-native";
import { useState, useEffect } from "react";
import { GlobalLayout } from "../components/Layout";
import { Box, Center, Input,InputLeftAddon, InputRightAddon, InputGroup, ScrollView, Stack, VStack, HStack, Heading, Button, Icon, IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';





export default function TransactionScreen() {

  const [type, setType] = useState(null);

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
  


  const data_Category = [
    {
      id: '1',
      title: 'Transport',
    },
    {
      id: '2',
      title: 'Food',
    },
    {
      id: '3',
      title: 'Education',
    },
    {
      id: '4',
      title: 'Work out',
    },
  ];

  const [money, setMoney] = useState(0);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // Close picker on iOS after selecting date
    setDate(currentDate);
  };

  useEffect(() => {
    // Reset showPicker state when date changes
    onChange();
    // setShowPicker(false);
  }, [date]);

    return (
      <Center>
        <Box w="75%" maxW="300px" mx="auto">
        <InputGroup w={{
      base: "70%",
      md: "285"
    }}>
        <InputLeftAddon children={"$"} />
        <Input w={{
        base: "70%",
        md: "100%"
      }} placeholder="" />
        <InputRightAddon children={"AUD"} />
      </InputGroup>
      </Box>
      <Box w="75%" maxW="300px" mx="auto">
      <Heading size="md">Category</Heading>
      {data_Category.map((item) => (
        <Button key={item.id} onPress={() => setType(item.title)} size="md" >{item.title}</Button>
      ))}
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
      <Text fontSize="md">{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</Text>
      </Stack>
      </Box>
      <Heading size="md">Note</Heading>
      <Box w="75%" maxW="300px" mx="auto">
      <Input variant="outline" placeholder="" />
        </Box>
        <Box w="75%" maxW="300px" mx="auto">
        <Button leftIcon={<Icon as={AntDesign} name="save" size="sm" />}>
        Save
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