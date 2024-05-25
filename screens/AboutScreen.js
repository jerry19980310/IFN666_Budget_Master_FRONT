import React from 'react';
import { Text, Linking, StyleSheet } from 'react-native';
import licensesData from '../licenses';
import { GlobalStyles } from "../styles/global";
import { GlobalLayout } from "../components/Layout";
import { Center, ScrollView, VStack, HStack, Box, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {

  const globalStyles = GlobalStyles();
  const { t } = useTranslation();

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
      <HStack space={3} justifyContent="center" mb="2">
        <Center flex={1} px="2">
          <Text style={[globalStyles.heading]}>{t('budget_master')}</Text>
          <Text style={[globalStyles.text]}>{t('intro')}</Text>
        </Center>
      </HStack>
      <HStack space={3} justifyContent="center" mb="3">
        <Center flex={1} px="2" mt="3">
          <Text style={[globalStyles.heading]}>{t('open_licence')}</Text>
        </Center>

      </HStack>
      <ScrollView contentContainerStyle={styles.scrollContainer} >
        <VStack space={4} w="90%" maxW="400px" mx="auto" alignItems="center">
          {data.map((licence, index) => (
            <Box key={index} p="3" bg="#616161" rounded="md" shadow={2} mb={2} w="100%">
              <HStack justifyContent="space-between" alignItems="center">
                <VStack space={2} w="70%">
                  <HStack alignItems="center" space={2}>
                    <Icon as={MaterialCommunityIcons} name="license" size="md" color="#EEE0C9" />
                    <Text style={[globalStyles.text, styles.text]}>{licence.packageName}</Text>
                  </HStack>
                  <HStack alignItems="center" space={2}>
                    <Icon as={MaterialIcons} name="category" size="md" color="#EEE0C9" />
                    <Text style={[globalStyles.text, { color: '#f2f2b0' }]}>{licence.packageInfo.licenses}</Text>
                  </HStack>
                  <HStack alignItems="center" space={2}>
                    <Icon as={MaterialIcons} name="link" size="md" color="#EEE0C9" />
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
    color: '#2ca9e1',
    textDecorationLine: 'underline',
  },
  text: {
    color: '#f9f9f9',
  },
});