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
  const [queryyear, setQueryYear] = useState(year);
  const [querymonth, setQueryMonth] = useState(month);
  const [filterDatas, setFilterDatas] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pieData, setPieData] = useState([]);
  const globalStyles = GlobalStyles();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
    setQueryYear('');
    setQueryMonth('');
    setFilterDatas([]);
    setTotalAmount(0);
    setPieData([]);

  };

  const handleFilter = (dataList = datas) => {
    const filtered = dataList.filter(summary =>
      summary.year === Number(queryyear) && summary.month === Number(querymonth)
    );
    setFilterDatas(filtered);
    const totalAmount = filtered.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(totalAmount);
  };


  const loadCategories = async () => {
    try {
      const summary = await fetchSummaryCategory();
      setDatas(summary);
      handleFilter(summary);
      
      
    } catch (error) {
      // Error handling is done in fetchSummaryCategory
    }
  };


  useEffect(() => {
    loadCategories();
    console.log("HIII");

  }, []);

  useEffect(() => {
    handlePieData();
    const piechart = handlePieData();
      setPieData(piechart);

  }, [filterDatas]);



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



  const generateRandomPastelColor = () => {
    const pastelColors = [
      '#FFC0CB', // 粉红色
      '#FFB6C1', // 浅粉红色
      '#FF69B4', // 热粉色
      '#DB7093', // 苍白的紫罗兰红色
      '#FF1493', // 深粉色
      '#FF00FF', // 紫红色
      '#BA55D3', // 中紫罗兰色
      '#9370DB', // 中紫色
      '#DA70D6', // 浅紫色
      '#DDA0DD', // 梅红色
      '#EE82EE', // 紫罗兰色
      '#D8BFD8', // 蓟色
      '#DDA0DD', // 梅红色
      '#E6E6FA', // 薰衣草色
      '#B0E0E6', // 粉蓝色
      '#ADD8E6', // 浅蓝色
      '#87CEEB', // 天蓝色
      '#87CEFA', // 淡蓝色
      '#B0C4DE', // 浅钢蓝色
      '#AFEEEE', // 浅绿色
      '#00CED1', // 深浅绿色
      '#48D1CC', // 适中的浅绿色
      '#40E0D0', // 绿宝石色
      '#E0FFFF', // 浅青色
    ];
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };
  
  // 为数据生成颜色数组
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
    // console.log(typeof(pieData[0].population));
    return pieData;
  };


  // (((Number(item.amount)/totalAmount)*100).toFixed(1)).toString(),

  // console.log((((pieData[0].population/totalAmount)*100).toFixed(1)).toString());


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
          width={(Dimensions.get("window").width)} // from react-native
          height={245}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          center={[0, 0]}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
