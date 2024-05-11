import { useState, useEffect, useCallback } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { GlobalStyles } from "../styles/global";
import { Box, Center, HStack, Input, ScrollView, VStack } from "native-base";
import PieChart from 'react-native-pie-chart'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {

  const [money, setMoney] = useState(0);
  const [summarys, setSummarys] = useState([]);
  const [filtersummarys, setFilterSummarys] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const globalStyles = GlobalStyles();

  const widthAndHeight = 250
  const series = [123, 321, 123, 789, 537]
  const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

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
      console.log(response.data.summary);
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

    console.log(typeof year, month);

    if (!year || !month) {
      setFilterSummarys(summarys);
      return;
    }

    const filtered = summarys.filter((summary) => { 
      return summary.Year === Number(year) && summary.Month === Number(month);
    });
    setFilterSummarys(filtered);

    console.log(filtered);

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
      fetchSummary();
      setYear('');
      setMonth('');
    }, [])
  );


  useEffect(() => {
    handlefilter();    
  }, [year, month]);

  return (
    <GlobalLayout>
      <Center>
        <HStack space={3} justifyContent="center">
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Year" onChangeText={v => setYear(v)} value={year} keyboardType='numeric'/>
          <Input w={{
            base: "25%",
            md: "25%"
          }} variant="outline" placeholder="Month" onChangeText={v => setMonth(v)} value={month} keyboardType='numeric'/>
        </HStack>
        {/* <Box>
        <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          >ABC</PieChart>
          
        </Box> */}
        <Text bold>Total: $ {money} AUD</Text>

        <ScrollView>
          <VStack space={4} alignItems="center">
            { filtersummarys.map((summary) => (
              <Center w="64" h="20" bg="indigo.300" rounded="md" shadow={3} >
                <Text>{summary.category}</Text>
                <Text>{summary.amount}</Text>
              </Center>
            ))}
            
          </VStack>
        </ScrollView>

      </Center>

    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  touchable: {
    height: "100%",
  },
});