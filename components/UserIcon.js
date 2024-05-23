
import { Text } from 'react-native';
import { Box, Pressable, Actionsheet, useDisclose, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/global';

const UserIcon = ({ userName }) => {
    const initials = userName.charAt(0);
    const navigation = useNavigation();
    const globalStyles = GlobalStyles();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('exp');
        navigation.navigate('Login');
    };

  const handleAbout = async () => {
    navigation.navigate('About');
  };

    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();

    return (
        <Center>
            <Pressable onPress={onOpen}>
                <Box
                    bg="#00587A"
                    width={10}
                    height={10}
                    borderRadius={20}
                    justifyContent="center"
                    alignItems="center"
                    mr={2}
                >
                    <Text style={{ color: 'white', fontSize: 24 }}>
                        {initials}
                    </Text>
                </Box>
            </Pressable>
            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator >
                <Actionsheet.Content borderTopRadius="0">
                    <Box w="100%" h={60} px={4} justifyContent="center">
                        <Text style={globalStyles.heading} color="gray.500" _dark={{ color: 'gray.300' }}>
                            Hi, {userName}
                        </Text>
                    </Box>
                    <Actionsheet.Item onPress={handleAbout}>About</Actionsheet.Item>
                    <Actionsheet.Item onPress={handleLogout}>Logout</Actionsheet.Item>
                    <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </Center>
    );

};

export default UserIcon;
