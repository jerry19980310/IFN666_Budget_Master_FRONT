import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { GlobalStyles } from "../styles/global";
import { Box, Center, HStack, Input, ScrollView, VStack, Icon } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Checkexp from "../components/CheckExp";
import { fetchSummary } from "../components/ApiController";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [money, setMoney] = useState(0);
  const [summarys, setSummarys] = useState([]);
  const [filtersummarys, setFilterSummarys] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const navigation = useNavigation();
  const globalStyles = GlobalStyles();

  const loadSummary = async () => {
    try {
      const summaryData = await fetchSummary();
      setSummarys(summaryData);
      setFilterSummarys(summaryData);
      let totalAmount = summaryData.reduce((sum, item) => sum + item.amount, 0);
      setMoney(totalAmount);
    } catch (error) {
      // Error handling is already done in fetchSummary
    }
  };

  const handleFilter = () => {
    if (!year || !month) {
      setFilterSummarys(summarys);
      let totalAmount = summarys.reduce((sum, item) => sum + item.amount, 0);
      setMoney(totalAmount);
      return;
    }

    const filtered = summarys.filter(summary => 
      summary.Year === Number(year) && summary.Month === Number(month)
    );
    setFilterSummarys(filtered);
    let totalAmount = filtered.reduce((sum, item) => sum + item.amount, 0);
    setMoney(totalAmount);
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
    handleFilter();
  }, [year, month]);

  return (
    <GlobalLayout>
      <HStack space={3} justifyContent="center" mt="2">
        <Input
          w="45%"
          variant="outline"
          placeholder="Year"
          onChangeText={v => setYear(v)}
          value={year}
          keyboardType='numeric'
          style={globalStyles.text}
        />
        <Input
          w="45%"
          variant="outline"
          placeholder="Month"
          onChangeText={v => setMonth(v)}
          value={month}
          keyboardType='numeric'
          style={globalStyles.text}
        />
      </HStack>
      <Center>
        <Text fontSize="2xl" bold style={[styles.summaryText, globalStyles.text]}>Total: $ {money.toFixed()} AUD</Text>
      </Center>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto">
          <VStack space={4} alignItems="center">
            {filtersummarys.map((summary, index) => (
              <Box key={index} w="100%" bg="#96B6C5" p="4" rounded="md" shadow={3}>
                <HStack justifyContent="space-between">
                  <VStack space={2}>
                    <HStack alignItems="center" space={3} justifyContent="space-between">
                      <Icon as={MaterialIcons} name="calendar-today" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>Year: {summary.Year}</Text>
                      <Icon as={MaterialIcons} name="calendar-month" size="sm" color="#EEE0C9" />
                      <Text style={[styles.summaryText, globalStyles.text]}>Month: {summary.Month}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon as={MaterialCommunityIcons} name="tag-outline" size="sm" color="#EEE0C9" />
                      <Text style={[styles.categoryText, globalStyles.text]}>Category: {summary.category}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon as={MaterialIcons} name="attach-money" size="sm" color="#EEE0C9" />
                      <Text style={[styles.amountText, globalStyles.text]}>Amount: ${summary.amount}</Text>
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
