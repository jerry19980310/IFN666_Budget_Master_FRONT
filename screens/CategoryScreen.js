import { Text, Switch, View, StyleSheet,FlatList } from "react-native";
import { useState } from "react";
import { GlobalLayout } from "../components/Layout";
import { useTheme } from "../context/theme";
import { GlobalStyles } from "../styles/global";
import { FontAwesome5 } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';




export default function CategoryScreen() {
  const { isLargeText, setIsLargeText } = useTheme();
  const globalStyles = GlobalStyles();

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
  ];

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View
        style={{
          flex: 3,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text>{item.title}</Text>
        <View style={styles.iconsContainer}>
        <Icon
          size={25}
          color="#0096FF"
          name="square-edit-outline"
          onPress={() => handleUpdate(item)}
        />
        <Icon
          size={25}
          color="#D11A2A"
          name="delete"
          onPress={() => handleDelete(item.id)}
        />
      </View>
      </View>

    </View>
  );

  return (
    <GlobalLayout>
      <View style={styles.view}>
        <FlatList
                style={{marginTop: 5}}
                data={data}
                keyExtractor={item => item.id}
                renderItem={renderItem}
              />
      </View>
     
      <View>
     
      </View>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  
});