
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Box, Pressable } from 'native-base';

const UserIcon = ({ userName }) => {
    const [isPress, setIsPress] = useState(false);
    const initials = userName.charAt(0).toUpperCase();

    useEffect(() => {
        if (isPress) {
            
            setIsPress(false);
        }
    }, [isPress]);

    return (
        <Pressable onPress={() => { setIsPress(true)}}>
            <Box
                bg="primary.500"
                width={10}
                height={10}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
                mr={2}
            >
                <Text color="white" fontSize="2xl">
                    {initials}
                </Text>
            </Box>
        </Pressable>
    );
};

export default UserIcon;