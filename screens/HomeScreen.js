import { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { GlobalStyles } from "../styles/global";
import { Box, Center, HStack, Input, ScrollView, VStack, Button, Text, Icon } from "native-base";
import PieChart from 'react-native-pie-chart'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Checkexp from "../components/CheckExp";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMyTheme } from '../context/mytheme';

export default function HomeScreen() {

  const [money, setMoney] = useState(0);
  const [summarys, setSummarys] = useState([]);
  const [filtersummarys, setFilterSummarys] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const navigation = useNavigation();
  const globalStyles = GlobalStyles();
  const { isLargeText } = useMyTheme();

  const fetchSummary = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('jwtToken');
    const headers = {
      accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }

    try {
      const response = await axios.get(`http://10.0.2.2:3000/api/transaction/summary/${user_id}`, {headers});
      setSummarys(response.data.summary);
      setFilterSummarys(response.data.summary);
      let mymoney = 0;
      for (let i = 0; i < response.data.summary.length; i++) {
        mymoney = mymoney + response.data.summary[i].amount;
      }
      setMoney(mymoney);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert(error.response.data.message);
    }
  };

  const handlefilter = () => {

    if (!year || !month) {
      setFilterSummarys(summarys);
      let mymoney = 0;
      for (let i = 0; i < summarys.length; i++) {
      mymoney = mymoney + summarys[i].amount;
    }
    setMoney(mymoney);
      return;
    }

    const filtered = summarys.filter((summary) => { 
      return summary.Year === Number(year) && summary.Month === Number(month);
    });
    setFilterSummarys(filtered);

    let mymoney = 0;
    for (let i = 0; i < filtered.length; i++) {
      mymoney = mymoney + filtered[i].amount;
    }
    setMoney(mymoney);

  }

  useEffect(() => {
    fetchSummary();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function check() {
        const isExpire = await Checkexp();
        console.log(isExpire);
        if(!isExpire){
          fetchSummary();
          setYear('');
          setMonth('');
        }
        else{
          navigation.navigate("Login");
        } 
      }
      check();
    }, [])
  );

  useEffect(() => {
    handlefilter();    
  }, [year, month]);

  return (
    <GlobalLayout>
      <Center flex={1} px="3">
        <VStack space={4} w="90%" maxW="400px">
          <HStack space={3} justifyContent="center">
            <Input 
              w="45%" 
              variant="outline" 
              placeholder="Year" 
              onChangeText={v => setYear(v)} 
              value={year} 
              keyboardType='numeric' 
              style={isLargeText && styles.largeText}
            />
            <Input 
              w="45%" 
              variant="outline" 
              placeholder="Month" 
              onChangeText={v => setMonth(v)} 
              value={month} 
              keyboardType='numeric' 
              style={isLargeText && styles.largeText}
            />
          </HStack>
          <Center>
            <Text fontSize="2xl" bold style={isLargeText && styles.largeText}>Total: $ {money.toFixed()} AUD</Text>
          </Center>
          <ScrollView >
            <VStack space={4} alignItems="center">
              {filtersummarys.map((summary, index) => (
                <Box key={index} w="100%" bg="#D8AE7E" p="4" rounded="md" shadow={3}>
                  <HStack justifyContent="space-between">
                    <VStack space={2}>
                      <HStack alignItems="center" space={3} justifyContent="space-between">
                        <Icon as={MaterialIcons} name="calendar-today" size="sm" color="#fff" />
                        <Text style={[styles.summaryText, isLargeText && styles.largeText]} bold> Year: {summary.Year}</Text>
                        <Text style={[styles.summaryText, isLargeText && styles.largeText]} bold> Month: {summary.Month}</Text>
                      </HStack>
                      <HStack alignItems="center">
                        <Icon as={MaterialCommunityIcons} name="tag-outline" size="sm" color="#fff" />
                        <Text style={[styles.summaryText, isLargeText && styles.largeText]}> Category: {summary.category}</Text>
                      </HStack>
                      <HStack alignItems="center">
                        <Icon as={MaterialIcons} name="attach-money" size="sm" color="#fff" />
                        <Text style={[styles.summaryText, isLargeText && styles.largeText]}> Amount: ${summary.amount}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </ScrollView>
        </VStack>
      </Center>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  summaryText: {
    color: "#fff",
    marginLeft: 8,
  },
  largeText: {
    fontSize: 20,
  },
});
