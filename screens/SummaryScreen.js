import { Text, StyleSheet, Platform, Alert, Dimensions } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { Box, Center, HStack, ScrollView, VStack, Icon } from "native-base";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Checkexp from '../components/CheckExp';
import { GlobalStyles } from '../styles/global';
import { GlobalLayout } from '../components/Layout';
import { fetchSummaryCategory } from '../components/ApiController';
import { PieChart } from 'react-native-chart-kit';

export default function SummaryScreen() {
  const route = useRoute();
  const { year, month } = route.params;
  const [datas, setDatas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [queryyear, setQueryYear] = useState(year);
  const [querymonth, setQueryMonth] = useState(month);
  const [filterDatas, setFilterDatas] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const globalStyles = GlobalStyles();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const generateRandomPinkColor = () => {
    const red = 255; 
    const green = Math.floor(Math.random() * 156) + 100;
    const blue = Math.floor(Math.random() * 156) + 100;
    return `rgb(${red},${green},${blue})`;
  };

  const generatePinkColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(generateRandomPinkColor());
    }
    return colors;
  };

  const colors = generatePinkColors(filterDatas.length);

  const pieData = filterDatas.map((item, index) => ({
    name: item.category,
    population: item.amount,
    color: colors[index],
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }));

  const handleFilter = (dataList = datas) => {
    const filtered = dataList.filter(summary =>
      summary.year === Number(queryyear) && summary.month === Number(querymonth)
    );
    setFilterDatas(filtered);
    const totalAmount = filtered.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(totalAmount);
  };

  const handleCategory = () => {
    const categoryList = datas.map(item => item.category);
    setCategories(categoryList);
  }


  const loadCategories = async () => {
    try {
      const summary = await fetchSummaryCategory();
      console.log(summary);
      setDatas(summary);
      handleFilter(summary);
      handleCategory();

    } catch (error) {
      // Error handling is done in fetchSummaryCategory
    }
  };


  useEffect(() => {
    loadCategories();

  }, []);


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

  const pieChartData = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "New York",
      population: 8538000,
      color: "#ffffff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Moscow",
      population: 11920000,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];

  return (
    <GlobalLayout>
      <VStack space={4} w="90%" maxW="400px" mx="auto" >
        <PieChart
          data={pieData}
          width={(Dimensions.get("window").width)} // from react-native
          height={245}
          chartConfig={{
            backgroundColor: "#D5F0C1",
            backgroundGradientToOpacity: "0.5",
            backgroundGradientFrom: "#96B6C5",
            backgroundGradientTo: "#5F5D9C",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#80BCBD"
            }
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 50]}
          absolute
        />

      </VStack>

      <Center>
        <Text fontSize="2xl" bold style={[styles.summaryText, globalStyles.text]}>Total: $ {totalAmount.toFixed()} AUD</Text>

      </Center>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto">
          <VStack space={4} alignItems="center">
            {filterDatas.map((data, index) => (
              <Box key={index} w="100%" bg="#B3C8CF" p="4" rounded="md" shadow={1}>
                <HStack justifyContent="space-between">
                  <VStack space={2}>
                    <HStack alignItems="center" space={3} justifyContent="space-between">
                      <Icon as={MaterialIcons} name="calendar-today" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>Year: {data.year}</Text>
                      <Icon as={MaterialIcons} name="calendar-month" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>Month: {data.month}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon as={MaterialCommunityIcons} name="tag-outline" size="sm" color="#EEE0C9" />
                      <Text style={[styles.categoryText, globalStyles.text]}>Category: {data.category}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon as={MaterialIcons} name="attach-money" size="sm" color="#EEE0C9" />
                      <Text style={[styles.amountText, globalStyles.text]}>Amount: ${data.amount}</Text>
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
    flexGrow: 1,
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
});
