import { Text, Switch, View, StyleSheet } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { GlobalLayout } from "../components/Layout";
import { Box, Center, Heading, ScrollView, Stack, VStack, HStack, AspectRatio, Image, Button, Icon, IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

export default function CategoryScreen() {
  const [dataCategory, setDataCategories] = useState([]);
  const [isCreate, setIsCreate] = useState(false);

  const createCategory = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/api/category/create', {
        name: 'Testttt',
        user_id: '1'
      });
      console.log(response.data);
      fetchCategory();
      setIsCreate(false);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const category = await axios.get(`http://10.0.2.2:3000/api/category/1`);
      console.log("category.data: ", category.data);
      setDataCategories(category.data.categories);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("No image on that date. Please try again later.");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {

    if(isCreate === true){
      createCategory();
    }

  }, [isCreate]);


  return (
    <Center>
      {/* <Heading size="md">column</Heading> */}
      <ScrollView>
      {dataCategory.map((item) => (
        <VStack display="flex" key={item.id} mb="2.5" mt="1.5" direction="column" space={1}>
          <Center display="flex" size="16" w="300px" h="50px" bg="primary.400" rounded="md" _text={{
            color: 'warmGray.50',
            fontWeight: 'medium'
          }} shadow={'5'}>
            <HStack>
              <Text>{item.name}</Text>
              <IconButton icon={<Icon as={AntDesign} name="edit" size="sm" />} />
              <IconButton icon={<Icon as={AntDesign} name="delete" size="sm" />} />
            </HStack>
          </Center>
        </VStack>
      ))}
      <Button key={1} leftIcon={<Icon as={Ionicons} name="add-circle-outline" size="sm" />} onPress={() => setIsCreate(true) } >Create</Button>
      </ScrollView>
      
    </Center>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
});
