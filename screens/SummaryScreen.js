import { Text, StyleSheet, Platform, Alert, Dimensions } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { Box, Center, HStack, ScrollView, VStack, Icon } from "native-base";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Checkexp from '../components/CheckExp';
import { GlobalStyles } from '../styles/global';
import { GlobalLayout } from '../components/Layout';
import { fetchSummaryCategory } from '../api/ApiController';
import { PieChart } from 'react-native-chart-kit';

export default function SummaryScreen() {
  const route = useRoute();
  const { year, month } = route.params;
  const [datas, setDatas] = useState([]);
  const [queryyear, setQueryYear] = useState(year);
  const [querymonth, setQueryMonth] = useState(month);
  const [filterDatas, setFilterDatas] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pieData, setPieData] = useState([]);
  const globalStyles = GlobalStyles();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleFilter = (dataList = datas) => {
    const filtered = dataList.filter(summary =>
      summary.year === Number(queryyear) && summary.month === Number(querymonth)
    );
    setFilterDatas(filtered);
    const totalAmount = filtered.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(totalAmount.toFixed(2));
  };

  const loadSummaryCategory = async () => {
    try {
      setIsLoading(true);
      const summary = await fetchSummaryCategory();
      setDatas(summary);
      handleFilter(summary);
    } catch (error) {
      // Error handling is done in fetchSummaryCategory
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummaryCategory();
  }, []);

  useEffect(() => {
    handlePieData();
    const piechart = handlePieData();
    setPieData(piechart);

  }, [filterDatas]);

  // useFocusEffect(
  //   useCallback(() => {
  //     async function check() {
  //       const isExpire = await Checkexp();
  //       if (!isExpire) {
  //         loadSummaryCategory();
  //       } else {
  //         navigation.navigate('Login');
  //       }
  //     }
  //     check();
  //   }, [navigation])
  // );

  const generateRandomPastelColor = () => {
    const pastelColors = [
      '#D6DAC8',
      '#ECB176',
      '#6F4E37',
      '#C7B7A3',
      '#B5C18E',
      '#9CAFAA',
      '#D37676',
      '#F1EF99',
      '#124076',
      '#7F9F80',
      '#B5C0D0',
      '#EED3D9',
      '#9B4444',
      '#607274',
      '#F8DFD4',
      '#D5B4B4',
      '#AD88C6',
      '#B4B4B8',
      '#DCBFFF',
      '#FDCEDF',
      '#FFAF45',
      '#FFE382',
      '#CAEDFF',
      '#DB005B',
    ];
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(generateRandomPastelColor());
    }
    return colors;
  };

  const colors = generateColors(filterDatas.length);

  const handlePieData = () => {
    const pieData = filterDatas.map((item, index) => ({
      name: item.category,
      population: item.amount,
      color: colors[index],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }));
    return pieData;
  };

  return (
    <GlobalLayout>
      <Center>
        <HStack alignItems="center" space={3} justifyContent="space-between">
          <Icon as={MaterialIcons} name="calendar-month" size="lg" color="#EEE0C9" />
          <Text style={[styles.summaryText, globalStyles.text]}>{queryyear}-{querymonth.toString().padStart(2, '0')}</Text>
        </HStack>
      </Center>

      <VStack space={4} w="90%" maxW="400px" mx="auto" >
        <PieChart
          data={pieData}
          width={(Dimensions.get("window").width)}
          height={240}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          center={[0, 0]}
        />
      </VStack>

      <Center m="3">
        <Text fontSize="2xl" bold style={[styles.summaryText, globalStyles.text]}>Total: $ {totalAmount} AUD</Text>
      </Center>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto">
          <VStack space={4} alignItems="center">
            {filterDatas.map((data, index) => (
              <Box key={index} w="100%" bg="#B3C8CF" p="4" rounded="md" shadow={1}>
                <HStack justifyContent="space-between">
                  <VStack space={2}>
                    <HStack alignItems="center">
                      <Icon as={MaterialCommunityIcons} name="tag-outline" size="sm" color="#EEE0C9" />
                      <Text style={[styles.categoryText, globalStyles.text]}>Category: {data.category}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon as={MaterialIcons} name="attach-money" size="sm" color="#EEE0C9" />
                      <Text style={[styles.amountText, globalStyles.text]}>Amount: ${data.amount.toFixed(2)}</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </ScrollView>

    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    // flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    color: "#001C30",
  },
  categoryText: {
    color: "#176B87",
    marginLeft: 8,
  },
  amountText: {
    color: "#3C5B6F",
    marginLeft: 8,
  },
  largeText: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
