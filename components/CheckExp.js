import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Checkexp = async () => {
      const exp = await AsyncStorage.getItem('exp');
      if(exp < Date.now()){
        alert("Login expired, please login again");
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('exp');
        console.log("Token expired");
        return true;
      }
      console.log("Token is still valid");
      return false;
    };

export default Checkexp;

