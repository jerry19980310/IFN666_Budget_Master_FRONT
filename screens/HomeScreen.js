import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, Dimensions } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { GlobalStyles } from "../styles/global";
import { Center, HStack, ScrollView, VStack, Icon, Pressable } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Checkexp from "../components/CheckExp";
import { fetchSummaryYearMonth } from "../components/ApiController";
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart } from "react-native-chart-kit";


export default function HomeScreen() {
  const [summarys, setSummarys] = useState([]);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [isPress, setIsPress] = useState(false);
  const navigation = useNavigation();
  const globalStyles = GlobalStyles();

  const loadSummary = async () => {
    try {
      const summaryData = await fetchSummaryYearMonth();
      setSummarys(summaryData);

      const labels = summaryData.map(item => `${item.year}-${String(item.month).padStart(2, '0')}`);
      const dataValues = summaryData.map(item => item.amount.toFixed(2));
      const result = {
        labels: labels,
        datasets: [
          {
            data: dataValues
          }
        ]
      };
      setBarChartData(result);

    } catch (error) {
      // Error handling is already done in fetchSummaryYearMonth
    }
  };

  const handlePress = () => {
    navigation.navigate("MonthlyDetial", { year, month });
  };

  useEffect(() => {
    loadSummary();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function check() {
        const isExpire = await Checkexp();
        if (!isExpire) {
          loadSummary();
          setYear('');
          setMonth('');
        } else {
          navigation.navigate("Login");
        }
      }
      check();
    }, [])
  );

  useEffect(() => {
    if (isPress) {
      handlePress();
      setIsPress(false);
    }

  }, [isPress]);


  return (
    <GlobalLayout>
      <VStack>
        <BarChart
          data={barChartData}
          width={(Dimensions.get("window").width)}
          height={245}
          fromZero={true}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: "#D5F0C1",
            backgroundGradientToOpacity: "0.5",
            backgroundGradientFrom: "#96B6C5",
            backgroundGradientTo: "#5F5D9C",
            decimalPlaces: 2,
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

          verticalLabelRotation={0}
          showValuesOnTopOfBars={true}
        />
      </VStack>
      <Center>
        <Text fontSize="2xl" bold style={[styles.summaryText, globalStyles.text]}>Details</Text>
      </Center>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto">
          <VStack space={4} alignItems="center">
            {summarys.map((data, index) => (
              <Pressable onPress={() => { setYear(data.year); setMonth(data.month); setIsPress(true) }} key={index} w="100%" bg="#B3C8CF" p="4" rounded="md" shadow={1}>
                <HStack justifyContent="space-between">
                  <VStack space={2}>
                    <HStack alignItems="center" space={3} justifyContent="space-between">
                      <Icon as={MaterialIcons} name="calendar-today" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>Year: {data.year}</Text>
                      <Icon as={MaterialIcons} name="calendar-month" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>Month: {data.month.toString().padStart(2, '0')}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon as={MaterialIcons} name="attach-money" size="sm" color="#EEE0C9" />
                      <Text style={[styles.amountText, globalStyles.text]}>Amount: ${data.amount.toFixed(2)}</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Pressable>
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
