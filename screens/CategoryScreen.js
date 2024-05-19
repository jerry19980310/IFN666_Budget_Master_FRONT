import { Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { Center, ScrollView, VStack, HStack, Button, Icon, IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CategoryScreen() {
  const [dataCategory, setDataCategories] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [categoryID, setcategoryID] = useState(0);
  

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

  const deleteCategory = async () => {
    try {
      const response = await axios.delete(`http://10.0.2.2:3000/api/category/delete/${categoryID}`);
      console.log(response.data);
      fetchCategory();
      setIsDelete(false);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const updateCategory = async () => {
    console.log(categoryID);
    try {
      const response = await axios.put(`http://10.0.2.2:3000/api/category/modify/${categoryID}`, {
        name: 'Play'
      });
      console.log(response.data);
      fetchCategory();
      setIsModify(false);
    } catch (error) {
      console.error('Error puting data:', error);
    }
  };

  const fetchCategory = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const headers = {
      accept: "application/json",
      "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`
    }
    try {
      const category = await axios.get(`http://10.0.2.2:3000/api/category`, {headers});
      console.log("category.data: ", category.data.categories);
      setDataCategories(category.data.categories);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Cannot connent database. Please try again later.");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // useEffect(() => {

  //   if(isCreate === true){
  //     createCategory();
  //   }

  //   if(isModify === true){
  //     updateCategory();
  //   }

  //   if(isDelete === true){
  //     deleteCategory();
  //   }

  // }, [isCreate, isModify, isDelete]);



  return (
    <Center>
      {/* <Heading size="md">column</Heading> */}
      <ScrollView>
      {dataCategory.map((item) => (
        <VStack display="flex" key={item.ID} mb="2.5" mt="1.5" direction="column" space={1}>
          <Center display="flex" size="16" w="300px" h="50px" bg="primary.400" rounded="md" _text={{
            color: 'warmGray.50',
            fontWeight: 'medium'
          }} shadow={'5'}>
            <HStack>
              <Text>{item.name}</Text>
              <IconButton icon={<Icon as={AntDesign} name="edit" size="sm" />} onPress={() => { setcategoryID(item.ID); setIsModify(true); }} />
              <IconButton icon={<Icon as={AntDesign} name="delete" size="sm" />} onPress={() => { setcategoryID(item.ID); setIsDelete(true); }}/>
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
