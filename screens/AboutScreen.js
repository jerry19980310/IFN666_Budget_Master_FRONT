import React from 'react';
import { View, Text, TouchableOpacity, Linking, VStack, StyleSheet, ScrollView, Center, Box } from 'react-native';
import licensesData from '../licenses'; // Import your licenses.json file




export default function AboutPage() {

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
    <View>
     <Text>About Your App</Text>
      <View>
        {data.map((licence) => (

            <View style={styles.packageContainer} key={licence.packageName}>
              <Text style={styles.packageName}>{licence.packageName}</Text>
              <Text style={styles.label}>License:</Text>
              <Text>{licence.packageInfo.licenses}</Text>
              <Text style={styles.label}>License URL:</Text>
              <Link url={licence.packageInfo.licenseUrl} style={styles.link}>{licence.packageInfo.licenseUrl}</Link>
            </View>
            ))}
          </View>
    </View>
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



