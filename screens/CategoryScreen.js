import { Text, Switch, View, StyleSheet } from "react-native";
import { useState } from "react";
import { GlobalLayout } from "../components/Layout";
import { Box, Center, Heading, ScrollView, Stack, VStack, HStack, AspectRatio, Image, Button, Icon, IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';





export default function CategoryScreen() {


  const data_Category = [
    {
      id: '1',
      title: 'Transport',
    },
    {
      id: '2',
      title: 'Food',
    },
    {
      id: '3',
      title: 'Education',
    },
    {
      id: '4',
      title: 'Work out',
    },
  ];

    return (
      <Center>
        {/* <Heading size="md">column</Heading> */}
        {data_Category.map((item) => (
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
        <Button leftIcon={<Icon as={Ionicons} name="add-circle-outline" size="sm" />}>Create</Button>
      </Center>
        
    );
  }
  
  const styles = StyleSheet.create({
    view: {
      flexDirection: "row",
      alignItems: "center",
    },
  });