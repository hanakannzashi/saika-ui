import React from "react";
import {Box, Center, Text, VStack} from "@chakra-ui/react";

export const Footer: React.FC = () => {
  return (
    <Box>
      <VStack>
        <Text>
          GitHub:
        </Text>
        <Text>
          Email: zjchen1234@foxmail.com
        </Text>
      </VStack>
    </Box>
  )
}