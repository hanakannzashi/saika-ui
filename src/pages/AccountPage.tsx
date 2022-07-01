import React from "react";
import {Box, VStack} from "@chakra-ui/react";
import {StorageUsage} from "../components/StorageUsage";

export const AccountPage: React.FC = () => {
  return (
    <VStack minHeight={650} justify={'center'}>
      <Box
        padding={5}
        backgroundColor={'whiteAlpha.800'}
        shadow={'base'}
        borderRadius={10}
      >
        <StorageUsage/>
      </Box>
    </VStack>
  )
}