import AsyncStorage from "@react-native-async-storage/async-storage";

const Checkexp = async () => {
      const exp = await AsyncStorage.getItem('exp');
      console.log("exp: ", exp);
      if(exp < Date.now()){
        if(exp === null) { // If token is null, return true
          return true;
        }
        else{ // If token is expired, remove all the stored data and return true
          alert("Login expired, please login again");
          await AsyncStorage.removeItem('jwtToken');
          await AsyncStorage.removeItem('userId');
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('exp');
          console.log("Token expired");
          return true;
        }
        
      }
      // If token is not expired, return false
      return false;
    };

export default Checkexp;

