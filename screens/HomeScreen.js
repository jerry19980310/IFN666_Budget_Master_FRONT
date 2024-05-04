import { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { GlobalLayout } from "../components/Layout";
import { GlobalStyles } from "../styles/global";
import { Box, Center, Heading, Image, AspectRatio, Stack, HStack, Container, Input, ScrollView, VStack } from "native-base";
import PieChart from 'react-native-pie-chart'

export default function HomeScreen() {
  const [articles, setArticles] = useState([]);
  const [headline, setHeadline] = useState("");
  const [money, setMoney] = useState(0);
  const globalStyles = GlobalStyles();

  const widthAndHeight = 250
  const series = [123, 321, 123, 789, 537]
  const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

  const setRandomHeadline = (articles) => {
    const randomIndex = Math.floor(Math.random() * articles.length);
    const randomArticle = articles[randomIndex];
    setHeadline(randomArticle.title);
  };

  const fetchArticles = async  () => {
    const API_KEY = process.env.EXPO_PUBLIC_NEWS_KEY;
    const newsURL = `https://newsapi.org/v2/top-headlines?country=au&apiKey=${API_KEY}`;

    const response = await fetch(newsURL);
    const data = await response.json();
    const articles = data.articles;

    setRandomHeadline(articles);
    setArticles(articles);
  };

  useEffect(() => {
    (async () => await fetchArticles())();
  }, []);

  return (
    <GlobalLayout>
      <Center>
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
        <Box>
        <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          >ABC</PieChart>
          <Text bold>Total: $ {money} AUD</Text>
        </Box>

        <ScrollView>
          <VStack space={4} alignItems="center">
            <Center w="64" h="20" bg="indigo.300" rounded="md" shadow={3} > Categort1 </Center>
            <Center w="64" h="20" bg="indigo.500" rounded="md" shadow={3} > Categort2 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Categort3 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Categort4 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Categort5 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Categort6 </Center>
            <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} > Categort7 </Center>
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