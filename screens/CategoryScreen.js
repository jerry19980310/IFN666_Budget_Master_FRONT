import { Text, Switch, View, StyleSheet } from "react-native";
import { useState } from "react";
import { GlobalLayout } from "../components/Layout";
import { Box, Center, Heading, ScrollView, Stack, VStack, HStack, AspectRatio, Image, Button, Icon, IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';





export default function CategoryScreen() {


  const data = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
    {
      id: '68694a0f-3da1-471f-bd96-145571e29d72',
      title: 'four Item',
    },
  ];

    return (
      <Center>
        {/* <Heading size="md">column</Heading> */}
        {data.map((item) => (
          <VStack display="flex" key={item.id} mb="2.5" mt="1.5" direction="column" space={1}>
            <Center display="flex" size="16" w="300px" h="50px" bg="primary.400" rounded="md" _text={{
              color: 'warmGray.50',
              fontWeight: 'medium'
            }} shadow={'5'}>
              <HStack>
                <Text>{item.title}</Text>
                <IconButton icon={<Icon as={AntDesign} name="edit" size="sm" />} />
                <IconButton icon={<Icon as={AntDesign} name="delete" size="sm" />} />
              </HStack>
            </Center>

          </VStack>
        ))}
      </Center>
        
    );
  }
  
  const styles = StyleSheet.create({
    view: {
      flexDirection: "row",
      alignItems: "center",
    },
  });