import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, Dimensions } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { GlobalStyles } from "../styles/global";
import { Center, HStack, ScrollView, VStack, Icon, Pressable } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Checkexp from "../components/CheckExp";
import { fetchSummaryYearMonth } from "../api/ApiController";
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart } from "react-native-chart-kit";
import { useTranslation } from 'react-i18next';
import '../locales/i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  const [summarys, setSummarys] = useState([]);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [isPress, setIsPress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const globalStyles = GlobalStyles();

  const loadSummary = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    navigation.navigate("MonthlyDetial", { year, month });
  };

  useFocusEffect(
    useCallback(() => {
      async function check() {
        const isExpire = await Checkexp();
        if (!isExpire) {
          loadSummary();
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
            backgroundColor: "#eaf4fc",
            backgroundGradientToOpacity: "0.5",
            backgroundGradientFrom: "#fff1cf",
            backgroundGradientTo: "#7ebeab",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(56, 62, 86, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(80, 109, 132, ${opacity})`,
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
      <Center m="2" >
        <Text fontSize="2xl" bold style={[styles.summaryText, globalStyles.text]}>{t('details')}</Text>
      </Center>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto">
          <VStack space={4} alignItems="center">
            {summarys.length > 0 ? (
              summarys.map((data, index) => (
                <Pressable isLoading={isLoading} onPress={() => { setYear(data.year); setMonth(data.month); setIsPress(true) }} key={index} w="100%" bg="#b2cbe4" borderColor="#bbe2f1" p="4" rounded="lg" shadow={2}>
                  <HStack justifyContent="space-between">
                    <VStack space={2}>
                      <HStack alignItems="center" space={3} justifyContent="space-between">
                        <Icon as={MaterialIcons} name="calendar-today" size="md" color="#ffffff" />
                        <Text style={[styles.summaryText, globalStyles.text]}>{t('year')}: {data.year}</Text>
                        <Icon as={MaterialIcons} name="calendar-month" size="md" color="#ffffff" />
                        <Text style={[styles.summaryText, globalStyles.text]}>{t('month')}: {data.month.toString().padStart(2, '0')}</Text>
                      </HStack>
                      <HStack alignItems="center">
                        <Icon as={MaterialIcons} name="attach-money" size="md" color="#ffffff" />
                        <Text style={[styles.amountText, globalStyles.text]}>{t('amount')}: ${data.amount.toFixed(2)}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Pressable>
              ))
            ) : (
              <Text style={[globalStyles.text]}>{t('click_transaction')}</Text>
            )}
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
});
