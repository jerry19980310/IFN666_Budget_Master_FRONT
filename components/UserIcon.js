
import { Text } from 'react-native';
import { Box, Pressable, Actionsheet, useDisclose, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserIcon = ({ userName }) => {
    const initials = userName.charAt(0);
    const navigation = useNavigation();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('exp');
        navigation.navigate('Login');
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
                    bg="primary.500"
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
                        <Text fontSize="16" color="gray.500" _dark={{ color: 'gray.300' }}>
                            Hi, {userName}
                        </Text>
                    </Box>
                    <Actionsheet.Item onPress={handleLogout}>Logout</Actionsheet.Item>
                    <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </Center>
    );

};

export default UserIcon;
