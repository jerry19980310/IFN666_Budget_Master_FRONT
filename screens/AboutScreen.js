import React from 'react';
import { Text, Linking, StyleSheet} from 'react-native';
import licensesData from '../licenses'; // Import licenses.json file
import { GlobalStyles } from "../styles/global";
import { GlobalLayout } from "../components/Layout";
import { Center, ScrollView, VStack, HStack, Box, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';



export default function AboutPage() {

  const globalStyles = GlobalStyles();

  const Link = ({ url, style, children }) => (
    <Text
      style={style}
      numberOfLines={1}
      onPress={() => url && Linking.openURL(url)}>
      {children}
    </Text>
    );

    const data = Object.entries(licensesData).map(([packageName, packageInfo]) => ({
      packageName: packageName,
      packageInfo: packageInfo
    }));


  return (

<GlobalLayout>
      <HStack space={3} justifyContent="center" mb="4">
      <Center flex={1} px="3" mt="4">
        <Text>About Your App</Text>
      </Center>

      </HStack>

      

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <VStack space={4} w="90%" maxW="400px" mx="auto" alignItems="center">
        {data.map((licence, index) => (
              <Box key={index} p="4" bg="#96B6C5" rounded="md" shadow={2} mb={2} w="100%">
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack space={2} w="70%">
                    <HStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="date-range" size="sm" color="#EEE0C9" />
                      <Text style={[globalStyles.text]}>{licence.packageName}</Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="category" size="sm" color="#EEE0C9" />
                      <Text style={[globalStyles.text]}>{licence.packageInfo.licenses}</Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="attach-money" size="sm" color="#EEE0C9" />
                      <Link url={licence.packageInfo.licenseUrl} style={styles.link}>{licence.packageInfo.licenseUrl}</Link>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            ))
          }
        </VStack>
      </ScrollView>
    </GlobalLayout>

  );

};


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  packageContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});



