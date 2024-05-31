import { Text, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Box, Center, HStack, ScrollView, VStack, Icon } from "native-base";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GlobalStyles } from "../styles/global";
import { GlobalLayout } from "../components/Layout";
import { fetchSummaryCategory } from "../functions/ApiController";
import { PieChart } from "react-native-chart-kit";

export default function SummaryScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  const { year, month } = route.params;
  const [datas, setDatas] = useState([]);
  const [queryyear, setQueryYear] = useState(year);
  const [querymonth, setQueryMonth] = useState(month);
  const [filterDatas, setFilterDatas] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pieData, setPieData] = useState([]);
  const globalStyles = GlobalStyles();

  const handleFilter = (dataList = datas) => {
    const filtered = dataList.filter(
      (summary) =>
        summary.year === Number(queryyear) &&
        summary.month === Number(querymonth)
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
    } finally {
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

  let pastelColors = [
    "#ffadad",
    "#ffadd6",
    "#ffadff",
    "#d6adff",
    "#adadff",
    "#add6ff",
    "#adffff",
    "#adffd6",
    "#adffad",
    "#d6ffad",
    "#ffffad",
    "#ffd6ad",
  ];

  let colorIndex = 0;

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  shuffleArray(pastelColors);

  const generateRandomPastelColor = () => {
    const color = pastelColors[colorIndex];
    colorIndex = (colorIndex + 1) % pastelColors.length;
    return color;
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
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
    return pieData;
  };

  return (
    <GlobalLayout>
      <Center>
        <HStack alignItems="center" space={3} justifyContent="space-between">
          <Icon
            as={MaterialIcons}
            name="calendar-month"
            size="lg"
            color="#b2cbe4"
          />
          <Text style={[styles.summaryText, globalStyles.text]}>
            {queryyear}-{querymonth.toString().padStart(2, "0")}
          </Text>
        </HStack>
      </Center>

      <VStack space={4} w="90%" maxW="400px" mx="auto">
        <PieChart
          data={pieData}
          width={Dimensions.get("window").width}
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
        <Text
          fontSize="2xl"
          bold
          style={[styles.summaryText, globalStyles.text]}
        >
          {t("total")}: $ {totalAmount} AUD
        </Text>
      </Center>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto">
          <VStack space={4} alignItems="center">
            {filterDatas.map((data, index) => (
              <Box
                key={index}
                w="100%"
                bg="#b2cbe4"
                p="4"
                rounded="md"
                shadow={1}
              >
                <HStack justifyContent="space-between">
                  <VStack space={2}>
                    <HStack alignItems="center">
                      <Icon
                        as={MaterialCommunityIcons}
                        name="tag-outline"
                        size="lg"
                        color="#EEE0C9"
                      />
                      <Text style={[styles.categoryText, globalStyles.text]}>
                        {t("category")}: {data.category}
                      </Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Icon
                        as={MaterialIcons}
                        name="attach-money"
                        size="lg"
                        color="#EEE0C9"
                      />
                      <Text style={[styles.amountText, globalStyles.text]}>
                        {t("amount")}: ${data.amount.toFixed(2)}
                      </Text>
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
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
