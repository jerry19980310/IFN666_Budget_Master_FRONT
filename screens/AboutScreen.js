import React from 'react';
import { View, Text } from 'react-native';
import licensesData from '../licenses'; // Import your licenses.json file


const AboutPage = () => {
  return (
    <View>
      <Text>About Your App</Text>
      <View>
        <Text>List of Open Source Licenses:</Text>
        {/* Map through the licensesData array and display each license */}

      </View>
    </View>
  );
};

export default AboutPage;
