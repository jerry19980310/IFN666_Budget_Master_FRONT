import { Alert, VStack, HStack, Text } from "native-base";

const MyAlert = ({ title, description, variant, status }) => {


  return (

    <Alert status={status} variant={variant} w="100%">
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text fontSize="md" fontWeight="medium" flexShrink={1} color="darkText">
              {title}
            </Text>
          </HStack>
        </HStack>
        <Text px="6" color="darkText">
          {description}
        </Text>
      </VStack>
    </Alert>
  );

};

  export default MyAlert;