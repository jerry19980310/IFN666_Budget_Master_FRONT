import { Text, Switch, View, StyleSheet, Platform } from "react-native";
import { useState, useEffect } from "react";
import { GlobalLayout } from "../components/Layout";
import { Box, Center, Input,InputLeftAddon, InputRightAddon, InputGroup, ScrollView, Stack, VStack, HStack, Heading, Button, Icon, IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function HistoryScreen() {

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
      <VStack>
        <HStack space={3} justifyContent="center">
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Year" />
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Month" />
        </HStack>
        <ScrollView>
          <VStack space={4} alignItems="center">
            <Center w="64" h="20" bg="indigo.300" rounded="md" shadow={3} > Transaction1 </Center>
            <Center w="64" h="20" bg="indigo.500" rounded="md" shadow={3} > Transaction2 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Transaction3 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Transaction4 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Transaction5 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Transaction6 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Transaction7 </Center>
          </VStack>
        </ScrollView>
      </VStack>

    );
  }
  
  const styles = StyleSheet.create({
    view: {
      flexDirection: "row",
      alignItems: "center",
    },
  });